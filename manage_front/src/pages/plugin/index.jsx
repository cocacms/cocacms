import React, { Component } from 'react';
import {
  Table, Form, Row, Col, Button, Switch, Popconfirm
} from 'antd';
import name from 'components/name';
import Can from 'components/can/index';
import { connect } from 'dva';

@connect(({ plugin, loading }) => ({ plugin, loading: loading.models.plugin }))
@Form.create()
@name('插件管理')
class PluginPage extends Component {
  state = {
  }

  componentDidMount() {
    this.init()
  }

  /**
   * 初始化获取数据
   *
   * @memberof PluginPage
   */
  init = () => {
    const { dispatch, form } = this.props;
    form.resetFields();
    dispatch({
      type: 'plugin/list',
    })
  }

  reload = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'plugin/reload',
    })
  }

  toggle = (id, enable) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'plugin/toggle',
      payload: {
        id, enable
      }
    })
  }

  install = (id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'plugin/install',
      payload: {
        id
      }
    })
  }


  uninstall = (id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'plugin/uninstall',
      payload: {
        id
      }
    })
  }


  /**
   * 获取搜索表单DOm
   *
   * @memberof PluginPage
   */
  renderFilter = () => {
    return (
      <div>
        <Form
          className="table-search-form"
          onSubmit={this.handleSearch}
        >
          <Row>
            <Col span={24} style={{ textAlign: 'right'}}>
              <Can api="GET@/api/plugin/load">
              <Button onClick={this.reload} type="dashed" icon="reload">
                重新导入
              </Button>
              </Can>
              <Can api="GET@/api/plugin">
              <Button onClick={this.init} className="refresh-btn">
                刷新
              </Button>
              </Can>
            </Col>
          </Row>
        </Form>

      </div>

    )
  }

  /**
   * 字段定义
   *
   * @memberof PluginPage
   */
  getColumns = () => ([
    {
      dataIndex: 'id',
      width: 100,
      title: 'ID',
    },
    {
      dataIndex: 'dirname',
      title: '包名',
    },
    {
      dataIndex: 'name',
      title: '名称',
    },
    {
      dataIndex: 'type',
      title: '类型',
      render: (text, record) => {
        if (text === 2) {
          return '上传插件';
        }
        return '普通插件';
      }
    },
    {
      dataIndex: 'author',
      title: '作者',
    },
    {
      dataIndex: 'mail',
      title: '邮箱',
    },
    {
      dataIndex: 'enable',
      title: '启用',
      width: 100,
      align: 'center',
      render: (text, record) => {
        return (
          <Switch checked={text === 1} onChange={(checked) => {
            this.toggle(record.id, text === 1 ? 0 : 1);
          }} />
        )
      }
    },
    {
      dataIndex: 'installed',
      title: '安装/卸载',
      width: 180,
      align: 'center',
      render: (text, record) => {
        if (text !== 1) {
          return <a onClick={() => { this.install(record.id); }}>安装</a>;
        }
        return <Popconfirm title="确定要卸载吗，卸载后数据有可能不可恢复？" okText="卸载" cancelText="取消" okType="danger" placement="topRight"
          onConfirm={() => { this.uninstall(record.id); }}>
          <a className="danger">卸载</a>
        </Popconfirm>;
      }
    }
  ])

  render() {
    const { loading, plugin: { list = [] } } = this.props;
    return (
      <Can api="GET@/api/plugin" cannot={null}>

        <Table
          title={this.renderFilter}
          columns={this.getColumns()}
          loading={loading}
          rowKey='id'
          dataSource={list}
          scroll={{ x: 980 }}
          pagination={false}
        >
        </Table>
      </Can>

    );
  }
}

export default PluginPage;
