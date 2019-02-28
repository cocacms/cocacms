/**
 * title: 首页
 * icon: home
 */
import React, { Component } from "react";
import styles from "./index.less";

class IndexPage extends Component {
  state = {};

  componentDidMount() {}

  render() {
    return <div className={styles.title}>欢迎使用！</div>;
  }
}

export default IndexPage;
