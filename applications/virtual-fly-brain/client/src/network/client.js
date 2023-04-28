const axios = require('axios');

const backendUrl = 'http://127.0.0.1:8080/';

function buildUrl(base, method) {
  const url = [base];

  url.push(method);

  return url.join('/');
}

class HttpClient {
  constructor(url) {
    this._url = url;
  }

  encodeGetParams(p) {
    return Object.entries(p).map(kv => kv.map(v => encodeURIComponent(v)).join('=')).join('&');
  }

  get(parameters) {
    const { method, payload, headers } = parameters;

    const options = {
      headers: headers || {}
    };

    const url = `${buildUrl(this._url, method)}?${this.encodeGetParams(payload)}`;

    return new Promise((resolve, reject) => {
      axios.get(url, options)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  post(parameters) {
    const { method, payload, headers } = parameters;

    const options = {
      headers: headers || {}
    };

    const url = buildUrl(this._url, method);

    return new Promise((resolve, reject) => {
      axios.post(url, payload, options)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}

export const backendClient = new HttpClient(backendUrl);