import React, { Component } from 'react';
import { connect } from 'dva';
import { Tabs, Spin } from 'antd';
import name from 'components/name';
import Can from 'components/can/index';

import AutoSetting from './components/auto';
import UploadSetting from './components/upload';
import ThemeSetting from './components/theme';

const TabPane = Tabs.TabPane;

@connect(({ config, loading }) => ({ config, loading: loading.models.config }))
@name('系统配置')
class SettingPage extends Component {
  state = {
    activeKey: 'uploadSetting',
    settings: [],
    isMobile: false,
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'config/fetch',
      cb: () => {
        this.loadSetting();
      },
    });
  }

  async loadSetting() {
    const {
      config: { models = [] },
    } = this.props;
    const configList = models.filter(
      i => i.type === 2 && Array.isArray(i.attrs) && i.attrs.length > 0
    );
    const settings = [];
    for (const config of configList) {
      settings.push(config);
    }

    const activeKey = this.props.match.params.activeKey || null;
    this.setState({
      activeKey: activeKey
        ? activeKey
        : settings.length > 0
          ? settings[0].key
          : 'uploadSetting',
      settings,
    });
  }

  submit = (data, scope) => {
    this.props.dispatch({
      type: 'config/set',
      payload: { data, scope },
    });
  };

  render() {
    const { loading } = this.props;
    return (
      <Can api="GET@/api/config">
        <Spin spinning={loading}>
          <Tabs
            activeKey={this.state.activeKey}
            onChange={activeKey => {
              this.setState({ activeKey });
            }}
          >
            {this.state.settings.map(setting => {
              return (
                <TabPane tab={<span>{setting.name}</span>} key={setting.key}>
                  <AutoSetting
                    submit={this.submit}
                    keyName={setting.key}
                    attrs={setting.attrs}
                  />
                </TabPane>
              );
            })}

            <TabPane tab={<span>上传设置</span>} key="uploadSetting">
              <UploadSetting submit={this.submit} />
            </TabPane>

            <TabPane tab={<span>主题模板配置</span>} key="themeSetting">
              <ThemeSetting submit={this.submit} />
            </TabPane>
          </Tabs>
        </Spin>
      </Can>
    );
  }
}

export default SettingPage;
