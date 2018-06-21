import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button } from 'antd';
import Upload from 'components/upload';
import Can from 'components/can/index';
import PropTypes from 'prop-types';

import { formItemLayout, tailFormItemLayout } from '../../../common/formCol';

@connect(({ config }) => ({ config }))
@Form.create()
class DefaultSetting extends Component {
  static contextTypes = {
    isMobile: PropTypes.bool,
  }

  onSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
      if (err) {
        return;
      }
      this.props.submit(fieldsValue, 'defaults');
    });
  }

  render() {
    const { form: { getFieldDecorator }, config: { config: { defaults = {} } } } = this.props;
    return (
      <Form className="page-form" layout={this.context.isMobile ? 'vertical' : 'horizontal'} onSubmit={this.onSubmit}>

        <Form.Item {...formItemLayout} label="网站标题">
          {getFieldDecorator('title', {
            initialValue: defaults.title,
            rules: [{ required: true, message: '请输入' }]
          })(
            <Input placeholder="请输入" />
          )}

        </Form.Item>

        <Form.Item {...formItemLayout} label="网站LOGO">
          {getFieldDecorator('logo', {
            initialValue: defaults.logo,
            rules: [{ required: true, message: '请输入' }]
          })(
            <Upload max={1} />
          )}

        </Form.Item>

        <Form.Item {...formItemLayout} label="页脚LOGO">
          {getFieldDecorator('footerlogo', {
            initialValue: defaults.footerlogo,
            rules: [{ required: true, message: '请输入' }]
          })(
            <Upload max={1} />
          )}

        </Form.Item>

        <Form.Item {...formItemLayout} label="网站关键字">
          {getFieldDecorator('keyword', {
            initialValue: defaults.keyword,
            rules: [{ required: true, message: '请输入' }]
          })(
            <Input placeholder="请输入" />
          )}

        </Form.Item>


        <Form.Item {...formItemLayout} label="网站描述">
          {getFieldDecorator('description', {
            initialValue: defaults.description,
            rules: [{ required: true, message: '请输入' }]
          })(
            <Input placeholder="请输入" />
          )}

        </Form.Item>


        <Form.Item {...formItemLayout} label="ICP备案">
          {getFieldDecorator('icp', {
            initialValue: defaults.icp,
            rules: [{ required: true, message: '请输入' }]
          })(
            <Input placeholder="请输入" />
          )}

        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Can api="POST@/api/config" cannot={<Button type="primary" disabled>提交</Button>}>
            <Button type="primary" htmlType="submit">提交</Button>
          </Can>
        </Form.Item>

      </Form>

    );
  }
}

export default DefaultSetting;
