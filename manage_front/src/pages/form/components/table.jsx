import React, { Component } from 'react';
import {
  Table, Form, Row, Col, Button, Modal, Icon, Rate, Switch
} from 'antd';
import Can from 'components/can/index';

import { connect } from 'dva';
import { renderFormComponent, buildWhere, getColumns } from 'components/formItem';

import  moment from 'moment';


@connect(({ general, loading }) => ({ general, loading: loading.models.general }))
@Form.create()
class TablePage extends Component {
  state = {
    current: {
      model: {},
    },
    reload: false,
    sortedInfo: {
      columnKey: '',
      order: '',
    },
    show: {
      opened: false,
      data: {}
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {

    const { current = false } = nextProps;
    const { current: preCurrent = {} } = prevState;
    if (current) {

      if (preCurrent.key !== current.key) {
        return {
          current,
          reload: true,
        };
      }
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.reload) {
      this.init()
      this.setState({ reload: false });
    }
  }

  componentDidMount() {
    this.init()
    this.setState({ reload: false });
  }


  /**
   * 搜索
   *
   * @memberof AdminPage
   */
  handleSearch = (e, page = 1, pageSize = 20, sorter = []) => {
    if (e) {
      e.preventDefault();
    }
    const { form, dispatch, indexs } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }

      dispatch({
        type: 'general/list',
        payload: {
          page,
          pageSize,
          where: [
            ...buildWhere(fieldsValue, indexs),
          ],
          order: sorter,
        }
      })
    });

  }

    /**
   * 表切换
   *
   * @memberof AdminPage
   */
  handleTableChange = (pagination, filters, sorter) => {
    const order = [];
    if (sorter.columnKey) {
      this.setState({
        sortedInfo: sorter,
      })
      order.push([ sorter.columnKey, sorter.order === 'ascend' ? 'asc' : 'desc'])
    }
    this.handleSearch(null, pagination.current, pagination.pageSize, order);
  }

  /**
   * 初始化获取数据
   *
   * @memberof TablePage
   */
  init = () => {
    const { dispatch, form, current } = this.props;

    if (!current.key) {
      return;
    }

    console.log('form table loading data', current.name);

    dispatch({
      type: 'general/save',
      payload: {
        modelKey: current.key,
        type: 'f',
      }
    })
    form.resetFields();
    this.setState({
      sortedInfo: {
        columnKey: '',
        order: '',
      }
    })

    dispatch({
      type: 'general/list',
      payload: {
        page: 1,
        pageSize: 20,
        where: [],
        order: [],
      }
    })
  }

  delete = (id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'general/del',
      payload: id,
    })
  }

  switchChange = (id, key, value) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'general/switchChange',
      payload: {
        id, key, value
      },
    })
  }


  /**
   * 获取搜索字段DOM
   *
   * @returns
   * @memberof AdminPage
   */
  getFields() {
    const { form: { getFieldDecorator }, indexs= [], attrs = [] } = this.props;

    const children = [];

    const labelCol = {
      xs: {span: 12},
      sm: {span: 7},
      xxl: {span: 4},
    };
    const wrapperCol = {
      xs: {span: 12},
      sm: {span: 17},
      xxl: {span: 18},
    };

    for (const attr of attrs) {
      if (indexs.map(i => i.key).includes(attr.key)) {
        children.push(
          <Col sm={12} xs={24} lg={{ span: 8 }} key={attr.key}>
            <Form.Item label={attr.name} labelCol={labelCol} wrapperCol={wrapperCol}>
              {getFieldDecorator(attr.key, {
              })(
                renderFormComponent(attr.type, attr.optionsArray, attr.len, 0, true)
              )}
            </Form.Item>
          </Col>
        );
      }
    }

    if (children.length > 0) {
      children.push(
        <Col sm={12} xs={24} lg={{ span: 8 }} key='s-submit'>
          <Form.Item wrapperCol={{ span: 24 }} >
          <Can api={`GET@/api/f/${this.state.current.key}`}>
            <Button type="primary" htmlType="submit">搜索</Button>
            <Button style={{ marginLeft: 8 }} onClick={this.init}>
              重置
            </Button>
            </Can>
          </Form.Item>
        </Col>
      );
    }

    return children;
  }

  /**
   * 获取搜索表单DOm
   *
   * @memberof TablePage
   */
  renderFilter = () => {
    const { current } =this.props;

    return (
      <div>
        <Form
          className="table-search-form"
          onSubmit={this.handleSearch}
        >
          <Row gutter={24}>{this.getFields()}</Row>
          <Row>
            <Col span={24} style={{ textAlign: 'right'}}>
              <Can api={`GET@/api/f/${current.key}`}>
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
   * 开启编辑框
   *
   * @memberof TablePage
   */
  openModel = (action, record) => {
    this.setState({ edit: { action, opened: true, data: record }})
  }

  /**
   * 关闭编辑框
   *
   * @memberof TablePage
   */
  closeModel = () => {
    this.setState({ edit: { ...this.state.edit, opened: false }})
  }

  show = (data) => {
    this.setState({ show: { opened: true, data }})
  }


  render() {
    const { loading, general: { list: { data = [], page: current = 1, total = 0, pageSize = 20} }, attrs } = this.props;

    return (
      <Can api={`GET@/api/f/${this.state.current.key}`} cannot={null}>

        <Table
          title={this.renderFilter}
          columns={getColumns(
            attrs,
            {
              editable: false,
              can: { delete: `DELETE@/api/f/${this.state.current.key}/:id`},
              delete: (id) => { this.delete(id) },
            },
            this.state.sortedInfo,
            this.switchChange,
            false,
            (record) => {
              return (
                <a onClick={() => { this.show(record) }}>查看详情</a>
              )
            }
          )}
          loading={loading}
          rowKey='id'
          dataSource={data}
          scroll={{ x: 980 }}
          pagination={{
            showSizeChanger: true,
            current,
            total,
            pageSize,
          }}
          onChange={this.handleTableChange}
        >
        </Table>
        <Modal
          footer={null}
          title="查看详情"
          visible={this.state.show.opened}
          onCancel={ () => { this.setState({ show: { opened: false, data: {}}})}}
        >
        {
          attrs.map(att => {
            if (['radio', 'select'].includes(att.type)) {
              for (const option of att.optionsArray) {
                if (option.value === String(this.state.show.data[att.key])) {
                  return <p key={att.key}>{att.name}：{option.label}</p>;
                }
              }
            }

            if (['checkbox'].includes(att.type)) {
              const strs = [];
              for (const option of att.optionsArray) {
                if (Array.isArray(this.state.show.data[att.key]) && this.state.show.data[att.key].includes(option.value)) {
                  strs.push(option.label);
                }
              }
              return <p key={att.key}>{att.name}：{strs.length === 0 ? '-' : strs.join(', ')}</p>;
            }

            if (['img'].includes(att.type) && Array.isArray(this.state.show.data[att.key])) {
              return <p key={att.key}>{att.name}：{
                this.state.show.data[att.key].map(i => (<img key={`${att.key}-${i}`} src={i} alt="" style={{ maxWidth: 400, maxHeight: 400, marginRight: 5 }} />))
              }</p>;
            }

            if (['file'].includes(att.type) && Array.isArray(this.state.show.data[att.key])) {
              return this.state.show.data[att.key].map(i => (
                <p key={`${att.key}-${i}`}>
                  <a href={i} target="black"><Icon type="file" /> {i.split('/')[i.split('/').length - 1]}</a>
                </p>
              ))
            }

            if (['time', 'date', 'datetime'].includes(att.type)) {
              const formats = {
                time: 'HH:mm:ss',
                date: 'YYYY-MM-DD',
                datetime: 'YYYY-MM-DD HH:mm:ss',
              };
              return <p key={att.key}>{att.name}：{
                moment(this.state.show.data[att.key], [moment.ISO_8601, 'YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD', 'HH:mm:ss']).format(formats[att.type])
              }</p>;

            }


            // rate
            if (['rate'].includes(att.type)) {
              return <p key={att.key}>{att.name}：<Rate allowHalf value={this.state.show.data[att.key]} disabled /></p>;
            }

            // richtext
            if (['richtext'].includes(att.type)) {
              return <p key={att.key}>{att.name}：<div key={att.key} dangerouslySetInnerHTML={{ __html: this.state.show.data[att.key] }}></div></p>;
            }

            if (['switch'].includes(att.type)) {
              return <p key={att.key}>{att.name}：<Switch key={att.key} checked={this.state.show.data[att.key] === 1} /></p>;
            }

            return <p key={att.key}>{att.name}：{this.state.show.data[att.key]}</p>;
          })
        }
        </Modal>
      </Can>

    );
  }
}

export default TablePage;
