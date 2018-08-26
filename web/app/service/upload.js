'use strict';

const Service = require('./base');
const fs = require('fs');
const path = require('path');
const bytes = require('humanize-bytes');

class UploadService extends Service {
  /**
   * 上传入口
   *
   * @return {object} 上传结果
   * @memberof UploadService
   */
  async generate() {
    const allConfig = await this.service.config.get();
    const { upload: config = {} } = allConfig;
    let type = 'local';
    if (config.type) {
      type = config.type;
    }

    const stream = await this.getFileStream(config);

    const extname = path.extname(stream.filename);
    if (config.extension) {
      const extensions = config.extension.split('|');
      if (!extname || !extensions.includes(extname)) {
        stream.destroy();
        this.error('不允许的文件格式');
      }
    }

    const filename = `${this.ctx.helper.UUID()}${extname}`;
    if (
      !this.ctx.plugin[type] ||
      typeof this.ctx.plugin[type].upload !== 'function'
    ) {
      return await this.local(config, stream, filename);
    }

    return await this.ctx.plugin[type].upload(config, stream, filename);
  }

  /**
   * 获取文件流
   *
   * @param {*} config 配置
   * @return {*} 流
   * @memberof UploadService
   */
  async getFileStream(config) {
    const multipartParseOptions = { limits: {} };

    if (config.fileSize) {
      multipartParseOptions.limits.fileSize = bytes(config.fileSize);
    }

    const parts = this.ctx.multipart(multipartParseOptions);
    const stream = await parts();
    // stream not exists, treat as an exception
    if (!stream || !stream.filename) {
      this.error('找不到上传的文件');
    }
    stream.fields = parts.field;
    stream.once('limit', () => {
      const err = new Error('文件大小超出上限');
      err.name = 'MultipartFileTooLargeError';
      err.status = 413;
      err.fields = stream.fields;
      err.filename = stream.filename;
      if (stream.listenerCount('error') > 0) {
        stream.emit('error', err);
      } else {
        // ignore next error event
        stream.on('error', () => {});
      }
      // ignore all data
      stream.resume();
    });
    return stream;
  }

  /**
   * 本地上传
   *
   * @param {*} config 配置
   * @param {*} stream 流
   * @param {*} filename 文件名
   * @return {*} 处理结果
   * @memberof UploadService
   */
  async local(config, stream, filename) {
    const writerStream = fs.createWriteStream(
      path.join(__dirname, `../public/upload/${filename}`)
    );
    stream.pipe(writerStream);
    return {
      url: `${this.ctx.protocol}://${this.ctx.host}/public/upload/${filename}`,
    };
  }
}

module.exports = UploadService;
