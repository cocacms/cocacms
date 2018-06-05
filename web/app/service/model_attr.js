'use strict';

const Service = require('./base');
const momnet = require('moment');

class ModelAttrService extends Service {

  constructor(ctx) {
    super(ctx);
    this._table = 'model_attribute';
    this.index_key_name = 'auto_index_key';
    this.index_fulltext_name = 'auto_index_fulltext';
  }

  /**
   * 设置操作的表名称
   *
   * @param {any} model_id 模型id
   * @memberof ModelAttrService
   */
  async model(model_id) {
    this._modelId = model_id;
    const model = await this.app.mysql.get('model', { id: model_id });
    if (model === null) {
      this.error('模型不存在');
    }
    await this.modelName(model.key);
  }

  async modelName(name) {
    this._modelName = `${this.config.model.prefix}${name}`;
  }

  /**
   * 检查表是否存在
   *
   * @param {boolean} [create=true] 不存在是否创建表
   * @return {boolean} 是否存在
   * @memberof ModelAttrService
   */
  async tablePreCheck(create = true) {
    const exist = await this.app.mysql.query('SHOW TABLES LIKE ?', [ this._modelName ]);
    if (exist.length === 0 && create === true) {
      await this.app.mysql.query(`CREATE TABLE IF NOT EXISTS \`${this._modelName}\` (
        \`id\` INT(11) NOT NULL AUTO_INCREMENT,
        \`site_id\` INT(11) NOT NULL,
        \`category_id\` INT(11) NULL DEFAULT NULL,
        PRIMARY KEY (\`id\`),
        INDEX \`${this.index_key_name}\` (\`site_id\`, \`category_id\`)
      )
      ENGINE=InnoDB`, [ this._modelName ]);
    }

    return exist.length > 0;
  }

  /**
   * 类型转数据库类型
   *
   * @param {any} type 类型
   * @param {any} len 长度
   * @return {string} 数据库类型
   * @memberof ModelAttrService
   */
  translateType(type, len) {

    /**
     * 单行文本 varchar
     * 多行文本 text
     * 单选 radio
     * 选择框 select
     * 多选 checkbox
     * 时间选择器 time
     * 日期选择器 date
     * 日期时间选择器 datetime
     * 图片 img
     * 文件 file
     * 富文本 richtext
     * 评分 rate
     * 开关 switch
     */

    switch (type) {
      case 'text':
      case 'time':
      case 'date':
      case 'datetime':
        return type.toUpperCase();
      case 'img':
      case 'file':
      case 'richtext':
        return 'LONGTEXT';
      case 'rate':
      case 'switch':
        return `TINYINT(${len})`;
      default:
        return `VARCHAR(${len})`;
    }

  }

  /**
   * 默认值处理
   *
   * @param {any} type 类型
   * @param {any} value 默认值
   * @param {any} values 插入数据
   * @return {any} 处理结果
   * @memberof ModelAttrService
   */
  translateDefault(type, value, values) {
    if (!value) {
      return '';
    }

    switch (type) {
      case 'text':
      case 'img':
      case 'file':
      case 'richtext':
        return '';
      case 'datetime':
        if (value === 'NOW') {
          return 'DEFAULT CURRENT_TIMESTAMP';
        }

        if (value === 'ONNOW') {
          return 'DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP';
        }

        values.push(value);
        return 'DEFAULT ?';
      default:
        values.push(value);
        return 'DEFAULT ?';
    }
  }

  translateError(error) {
    if (error.message.indexOf('Invalid default value') >= 0) {
      return this.error('默认值格式有误');
    }

    if (error.message.indexOf('Incorrect time value') >= 0) {
      return this.error('默认值格式有误（格式为HH:mm:ss  如 23:59:59）');
    }

    if (error.message.indexOf('ER_KEY_COLUMN_DOES_NOT_EXITS') >= 0) {
      return this.error('关键字不存在');
    }

    if (error.message.indexOf('ER_CANT_DROP_FIELD_OR_KEY') >= 0) {
      return this.error('索引不存在');
    }

    if (error.message.indexOf('ER_DUP_FIELDNAME') >= 0) {
      return this.error('关键字已经存在了');
    }

    this.error(error);
  }

  /**
   * 创建列
   *
   * @param {any} data 属性
   * @return {any} 处理结果
   * @memberof ModelAttrService
   */
  async create(data) {
    await this.tablePreCheck();
    if (data.rules) {
      data.rules = JSON.stringify(data.rules);
    }

    const values = [];
    const tableColumAddSql = [];
    tableColumAddSql.push(`ADD COLUMN \`${data.key}\``); // 列名称
    tableColumAddSql.push(this.translateType(data.type, data.len)); // 列类型
    tableColumAddSql.push(data.required ? 'NOT NULL' : 'NULL'); // 必填
    tableColumAddSql.push(this.translateDefault(data.type, data.default, values)); // 默认值
    tableColumAddSql.push('COMMENT ?'); // 备注
    values.push(data.name);
    try {
      await this.app.mysql.query(`ALTER TABLE \`${this._modelName}\` ${tableColumAddSql.join(' ')}`, values);
      return await this.app.mysql.insert(this._table, data);
    } catch (error) {
      this.translateError(error);
    }
  }


  /**
   * 修改列
   *
   * @param {any} id id
   * @param {any} data 属性
   * @return {any} 处理结果
   * @memberof ModelAttrService
   */
  async update(id, data) {
    await this.tablePreCheck();
    const clonum = await this.show(id);
    if (clonum === null) {
      this.error('列不存在');
    }

    if (data.rules) {
      data.rules = JSON.stringify(data.rules);
    }
    const exist = await this.columnExist(clonum.key, this._modelName);
    if (!exist) {
      this.error('表中不存在该列，请检查数据表结构');
    }

    const values = [];
    const tableColumAddSql = [];
    tableColumAddSql.push(`CHANGE COLUMN \`${clonum.key}\` \`${data.key}\``); // 列名称
    tableColumAddSql.push(this.translateType(data.type, data.len)); // 列类型
    tableColumAddSql.push(data.required ? 'NOT NULL' : 'NULL'); // 必填
    tableColumAddSql.push(this.translateDefault(data.type, data.default, values)); // 默认值
    tableColumAddSql.push('COMMENT ?'); // 备注
    values.push(data.name);
    try {
      await this.app.mysql.query(`ALTER TABLE \`${this._modelName}\` ${tableColumAddSql.join(' ')}`, values);
      return await this.app.mysql.update(this._table, data, { where: { id } });
    } catch (error) {
      this.translateError(error);
    }
  }

  /**
   * 删除列
   *
   * @param {any} id 列id
   * @return {any} 处理结果
   * @memberof ModelAttrService
   */
  async destroy(id) {
    await this.tablePreCheck();
    const clonum = await this.show(id);
    if (clonum === null) {
      this.error('列不存在');
    }
    await this.app.mysql.delete(this._table, { id });
    return await this.app.mysql.query(`ALTER TABLE \`${this._modelName}\` DROP COLUMN \`${clonum.key}\``);

  }

  /**
   * 调整数据表的索引
   *
   * @param {any} keys 索引字段
   * @param {string} [keyType='key'] 索引类型 key普通索引，fulltext全文检索
   * @return {any} 处理结果
   * @memberof ModelAttrService
   */
  async adjustIndex(keys, keyType = 'key') {
    await this.tablePreCheck();
    if (keyType === 'key') {
      keys.unshift('site_id', 'category_id');
    }

    keys = keys.map(i => `\`${i}\``);
    keys = Array.from(new Set(keys)); // 去重

    const index_name = keyType === 'key' ? this.index_key_name : this.index_fulltext_name;
    const fulltext = keyType === 'key' ? '' : 'FULLTEXT';
    const ngram = keyType === 'key' ? '' : 'WITH PARSER ngram';
    const dropSql = await this.buildDropSql(index_name);
    try {
      return await this.app.mysql.query(`ALTER TABLE \`${this._modelName}\` ${dropSql} ADD ${fulltext} INDEX \`${index_name}\` (${keys.join(', ')}) ${ngram}`);
    } catch (error) {
      this.translateError(error);
    }

  }


  /**
   * 查询索引是否存在
   *
   * @param {any} name 索引名称
   * @return {boolean} 是否存在
   * @memberof ModelAttrService
   */
  async buildDropSql(name) {
    const data = await this.app.mysql.query(`SHOW INDEX FROM \`${this._modelName}\``);
    return data.filter(i => i.Key_name === name).length > 0 ? `DROP INDEX \`${name}\`,` : '';
  }


  /**
   * 获取索引
   *
   * @return {any} 索引结果
   * @memberof ModelAttrService
   */
  async indexs() {
    await this.tablePreCheck();
    const data = await this.app.mysql.query(`SHOW INDEX FROM \`${this._modelName}\``);
    const keys = data.filter(i => i.Key_name === this.index_key_name).map(i => i.Column_name);
    const fulltexts = data.filter(i => i.Key_name === this.index_fulltext_name).map(i => i.Column_name);

    return {
      keys,
      fulltexts,
    };
  }

  /**
   * 将表设为可回收
   *
   * @return {object} 处理结果
   * @memberof ModelAttrService
   */
  async retrieve() {
    return await this.app.mysql.query(`RENAME TABLE \`${this._modelName}\` TO \`${this._modelName}_bp_${momnet().format('YYMMDDHHmmss')}\``);
  }

  /**
   * 参数转数组
   *
   * @param {any} options 参数
   * @return {array} 结果
   * @memberof ModelAttrService
   */
  options2array(options) {
    if (typeof options !== 'string') {
      return [];
    }
    const optionsArray = [];
    const lines = options.split(/[\n\r]/);
    for (const line of lines) {
      const lineData = line.split('=');
      if (lineData.length >= 2) {
        optionsArray.push({
          label: String(lineData[1]),
          value: String(lineData[0]),
        });
      }
    }

    return optionsArray;
  }
}

module.exports = ModelAttrService;
