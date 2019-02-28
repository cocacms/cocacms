import React, { Component } from "react";
import { Table, Form, Row, Col, Button, Input, Modal, Select } from "antd";
import name from "components/name";
import Action from "components/action";
import Can from "components/can/index";
import { connect } from "dva";

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
      form: { getFieldDecorator },
      models = []
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

          <Form.Item
            labelCol={labelCol}
            wrapperCol={wrapperCol}
            extra="设置后无法修改"
            label="关键字"
          >
            {getFieldDecorator("key", {
              initialValue: data.key,
              rules: [{ required: action === "add", message: "请输入关键字" }]
            })(<Input disabled={action !== "add"} />)}
          </Form.Item>

          <Form.Item
            labelCol={labelCol}
            wrapperCol={wrapperCol}
            label="绑定模型"
          >
            {getFieldDecorator("model_id", {
              initialValue: data.model_id,
              rules: [{ required: true, message: "请设置绑定的模型" }]
            })(
              <Select placeholder="请选择">
                {models
                  .filter(i => i.type === 1)
                  .map(i => (
                    <Select.Option key={`model_id_${i.id}`} value={i.id}>
                      {i.name}
                    </Select.Option>
                  ))}
              </Select>
            )}
          </Form.Item>

          <Form.Item
            labelCol={labelCol}
            wrapperCol={wrapperCol}
            label="表单名称"
          >
            {getFieldDecorator("name", {
              initialValue: data.name,
              rules: [{ required: true, message: "请输入表单名称" }]
            })(<Input />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

@connect(({ form, loading }) => ({ mform: form, loading: loading.models.form }))
@Form.create()
@name("表单管理")
class FormPage extends Component {
  state = {
    expand: false,
    edit: {
      action: "add",
      data: {},
      opened: false
    }
  };

  componentDidMount() {
    this.init();
  }

  /**
   * 初始化获取数据
   *
   * @memberof FormPage
   */
  init = () => {
    const { dispatch, form } = this.props;
    form.resetFields();
    dispatch({
      type: "form/list"
    });
    dispatch({
      type: "form/fetchProps"
    });
  };

  add = (data, reset) => {
    const { dispatch } = this.props;
    dispatch({
      type: "form/add",
      payload: data,
      cb: () => {
        this.closeModel();
        reset();
        dispatch({ type: "admin/fetch" });
      }
    });
  };

  edit = (data, reset) => {
    const { dispatch } = this.props;
    dispatch({
      type: "form/edit",
      payload: data,
      cb: () => {
        this.closeModel();
        reset();
        dispatch({ type: "admin/fetch" });
      }
    });
  };

  delete = id => {
    const { dispatch } = this.props;
    dispatch({
      type: "form/del",
      payload: id,
      cb: () => {
        dispatch({ type: "admin/fetch" });
      }
    });
  };

  /**
   * 获取搜索表单DOm
   *
   * @memberof FormPage
   */
  renderFilter = () => {
    return (
      <div>
        <Form className="table-search-form" onSubmit={this.handleSearch}>
          <Row>
            <Col span={24} style={{ textAlign: "right" }}>
              <Can api="POST@/api/form">
                <Button
                  type="primary"
                  onClick={() => {
                    this.openModel("add", {});
                  }}
                >
                  创建
                </Button>
              </Can>
              <Can api="GET@/api/form">
                <Button onClick={this.init} className="refresh-btn">
                  刷新
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
   * @memberof FormPage
   */
  openModel = (action, record) => {
    this.setState({ edit: { action, opened: true, data: record } });
  };

  /**
   * 关闭编辑框
   *
   * @memberof FormPage
   */
  closeModel = () => {
    this.setState({ edit: { ...this.state.edit, opened: false } });
  };

  /**
   * 字段定义
   *
   * @memberof FormPage
   */
  getColumns = () => [
    {
      dataIndex: "id",
      width: 100,
      title: "ID"
    },
    {
      dataIndex: "key",
      title: "关键字"
    },
    {
      dataIndex: "name",
      title: "名称"
    },
    {
      title: "操作",
      width: 180,
      align: "center",
      render: (text, record) => {
        return (
          <Action
            can={{ edit: "PUT@/api/form/:id", delete: "DELETE@/api/form/:id" }}
            delete={() => {
              this.delete(record.id);
            }}
            edit={() => {
              this.openModel("edit", record);
            }}
          />
        );
      }
    }
  ];

  render() {
    const {
      loading,
      mform: { list = [], models = [] }
    } = this.props;
    return (
      <Can api="GET@/api/form" cannot={null}>
        <Table
          title={this.renderFilter}
          columns={this.getColumns()}
          loading={loading}
          rowKey="id"
          dataSource={list}
          scroll={{ x: 980 }}
          pagination={false}
        />

        <Edit
          {...this.state.edit}
          key={String(this.state.edit.data.id)}
          close={this.closeModel}
          add={this.add}
          edit={this.edit}
          models={models}
        />
      </Can>
    );
  }
}

export default FormPage;
