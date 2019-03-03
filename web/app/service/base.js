'use strict';

const Service = require('@cocacms/cocacms').Service;
const moment = require('moment');

const TABLE = Symbol('Service#table');

class BaseService extends Service {
  /**
   * 抛出异常
   *
   * @param {any} msg 异常信息
   * @memberof BaseService
   */
  error(msg) {
    this.ctx.error(msg);
  }

  get _table() {
    if (!this[TABLE]) {
      this.error('没有设置表名');
    }
    return this[TABLE];
  }

  set _table(value) {
    if (!this.ctx.re.name.test(value)) {
      this.error('非法字段table');
    }
    this[TABLE] = value;
  }

  /**
   * 获取数据列表
   *
   * @param {number} [page=1] 页码
   * @param {number} [pageSize=20] 页数
   * @param {any} [searchs=[]] 搜索条件
   * @param {string} [fields='*'] 获取字段
   * @param {string} [order=[]] 获取排序
   * @param {boolean} [withPage=true] 是否分页
   * @return {object} 分页数据
   * @memberof BaseService
   */
  async index(
    page = 1,
    pageSize = 20,
    searchs = [],
    fields = '*',
    order = [],
    withPage = true
  ) {
    page = Number(page);
    pageSize = Number(pageSize);
    let wheres = ['1 = 1'];
    let values = [];
    let orders = [];

    if (!/^[a-zA-Z0-9_\*,]*$/.test(fields)) {
      this.error('非法字段fields');
    }

    const isSoftRemove = await this.columnExist('is_del');
    if (isSoftRemove) {
      wheres.push('is_del = 0');
    }

    const hasSite = await this.columnExist('site_id');
    if (hasSite) {
      wheres.push('site_id = ?');
      values.push(this.ctx.site.id);
    }

    ({ wheres, values, orders } = this.ctx.whereBuilder(
      searchs,
      order,
      wheres,
      values,
      orders
    ));

    if (orders.length === 0) {
      orders.push('`id` ASC'); // 默认按id
    }

    if (this.app.config.env === 'local') {
      this.app.logger.debug(
        '[cocacms] sql  : %s',
        `SELECT ${fields} FROM ${this._table} WHERE ${wheres.join(
          ' AND '
        )} ORDER BY ${orders.join(', ')} ${withPage ? 'LIMIT ?,?' : ''}`
      );
      this.app.logger.debug('[cocacms] value: %j', values);
    }

    let data = await this.app.mysql.query(
      `SELECT ${fields} FROM ${this._table} WHERE ${wheres.join(
        ' AND '
      )} ORDER BY ${orders.join(', ')} ${withPage ? 'LIMIT ?,?' : ''}`,
      [...values, (page - 1) * pageSize, pageSize]
    );

    data = await this.fillData(data);

    if (!withPage) {
      return data;
    }

    const total = await this.app.mysql.query(
      `SELECT count(*) as c FROM ${this._table} WHERE ${wheres.join(' AND ')}`,
      [...values]
    );

    return this.ctx.helper.pager(data, page, pageSize, total[0].c);
  }

  /**
   * 获取数据详情
   * @param {int} id 数据id
   * @return {object} 处理结果
   * @memberof BaseService
   */
  async show(id) {
    const data = await this.app.mysql.get(this._table, { id });
    return await this.fillData(data, false);
  }

  /**
   * 根据条件获取单条数据
   *
   * @param {any} [searchs=[]] 搜索条件
   * @param {string} [fields='*'] 字段
   * @param {string} [order=[]] 获取排序
   * @return {object} 数据
   * @memberof BaseService
   */
  async single(searchs = [], fields = '*', order = []) {
    let wheres = ['1 = 1'];
    let values = [];
    let orders = [];

    if (!/^[a-zA-Z0-9_\*,]*$/.test(fields)) {
      this.error('非法字段fields');
    }

    const isSoftRemove = await this.columnExist('is_del');
    if (isSoftRemove) {
      wheres.push('is_del = 0');
    }

    const hasSite = await this.columnExist('site_id');
    if (hasSite) {
      wheres.push('site_id = ?');
      values.push(this.ctx.site.id);
    }

    ({ wheres, values, orders } = this.ctx.whereBuilder(
      searchs,
      order,
      wheres,
      values,
      orders
    ));

    if (orders.length === 0) {
      orders.push('`id` ASC'); // 默认按id
    }

    const data = await this.app.mysql.query(
      `SELECT ${fields} FROM ${this._table} WHERE ${wheres.join(
        ' AND '
      )} ORDER BY ${orders.join(', ')} LIMIT 1`,
      values
    );

    if (data.length > 0) {
      return await this.fillData(data[0], false);
    }

    return null;
  }

  /**
   * 创建数据
   *
   * @param {any} data 数据内容
   * @return {object} 处理结果
   * @memberof BaseService
   */
  async create(data) {
    const hasSite = await this.columnExist('site_id');
    if (hasSite) {
      data.site_id = this.ctx.site.id;
    }
    return await this.app.mysql.insert(this._table, data);
  }

  /**
   * 更新数据
   *
   * @param {any} data 数据内容
   * @return {object} 处理结果
   * @memberof BaseService
   */
  async update(data) {
    if (data.site_id) {
      delete data.site_id;
    }
    return await this.app.mysql.update(this._table, data);
  }

  /**
   * 删除数据
   *
   * @param {any} id 数据id
   * @return {object} 处理结果
   * @memberof BaseService
   */
  async destroy(id) {
    const isSoftRemove = await this.columnExist('is_del');
    if (isSoftRemove) {
      return await this.app.mysql.update(this._table, {
        id,
        is_del: 1,
      });
    }

    return await this.app.mysql.delete(this._table, { id });
  }

  /**
   * 列是否存在
   *
   * @param {any} fieldName 列名称
   * @param {any} [_table=false] 表名称
   * @return {boolean} 是否存在
   * @memberof BaseService
   */
  async columnExist(fieldName, _table = false) {
    const has = await this.app.mysql.query(
      'select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = ? and COLUMN_NAME = ? and TABLE_SCHEMA = ?',
      [
        _table ? _table : this._table,
        fieldName,
        this.config.mysql.client.database,
      ]
    );
    return has.length > 0;
  }

  /**
   * 数据数量
   *
   * @return {int} 数量
   * @memberof BaseService
   */
  async count() {
    const hasSite = await this.columnExist('site_id');
    return await this.app.mysql.count(
      this._table,
      hasSite ? { site_id: this.ctx.site.id } : {}
    );
  }

  /**
   * 获取字段
   *
   * @return {array} 字段
   * @memberof BaseService
   */
  async getColumn() {
    const model = await this.app.mysql.get('model', {
      key: this._table.replace(this.config.model.prefix, ''),
    });
    if (model === null) {
      this.error('模型不存在');
    }

    return await this.app.mysql.select('model_attribute', {
      where: { model_id: model.id },
    });
  }

  /**
   * 获取验证规则
   *
   * @param {boolean} [isFront=false] 是否传输到前端
   * @return {object} 验证规则
   * @memberof BaseService
   */
  async getValidateRules(isFront = false) {
    const columns = await this.getColumn();
    const rules = {};

    for (const column of columns) {
      let rule = [];
      if (column.required === 1) {
        rule.push({ required: true, message: `请设置${column.name}` });
      }

      if (!isFront) {
        // 时间格式的验证
        const toValidateTime = {
          time: 'HH:mm:ss',
          date: 'YYYY-MM-DD',
          datetime: 'YYYY-MM-DD HH:mm:ss',
        };

        // 时间类型的验证
        for (const key in toValidateTime) {
          if (toValidateTime.hasOwnProperty(key)) {
            const format = toValidateTime[key];
            if (column.type === key) {
              rule.push({
                required: column.required === 1,
                validator(rule, value, callback) {
                  const errors = [];
                  if (
                    value &&
                    !moment(value, [moment.ISO_8601, format]).isValid()
                  ) {
                    errors.push(`${column.name}的时间格式不正确`);
                  }
                  callback(errors);
                },
              });
            }
          }
        }

        // 数组转化
        for (const key of ['img', 'file']) {
          if (column.type === key) {
            rule.push({
              transform(value) {
                // 数据 格式化
                return JSON.stringify(value);
              },
            });
          }
        }

        // checkbox 合并成
        if (column.type === 'checkbox') {
          rule.push({
            transform(value) {
              // 数据 格式化
              if (!Array.isArray(value)) {
                value = [value];
              }
              return value.join(',');
            },
          });
        }

        // 时间
        if (['date', 'datetime', 'time'].includes(column.type)) {
          const format = toValidateTime[column.type];
          rule.push({
            transform(value) {
              // 数据 格式化
              return moment(value, [
                moment.ISO_8601,
                'YYYY-MM-DD HH:mm:ss',
                'YYYY-MM-DD',
                'HH:mm:ss',
              ]).format(format);
            },
          });
        }
      }

      try {
        const others = JSON.parse(column.rules);
        if (others && others.length > 0) {
          if (!isFront) {
            for (const other of others) {
              // 实例化正则对象
              if (this.helper.hasOwnPro(other, 'pattern')) {
                if (this.helper.hasOwnPro(this.ctx.re, other.pattern)) {
                  // 判断内置正则
                  other.pattern = this.ctx.re[other.pattern];
                } else {
                  other.pattern = new RegExp(other.pattern);
                }
              }
            }
          }
          rule = [...rule, ...others];
        }
      } catch (error) {
        // in fact, do noting...
      }

      if (rule.length > 0) {
        rules[column.key] = rule;
      }
    }

    return rules;
  }

  /**
   * 处理数据
   *
   * @param {any} data 待处理数据
   * @param {boolean} [isArray=true] 是否为数组数据
   * @return {any} 处理结果
   * @memberof BaseService
   */
  async fillData(data, isArray = true) {
    // 自动化表才需要进一步处理
    if (this._table.indexOf(this.config.model.prefix) !== 0) {
      return data;
    }

    let columns = await this.getColumn();
    columns = columns.filter(
      i => i.type === 'img' || i.type === 'file' || i.type === 'checkbox'
    );
    if (columns.length === 0) {
      return data;
    }

    if (!isArray) {
      data = [data];
    }

    data = data.map(i => {
      for (const column of columns) {
        if (Object.prototype.hasOwnProperty.call(i, column.key)) {
          if (column.type === 'checkbox') {
            i[column.key] = i[column.key].split(',');
          } else {
            try {
              i[column.key] = JSON.parse(i[column.key]);
              if (!i[column.key]) {
                i[column.key] = [];
              }
            } catch (error) {
              i[column.key] = [];
            }
          }
        }
      }
      return i;
    });

    return isArray ? data : data[0];
  }

  /**
   * 一对一
   *
   * @param {any} data 原表
   * @param {any} relation 目标表
   * @param {string} [primaryKey='id'] 原表主键
   * @param {any} [relationKey=null] 目标表外键
   * @param {any} [rename=null] 重命名
   * @return {any} 处理结果
   * @memberof BaseService
   */
  async one2one(
    data,
    relation,
    primaryKey = 'id',
    relationKey = null,
    rename = null
  ) {
    if (!relationKey) {
      relationKey = `${relation}_id`;
    }
    if (!rename) {
      rename = relation;
    }
    const primaryKeys = [];
    for (const iterator of data) {
      primaryKeys.push(iterator[primaryKey]);
    }

    if (primaryKeys.length === 0) {
      return data;
    }
    const where = {};
    where[relationKey] = primaryKeys;
    const relationData = await this.app.mysql.select(relation, { where });

    for (const iterator of data) {
      for (const relationIterator of relationData) {
        if (iterator[primaryKey] === relationIterator[relationKey]) {
          iterator[rename] = relationIterator;
          break;
        }
      }
    }

    return data;
  }

  /**
   * 一对多
   *
   * @param {any} data 原表
   * @param {any} relation 目标表
   * @param {string} [primaryKey='id'] 原表主键
   * @param {any} [relationKey=null] 目标表外键
   * @return {any} 处理结果
   * @memberof BaseService
   */
  async one2many(data, relation, primaryKey = 'id', relationKey = null) {
    if (!relationKey) {
      relationKey = `${this._table}_id`;
    }

    const primaryKeys = [];
    const tempMap = {};

    for (const iterator of data) {
      primaryKeys.push(iterator[primaryKey]);
      if (!iterator[`${relation}s`]) {
        iterator[`${relation}s`] = [];
      }
      tempMap[String(iterator[primaryKey])] = iterator;
    }

    if (primaryKeys.length === 0) {
      return data;
    }

    const where = {};
    where[relationKey] = primaryKeys;
    const relationData = await this.app.mysql.select(relation, { where });

    for (const iterator of data) {
      for (const relationIterator of relationData) {
        if (iterator[primaryKey] === relationIterator[relationKey]) {
          tempMap[String(iterator[primaryKey])][`${relation}s`].push(
            relationIterator
          );
        }
      }
    }

    return data;
  }

  /**
   * 多对一
   *
   * @param {any} data 原表
   * @param {any} relation 目标表
   * @param {string} [primaryKey='id'] 原表主键
   * @param {any} [relationKey=null] 目标表外键
   * @return {any} 处理结果
   * @memberof BaseService
   */
  async many2one(data, relation, primaryKey = null, relationKey = 'id') {
    if (!primaryKey) {
      primaryKey = `${relation}_id`;
    }
    return await this.one2one(data, relation, primaryKey, relationKey);
  }

  /**
   * 多对多
   *
   * @param {any} data 原表
   * @param {any} relation 目标表
   * @param {any} [map=null] 中间表，默认是{原表表名_目标数据表名}
   * @param {any} [mapFromKey=null] 中间表 原表主键
   * @param {any} [mapToKey=null] 中间表目标数据主键
   * @param {string} [primaryKey='id'] 原表主键
   * @param {string} [relationKey='id'] 目标表主键
   * @return {array} 返回数据
   * @memberof BaseService
   */
  async many2many(
    data,
    relation,
    map = null,
    mapFromKey = null,
    mapToKey = null,
    primaryKey = 'id',
    relationKey = 'id'
  ) {
    if (!map) {
      map = `${this._table}_${relation}`;
    }

    if (!mapFromKey) {
      mapFromKey = `${this._table}_id`;
    }

    if (!mapToKey) {
      mapFromKey = `${relation}_id`;
    }

    const primaryKeys = [];
    const tempMap = {};

    for (const iterator of data) {
      primaryKeys.push(iterator[primaryKey]);
      if (!iterator[`${relation}s`]) {
        iterator[`${relation}s`] = [];
      }
      tempMap[String(iterator[primaryKey])] = iterator;
    }

    if (primaryKeys.length === 0) {
      return data;
    }

    const where = {};
    where[mapFromKey] = primaryKeys;

    const tempData = await this.app.mysql.select(map, { where });

    const targetKeys = [];

    for (const iterator of tempData) {
      targetKeys.push(iterator[mapToKey]);
    }

    if (targetKeys.length === 0) {
      return data;
    }

    const targetWhere = {};
    targetWhere[relationKey] = targetKeys;
    const relationData = await this.app.mysql.select(relation, { targetWhere });

    for (const iterator of tempData) {
      for (const relationIterator of relationData) {
        if (iterator[mapToKey] === relationIterator[relationKey]) {
          tempMap[String(iterator[mapFromKey])][`${relation}s`].push(
            relationIterator
          );
          break;
        }
      }
    }

    return data;
  }
}

module.exports = BaseService;
