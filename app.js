import gulpError from './utils/gulpError';
App({
    onShow() {
        if (gulpError !== 'gulpErrorPlaceHolder') {
            wx.redirectTo({
                url: `/pages/gulp-error/index?gulpError=${gulpError}`,
            });
        }
        if (!wx.cloud) {
            console.error('请使用2.2.3或以上的基础库以使用云能力')
        } else {
            wx.cloud.init({
                env: "develop-0g72cvbd5799faa3"
            })
        }

        wx.getSetting({
            success: res => {
                //console.log(res.authSetting);

                wx.setStorageSync("scopeUserInfo", res.authSetting['scope.userInfo']);
                wx.setStorageSync("scopeUserLocation", res.authSetting['scope.userLocation']);

                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        success: res => {
                            // 可以将 res 发送给后台解码出 unionId
                            wx.setStorageSync("mywechatuser", res.userInfo);

                            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                            // 所以此处加入 callback 以防止这种情况
                            if (this.userInfoReadyCallback) {
                                this.userInfoReadyCallback(res)
                            }
                        }
                    })
                }
            }
        })
    },
});