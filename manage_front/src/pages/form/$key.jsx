import React, { Component } from 'react';
import { Icon, Spin } from 'antd';
import TablePage from './components/table';
import { connect } from 'dva';
import name from 'components/name';

@connect(({ form }) => ({ form }))
@name('数据汇总')
class Page extends Component {
  state = {
    reload: false,
    key: '',
   }
  componentDidMount() {
    const { match: { params }} = this.props;
    this.init(params.key);
  }

  static getDerivedStateFromProps(nextProps, prevState) {

    const { match: { params } } = nextProps;
    const { key } = prevState;
    if (params.key) {
      if (key !== params.key) {
        return {
          key: params.key,
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

  init = (key = false) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'form/fetchFormDataProps',
      payload: key ? key : this.state.key
    })
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'form/save',
      payload: {
        attrs: [],
        rules: {},
        indexs: [],
        current: {}
      }
    })
  }

  render() {
    const { form: { attrs = [], rules = {}, indexs = [], current = {} }} = this.props;

    return (
      <div>
        <h2>{current.name}</h2>
        {
          current.key ?
            <TablePage current={current} attrs={attrs} rules={rules} indexs={indexs} /> :
            <div style={{ textAlign: 'center' }}>
              <Spin indicator={<Icon type="loading" style={{ fontSize: 24 }} spin />} />
            </div>
        }

      </div>
    );
  }
}

export default Page;
