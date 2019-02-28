import React, { Component } from "react";
import { connect } from "dva";
import { Form, Input, Button } from "antd";
import name from "components/name";
import Can from "components/can/index";

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 7 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
    md: { span: 10 }
  }
};

const submitFormLayout = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 10, offset: 7 }
  }
};

@connect(({ config, loading }) => ({ config, loading: loading.models.config }))
@name("重置密码")
@Form.create()
class SettingPage extends Component {
  state = {};

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: "admin/resetPassword",
          payload: values
        });
      }
    });
  };

  handleConfirmPassword = (rule, value, callback) => {
    const { getFieldValue } = this.props.form;
    if (value && value !== getFieldValue("newPassword")) {
      callback("两次密码输入不一致！");
    }
    callback();
  };

  render() {
    const { loading } = this.props;
    const { getFieldDecorator } = this.props.form;

    return (
      <Can api="PUT@/api/admin/password">
        <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
          <Form.Item {...formItemLayout} label="旧密码">
            {getFieldDecorator("oPassword", {
              rules: [
                {
                  required: true,
                  message: "请输入旧密码"
                }
              ]
            })(<Input type="password" placeholder="请输入旧密码" />)}
          </Form.Item>

          <Form.Item {...formItemLayout} label="新密码">
            {getFieldDecorator("newPassword", {
              rules: [
                {
                  required: true,
                  message: "请输入新密码"
                },
                {
                  min: 8,
                  message: "新密码最少八位"
                }
              ]
            })(<Input type="password" placeholder="请输入新密码" />)}
          </Form.Item>

          <Form.Item {...formItemLayout} label="新密码确认">
            {getFieldDecorator("rNewPassword", {
              rules: [
                {
                  required: true,
                  message: "请再次输入新密码"
                },
                {
                  validator: this.handleConfirmPassword
                }
              ]
            })(<Input type="password" placeholder="请再次输入新密码" />)}
          </Form.Item>

          <Form.Item {...submitFormLayout} style={{ marginTop: 32 }}>
            <Button type="primary" htmlType="submit" loading={loading}>
              提交
            </Button>
          </Form.Item>
        </Form>
      </Can>
    );
  }
}

export default SettingPage;
