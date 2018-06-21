import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button } from 'antd';
import Can from 'components/can/index';
import Upload from 'components/upload';
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
      this.props.submit(fieldsValue, 'company');
    });
  }

  render() {
    const { form: { getFieldDecorator }, config: { config: { company = {} }} } = this.props;
    return (
      <Form className="page-form" layout={this.context.isMobile ? 'vertical' : 'horizontal'} onSubmit={this.onSubmit}>

        <Form.Item {...formItemLayout} label="公司名称">
          {getFieldDecorator('name', {
            initialValue: company.name,
            rules: [{ required: true, message: '请输入' }]
          })(
            <Input placeholder="请输入" />
          )}

        </Form.Item>

        <Form.Item {...formItemLayout} label="联系电话">
          {getFieldDecorator('tel', {
            initialValue: company.tel,
            rules: [{ required: true, message: '请输入' }]
          })(
            <Input placeholder="请输入" />
          )}

        </Form.Item>


        <Form.Item {...formItemLayout} label="邮箱">
          {getFieldDecorator('mail', {
            initialValue: company.mail,
            rules: [{ required: true, message: '请输入' }]
          })(
            <Input placeholder="请输入" />
          )}

        </Form.Item>


        <Form.Item
          {...formItemLayout}
          label="公司地址位置坐标"
          extra={<span>请使用"高德坐标拾取"进行拾取，点击 <a target="_black" href="http://lbs.amap.com/console/show/picker">这里</a> 去拾取</span>}
        >
          {getFieldDecorator('position', {
            initialValue: company.position,
            rules: [{ required: true, message: '请输入' }]
          })(
            <Input placeholder="请输入" />
          )}

        </Form.Item>

        <Form.Item {...formItemLayout} label="地址">
          {getFieldDecorator('address', {
            initialValue: company.address,
            rules: [{ required: true, message: '请输入' }]
          })(
            <Input placeholder="请输入" />
          )}

        </Form.Item>


        <Form.Item {...formItemLayout} label="微信公众号二维码">
          {getFieldDecorator('qr_wx', {
            initialValue: company.qr_wx,
            rules: [{ required: true, message: '请输入' }]
          })(
            <Upload max={1} />
          )}

        </Form.Item>


        <Form.Item {...formItemLayout} label="微博二维码">
          {getFieldDecorator('qr_wb', {
            initialValue: company.qr_wb,
            rules: [{ required: true, message: '请输入' }]
          })(
            <Upload max={1} />
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
