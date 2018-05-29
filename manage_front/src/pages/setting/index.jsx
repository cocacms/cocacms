import React, { Component } from 'react';
import { connect } from 'dva';
import { Tabs, Spin } from 'antd';
import name from 'components/name';
import Can from 'components/can/index';

import DefaultSetting from './components/index';
import CompanySetting from './components/company';
import UploadSetting from './components/upload';
import ThemeSetting from './components/theme';

const TabPane = Tabs.TabPane;

@connect(({ config, loading }) => ({ config, loading: loading.models.config }))
@name('系统配置')
class SettingPage extends Component {
  state = {
    isMobile: false,
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'config/fetch',
    });
  }

  submit = (data, scope) => {
    this.props.dispatch({
      type: 'config/set',
      payload: { data, scope }
    })
  }

  render() {
    const { loading } = this.props;
    return (
      <Can api="GET@/api/config">
        <Spin spinning={loading}>
          <Tabs>
            <TabPane tab={<span>基础配置</span>} key="defaultSetting">
              <DefaultSetting submit={this.submit}/>
            </TabPane>

            <TabPane tab={<span>公司信息</span>} key="companySetting">
              <CompanySetting submit={this.submit} />
            </TabPane>

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
