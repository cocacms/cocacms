import React from "react";
import {
  Input,
  Rate,
  Radio,
  Select,
  Checkbox,
  TimePicker,
  DatePicker,
  Form,
  Icon,
  InputNumber,
  Col
} from "antd";
import Upload from "components/upload";
import Switch from "components/switch";
import RichEditor from "components/richeditor";
import moment from "moment";

import Action from "components/action";

import re from "../utils/re";
import "moment/locale/zh-cn";
moment.locale("zh-cn");

export const renderFormComponent = (
  type,
  optionsArray = [],
  len,
  id,
  isFilter = false,
  onlyread = false
) => {
  // 搜索不禁用
  if (isFilter) {
    onlyread = false;
  }

  /**
   * 单行文本 varchar
   * 整数 int
   * 小数 decimal
   * 多行文本 text
   * 单选 radio
   * 选择框 select
   * 多选 checkbox
   * 时间选择器 time
   * 日期选择器 date
   * 日期时间选择器 datetime
   * 图片 img
   * 文件 file
   * 富文本 richtext
   * 评分 rate
   * 开关 switch
   * 权重 weight
   */
  switch (type) {
    case "text":
      return <Input.TextArea autosize={{ minRows: 8 }} disabled={onlyread} />;
    case "int":
      return (
        <InputNumber
          style={{ width: "100%" }}
          precision={0}
          disabled={onlyread}
        />
      );
    case "decimal":
      return (
        <InputNumber
          style={{ width: "100%" }}
          precision={Number(len.split(",", 2)[1])}
          disabled={onlyread}
        />
      );
    case "radio":
      return (
        <Radio.Group disabled={onlyread}>
          {optionsArray.map(i => (
            <Radio key={`rd_${i.label}_${i.value}`} value={i.value}>
              {i.label}
            </Radio>
          ))}
        </Radio.Group>
      );
    case "select":
      return (
        <Select placeholder="请选择" disabled={onlyread}>
          {optionsArray.map(i => (
            <Select.Option key={`rd_${i.label}_${i.value}`} value={i.value}>
              {i.label}
            </Select.Option>
          ))}
        </Select>
      );
    case "checkbox":
      return <Checkbox.Group options={optionsArray} disabled={onlyread} />;
    case "time":
      return <TimePicker disabled={onlyread} style={{ width: "100%" }} />;
    case "date":
      return isFilter ? (
        <DatePicker.RangePicker style={{ width: "100%" }} />
      ) : (
        <DatePicker disabled={onlyread} style={{ width: "100%" }} />
      );
    case "datetime":
      return isFilter ? (
        <DatePicker.RangePicker
          showTime
          format="YYYY-MM-DD HH:mm:ss"
          style={{ width: "100%" }}
        />
      ) : (
        <DatePicker
          disabled={onlyread}
          showTime
          format="YYYY-MM-DD HH:mm:ss"
          style={{ width: "100%" }}
        />
      );
    case "img":
      return <Upload disabled={onlyread} max={len} />;
    case "file":
      return <Upload disabled={onlyread} accept="" max={len} />;
    case "richtext":
      return <RichEditor disabled={onlyread} id={id} />;
    case "rate":
      return <Rate disabled={onlyread} allowHalf />;
    case "switch":
      return <Switch disabled={onlyread} />;
    case "weight":
      return <InputNumber precision={0} />;
    default:
      return <Input disabled={onlyread} />;
  }
};

export const fillRule = rules => {
  if (rules && rules.length > 0) {
    for (const rule of rules) {
      // 实例化正则对象
      if (Object.prototype.hasOwnProperty.call(rule, "pattern")) {
        if (Object.prototype.hasOwnProperty.call(re, rule.pattern)) {
          // 判断内置正则
          rule.pattern = re[rule.pattern];
        } else {
          rule.pattern = new RegExp(rule.pattern);
        }
      }
    }
  }
  return rules;
};

export const renderForm = (
  attrs,
  rules,
  data,
  getFieldDecorator,
  formItemLayout
) => {
  const result = [];
  for (const attr of attrs) {
    const option = {};
    if (Object.prototype.hasOwnProperty.call(data, attr.key)) {
      option.initialValue = data[attr.key];
    } else if (attr.onlyread === 1 && attr.default) {
      option.initialValue = attr.default;
    }

    if (["time", "date", "datetime"].includes(attr.type)) {
      option.initialValue = moment(data[attr.key], [
        moment.ISO_8601,
        "YYYY-MM-DD HH:mm:ss",
        "YYYY-MM-DD",
        "HH:mm:ss"
      ]).isValid()
        ? moment(data[attr.key], [
            moment.ISO_8601,
            "YYYY-MM-DD HH:mm:ss",
            "YYYY-MM-DD",
            "HH:mm:ss"
          ])
        : null;
    }

    if (rules[attr.key]) {
      option.rules = fillRule(rules[attr.key]);
    }

    result.push(
      <Form.Item
        {...formItemLayout}
        key={`${attr.key}_${data.id}`}
        label={attr.name}
      >
        {getFieldDecorator(attr.key, option)(
          renderFormComponent(
            attr.type,
            attr.optionsArray,
            attr.len,
            data.id,
            false,
            attr.onlyread === 1
          )
        )}
      </Form.Item>
    );
  }
  return result;
};

/**
 * 构建where条件
 *
 * @memberof TablePage
 */
export const buildWhere = (values, indexs) => {
  const wheres = [];
  const fulltext_value = [];
  const fulltext_key = [];
  for (const index of indexs) {
    if (index.type === "key" && values[index.key] !== undefined) {
      if (
        Array.isArray(values[index.key]) &&
        values[index.key].length === 2 &&
        values[index.key][0] instanceof moment
      ) {
        wheres.push([
          index.key,
          "between",
          [
            values[index.key][0].format("YYYY-MM-DD HH:mm:ss"),
            values[index.key][1].format("YYYY-MM-DD HH:mm:ss")
          ]
        ]);
      } else {
        wheres.push([index.key, values[index.key]]);
      }
    }

    if (index.type === "fulltext") {
      fulltext_key.push(index.key);
      if (Array.isArray(values[index.key]) && values[index.key].length > 0) {
        for (const iterator of values[index.key]) {
          fulltext_value.push(`+${iterator}`);
        }
      } else if (!Array.isArray(values[index.key]) && values[index.key]) {
        fulltext_value.push(
          values[index.key]
            .split(/\s+/)
            .map(i => `+${i}`)
            .join(" ")
        );
      }
    }
  }

  if (fulltext_value.length > 0) {
    wheres.push([fulltext_key.join(","), "match", fulltext_value.join(" ")]);
  }

  if (values.id) {
    wheres.push(["id", values.id]);
  }

  return wheres;
};

/**
 * 字段定义
 *
 * @memberof TablePage
 */
export const getColumns = (
  attrs,
  actionProps,
  sortedInfo,
  switchChange = false,
  category = false,
  actions = null,
  sortable = false
) => {
  const columns = [
    {
      dataIndex: "id",
      width: 80,
      sorter: true,
      title: "ID",
      sortOrder: sortedInfo.columnKey === "id" && sortedInfo.order
    }
  ];

  if (category) {
    columns.push({
      dataIndex: "category.name",
      title: "栏目"
    });
  }

  for (const attr of attrs) {
    if (attr.tableable === 1) {
      columns.push({
        title: attr.name,
        sorter: attr.sortable === 1,
        sortOrder: sortedInfo.columnKey === attr.key && sortedInfo.order,
        dataIndex: attr.key,
        align: "center",
        render: (text, record) => {
          // 单选，选择框 数据显示转换
          if (["radio", "select"].includes(attr.type)) {
            for (const option of attr.optionsArray) {
              if (option.value === String(text)) {
                return option.label;
              }
            }

            return "-";
          }

          // 多选 数据显示转换
          if (["checkbox"].includes(attr.type) && Array.isArray(text)) {
            const strs = [];
            for (const option of attr.optionsArray) {
              if (text.includes(option.value)) {
                strs.push(option.label);
              }
            }

            return strs.length === 0 ? "-" : strs.join(", ");
          }

          // 图片 数据显示转换
          if (["img"].includes(attr.type) && Array.isArray(text)) {
            return text.map(i => (
              <img
                key={`img_${i}`}
                src={i}
                alt=""
                style={{ maxWidth: 40, maxHeight: 40, marginRight: 5 }}
              />
            ));
          }

          // 文件 数据显示转换
          if (["file"].includes(attr.type) && Array.isArray(text)) {
            return text.map(i => (
              <p key={`file_${i}`}>
                <a href={i} target="black">
                  <Icon type="file" /> {i.split("/")[i.split("/").length - 1]}
                </a>
              </p>
            ));
          }

          // 时间
          if (["time", "date", "datetime"].includes(attr.type)) {
            const formats = {
              time: "HH:mm:ss",
              date: "YYYY-MM-DD",
              datetime: "YYYY-MM-DD HH:mm:ss"
            };
            return moment(text, [
              moment.ISO_8601,
              "YYYY-MM-DD HH:mm:ss",
              "YYYY-MM-DD",
              "HH:mm:ss"
            ]).format(formats[attr.type]);
          }

          // rate
          if (["rate"].includes(attr.type)) {
            return <Rate allowHalf value={text} disabled />;
          }

          // richtext
          if (["richtext"].includes(attr.type)) {
            return <div dangerouslySetInnerHTML={{ __html: text }} />;
          }

          // switch
          if (["switch"].includes(attr.type)) {
            return (
              <Switch
                onChange={is => {
                  switchChange && switchChange(record.id, attr.key, is);
                }}
                value={text}
              />
            );
          }

          // weight
          if (
            ["weight"].includes(attr.type) &&
            typeof sortable === "function"
          ) {
            return (
              <InputNumber
                precision={0}
                onBlur={e => {
                  sortable(record.id, attr.key, Number(e.target.defaultValue));
                }}
                defaultValue={isNaN(Number(text)) ? 0 : Number(text)}
              />
            );
          }

          return text;
        }
      });
    }
  }

  columns.push({
    title: "操作",
    width: 180,
    align: "center",
    render: (text, record) => {
      return (
        <Action
          {...actionProps}
          delete={() => {
            actionProps.delete(record.id);
          }}
          edit={() => {
            actionProps.edit(record);
          }}
        >
          {typeof actions === "function" && actions(record)}
        </Action>
      );
    }
  });

  return columns;
};

export const renderFilterForm = (
  attrs,
  indexs,
  labelCol,
  wrapperCol,
  getFieldDecorator,
  children = []
) => {
  for (const attr of attrs) {
    if (indexs.map(i => i.key).includes(attr.key)) {
      const options = {};
      if (attr.type === "switch") {
        options.initialValue = 0;
      }

      children.push(
        <Col sm={12} xs={24} lg={{ span: 8 }} key={attr.key}>
          <Form.Item
            label={attr.name}
            labelCol={labelCol}
            wrapperCol={wrapperCol}
          >
            {getFieldDecorator(attr.key, options)(
              renderFormComponent(attr.type, attr.optionsArray, attr.len, 0)
            )}
          </Form.Item>
        </Col>
      );
    }
  }

  return children;
};
