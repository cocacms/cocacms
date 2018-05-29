import React, { Component } from 'react';
import styles from './login.less';
import { config } from '../common/config';

class LoginLayout extends Component {
  state = {  }
  render() {
    return (
      <div className={styles.container}>
        <div className={styles.box}>
          <h1 className={styles.title}>
            <img src={config.logo} alt="" className={styles.logo} />
            <span>{config.name}</span>
          </h1>
          { this.props.children }
        </div>

        <div className={styles.copy}>{config.copy}</div>
      </div>
    );
  }
}

export default LoginLayout;
