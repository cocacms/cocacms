'use strict';

const Service = require('./base');

class RoleService extends Service {
  constructor(ctx) {
    super(ctx);
    this._table = 'role';
  }

  async award(uid, rid) {
    return await this.app.mysql.insert('admin_role', {
      uid, rid,
    });
  }

  async undo(uid, rid) {
    return await this.app.mysql.delete('admin_role', {
      uid, rid,
    });
  }
}

module.exports = RoleService;
