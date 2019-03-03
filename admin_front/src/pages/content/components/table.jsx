import React, { Component } from "react";
import { Table, Form, Row, Col, Button, Input, Modal, TreeSelect } from "antd";
import Can from "components/can/index";

import { connect } from "dva";
import {
  renderForm,
  buildWhere,
  getColumns,
  renderFilterForm
} from "components/formItem";

const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 15 }
};

@Form.create()
@connect(({ category, loading }) => ({
  category,
  loading: loading.models.category
}))
class Edit extends Component {
  state = {
    current: {},
    reload: false
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const { current = false } = nextProps;
    const { current: preCurrent = {} } = prevState;
    if (current) {
      if (preCurrent.id !== current.id) {
        return {
          current,
          reload: true
        };
      }
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState) {
    const { dispatch } = this.props;
    if (this.state.reload) {
      dispatch({
        type: "category/treeFilterModel",
        payload: this.state.current.model.id
      });

      this.setState({ reload: false });
    }
  }

  onOk = () => {
    const { form, action } = this.props;
    form.validateFieldsAndScroll((err, fieldsValue) => {
      if (err) return;
      this.props[action](fieldsValue, form.resetFields);
    });
  };

  render() {
    const {
      action,
      opened,
      data = {},
      close,
      form: { getFieldDecorator },
      category: { treeFilterModel = [] },
      current = {},
      attrs,
      showCategory = true,
      rules
    } = this.props;

    return (
      <Modal
        title={action === "add" ? "添加" : "编辑"}
        visible={opened}
        onCancel={close}
        onOk={this.onOk}
        width={current.model.width ? current.model.width : "50%"}
        style={{ top: "5vh" }}
        bodyStyle={{ maxHeight: "80vh", overflowY: "auto" }}
      >
        <Form>
          {getFieldDecorator("id", {
            initialValue: data.id
          })(<Input type="hidden" disabled />)}

          {showCategory && (
            <Form.Item {...formItemLayout} label="所属栏目">
              {getFieldDecorator("category_id", {
                initialValue:
                  data.category_id === undefined
                    ? String(current.id)
                    : String(data.category_id),
                rules: [{ required: true, message: "请设置所属栏目" }]
              })(
                <TreeSelect
                  dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
                  treeData={treeFilterModel}
                  treeNodeLabelProp="name"
                  treeNodeFilterProp="id"
                  placeholder="请选择"
                  treeDefaultExpandAll
                />
              )}
            </Form.Item>
          )}

          {renderForm(attrs, rules, data, getFieldDecorator, formItemLayout)}
        </Form>
      </Modal>
    );
  }
}

@connect(({ general, loading }) => ({
  general,
  loading: loading.models.general
}))
@Form.create()
class TablePage extends Component {
  state = {
    edit: {
      action: "add",
      data: {},
      opened: false
    },
    current: {},
    reload: false,
    sortedInfo: {
      columnKey: "",
      order: ""
    }
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const { current = false } = nextProps;
    const { current: preCurrent = {} } = prevState;
    if (current) {
      if (preCurrent.id !== current.id) {
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
    const { form, dispatch, current, indexs, showCategory = true } = this.props;
    form.validateFieldsAndScroll((err, fieldsValue) => {
      if (err) {
        return;
      }

      const where = buildWhere(fieldsValue, indexs);
      if (showCategory) {
        where.push(["category_id", current.id]);
      }
      dispatch({
        type: "general/list",
        payload: {
          page,
          pageSize,
          where,
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
    const { dispatch, form, current, showCategory = true } = this.props;

    console.log("table loading data", current.name);

    dispatch({
      type: "general/save",
      payload: {
        modelKey: current.model.key,
        type: "g"
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
        where: showCategory ? [["category_id", current.id]] : [],
        order: []
      }
    });
  };

  add = (data, reset) => {
    const { dispatch } = this.props;
    dispatch({
      type: "general/add",
      payload: data,
      cb: () => {
        this.closeModal();
        reset();
      }
    });
  };

  edit = (data, reset) => {
    const { dispatch } = this.props;
    dispatch({
      type: "general/edit",
      payload: data,
      cb: () => {
        this.closeModal();
        reset();
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
      attrs = []
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
      <Col sm={12} xs={24} lg={{ span: 8 }} key="content-filter-id">
        <Form.Item label="ID" labelCol={labelCol} wrapperCol={wrapperCol}>
          {getFieldDecorator("id", {})(<Input placeholder="" />)}
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

    if (children.length > 0) {
      children.push(
        <Col sm={12} xs={24} lg={{ span: 8 }} key="s-submit">
          <Form.Item wrapperCol={{ span: 24 }}>
            <Can api={`GET@/api/g/${this.state.current.model.key}`}>
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
    }

    return children;
  }

  /**
   * 获取搜索表单DOm
   *
   * @memberof TablePage
   */
  renderFilter = () => {
    const { current, otherHandler = null } = this.props;

    return (
      <div>
        <Form className="table-search-form" onSubmit={this.handleSearch}>
          <Row gutter={24}>{this.getFields()}</Row>
          <Row>
            <Col span={24} style={{ textAlign: "right" }}>
              {otherHandler}
              <Can api={`POST@/api/g/${current.model.key}`}>
                <Button
                  type="primary"
                  onClick={() => {
                    this.openModel("add", {});
                  }}
                >
                  创建
                </Button>
              </Can>
              <Can api={`GET@/api/g/${current.model.key}`}>
                <Button onClick={this.init} className="refresh-btn">
                  刷新
                </Button>
              </Can>
            </Col>
          </Row>
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
  closeModal = () => {
    this.setState({ edit: { ...this.state.edit, opened: false } });
  };

  render() {
    const {
      loading,
      general: {
        list: { data = [], page: current = 1, total = 0, pageSize = 20 }
      },
      attrs = [],
      rules = {},
      current: currentCategory = {},
      showCategory = true
    } = this.props;

    return (
      <Can api={`GET@/api/g/${currentCategory.model.key}`} cannot={null}>
        <Table
          title={this.renderFilter}
          rowSelection={this.props.rowSelection}
          columns={getColumns(
            attrs,
            this.props.hasOwnProperty("actionProps")
              ? this.props.actionProps
              : {
                  can: {
                    edit: `PUT@/api/g/${currentCategory.model.key}/:id`,
                    delete: `DELETE@/api/g/${currentCategory.model.key}/:id`
                  },
                  delete: id => {
                    this.delete(id);
                  },
                  edit: record => {
                    this.openModel("edit", record);
                  }
                },
            this.state.sortedInfo,
            this.switchChange,
            this.props.hasOwnProperty("showCategory")
              ? this.props.showCategory
              : true,

            this.props.hasOwnProperty("actions") ? this.props.actions : null
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

        <Edit
          {...this.state.edit}
          key={String(this.state.edit.data.id)}
          close={this.closeModal}
          add={this.add}
          edit={this.edit}
          current={currentCategory}
          attrs={attrs}
          rules={rules}
          showCategory={showCategory}
        />
      </Can>
    );
  }
}

export default TablePage;
