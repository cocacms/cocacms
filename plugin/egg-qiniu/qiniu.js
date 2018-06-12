'use strict';
const qiniu = require('qiniu');

function Qiniu(config) {
  this.config = config;
}

Qiniu.prototype.upload = (readableStream, filename, config = null) => {
  if (config === null) {
    config = this.qiniu;
  }
  return new Promise((resolve, reject) => {
    const key = `${config.prefix}${filename}`;
    const mac = new qiniu.auth.digest.Mac(config.accessKey, config.secretKey);
    const options = {
      scope: `${config.bucketName}:${key}`,
    };
    const putPolicy = new qiniu.rs.PutPolicy(options);
    const uploadToken = putPolicy.uploadToken(mac);

    const qiniuConfig = config = new qiniu.conf.Config();
    qiniuConfig.zone = qiniu.zone[config.zone];
    const formUploader = new qiniu.form_up.FormUploader(qiniuConfig);
    const putExtra = new qiniu.form_up.PutExtra();
    formUploader.putStream(uploadToken, key, readableStream, putExtra, function(respErr,
      respBody, respInfo) {
      if (respErr) {
        reject(respErr);
        return;
      }

      if (respInfo.statusCode === 200) {
        resolve(respBody);
      } else {
        reject(respBody);
      }
    });
  });
};

module.exports = Qiniu;
