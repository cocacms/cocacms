import fetch from 'dva/fetch';

function parseJSON(response) {
  return response.json();
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options = {}) {
  const Authorization = localStorage.token || sessionStorage.token;

  if (!options.headers) {
    options.headers = {};
  }

  options.headers.Accept = 'application/json';

  if (Authorization) {
    options.headers.Authorization = Authorization;
  }

  if (typeof options.body === 'object' && !(options.body instanceof FormData)) {
    options.body = JSON.stringify(options.body);
    options.headers['Content-Type'] = 'application/json';
  }

  return fetch(url, options)
    .then(checkStatus)
    .then(parseJSON)
    .then(data => ({ data }))
    .catch(err => {
      throw err;
    });
}
