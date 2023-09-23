import {authService} from "./authService";

function transformRequest(data) { //just transform payload data
  return typeof data === 'object' && data !== null && String(data) !== '[object File]'
    ? param(data)
    : data;
}

function param(obj) {
  let query = '', name, value;
  for (name in obj) {
    value = obj[name];

    if (typeof value === 'object' && value !== null)
      if (value instanceof Date)
        value = value.toISOString();
      else
        value = JSON.stringify(value);

    if (value !== undefined && value !== null)
      query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
  }

  return query.length ? query.substr(0, query.length - 1) : query;
}

let
  baseUrl,
  apiBaseUrl,
  uploadUrl
;
const
  _startWithRegexp = /^(\/|http)/,
  _endWithRegexp = /\.ashx/
;

export function httpRequest(pageUrl, action, params, preventErrorAlert) {
  pageUrl = pageUrl || '';
  if (!_startWithRegexp.test(pageUrl)) {
    pageUrl = apiBaseUrl + pageUrl;
    if (!_endWithRegexp.test(pageUrl))
      pageUrl += '.ashx';
  }

  if (pageUrl.indexOf('?') === -1)
    pageUrl += '?act=' + action;
  else
    pageUrl += '&act=' + action;

  return new Promise((resolve, reject) => {
    wx.request({
      url: pageUrl,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'Authorization': wx.getStorageSync('myToken')
      },
      data: transformRequest(params),
      success: function (result) {
        let r = result.data;
        if (r)
          try {
            if (r.ErrorDesc || r.ErrorCode || r.HasError) {
              let msg = (r.ErrorCode && r.ErrorCode !== -1 ? '(' + r.ErrorCode + ') ' : '') + r.ErrorDesc;
              !preventErrorAlert && wx.showModal({
                title: '提示',
                content: msg,
                showCancel: false,
              });
              reject(r);
            }
            else if (typeof r === 'string' && r.match(/error/)) {
              !preventErrorAlert && wx.showModal({
                title: '提示',
                content: r,
                showCancel: false,
              });
              reject(r);
            }
            else
              resolve(r);
          }
          catch (e) {
            reject(e);
            throw e;
          }
        else
          resolve(result.data);
      },
      failure: function (result) {
        console.error(result.message);
        !preventErrorAlert && wx.showModal({
          title: '出错了',
          content: result.message,
          showCancel: false,
        });
        reject(result);
      }
    });
  });
}

httpRequest.setUrl = function (url) {
  baseUrl = url;
  apiBaseUrl = baseUrl + 'Mini/';
  uploadUrl = baseUrl + 'Shared/FileUpload.ashx';
};

export function fileUpload(filePath, name = '') {
  if (!name)
    name = new Date().getTime().toString();
  return wx.uploadFile.promisify({
    url: uploadUrl,
    filePath,
    name
  }).then(x => JSON.parse(x.data));
}
