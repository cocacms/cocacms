/**
 * title: 数据汇总
 */
import React, { Component } from "react";
import { Icon, Spin } from "antd";
import { connect } from "dva";

import TablePage from "./components/table";

@connect(({ form }) => ({ form }))
class Page extends Component {
  state = {
    key: null
  };

  componentDidMount() {
    this.init(this.props.match.params.key);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.key !== nextProps.match.params.key) {
      return { key: nextProps.match.params.key };
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.key !== this.state.key) {
      this.init(this.state.key);
    }
  }

  init = async key => {
    console.log("init data ", key);
    const { dispatch } = this.props;
    const data = await dispatch({
      type: "form/fetchForm",
      payload: key
    });
    await dispatch({
      type: "form/fetchFormDataProps",
      payload: data
    });
  };

  onChangeCategory = value => {
    this.setState({
      where: { form_model_id: value }
    });
  };

  componentWillUnmount() {
    // isMount = false;
    const { dispatch } = this.props;
    dispatch({
      type: "form/save",
      payload: {
        attrs: [],
        rules: {},
        indexs: [],
        current: {}
      }
    });
  }

  render() {
    const {
      form: { attrs = [], rules = {}, indexs = [], current = {}, category = [] }
    } = this.props;

    return (
      <div>
        <h2>{current.name}</h2>
        {current.key ? (
          <TablePage
            current={current}
            attrs={attrs}
            rules={rules}
            indexs={indexs}
            category={category}
          />
        ) : (
          <div style={{ textAlign: "center" }}>
            <Spin
              indicator={<Icon type="loading" style={{ fontSize: 24 }} spin />}
            />
          </div>
        )}
      </div>
    );
  }
}

export default Page;
