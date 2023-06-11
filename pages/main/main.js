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
        image: ''
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
                url: '../driverphoto/driverphoto?comefromInfo=1',
            })
        } else {
            //公司管理
            wx.navigateTo({
                url: '../companyphoto/companyphoto?comefromInfo=1',
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
    },
})