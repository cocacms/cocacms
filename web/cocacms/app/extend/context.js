'use strict';
const UID = Symbol('Context#uid');
const SITE = Symbol('Context#site');

module.exports = {
  /**
   * regular expression
   */
  get re() {
    return {
      name: /^[a-zA-Z0-9_]*$/,
      intStr: /^([1-9][0-9]*)$/,
      numberStr: /^\d+(\.\d+)?$/,
      priceStr: /(^[1-9]([0-9]{0,7})?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/,
      tel: /^1[3|4|5|6|7|8|9][0-9]{9}$/,
      dateStr: /^((?:19|20)\d\d)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/,
      identityStr: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
      mail: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,

    };
  },

  /**
   * 用户id
   */

  get uid() {
    if (!this[UID]) {
      this.throw(401, '请先登录');
    }
    return this[UID];
  },

  set uid(value) {
    this[UID] = value;
  },


  /**
   * 站点
   */
  get site() {
    if (!this[SITE]) {
      this.throw(500, '站点不存在');
    }

    return this[SITE];
  },

  set site(value) {
    this[SITE] = value;
  },

  isLogin() {
    if (!this[UID]) {
      return false;
    }
    return true;
  },
  /**
   * 构建where
   *
   * @param {any} query 输入
   * @param {any} order 输入排序
   * @param {any} [wheres=[]] 基础条件
   * @param {any} [values=[]] 基础条件值
   * @param {any} [orders=[]] 基础排序值
   * @return {object} 构建结果
   */
  whereBuilder(query = [], order = [], wheres = [], values = [], orders = []) {
    if (typeof query === 'string') {
      try {
        query = JSON.parse(query);
      } catch (error) {
        query = [];
      }
    }

    if (typeof order === 'string') {
      try {
        order = JSON.parse(order);
      } catch (error) {
        order = [];
      }
    }

    // 规定条件类型
    const allowSearchCondition = [ '=', '!=', '<>', '>=', '>', '<', '<=', 'is null', 'is not null', 'like', 'in', 'match', 'between' ];

    if (Array.isArray(query) && query.length > 0) {
      for (let search of query) {
        if (Array.isArray(search)) {
          const _search = {};
          _search.key = search[0];

          // ['id' , '=', 1]
          if (search.length === 3) {
            _search.condition = search[1];
            _search.value = search[2];
          }

          // ['id', 1]
          if (search.length === 2) {
            _search.value = search[1];
          }

          search = _search;
        }

        if (typeof search !== 'object') {
          continue;
        }

        if (!search.condition) {
          search.condition = '=';
        }

        // 非字符 key和条件直接跳过
        if (typeof search.key !== 'string' || typeof search.condition !== 'string') {
          continue;
        }

        // 清首位空格
        if (typeof search.value === 'string') {
          search.value = search.value.trim();
        }

        search.key = search.key.trim();
        search.condition = search.condition.trim();

        if (allowSearchCondition.includes(search.condition.toLowerCase())) { // 规定条件类型，防止sql注入\
          // 中文检索 key value 必须为string
          if (
            search.condition === 'match' &&
            Object.prototype.hasOwnProperty.call(search, 'key') &&
            Object.prototype.hasOwnProperty.call(search, 'value') &&
            typeof search.value === 'string' &&
            search.value
          ) {
            let keys = search.key.split(',');
            keys = keys.filter(i => this.re.name.test(i.trim())); // 正则防止sql注入
            if (keys.length > 0) {
              keys = keys.map(i => `\`${i.trim()}\``);
              wheres.push(`MATCH (${keys.join(', ')}) AGAINST (? IN BOOLEAN MODE)`);
              values.push(search.value);
              continue;
            }
          }

          if (!this.re.name.test(search.key.trim())) { // 正则防止sql注入
            continue;
          }

          search.key = `\`${search.key}\``;

          // 值是数组，转为数组
          if (search.value && Array.isArray(search.value) && search.value.length > 0) {
            if (search.condition === 'between') {
              wheres.push(`(${search.key} BETWEEN ? AND ?)`);
              values.push(search.value[0]);
              values.push(search.value[1]);
            } else {
              if (search.condition === '=') {
                search.condition = 'in';
              }
              wheres.push(`${search.key} ${search.condition.toUpperCase()} (?)`);
              values.push(search.value);
            }

            continue;
          }

          // 空判断 is null, is not null
          if ([ 'is null', 'is not null' ].includes(search.condition.toLowerCase())) {
            wheres.push(`${search.key} ${search.condition.toUpperCase()}`);
            continue;
          }

          // 常规表达式
          wheres.push(`${search.key} ${search.condition.toUpperCase()} ?`);
          values.push(search.value);
        }
      }
    }

    if (Array.isArray(order) && order.length > 0) {
      for (const iterator of order) {
        if (Array.isArray(iterator) && iterator.length > 0 && this.re.name.test(iterator[0])) { // 正则防止sql注入
          if (iterator.length >= 2 && [ 'asc', 'desc' ].includes(iterator[1].toLowerCase())) { // 规定条件类型，防止sql注入
            orders.push(`\`${iterator[0]}\` ${iterator[1].toUpperCase()}`);
          } else if (iterator.length === 1) { // 默认是ASC
            orders.push(`\`${iterator[0]}\` ASC`);
          }
        }
      }

    }

    return { wheres, values, orders };
  },

  /**
   * 抛出异常
   *
   * @param {any} msg 异常信息
   * @memberof BaseService
   */
  error(msg) {
    throw new (this.app.exception.runnerExection)(msg);
  },

};
