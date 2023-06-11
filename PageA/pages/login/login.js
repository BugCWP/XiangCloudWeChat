// PageA/pages/login/login.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        session_key: '',
        openid: '',
        unionId: '',
        buttonDisable: false,
        verifyCodeTime: '获取验证码',
        telephone: '',
        validatecode: '',
        errDialogShow: false,
        errTitle: '',
        errinfo: '',
        errConfirmBtn: '',
        phoneNo: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

    },
    //跳转集卡司机注册
    goDrive(e) {
        debugger;
        var thisView = this;
        wx.request({
            url: "https://www.xiang-cloud.com/Api/Mini/SignIn.ashx?act=DecryptPhoneNumber",
            data: {
                sessionId: thisView.data.session_key,
                encryptedData: e.detail.encryptedData,
                iv: e.detail.iv
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            success: function (res) {
                var rtn = JSON.parse(JSON.stringify(res));
                if (rtn == undefined || rtn == "")
                    return;
                var result = rtn.data;
                if (result == undefined || result == null || result.phoneNumber == undefined || result.phoneNumber == null || result.phoneNumber == "") {
                    thisView.setData({
                        errTitle: '注册失败',
                        errDialogShow: true,
                        errinfo: result.ErrorDesc != '' ? result.ErrorDesc : '由于用户主动拒绝，未获取到手机号，请重新授权',
                        errConfirmBtn: {
                            content: '确认',
                            variant: 'base'
                        }
                    })
                    return;
                }
                thisView.setData({
                    phoneNo: result.phoneNumber
                })
                thisView.confirmContinue(e);
            },
            fail: function (err) {
                var errResult = err;
            }
        })
    },
    confirmContinue(e) {
        var thisView = this;
        var mobile = thisView.data.phoneNo; //e.detail.value.telphone;
        if (mobile.length == 0) {
            wx.showToast({
                title: '请获取手机号',
                icon: 'none',
                duration: 1500
            })
            return;
        }
        wx.setStorageSync('myTelephone', mobile);
        wx.showLoading({
            title: '正在保存',
            mask: true
        })
        wx.request({
            url: 'https://www.xiang-cloud.com/Api/Mini/SignIn.ashx?act=RegisterAccount',
            data: {
                paraUserName: wx.getStorageSync('mywechatuser').nickName,
                paraTelphone: mobile,
                paraPassword: '',
                paraWeChatNumber: wx.getStorageSync("mywechatid"),
                source: wx.getStorageSync("sceneSource")
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            success: function (res) {
                var rtn = JSON.parse(JSON.stringify(res));
                if (rtn == undefined || rtn == "")
                    return;
                var result = rtn.data;
                if (result)
                    try {
                        if (result.ErrorDesc || result.ErrorCode || result.HasError) {
                            let msg = (result.ErrorCode ? '(' + result.ErrorCode + ') ' : '') + result.ErrorDesc;
                            thisView.setData({
                                errTitle: '注册失败',
                                errDialogShow: true,
                                errinfo: msg,
                                errConfirmBtn: {
                                    content: '确认',
                                    variant: 'base'
                                }
                            })
                            return;
                        } else if (typeof result === 'string' && result.match(/error/)) {
                            thisView.setData({
                                errTitle: '注册失败',
                                errDialogShow: true,
                                errinfo: result,
                                errConfirmBtn: {
                                    content: '确认',
                                    variant: 'base'
                                }
                            })
                            return;
                        }
                    }
                catch (e) {
                    throw e;
                }
                wx.request({
                    url: 'https://www.xiang-cloud.com/Api/Mini/SignIn.ashx?act=BindCompany',
                    data: {
                        paraTelphone: thisView.data.phoneNo,
                        companyId: '',
                        bizLocationId: '',
                        isDriver: true
                    },
                    header: {
                        'content-type': 'application/x-www-form-urlencoded',
                        'Authorization': wx.getStorageSync("myToken")
                    },
                    method: 'POST',
                    success: function (res) {
                        thisView.RegisetrSigin(e);
                    },
                    fail: function (res) {
                        wx.hideLoading()
                        thisView.setData({
                            errTitle: '注册失败',
                            errDialogShow: true,
                            errinfo: res,
                            errConfirmBtn: {
                                content: '确认',
                                variant: 'base'
                            }
                        })
                    },
                    complete: function (res) {
                        wx.hideLoading()
                    }
                })
            },
            fail: function (res) {
                wx.hideLoading()
                thisView.setData({
                    errTitle: '注册失败',
                    errDialogShow: true,
                    errinfo: res,
                    errConfirmBtn: {
                        content: '确认',
                        variant: 'base'
                    }
                })
            },
            complete: function (res) {
                wx.hideLoading()
            },
        })
    },
    RegisetrSigin(e) {
        var thisView = this;
        var myToken = wx.getStorageSync('myToken');
        if (myToken == undefined || myToken == null || myToken == "") {
            wx.login({
                success: function (res) {
                    if (res.code) {
                        var js_code = res.code;
                        wx.request({
                            url: 'https://www.xiang-cloud.com/Api/Mini/SignIn.ashx?act=WeXinLogin2',
                            data: {
                                code: js_code
                            },
                            header: {
                                'content-type': 'application/json'
                            },
                            success: function (myres) {
                                debugger;
                                var myresRtn = JSON.parse(JSON.stringify(myres));
                                if (myresRtn == undefined || myresRtn == "")
                                    return;
                                wx.request({
                                    url: "https://www.xiang-cloud.com/Api/Mini/SignIn.ashx?act=LoginByViaWeXinPhone",
                                    data: {
                                        sessionId: myresRtn.data,
                                        encryptedData: e.detail.encryptedData,
                                        iv: e.detail.iv,
                                        unionId: res.result.unionid
                                    },
                                    header: {
                                        'content-type': 'application/x-www-form-urlencoded'
                                    },
                                    method: 'POST',
                                    success: function (res) {
                                        var rtn = JSON.parse(JSON.stringify(res));
                                        if (rtn == undefined || rtn == "")
                                            return;
                                        var result = rtn.data;
                                        if (result) {
                                            if (result.ErrorDesc || result.ErrorCode || result.HasError) {
                                                let msg = (result.ErrorCode ? '(' + result.ErrorCode + ') ' : '') + result.ErrorDesc;
                                                return;
                                            } else if (typeof result === 'string' && result.match(/error/)) {
                                                return;
                                            }
                                        }
                                        if (result.OutputValues.UserInfo.ProfileTypeId == null) {
                                            wx.setStorageSync('myTelephone', result.OutputValues.UserInfo.Phone);
                                            return;
                                        }
                                        wx.setStorageSync('myToken', result.OutputValues.Token);
                                        wx.setStorageSync('BindCompanyId', result.OutputValues.UserInfo.BindCompanyId);
                                        wx.setStorageSync('myTelephone', result.OutputValues.UserInfo.Phone);
                                        wx.setStorageSync('myUserProfileType', result.OutputValues.UserInfo.ProfileTypeId);
                                        wx.setStorageSync('myHeadImg', '');
                                        wx.setStorageSync('BindCompanyName', result.OutputValues.UserInfo.BindCompanyName == null ? "" : result.OutputValues.UserInfo.BindCompanyName);
                                        wx.setStorageSync('BindCompanyLocationAddress', result.OutputValues.UserInfo.BindCompanyLocationAddress == null ? "" : result.OutputValues.UserInfo.BindCompanyLocationAddress);
                                        wx.setStorageSync('myUserName', result.OutputValues.UserInfo.UserName);
                                        if (result.OutputValues != undefined && result.OutputValues != null &&
                                            result.OutputValues.UserInfo != undefined && result.OutputValues.UserInfo != null &&
                                            result.OutputValues.UserInfo.HeadImage != undefined && result.OutputValues.UserInfo.HeadImage != null) {
                                            wx.setStorageSync('myHeadImg', result.OutputValues.UserInfo.HeadImage);
                                        }
                                        wx.reLaunch({
                                            url: '/packageA/pages/driverInfo/driverInfo?regist=1',
                                        })
                                    },
                                    fail: function (err) {}
                                })
                            },
                            fail: function (err) {}
                        })
                    }
                }
            })
            return;
        }
    },
    //跳转集运公司老板注册
    goCompany() {

    },
    //跳转集运公司员工注册
    goEmployee() {

    },
    closeErrDialog() {
        var thisView = this;
        thisView.setData({
            errTitle: '',
            errDialogShow: false,
            errinfo: '',
            errConfirmBtn: ''
        })
    },
    getPhoneNumber(e) {
        var thisView = this;
        thisView.LoginByViaWeXinPhone(e);
    },
    //快捷登录
    LoginByViaWeXinPhone(e) {
        var thisView = this;
        wx.request({
            url: "https://www.xiang-cloud.com/Api/Mini/SignIn.ashx?act=LoginByViaWeXinPhone",
            data: {
                sessionId: thisView.data.session_key,
                encryptedData: e.detail.encryptedData,
                iv: e.detail.iv,
                unionId: wx.getStorageSync('unionId')
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            success: function (res) {
                console.log(res)
                var rtn = JSON.parse(JSON.stringify(res));
                if (rtn == undefined || rtn == "")
                    return;
                var result = rtn.data;
                if (result) {
                    if (result.ErrorDesc || result.ErrorCode || result.HasError) {
                        let msg = (result.ErrorCode ? '(' + result.ErrorCode + ') ' : '') + result.ErrorDesc;
                        thisView.setData({
                            errTitle: '登录失败',
                            errDialogShow: true,
                            errinfo: msg,
                            errConfirmBtn: {
                                content: '确认',
                                variant: 'base'
                            }
                        })
                        return;
                    } else if (typeof result === 'string' && result.match(/error/)) {
                        thisView.setData({
                            errTitle: '登录失败',
                            errDialogShow: true,
                            errinfo: result,
                            errConfirmBtn: {
                                content: '确认',
                                variant: 'base'
                            }
                        })
                        return;
                    }
                }

                if (result.OutputValues.UserInfo.ProfileTypeId == null) {
                    wx.setStorageSync('myTelephone', result.OutputValues.UserInfo.Phone);

                    thisView.setData({
                        errTitle: '登录失败',
                        errDialogShow: true,
                        errinfo: "请先注册或绑定公司",
                        errConfirmBtn: {
                            content: '确认',
                            variant: 'base'
                        }
                    })
                    return;
                }
                wx.setStorageSync('myToken', result.OutputValues.Token);
                wx.setStorageSync('BindCompanyId', result.OutputValues.UserInfo.BindCompanyId);
                wx.setStorageSync('myTelephone', result.OutputValues.UserInfo.Phone);
                wx.setStorageSync('myUserProfileType', result.OutputValues.UserInfo.ProfileTypeId);
                wx.setStorageSync('myHeadImg', '');
                wx.setStorageSync('BindCompanyName', result.OutputValues.UserInfo.BindCompanyName == null ? "" : result.OutputValues.UserInfo.BindCompanyName);
                wx.setStorageSync('BindCompanyLocationAddress', result.OutputValues.UserInfo.BindCompanyLocationAddress == null ? "" : result.OutputValues.UserInfo.BindCompanyLocationAddress);
                wx.setStorageSync('myUserName', result.OutputValues.UserInfo.UserName);
                if (result.OutputValues != undefined && result.OutputValues != null &&
                    result.OutputValues.UserInfo != undefined && result.OutputValues.UserInfo != null &&
                    result.OutputValues.UserInfo.HeadImage != undefined && result.OutputValues.UserInfo.HeadImage != null) {
                    wx.setStorageSync('myHeadImg', result.OutputValues.UserInfo.HeadImage);
                }
                wx.reLaunch({
                    url: '../../../pages/main/main',
                })
            },
            fail: function (err) {
                var errResult = err;
            }
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        var thisView = this;
        //地理位置授权
        wx.getSetting({
            success: (res) => {
                if (!res.authSetting['scope.userLocation'] && !res.authSetting['scope.userLocationBackground']) { //非初始化进入该页面,且未授权
                    wx.showModal({
                        title: '是否授权当前位置',
                        content: '需要获取您的地理位置，请确认授权，否则无法获取您所需数据。请选择[使用小程序期间和离开小程序后]',
                        success: function (res) {
                            if (res.cancel) {
                                wx.showToast({
                                    title: '授权失败',
                                    icon: 'none',
                                    duration: 1000
                                })
                            } else if (res.confirm) {
                                wx.openSetting({
                                    success: function (data) {
                                        if (data.authSetting["scope.userLocation"] == true) {
                                            wx.showToast({
                                                title: '授权成功',
                                                icon: 'success',
                                                duration: 1000
                                            })
                                        } else if (data.authSetting["scope.userLocationBackground"] == true) {
                                            wx.showToast({
                                                title: '授权成功',
                                                icon: 'success',
                                                duration: 1000
                                            })
                                        } else {
                                            wx.showToast({
                                                title: '授权失败',
                                                icon: 'none',
                                                duration: 1000
                                            })
                                        }
                                    }
                                })
                            }
                        }
                    })
                }
            }
        })
        var myToken = wx.getStorageSync('myToken');
        if (myToken == undefined || myToken == null || myToken == "") {
            wx.login({
                success: function (res) {
                    if (res.code) {
                        var js_code = res.code;
                        thisView.getWeXinLogin(js_code);
                    }
                }
            })
            return;
        }
        wx.reLaunch({
            url: '../../../pages/mainform/mainform',
        })
    },
    getjscode2session(js_code) {
        var thisView = this;
        wx.request({
            url: 'https://api.weixin.qq.com/sns/jscode2session',
            data: {
                appid: 'wx29db92d7ac791a0f',
                secret: '2cf25582f67e91e8cf9a830b32725b2b',
                js_code: js_code,
                grant_type: 'authorization_code'
            },
            header: {
                'content-type': 'application/json'
            },
            success: function (myres) {
                var rtn = JSON.parse(JSON.stringify(myres));
                if (rtn == undefined || rtn == "")
                    return;
                thisView.setData({
                    openid: rtn.data.openid,
                    unionId: rtn.data.unionId
                })
                wx.setStorageSync('unionId', rtn.data.unionid);
            },
            fail: function (err) {}
        })
    },
    getWeXinLogin(e) {
        var thisView = this;
        wx.request({
            url: 'https://www.xiang-cloud.com/Api/Mini/SignIn.ashx?act=WeXinLogin2',
            data: {
                code: e
            },
            header: {
                'content-type': 'application/json'
            },
            success: function (myres) {
                var rtn = JSON.parse(JSON.stringify(myres));
                if (rtn == undefined || rtn == "")
                    return;
                thisView.setData({
                    session_key: rtn.data,
                })
            },
            fail: function (err) {}
        })
    },
    //获取验证码
    getCode: function () {
        if (this.data.buttonDisable) return false;
        var thisView = this;
        var mobile = thisView.data.telephone;
        var regMobile = /^1\d{10}$/;
        var rg = new RegExp(regMobile);
        if (!rg.test(mobile)) {
            wx.showToast({
                title: '手机号有误',
                icon: 'none',
                duration: 1500
            })
            return;
        }
        var c = 60;
        var intervalId = setInterval(function () {
            c = c - 1;
            thisView.setData({
                verifyCodeTime: c + 's后重发',
                buttonDisable: true
            })
            if (c == 0) {
                clearInterval(intervalId);
                that.setData({
                    verifyCodeTime: '获取验证码',
                    buttonDisable: false
                })
            }
        }, 1000)

        wx.request({
            url: "https://www.xiang-cloud.com/Api/Mini/SignIn.ashx?act=GetCaptcha",
            data: {
                phone: mobile
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            success: function (res) {
                var rtn = JSON.parse(JSON.stringify(res));
                if (rtn == undefined || rtn == "")
                    return;
                var result = rtn.data;
            },
        })
    },

    //账号密码登录
    loginGotoMainForm() {
        var thisView = this;
        if (thisView.data.telephone == '') {
            wx.showToast({
                title: '请输入手机号',
                icon: 'none',
                duration: 1500
            })
            this.setData({
                usernameFocus: true
            })

            return;
        };
        if (thisView.data.validatecode == '') {
            wx.showToast({
                title: '请输入验证码',
                icon: 'none',
                duration: 1500
            })
            return;
        };
        wx.showLoading({
            title: '正在登录',
            mask: true
        })
        wx.request({
            url: 'https://www.xiang-cloud.com/Api/Mini/SignIn.ashx?act=LoginByCaptcha',
            data: {
                paraTelphone: thisView.data.telephone,
                captcha: thisView.data.validatecode
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            success: function (res) {
                var rtn = JSON.parse(JSON.stringify(res));
                if (rtn == undefined || rtn == "")
                    return;
                var result = rtn.data;
                if (result) {
                    if (result.ErrorDesc || result.ErrorCode || result.HasError) {
                        let msg = (result.ErrorCode ? '(' + result.ErrorCode + ') ' : '') + result.ErrorDesc;
                        thisView.setData({
                            errTitle: '登录失败',
                            errDialogShow: true,
                            errinfo: msg,
                            errConfirmBtn: '确认'
                        })
                        return;
                    } else if (typeof result === 'string' && result.match(/error/)) {
                        thisView.setData({
                            errTitle: '登录失败',
                            errDialogShow: true,
                            errinfo: result,
                            errConfirmBtn: '确认'
                        })
                        return;
                    }
                }
                if (result.OutputValues.UserInfo.ProfileTypeId == null) {
                    wx.setStorageSync('myTelephone', thisView.data.telephone);
                    thisView.setData({
                        errTitle: '登录失败',
                        errDialogShow: true,
                        errinfo: '请先注册或绑定公司',
                        errConfirmBtn: '确认'
                    })
                    return;
                }

                wx.setStorageSync('myToken', result.OutputValues.Token);
                wx.setStorageSync('myTelephone', thisView.data.telephone);
                wx.setStorageSync('myUserProfileType', result.OutputValues.UserInfo.ProfileTypeId);
                wx.setStorageSync('myHeadImg', '');
                wx.setStorageSync('BindCompanyName', result.OutputValues.UserInfo.BindCompanyName == null ? "" : result.OutputValues.UserInfo.BindCompanyName);
                wx.setStorageSync('BindCompanyLocationAddress', result.OutputValues.UserInfo.BindCompanyLocationAddress == null ? "" : result.OutputValues.UserInfo.BindCompanyLocationAddress);
                wx.setStorageSync('myUserName', result.OutputValues.UserInfo.UserName);
                if (result.OutputValues != undefined && result.OutputValues != null &&
                    result.OutputValues.UserInfo != undefined && result.OutputValues.UserInfo != null &&
                    result.OutputValues.UserInfo.HeadImage != undefined && result.OutputValues.UserInfo.HeadImage != null) {
                    wx.setStorageSync('myHeadImg', result.OutputValues.UserInfo.HeadImage);
                }
                wx.reLaunch({
                    url: '../../../pages/main/main',
                })
            },
            fail: function (res) {
                wx.hideLoading()
                thisView.setData({
                    errTitle: '登录失败',
                    errDialogShow: true,
                    errinfo: res,
                    errConfirmBtn: '确认'
                })
            },
            complete: function (res) {
                wx.hideLoading()
            },
        })
    },
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})