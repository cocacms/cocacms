import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Select, Button, message, Icon } from 'antd';
import Can from 'components/can/index';
import PropTypes from 'prop-types';

import { formItemLayout, tailFormItemLayout } from '../../../common/formCol';

@connect(({ theme }) => ({ theme }))
class ThemeSetting extends Component {
  static contextTypes = {
    isMobile: PropTypes.bool,
  }

  state = {
    value: null,
  }

  static getDerivedStateFromProps(props) {
    const { theme: { list = [] } } = props;

    const defaults = list.filter(i => i.use === 1);
    let defaultvalue = null;
    if (defaults.length > 0) {
      defaultvalue = defaults[0].id;
    }

    return {
      value: defaultvalue,
    }

  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'theme/list'
    })
  }

  onSubmit = () => {
    const { dispatch } = this.props;
    if (this.state.value !== null) {
      dispatch({
        type: 'theme/edit',
        payload: {
          id: this.state.value,
        }
      })
    }
  }

  reload = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'theme/add',
      payload: {},
      cb: () => {
        message.success('重新导入成功')
      }
    })
  }

  handleChange = (value) => {
    this.setState({
      value,
    })
  }

  render() {
    const { theme: { list = [] } } = this.props;


    return (
      <Form className="page-form" layout={this.context.isMobile ? 'vertical' : 'horizontal'} onSubmit={this.onSubmit}>

        <Form.Item {...formItemLayout} label={
          <span>
            主题
            <Can api="POST@/api/theme">
              <Icon type="reload" style={{ marginLeft:  5, cursor: 'pointer' }} onClick={this.reload} />
            </Can>
          </span>
        }>
          <div>
            <Select placeholder="请选择" onChange={this.handleChange} value={this.state.value}>
              {
                list.map(i => (<Select.Option key={i.id} value={i.id}>{i.name}</Select.Option>))
              }
            </Select>

          </div>
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Can api="PUT@/api/theme/:id" cannot={<Button type="primary" disabled>提交</Button>}>
            <Button type="primary" onClick={this.onSubmit}>提交</Button>
          </Can>

        </Form.Item>

      </Form>

    );
  }
}

export default ThemeSetting;
