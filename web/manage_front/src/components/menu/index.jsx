import React, { Component } from 'react';
import { Menu, Icon } from 'antd';
import router from 'umi/router';
import styles from './index.less';
import pathToRegexp from 'path-to-regexp';

const tree2flat = (data, parent = [], permission = []) => {
  let result = [];
  for (const iterator of data) {
    iterator.parent = parent;
    // 权限验证
    if (iterator.can) {
      if (!permission.includes(iterator.can)) {
        continue;
      }
    }
    if (iterator.children && iterator.children.length > 0) {
      result = result.concat(
        tree2flat(
          iterator.children,
          [...parent, `_sub_${iterator.path}`],
          permission
        )
      );
    } else {
      result.push(iterator);
    }
  }

  return result;
};

const getCurrent = (pathname, permission = [], menudata) => {
  const data = tree2flat(menudata, [], permission); // 数转扁平 带权限验证

  const result = data.filter(i => {
    if (typeof i.path === 'string') {
      return pathToRegexp(i.path).exec(pathname);
    } else if (i.path.reg) {
      return pathToRegexp(i.path.reg).exec(pathname);
    }
  }); // 根据path匹配

  if (result.length > 0) {
    return [...result[0].parent, result[0].path];
  }
  return [];
};

class Menus extends Component {
  state = {
    selected: [],
    opened: [],
    currentPath: '',
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    let opened = prevState.opened;
    let currentPath = prevState.currentPath;
    let selected = prevState.selected;
    if (prevState.currentPath !== nextProps.location.pathname) {
      // 路由变化，重新计算展开项
      currentPath = nextProps.location.pathname;
      const current = getCurrent(
        nextProps.location.pathname,
        nextProps.permission,
        nextProps.menudata
      ); // 回去当前选择的菜单扁平树结构
      if (current.length === 0) {
        // 没有找到，不变化
        return null;
      }

      opened = current.filter(
        i => typeof i === 'string' && i.indexOf('_sub_') === 0
      ); // 取出展开项

      if (nextProps.small === true) {
        // 缩小状态下，默认不展开
        opened = [];
      }

      selected = current
        .map(i => {
          if (typeof i !== 'string') {
            return pathToRegexp.compile(i.reg)(i.params);
          }
          return i;
        })
        .filter(i => i.indexOf('_sub_') === -1); // 取出非展开项 即选择的菜单

      return {
        opened,
        selected,
        currentPath,
      };
    }

    return null;
  }

  getIcon = icon => {
    if (typeof icon === 'string' && icon.indexOf('http') === 0) {
      return <img src={icon} alt="icon" className={styles.icon} />;
    }
    if (typeof icon === 'string') {
      return <Icon type={icon} />;
    }
    return icon;
  };

  buildMenu = menus => {
    const { permission = [] } = this.props;
    return menus.map(i => {
      // 权限验证
      if (i.can) {
        if (!permission.includes(i.can)) {
          return null;
        }
      }

      if (i.children && i.children.length > 0) {
        if (this.buildMenu(i.children).filter(i => i !== null).length === 0) {
          return null;
        }
        return (
          <Menu.SubMenu
            key={`_sub_${i.path}`}
            title={
              <span>
                {this.getIcon(i.icon)}
                <span>{i.name}</span>
              </span>
            }
          >
            {this.buildMenu(i.children)}
          </Menu.SubMenu>
        );
      } else if (typeof i.path === 'string' && i.path.indexOf('/') === 0) {
        return (
          <Menu.Item key={i.path}>
            {this.getIcon(i.icon)}
            <span>{i.name}</span>
          </Menu.Item>
        );
      } else if (
        typeof i.path.reg === 'string' &&
        i.path.reg.indexOf('/') === 0
      ) {
        return (
          <Menu.Item key={pathToRegexp.compile(i.path.reg)(i.path.params)}>
            {this.getIcon(i.icon)}
            <span>{i.name}</span>
          </Menu.Item>
        );
      }

      return null;
    });
  };

  onSelect = ({ item, key, selectedKeys }) => {
    router.push(key);
  };

  onOpenChange = openKeys => {
    this.setState({
      opened: openKeys,
    });
  };

  render() {
    return (
      <Menu
        theme="dark"
        mode="inline"
        onSelect={this.onSelect}
        onOpenChange={this.onOpenChange}
        selectedKeys={this.state.selected}
        openKeys={this.state.opened}
      >
        {this.buildMenu(this.props.menudata)}
      </Menu>
    );
  }
}

export default Menus;
