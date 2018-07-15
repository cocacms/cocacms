import React, { Component } from 'react';
import { message, Button, Popconfirm } from 'antd';
import E from '@cocacms/wangeditor';
import xss, { getDefaultWhiteList } from 'xss';
import host from '../../common/config';

class RichEditor extends Component {

  componentDidMount() {
    const elem = this.refs.editorElem
    const editor = new E(elem)
    /**
     * 自定 上传
     */
    editor.customConfig.uploadImgServer = `${host}/api/upload`;
    editor.customConfig.uploadImgMaxLength = 1;
    editor.customConfig.uploadImgHeaders = {
      'Accept': 'application/json',
      'Authorization': localStorage.token || sessionStorage.token,
    };

    editor.customConfig.uploadImgHooks = {
      customInsert: (insertImg, result, editor) => {
        const url = result.url;
        insertImg(url);
      }
    };

    editor.customConfig.customAlert = function (info) {
      message.error(info);
    }

    editor.customConfig.uploadImgMaxSize = this.props.maxSize || 100 * 1024 * 1024
    editor.customConfig.uploadImgTimeout = this.props.timeout || 60000

    /**
     * 自定 颜色
     */

    editor.customConfig.colors = [
      '#000000',
      '#333333',
      '#666666',
      '#999999',
      '#cccccc',
      '#ffffff',
      '#61a951',
      '#16a085',
      '#07a9fe',
      '#003ba5',
      '#8e44ad',
      '#f32784',
      '#c0392b',
      '#d35400',
      '#f39c12',
      '#fdda00',
      '#7f8c8d',
      '#2c3e50',
    ]

    /**
     * 菜单
     */

    editor.customConfig.menus = [
      'head',  // 标题
      'bold',  // 粗体
      'fontSize',  // 字号
      'fontName',  // 字体
      'italic',  // 斜体
      'underline',  // 下划线
      'strikeThrough',  // 删除线
      'foreColor',  // 文字颜色
      'backColor',  // 背景颜色
      'hr',  // 换行
      'link',  // 插入链接
      'list',  // 列表
      'justify',  // 对齐方式
      'quote',  // 引用
      'image',  // 插入图片
      'video',  // 插入视频
      'undo',  // 撤销
      'redo'  // 重复
    ]
    editor.customConfig.debug = true;
    editor.customConfig.pasteFilterStyle = true; // 忽略粘贴样式
    editor.customConfig.pasteIgnoreImg = true; // 忽略粘贴图片

    this.defaultWhiteList = getDefaultWhiteList();
    for (const key in this.defaultWhiteList) {
      if (this.defaultWhiteList.hasOwnProperty(key)) {
        this.defaultWhiteList[key].push('style');
      }
    }


    editor.customConfig.onchange = html => {
      this.props.onChange(xss(html, {
        whiteList: this.defaultWhiteList,
        css: true,
      }));
    }

    editor.customConfig.autoHeight = false;

    editor.create();
    editor.txt.html(this.props.value ? this.props.value : '')
    this.editor = editor;
  }

  render() {
    return (
      <div>
        <div ref="editorElem" style={{textAlign: 'left'}}>
        </div>
        <div>
          <Button type="primary" size="small" onClick={() => {
            localStorage.RichEditor = this.editor.txt.html();
            message.success('保存草稿成功');
          }}>保存草稿</Button>
          &nbsp;
          <Popconfirm placement="top" title="恢复草稿，您现在编辑的内容将会消失，确认这样操作吗？" onConfirm={() => {
            if (localStorage.RichEditor) {
              this.editor.txt.html(localStorage.RichEditor);
              this.editor.change();
            }
          }} okText="是的" cancelText="不了">
          <Button type="primary"size="small">恢复草稿</Button>
        </Popconfirm>
        </div>
      </div>

    );
  }
}

export default RichEditor;
