import React, { Component } from 'react';
import {
  Divider, Popconfirm
} from 'antd';
import Can from 'components/can'

class Action extends Component {
  state = {  }

  renderList = () => {
    const { editable = true, deleteable = true, children, can: { edit : canedit = true,  delete : candelete = true} = {} } = this.props;
    let child = [];
    if (editable) {
      child.push(
        <Can api={canedit} key={`edit_${Math.random()}`}>
        <a onClick={this.props.edit}>编辑</a>
        </Can>
      );
    }
    if (deleteable) {
      child.push(
        <Can api={candelete} key={`delete_${Math.random()}`} >
          <Popconfirm title="确定要删除吗，删除后数据可能不可恢复？" okText="删除" cancelText="取消" okType="danger" placement="topRight" onConfirm={this.props.delete}>
            <a className="danger">删除</a>
          </Popconfirm>
        </Can>
        );
    }
    if (children !== undefined) {
      child = child.concat(children);
    }
    const returns = [];
    for (let index = 0; index < child.length; index++) {
      const element = child[index];
      returns.push(element);
      if (index < child.length - 1) {
        returns.push(<Divider key={`divider_${Math.random()}`} type="vertical"/>);
      }
    }

    return returns;
  }

  render() {
    return (
      <div>
        { this.renderList() }
      </div>

    );
  }
}

export default Action;
