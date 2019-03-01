import React, { Component } from "react";
import { Table, Form, Row, Col, Button, Modal, Select } from "antd";
import Can from "components/can/index";

import { connect } from "dva";
import { renderFilterForm, buildWhere, getColumns } from "components/formItem";

import attHandle from "./att";

@connect(({ general, loading }) => ({
  general,
  loading: loading.models.general
}))
@Form.create()
class TablePage extends Component {
  state = {
    current: {
      model: {}
    },
    reload: false,
    sortedInfo: {},
    show: {
      opened: false,
      data: {}
    }
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const { current = false } = nextProps;
    const { current: preCurrent = {} } = prevState;
    if (current) {
      if (preCurrent.key !== current.key) {
        return {
          current,
          reload: true
        };
      }
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.reload) {
      this.init();
      this.setState({ reload: false });
    }
  }

  componentDidMount() {
    this.init();
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
    form.validateFieldsAndScroll((err, fieldsValue) => {
      if (err) {
        return;
      }

      dispatch({
        type: "general/list",
        payload: {
          page,
          pageSize,
          where: [...buildWhere(fieldsValue, indexs)],
          order: sorter
        }
      });
    });
  };

  /**
   * 表切换
   *
   * @memberof AdminPage
   */
  handleTableChange = (pagination, filters, sorter) => {
    const order = [];
    this.setState({
      sortedInfo: sorter
    });
    if (sorter.columnKey) {
      order.push([
        sorter.columnKey,
        sorter.order === "ascend" ? "asc" : "desc"
      ]);
    }
    this.handleSearch(null, pagination.current, pagination.pageSize, order);
  };

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

    console.log("form table loading data", current.name);

    dispatch({
      type: "general/save",
      payload: {
        modelKey: current.key,
        type: "f"
      }
    });
    form.resetFields();
    this.setState({
      sortedInfo: {}
    });

    dispatch({
      type: "general/list",
      payload: {
        page: 1,
        pageSize: 20,
        where: [],
        order: []
      }
    });
  };

  delete = id => {
    const { dispatch } = this.props;
    dispatch({
      type: "general/del",
      payload: id
    });
  };

  switchChange = (id, key, value) => {
    const { dispatch } = this.props;
    dispatch({
      type: "general/switchChange",
      payload: {
        id,
        key,
        value
      }
    });
  };

  /**
   * 获取搜索字段DOM
   *
   * @returns
   * @memberof AdminPage
   */
  getFields() {
    const {
      form: { getFieldDecorator },
      indexs = [],
      attrs = [],
      category = []
    } = this.props;

    let children = [];

    const labelCol = {
      xs: { span: 12 },
      sm: { span: 7 },
      xxl: { span: 4 }
    };
    const wrapperCol = {
      xs: { span: 12 },
      sm: { span: 17 },
      xxl: { span: 18 }
    };

    children.push(
      <Col sm={12} xs={24} lg={{ span: 8 }} key="form_model_id">
        <Form.Item label="分类" labelCol={labelCol} wrapperCol={wrapperCol}>
          {getFieldDecorator("form_model_id")(
            <Select placeholder="请选择" style={{ width: "100%" }}>
              {category.map(i => (
                <Select.Option value={i.id} key={i.id}>
                  {i.title || "-"}
                </Select.Option>
              ))}
            </Select>
          )}
        </Form.Item>
      </Col>
    );

    children = renderFilterForm(
      attrs,
      indexs,
      labelCol,
      wrapperCol,
      getFieldDecorator,
      children
    );

    children.push(
      <Col sm={12} xs={24} lg={{ span: 8 }} key="s-submit">
        <Form.Item wrapperCol={{ span: 24 }}>
          <Can api={`GET@/api/f/${this.state.current.key}`}>
            <Button type="primary" htmlType="submit">
              搜索
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.init}>
              重置
            </Button>
          </Can>
        </Form.Item>
      </Col>
    );

    return children;
  }

  /**
   * 获取搜索表单DOm
   *
   * @memberof TablePage
   */
  renderFilter = () => {
    return (
      <div>
        <Form className="table-search-form" onSubmit={this.handleSearch}>
          <Row gutter={24}>{this.getFields()}</Row>
        </Form>
      </div>
    );
  };

  /**
   * 开启编辑框
   *
   * @memberof TablePage
   */
  openModel = (action, record) => {
    this.setState({ edit: { action, opened: true, data: record } });
  };

  /**
   * 关闭编辑框
   *
   * @memberof TablePage
   */
  closeModel = () => {
    this.setState({ edit: { ...this.state.edit, opened: false } });
  };

  show = data => {
    this.setState({ show: { opened: true, data } });
  };

  render() {
    const {
      loading,
      general: {
        list: { data = [], page: current = 1, total = 0, pageSize = 20 }
      },
      attrs
    } = this.props;

    return (
      <Can api={`GET@/api/f/${this.state.current.key}`} cannot={null}>
        <Table
          title={this.renderFilter}
          columns={getColumns(
            attrs,
            {
              editable: false,
              can: { delete: `DELETE@/api/f/${this.state.current.key}/:id` },
              delete: id => {
                this.delete(id);
              }
            },
            this.state.sortedInfo,
            this.switchChange,
            false,
            record => {
              return (
                <a
                  onClick={() => {
                    this.show(record);
                  }}
                >
                  查看详情
                </a>
              );
            }
          )}
          loading={loading}
          rowKey="id"
          dataSource={data}
          scroll={{ x: 980 }}
          pagination={{
            showSizeChanger: true,
            current,
            total,
            pageSize
          }}
          onChange={this.handleTableChange}
        />
        <Modal
          footer={null}
          title="查看详情"
          visible={this.state.show.opened}
          onCancel={() => {
            this.setState({ show: { opened: false, data: {} } });
          }}
        >
          {attrs.map(att => attHandle(this.state.show.data, att))}
        </Modal>
      </Can>
    );
  }
}

export default TablePage;
