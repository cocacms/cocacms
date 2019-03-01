'use strict';

exports.asyncBuilder = action => {
  return new Promise((resolve, reject) => {
    action((error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};
