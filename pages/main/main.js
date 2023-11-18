// pages/main/main.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        value: 'label_1',
        list: [{
                value: 'label_1',
                label: '接单大厅',
                icon: 'home'
            },
            {
                value: 'label_2',
                label: '操作中',
                icon: 'app'
            },
            {
                value: 'label_3',
                label: '我的',
                icon: 'user'
            },
        ],
        showTextAndTitle: false,
        myUserName: '',
        myTelephone: '',
        image: '',
        showlogout: false,
        logoutconfirmBtn: {
            content: '退出',
            variant: 'base'
        },
        text: 'Copyright © 2021-2031 TD.All Rights Reserved.',
        links: [{
            name: 'v1.0.1',
            openType: 'navigate',
        }],
        phoneNumber: '021-68861893',
        showCall: false,
        callconfirmBtn: {
            content: '拨打',
            variant: 'base'
        },
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        var thisView = this;
        var myToken = wx.getStorageSync('myToken');
        if (myToken == undefined || myToken == null || myToken == '') {
            thisView.setData({
                showTextAndTitle: true
            })
            return;
        }
        var label = wx.getStorageSync("label");
        if (label != undefined && label != null && label != '') {
            thisView.setData({
                value: label
            })
        }
    },
    goOceanShipping(){
        wx.navigateTo({
            url: '../../PageA/pages/oceanShipping/oceanShipping',
        })
    },
    //进场出场
    gocontainerinout() {
        wx.navigateTo({
            url: '../../PageA/pages/containerinout/containerinout',
        })
    },
    callClick() {
        var thisView = this;
        thisView.setData({
            showCall: true
        })
    },
    callConfirm() {
        var thisView = this;
        wx.makePhoneCall({
            phoneNumber: thisView.data.phoneNumber
        })
    },
    closecall() {
        var thisView = this;
        thisView.setData({
            showCall: false
        })
    },
    //退出登录
    logout() {
        var thisView = this;
        thisView.setData({
            showlogout: true
        })
    },
    logoutConfirm() {
        var thisView = this;
        wx.setStorageSync('myToken', '');
        wx.setStorageSync('myTelephone', '');
        wx.setStorageSync('myUserProfileType', '');
        wx.setStorageSync("mywechatuser", '');
        wx.setStorageSync("mywechatid", '');
        wx.setStorageSync("myHeadImg", '');
        wx.setStorageSync("myUserName", '');
        wx.setStorageSync("iscb", '');
        wx.setStorageSync("flashSet", '');
        wx.clearStorage();
        wx.reLaunch({
            url: '../main/main',
        })
    },
    closelogout() {
        var thisView = this;
        thisView.setData({
            showlogout: false
        })
    },
    goLogin() {
        const {
            dialogKey
        } = this.data;
        this.setData({
            [dialogKey]: false
        });
        wx.navigateTo({
            url: '../../PageA/pages/login/login',
        })
    },
    goMine() {
        if (wx.getStorageSync('myUserProfileType') == '103') {
            //司机
            wx.navigateTo({
                url: '../../PageA/pages/driverInfo/driverInfo',
            })
        } else if (wx.getStorageSync('myUserProfileType') == '102') {
            //公司员工
            wx.navigateTo({
                url: '../../PageA/pages/employeeMine/employeeMine',
            })
        } else {
            //公司管理
            wx.navigateTo({
                url: '../../PageA/pages/companyphoto/companyphoto?comefromInfo=1',
            })
        }
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
        var wechatImg = wx.getStorageSync("myHeadImg");
        thisView.setData({
            myUserName: wx.getStorageSync('myUserName'),
            myTelephone: wx.getStorageSync("myTelephone"),
            image: wechatImg == null || wechatImg == '' ? '' : 'https://www.xiang-cloud.com' + wechatImg
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

    },
    onChange(e) {
        this.setData({
            value: e.detail.value,
        });
        wx.setStorageSync("label", e.detail.value);
    },
})