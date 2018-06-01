'use strict';

const BaseService = require('./base');

class NodeService extends BaseService {

  /**
   * 默认数据
   *
   * @return {object} 数据
   * @memberof NodeService
   */
  getDefault() {
    return {};
  }
  /**
   * 根节点验证，不存在则创建
   *
   * @memberof NodeService
   */
  async preCheck() {
    const hasSite = await this.columnExist('site_id');
    const where = { pid: -1 };
    if (hasSite) {
      where.site_id = this.ctx.site.id;
    }
    const root = await this.app.mysql.get(this._table, where);
    if (root === null) {
      const data = {
        ...this.getDefault(),
        lft: 1,
        rgt: 2,
        level: 0,
      };
      if (hasSite) {
        data.site_id = this.ctx.site.id;
      }

      await this.app.mysql.query(
        `INSERT INTO \`${this._table}\` (${Object.keys(data).map(i => `\`${i}\``).join(', ')}) VALUES (${Object.keys(data).map(() => '?').join(', ')}) ON DUPLICATE KEY UPDATE level=0`,
        Object.keys(data).map(key => data[key])
      );
    }
  }

  /**
   * 获取节点树
   * @param {int} pid 父id
   * @param {boolean} buildTree 构建树
   * @param {boolean} withMe 带上自己节点
   *
   * @return {array} 树
   */
  async index(pid = -1, buildTree = true, withMe = false) {
    await this.preCheck();
    const hasSite = await this.columnExist('site_id');
    const where = { is_del: 0 };
    if (pid > 0) {
      where.id = pid;
    } else {
      where.pid = pid;
      if (hasSite) {
        where.site_id = this.ctx.site.id;
      }
    }
    const parentNode = await this.app.mysql.get(this._table, where);
    if (parentNode === null) {
      this.error(`不存在的节点ID: ${pid}`);
    }

    let lt = '<';
    let gt = '>';

    if (withMe) {
      lt = '<=';
      gt = '>=';
    }

    const datas = await this.app.mysql.query(
      `SELECT * FROM ${this._table} WHERE lft ${gt} ? AND lft ${lt} ? AND is_del = 0 ${hasSite ? 'AND site_id = ' + this.ctx.site.id : ''} ORDER BY lft`,
      [ parentNode.lft, parentNode.rgt ]
    );

    if (!buildTree) {
      return datas;
    }

    return this.toTree(datas);


  }

  /**
   * 构建树
   *
   * @param {any} datas 数据
   * @return {any} 树
   * @memberof NodeService
   */
  toTree(datas) {
    const stack = [];
    const tree = [];
    for (const item of datas) {
      while (stack.length > 0 && !(stack[stack.length - 1].lft < item.lft && item.lft < stack[stack.length - 1].rgt)) { // 不是子节点，出栈
        stack.pop();
      }

      if (stack.length === 0) {
        tree.push(item);
        stack.push(item);
        continue;
      }

      if (!stack[stack.length - 1].children) {
        stack[stack.length - 1].children = [];
      }

      stack[stack.length - 1].children.push(item);
      stack.push(item);
    }

    return tree;

  }

  /**
   * 创建节点
   *
   * @param {any} data 基础数据
   * @param {number} [pid=1] 父id
   * @return {object} 处理结果
   * @memberof NodeService
   */
  async create(data, pid = -1) {
    await this.preCheck();
    const hasSite = await this.columnExist('site_id');

    const where = { is_del: 0 };
    if (pid > 0) {
      where.id = pid;
    } else {
      where.pid = pid;
      if (hasSite) {
        where.site_id = this.ctx.site.id;
      }
    }

    const parentNode = await this.app.mysql.get(this._table, where);

    if (parentNode === null) {
      this.error(`不存在的节点ID: ${pid}`);
    }

    pid = parentNode.id;

    await this.app.mysql.query(
      `UPDATE ${this._table} SET lft = lft + 2 where lft > ? ${hasSite ? 'AND site_id = ' + this.ctx.site.id : ''}`,
      [ parentNode.rgt ]
    );

    await this.app.mysql.query(
      `UPDATE ${this._table} SET rgt = rgt + 2 where rgt >= ? ${hasSite ? 'AND site_id = ' + this.ctx.site.id : ''}`,
      [ parentNode.rgt ]
    );

    return await this.app.mysql.insert(this._table, Object.assign(data, {
      lft: parentNode.rgt,
      rgt: parentNode.rgt + 1,
      level: parentNode.level + 1,
      pid: parentNode.id,
      is_del: 0,
    }, hasSite ? { site_id: this.ctx.site.id } : {}));

  }


  /**
   * 删除节点（含子节点）
   *
   * @param {any} id 节点id
   * @return {object} 处理结果
   * @memberof NodeService
   */
  async destroy(id) {
    await this.preCheck();
    const hasSite = await this.columnExist('site_id');

    // 删除子元素以及自身
    const currentNode = await this.app.mysql.get(this._table, { id, is_del: 0 });

    if (currentNode === null) {
      this.error(`不存在的节点ID: ${id}`);
    }

    if (currentNode.pid === -1) {
      this.error('根节点不允许删除');
    }

    const result = await this.app.mysql.query(
      `UPDATE ${this._table} SET is_del = 1 WHERE lft >= ? AND rgt <= ? ${hasSite ? 'AND site_id = ' + this.ctx.site.id : ''}`,
      [ currentNode.lft, currentNode.rgt ]
    );

    if (result.affectedRows > 0) {
      // 修改其他节点的左右值
      const value = currentNode.rgt - currentNode.lft + 1;
      await this.app.mysql.query(
        `UPDATE ${this._table} SET lft = lft - ? WHERE lft > ? AND is_del = 0 ${hasSite ? 'AND site_id = ' + this.ctx.site.id : ''}`,
        [ value, currentNode.lft ]
      );
      await this.app.mysql.query(
        `UPDATE ${this._table} SET rgt = rgt - ? WHERE rgt > ? AND is_del = 0 ${hasSite ? 'AND site_id = ' + this.ctx.site.id : ''}`,
        [ value, currentNode.rgt ]
      );
    }

    return result;
  }

  /**
   * 更新数据
   *
   * @param {int} id 数据id
   * @param {any} data 数据内容
   * @return {object} 处理结果
   * @memberof BaseService
   */
  async update(id, data) {
    await this.preCheck();
    const hasSite = await this.columnExist('site_id');
    const currentNode = await this.app.mysql.get(this._table, { id, is_del: 0 });

    if (currentNode === null) {
      this.error(`不存在的节点ID: ${id}`);
    }

    // 如果修改了父id，进行移动
    if (this.ctx.helper.hasOwnPro(data, 'pid') && Number(data.pid) !== Number(currentNode.pid)) {
      const pid = data.pid;
      await this.move(id, pid);
    }

    delete data.lft;
    delete data.rgt;
    delete data.level;
    delete data.pid;
    delete data.is_del;

    if (hasSite) {
      delete data.site_id;
    }

    if (Object.keys(data).length > 0) {
      return await this.app.mysql.update(this._table, data, {
        where: {
          id,
        },
      });
    }

    return {};

  }

  /**
   * 移动节点
   *
   * @param {any} currentID 移动节点的id
   * @param {any} parentID 移动到父id
   * @return {object} 处理结果
   * @memberof NodeService
   */
  async move(currentID, parentID) {
    await this.preCheck();
    const hasSite = await this.columnExist('site_id');
    const currentNode = await this.app.mysql.get(this._table, { id: currentID, is_del: 0 });

    const where = { is_del: 0 };
    if (parentID > 0) {
      where.id = parentID;
    } else {
      where.pid = parentID;
      if (hasSite) {
        where.site_id = this.ctx.site.id;
      }
    }

    const parentNode = await this.app.mysql.get(this._table, where);

    if (currentNode === null) {
      this.error(`不存在的节点ID: ${currentID}`);
    }
    if (parentNode === null) {
      this.error(`不存在的节点ID: ${parentID}`);
    }

    if (currentNode.lft < parentNode.lft && parentNode.lft < currentNode.rgt) {
      this.error('不能将自己移动到自己的子节点上');
    }

    const value = currentNode.rgt - currentNode.lft;
    const ids = [];
    const currentNodeWithChild = await this.app.mysql.query(
      `SELECT * FROM ${this._table} WHERE lft >= ? AND lft <= ? AND is_del = 0 ${hasSite ? 'AND site_id = ' + this.ctx.site.id : ''}`,
      [ currentNode.lft, currentNode.rgt ]
    );
    for (const iterator of currentNodeWithChild) {
      ids.push(iterator.id);
    }

    let updateLeftSQL = 'SELECT 1';
    let updateRightSQL = 'SELECT 1';
    let updateSelfSQL = 'SELECT 1';
    if (parentNode.rgt > currentNode.rgt) {
      updateLeftSQL = `UPDATE ${this._table} SET lft = lft - ${value} - 1 WHERE lft > ${currentNode.rgt} AND rgt <= ${parentNode.rgt} AND is_del = 0 ${hasSite ? 'AND site_id = ' + this.ctx.site.id : ''}`;
      updateRightSQL = `UPDATE ${this._table} SET rgt = rgt - ${value} - 1 WHERE rgt > ${currentNode.rgt} AND rgt < ${parentNode.rgt} AND is_del = 0 ${hasSite ? 'AND site_id = ' + this.ctx.site.id : ''}`;
      if (ids.length > 0) {
        const tmpValue = parentNode.rgt - currentNode.rgt - 1;
        const tempLevel = (parentNode.level + 1) - currentNode.level;
        updateSelfSQL = `UPDATE ${this._table} SET lft = lft + ${tmpValue},rgt = rgt + ${tmpValue},level = level + ${tempLevel} WHERE id IN(${ids.join(',')}) AND is_del = 0 ${hasSite ? 'AND site_id = ' + this.ctx.site.id : ''}`;
      }
    } else {
      updateLeftSQL = `UPDATE ${this._table} SET lft = lft + ${value} + 1 WHERE lft > ${parentNode.rgt} AND lft < ${currentNode.lft} AND is_del = 0 ${hasSite ? 'AND site_id = ' + this.ctx.site.id : ''}`;
      updateRightSQL = `UPDATE ${this._table} SET rgt = rgt + ${value} + 1 WHERE rgt >= ${parentNode.rgt} AND rgt < ${currentNode.lft} AND is_del = 0 ${hasSite ? 'AND site_id = ' + this.ctx.site.id : ''}`;
      if (ids.length > 0) {
        const tmpValue = currentNode.lft - parentNode.rgt;
        const tempLevel = (parentNode.level + 1) - currentNode.level;
        updateSelfSQL = `UPDATE ${this._table} SET lft = lft - ${tmpValue},rgt = rgt - ${tmpValue},level = level + ${tempLevel} WHERE id IN(${ids.join(',')}) AND is_del = 0 ${hasSite ? 'AND site_id = ' + this.ctx.site.id : ''}`;
      }
    }

    // 更新pid
    await this.app.mysql.update(this._table, {
      pid: parentNode.id,
    }, {
      where: {
        id: currentID,
      },
    });

    await this.app.mysql.query(updateLeftSQL);
    await this.app.mysql.query(updateRightSQL);
    return await this.app.mysql.query(updateSelfSQL);
  }


  /**
   * 上移节点
   *
   * @param {any} id 节点id
   * @return {object} 操作结果
   * @memberof NodeService
   */
  async moveUp(id) {
    await this.preCheck();
    const hasSite = await this.columnExist('site_id');
    const currentNode = await this.app.mysql.get(this._table, { id, is_del: 0 });

    if (currentNode === null) {
      this.error(`不存在的节点ID: ${id}`);
    }

    const preWhere = { rgt: currentNode.lft - 1, is_del: 0 };
    if (hasSite) {
      preWhere.site_id = this.ctx.site.id;
    }

    const preNode = await this.app.mysql.get(this._table, preWhere);

    if (preNode === null) {
      this.error('该节点不能上移动了');
    }

    const valueAdd = currentNode.rgt - preNode.rgt;
    const valueMinus = currentNode.lft - preNode.lft;

    const plusIds = [];
    const minusIds = [];

    const plusDatas = await this.app.mysql.query(`SELECT id FROM ${this._table} WHERE lft >= ? AND rgt <= ? AND is_del = 0 ${hasSite ? 'AND site_id = ' + this.ctx.site.id : ''}`, [ preNode.lft, preNode.rgt ]);
    const minusDatas = await this.app.mysql.query(`SELECT id FROM ${this._table} WHERE lft >= ? AND rgt <= ? AND is_del = 0 ${hasSite ? 'AND site_id = ' + this.ctx.site.id : ''}`, [ currentNode.lft, currentNode.rgt ]);

    for (const iterator of plusDatas) {
      plusIds.push(iterator.id);
    }

    if (plusIds.length > 0) {
      await this.app.mysql.query(`UPDATE ${this._table} SET lft = lft + ?,rgt = rgt + ? WHERE id IN (?)`, [ valueAdd, valueAdd, plusIds ]);
    }


    for (const iterator of minusDatas) {
      minusIds.push(iterator.id);
    }

    if (minusIds.length > 0) {
      await this.app.mysql.query(`UPDATE ${this._table} SET lft = lft - ?,rgt = rgt - ? WHERE id IN (?)`, [ valueMinus, valueMinus, minusIds ]);
    }

    return {};
  }


  /**
   * 下一节点
   *
   * @param {any} id 节点id
   * @return {object} 操作结果
   * @memberof NodeSe rvice
   */
  async moveDown(id) {
    await this.preCheck();
    const hasSite = await this.columnExist('site_id');
    const currentNode = await this.app.mysql.get(this._table, { id, is_del: 0 });

    if (currentNode === null) {
      this.error(`不存在的节点ID: ${id}`);
    }

    const nextWhere = { lft: currentNode.rgt + 1, is_del: 0 };
    if (hasSite) {
      nextWhere.site_id = this.ctx.site.id;
    }

    const nextNode = await this.app.mysql.get(this._table, nextWhere);

    if (nextNode === null) {
      this.error('该节点不能上移动了');
    }

    const valueAdd = nextNode.rgt - currentNode.rgt;
    const valueMinus = nextNode.lft - currentNode.lft;

    const plusIds = [];
    const minusIds = [];

    const plusDatas = await this.app.mysql.query(`SELECT id FROM ${this._table} WHERE lft >= ? AND rgt <= ? AND is_del = 0 ${hasSite ? 'AND site_id = ' + this.ctx.site.id : ''}`, [ currentNode.lft, currentNode.rgt ]);
    const minusDatas = await this.app.mysql.query(`SELECT id FROM ${this._table} WHERE lft >= ? AND rgt <= ? AND is_del = 0 ${hasSite ? 'AND site_id = ' + this.ctx.site.id : ''}`, [ nextNode.lft, nextNode.rgt ]);

    for (const iterator of plusDatas) {
      plusIds.push(iterator.id);
    }

    if (plusIds.length > 0) {
      await this.app.mysql.query(`UPDATE ${this._table} SET lft = lft + ?,rgt = rgt + ? WHERE id IN (?)`, [ valueAdd, valueAdd, plusIds ]);
    }


    for (const iterator of minusDatas) {
      minusIds.push(iterator.id);
    }

    if (minusIds.length > 0) {
      await this.app.mysql.query(`UPDATE ${this._table} SET lft = lft - ?,rgt = rgt - ? WHERE id IN (?)`, [ valueMinus, valueMinus, minusIds ]);
    }

    return {};
  }

}

module.exports = NodeService;
