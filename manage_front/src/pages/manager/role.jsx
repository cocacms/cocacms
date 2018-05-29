import React, { Component } from 'react';
import {
  Table, Form, Row, Col, Button, Input, Modal, Spin, Checkbox, Divider
} from 'antd';
import name from 'components/name';
import Action from 'components/action';
import Can from 'components/can/index';
import { connect } from 'dva';

@Form.create()
class Edit extends Component {
  state = {  }
  onOk = () => {
    const { form, action } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.props[action](fieldsValue, form.resetFields);
    });
  }

  render() {
    const { action, opened, data = {}, close, form: { getFieldDecorator } } = this.props;
    const labelCol = { span: 5 }
    const wrapperCol = { span: 15 }

    return (
      <Modal
        title={ action === 'add' ? '添加': '编辑' }
        visible={opened}
        onCancel={close}
        onOk={this.onOk}
      >
        <Form>
          <Form.Item
            labelCol={labelCol}
            wrapperCol={wrapperCol}
            label="ID"
          >
            {getFieldDecorator('id', {
              initialValue: data.id
            })(
              <Input disabled/>
            )}
          </Form.Item>

          <Form.Item
            labelCol={labelCol}
            wrapperCol={wrapperCol}
            label="角色名称"
          >
            {getFieldDecorator('name', {
              initialValue: data.name,
              rules: [{ required: true, message: '请输入角色名称' }],
            })(
              <Input/>
            )}
          </Form.Item>

        </Form>

      </Modal>

    );
  }
}

@connect(({
  permission,
  role,
  loading
}) => ({
  permission,
  role,
  loading: loading.models.permission && loading.models.role
}))
class PermissionEdit extends Component {
  state = {
    map: {},
  }

  componentDidMount() {
    const { dispatch, role_id } = this.props;
    dispatch({
      type: 'permission/list',
    })

    if (role_id > 0) {
      dispatch({
        type: 'role/show',
        payload: role_id,
      })
    }

  }



  static getDerivedStateFromProps(nextProps, prevState){

    const getItemData = (iterator, permissions) => {
      const pathData = iterator.path.split('@', 2);
        const method = pathData[0];
        const path = pathData[1];
        const paths = path.split('/', 4);
        let key = paths[2];
        // /api/f/:model/:id or /api/g/:model/:id
        if (key === 'f' || key === 'g') {
          key = `_auto_${key}_${paths[3]}` // model name
        }
        const selected = permissions.filter(i => {
          return `${i.method}@${i.uri}`.toLowerCase() === iterator.path.toLowerCase();
        })

        let value = null;
        if (selected.length > 0) {
          value = selected[0].id;
        } else {
          value = { uri: path, method };
        }

        return {
          title: key,
          key: iterator.path,
          path,
          method,
          selected: selected.length > 0,
          value,
          name: iterator.name,
        };
    }

    const { permission: { list = []}, role: { show : { permissions = [] } = {}} } = nextProps;
    const map = {};

    for (const iterator of list) {
      const item = getItemData(iterator, permissions);
        if (!map[item.title]) {
          map[item.title] = [];
        }
        map[item.title].push(item);
    }

    return {
      map,
    }
  }

  onOk = (e) => {
    const { dispatch } = this.props;
    const { role_id } = this.props;
    let data = e.target.value;
    const type = `permission/${e.target.checked ? 'add' : 'del'}`
    if (e.target.checked) {
      data = {
        ...data,
        role_id,
      }
    }
    dispatch({
      type,
      payload: data,
      cb: () => {
        dispatch({
          type: 'role/show',
          payload: role_id,
        })
      }
    })
  }



  render() {
    const { opened, close, loading } = this.props;
    return (
      <Modal
        title="编辑权限"
        visible={opened}
        onCancel={close}
        onOk={close}
        width="60%"
        bodyStyle={{ maxHeight: '70vh', overflowY: 'auto'}}
        footer={<Button type="primary" onClick={close}>关闭</Button>}
      >
        <Spin spinning={loading}>
            {
              Object.keys(this.state.map).map((i, index) => (
                <Row key={i}>
                  {index === 0 ? null : <Divider /> }
                  {
                    this.state.map[i].map(ii => (
                      <Col span={6} key={ii.key}>
                        <Checkbox
                          key={`${ii.key}-${ii.selected}`}
                          value={ii.value}
                          onChange={this.onOk}
                          defaultChecked={ii.selected}
                        >
                          {ii.name}
                        </Checkbox>
                      </Col>
                    ))
                  }
                  <div style={{ height: 0 , clear: 'both'}}></div>
                </Row>
              ))
            }
        </Spin>
      </Modal>

    );
  }
}

@connect(({ role, permission, loading }) => ({ role, permission, loading: loading.models.role }))
@Form.create()
@name('角色管理')
class RolePage extends Component {
  state = {
    expand: false,
    edit: {
      action: 'add',
      data: {},
      opened: false,
    },
    permissionEdit: {
      opened: false,
      role_id: 0,
    }
  }

  componentDidMount() {
    this.init()
  }

  /**
   * 初始化获取数据
   *
   * @memberof RolePage
   */
  init = () => {
    const { dispatch, form } = this.props;
    form.resetFields();
    dispatch({
      type: 'role/list',
    })
  }

  add = (data, reset) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'role/add',
      payload: data,
      cb: () => { this.closeModel(); reset(); }
    })
  }

  edit = (data, reset) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'role/edit',
      payload: data,
      cb: () => { this.closeModel(); reset(); }
    })
  }

  delete = (id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'role/del',
      payload: id,
    })
  }

  /**
   * 获取搜索表单DOm
   *
   * @memberof RolePage
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
              <Can api="POST@/api/role">
                <Button type="primary" onClick={() => { this.openModel('add', {}) }}>
                  创建
                </Button>
              </Can>
              <Can api="GET@/api/role">
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
   * @memberof RolePage
   */
  openModel = (action, record) => {
    this.setState({ edit: { action, opened: true, data: record }})
  }

  openPermissionModal = (role_id) => {
    this.setState({ permissionEdit: { opened: true, role_id, key: Math.random() }})
  }

  /**
   * 关闭编辑框
   *
   * @memberof RolePage
   */
  closeModel = () => {
    this.setState({ edit: { ...this.state.edit, opened: false }})
  }

  closePermissionModal = () => {
    this.setState({ permissionEdit: { ...this.state.permissionEdit, opened: false }})
  }

  /**
   * 字段定义
   *
   * @memberof RolePage
   */
  getColumns = () => ([
    {
      dataIndex: 'id',
      width: 100,
      title: 'ID',
    },
    {
      dataIndex: 'name',
      title: '名称',
    },
    {
      title: '操作',
      width: 180,
      align: 'center',
      render: (text, record) => {
        return (
          <Action
            can={{ edit: 'PUT@/api/role/:id', delete: 'DELETE@/api/role/:id'}}
            delete={() => { this.delete(record.id) }}
            edit={() => { this.openModel('edit', record) }}
          >
            <Can api="POST@/api/permission">
            <a onClick={() => { this.openPermissionModal(record.id); }}>权限管理</a>
            </Can>
          </Action>
        )

      }
    }
  ])

  render() {
    const { loading, role: { list = [] } } = this.props;
    return (
      <Can api="GET@/api/role" cannot={null}>

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

        <PermissionEdit
          { ...this.state.permissionEdit }
          close={this.closePermissionModal}
        />
      </Can>

    );
  }
}

export default RolePage;
