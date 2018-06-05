import React, { Component } from 'react';
import { Layout, Icon, Dropdown, Select, Menu as AntMenu, LocaleProvider } from 'antd';
import { enquireScreen } from 'enquire-js';
import PropTypes from 'prop-types';
import DrawerMenu from 'rc-drawer-menu';
import Breadcrumb from 'components/breadcrumb';
import { check } from 'components/can/index';
import Menu from 'components/menu';
import router from 'umi/router';
import { connect } from 'dva';
import styles from './index.less';
import { config } from '../common/config';
import menusData from '../common/menu';
import LoginLayout from './login';
import 'rc-drawer-menu/assets/index.css';
import zh_CN from 'antd/lib/locale-provider/zh_CN';

const { Header, Content, Footer, Sider } = Layout;
@connect(({ admin, form }) => ({ admin, mform: form }))
class MainLayout extends Component {
  static childContextTypes = {
    isMobile: PropTypes.bool,
  }

  state = {
    collapsed: false,
    isMobile: false,
    menuform: [],
    reload: false,
    pathname: '',
  }

  componentDidMount() {
    enquireScreen((mobile) => {
      this.setState({
        isMobile: mobile,
        collapsed: mobile,
      });
    });

    this.init()
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const _ = {};
    const { mform = [] } = nextProps;
    _.menuform = menusData(mform.list)

    if (nextProps.location.pathname === '/login') {
      return {
        ..._,
        pathname: '/login'
      }
    }

    if (prevState.pathname === '/login' && nextProps.location.pathname !== '/login') {
      return {
        ..._,
        reload: true,
        pathname: nextProps.location.pathname,
      }
    }

    if (_.menuform) {
      return _;
    }

    return null;
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.reload) {
      this.init()
      this.setState({ reload: false });
    }
  }


  init = () => {
    console.log('init layout');
    if (this.props.location.pathname !== '/login'){
      this.props.dispatch({
        type: 'form/list',
      })
    }

    const Authorization = localStorage.token || sessionStorage.token;

    if (this.props.location.pathname !== '/login' && !Authorization) {
      sessionStorage.prePath = this.props.location.pathname;
      router.push('/login');
    }

    // 首次打开 且有token 没有获取过用户数据 获取用户数据
    if (!this.props.admin.fetch && (localStorage.token || sessionStorage.token)) {
      this.props.dispatch({
        type: 'admin/fetch'
      })
    }
  }


  getChildContext() {
    return { isMobile: this.state.isMobile };
  }

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  changeCollapsed = (tf) => {
    this.setState({
      collapsed: tf,
    });
  }

  changeSite = (value) => {
    this.props.dispatch({
      type: 'admin/changeSite',
      payload: value,
    })
  }

  handleUserBar = ({ key }) => {
    if (this[key] && typeof this[key] === 'function') {
      this[key]();
    }

  }

  logout = () => {
    this.props.dispatch({
      type: 'admin/logout',
    })
  }

  password = () => {
    router.push('/password');
  }

  render() {
    const { admin, location, children  } = this.props;
    if (location.pathname === '/login') {
      return <LoginLayout>{ children }</LoginLayout>
    }

    return (
      <LocaleProvider locale={zh_CN}>
        <Layout className={styles.main}>
          {this.state.isMobile ?
            <DrawerMenu
              parent={null}
              level={null}
              iconChild={null}
              open={!this.state.collapsed}
              onMaskClick={() => { this.changeCollapsed(true); }}
              handleStyle={{ display: 'none' }}
              width="256px"
            >
              <Sider
                trigger={null}
                collapsible
                breakpoint="lg"
                collapsed={this.state.isMobile ? false : this.state.collapsed}
                width={256}
                className={styles.sider}
              >
                <div className={styles.logo} >
                  <img src={config.logo} alt=""/>
                  <h1>{config.name}</h1>
                </div>
                <Menu menudata={this.state.menuform} location={this.props.location} permission={admin.permission} small={this.state.collapsed}/>
              </Sider>
            </DrawerMenu>
          : <Sider
            trigger={null}
            collapsible
            breakpoint="lg"
            collapsed={this.state.collapsed}
            width={256}
            className={styles.sider}
          >
            <div className={styles.logo} >
              <img src={config.logo} alt=""/>
              <h1>{config.name}</h1>
            </div>
            <Menu menudata={this.state.menuform} location={this.props.location} permission={admin.permission} small={this.state.collapsed}/>
          </Sider>}

          <Layout>
            <Header style={{ background: '#fff', padding: 0 }}>
              <Icon
                className={styles.trigger}
                type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                onClick={this.toggle}
              />

              <div className={styles.right}>

                <Select value={admin.currentSite.id} onChange={this.changeSite} className={styles.item} dropdownMatchSelectWidth={false}>
                  { admin.site.map(i => (
                    <Select.Option key={i.id} value={i.id}>
                      { i.name }
                    </Select.Option>
                  ))}
                </Select>

                <Dropdown
                  overlay={
                    <AntMenu onClick={this.handleUserBar}>
                      <AntMenu.Item key="password" disabled={!check('PUT@/api/admin/password')}>
                        重置密码
                      </AntMenu.Item>
                      <AntMenu.Divider />
                      <AntMenu.Item key="logout">退出登录</AntMenu.Item>
                    </AntMenu>
                  }
                  placement="bottomRight"
                  trigger={[ 'hover', 'click']}
                >
                  <span className={styles.item}> <Icon type="user" /> { admin.info.nickname }</span>
                </Dropdown>

              </div>
            </Header>

            <Breadcrumb style={{ margin: '24px 16px 0px 16px' }} routes={this.props.route.routes} location={this.props.location}/>

            <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
              { children }
            </Content>

            <Footer style={{ textAlign: 'center' }}>
              { config.copy }
            </Footer>
          </Layout>
        </Layout>
      </LocaleProvider>
    );
  }
}

export default MainLayout;
