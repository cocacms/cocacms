'use strict';

const Service = require('cocacms').BaseService;
const fs = require('fs');
const path = require('path');
const bytes = require('humanize-bytes');

class UploadService extends Service {
  async generate() {
    const allConfig = await this.service.config.get();
    const { upload: config = { } } = allConfig;
    let type = 'local';
    if (config.type) {
      type = config.type;
    }

    if (typeof this[type] !== 'function') {
      type = 'local';
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
    return this[type](config, stream, filename);
  }

  async getFileStream(config) {
    const multipartParseOptions = { limits: {} };

    if (config.fileSize) {
      multipartParseOptions.limits.fileSize = bytes(config.fileSize);
    }

    const parts = this.ctx.multipart(multipartParseOptions);
    const stream = await parts();
    // stream not exists, treat as an exception
    if (!stream || !stream.filename) {
      this.throw(400, '找不到上传的文件');
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


  async local(config, stream, filename) {
    const writerStream = fs.createWriteStream(path.join(__dirname, `../public/upload/${filename}`));
    stream.pipe(writerStream);
    return {
      url: `${this.ctx.protocol}://${this.ctx.host}/public/upload/${filename}`,
    };
  }

  async qiniu(config, stream, filename) {
    const result = await this.app.qiniu.upload(stream, `${filename}`, config);
    return {
      url: `${config.cdn}${result.key}`,
    };
  }
}

module.exports = UploadService;
