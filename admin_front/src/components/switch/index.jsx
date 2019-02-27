import React, { Component } from 'react';
import { Switch } from 'antd';

class SwitchNumber extends Component {
  state = {};

  onChange = checked => {
    if (this.props.onChange && typeof this.props.onChange === 'function') {
      this.props.onChange(checked ? 1 : 0);
    }
  };

  render() {
    return (
      <Switch
        {...this.props}
        onChange={this.onChange}
        checked={this.props.value === 1}
      />
    );
  }
}

export default SwitchNumber;
