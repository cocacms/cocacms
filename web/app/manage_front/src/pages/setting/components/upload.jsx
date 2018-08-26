import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Select } from 'antd';
import Can from 'components/can/index';
import PropTypes from 'prop-types';
import { renderForm } from 'components/formItem';

import { formItemLayout, tailFormItemLayout } from '../../../common/formCol';

const Option = Select.Option;
@connect(({ config, plugin }) => ({ config, plugin }))
@Form.create()
class DefaultSetting extends Component {
  state = {
    formId: 'upload_config_0',
  };

  static contextTypes = {
    isMobile: PropTypes.bool,
  };

  componentDidMount() {
    this.init();
  }

  init = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'plugin/list',
    });
  };

  onSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
      if (err) {
        return;
      }
      this.props.submit(fieldsValue, 'upload');
    });
  };

  renderConfig() {
    const {
      form: { getFieldValue, getFieldDecorator },
      config: {
        config: { upload = {} },
      },
      plugin: { list = [] },
    } = this.props;
    const type = getFieldValue('type');
    const hasPlugin = list.filter(i => i.enable === 1 && i.dirname === type);
    if (hasPlugin.length === 0) return null;
    const plugin = hasPlugin[0];
    if (!plugin.config) return null;
    const attrs = JSON.parse(plugin.config);
    const rules = {};
    attrs.filter(i => i.rules && i.rules.length > 0).map(i => {
      rules[i.key] = i.rules;
      return i;
    });
    const data = upload;

    return renderForm(attrs, rules, data, getFieldDecorator, formItemLayout);
  }

  render() {
    const {
      form: { getFieldDecorator },
      config: {
        config: { upload = {} },
      },
      plugin: { list = [] },
    } = this.props;

    return (
      <Form
        className="page-form"
        layout={this.context.isMobile ? 'vertical' : 'horizontal'}
        onSubmit={this.onSubmit}
      >
        <Form.Item {...formItemLayout} label="上传类型">
          {getFieldDecorator('type', {
            initialValue: upload.type,
            rules: [{ required: true, message: '请输入' }],
            getValueFromEvent: e => {
              this.setState({
                formId: `upload_config_${Math.random()}`,
              });
              return e;
            },
          })(
            <Select placeholder="请选择">
              <Option value="local">本地存储</Option>
              {list.filter(i => i.type === 2 && i.enable === 1).map(i => {
                return (
                  <Option key={`_upload_plugin_${i.id}`} value={i.dirname}>
                    {i.name}
                  </Option>
                );
              })}
            </Select>
          )}
        </Form.Item>

        <Form.Item
          {...formItemLayout}
          label="允许后缀名"
          extra="使用|隔开，例：.jpg|.jpeg|.png|.gif|.mp3|.mp4"
        >
          {getFieldDecorator('extension', {
            initialValue: upload.extension,
            rules: [{ required: true, message: '请输入' }],
          })(<Input placeholder="请输入" />)}
        </Form.Item>

        <Form.Item {...formItemLayout} label="文件大小限制">
          {getFieldDecorator('fileSize', {
            initialValue: upload.fileSize,
            rules: [{ required: true, message: '请输入' }],
          })(<Input placeholder="请输入" />)}
        </Form.Item>

        <div key={this.state.formId}>{this.renderConfig()}</div>

        <Form.Item {...tailFormItemLayout}>
          <Can
            api="POST@/api/config"
            cannot={
              <Button type="primary" disabled>
                提交
              </Button>
            }
          >
            <Button type="primary" htmlType="submit">
              提交
            </Button>
          </Can>
        </Form.Item>
      </Form>
    );
  }
}

export default DefaultSetting;
