// PageA/pages/containerinout/containerinout.js
import Toast from 'tdesign-miniprogram/toast/index';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pickVisible: false,
        pickValue: '',
        selectedYardName: '',
        selectedYard: {},
        YardPosition: [],
        YardPositionSelect: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

    },
    //进场登记
    YardIn() {
        var thisView = this;
        if (thisView.data.selectedYardName == "") {
            Toast({
                context: this,
                selector: '#t-toast',
                message: '请选择堆场',
                theme: 'warning',
                direction: 'column',
            });
        }
        wx.navigateTo({
            url: '../containerIn/containerIn?YardPositionId=' + thisView.data.selectedYard.id + '&YardPositionName=' + thisView.data.selectedYard.name + '&YardPositionAddress=' + thisView.data.selectedYard.address, //页面路径
        })
    },
    //提箱出场
    YardOut() {
        var thisView = this;
    },
    onPickerChange(e) {
        var thisView = this;
        var value = e.detail.value[0];
        var label = e.detail.label[0];
        for (var i = 0; i < thisView.data.YardPosition.length; i++) {
            if (label == thisView.data.YardPosition[i].name) {
                thisView.setData({
                    selectedYard: {
                        id: thisView.data.YardPosition[i].id,
                        name: thisView.data.YardPosition[i].name,
                        address: thisView.data.YardPosition[i].address,
                    },
                    selectedYardName: thisView.data.YardPosition[i].Name
                });
            }
        }
        thisView.setData({
            selectedYardName: label
        })
    },
    onPickerCancel() {
        this.setData({
            pickVisible: false
        })
    },
    focusHandle() {
        this.setData({
            pickVisible: true
        })
    },
    QueryUnloadingYardPosition() {
        var thisView = this;
        wx.request({
            url: 'https://www.xiang-cloud.com/Api/Mini/Yard.ashx?act=QueryUnloadingYardPosition',
            data: {},
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                'Authorization': wx.getStorageSync('myToken')
            },
            method: 'POST',
            success: function (res) {
                var selectData = [];
                var YardPositionSelectData = [];
                for (var i = 0; i < res.data.length; i++) {
                    selectData.push({
                        id: res.data[i].Id,
                        name: res.data[i].Name,
                        address: res.data[i].Address,
                    })
                    YardPositionSelectData.push({
                        label: res.data[i].Name,
                        value: res.data[i].Id
                    })
                    if (thisView.data.selectedYardName == res.data[i].Name) {
                        thisView.setData({
                            selectedYard: {
                                id: res.data[i].Id,
                                name: res.data[i].Name,
                                address: res.data[i].Address,
                            },
                        });
                    }
                }
                thisView.setData({
                    YardPosition: selectData,
                    YardPositionSelect: YardPositionSelectData
                });
            },
            fail: function (res) {
                wx.hideLoading()
            },
            complete: function (res) {
                wx.hideLoading()
            },
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
        thisView.QueryUnloadingYardPosition();
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