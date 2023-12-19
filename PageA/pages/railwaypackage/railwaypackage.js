import {
    helper
} from '../../../core/index';
Page({


    /**
     * 页面的初始数据
     */
    data: {
        flashSet: 'auto',
        flashArr: [{
            num: 'torch',
            value: '打开',
            checked: true
        }, {
            num: 'off',
            value: '关闭',
            checked: false
        }],
        ctx: '',
        comID: 75,
        documentId: '',
        imgTemp: '',
        containerNo: '',
        directUpload: true,
        photographNum: 0,

        hiddenRules: true,
        hiddenNotice: true,
        dataArray: [],
        srcImg: 'http://www.xiang-cloud.com:8099/images/psxmz.png',
        modalSuccessHidden: true,
        successinfo: '',
        modalTitle: '识别结果(Identification results)',
        failRecords: 0,
        hiddenShowTip: true,
        hiddenPhotoPage: true,
        hiddenPhotoButtonPage: true,
        templateImg: '../../img/101.png',
        hiddenmainpage: false,
        showGetPhoneNumberBtn: false,
        tempCompanyId: null, //临时扫的目标公司二维码
        companyCode: '', //目标公司Code
        widthval: 0,
        heightval: 0,
        isshowimg: false,
        localLng: 0,
        localLet: 0,
        YuYue: false,
        YuYueDate: {},
        ResvDriverInfo: '',
        ResvPlateNo: '',
        ResvPhone: '',
        cntrSize: 40,
        JiaoYan: false,
        templateImg: '../../../img/101.png',
        lightName: '../../../img/lightning-no.png',
    },
    cntrSizeRadioChange(e) {
        this.setData({
            cntrSize: parseInt(e.detail.value)
        })
    },
    lightChange() {
        var thisView = this;
        if (thisView.data.flashSet == 'off') {
            thisView.setData({
                lightName: '../../../img/lightning.png',
                flashSet: 'torch'
            })
            wx.setStorageSync('flashSet', 'torch');
        } else {
            thisView.setData({
                lightName: '../../../img/lightning-no.png',
                flashSet: 'off'
            })
            wx.setStorageSync('flashSet', 'off');
        }
    },
    getown() {
        var thisView = this;
        var apiUrl = 'https://www.xiang-cloud.com/Api/Mini/Index.ashx?act=GetDriverInfo';
        wx.request({
            url: apiUrl,
            data: {
                phone: wx.getStorageSync('myTelephone')
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                'Authorization': wx.getStorageSync('myToken')
            },
            method: 'POST',
            success: function (res) {
                var rtn = JSON.parse(JSON.stringify(res));
                if (rtn == undefined || rtn == "")
                    return;

                var result = rtn.data;
                //
                thisView.setData({
                    ResvDriverInfo: result.UserName,
                    ResvPhone: result.Phone,
                    ResvPlateNo: result.CrmDriverVehicleLicense == null ? '' : result.CrmDriverVehicleLicense.PlateNo
                })
            },
            fail: function (res) {
                wx.hideLoading()
            },
            complete: function (res) {
                wx.hideLoading()
            },
        })
    },
    showYuYue(e) {
        this.setData({
            YuYue: true,
            YuYueDate: e.currentTarget.dataset.item
        });
    },
    downloadPDF(e) {
        //;
        wx.downloadFile({
            url: "https://www.xiang-cloud.com" + e.currentTarget.dataset.src,
            success: function (res) {
                const filePath = res.tempFilePath
                wx.openDocument({
                    filePath: filePath,
                    showMenu: true
                });
            }
        });
    },
    closeYuYue() {
        this.setData({
            YuYue: false
        });
    },
    closeGetPhoneNumber() {
        this.setData({
            showGetPhoneNumberBtn: false
        });
    },
    changeCar() {
        wx.navigateTo({
            url: '../dengji/dengji'
        })
    },
    submitYuYue(e) {
        //
        var thisView = this;
        var item = e.currentTarget.dataset.item;
        var apiUrl = 'https://www.xiang-cloud.com/Api/Mini/Rail.ashx?act=CreateRailVehicleReservation';
        var ResvDriverInfo = '';
        if (thisView.data.ResvDriverInfo == null || thisView.data.ResvDriverInfo == 'undefined' || thisView.data.ResvDriverInfo == '') {
            wx.showToast({
                title: '未检查到登陆人姓名，请更新驾驶证信息',
                icon: 'none',
                duration: 1500
            })
            return;
        } else {
            ResvDriverInfo = thisView.data.ResvDriverInfo;
        }

        var ResvPlateNo = ''
        if (thisView.data.ResvPlateNo == null || thisView.data.ResvPlateNo == 'undefined' || thisView.data.ResvPlateNo == '') {
            wx.showToast({
                title: '未检查到登陆人车牌号，请更新车辆信息',
                icon: 'none',
                duration: 1500
            })
            ResvPlateNo = thisView.data.ResvPlateNo;
            return;
        } else {
            ResvPlateNo = thisView.data.ResvPlateNo;
        }

        var ResvPhone = '';
        if (thisView.data.ResvPhone == null || thisView.data.ResvPhone == 'undefined' || thisView.data.ResvPhone == '') {
            wx.showToast({
                title: '未检查到登陆人手机号，请更新驾驶证信息',
                icon: 'none',
                duration: 1500
            })
            return;
        } else {
            ResvPhone = thisView.data.ResvPhone;
        }
        wx.showLoading({
            title: '提交中...',
            mask: true
        })
        wx.request({
            url: apiUrl,
            data: {
                id: item.Id,
                driverInfo: ResvDriverInfo,
                plateNo: ResvPlateNo,
                phone: ResvPhone
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                'Authorization': wx.getStorageSync('myToken')
            },
            method: 'POST',
            success: function (res) {

                wx.hideLoading()

                var rtn = JSON.parse(JSON.stringify(res));

                if (rtn == undefined || rtn == "")
                    return;

                var result = rtn.data;

                if (result.ErrorDesc != null && result.ErrorDesc != "") {
                    thisView.setData({
                        modalSuccessHidden: false,
                        successinfo: result.ErrorDesc
                    })
                } else {
                    thisView.setData({
                        YuYue: false
                    });

                    helper.httpRequest('Rail', 'GetBoxPackingDocument', {
                            id: thisView.data.documentId
                        })
                        .then(x => {
                            console.log(x)
                            var result = x
                            if (result.DoorPhoto) {
                                var arrData = [];
                                console.log(arrData.length)
                                var obj = {};
                                obj.Id = result.Id;
                                obj.srcImg = (result.DoorPhoto.indexOf('https://www.xiang-cloud.com/uploads/zxzp/') != -1) ? result.DoorPhoto : 'https://www.xiang-cloud.com/uploads/zxzp/' + result.DoorPhoto;
                                obj.packageNo = result.CntrNo;
                                obj.packageType = result.CntrSizeCode + result.CntrTypeCode;
                                obj.guandanhao = result.BillNo;
                                obj.liushuihao = result.BizNo;
                                obj.importImageTitle = result.DoorPhoto ? '继续拍照' : '拍箱门照';
                                //obj.completeDate = result.CompleteDate;
                                obj.createdDate = result.CreatedDate;
                                if (result.BoxPackingRailYard) {
                                    obj.address = result.BoxPackingRailYard.Address;
                                    obj.lng = result.BoxPackingRailYard.Lng;
                                    obj.lat = result.BoxPackingRailYard.Lat;
                                    obj.FullName = result.BoxPackingRailYard.FullName;
                                } else {
                                    obj.address = '';
                                    obj.lng = '';
                                    obj.lat = '';
                                    obj.FullName = '';
                                }
                                obj.shipmentDate = result.ShipmentDate;
                                obj.inPortDate = result.InPortDate;
                                obj.completeDate = result.CompleteDate;
                                obj.ResvPlateNo = result.ResvPlateNo;
                                obj.ResvPhone = result.ResvPhone;
                                obj.ResvDate = result.ResvDate;
                                obj.Longitude = result.Longitude;
                                obj.Latitude = result.Latitude;
                                obj.InPortBy = result.InPortBy;
                                obj.RailInReceiptPath = result.RailInReceiptPath;
                                arrData.push(obj);

                                var arrList = JSON.parse(JSON.stringify(arrData));
                                thisView.setData({
                                    dataArray: arrList
                                })
                                wx.setStorageSync('saveIdsArrayRailwayPackage', thisView.data.dataArray);
                                var mimg = (result.DoorPhoto.indexOf('https://www.xiang-cloud.com/uploads/zxzp/') != -1) ? result.DoorPhoto : 'https://www.xiang-cloud.com/uploads/zxzp/' + result.DoorPhoto
                                // wx.navigateTo({
                                //   url: '../railwaypackagephoto/railwaypackagephoto?id=' + result.Id + '&packageNo=' + result.CntrNo+
                                //     '&packageType=' + result.CntrSizeCode + result.CntrTypeCode + '&guandanhao=' +result.BillNo +
                                //     '&liushuihao=' + result.BizNo + '&srcImg=' + mimg
                                // })
                            } else {
                                var arrData = [];
                                arrData[0].guandanhao = result.BillNo;
                                arrData[0].liushuihao = result.BizNo;
                                var arrList = JSON.parse(JSON.stringify(arrData));
                                thisView.setData({
                                    dataArray: arrList
                                })
                            }
                            console.log(thisView.data.dataArray)
                        });
                    if (item.Lat != null && item.Lat != '' && item.Lng != null && item.Lng != '') {
                        wx.openLocation({
                            latitude: parseFloat(item.Lat), //维度
                            longitude: parseFloat(item.Lng), //经度
                            scale: 15, //缩放比例
                            name: item.FullName,
                            address: item.Address
                        })
                    } else {
                        wx.showToast({
                            title: '预约成功！暂无地址信息',
                            icon: 'success',
                            duration: 1500
                        })
                    }
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
    showImg: function () {
        this.setData({
            isshowimg: true
        })
    },
    closeImg: function () {
        this.setData({
            isshowimg: false
        })
    },

    bigimg: function (event) {
        console.log(event)
        if (event.currentTarget.dataset.src == 'http://www.xiang-cloud.com:8099/images/psxmz.png' || event.currentTarget.dataset.src == '') {
            this.gotoTakePhotoDetail(event)
            return
        }
        var imglist = []
        var src = event.currentTarget.dataset.src;
        imglist.push(src)
        console.log(event)
        wx.previewImage({
            current: src,
            urls: imglist
        })

    },
    getPositioning() {
        var thisView = this;
        wx.getLocation({
            type: "wgs84",
            success(res) {
                console.log(res);
                thisView.setData({
                    localLng: res.longitude,
                    localLet: res.latitude
                });
            }
        });
    },
    confirmDirectUpload() {
        if (this.data.containerNo == '') {
            wx.showToast({
                title: '请填写箱号',
                icon: 'none',
            })
            return
        }
        var thisView = this;
        var apiUrl = "https://www.xiang-cloud.com/Api/Mini/Rail.ashx?act=OcrBoxPackingDoorPhoto";

        wx.showLoading({
            title: 'upload...',
            mask: true
        })
        wx.request({
            url: apiUrl,
            data: this.tempCompanyId ? {
                doorPhoto: thisView.data.imgTemp,
                companyId: this.tempCompanyId,
                cntrNo: thisView.data.containerNo,
                documentId: thisView.data.documentId,
                latitude: thisView.data.localLet,
                longitude: thisView.data.localLng,
                cntrSize: thisView.data.cntrSize
            } : {
                doorPhoto: thisView.data.imgTemp,
                cntrNo: thisView.data.containerNo,
                documentId: thisView.data.documentId,
                latitude: thisView.data.localLet,
                longitude: thisView.data.localLng,
                cntrSize: thisView.data.cntrSize
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                'Authorization': wx.getStorageSync('myToken')
            },
            method: 'POST',
            success: function (res) {
                //console.log('zai ',res)
                wx.hideLoading()

                var rtn = JSON.parse(JSON.stringify(res));

                if (rtn == undefined || rtn == "")
                    return;
                thisView.setData({
                    imgTemp: '',
                    containerNo: '',
                    directUpload: true,
                    photographNum: 0,
                })

                var result = rtn.data;
                if (result.ErrorDesc != null && result.ErrorDesc != "" && result.ErrorDesc.indexOf('不符合') == -1) {
                    if (result.ErrorDesc == '无法识别的箱门照') {
                        thisView.setData({
                            modalSuccessHidden: false,
                            successinfo: result.ErrorDesc + '(Container No. not captured)'
                        })
                    } else {
                        thisView.setData({
                            modalSuccessHidden: false,
                            successinfo: result.ErrorDesc
                        })
                    }

                    if (result.ErrorDesc.indexOf('未找到相关数据') < 0) {
                        thisView.setData({
                            failRecords: thisView.data.failRecords + 1
                        })
                    }

                    if (thisView.data.failRecords == 3) {
                        thisView.scanBarcodeAndUploadImage(thisView.data.imgTemp);

                    }
                    thisView.data.photographNum = thisView.data.photographNum + 1
                } else {

                    if (result.ErrorDesc != null && result.ErrorDesc != "" && result.ErrorDesc.indexOf('不符合') > 0) {
                        wx.showModal({
                            title: '提示',
                            content: result.ErrorDesc,
                            showCancel: true, //是否显示取消按钮
                            cancelText: "重拍", //默认是“取消”
                            confirmText: "是", //默认是“确定”
                            confirmColor: '#00ff00', //确定文字的颜色
                            success: function (res) {
                                if (res.cancel) {
                                    //点击取消,默认隐藏弹框
                                    thisView.data.photographNum = thisView.data.photographNum + 1
                                    thisView.takePhoto()
                                    return
                                } else {
                                    //点击确定
                                }
                            },
                            fail: function (res) {}, //接口调用失败的回调函数
                            complete: function (res) {}, //接口调用结束的回调函数（调用成功、失败都会执行）
                        })
                    }
                    thisView.data.photographNum = 0
                    for (var i = 0; i < thisView.data.dataArray.length; i++) {
                        if (thisView.data.dataArray[i]["packageNo"] == result.CntrNo) {
                            thisView.setData({
                                modalSuccessHidden: false,
                                modalTitle: '错误信息(error message)',
                                successinfo: '该箱号已经创建文档(The file has been created)'
                            })

                            return;
                        }
                    }

                    var arrData = thisView.data.dataArray;
                    if (thisView.data.documentId) {
                        arrData[0].guandanhao = '';
                        arrData[0].liushuihao = '';
                    }
                    var obj = {};
                    obj.Id = result.Id;
                    obj.srcImg = filePath;
                    obj.packageNo = result.CntrNo;
                    obj.packageType = result.CntrSizeCode + result.CntrTypeCode;
                    obj.guandanhao = result.BillNo;
                    obj.liushuihao = result.BizNo;
                    obj.importImageTitle = '继续拍照';
                    //obj.completeDate = result.CompleteDate;
                    obj.createdDate = result.CreatedDate;
                    if (result.ComRailwayLine) {
                        obj.address = result.ComRailwayLine.DestinationStation;
                        obj.lng = result.ComRailwayLine.Lng;
                        obj.lat = result.ComRailwayLine.Lat;
                    } else {
                        obj.address = '';
                        obj.lng = '';
                        obj.lat = '';
                    }
                    obj.shipmentDate = result.ShipmentDate;
                    obj.inPortDate = result.InPortDate;
                    obj.completeDate = result.CompleteDate;
                    arrData.push(obj);

                    var arrList = JSON.parse(JSON.stringify(arrData));

                    thisView.setData({
                        dataArray: arrList,
                        failRecords: 0,
                        documentId: ''
                    })

                    wx.setStorageSync('saveIdsArrayRailwayPackage', thisView.data.dataArray);

                    wx.navigateTo({
                        url: '../railwaypackagephoto/railwaypackagephoto?id=' + result.Id + '&packageNo=' + result.CntrNo +
                            '&packageType=' + result.CntrSizeCode + result.CntrTypeCode + '&guandanhao=' + result.BillNo +
                            '&liushuihao=' + result.BizNo + '&srcImg=' + filePath
                    })

                    thisView.refreshData('');
                }
                if (thisView.data.documentId) {
                    helper.httpRequest('Rail', 'GetBoxPackingDocument', {
                            id: thisView.data.documentId
                        })
                        .then(x => {
                            console.log(x)
                            var result = x
                            if (result.DoorPhoto) {
                                var arrData = thisView.data.dataArray;
                                console.log(arrData.length)
                                var obj = {};
                                obj.Id = result.Id;
                                obj.srcImg = (result.DoorPhoto.indexOf('https://www.xiang-cloud.com/uploads/zxzp/') != -1) ? result.DoorPhoto : 'https://www.xiang-cloud.com/uploads/zxzp/' + result.DoorPhoto;
                                obj.packageNo = result.CntrNo;
                                obj.packageType = result.CntrSizeCode + result.CntrTypeCode;
                                obj.guandanhao = result.BillNo;
                                obj.liushuihao = result.BizNo;
                                obj.importImageTitle = result.DoorPhoto ? '继续拍照' : '拍箱门照';
                                //obj.completeDate = result.CompleteDate;
                                obj.createdDate = result.CreatedDate;
                                if (result.BoxPackingRailYard) {
                                    obj.address = result.BoxPackingRailYard.Address;
                                    obj.lng = result.BoxPackingRailYard.Lng;
                                    obj.lat = result.BoxPackingRailYard.Lat;
                                    obj.FullName = result.BoxPackingRailYard.FullName;
                                } else {
                                    obj.address = '';
                                    obj.lng = '';
                                    obj.lat = '';
                                    obj.FullName = '';
                                }
                                obj.shipmentDate = result.ShipmentDate;
                                obj.inPortDate = result.InPortDate;
                                obj.completeDate = result.CompleteDate;
                                obj.ResvPlateNo = result.ResvPlateNo;
                                obj.ResvPhone = result.ResvPhone;
                                obj.ResvDate = result.ResvDate;
                                obj.Longitude = result.Longitude;
                                obj.Latitude = result.Latitude;
                                obj.InPortBy = result.InPortBy;
                                obj.DoorPhotoBy = result.DoorPhotoBy;
                                obj.RailInReceiptPath = result.RailInReceiptPath;
                                arrData.push(obj);

                                var arrList = JSON.parse(JSON.stringify(arrData));
                                thisView.setData({
                                    dataArray: arrList
                                })
                                wx.setStorageSync('saveIdsArrayRailwayPackage', thisView.data.dataArray);
                                var mimg = (result.DoorPhoto.indexOf('https://www.xiang-cloud.com/uploads/zxzp/') != -1) ? result.DoorPhoto : 'https://www.xiang-cloud.com/uploads/zxzp/' + result.DoorPhoto
                            } else {
                                var arrData = thisView.data.dataArray;
                                arrData[0].guandanhao = result.BillNo;
                                arrData[0].liushuihao = result.BizNo;
                                var arrList = JSON.parse(JSON.stringify(arrData));
                                thisView.setData({
                                    dataArray: arrList
                                })
                            }
                            console.log(thisView.data.dataArray)
                        });
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

    bindContainerNo(e) {
        this.setData({
            containerNo: e.detail.value
        })
    },

    cancelDirectUpload: function () {
        this.setData({
            imgTemp: '',
            containerNo: '',
            directUpload: true,
            photographNum: 0,
        })
    },

    hiddenShowRules() {
        this.setData({
            hiddenRules: true,
            hiddenNotice: false,
        })
    },

    showRules() {
        this.setData({
            hiddenRules: false,
            hiddenNotice: true,
        })
    },

    showNotice: function () {
        this.setData({
            hiddenNotice: false
        })
    },

    hiddenNoticePage() {
        this.setData({
            hiddenNotice: true,
        })
    },

    bindaddress(e) {
        
        var item = e.currentTarget.dataset.item;
        wx.openLocation({
            latitude: parseFloat(item.lat), //维度
            longitude: parseFloat(item.lng), //经度
            scale: 15, // 缩放比例
            name: item.FullName,
            address: item.address,
            success: function (r) {
                console.log(r)
            },
            fail: function (d) {
                console.log(d)
            }
        })
    },

    radioChange: function (e) {
        console.log(e)
        this.setData({
            flashSet: e.detail.value
        })
        if (e.detail.value == 'torch') {
            this.setData({
                flashArr: [{
                    num: 'torch',
                    value: '打开',
                    checked: true
                }, {
                    num: 'off',
                    value: '关闭',
                    checked: false
                }],
            })
        } else {
            this.setData({
                flashArr: [{
                    num: 'torch',
                    value: '打开',
                    checked: false
                }, {
                    num: 'off',
                    value: '关闭',
                    checked: true
                }],
            })
        }
        wx.setStorageSync('flashSet', e.detail.value)
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        ;
        var thisView = this;
        var flash = wx.getStorageSync('flashSet')
        if (flash == '') {
            flash = 'torch';
        }
        thisView.setData({
            flashSet: flash,
            lightName: flash == 'torch' ? '../../../img/lightning.png' : '../../../img/lightning-no.png'
        })

        thisView.getPositioning();

        wx.getSystemInfo({
            success: (result) => {

                thisView.setData({
                    widthval: result.windowWidth,
                    heightval: result.windowHeight - 150
                })

            },
        })
        this.data.ctx = wx.createCameraContext()
        console.log(options.scene)
        if (options.scene) //扫二维码进入
            try {
                let a = decodeURIComponent(options.scene).split(','); //scene字符串使用,来分隔数据信息
                if (a[0] === 'rail' && /^\d+$/.test(a[1])) { //分别为 [代表rail装箱,公司Id]
                    thisView.data.tempCompanyId = a[1];
                    if (a[2]) {
                        this.data.documentId = a[2];
                    }
                    console.log(thisView.data.tempCompanyId)
                    this.setData({
                        comID: thisView.data.tempCompanyId
                    })
                    console.log('target rail company = ' + this.data.documentId);
                    wx.setStorageSync('saveIdsArrayRailwayPackage', []); //清空已有拍照缓存
                    if (!wx.getStorageSync('myToken')) { //事先未登录
                        this.setData({
                          showGetPhoneNumberBtn: true
                        });
                        return;
                    }
                }
            }
        catch (e) {}

        helper.httpRequest('Rail', 'GetCompanyCode', {
                id: thisView.data.tempCompanyId
            })
            .then(x => {
                thisView.companyCode = x || '';
            });
        var myToken = wx.getStorageSync('myToken');
        if (this.data.comID == '') {
            this.data.comID = wx.getStorageSync('BindCompanyId');
            this.setData({
                comID: this.data.comID
            })
        }

        if (myToken == undefined || myToken == null || myToken == '') {
            wx.reLaunch({
                url: '../../packageA/pages/login/login',
            })

            return;
        }
        wx.showLoading({
            title: 'loading...',
            mask: true
        })
        helper.httpRequest('Index', 'GetPermission')
            .then(x => {
                console.log(x);
                wx.hideLoading();
                if (x.indexOf(172) >= 0 || x.indexOf(232) >= 0 || x.indexOf(250) >= 0 || x.indexOf(257) >= 0) {
                    wx.navigateTo({
                        url: '../railwaypackagephoto/railwaypackagephoto?id=' + thisView.data.dataArray[1]["Id"] + '&packageNo=' + thisView.data.dataArray[1]["packageNo"] +
                            '&packageType=' + thisView.data.dataArray[1]["packageType"] + '&guandanhao=' + thisView.data.dataArray[1]["guandanhao"] +
                            '&liushuihao=' + thisView.data.dataArray[1]["liushuihao"] + '&srcImg=' + thisView.data.dataArray[1]["srcImg"]
                    })
                }
            });
    },


    getGetBoxPackingDocument() {
        var thisView = this;
        if (thisView.data.documentId) {
            wx.showLoading({
                title: 'loading...',
                mask: true
            })
            helper.httpRequest('Rail', 'GetBoxPackingDocument', {
                    id: thisView.data.documentId
                })
                .then(x => {
                    console.log(x)
                    var result = x
                    if (result.DoorPhoto) {

                        var arrData = [];
                        for (var i = 0; i < thisView.data.dataArray.length; i++) {
                            if (thisView.data.dataArray[i].importImageTitle == "拍箱门照") {
                                arrData.push(thisView.data.dataArray[i])
                            }
                        }
                        console.log(arrData.length)
                        var obj = {};
                        obj.Id = result.Id;
                        obj.srcImg = (result.DoorPhoto.indexOf('https://www.xiang-cloud.com/uploads/zxzp/') != -1) ? result.DoorPhoto : 'https://www.xiang-cloud.com/uploads/zxzp/' + result.DoorPhoto;
                        obj.packageNo = result.CntrNo;
                        obj.packageType = result.CntrSizeCode + result.CntrTypeCode;
                        obj.guandanhao = result.BillNo;
                        obj.liushuihao = result.BizNo;
                        obj.importImageTitle = result.DoorPhoto ? '继续拍照' : '拍箱门照';
                        //obj.completeDate = result.CompleteDate;
                        obj.createdDate = result.CreatedDate;
                        if (result.BoxPackingRailYard) {
                            obj.address = result.BoxPackingRailYard.Address;
                            obj.lng = result.BoxPackingRailYard.Lng;
                            obj.lat = result.BoxPackingRailYard.Lat;
                            obj.FullName = result.BoxPackingRailYard.FullName;
                        } else {
                            obj.address = '';
                            obj.lng = '';
                            obj.lat = '';
                            obj.FullName = '';
                        }
                        obj.shipmentDate = result.ShipmentDate;
                        obj.inPortDate = result.InPortDate;
                        obj.completeDate = result.CompleteDate;
                        obj.ResvPlateNo = result.ResvPlateNo;
                        obj.ResvPhone = result.ResvPhone;
                        obj.ResvDate = result.ResvDate;
                        obj.Longitude = result.Longitude;
                        obj.Latitude = result.Latitude;
                        obj.InPortBy = result.InPortBy;
                        obj.DoorPhotoBy = result.DoorPhotoBy;
                        obj.RailInReceiptPath = result.RailInReceiptPath;

                        let pages = getCurrentPages();
                        let currPage = pages[pages.length - 1];
                        if (currPage.data.JiaoYan) {
                            if (result.ResvDate == null) {
                                arrData.push(obj);
                                this.setData({
                                    YuYue: true,
                                    YuYueDate: obj
                                });
                            }
                            currPage.data.JiaoYan = false
                        } else {
                            arrData.push(obj);
                        }


                        var arrList = JSON.parse(JSON.stringify(arrData));
                        thisView.setData({
                            dataArray: arrList
                        })
                        wx.setStorageSync('saveIdsArrayRailwayPackage', thisView.data.dataArray);
                        var mimg = (result.DoorPhoto.indexOf('https://www.xiang-cloud.com/uploads/zxzp/') != -1) ? result.DoorPhoto : 'https://www.xiang-cloud.com/uploads/zxzp/' + result.DoorPhoto
                        // wx.navigateTo({
                        //   url: '../railwaypackagephoto/railwaypackagephoto?id=' + result.Id + '&packageNo=' + result.CntrNo+
                        //     '&packageType=' + result.CntrSizeCode + result.CntrTypeCode + '&guandanhao=' +result.BillNo +
                        //     '&liushuihao=' + result.BizNo + '&srcImg=' + mimg
                        // })
                    } else {
                        var arrData = thisView.data.dataArray;
                        arrData[0].guandanhao = result.BillNo;
                        arrData[0].liushuihao = result.BizNo;
                        var arrList = JSON.parse(JSON.stringify(arrData));
                        thisView.setData({
                            dataArray: arrList
                        })
                    }
                    console.log(thisView.data.dataArray)
                    wx.hideLoading();
                });
        }
    },
    onShow: function () {
        var thisView = this;
        thisView.getown();
        thisView.refreshData('Y');
        let pages = getCurrentPages();
        let currPage = pages[pages.length - 1];

        if (currPage.data.documentId != '') {
            thisView.setData({
                documentId: currPage.data.documentId,
                JiaoYan: currPage.data.JiaoYan
            })
            thisView.getGetBoxPackingDocument();
            // 每一次需要清除，否则会参数会缓存
        }
    },

    refreshData(clearComplete) {
        //判断Storage中是否保存箱子数据，包含的话就显示

        var arrData = [];
        var thisView = this;
        var storageSaveIds = wx.getStorageSync('saveIdsArrayRailwayPackage');
        console.log(storageSaveIds)
        var obj = {};
        var needjudgeDate = false;
        var storageDate = '';

        for (var i = 0; i < storageSaveIds.length; i++) {
            if (storageSaveIds[i]["Id"] != undefined && storageSaveIds[i]["Id"] != null && storageSaveIds[i]["Id"] != '') {

                if (storageSaveIds[i]["createdDate"] == undefined || storageSaveIds[i]["createdDate"] == null || storageSaveIds[i]["createdDate"] == '') {
                    storageDate = '1990-01-01';
                } else {
                    storageDate = storageSaveIds[i]["createdDate"];
                }

                if (clearComplete == 'Y') {
                    if ((((storageSaveIds[i]["completeDate"] == undefined || storageSaveIds[i]["completeDate"] == null) ? '' : storageSaveIds[i]["completeDate"]) == '') ||
                        Math.floor((new Date().getTime() - new Date(storageDate).getTime()) / (24 * 3600 * 1000)) > 7) {
                        obj = {};
                        obj.Id = storageSaveIds[i]["Id"];
                        obj.srcImg = (storageSaveIds[i]["srcImg"].indexOf('wxfile://') < 0) ? storageSaveIds[i]["srcImg"] :
                            'https://www.xiang-cloud.com/uploads/zxzp/' + storageSaveIds[i]["srcImg"].substr(9, 10000);
                        obj.packageNo = storageSaveIds[i]["packageNo"];
                        obj.packageType = storageSaveIds[i]["packageType"];
                        obj.guandanhao = storageSaveIds[i]["guandanhao"];
                        obj.liushuihao = storageSaveIds[i]["liushuihao"];

                        obj.address = storageSaveIds[i]["address"];
                        obj.lat = storageSaveIds[i]["lat"];
                        obj.lng = storageSaveIds[i]["lng"];
                        obj.shipmentDate = storageSaveIds[i]["shipmentDate"];
                        obj.inPortDate = storageSaveIds[i]["inPortDate"];
                        obj.completeDate = storageSaveIds[i]["completeDate"];
                        obj.createdDate = storageSaveIds[i]["createdDate"];
                        obj.ResvDate = storageSaveIds[i]["ResvDate"];
                        obj.Longitude = storageSaveIds[i]["Longitude"];
                        obj.Latitude = storageSaveIds[i]["Latitude"];
                        obj.InPortBy = storageSaveIds[i]["InPortBy"];
                        obj.importImageTitle = '继续拍照';
                        arrData.push(obj);
                    }
                } else {
                    obj = {};
                    obj.Id = storageSaveIds[i]["Id"];
                    obj.srcImg = (storageSaveIds[i]["srcImg"].indexOf('wxfile://') < 0) ? storageSaveIds[i]["srcImg"] :
                        'https://www.xiang-cloud.com/uploads/zxzp/' + storageSaveIds[i]["srcImg"].substr(9, 10000);
                    obj.packageNo = storageSaveIds[i]["packageNo"];
                    obj.packageType = storageSaveIds[i]["packageType"];
                    obj.guandanhao = storageSaveIds[i]["guandanhao"];
                    obj.liushuihao = storageSaveIds[i]["liushuihao"];

                    obj.address = storageSaveIds[i]["address"];
                    obj.lat = storageSaveIds[i]["lat"];
                    obj.lng = storageSaveIds[i]["lng"];
                    obj.shipmentDate = storageSaveIds[i]["shipmentDate"];
                    obj.inPortDate = storageSaveIds[i]["inPortDate"];
                    obj.completeDate = storageSaveIds[i]["completeDate"];
                    obj.createdDate = storageSaveIds[i]["createdDate"];
                    obj.ResvDate = storageSaveIds[i]["ResvDate"];
                    obj.Longitude = storageSaveIds[i]["Longitude"];
                    obj.Latitude = storageSaveIds[i]["Latitude"];
                    obj.InPortBy = storageSaveIds[i]["InPortBy"];
                    obj.importImageTitle = '继续拍照';
                    arrData.push(obj);
                }
            }
        }
        var arrList = JSON.parse(JSON.stringify(arrData));
        thisView.setData({
            dataArray: arrList
        })
    },

    scanBarcodeAndUploadImage(filePath) {
        var thisView = this;

        wx.scanCode({
            onlyFromCamera: true,
            success(res) {
                //console.log(res)

                if (res == undefined || res == null || res == '') {
                    thisView.setData({
                        modalSuccessHidden: false,
                        modalTitle: '错误信息',
                        successinfo: '扫描条码未解析出内容'
                    })

                    return;
                }

                if (res.result == undefined || res.result == null || res.result == '') {
                    thisView.setData({
                        modalSuccessHidden: false,
                        modalTitle: '错误信息',
                        successinfo: '扫描条码未解析出内容'
                    })

                    return;
                }

                var apiUrl = 'https://www.xiang-cloud.com/Api/Mini/Rail.ashx?act=QueryBoxPackingDoorPhoto';
                wx.showLoading({
                    title: '正在识别条码和保存箱照...',
                    mask: true
                })

                wx.request({
                    url: apiUrl,
                    data: {
                        cntrNo: res.result,
                        doorPhoto: filePath
                    },
                    header: {
                        'content-type': 'application/x-www-form-urlencoded',
                        'Authorization': wx.getStorageSync('myToken')
                    },
                    method: 'POST',
                    success: function (res) {

                        wx.hideLoading()

                        var rtn = JSON.parse(JSON.stringify(res));

                        if (rtn == undefined || rtn == "")
                            return;

                        var result = rtn.data;

                        if (result.ErrorDesc != null && result.ErrorDesc != "") {
                            if (result.ErrorDesc == '无法识别的箱门照') {
                                thisView.setData({
                                    modalSuccessHidden: false,
                                    successinfo: result.ErrorDesc + '(Container No. not captured)'
                                })
                            } else {
                                thisView.setData({
                                    modalSuccessHidden: false,
                                    successinfo: result.ErrorDesc
                                })
                            }
                        } else {
                            for (var i = 0; i < thisView.data.dataArray.length; i++) {
                                if (thisView.data.dataArray[i]["packageNo"] == result.CntrNo) {
                                    thisView.setData({
                                        modalSuccessHidden: false,
                                        modalTitle: '错误信息(error message)',
                                        successinfo: '该箱号不符合ISO校验规则(illegal container No.)'
                                    })

                                    return;
                                }
                            }

                            var arrData = thisView.data.dataArray;
                            var obj = {};
                            obj.Id = result.Id;
                            obj.srcImg = filePath;
                            obj.packageNo = result.CntrNo;
                            obj.packageType = result.CntrSizeCode + result.CntrTypeCode;
                            obj.guandanhao = result.BillNo;
                            obj.liushuihao = result.BizNo;
                            obj.importImageTitle = '继续拍照';
                            obj.completeDate = result.CompleteDate;
                            obj.createdDate = result.CreatedDate;
                            arrData.push(obj);

                            var arrList = JSON.parse(JSON.stringify(arrData));
                            thisView.setData({
                                dataArray: arrList
                            })

                            wx.setStorageSync('saveIdsArrayRailwayPackage', thisView.data.dataArray);

                            thisView.refreshData('');
                        }
                    },
                    fail: function (res) {
                        wx.hideLoading()
                    },
                    complete: function (res) {
                        wx.hideLoading()
                    },
                })
            }
        })

        thisView.setData({
            failRecords: 0
        });
    },

    ocrImgBgm(filePath, scanImgSource) {
        var thisView = this;
        var apiUrl = "https://www.xiang-cloud.com/Api/Mini/Index.ashx?act=OcrScene";
        wx.showLoading({
            title: 'loading...',
            mask: true
        })
        console.log(filePath)
        wx.request({
            url: apiUrl,
            data: {
                doorPhotoPath: filePath,
                folderPath: 'zxzp'
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                'Authorization': wx.getStorageSync('myToken')
            },
            method: 'POST',
            success: function (res) {
                console.log('ocr', res)
                if (res.data.definition == "closed") {
                    thisView.getspecifieddata(filePath)
                } else {
                    wx.showModal({
                        title: '提示',
                        content: '该照片不是箱门照，是否保存?',
                        showCancel: true, //是否显示取消按钮
                        cancelText: "重拍", //默认是“取消”
                        confirmText: "保存", //默认是“确定”
                        confirmColor: '#00ff00', //确定文字的颜色
                        success: function (res) {
                            if (res.cancel) {
                                thisView.gotoTakePhotoDetail()
                                return
                            } else {
                                thisView.getspecifieddata(filePath)
                            }
                        },
                        fail: function (res) {}, //接口调用失败的回调函数
                        complete: function (res) {}, //接口调用结束的回调函数（调用成功、失败都会执行）
                    })
                }

            },
            complete: function (res) {
                wx.hideLoading()
            },
        })
    },

    ocrImg(filePath, scanImgSource) {
        var thisView = this;
        var apiUrl = "https://www.xiang-cloud.com/Api/Mini/Index.ashx?act=OcrDefinition";
        wx.showLoading({
            title: 'loading...',
            mask: true
        })
        wx.request({
            url: apiUrl,
            data: {
                doorPhotoPath: filePath,
                folderPath: 'zxzp'
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                'Authorization': wx.getStorageSync('myToken')
            },
            method: 'POST',
            success: function (res) {
                console.log('ocr', res)
                if (res.data.definition == "clear") {
                    thisView.ocrImgBgm(filePath, scanImgSource)
                } else {
                    wx.showModal({
                        title: '提示',
                        content: '该照片可能不清晰，是否保存?',
                        showCancel: true, //是否显示取消按钮
                        cancelText: "重拍", //默认是“取消”
                        confirmText: "保存", //默认是“确定”
                        confirmColor: '#00ff00', //确定文字的颜色
                        success: function (res) {
                            if (res.cancel) {
                                //点击取消,默认隐藏弹框
                                thisView.gotoTakePhotoDetail()
                                return
                            } else {
                                thisView.ocrImgBgm(filePath, scanImgSource)
                            }
                        },
                        fail: function (res) {}, //接口调用失败的回调函数
                        complete: function (res) {}, //接口调用结束的回调函数（调用成功、失败都会执行）
                    })
                }

            },
            complete: function (res) {
                wx.hideLoading()
            },
        })
    },
    onVisibleChange(e) {
        this.setData({
            showGetPhoneNumberBtn:false,
        });
    },
    getspecifieddata(filePath) {
        var thisView = this;
        this.getPositioning();
        var apiUrl = "https://www.xiang-cloud.com/Api/Mini/Rail.ashx?act=OcrBoxPackingDoorPhoto";

        wx.showLoading({
            title: 'Capturing...',
            mask: true
        })


        wx.request({
            url: apiUrl,
            data: thisView.data.tempCompanyId ? {
                doorPhoto: filePath,
                companyId: thisView.data.tempCompanyId,
                documentId: thisView.data.documentId,
                latitude: thisView.data.localLet,
                longitude: thisView.data.localLng
            } : {
                doorPhoto: filePath,
                documentId: thisView.data.documentId,
                latitude: thisView.data.localLet,
                longitude: thisView.data.localLng
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                'Authorization': wx.getStorageSync('myToken')
            },
            method: 'POST',
            success: function (res) {
                //console.log('zai ',res)
                wx.hideLoading()

                var rtn = JSON.parse(JSON.stringify(res));

                if (rtn == undefined || rtn == "")
                    return;
                if (thisView.data.photographNum == 2) {
                    thisView.setData({
                        directUpload: false
                    })
                    return
                }
                var result = rtn.data;
                if (result.ErrorDesc != null && result.ErrorDesc != "" && result.ErrorDesc.indexOf('不符合') == -1) {
                    if (result.ErrorDesc == '无法识别的箱门照') {
                        thisView.setData({
                            modalSuccessHidden: false,
                            successinfo: result.ErrorDesc + '(Container No. not captured)'
                        })
                    } else {
                        thisView.setData({
                            modalSuccessHidden: false,
                            successinfo: result.ErrorDesc
                        })
                    }

                    if (result.ErrorDesc.indexOf('未找到相关数据') < 0) {
                        thisView.setData({
                            failRecords: thisView.data.failRecords + 1
                        })
                    }

                    // if (thisView.data.failRecords == 3) {
                    //   thisView.scanBarcodeAndUploadImage(filePath);
                    // }
                    thisView.data.photographNum = thisView.data.photographNum + 1
                } else {

                    if (result.ErrorDesc != null && result.ErrorDesc != "" && result.ErrorDesc.indexOf('不符合') > 0) {
                        wx.showModal({
                            title: '提示',
                            content: result.ErrorDesc,
                            showCancel: true, //是否显示取消按钮
                            cancelText: "重拍", //默认是“取消”
                            confirmText: "是", //默认是“确定”
                            confirmColor: '#00ff00', //确定文字的颜色
                            success: function (res) {
                                if (res.cancel) {
                                    //点击取消,默认隐藏弹框
                                    thisView.data.photographNum = thisView.data.photographNum + 1
                                    thisView.takePhoto()
                                    return
                                } else {
                                    //点击确定
                                }
                            },
                            fail: function (res) {}, //接口调用失败的回调函数
                            complete: function (res) {}, //接口调用结束的回调函数（调用成功、失败都会执行）
                        })
                    }
                    thisView.data.photographNum = 0
                    console.log(thisView.data.dataArray)
                    console.log(result)
                    for (var i = 0; i < thisView.data.dataArray.length; i++) {
                        if (thisView.data.dataArray[i]["packageNo"] == result.CntrNo) {
                            thisView.setData({
                                modalSuccessHidden: false,
                                modalTitle: '错误信息(error message)',
                                successinfo: '该箱号已经创建文档(The file has been created)'
                            })

                            return;
                        }
                    }

                    var arrData = thisView.data.dataArray;
                    if (thisView.data.documentId) {
                        arrData[0].guandanhao = '';
                        arrData[0].liushuihao = '';
                    }

                    var obj = {};
                    obj.Id = result.Id;
                    obj.srcImg = filePath;
                    obj.packageNo = result.CntrNo;
                    obj.packageType = result.CntrSizeCode + result.CntrTypeCode;
                    obj.guandanhao = result.BillNo;
                    obj.liushuihao = result.BizNo;
                    obj.importImageTitle = '继续拍照';
                    obj.completeDate = result.CompleteDate;
                    // obj.createdDate = result.CreatedDate;

                    if (result.ComRailwayLine) {
                        obj.address = result.ComRailwayLine.DestinationStation;
                        obj.lng = result.ComRailwayLine.Lng;
                        obj.lat = result.ComRailwayLine.Lat;
                    } else {
                        obj.address = '';
                        obj.lng = '';
                        obj.lat = '';
                    }
                    obj.shipmentDate = result.ShipmentDate;
                    obj.inPortDate = result.InPortDate;
                    obj.completeDate = result.CompleteDate;
                    arrData.push(obj);

                    var arrList = JSON.parse(JSON.stringify(arrData));

                    thisView.setData({
                        dataArray: arrList,
                        failRecords: 0,
                        documentId: ''
                    })
                    let sysres = wx.getSystemInfoSync();
                    if (sysres.platform == 'ios') {
                        wx.saveImageToPhotosAlbum({
                            filePath: filePath,
                            success: function (data) {
                                console.log(data)
                                wx.hideLoading()
                                wx.showToast({
                                    title: '保存成功',
                                    icon: 'success',
                                    duration: 2000
                                })
                            },
                            fail: function (err) {
                                console.log(err);
                                if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny" || err.errMsg === "saveImageToPhotosAlbum:fail:auth denied") {
                                    console.log("当初用户拒绝，再次发起授权")
                                    wx.showModal({
                                        title: '提示',
                                        content: '需要您授权保存相册',
                                        showCancel: false,
                                        success: modalSuccess => {
                                            wx.openSetting({
                                                success(settingdata) {
                                                    console.log("settingdata", settingdata)
                                                    if (settingdata.authSetting['scope.writePhotosAlbum']) {
                                                        wx.showModal({
                                                            title: '提示',
                                                            content: '获取权限成功',
                                                            showCancel: false,
                                                        })
                                                    } else {
                                                        wx.showModal({
                                                            title: '提示',
                                                            content: '获取权限失败，将无法保存到相册',
                                                            showCancel: false,
                                                        })
                                                    }
                                                },
                                                fail(failData) {
                                                    console.log("failData", failData)
                                                },
                                                complete(finishData) {
                                                    console.log("finishData", finishData)
                                                }
                                            })
                                        }
                                    })
                                }
                            },
                            complete(res) {
                                console.log(res);
                                wx.hideLoading()
                            }
                        })
                    }
                    wx.setStorageSync('saveIdsArrayRailwayPackage', thisView.data.dataArray);

                    wx.navigateTo({
                        url: '../railwaypackagephoto/railwaypackagephoto?id=' + result.Id + '&packageNo=' + result.CntrNo +
                            '&packageType=' + result.CntrSizeCode + result.CntrTypeCode + '&guandanhao=' + result.BillNo +
                            '&liushuihao=' + result.BizNo + '&srcImg=' + filePath
                    })

                    thisView.refreshData('');
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

    closePhoto: function () {
        var thisView = this;

        thisView.setData({
            hiddenPhotoPage: true,
            hiddenPhotoButtonPage: true,
            hiddenmainpage: false
        })
    },

    gotoChooseImg() {
        var thisView = this;
        wx.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: ['album'],
            success(res) {
                // tempFilePath可以作为img标签的src属性显示图片
                var tempFilePaths = res.tempFilePaths
                wx.showLoading({
                    title: '上传箱照...',
                    mask: true
                })
                ;
                var dateonly = new Date();
                var dateInfo = (thisView.companyCode == 'undefined' ? '' : thisView.companyCode) + wx.getStorageSync('myTelephone').substring(7, 11) + '@' +
                    (dateonly.getFullYear() + '-' + (dateonly.getMonth() + 1) + '-' + dateonly.getDate()) + 'MP';

                wx.uploadFile({
                    url: 'https://www.xiang-cloud.com/Api/Shared/FileUpload.ashx',
                    filePath: tempFilePaths[0].replace('.unknown', '.jpg'),
                    name: '1',
                    formData: {
                        'dir': 'zxzp',
                        'watermark': dateInfo
                    },
                    success(res) {
                        ;
                        var rtn = JSON.parse(res.data);
                        thisView.setData({
                            imgTemp: rtn.FileName
                        })
                        console.log(rtn.FileName)
                        thisView.ocrImg(rtn.FileName, tempFilePaths[0].replace('.unknown', '.jpg'))
                        //thisView.getspecifieddata(tempFilePaths[0]);
                    },
                    fail(res) {
                        console.log(res);
                    }
                })
                wx.hideLoading()
            }
        })
    },

    // bindcamera: function (e) {
    //   this.data.ctx.setZoom({
    //     zoom: 0.1,
    //     success(res) {
    //       console.log(res)
    //     }
    //   })
    // },

    takePhoto() {
        var thisView = this;
        var scanImgSource = '';


        this.data.ctx.takePhoto({
            quality: 'high',
            success: (res) => {

                wx.showLoading({
                    title: '上传箱照...',
                    mask: true
                })

                thisView.setData({
                    hiddenPhotoPage: true,
                    hiddenPhotoButtonPage: true,
                    hiddenmainpage: false
                })

                scanImgSource = res.tempImagePath;

                var dateonly = new Date();
                var dateInfo = (thisView.companyCode == 'undefined' ? '' : thisView.companyCode) + wx.getStorageSync('myTelephone').substring(7, 11) + '@' +
                    (dateonly.getFullYear() + '-' + (dateonly.getMonth() + 1) + '-' + dateonly.getDate()) + 'LA';

                wx.uploadFile({
                    url: 'https://www.xiang-cloud.com/Api/Shared/FileUpload.ashx',
                    filePath: scanImgSource,
                    name: '1',
                    formData: {
                        'dir': 'zxzp',
                        'watermark': dateInfo
                    },
                    success(res) {
                        console.log(res)
                        var rtn = JSON.parse(res.data);
                        thisView.setData({
                            imgTemp: rtn.FileName
                        })
                        console.log(rtn)
                        thisView.saveImg(scanImgSource)
                        thisView.ocrImg(rtn.FileName, scanImgSource)
                    },
                    fail(res) {
                        console.log(res);
                    }
                })

                wx.hideLoading()
            }
        })
    },

    saveImg(filepath) {
      wx.saveImageToPhotosAlbum({
        filePath: filepath,
        success: function (data) {
          console.log(data)
        },
        fail: function (err) {
          console.log(err);
          if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny" || err.errMsg === "saveImageToPhotosAlbum:fail:auth denied") {
            console.log("当初用户拒绝，再次发起授权")
            wx.showModal({
              title: '提示',
              content: '需要您授权保存相册',
              showCancel: false,
              success: modalSuccess => {
                wx.openSetting({
                  success(settingdata) {
                    console.log("settingdata", settingdata)
                    if (settingdata.authSetting['scope.writePhotosAlbum']) {
                      wx.showModal({
                        title: '提示',
                        content: '获取权限成功',
                        showCancel: false,
                      })
                    } else {
                      wx.showModal({
                        title: '提示',
                        content: '获取权限失败，将无法保存到相册',
                        showCancel: false,
                      })
                    }
                  },
                  fail(failData) {
                    console.log("failData", failData)
                  },
                  complete(finishData) {
                    console.log("finishData", finishData)
                  }
                })
              }
            })
          }
        },
        complete(res) {
          console.log(res);
          wx.hideLoading()
        }
      })
    },



    gotoTakePhotoDetail(e) {
        var thisView = this;
        if (!wx.getStorageSync('myToken')) { //事先未登录
            this.setData({
                showGetPhoneNumberBtn: true
            });
            return;
        }
        var indexVal = e.currentTarget.id.substr(9, 10000); //Id
        //var tranType = e.currentTarget.id.substr(0, 9);

        if (indexVal == undefined || indexVal == null || indexVal == '') {
            thisView.setData({
                hiddenPhotoPage: false,
                hiddenPhotoButtonPage: false,
                hiddenmainpage: true
            })
            return;
        }

        for (var i = 0; i < thisView.data.dataArray.length; i++) {
            if (thisView.data.dataArray[i]["Id"] == indexVal) {
                wx.navigateTo({
                    url: '../railwaypackagephoto/railwaypackagephoto?id=' + thisView.data.dataArray[i]["Id"] + '&packageNo=' + thisView.data.dataArray[i]["packageNo"] +
                        '&packageType=' + thisView.data.dataArray[i]["packageType"] + '&guandanhao=' + thisView.data.dataArray[i]["guandanhao"] +
                        '&liushuihao=' + thisView.data.dataArray[i]["liushuihao"] + '&srcImg=' + thisView.data.dataArray[i]["srcImg"] + '&documentId=' + thisView.data.documentId
                })
            }
        }
    },

    resetSuccessModal: function () {
        this.setData({
            modalSuccessHidden: true,
            successinfo: ''
        })
    },

    //点击问号显示提醒内容
    showTip() {
        this.setData({
            hiddenShowTip: false
        })
    },

    closeShowTip() {
        this.setData({
            hiddenShowTip: true
        })
    },

    getPhoneNumber(e) {
        var thisView = this;
        let x = e.detail;
        if (!x.encryptedData)
            return;

        helper.authService.wxLogin()
            .then(() => helper.httpRequest('SignIn', 'QuickLogin', {
                sessionId: helper.authService.sessionId,
                encryptedData: x.encryptedData,
                iv: x.iv,
                source: '铁路装箱照片',
            }, false))
            .then(result => {
                wx.setStorageSync('myToken', result.OutputValues.Token);
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

                this.setData({
                    showGetPhoneNumberBtn: false
                });
                if (thisView.data.documentId) {
                    helper.httpRequest('Rail', 'GetBoxPackingDocument', {
                            id: thisView.data.documentId
                        })
                        .then(x => {
                            console.log(x)
                            var result = x
                            if (result.DoorPhoto) {
                                var arrData = thisView.data.dataArray;
                                console.log(arrData.length)
                                var obj = {};
                                obj.Id = result.Id;
                                obj.srcImg = (result.DoorPhoto.indexOf('https://www.xiang-cloud.com/uploads/zxzp/') != -1) ? result.DoorPhoto : 'https://www.xiang-cloud.com/uploads/zxzp/' + result.DoorPhoto;
                                obj.packageNo = result.CntrNo;
                                obj.packageType = result.CntrSizeCode + result.CntrTypeCode;
                                obj.guandanhao = result.BillNo;
                                obj.liushuihao = result.BizNo;
                                obj.importImageTitle = result.DoorPhoto ? '继续拍照' : '拍箱门照';
                                //obj.completeDate = result.CompleteDate;
                                obj.createdDate = result.CreatedDate;
                                if (result.BoxPackingRailYard) {
                                    obj.address = result.BoxPackingRailYard.Address;
                                    obj.lng = result.BoxPackingRailYard.Lng;
                                    obj.lat = result.BoxPackingRailYard.Lat;
                                    obj.FullName = result.BoxPackingRailYard.FullName;
                                } else {
                                    obj.address = '';
                                    obj.lng = '';
                                    obj.lat = '';
                                    obj.FullName = '';
                                }
                                obj.shipmentDate = result.ShipmentDate;
                                obj.inPortDate = result.InPortDate;
                                obj.completeDate = result.CompleteDate;
                                obj.ResvPlateNo = result.ResvPlateNo;
                                obj.ResvPhone = result.ResvPhone;
                                obj.ResvDate = result.ResvDate;
                                obj.Longitude = result.Longitude;
                                obj.Latitude = result.Latitude;
                                obj.DoorPhotoBy = result.DoorPhotoBy;
                                obj.RailInReceiptPath = result.RailInReceiptPath;
                                arrData.push(obj);

                                var arrList = JSON.parse(JSON.stringify(arrData));
                                thisView.setData({
                                    dataArray: arrList
                                })
                                wx.setStorageSync('saveIdsArrayRailwayPackage', thisView.data.dataArray);
                                var mimg = (result.DoorPhoto.indexOf('https://www.xiang-cloud.com/uploads/zxzp/') != -1) ? result.DoorPhoto : 'https://www.xiang-cloud.com/uploads/zxzp/' + result.DoorPhoto
                            } else {
                                var arrData = thisView.data.dataArray;
                                arrData[0].guandanhao = result.BillNo;
                                arrData[0].liushuihao = result.BizNo;
                                var arrList = JSON.parse(JSON.stringify(arrData));
                                thisView.setData({
                                    dataArray: arrList
                                })
                            }

                            console.log(thisView.data.dataArray)

                        });
                }
            });
    },
})