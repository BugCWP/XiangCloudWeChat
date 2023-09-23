export const promisify = (api) =>
  (options, ...params) => new Promise((resolve, reject) =>
    api(Object.assign({}, options, {
      success: resolve,
      fail: reject
    }), ...params)
  );

export function polyfill() {
  if (!Function.prototype.promisify)
    Function.prototype.promisify = function (options) {
      return promisify(this).call(wx, options);
    }
}
