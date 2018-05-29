import React, { Component } from 'react';
import {
  Table, Form, Row, Col, Button, Icon, Rate
} from 'antd';
import Action from 'components/action';
import Can from 'components/can/index';

import { connect } from 'dva';
import moment from 'moment';
import { renderFormComponent, buildWhere } from 'components/formItem';




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

  /**
   * 字段定义
   *
   * @memberof TablePage
   */
  getColumns = () => {
    const { attrs, current = {} } = this.props;

    const columns = [
      {
        dataIndex: 'id',
        width: 80,
        sorter: true,
        title: 'ID',
        sortOrder: this.state.sortedInfo.columnKey === 'id' && this.state.sortedInfo.order,
      }
    ];

    for (const attr of attrs) {
      if (attr.tableable === 1) {
        columns.push({
          title: attr.name,
          sorter: attr.sortable === 1,
          sortOrder: this.state.sortedInfo.columnKey === attr.key && this.state.sortedInfo.order,
          dataIndex: attr.key,
          align: 'center',
          render: (text, record) => {
            // 单选，选择框 数据显示转换
            if (['radio', 'select'].includes(attr.type)) {
              for (const option of attr.optionsArray) {
                if (option.value === String(text)) {
                  return option.label;
                }
              }

              return '-';
            }

            // 多选 数据显示转换
            if (['checkbox'].includes(attr.type) && Array.isArray(text)) {
              const strs = [];
              for (const option of attr.optionsArray) {
                if (text.includes(option.value)) {
                  strs.push(option.label);
                }
              }

              return strs.length === 0 ? '-' : strs.join(', ');
            }

            // 图片 数据显示转换
            if (['img'].includes(attr.type) && Array.isArray(text)) {
              return text.map(i => (<img key={i} src={i} alt="" style={{ maxWidth: 40, maxHeight: 40, marginRight: 5 }} />))
            }

            // 文件 数据显示转换
            if (['file'].includes(attr.type) && Array.isArray(text)) {
              return text.map(i => (
                <p>
                  <a href={i} target="black"><Icon type="file" /> {i.split('/')[i.split('/').length - 1]}</a>
                </p>
              ))
            }

            // 时间
            if (['time', 'date', 'datetime'].includes(attr.type)) {
              const formats = {
                time: 'HH:mm:ss',
                date: 'YYYY-MM-DD',
                datetime: 'YYYY-MM-DD HH:mm:ss',
              };
              return moment(text, ['YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD', 'HH:mm:ss']).format(formats[attr.type])
            }


            // rate
            if (['rate'].includes(attr.type)) {
              return <Rate allowHalf value={text} disabled/>;
            }

            // richtext
            if (['richtext'].includes(attr.type)) {
              return <div dangerouslySetInnerHTML={{__html: text}}></div>;
            }

            return text;
          }

        })
      }
    }

    columns.push({
      title: '操作',
      width: 180,
      align: 'center',
      render: (text, record) => {
        return (
          <Action
            editable={false}
            can={{ delete: `DELETE@/api/f/${current.key}/:id`}}
            delete={() => { this.delete(record.id) }}
          >
          </Action>
        )

      }
    });

    return columns;
  }

  render() {
    const { loading, general: { list: { data = [], page: current = 1, total = 0, pageSize = 20} } } = this.props;

    return (
      <Can api={`GET@/api/f/${this.state.current.key}`} cannot={null}>

        <Table
          title={this.renderFilter}
          columns={this.getColumns()}
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

      </Can>

    );
  }
}

export default TablePage;
