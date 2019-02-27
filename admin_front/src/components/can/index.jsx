import React from 'react';
import { connect } from 'dva';
import DefaultNoMatch from './defaultNoMatch';

export const CheckPermissions = (api, permissions, target, Exception) => {
  if (api === true) {
    return target;
  }
  if (permissions.includes(api)) {
    return target;
  }
  if (Exception === null) {
    return <DefaultNoMatch />;
  }
  return Exception === false ? null : Exception;
};

export function check(api) {
  const state = window.g_app._store.getState();
  const {
    admin: { permission = [] },
  } = state;

  if (api === true) {
    return true;
  }
  if (permission.includes(api)) {
    return true;
  }

  return true;
}

@connect(({ admin }) => ({ admin }))
class Can extends React.Component {
  render() {
    const { api = true, children, admin, cannot = false } = this.props;
    const childrenRender = typeof children === 'undefined' ? null : children;
    return CheckPermissions(api, admin.permission, childrenRender, cannot);
  }
}

export default Can;
