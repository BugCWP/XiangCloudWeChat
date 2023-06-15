// PageA/pages/containerIn/containerIn.js
import Toast from 'tdesign-miniprogram/toast/index';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        YardPositionId: '',
        YardPositionName: '',
        YardPositionAddress: '',
        BoxNumber: '',
        FirmNo: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        var thisView = this;
        if (options.YardPositionId != '') {
            thisView.setData({
                YardPositionId: options.YardPositionId,
                YardPositionName: options.YardPositionName,
                YardPositionAddress: options.YardPositionAddress
            })
        }
    },
    firstClick() {
        var thisView = this;
        if (thisView.data.BoxNumber == '') {
            Toast({
                context: this,
                selector: '#t-toast',
                message: '请输入箱号',
                theme: 'warning',
                direction: 'column',
            });
        } else {
            thisView.GetUnloadingBookingInfo();
        }
    },
    secondClick() {
        var thisView = this;
        if (thisView.data.BoxNumber == '') {
            Toast({
                context: this,
                selector: '#t-toast',
                message: '请输入箱号',
                theme: 'warning',
                direction: 'column',
            });
        } else if (thisView.data.FirmNo == '') {
            Toast({
                context: this,
                selector: '#t-toast',
                message: '请输入公司代码',
                theme: 'warning',
                direction: 'column',
            });
        } else {
            thisView.GetEirInfo();
        }
    },
    goToCamer() {

    },

    GetUnloadingBookingInfo() {
        var thisView = this;
        wx.request({
            url: 'https://www.xiang-cloud.com/Api/Mini/Yard.ashx?act=TryGetUnloadingBookingInfo',
            data: {
                no: thisView.data.BoxNumber,
                yadCompanyId: thisView.data.YardPositionId
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                'Authorization': wx.getStorageSync('myToken')
            },
            method: 'POST',
            success: function (res) {
                if (res.data == '' || res.data.HasError) {
                    var failMessage = res.data == '' ? '未查询到此数据' : res.data.ErrorDesc
                    Toast.fail(failMessage);
                } else {
                    thisView.setData({
                        showPage: 6,
                        cntrNo: res.data.CntrNo,
                        cntrTypeId: res.data.ContainerTypeId,
                        cntrTypeCode: res.data.ContainerTypeName,
                        containerOperatorId: res.data.ContainerOperatorId,
                        containerOperator: res.data.ContainerOperatorName,
                        billNo: res.data.BillNo,
                        vesselName: res.data.VesselName,
                        voyageNo: res.data.VoyageNo,
                        portId: res.data.PortId,
                        port: res.data.PortName,
                        truckNo: res.data.TruckNo,
                        isEmpty: res.data.IsEmpty,
                        IsEmptyName: res.data.IsEmpty ? '空箱' : '重箱'
                    })
                    that.GetContainerInFee();
                }
            },
            fail: function (res) {
                wx.hideLoading()
            },
            complete: function (res) {
                wx.hideLoading()
            },
        })
    },
    GetContainerInFee() {
        var that = this;
        wx.request({
            url: 'https://www.xiang-cloud.com/Api/Mini/Yard.ashx?act=GetContainerInFee',
            data: {
                billNo: that.data.billNo,
                cntrNo: that.data.cntrNo,
                cntrTypeCode: that.data.cntrTypeCode.slice(2),
                cntrSizeCode: that.data.cntrTypeCode.substring(0, 2),
                containerOperator: that.data.containerOperatorId,
                vesselName: that.data.vesselName,
                voyageNo: that.data.voyageNo,
                port: that.data.port,
                truckNo: that.data.truckNo,
                isEmpty: that.data.isEmpty,
                yadCompanyId: that.data.selectedYard.id
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                'Authorization': wx.getStorageSync('myToken')
            },
            method: 'POST',
            success: function (res) {
                if (res.data.HasError) {
                    Toast.fail(res.data.ErrorDesc);
                } else {
                    var FeeList = [];
                    var sum = 0;
                    for (var i = 0; i < res.data.length; i++) {
                        var feeTypeName = that.data.FeeTypeList[res.data[i].FeeTypeId + ""];
                        var settlementTypeName = that.data.SettlementTypeList[res.data[i].SettlementTypeId + ""];
                        FeeList.push({
                            FeeTypeName: feeTypeName,
                            SettlementTypeName: settlementTypeName,
                            Amount: res.data[i].Amount
                        })
                        if (res.data[i].SettlementTypeId == 1601) {
                            sum += res.data[i].Amount;
                        }
                    }
                    that.setData({
                        Feedetail: FeeList,
                        AmountSum: sum,
                        showPage: 6
                    })
                }
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