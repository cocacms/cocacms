import React from 'react';
import {
  Input, Rate, Radio, Select, Checkbox, TimePicker, DatePicker, Form, Switch, Icon
} from 'antd';
import Upload from 'components/upload';
import RichEditor from 'components/richeditor';
import moment from 'moment';
import Action from 'components/action';

import re from '../common/re';


export const renderFormComponent = (type, optionsArray = [], len, id, isFilter = false) => {
  /**
   * 单行文本 varchar
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
   */
  switch (type) {
    case 'text':
      return <Input.TextArea autosize={{ minRows: 6 }} />
    case 'radio':
      return <Radio.Group>
        {optionsArray.map(i => <Radio key={i.value} value={i.value}>{i.label}</Radio>)}
      </Radio.Group>
    case 'select':
      return <Select placeholder='请选择'>
        {optionsArray.map(i => <Select.Option key={i.value} value={i.value}>{i.label}</Select.Option>)}
      </Select>
    case 'checkbox':
      return <Checkbox.Group options={optionsArray}/>
    case 'time':
      return <TimePicker style={{ width: '100%'}}/>
    case 'date':
      return isFilter ?  <DatePicker.RangePicker style={{ width: '100%'}}/> : <DatePicker style={{ width: '100%'}}/>
    case 'datetime':
      return isFilter ? <DatePicker.RangePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: '100%'}}/> : <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: '100%'}}/>
    case 'img':
      return <Upload max={len}/>
    case 'file':
      return <Upload accept="" max={len}/>
    case 'richtext':
      return <RichEditor id={id}/>
    case 'rate':
      return <Rate allowHalf />;
    case 'switch':
      return <Switch />;
    default:
      return <Input />
  }


}

export const fillRule = (rules) => {
  if (rules && rules.length > 0) {
    for (const rule of rules) {
      // 实例化正则对象
      if (Object.prototype.hasOwnProperty.call(rule, 'pattern')) {
        if (Object.prototype.hasOwnProperty.call(re, rule.pattern)) { // 判断内置正则
          rule.pattern = re[rule.pattern];
        } else {
          rule.pattern = new RegExp(rule.pattern);
        }
      }
    }
  }
  return rules;
}

export const renderForm = (attrs, rules, data, getFieldDecorator, formItemLayout) => {
  const result = [];
  for (const attr of attrs) {
    const option  = {
      initialValue: data[attr.key],
    };

    if (['time', 'date', 'datetime'].includes(attr.type)) {
      option.initialValue = moment(data[attr.key], ['YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD', 'HH:mm:ss']).isValid() ? moment(data[attr.key], ['YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD', 'HH:mm:ss']) : null
    }

    if (['switch'].includes(attr.type)) {
      option.initialValue = data[attr.key] === 1;
      option.valuePropName = 'checked'
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
          renderFormComponent(attr.type, attr.optionsArray, attr.len, data.id)
        )}
      </Form.Item>
    )

  }
  return result;
}


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
      if (index.type === 'key' && values[index.key]) {
        if (Array.isArray(values[index.key]) && values[index.key].length === 2 && values[index.key][0] instanceof moment) {
          wheres.push([index.key, 'between', [values[index.key][0].format('YYYY-MM-DD HH:mm:ss'), values[index.key][1].format('YYYY-MM-DD HH:mm:ss')]])
        } else {
          wheres.push([index.key, values[index.key]])
        }
      }


      if (index.type === 'fulltext') {
        fulltext_key.push(index.key);
        if (Array.isArray(values[index.key]) && values[index.key].length > 0) {
          for (const iterator of values[index.key]) {
            fulltext_value.push(`+${iterator}`)
          }
        } else if(!Array.isArray(values[index.key]) && values[index.key]) {
          fulltext_value.push(values[index.key].split(/\s+/).map(i => `+${i}`).join(' '))
        }

      }
    }

    if (fulltext_value.length > 0) {
      wheres.push([fulltext_key.join(','), 'match', fulltext_value.join(' ')]);
    }

    if (values.id) {
      wheres.push(['id', values.id]);
    }

    return wheres;
  }


/**
* 字段定义
*
* @memberof TablePage
*/
export const getColumns = (attrs, actionProps, sortedInfo, switchChange = false) => {
   const columns = [
     {
       dataIndex: 'id',
       width: 80,
       sorter: true,
       title: 'ID',
       sortOrder: sortedInfo.columnKey === 'id' && sortedInfo.order,
     },
     {
       dataIndex: 'category.name',
       title: '栏目',
     }
   ];

   for (const attr of attrs) {
     if (attr.tableable === 1) {
       columns.push({
         title: attr.name,
         sorter: attr.sortable === 1,
         sortOrder: sortedInfo.columnKey === attr.key && sortedInfo.order,
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

           if (['switch'].includes(attr.type)) {
            return <Switch onChange={(is) => {switchChange && switchChange(record.id, attr.key ,is ? 1 : 0)}} checked={text === 1} />;
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
          {...actionProps}
           delete= { () => { actionProps.delete(record.id) } }
           edit={() => { actionProps.edit(record) }}
         >
         </Action>
       )

     }
   });

   return columns;
 }
