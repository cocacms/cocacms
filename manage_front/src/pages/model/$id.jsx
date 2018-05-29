import React, { Component } from 'react';
import {
  Table, Form, Row, Col, Button, Input, Modal, Checkbox, InputNumber, Select, Divider, Spin, Tooltip, Icon, Tag
} from 'antd';
import name from 'components/name';
import Action from 'components/action';
import Can from 'components/can/index';
import { connect } from 'dva';

const labelCol = { span: 5 }
const wrapperCol = { span: 15 }

@Form.create()
class Edit extends Component {
  state = {  }
  onOk = () => {
    const { form, action } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      try {
        fieldsValue.rules = JSON.parse(fieldsValue.rules);
      } catch (error) {

      }
      this.props[action](fieldsValue, form.resetFields);
    });
  }

  render() {
    const { action, opened, data = {}, close, form: { getFieldDecorator } } = this.props;


    return (
      <Modal
        title={ action === 'add' ? '添加': '编辑' }
        visible={opened}
        onCancel={close}
        onOk={this.onOk}
        width="50%"
        style={{ top: '10vh' }}
        bodyStyle={{ maxHeight: '68vh', overflowY: 'auto'}}
      >
        <Form>
          {getFieldDecorator('id', {
            initialValue: data.id
          })(
            <Input type="hidden"/>
          )}

          <Form.Item
            labelCol={labelCol}
            wrapperCol={wrapperCol}
            label="关键字"
            extra="设置后不可修改"
          >
            {getFieldDecorator('key', {
              initialValue: data.key,
              rules: [{ required: action === 'add', message: '请设置关键字' }],
            })(
              <Input disabled={action !== 'add'}/>
            )}
          </Form.Item>


          <Form.Item
            labelCol={labelCol}
            wrapperCol={wrapperCol}
            label="字段名称"
          >
            {getFieldDecorator('name', {
              initialValue: data.name,
              rules: [{ required: true, message: '请设置字段名称' }],
            })(
              <Input/>
            )}
          </Form.Item>

          <Form.Item
            labelCol={labelCol}
            wrapperCol={wrapperCol}
            label="字段类型"
          >
            {getFieldDecorator('type', {
              initialValue: data.type,
              rules: [{ required: true, message: '请设置字段类型' }],
            })(
              <Select placeholder="请选择">
                <Select.Option value="varchar">单行文本</Select.Option>
                <Select.Option value="text">多行文本</Select.Option>
                <Select.Option value="radio">单选</Select.Option>
                <Select.Option value="select">选择框</Select.Option>
                <Select.Option value="checkbox">多选</Select.Option>
                <Select.Option value="time">时间选择器</Select.Option>
                <Select.Option value="date">日期选择器</Select.Option>
                <Select.Option value="datetime">日期时间选择器</Select.Option>
                <Select.Option value="img">图片</Select.Option>
                <Select.Option value="file">文件</Select.Option>
                <Select.Option value="richtext">富文本</Select.Option>
                <Select.Option value="rate">评分</Select.Option>
              </Select>
            )}
          </Form.Item>

          <Form.Item
            labelCol={labelCol}
            wrapperCol={wrapperCol}
            label="长度"
          >
            {getFieldDecorator('len', {
              initialValue: data.len,
              rules: [{ required: true, message: '请设置字段长度' }],
            })(
              <InputNumber />
            )}
          </Form.Item>

          <Form.Item
            labelCol={labelCol}
            wrapperCol={wrapperCol}
            label="是否必填"
          >
            {getFieldDecorator('required', {
              initialValue: data.required === 1,
              valuePropName: 'checked',
            })(
              <Checkbox />
            )}
          </Form.Item>

          <Form.Item
            labelCol={labelCol}
            wrapperCol={wrapperCol}
            label="显示在列表"
          >
            {getFieldDecorator('tableable', {
              initialValue: data.tableable === 1,
              valuePropName: 'checked',
            })(
              <Checkbox />
            )}
          </Form.Item>

          <Form.Item
            labelCol={labelCol}
            wrapperCol={wrapperCol}
            label="列表可排序"
          >
            {getFieldDecorator('sortable', {
              initialValue: data.sortable === 1,
              valuePropName: 'checked',
            })(
              <Checkbox />
            )}
          </Form.Item>

          <Form.Item
            labelCol={labelCol}
            wrapperCol={wrapperCol}
            label={<span>
              默认值
              <Tooltip title="字段类型为“日期时间选择器”时，若默认值设为NOW或ONNOW时，则代表记录插入或更新的时间">
                <Icon type="info-circle" style={{ fontSize: 10, marginLeft: 5 }} />
              </Tooltip>
            </span>}
          >
            {getFieldDecorator('default', {
              initialValue: data.default,
            })(
              <Input/>
            )}
          </Form.Item>

          <Form.Item
            labelCol={labelCol}
            wrapperCol={wrapperCol}
            label="选项参数"
            extra="格式为key=name 如：man=男 (一行一个参数)"
          >
            {getFieldDecorator('options', {
              initialValue: data.options,
            })(
              <Input.TextArea />
            )}
          </Form.Item>

          <Form.Item
            labelCol={labelCol}
            wrapperCol={wrapperCol}
            label="验证规则"
            extra={<span>JSON数组文本[JSON.stringify()]，参考<a href="https://github.com/yiminghe/async-validator" target="_black">这里</a></span>}
          >
            {getFieldDecorator('rules', {
              initialValue: data.rules,
              rules: [{
                validator(rule, value, callback) {
                  const errors = [];
                  if (value !== undefined) {
                    try {
                      JSON.parse(value)
                    } catch (error) {
                      errors.push('请输入JSON数组文本格式')
                    }
                  }
                  callback(errors);
                },
                required: false,
              }]
            })(
              <Input.TextArea />
            )}
          </Form.Item>

          <Form.Item
            labelCol={labelCol}
            wrapperCol={wrapperCol}
            label="显示顺序"
            extra="从小到大排序"
          >
            {getFieldDecorator('sort', {
              initialValue: data.sort,
            })(
              <InputNumber />
            )}
          </Form.Item>

        </Form>

      </Modal>

    );
  }
}

@connect(({ modelAttr, loading }) => ({ modelAttr, loading: loading.models.modelAttr }))
class KeyEdit extends Component {
  state = {
    keys: [],
    fulltexts: [],
  }

  componentDidMount() {
    const { dispatch, id } =this.props;
    dispatch({
      type: 'modelAttr/fetchIndexs',
      payload: id,
    })

  }

  static getDerivedStateFromProps(props) {
    const { modelAttr: { indexs: { keys = [], fulltexts = [] } = {}} = {}, loading } = props;
    if (loading) {
      return {};
    }
    return { keys, fulltexts };
  }

  change = (value, key) => {
    const state = {};
    state[`${key}s`] = value;
    this.setState(state);
  }

  save = (key) => {
    const keys = this.state[`${key}s`];
    const { dispatch, id } =this.props;
    dispatch({
      type: 'modelAttr/adjustIndexs',
      payload: {
        id,
        data: {
          keys,
          keyType: key,
        }
      },
    })
  }

  render() {
    const { opened, close, data = [], loading } = this.props;
    return (
      <Modal
        visible={opened}
        onCancel={close}
        title="调整索引"
        footer={<Button onClick={close}>关闭</Button>}
      >
        <Spin spinning={loading}>
          <Form>
          <Form.Item
              wrapperCol={{ span: 15, offset: 5 }}
              label=""
            >
              <Tag color="red">* 修改索引相当于重建索引，这可能会消耗较长的时间</Tag>
            </Form.Item>

            <Form.Item
              labelCol={labelCol}
              wrapperCol={wrapperCol}
              label="普通索引"
            >
              <Select
                placeholder="请选择"
                mode="multiple"
                onChange={(value) => { this.change(value, 'key')}}
                value={this.state.keys}
              >
                <Select.Option value='site_id'> 站点id[内置] </Select.Option>
                <Select.Option value='category_id'> 栏目id[内置] </Select.Option>
                { data.map(i => {
                  if (!['text', 'richtext', 'checkbox', 'img', 'file', 'time'].includes(i.type)) {
                    return <Select.Option value={i.key} key={i.key}> {i.name} </Select.Option>
                  }
                  return null;
                }) }
              </Select>

            </Form.Item>

            <Form.Item
              wrapperCol={{ span: 15, offset: 5 }}
              label=""
            >
              <Button type="primary" onClick={() => { this.save('key')}}>保存索引</Button>

            </Form.Item>


            <Form.Item
              labelCol={labelCol}
              wrapperCol={wrapperCol}
              label="全文搜索"
            >
              <Select
                placeholder="请选择"
                mode="multiple"
                onChange={(value) => { this.change(value, 'fulltext')}}
                value={this.state.fulltexts}
              >
                { data.map(i => {
                  if (!['radio', 'select', 'time', 'date', 'datetime', 'rate', 'img', 'file'].includes(i.type)) {
                    return <Select.Option value={i.key} key={i.key}> {i.name} </Select.Option>
                  }
                  return null;
                }) }
              </Select>

            </Form.Item>

            <Form.Item
              wrapperCol={{ span: 15, offset: 5 }}
              label=""
            >
              <Button type="primary" onClick={() => { this.save('fulltext')}}>保存全文搜索</Button>

            </Form.Item>

          </Form>
        </Spin>


      </Modal>

    );
  }
}


@connect(({ modelAttr, loading }) => ({ modelAttr, loading: loading.models.modelAttr }))
@Form.create()
@name('模型字段管理')
class ModelPage extends Component {
  state = {
    expand: false,
    edit: {
      action: 'add',
      data: {},
      opened: false,
    },

    keyEdit: {
      opened: false,
    }
  }

  componentDidMount() {
    const { dispatch, match: { params = {}} = {} } = this.props;
    dispatch({
      type: 'modelAttr/save',
      payload: {
        _tag: `/${params.id}`,
      }
    })
    this.init()
  }

  /**
   * 初始化获取数据
   *
   * @memberof ModelPage
   */
  init = () => {
    const { dispatch, form } = this.props;
    form.resetFields();
    dispatch({
      type: 'modelAttr/list',
    })
  }

  add = (data, reset) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'modelAttr/add',
      payload: data,
      cb: () => { this.closeModel(); reset(); }
    })
  }

  edit = (data, reset) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'modelAttr/edit',
      payload: data,
      cb: () => { this.closeModel(); reset(); }
    })
  }

  delete = (id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'modelAttr/del',
      payload: id,
    })
  }

  /**
   * 获取搜索表单DOm
   *
   * @memberof ModelPage
   */
  renderFilter = () => {
    return (
      <div>
        <Form
          className="table-search-form"
          onSubmit={this.handleSearch}
        >
          <Row>
            <Col span={24} style={{ textAlign: 'right'}}>
              <Can api="GET@/api/modelAttr/:model/indexs">
              <Button icon="tag-o" type="dashed" onClick={() => { this.openKeyModel() }}>
                索引管理
              </Button>
              <Divider type="vertical"/>
              </Can>
              <Can api="POST@/api/modelAttr/:model">
              <Button type="primary" onClick={() => { this.openModel('add', {}) }}>
                创建
              </Button>
              </Can>
              <Can api="GET@/api/modelAttr/:model">
              <Button onClick={this.init} className="refresh-btn">
                刷新
              </Button>
              </Can>

            </Col>
          </Row>
        </Form>

      </div>

    )
  }

  /**
   * 开启编辑框
   *
   * @memberof ModelPage
   */
  openModel = (action, record) => {
    this.setState({ edit: { action, opened: true, data: record }})
  }

  openKeyModel = () => {
    const { modelAttr: { list = [] } } = this.props;
    this.setState({ keyEdit: {opened: true, key: Math.random(), data: list }});
  }

  /**
   * 关闭编辑框
   *
   * @memberof ModelPage
   */
  closeModel = () => {
    this.setState({ edit: { ...this.state.edit, opened: false }})
  }

  closeKeyModel = () => {
    this.setState({ keyEdit: { ...this.state.keyEdit, opened: false }})
  }

  /**
   * 字段定义
   *
   * @memberof ModelPage
   */
  getColumns = () => ([
    {
      dataIndex: 'id',
      width: 100,
      title: 'ID',
    },
    {
      dataIndex: 'key',
      title: '关键字',
    },
    {
      dataIndex: 'name',
      title: '字段名称',
    },
    {
      dataIndex: 'type',
      title: '类型',
      render: text => {
        switch (text) {
          case 'varchar':
            return '单行文本';
          case 'text':
            return '多行文本';
          case 'radio':
            return '单选';
          case 'select':
            return '选择框';
          case 'checkbox':
            return '多选';
          case 'time':
            return '时间选择器';
          case 'date':
            return '日期选择器';
          case 'datetime':
            return '日期时间选择器';
          case 'img':
            return '图片';
          case 'file':
            return '文件';
          case 'richtext':
            return '富文本';
          case 'rate':
            return '评分';
          default:
            return '-';
        }
      }
    },
    {
      dataIndex: 'required',
      title: '是否必填',
      render: text => {
        return text === 1 ? '是' : '否';
      }
    },
    {
      dataIndex: 'tableable',
      title: '列表显示',
      render: text => {
        return text === 1 ? '是' : '否';
      }
    },
    {
      dataIndex: 'default',
      title: '默认值'
    },
    {
      dataIndex: 'len',
      title: '长度'
    },
    {
      title: '操作',
      width: 180,
      align: 'center',
      render: (text, record) => {
        return (
          <Action
            can={{ edit: 'PUT@/api/modelAttr/:model/:id', delete: 'DELETE@/api/modelAttr/:model/:id'}}
            delete={() => { this.delete(record.id) }}
            edit={() => { this.openModel('edit', record) }}
          >
          </Action>
        )

      }
    }
  ])

  render() {
    const { loading, modelAttr: { list = [] }, match: { params = {}} = {} } = this.props;
    return (
      <Can api="GET@/api/modelAttr/:model" cannot={null}>

        <Table
          title={this.renderFilter}
          columns={this.getColumns()}
          loading={loading}
          rowKey='id'
          dataSource={list}
          scroll={{ x: 980 }}
          pagination={false}
        >
        </Table>

        <Edit
          {...this.state.edit}
          key={String(this.state.edit.data.id)}
          close={this.closeModel}
          add={this.add}
          edit={this.edit}
        />

        <KeyEdit
          id={params.id}
          {...this.state.keyEdit}
          close={this.closeKeyModel}
        />
      </Can>

    );
  }
}

export default ModelPage;
