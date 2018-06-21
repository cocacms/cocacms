import React, { Component } from 'react';
import {
  Table, Form, Row, Col, Button, Input, Modal
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
    form.validateFieldsAndScroll((err, fieldsValue) => {
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
            label="站点名称"
          >
            {getFieldDecorator('name', {
              initialValue: data.name,
              rules: [{ required: true, message: '请输入站点名称' }],
            })(
              <Input/>
            )}
          </Form.Item>

          <Form.Item
            labelCol={labelCol}
            wrapperCol={wrapperCol}
            label="语言包"
          >
            {getFieldDecorator('locale', {
              initialValue: data.locale,
              rules: [{ required:true, message: '请输入语言包' }],
            })(
              <Input/>
            )}
          </Form.Item>

        </Form>

      </Modal>

    );
  }
}


@connect(({ site, loading }) => ({ site, loading: loading.models.site }))
@Form.create()
@name('站点管理')
class SitePage extends Component {
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
   * @memberof SitePage
   */
  init = () => {
    const { dispatch, form } = this.props;
    form.resetFields();
    dispatch({
      type: 'site/list',
    })
  }

  add = (data, reset) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'site/add',
      payload: data,
      cb: () => { this.closeModel(); reset(); }
    })
  }

  edit = (data, reset) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'site/edit',
      payload: data,
      cb: () => { this.closeModel(); reset(); }
    })
  }

  delete = (id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'site/del',
      payload: id,
    })
  }

  /**
   * 获取搜索表单DOm
   *
   * @memberof SitePage
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
              <Can api="POST@/api/site">
              <Button type="primary" onClick={() => { this.openModel('add', {}) }}>
                创建
              </Button>
              </Can>
              <Can api="GET@/api/site">
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
   * @memberof SitePage
   */
  openModel = (action, record) => {
    this.setState({ edit: { action, opened: true, data: record }})
  }

  /**
   * 关闭编辑框
   *
   * @memberof SitePage
   */
  closeModel = () => {
    this.setState({ edit: { ...this.state.edit, opened: false }})
  }

  /**
   * 字段定义
   *
   * @memberof SitePage
   */
  getColumns = () => ([
    {
      dataIndex: 'id',
      width: 100,
      title: 'ID',
    },
    {
      dataIndex: 'name',
      title: '站点名称',
    },
    {
      dataIndex: 'locale',
      title: '语言包',
    },
    {
      title: '操作',
      width: 180,
      align: 'center',
      render: (text, record) => {
        return (
          <Action
            can={{ edit: 'PUT@/api/site/:id', delete: 'DELETE@/api/site/:id'}}
            delete={() => { this.delete(record.id) }}
            edit={() => { this.openModel('edit', record) }}
          >
          </Action>
        )

      }
    }
  ])

  render() {
    const { loading, site: { list = [] } } = this.props;
    return (
      <Can api="GET@/api/site" cannot={null}>

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

export default SitePage;
