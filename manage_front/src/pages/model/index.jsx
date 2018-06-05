import React, { Component } from 'react';
import {
  Table, Form, Row, Col, Button, Input, Modal
} from 'antd';
import name from 'components/name';
import Action from 'components/action';
import Can from 'components/can/index';
import { connect } from 'dva';
import Link from 'umi/link';

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
            label="关键字"
          >
            {getFieldDecorator('key', {
              initialValue: data.key,
              rules: [{ required: action === 'add', message: '请输入关键字' }],
            })(
              <Input disabled={action !== 'add'}/>
            )}
          </Form.Item>


          <Form.Item
            labelCol={labelCol}
            wrapperCol={wrapperCol}
            label="模型名称"
          >
            {getFieldDecorator('name', {
              initialValue: data.name,
              rules: [{ required: true, message: '请输入模型名称' }],
            })(
              <Input/>
            )}
          </Form.Item>

          <Form.Item
            labelCol={labelCol}
            wrapperCol={wrapperCol}
            label="编辑框宽度"
            extra="默认50%"
          >
            {getFieldDecorator('width', {
              initialValue: data.width
            })(
              <Input/>
            )}
          </Form.Item>


        </Form>

      </Modal>

    );
  }
}


@connect(({ model, loading }) => ({ model, loading: loading.models.model }))
@Form.create()
@name('模型管理')
class ModelPage extends Component {
  state = {
    expand: false,
    edit: {
      action: 'add',
      data: {},
      opened: false,
    }
  }

  componentDidMount() {
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
      type: 'model/list',
    })
  }

  add = (data, reset) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'model/add',
      payload: data,
      cb: () => {
        this.closeModel();
        reset();
        dispatch({ type: 'admin/fetch'});
      }
    })
  }

  edit = (data, reset) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'model/edit',
      payload: data,
      cb: () => {
        this.closeModel();
        reset();
        dispatch({ type: 'admin/fetch'});
       }
    })
  }

  delete = (id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'model/del',
      payload: id,
      cb: () => {
        dispatch({ type: 'admin/fetch'});
      }
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
              <Can api="POST@/api/model">
              <Button type="primary" onClick={() => { this.openModel('add', {}) }}>
                创建
              </Button>
              </Can>
              <Can api="GET@/api/model">
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

  /**
   * 关闭编辑框
   *
   * @memberof ModelPage
   */
  closeModel = () => {
    this.setState({ edit: { ...this.state.edit, opened: false }})
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
      title: '名称',
    },
    {
      title: '操作',
      width: 180,
      align: 'center',
      render: (text, record) => {
        return (
          <Action
            can={{ edit: 'PUT@/api/model/:id', delete: 'DELETE@/api/model/:id'}}
            delete={() => { this.delete(record.id) }}
            edit={() => { this.openModel('edit', record) }}
          >
            <Can api="GET@/api/modelAttr/:model">
            <Link to={`/model/${record.id}`}>编辑字段</Link>
            </Can>
          </Action>
        )

      }
    }
  ])

  render() {
    const { loading, model: { list = [] } } = this.props;
    return (
      <Can api="GET@/api/model" cannot={null}>

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
      </Can>

    );
  }
}

export default ModelPage;
