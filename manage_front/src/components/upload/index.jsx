import React from 'react';
import { Upload, Icon, Modal, message } from 'antd';

import host from '../../common/config';
import './index.less';

export default class PicturesWall extends React.Component {
  state = {
    previewVisible: false,
    previewImage: '',
    fileList: null,
    _fileList: [],
    data: {
      key: '',
      token: '',
    },
  }

  static getDerivedStateFromProps(nextProps, prevState){
    const { value } = nextProps;
    let fileList = [];
    if (Array.isArray(value)) {
      fileList = value.map(i => ({
        uid: i,
        name: i,
        status: 'done',
        url: i,
      }));
    }
    return { _fileList: fileList };
  }

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  handleCancel = () => {
    this.setState({ previewVisible: false });
  }

  handleChange = ({ fileList }) => {
    const { onChange } = this.props;
    const data = [];
    const list = fileList.map((i) => {

      if (i.status === 'done' && i.url) {
        data.push(i.url);
        return i;
      }

      if (i.status === 'done' && i.response && i.response.url) {
        data.push(i.response.url);
      }

      if (i.status === 'error' && i.response && i.response.message) {
        message.error(`上传失败：${i.response.message}`);
      }

      return i;
    });

    onChange(data);

    this.setState({ fileList: list });
  }

  render() {
    const { previewVisible, previewImage, fileList, _fileList } = this.state;
    const { max, accept = 'image/*' } = this.props;

    const list = fileList === null ? _fileList : fileList;

    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          accept={accept}
          action={`${host}/api/upload`}
          listType="picture-card"
          fileList={list}
          headers={{
            Accept: 'application/json',
            Authorization: (localStorage.token || sessionStorage.token)
          }}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {list.length >= max ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="priview" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}
