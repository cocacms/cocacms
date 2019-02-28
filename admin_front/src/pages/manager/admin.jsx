/**
 * title: 管理员管理
 */
import React, { Component } from "react";
import {
  Table,
  Form,
  Row,
  Col,
  Button,
  Input,
  Modal,
  Spin,
  Checkbox
} from "antd";
import Action from "components/action";
import Can from "components/can/index";
import { connect } from "dva";

import re from "../../utils/re";

@Form.create()
class Edit extends Component {
  state = {};
  onOk = () => {
    const { form, action } = this.props;
    form.validateFieldsAndScroll((err, fieldsValue) => {
      if (err) return;
      this.props[action](fieldsValue, form.resetFields);
    });
  };

  render() {
    const {
      action,
      opened,
      data = {},
      close,
      form: { getFieldDecorator }
    } = this.props;
    const labelCol = { span: 5 };
    const wrapperCol = { span: 15 };

    return (
      <Modal
        title={action === "add" ? "添加" : "编辑"}
        visible={opened}
        onCancel={close}
        onOk={this.onOk}
      >
        <Form>
          <Form.Item labelCol={labelCol} wrapperCol={wrapperCol} label="ID">
            {getFieldDecorator("id", {
              initialValue: data.id
            })(<Input disabled />)}
          </Form.Item>

          <Form.Item labelCol={labelCol} wrapperCol={wrapperCol} label="账号">
            {getFieldDecorator("account", {
              initialValue: data.account,
              rules: [
                { required: action === "add", message: "请输入登录邮箱" },
                { pattern: re.mail, message: "请输入正确的邮箱格式" }
              ]
            })(<Input disabled={action !== "add"} />)}
          </Form.Item>

          <Form.Item
            labelCol={labelCol}
            wrapperCol={wrapperCol}
            label="密码"
            extra="填写则更新密码"
          >
            {getFieldDecorator("password", {
              initialValue: "",
              rules: [
                { required: action === "add", message: "请输入密码" },
                { type: "string", min: 8, message: "请输入8位以上" }
              ]
            })(<Input />)}
          </Form.Item>

          <Form.Item labelCol={labelCol} wrapperCol={wrapperCol} label="名称">
            {getFieldDecorator("nickname", {
              initialValue: data.nickname,
              rules: [{ required: true, message: "请输入名称" }]
            })(<Input />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

@connect(({ admin, loading }) => ({ admin, loading: loading.models.admin }))
class RoleEdit extends Component {
  state = {};

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: "admin/fetchRole"
    });
  }

  onOk = e => {
    const { dispatch } = this.props;
    const { uid } = this.props;
    const rid = e.target.value;
    const type = `admin/${e.target.checked ? "award" : "undo"}`;
    dispatch({
      type,
      payload: {
        uid,
        rid
      }
    });
  };

  render() {
    const {
      admin: { roles = [] },
      opened,
      close,
      loading,
      rids = []
    } = this.props;
    return (
      <Modal
        title="编辑角色"
        visible={opened}
        onCancel={close}
        onOk={close}
        footer={
          <Button type="primary" onClick={close}>
            关闭
          </Button>
        }
      >
        <Spin spinning={loading}>
          <Row>
            {roles.map(i => (
              <Col span={8} key={i.id}>
                <Checkbox
                  value={i.id}
                  onChange={this.onOk}
                  defaultChecked={rids.includes(i.id)}
                >
                  {i.name}
                </Checkbox>
              </Col>
            ))}
          </Row>
        </Spin>
      </Modal>
    );
  }
}

@connect(({ admin, loading }) => ({ admin, loading: loading.models.admin }))
@Form.create()
class AdminPage extends Component {
  state = {
    expand: false,
    edit: {
      action: "add",
      data: {},
      opened: false
    },
    roleEdit: {
      uid: 0,
      opened: false,
      rids: [],
      key: 0
    }
  };

  componentDidMount() {
    this.init();
  }

  /**
   * 初始化获取数据
   *
   * @memberof AdminPage
   */
  init = () => {
    const { dispatch, form } = this.props;
    form.resetFields();
    dispatch({
      type: "admin/list",
      payload: {
        page: 1,
        pageSize: 20,
        where: [],
        order: []
      }
    });
  };

  /**
   * 搜索
   *
   * @memberof AdminPage
   */
  handleSearch = (e, page = 1, pageSize = 20, sorter = []) => {
    if (e) {
      e.preventDefault();
    }
    const { form, dispatch } = this.props;
    form.validateFieldsAndScroll((err, fieldsValue) => {
      if (err) {
        return;
      }

      dispatch({
        type: "admin/list",
        payload: {
          page,
          pageSize,
          where: [["id", fieldsValue.id]],
          order: sorter
        }
      });
    });
  };

  /**
   * 表切换
   *
   * @memberof AdminPage
   */
  handleTableChange = (pagination, filters, sorter) => {
    const order = [];
    if (sorter.columnKey) {
      order.push([
        sorter.columnKey,
        sorter.order === "ascend" ? "asc" : "desc"
      ]);
    }
    this.handleSearch(null, pagination.current, pagination.pageSize, order);
  };

  add = (data, reset) => {
    const { dispatch } = this.props;
    dispatch({
      type: "admin/add",
      payload: data,
      cb: () => {
        this.closeModal();
        reset();
      }
    });
  };

  edit = (data, reset) => {
    const { dispatch } = this.props;
    dispatch({
      type: "admin/edit",
      payload: data,
      cb: () => {
        this.closeModal();
        reset();
      }
    });
  };

  delete = id => {
    const { dispatch } = this.props;
    dispatch({
      type: "admin/del",
      payload: id
    });
  };

  /**
   * 切换搜索表单展开隐藏
   *
   * @memberof AdminPage
   */
  toggleExpand = () => {
    const { expand } = this.state;
    this.setState({ expand: !expand });
  };

  /**
   * 获取搜索字段DOM
   *
   * @returns
   * @memberof AdminPage
   */
  getFields() {
    const { getFieldDecorator } = this.props.form;
    const children = [];

    const labelCol = {
      xs: { span: 12 },
      sm: { span: 7 },
      xxl: { span: 4 }
    };
    const wrapperCol = {
      xs: { span: 12 },
      sm: { span: 17 },
      xxl: { span: 18 }
    };

    children.push(
      <Col sm={12} xs={24} lg={{ span: 8 }} key="s-id">
        <Form.Item label="用户ID" labelCol={labelCol} wrapperCol={wrapperCol}>
          {getFieldDecorator("id", {})(<Input placeholder="" />)}
        </Form.Item>
      </Col>
    );

    children.push(
      <Col sm={12} xs={24} lg={{ span: 8 }} key="s-submit">
        <Form.Item wrapperCol={{ span: 24 }}>
          <Can api="GET@/api/admin">
            <Button type="primary" htmlType="submit">
              搜索
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.init}>
              重置
            </Button>
          </Can>
        </Form.Item>
      </Col>
    );

    return children;
  }

  /**
   * 获取搜索表单DOm
   *
   * @memberof AdminPage
   */
  renderFilter = () => {
    return (
      <div>
        <Form className="table-search-form" onSubmit={this.handleSearch}>
          <Row gutter={24}>{this.getFields()}</Row>
          <Row>
            <Col span={24} style={{ textAlign: "right" }}>
              <Can api="POST@/api/admin">
                <Button
                  type="primary"
                  onClick={() => {
                    this.openModal("add", {});
                  }}
                >
                  创建
                </Button>
              </Can>
            </Col>
          </Row>
        </Form>
      </div>
    );
  };

  /**
   * 开启编辑框
   *
   * @memberof AdminPage
   */
  openModal = (action, record) => {
    this.setState({ edit: { action, opened: true, data: record } });
  };

  openRoleModal = (uid, rids) => {
    this.setState({
      roleEdit: { opened: true, uid, rids, key: Math.random() }
    });
  };

  /**
   * 关闭编辑框
   *
   * @memberof AdminPage
   */
  closeModal = () => {
    this.setState({ edit: { ...this.state.edit, opened: false } });
  };

  closeRoleModal = () => {
    this.setState({ roleEdit: { ...this.state.roleEdit, opened: false } });
  };

  /**
   * 字段定义
   *
   * @memberof AdminPage
   */
  getColumns = () => [
    {
      dataIndex: "id",
      title: "ID",
      sorter: true
    },
    {
      align: "center",
      dataIndex: "nickname",
      title: "名称"
    },
    {
      align: "center",
      dataIndex: "account",
      title: "账号"
    },
    {
      dataIndex: "is_super",
      align: "center",
      title: "超级管理员",
      render: text => {
        return text === 1 ? "是" : "否";
      }
    },
    {
      dataIndex: "roles",
      align: "center",
      title: "角色",
      render: text => {
        if (!Array.isArray(text) || text.length === 0) {
          return "-";
        }
        return text.map(i => i.name).join("，");
      }
    },
    {
      title: "操作",
      width: 180,
      align: "center",
      render: (text, record) => {
        return (
          <Action
            can={{
              edit: "PUT@/api/admin/:id",
              delete: "DELETE@/api/admin/:id"
            }}
            delete={() => {
              this.delete(record.id);
            }}
            edit={() => {
              this.openModal("edit", record);
            }}
          >
            <a
              onClick={() => {
                this.openRoleModal(record.id, record.roles.map(i => i.id));
              }}
            >
              角色管理
            </a>
          </Action>
        );
      }
    }
  ];

  render() {
    const {
      loading,
      admin: {
        list: { data = [], page: current = 1, total = 0, pageSize = 20 } = {}
      }
    } = this.props;
    return (
      <Can api="GET@/api/admin" cannot={null}>
        <Table
          title={this.renderFilter}
          columns={this.getColumns()}
          loading={loading}
          rowKey="id"
          dataSource={data}
          pagination={{
            showSizeChanger: true,
            current,
            total,
            pageSize
          }}
          scroll={{ x: 980 }}
          onChange={this.handleTableChange}
        />

        <Edit
          {...this.state.edit}
          key={String(this.state.edit.data.id)}
          close={this.closeModal}
          add={this.add}
          edit={this.edit}
        />

        <RoleEdit {...this.state.roleEdit} close={this.closeRoleModal} />
      </Can>
    );
  }
}

export default AdminPage;
