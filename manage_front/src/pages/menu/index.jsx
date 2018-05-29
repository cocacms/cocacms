import React, { Component } from 'react';
import {
  Table, Form, Row, Col, Button, Input, Modal, Select, TreeSelect
} from 'antd';
import name from 'components/name';
import Action from 'components/action';
import Can from 'components/can/index';
import { connect } from 'dva';

@Form.create()
@connect(({ menu, category, loading }) => ({ menu, category, loading: loading.models.menu }))
class Edit extends Component {
  state = {
    type: null,
  }
  componentDidMount() {
    const { dispatch } =this.props;
    dispatch({
      type: 'menu/tree',
      payload: {}
    })

    dispatch({
      type: 'category/tree',
      payload: {}
    })

  }



  onOk = () => {
    const { form, action } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.props[action](fieldsValue, form.resetFields);
    });
  }

  render() {
    const { action, opened, data = {}, close, form: { getFieldDecorator }, menu: { tree = [] }, category: { tree: ctree = [] } } = this.props;
    const labelCol = { span: 5 }
    const wrapperCol = { span: 15 }
    if (this.state.type === null && data.type) {
      this.setState({
        type: data.type,
      })
    }
    return (
      <Modal
        title={ action === 'add' ? '添加': '编辑' }
        visible={opened}
        onCancel={close}
        onOk={this.onOk}
      >
        <Form>
          {getFieldDecorator('id', {
            initialValue: data.id
          })(
            <Input type="hidden" disabled/>
          )}

          <Form.Item
            labelCol={labelCol}
            wrapperCol={wrapperCol}
            label="父菜单"
          >
            {getFieldDecorator('pid', {
              initialValue: data.pid === undefined ? undefined: String(data.pid),
              rules: [{ required: true, message: '请设置菜单父菜单' }],
            })(
              <TreeSelect
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeData={tree}
                treeNodeLabelProp="name"
                treeNodeFilterProp="id"
                placeholder="请选择"
                treeDefaultExpandAll
              />
            )}
          </Form.Item>

          <Form.Item
            labelCol={labelCol}
            wrapperCol={wrapperCol}
            label="菜单名称"
          >
            {getFieldDecorator('name', {
              initialValue: data.name,
              rules: [{ required: true, message: '请设置菜单名称' }],
            })(
              <Input/>
            )}
          </Form.Item>

          <Form.Item
            labelCol={labelCol}
            wrapperCol={wrapperCol}
            label="菜单类型"
          >
            {getFieldDecorator('type', {
              initialValue: data.type,
              rules: [{ required: true, message: '请设置菜单类型' }],
              getValueFromEvent: (e) => {
                this.setState({
                  type: e,
                })

                return e;
              }
            })(
              <Select placeholder="请选择">
                <Select.Option value={1}>绑定栏目</Select.Option>
                <Select.Option value={2}>普通URL链接</Select.Option>
              </Select>
            )}
          </Form.Item>
          {
            this.state.type === 1 ?
          <Form.Item
            labelCol={labelCol}
            wrapperCol={wrapperCol}
            label="绑定栏目"
          >
            {getFieldDecorator('category_id', {
              initialValue: data.category_id === undefined ? undefined: String(data.category_id),
              rules: [{ required: true, message: '请设置菜单绑定栏目' }],
            })(
              <TreeSelect
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeData={ctree}
                treeNodeLabelProp="name"
                treeNodeFilterProp="id"
                placeholder="请选择"
                treeDefaultExpandAll
              />
            )}
          </Form.Item> : null
          }

          {
            this.state.type === 2 ?
          <Form.Item
            labelCol={labelCol}
            wrapperCol={wrapperCol}
            label="URL链接"
          >
            {getFieldDecorator('url', {
              rules: [{ required: true, message: '请设置菜单URL链接' }],
              initialValue: data.url,
            })(
              <Input/>
            )}
          </Form.Item> : null
          }

        </Form>

      </Modal>

    );
  }
}


@connect(({ menu, loading }) => ({ menu, loading }))
@Form.create()
@name('菜单管理')
class menuPage extends Component {
  state = {
    expand: false,
    edit: {
      action: 'add',
      data: {},
      key: 1,
      opened: false,
    }
  }

  componentDidMount() {
    this.init()
  }

  /**
   * 初始化获取数据
   *
   * @memberof menuPage
   */
  init = () => {
    const { dispatch, form } = this.props;
    form.resetFields();
    dispatch({
      type: 'menu/list',
      payload: {}
    })
    dispatch({
      type: 'menu/fetchProps',
      payload: {}
    })
  }

  add = (data, reset) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/add',
      payload: {
        data,
        pid: Number(data.pid),
      },
      cb: () => { this.closeModel(); reset(); }
    })
  }

  edit = (data, reset) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/edit',
      payload: data,
      cb: () => { this.closeModel(); reset(); }
    })
  }

  delete = (id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/del',
      payload: id,
    })
  }

  moveUp = (id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/moveUp',
      payload: id,
    })
  }

  moveDown = (id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/moveDown',
      payload: id,
    })
  }

  /**
   * 获取搜索表单DOm
   *
   * @memberof menuPage
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
              <Can api="POST@/api/menu">
              <Button type="primary" onClick={() => { this.openModel('add', {}) }}>
                创建
              </Button>
              </Can>
              <Can api="GET@/api/menu">
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
   * @memberof menuPage
   */
  openModel = (action, record) => {
    this.setState({ edit: { action, opened: true, data: record, key: Math.random() }})
  }

  /**
   * 关闭编辑框
   *
   * @memberof menuPage
   */
  closeModel = () => {
    this.setState({ edit: { ...this.state.edit, opened: false }})
  }

  isBottom = (id) => {
    const { menu: { list = [] } } = this.props;
    const find = (finddata) => {
      for (let index = 0; index < finddata.length; index++) {
        const element = finddata[index];
        if (element.id === id) {
          return index === finddata.length - 1;
        }
        if (element.children && element.children.length > 0) {
          const is = find(element.children);
          if (is) {
            return true;
          }
        }
      }
      return false;
    }

    return find(list);

  }

  /**
   * 字段定义
   *
   * @memberof menuPage
   */
  getColumns = () => ([
    {
      dataIndex: 'name',
      title: '名称',
    },
    {
      dataIndex: 'type',
      align: 'center',
      title: '类型',
      render: (text) => {
        switch (text) { //1列表页 2单页 3表单页
          case 1:
            return '绑定栏目';
          case 2:
            return 'URL';
          default:
            return '-';
        }
      }
    },
    {
      dataIndex: 'category_id',
      align: 'center',
      title: '绑定栏目ID',
    },
    {
      align: 'center',
      dataIndex: 'url',
      title: 'URL链接',
    },
    {
      title: '排序',
      width: 100,
      align: 'center',
      render: (text, record, index) => {
        return (
          <Action
            can={{ edit: 'PUT@/api/menu/:id', delete: 'DELETE@/api/menu/:id'}}
            editable={false}
            deleteable={false}
          >
            <Can to="PUT@/api/menu/moveUp/:id">
              <Button shape="circle" icon="up" size="small" disabled={index === 0} onClick={() => { this.moveUp(record.id)}}/>
            </Can>
            <Can to="PUT@/api/menu/moveDown/:id">
              <Button shape="circle" icon="down" size="small" disabled={this.isBottom(record.id)} onClick={() => { this.moveDown(record.id)}} />
            </Can>

          </Action>
        )
      }
    },
    {
      title: '操作',
      width: 180,
      align: 'center',
      render: (text, record) => {
        return (
          <Action
            can={{ edit: 'PUT@/api/menu/:id', delete: 'DELETE@/api/menu/:id'}}
            delete={() => { this.delete(record.id) }}
            edit={() => { this.openModel('edit', record) }}
          >
          </Action>
        )

      }
    }
  ])

  render() {
    const { loading: { effects: loading = {}}, menu: { list = [], models = [] } } = this.props;
    return (
      <Can api="GET@/api/menu" cannot={null}>

        <Table
          key={list.length}
          childrenColumnName="children"
          title={this.renderFilter}
          defaultExpandAllRows
          columns={this.getColumns()}
          loading={loading['menu/list']}
          rowKey='id'
          dataSource={list}
          pagination={false}
          scroll={{ x: 980 }}
          indentSize={17}
        >
        </Table>

        <Edit
          {...this.state.edit}
          models={models}
          close={this.closeModel}
          add={this.add}
          edit={this.edit}
        />
      </Can>

    );
  }
}

export default menuPage;
