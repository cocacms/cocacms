import React, { Component } from "react";
import styles from "./index.less";
import name from "components/name";
import { Icon } from "antd";

@name("首页", true, <Icon type="home" style={{ marginRight: 5 }} />)
class IndexPage extends Component {
  state = {};

  componentDidMount() {}

  render() {
    return <div className={styles.title}>欢迎使用！</div>;
  }
}

export default IndexPage;
