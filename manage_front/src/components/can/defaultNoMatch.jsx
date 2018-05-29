import React, { Component } from 'react';
import { Alert } from 'antd';

class DefaultNoMatch extends Component {
  state = {  }
  render() {
    return (
      <Alert
        message="提示"
        description="您没有操作权限"
        type="error"
        showIcon
      />
    );
  }
}

export default DefaultNoMatch;
