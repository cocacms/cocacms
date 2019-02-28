/**
 * title: 栏目管理
 */
import React, { Component } from "react";
import {
  Table,
  Form,
  Row,
  Col,
  Button,
  Input,
  Modal,
  Select,
  TreeSelect,
  Tag
} from "antd";
// import name from "components/name";
import Action from "components/action";
import Can from "components/can/index";
import Upload from "components/upload";
import RichEditor from "components/richeditor";
import { connect } from "dva";

@Form.create()
@connect(({ category, loading }) => ({
  category,
  loading: loading.models.category
}))
class Edit extends Component {
  state = {};
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: "category/tree",
      payload: {}
    });
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
      form: { getFieldDecorator, setFieldsValue, getFieldValue },
      models = [],
      mform = [],
      category: { tree = [] }
    } = this.props;
    const labelCol = { span: 5 };
    const wrapperCol = { span: 15 };
    return (
      <Modal
        title={action === "add" ? "添加" : "编辑"}
        visible={opened}
        onCancel={close}
        onOk={this.onOk}
        width="90%"
        style={{ top: "5vh" }}
        bodyStyle={{ maxHeight: "80vh", overflowY: "auto" }}
      >
        <Form>
          {getFieldDecorator("id", {
            initialValue: data.id
          })(<Input type="hidden" disabled />)}

          <Form.Item labelCol={labelCol} wrapperCol={wrapperCol} label="父栏目">
            {getFieldDecorator("pid", {
              initialValue:
                data.pid === undefined ? undefined : String(data.pid),
              rules: [{ required: true, message: "请设置栏目父栏目" }]
            })(
              <TreeSelect
                dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
                treeData={tree}
                treeNodeLabelProp="name"
                treeNodeFilterProp="id"
                placeholder="请选择"
                treeDefaultExpandAll
                onSelect={(value, node) => {
                  if (action === "add") {
                    setFieldsValue({
                      model_id: node.props.model_id
                    });
                    setFieldsValue({
                      form_id: node.props.form_id
                    });

                    setFieldsValue({
                      template_list: node.props.template_list
                    });
                    setFieldsValue({
                      template_detail: node.props.template_detail
                    });
                    setFieldsValue({
                      template_page: node.props.template_page
                    });
                  }
                }}
              />
            )}
          </Form.Item>

          <Form.Item
            labelCol={labelCol}
            wrapperCol={wrapperCol}
            label="栏目关键字"
          >
            {getFieldDecorator("key", {
              initialValue:
                action === "add"
                  ? `key_${parseInt(Math.random() * 10000, 10)}`
                  : data.key,
              rules: [{ required: true, message: "请设置栏目关键字" }]
            })(<Input />)}
          </Form.Item>

          <Form.Item
            labelCol={labelCol}
            wrapperCol={wrapperCol}
            label="栏目名称"
          >
            {getFieldDecorator("name", {
              initialValue: data.name,
              rules: [{ required: true, message: "请设置栏目名称" }]
            })(<Input />)}
          </Form.Item>

          <Form.Item
            labelCol={labelCol}
            wrapperCol={wrapperCol}
            label="栏目类型"
          >
            {getFieldDecorator("type", {
              initialValue: data.type,
              rules: [{ required: true, message: "请设置栏目类型" }]
            })(
              <Select placeholder="请选择">
                <Select.Option value={1}>列表页</Select.Option>
                <Select.Option value={2}>单页</Select.Option>
                <Select.Option value={3}>表单页</Select.Option>
                <Select.Option value={4}>外链</Select.Option>
              </Select>
            )}
          </Form.Item>

          <Form.Item
            labelCol={labelCol}
            wrapperCol={wrapperCol}
            label="绑定模型"
            extra={
              <Tag color="gold">* 绑定模型会同步设置到未设置模型的子栏目</Tag>
            }
          >
            {getFieldDecorator("model_id", {
              initialValue: data.model_id
            })(
              <Select placeholder="请选择">
                {models
                  .filter(i => {
                    const type = getFieldValue("type");
                    if (type === 4 || type === 3) {
                      return i.type === -1;
                    }
                    return i.type === 0;
                  })
                  .map(i => (
                    <Select.Option key={`model_id_${i.id}`} value={i.id}>
                      {i.name}
                    </Select.Option>
                  ))}
              </Select>
            )}
          </Form.Item>

          <Form.Item
            labelCol={labelCol}
            wrapperCol={wrapperCol}
            label="绑定表单"
            extra={
              <Tag color="gold">* 绑定表单会同步设置到未设置表单的子栏目</Tag>
            }
          >
            {getFieldDecorator("form_id", {
              initialValue: data.form_id
            })(
              <Select placeholder="请选择">
                {mform
                  .filter(i => {
                    const type = getFieldValue("type");
                    if (type === 3) {
                      return true;
                    }

                    return false;
                  })
                  .map(i => (
                    <Select.Option key={`form_id_${i.id}`} value={i.id}>
                      {i.name}
                    </Select.Option>
                  ))}
              </Select>
            )}
          </Form.Item>

          <Form.Item labelCol={labelCol} wrapperCol={wrapperCol} label="外链">
            {getFieldDecorator("url", {
              initialValue: data.url
            })(<Input />)}
          </Form.Item>

          <Form.Item labelCol={labelCol} wrapperCol={wrapperCol} label="图片">
            {getFieldDecorator("pic", {
              initialValue: data.pic
            })(<Upload />)}
          </Form.Item>

          <Form.Item
            labelCol={labelCol}
            wrapperCol={wrapperCol}
            label="SEO 关键字"
          >
            {getFieldDecorator("keyword", {
              initialValue: data.keyword
            })(<Input />)}
          </Form.Item>

          <Form.Item
            labelCol={labelCol}
            wrapperCol={wrapperCol}
            label="SEO 描述"
          >
            {getFieldDecorator("description", {
              initialValue: data.description
            })(<Input.TextArea autosize={{ minRows: 8 }} />)}
          </Form.Item>

          <Form.Item labelCol={labelCol} wrapperCol={wrapperCol} label="内容">
            {getFieldDecorator("content", {
              initialValue: data.content
            })(<RichEditor id={data.id} />)}
          </Form.Item>

          <Form.Item
            labelCol={labelCol}
            wrapperCol={wrapperCol}
            label="列表模板"
          >
            {getFieldDecorator("template_list", {
              initialValue: data.template_list
            })(<Input />)}
          </Form.Item>

          <Form.Item
            labelCol={labelCol}
            wrapperCol={wrapperCol}
            label="详情模板"
          >
            {getFieldDecorator("template_detail", {
              initialValue: data.template_detail
            })(<Input />)}
          </Form.Item>

          <Form.Item
            labelCol={labelCol}
            wrapperCol={wrapperCol}
            label="单页模板"
          >
            {getFieldDecorator("template_page", {
              initialValue: data.template_page
            })(<Input />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

@connect(({ category, form, loading }) => ({ category, mform: form, loading }))
@Form.create()
class CategoryPage extends Component {
  state = {
    expand: false,
    edit: {
      action: "add",
      data: {},
      key: 1,
      opened: false
    }
  };

  componentDidMount() {
    this.init();
  }

  /**
   * 初始化获取数据
   *
   * @memberof CategoryPage
   */
  init = () => {
    const { dispatch, form } = this.props;
    form.resetFields();
    dispatch({
      type: "category/list",
      payload: {}
    });
    dispatch({
      type: "form/list"
    });
    dispatch({
      type: "category/fetchProps",
      payload: {}
    });
  };

  add = (data, reset) => {
    const { dispatch } = this.props;
    dispatch({
      type: "category/add",
      payload: {
        data,
        pid: Number(data.pid)
      },
      cb: () => {
        this.closeModel();
        reset();
      }
    });
  };

  edit = (data, reset) => {
    const { dispatch } = this.props;
    dispatch({
      type: "category/edit",
      payload: data,
      cb: () => {
        this.closeModel();
        reset();
      }
    });
  };

  delete = id => {
    const { dispatch } = this.props;
    dispatch({
      type: "category/del",
      payload: id
    });
  };

  moveUp = id => {
    const { dispatch } = this.props;
    dispatch({
      type: "category/moveUp",
      payload: id
    });
  };

  moveDown = id => {
    const { dispatch } = this.props;
    dispatch({
      type: "category/moveDown",
      payload: id
    });
  };

  /**
   * 获取搜索表单DOm
   *
   * @memberof CategoryPage
   */
  renderFilter = () => {
    return (
      <div>
        <Form className="table-search-form" onSubmit={this.handleSearch}>
          <Row>
            <Col span={24} style={{ textAlign: "right" }}>
              <Can api="POST@/api/category">
                <Button
                  type="primary"
                  onClick={() => {
                    this.openModel("add", {});
                  }}
                >
                  创建
                </Button>
              </Can>
              <Can api="GET@/api/category">
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
   * @memberof CategoryPage
   */
  openModel = (action, record) => {
    this.setState({
      edit: { action, opened: true, data: record, key: Math.random() }
    });
  };

  /**
   * 关闭编辑框
   *
   * @memberof CategoryPage
   */
  closeModel = () => {
    this.setState({ edit: { ...this.state.edit, opened: false } });
  };

  isBottom = id => {
    const {
      category: { list = [] }
    } = this.props;
    const find = finddata => {
      for (let index = 0; index < finddata.length; index++) {
        const element = finddata[index];
        if (element.id === id) {
          return index === finddata.length - 1;
        }
        if (element.children && element.children.length > 0) {
          const is = find(element.children);
          if (is) {
            return true;
          }
        }
      }
      return false;
    };

    return find(list);
  };

  /**
   * 字段定义
   *
   * @memberof CategoryPage
   */
  getColumns = () => [
    {
      dataIndex: "name",
      title: "名称"
    },
    {
      dataIndex: "key",
      title: "关键字"
    },
    {
      dataIndex: "type",
      title: "类型",
      render: text => {
        switch (
          text //1列表页 2单页 3表单页
        ) {
          case 1:
            return "列表页";
          case 2:
            return "单页";
          case 3:
            return "表单页";
          case 4:
            return "外链";
          default:
            return "-";
        }
      }
    },
    {
      dataIndex: "model.name",
      title: "绑定模型"
    },
    {
      title: "排序",
      width: 100,
      align: "center",
      render: (text, record, index) => {
        return (
          <Action
            can={{
              edit: "PUT@/api/category/:id",
              delete: "DELETE@/api/category/:id"
            }}
            editable={false}
            deleteable={false}
          >
            <Can to="PUT@/api/category/moveUp/:id">
              <Button
                shape="circle"
                icon="up"
                size="small"
                disabled={index === 0}
                onClick={() => {
                  this.moveUp(record.id);
                }}
              />
            </Can>
            <Can to="PUT@/api/category/moveDown/:id">
              <Button
                shape="circle"
                icon="down"
                size="small"
                disabled={this.isBottom(record.id)}
                onClick={() => {
                  this.moveDown(record.id);
                }}
              />
            </Can>
          </Action>
        );
      }
    },
    {
      title: "操作",
      width: 180,
      align: "center",
      render: (text, record) => {
        return (
          <Action
            can={{ edit: "PUT@/api/category/:id" }}
            deleteable={false}
            edit={() => {
              this.openModel("edit", record);
            }}
          >
            <a
              className="danger"
              onClick={() => {
                Modal.confirm({
                  title: "确定要删除这个栏目吗？",
                  content: "删除栏目后，栏目下的内容将会丢失，请谨慎操作！",
                  okText: "是，我要删除",
                  okType: "danger",
                  cancelText: "不删除",
                  onOk: () => {
                    this.delete(record.id);
                  }
                });
              }}
            >
              删除
            </a>
          </Action>
        );
      }
    }
  ];

  render() {
    const {
      loading: { effects: loading = {} },
      category: { list = [], models = [] },
      mform: { list: mform = [] }
    } = this.props;

    return (
      <Can api="GET@/api/category" cannot={null}>
        <Table
          key={`categoye-table-${list.length}`}
          childrenColumnName="children"
          title={this.renderFilter}
          defaultExpandAllRows
          columns={this.getColumns()}
          loading={loading["category/list"]}
          rowKey="id"
          dataSource={list}
          pagination={false}
          indentSize={17}
          scroll={{ x: 980 }}
        />

        <Edit
          {...this.state.edit}
          models={models}
          mform={mform}
          close={this.closeModel}
          add={this.add}
          edit={this.edit}
        />
      </Can>
    );
  }
}

export default CategoryPage;
