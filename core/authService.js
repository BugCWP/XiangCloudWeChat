import {helper} from '../core/index'

class AuthService {
  constructor() {
    this._loadUserInfo();
  }

  _loadUserInfo() {
    this.userInfo = wx.getStorageSync('userInfo');
  }

  setUserInfo(userInfo, token) {
    userInfo.token = token;
    this.userInfo = userInfo;
    wx.setStorageSync('userInfo', userInfo);
  }

  get sessionId() {
    return wx.getStorageSync('sessionId');
  }

  set sessionId(value) {
    wx.setStorageSync("sessionId", value);
  }

  get wxUserInfo() {
    return wx.getStorageSync('wxUserInfo');
  }

  set wxUserInfo(value) {
    wx.setStorageSync("wxUserInfo", value);
  }

  get phoneNumber() {
    return wx.getStorageSync('phoneNumber');
  }

  set phoneNumber(value) {
    wx.setStorageSync("phoneNumber", value);
  }

  get sharedBrokerId() {
    return wx.getStorageSync('sharedBrokerId');
  }

  set sharedBrokerId(value) {
    wx.setStorageSync("sharedBrokerId", value);
  }

  get permission() {
    return wx.getStorageSync('permission');
  }

  set permission(value) {
    wx.setStorageSync("permission", value);
  }

  isOperationAuthorized(operateId) {
    return this.permission && this.permission.indexOf(operateId) >= 0;
  }

  get hasUserInfo() {
    return !!this.userInfo;
  }

  wxLogin(forceNew) {
    if (forceNew)
      return wx.login.promisify()
        .then(x => helper.httpRequest('SignIn', 'WeXinLogin2', {code: x.code}))
        .then(x => this.sessionId = x);
    else
      return wx.checkSession.promisify()
        .then(() => Promise.resolve(),
          () => {
            return wx.login.promisify()
              .then(x => helper.httpRequest('SignIn', 'WeXinLogin2', {code: x.code}))
              .then(x => this.sessionId = x)
          }
        );
  }

  ensureSignIn() {
    if (this.hasUserInfo)
      return true;

    wx.login.promisify()
      .then(x => helper.httpRequest('SignIn', 'WeXinLogin2', {code: x.code}))
      .then(x => {
        this.sessionId = x;
        const pages = getCurrentPages();
        this.beforeSignInPage = pages[pages.length - 1].route;//重定向到signIn页面前时的页面路径
        wx.redirectTo({url: 'signIn'});
      });
    return false;
  }

  reSignIn(url) {
    return helper.httpRequest('UserCenter', 'ReSignIn').then(x => {
      helper.authService.setUserInfo(x.OutputValues.UserInfo, x.OutputValues.Token);
      if (url)
        wx.reLaunch({url});
    });
  }

  logout() {
    wx.setStorageSync('cardInfo_last', wx.getStorageSync('cardInfo'));

    this.userInfo = null;
    wx.removeStorageSync('wxUserInfo');
    wx.removeStorageSync('phoneNumber');
    wx.removeStorageSync('userInfo');
    wx.removeStorageSync('cardInfo');
    wx.reLaunch({url: '/pages/recruitmentList'});
  }
}

export const authService = new AuthService();
