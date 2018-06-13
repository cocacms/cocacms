import React, { Component } from 'react';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/braft.css';
import request from '../../utils/request';

import host from '../../common/config';

class RichEditor extends Component {
  state = {  }
  uploadFn = (param) => {
    const data = new FormData()
    data.append('file', param.file);
    request(`${host}/api/upload`, {
      method: 'POST',
      body: data
    }).then(({ data}) => {
      param.success(data);
    }).catch((error) => {
      param.error(error);
    })
  };

  media = {
    uploadFn: this.uploadFn,
  };
  render() {
    const { disabled = false, height = 450, id = Math.random() } = this.props;
    return (
      <BraftEditor
        height={height} contentFormat="html" disabled={disabled} initialContent={this.props['data-__meta'] ? this.props['data-__meta'].initialValue : ''} contentId={id} language="zh"
        { ...this.props }
        media={this.media}
      />
    );
  }
}

export default RichEditor;

