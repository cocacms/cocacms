import React, { Component } from 'react';
import name from 'components/name';

@name('管理员与权限', false)
class L extends Component {
  state = {};
  render() {
    return <div>{this.props.children}</div>;
  }
}

export default L;
