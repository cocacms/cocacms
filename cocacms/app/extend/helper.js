'use strict';
const uuidv4 = require('uuid/v4');
const crypto = require('crypto');
const moment = require('moment');


/**
 * check obj has property
 *
 * @param {object} obj object
 * @param {string} key property name
 * @return {boolean} has
 */
exports.hasOwnPro = (obj, key) => {
  return Object.prototype.hasOwnProperty.call(obj, key);
};

/**
 * build unique id
 *
 * @return {string} uuid
 */
exports.UUID = () => {
  return uuidv4().replace(/-/g, '');
};

/**
 * md5
 *
 * @param {string} value string
 * @return {string} md5
 */
exports.md5 = value => {
  const md5 = crypto.createHash('md5');
  return md5.update(value).digest('hex');
};

/**
 * build page data
 *
 * @param {array} data data
 * @param {int} page page
 * @param {int} pageSize pageSize
 * @param {int} total total
 * @return {array} page data
 */
exports.pager = (data, page, pageSize, total) => {
  const pageCount = Math.ceil(total / pageSize);
  return {
    data,
    page,
    pageSize,
    total,
    pageCount,
    pre: page - 1 < 1 ? null : page - 1,
    next: page + 1 > pageCount ? null : page + 1,
  };
};


exports.date = (date, format = 'YYYY-MM-DD HH:mm:ss') => {
  return moment(date, [ moment.ISO_8601, 'YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD', 'HH:mm:ss' ]).format(format);
};
