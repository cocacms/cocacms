'use strict';

const Controller = require('./base');
/**
 * 模型参数管理
 *
 * @class Model_attrController
 * @extends {Controller}
 */
class ModelAttrController extends Controller {
  /**
   * 表单验证
   *
   * @return {object} 表单信息
   * @memberof ModelAttrController
   */
  async validate() {
    const body = await this.ctx.validate({
      key: [
        { required: true, message: '请设置字段关键字' },
        { pattern: this.ctx.re.name, message: '字段关键字只能是字母、数字、_' },
      ],
      name: [{ required: true, message: '请设置字段名称' }],
      required: [{ required: true, message: '请设置是否必填 ' }],
      tableable: [{ required: true, message: '请设置是否显示在列表 ' }],
      type: [{ required: true, message: '请设置字段类型' }],
      len: [
        { required: true, message: '请设置字段长度' },
        {
          pattern: /^(([1-9][0-9]*)|(([1-9][0-9]*),([1-9][0-9]*)))$/,
          message: '请设置为%d或%d,%d格式',
        },
      ],
      rules: [
        { required: false, type: 'array', message: '验证规则必须为数组' },
      ],
      sort: [{ required: false, type: 'integer', message: '排序必须为数字' }],
    });

    await this.ctx.validate(
      {
        model: [
          { required: true, message: '请设置模型id' },
          { pattern: this.ctx.re.intStr, message: '模型id只能是数字' },
        ],
      },
      this.ctx.params
    );

    body.model_id = this.ctx.params.model;

    const optionsArray = this.service.modelAttr.options2array(body.options);

    await this.ctx.validate(
      {
        optionsArray: [
          {
            type: 'array',
            defaultField: {
              type: 'object',
              fields: {
                value: {
                  pattern: this.ctx.re.name,
                  message: '选项参数的key只能是字母、数字、_',
                },
              },
            },
          },
        ],
      },
      {
        optionsArray,
      }
    );

    return body;
  }

  /**
   * 获取参数列表
   *
   * @memberof ModelAttrController
   */
  async index() {
    await this.service.modelAttr.model(this.ctx.params.model);
    await this.service.modelAttr.tablePreCheck();
    this.ctx.body = await this.service.modelAttr.getAttrByModalId(
      this.ctx.params.model
    );
  }

  /**
   * 获取表索引
   *
   * @memberof ModelAttrController
   */
  async indexs() {
    await this.service.modelAttr.model(this.ctx.params.model);
    this.ctx.body = await this.service.modelAttr.indexs();
  }

  /**
   * 创建一列
   *
   * @memberof ModelAttrController
   */
  async create() {
    const body = await this.validate();
    await this.service.modelAttr.model(this.ctx.params.model);
    this.ctx.body = await this.service.modelAttr.create(body);
  }

  /**
   * 更新一列
   *
   * @memberof ModelAttrController
   */
  async update() {
    const body = await this.validate();
    await this.service.modelAttr.model(this.ctx.params.model);
    this.ctx.body = await this.service.modelAttr.update(
      this.ctx.params.id,
      body
    );
  }

  /**
   * 删除一列
   *
   * @memberof ModelAttrController
   */
  async destroy() {
    await this.service.modelAttr.model(this.ctx.params.model);
    this.ctx.body = await this.service.modelAttr.destroy(this.ctx.params.id);
  }

  /**
   * 调整索引
   *
   * @memberof ModelAttrController
   */
  async adjustIndex() {
    const body = await this.ctx.validate({
      keys: [
        {
          required: true,
          type: 'array',
          message: '请设置关键字',
          defaultField: {
            required: true,
            pattern: this.ctx.re.name,
            message: '关键字只能是字母、数字、_',
          },
        },
      ],
      keyType: { required: true, message: '请设置索引类型' },
    });

    await this.service.modelAttr.model(this.ctx.params.model);
    this.ctx.body = await this.service.modelAttr.adjustIndex(
      body.keys,
      body.keyType
    );
  }
}

module.exports = ModelAttrController;
