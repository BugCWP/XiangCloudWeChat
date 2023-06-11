// PageA/pages/driverInfo/driverInfo.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        image: '',
        myUserName: '',
        myTelephone: '',
        defaultUpZhengImage: "http://www.xiang-cloud.com:8099/images/b.png",
        defaultHeadImage: 'http://www.xiang-cloud.com:8099/images/c.png',
        errDialogShow: false,
        errTitle: '',
        errinfo: '',
        errConfirmBtn: {
            content: '确定',
            variant: 'base'
        },
        SignOutDialogShow: false,
        SignOutConfirmBtn: {
            content: '确定注销',
            variant: 'base'
        },
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

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
        thisView.setData({
            image: wx.getStorageSync("myHeadImg"),
            myUserName: wx.getStorageSync('myUserName'),
            myTelephone: wx.getStorageSync("myTelephone")
        })
    },
    //注销
    signOut() {
        var thisView = this;
        thisView.setData({
            SignOutDialogShow: true
        })
    },
    closeSignOut() {
        var thisView = this;
        thisView.setData({
            SignOutDialogShow: false
        })
    },
    confirmSignOut() {
        var thisView = this;
        wx.showLoading({
            title: '注销中...',
            mask: true
        })
        wx.request({
            url: 'https://www.xiang-cloud.com/Api/Mini/Index.ashx?act=CloseAccount',
            data: {},
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                'Authorization': wx.getStorageSync('myToken')
            },
            method: 'GET',
            success: function (res) {
                var rtn = JSON.parse(JSON.stringify(res));
                if (rtn == undefined || rtn == "")
                    return;
                var result = rtn.data;
                try {
                    if (result.ErrorDesc || result.ErrorCode || result.HasError) {
                        let msg = (result.ErrorCode ? '(' + result.ErrorCode + ') ' : '') + result.ErrorDesc;
                        thisView.setData({
                            errDialogShow: true,
                            errTitle: '注销失败',
                            errinfo: msg,
                            errConfirmBtn: {
                                content: '确定',
                                variant: 'base'
                            }
                        })
                        return;
                    } else if (typeof result === 'string' && result.match(/error/)) {
                        thisView.setData({
                            errDialogShow: true,
                            errTitle: '注销失败',
                            errinfo: result,
                            errConfirmBtn: {
                                content: '确定',
                                variant: 'base'
                            }
                        })
                        return;
                    }
                    thisView.setData({
                        SignOutDialogShow: false
                    })
                    thisView.confirmLogOut();
                } catch (e) {
                    throw e;
                }
            },
            fail: function (res) {
                wx.hideLoading()
                thisView.setData({
                    SignOutDialogShow: false,
                    errDialogShow: true,
                    errTitle: '注销失败',
                    errinfo: res,
                    errConfirmBtn: {
                        content: '确定',
                        variant: 'base'
                    }
                })
            },
            complete: function (res) {
                wx.hideLoading()
                thisView.setData({
                    SignOutDialogShow: true
                })
            },
        })
        return;
    },
    confirmLogOut: function () {
        wx.setStorageSync('myToken', '');
        wx.setStorageSync('myTelephone', '');
        wx.setStorageSync('myUserProfileType', '');
        wx.setStorageSync("mywechatuser", '');
        wx.setStorageSync("mywechatid", '');
        wx.setStorageSync("myHeadImg", '');
        wx.setStorageSync("BindCompanyName", '');
        wx.setStorageSync("BindCompanyLocationAddress", '');
        wx.setStorageSync('myUserName', '');
        wx.clearStorage();
        wx.reLaunch({
            url: '../login/login',
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