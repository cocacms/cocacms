import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Button } from 'antd';
import Can from 'components/can/index';
import PropTypes from 'prop-types';

import { renderForm } from 'components/formItem';
import { formItemLayout, tailFormItemLayout } from '../../../common/formCol';

@connect(({ config }) => ({ config }))
@Form.create()
class AutoSetting extends Component {
  static contextTypes = {
    isMobile: PropTypes.bool,
  };

  onSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
      if (err) {
        return;
      }
      this.props.submit(fieldsValue, this.props.keyName);
    });
  };

  renderConfig() {
    const {
      form: { getFieldDecorator },
      config: { config },
      keyName = 'defaults',
      attrs,
      data = null,
    } = this.props;
    let _data = {};
    if (!data) {
      _data = config[keyName] || {};
    } else {
      _data = data;
    }
    const rules = {};
    attrs.filter(i => i.rules && i.rules.length > 0).map(i => {
      rules[i.key] = i.rules;
      return i;
    });

    return renderForm(attrs, rules, _data, getFieldDecorator, formItemLayout);
  }

  render() {
    return (
      <Form
        className="page-form"
        layout={this.context.isMobile ? 'vertical' : 'horizontal'}
        onSubmit={this.onSubmit}
      >
        {this.renderConfig()}
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

export default AutoSetting;
