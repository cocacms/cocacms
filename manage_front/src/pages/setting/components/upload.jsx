import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Select } from 'antd';
import Can from 'components/can/index';
import PropTypes from 'prop-types';

import { formItemLayout, tailFormItemLayout } from '../../../common/formCol';

const Option = Select.Option;
@connect(({ config }) => ({ config }))
@Form.create()
class DefaultSetting extends Component {
  state = {
    type: null,
  }

  static contextTypes = {
    isMobile: PropTypes.bool,
  }

  static getDerivedStateFromProps(nextProps, prevState){
    if (nextProps.config && nextProps.config.config && nextProps.config.config.upload && nextProps.config.config.upload.type) {
      return { _type: nextProps.config.config.upload.type }
    }
    return null;
  }

  onSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      this.props.submit(fieldsValue, 'upload');
    });
  }



  renderqiniu() {
    const { form: { getFieldDecorator }, config: { config: { upload = {} } } } = this.props;
    return (
      <div>

      <Form.Item {...formItemLayout} label="机房">
        {getFieldDecorator('zone', {
          initialValue: upload.zone,
          rules: [{ required: true, message: '请输入' }]
        })(
          <Select placeholder="请选择">
            <Option value="Zone_z0">华东</Option>
            <Option value="Zone_z1">华北</Option>
            <Option value="Zone_z2">华南</Option>
            <Option value="Zone_na0">北美</Option>
          </Select>
        )}

      </Form.Item>

      <Form.Item {...formItemLayout} label="上传前缀">
        {getFieldDecorator('prefix', {
          initialValue: upload.prefix,
          rules: [{ required: true, message: '请输入' }]
        })(
          <Input placeholder="请输入" />
        )}

      </Form.Item>

      <Form.Item {...formItemLayout} label="bucketName">
        {getFieldDecorator('bucketName', {
          initialValue: upload.bucketName,
          rules: [{ required: true, message: '请输入' }]
        })(
          <Input placeholder="请输入" />
        )}

      </Form.Item>


      <Form.Item {...formItemLayout} label="accessKey">
        {getFieldDecorator('accessKey', {
          initialValue: upload.accessKey,
          rules: [{ required: true, message: '请输入' }]
        })(
          <Input placeholder="请输入" />
        )}

      </Form.Item>


      <Form.Item {...formItemLayout} label="secretKey">
        {getFieldDecorator('secretKey', {
          initialValue: upload.secretKey,
          rules: [{ required: true, message: '请输入' }]
        })(
          <Input placeholder="请输入" />
        )}

      </Form.Item>

      <Form.Item {...formItemLayout} label="cdn">
        {getFieldDecorator('cdn', {
          initialValue: upload.cdn,
          rules: [{ required: true, message: '请输入' }]
        })(
          <Input placeholder="请输入" />
        )}

      </Form.Item>
      </div>

    )
  }

  render() {
    const { form: { getFieldDecorator }, config: { config: { upload = {} } } } = this.props;

    const type = this.state.type === null ? this.state._type : this.state.type;

    console.log(type);

    return (
      <Form className="page-form" layout={this.context.isMobile ? 'vertical' : 'horizontal'} onSubmit={this.onSubmit}>

        <Form.Item {...formItemLayout} label="上传类型">
          {getFieldDecorator('type', {
            initialValue: upload.type,
            rules: [{ required: true, message: '请输入' }],
            getValueFromEvent: (e) => {
              this.setState({
                type: e,
              })
              return e;
            }
          })(
            <Select placeholder="请选择">
              <Option value="qiniu">七牛云</Option>
              <Option value="local">本地存储</Option>
            </Select>
          )}

        </Form.Item>

        <Form.Item {...formItemLayout} label="允许后缀名" extra="使用|隔开，例：.jpg|.jpeg|.png|.gif|.mp3|.mp4">
          {getFieldDecorator('extension', {
            initialValue: upload.extension,
            rules: [{ required: true, message: '请输入' }]
          })(
            <Input placeholder="请输入" />
          )}

        </Form.Item>

        <Form.Item {...formItemLayout} label="文件大小限制">
          {getFieldDecorator('fileSize', {
            initialValue: upload.fileSize,
            rules: [
              { required: true, message: '请输入' }
            ]
          })(
            <Input placeholder="请输入" />
          )}

        </Form.Item>

        { this[`render${type}`] ? this[`render${type}`]() : [] }

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
