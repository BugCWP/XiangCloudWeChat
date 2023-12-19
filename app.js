import gulpError from './utils/gulpError';
import {
    helper
} from './core/index'

const buildType = 3; //1:Develop 2:Test 3:Live

helper.polyfill();
helper.configService.setSetting({
    isDebug: buildType == 1,
    baseUrl: buildType == 1 ?
        'http://192.168.0.100:9000/Api/' /* Develop */ : buildType == 2 ?
        'https://www.xiang-cloud.com/Api/' /* Test */ : buildType == 3 ?
        'https://www.xiang-cloud.com/Api/' /* Live */ : '',
});
helper.httpRequest.setUrl(helper.configService.baseUrl);

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
    onLaunch: function (options) {
        helper.authService.wxLogin(true);
        if (!wx.cloud) {
            console.error('请使用2.2.3或以上的基础库以使用云能力')
        } else {
            wx.cloud.init({
                traceUser: true
            })
        }
        var that = this;
        console.log(options);
        switch (options.scene) {
            case 1020:
                wx.setStorageSync("sceneSource", "公众号 profile 页相关小程序列表");
                break;
            case 1035:
                wx.setStorageSync("sceneSource", "公众号自定义菜单");
                break;
            case 1036:
                wx.setStorageSync("sceneSource", "App 分享消息卡片");
                break;
            case 1037:
                wx.setStorageSync("sceneSource", "小程序打开小程序");
                break;
            case 1038:
                wx.setStorageSync("sceneSource", "从另一个小程序返回");
                break;
            case 1043:
                wx.setStorageSync("sceneSource", "公众号模板消息");
                break;
            case 1047:
                wx.setStorageSync("sceneSource", "扫描的小程序码");
                break;
            case 1001:
                wx.setStorageSync("sceneSource", "小程序");
                break;
        }

        //不同的场景值，扫描小程序码进入注册界面.如果扫描的小程序码1047
        // if (options.scene == 1047 && !options.query.scene) {
        //     wx.navigateTo({
        //         url: 'pages/driverregister/driverregister',
        //     })
        // }

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