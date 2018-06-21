import React, { Component } from 'react';
import { Form, Input, Button, Spin } from 'antd';
import Can from 'components/can/index';
import PropTypes from 'prop-types';
import { formItemLayout, tailFormItemLayout } from '../../../common/formCol';
import { renderForm } from 'components/formItem';
import { connect } from 'dva';

@Form.create()
@connect(({ general, loading }) => ({ general, loading: loading.models.general }))
class DefaultSetting extends Component {
  state = {
    reload: false,
    current: {},
  }

  static contextTypes = {
    isMobile: PropTypes.bool,
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { current = false } = nextProps;
    const { current: preCurrent = {} } = prevState;
    if (current) {
      if (preCurrent.id !== current.id) {
        return {
          current,
          reload: true,
        };
      }
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.reload) {
      this.init()
      this.setState({ reload: false });
    }
  }

  componentDidMount() {
    this.init()
    this.setState({ reload: false });
  }

  init = () => {
    const { dispatch, form, current } = this.props;

    console.log('form loading data', current.name);

    dispatch({
      type: 'general/save',
      payload: {
        modelKey: current.model.key,
        type: 'g',
        data: {},
      }
    })

    form.resetFields();

    if (current.bind) {
      dispatch({
        type: 'general/show',
        payload: current.bind
      })
    }

  }


  onSubmit = (e) => {

    const { dispatch } = this.props;

    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
      if (err) {
        return;
      }

      fieldsValue.category_id = this.state.current.id;

      if (fieldsValue.id) {
        // 更新
        dispatch({
          type: 'general/edit',
          payload: fieldsValue,
          reload: false,
          cb: () => {
            dispatch({
              type: 'general/show',
              payload: fieldsValue.id
            })
          }
        })
      } else {
        // 新增
        dispatch({
          type: 'general/add',
          payload: fieldsValue,
          reload: false,
          cb: (data) => {
            dispatch({
              type: 'category/bind',
              payload: {
                id: this.state.current.id,
                bind: data.insertId,
              },
              cb: () => {
                console.log('reload data', data.insertId);

                dispatch({
                  type: 'general/show',
                  payload: data.insertId,
                })

                dispatch({
                  type: 'content/fetchCategory',
                })
              }
            })
          }
        })
      }

    });
  }

  render() {
    const { attrs, rules, form: { getFieldDecorator }, general: { data = {} }, loading } = this.props;

    return (
      <Spin spinning={loading ? true : false}>
        <Form className="page-form" layout={this.context.isMobile ? 'vertical' : 'horizontal'} onSubmit={this.onSubmit}>

          {getFieldDecorator('id', {
            initialValue: data.id
          })(
            <Input type="hidden" disabled/>
          )}

          { renderForm(attrs, rules, data, getFieldDecorator, formItemLayout)}

          <Form.Item {...tailFormItemLayout}>
            <Can api="POST@/api/config" cannot={<Button type="primary" disabled>提交</Button>}>
              <Button type="primary" htmlType="submit">提交</Button>
            </Can>
          </Form.Item>

        </Form>
      </Spin>

    );
  }
}

export default DefaultSetting;
