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
        FirmNo: '',
        cntrNo: '',
        cntrTypeId: '',
        cntrTypeCode: '',
        containerOperatorId: '',
        containerOperator: '',
        billNo: '',
        vesselName: '',
        voyageNo: '',
        portId: '',
        port: '',
        truckNo: '',
        isEmpty: '',
        IsEmptyName: '',
        showEirData: false,
        activeValues: [0],
        showFree: false,
         Feedetail: [],
        AmountSum: 0,
        version: 'develop',
        eirsrc: '',
        FeeTypeList: {
            4: '落箱费(空箱)',
            5: '落箱费(重箱)',
            6: '超期费(一档)',
            7: '超期费(二档)',
            8: '超期费(三档)',
            9: '超期费(四档)',
            10: '超期费(五档)',
            11: '超期费(六档)',
            12: '代进港(外一二)',
            13: '代进港(外四五)',
            14: '代进港(洋山)',
            16: '代提箱(浦西一)',
            17: '代提箱(浦西二)',
            18: '代提箱(外港一)',
            19: '代提箱(外港二)',
            20: '代提箱(临港一)',
            21: '代提箱(临港二)',
            22: '代提箱(奉贤)',
            23: '代提箱(洋山)',
            24: '制冷费',
            25: '通用代收',
            26: '通用代付',
            27: '返费退佣',
            28: '过车',
            29: '调箱门'
        },
        SettlementTypeList: {
            1601: '现结',
            1602: '月结',
            1603: '预付',
            1604: '后付'
        },
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
    submitOrder() {
        var thisView = this;
        var version = thisView.data.version;
        var currencyType = 'CNY';
        var paymentArgs = {};
        var fee = thisView.AmountSum * 100;
        fee = 1;
        if (this.data.AmountSum == 0) {
            thisView.SubmitContainerIn();
        } else {
            wx.requestPluginPayment({
                fee,
                paymentArgs,
                currencyType,
                version,
                success(r) {
                    debugger
                    thisView.SubmitContainerIn();
                },
                fail(e) {
                    console.error(e)
                }
            })
        }
    },
    SubmitContainerIn() {
        var thisView = this;
        wx.request({
            url: 'https://www.xiang-cloud.com/Api/Mini/Yard.ashx?act=SubmitContainerIn',
            data: {
                billNo: thisView.data.billNo,
                cntrNo: thisView.data.cntrNo,
                cntrTypeCode: thisView.data.cntrTypeCode.slice(2),
                cntrSizeCode: thisView.data.cntrTypeCode.substring(0, 2),
                containerOperator: thisView.data.containerOperatorId,
                vesselName: thisView.data.vesselName,
                voyageNo: thisView.data.voyageNo,
                port: thisView.data.port,
                truckNo: thisView.data.truckNo,
                isEmpty: thisView.data.isEmpty,
                yadCompanyId: thisView.data.YardPositionId
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                'Authorization': wx.getStorageSync('myToken')
            },
            method: 'POST',
            success: function (res) {
                if (res.data.HasError) {
                    Toast({
                        context: thisView,
                        selector: '#t-toast',
                        message: res.data.ErrorDesc,
                        theme: 'warning',
                        direction: 'column',
                    });
                } else {
                    wx.redirectTo({
                        url: '../containerSuccess/containerSuccess',
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
    handleChange(e) {
        this.setData({
            activeValues: e.detail.value
        });
    },
    firstClick() {
        var thisView = this;
        if (thisView.data.BoxNumber == '') {
            Toast({
                context: thisView,
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
                context: thisView,
                selector: '#t-toast',
                message: '请输入箱号',
                theme: 'warning',
                direction: 'column',
            });
        } else if (thisView.data.FirmNo == '') {
            Toast({
                context: thisView,
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
        var objImageClick = 'uploadFile';
        var objImageUrl = '';
        var thisView = this;
        wx.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: ['album'],
            success: function (res) {
                var tempFilePaths = res.tempFilePaths
                wx.showLoading({
                    title: '上传图片...',
                    mask: true
                })
                wx.uploadFile({
                    url: 'https://www.xiang-cloud.com/Api/Shared/FileUpload.ashx',
                    filePath: tempFilePaths[0],
                    name: objImageClick,
                    success: function (res) {
                        wx.hideLoading()
                        var obj = JSON.parse(res.data);
                        objImageUrl = obj.Url;
                        thisView.ocrImage(objImageUrl, tempFilePaths[0]);
                    },
                    fail: function (e) {
                        wx.hideLoading()
                    },
                    complete(res) {}
                })
            }
        })
    },
    ocrImage(urlStr, localPath) {
        var thisView = this;
        wx.request({
            url: 'https://www.xiang-cloud.com/Api/Mini/SignIn.ashx?act=OcrDriverEir&path=' + urlStr,
            data: {},
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            success: function (res) {
                thisView.setData({
                    cntrNo: res.data.CntrNo,
                    cntrTypeCode: res.data.ContainerType,
                    containerOperator: res.data.ContainerOperator,
                    billNo: res.data.BillNo,
                    vesselName: res.data.VesselName,
                    voyageNo: res.data.VoyageNo,
                    port: res.data.From,
                    truckNo: res.data.TruckNo,
                    isEmpty: true,
                    IsEmptyName: '空箱',
                    showEirData: true,
                    eirsrc: localPath
                })
            },
            fail: function (res) {
                wx.hideLoading()
                Toast({
                    context: thisView,
                    selector: '#t-toast',
                    message: 'eir截图识别失败',
                    theme: 'warning',
                    direction: 'column',
                });
            },
            complete: function (res) {
                wx.hideLoading()
            },
        })
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
                    var failMessage = res.data == '' ? '未查询到此数据,请选择其他检索方式' : res.data.ErrorDesc
                    Toast({
                        context: thisView,
                        selector: '#t-toast',
                        message: failMessage,
                        theme: 'warning',
                        direction: 'column',
                    });
                } else {
                    thisView.setData({
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
                    thisView.GetContainerInFee();
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
        var thisView = this;
        wx.request({
            url: 'https://www.xiang-cloud.com/Api/Mini/Yard.ashx?act=GetContainerInFee',
            data: {
                billNo: thisView.data.billNo,
                cntrNo: thisView.data.cntrNo,
                cntrTypeCode: thisView.data.cntrTypeCode.slice(2),
                cntrSizeCode: thisView.data.cntrTypeCode.substring(0, 2),
                containerOperator: thisView.data.containerOperatorId,
                vesselName: thisView.data.vesselName,
                voyageNo: thisView.data.voyageNo,
                port: thisView.data.port,
                truckNo: thisView.data.truckNo,
                isEmpty: thisView.data.isEmpty,
                yadCompanyId: thisView.data.YardPositionId
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                'Authorization': wx.getStorageSync('myToken')
            },
            method: 'POST',
            success: function (res) {
                if (res.data.HasError) {
                    Toast({
                        context: thisView,
                        selector: '#t-toast',
                        message: res.data.ErrorDesc,
                        theme: 'warning',
                        direction: 'column',
                    });
                } else {
                    var FeeList = [];
                    var sum = 0;
                    for (var i = 0; i < res.data.length; i++) {
                        var feeTypeName = thisView.data.FeeTypeList[res.data[i].FeeTypeId + ""];
                        var settlementTypeName = thisView.data.SettlementTypeList[res.data[i].SettlementTypeId + ""];
                        FeeList.push({
                            FeeTypeName: feeTypeName,
                            SettlementTypeName: settlementTypeName,
                            Amount: res.data[i].Amount
                        })
                        if (res.data[i].SettlementTypeId == 1601) {
                            sum += res.data[i].Amount;
                        }
                    }
                    thisView.setData({
                        Feedetail: FeeList,
                        AmountSum: sum,
                        showFree: true
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
    InformationConfirm() {
        this.GetContainerInFee();
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