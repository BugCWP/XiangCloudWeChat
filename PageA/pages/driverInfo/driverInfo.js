// PageA/pages/driverInfo/driverInfo.js
import Toast from 'tdesign-miniprogram/toast/index';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        image: '',
        myUserName: '',
        myTelephone: '',
        defaultUpJiaShiZhengImage: "http://www.xiang-cloud.com:8099/images/b.png",
        defaultUpXingShiZhengImage: 'http://www.xiang-cloud.com:8099/images/b.png',
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
        driverDetail: '',
        visible: false,
        showIndex: false,
        closeBtn: false,
        deleteBtn: false,
        images: [],
        EditDialogShow: false,
        plateNo: '',
        userName: '',
        addvisible: false,
        searchCom: '',
        arrayCompany: [],
        items: [],
        arrayBizLocation: '',
        comIndex: 0,
        haveBindCom: [],
        changeCarvisible: false,
        cphArr: [],
        cph: '请选择车牌',
        actionText: ''
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
        var wechatImg = wx.getStorageSync("myHeadImg");
        var JiaShiZhengImage = wx.getStorageSync('defaultUpJiaShiZhengImage');
        var XingShiZhengImage = wx.getStorageSync('defaultUpXingShiZhengImage');
        thisView.setData({
            image: wechatImg == null || wechatImg == '' ? '' : 'https://www.xiang-cloud.com' + wechatImg,
            myUserName: wx.getStorageSync('myUserName'),
            myTelephone: wx.getStorageSync("myTelephone"),
            defaultUpJiaShiZhengImage: JiaShiZhengImage == null || JiaShiZhengImage == '' ? 'http://www.xiang-cloud.com:8099/images/b.png' : 'https://www.xiang-cloud.com' + JiaShiZhengImage,
            defaultUpXingShiZhengImage: XingShiZhengImage == null || XingShiZhengImage == '' ? 'http://www.xiang-cloud.com:8099/images/b.png' : 'https://www.xiang-cloud.com' + XingShiZhengImage
        })
        thisView.GetDriverInfo();
        thisView.getCompany();
        thisView.getBindCom();
    },
    GetOwnerCompanyPlateNo() {
        var thisView = this
        wx.showLoading({
            title: '获取车牌...',
        })
        wx.request({
            url: 'https://www.xiang-cloud.com/Api/Mini/index.ashx?act=GetOwnerCompanyPlateNo',
            data: {},
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                'Authorization': wx.getStorageSync("myToken")
            },
            method: 'POST',
            success: function (res) {
                var rtn = JSON.parse(JSON.stringify(res));
                if (rtn == undefined || rtn == "")
                    return;
                var result = rtn.data;
                thisView.setData({
                    cphArr: result
                })
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
                } catch (e) {
                    throw e;
                }
            },
            fail: function (res) {
                wx.hideLoading()
                thisView.setData({
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
            },
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

    //上传驾驶证
    photoFunc(e) {
        var thisView = this;
        var objImageClick = "";
        if (e.currentTarget != null) {
            objImageClick = e.currentTarget.id;
        } else {
            objImageClick = e;
        }
        var objImageUrl = '';
        wx.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
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
                        console.log(res)
                        var obj = JSON.parse(res.data);
                        objImageUrl = obj.Url;
                        var ocrUrl = '';
                        switch (objImageClick) {
                            case 'imgJiaShiZheng':
                                wx.setStorageSync('defaultUpJiaShiZhengImage', objImageUrl);
                                thisView.setData({
                                    defaultUpJiaShiZhengImage: tempFilePaths[0]
                                })
                                thisView.confirmSave("2", objImageUrl);
                                break;
                            case 'imgXingShiZheng':
                                wx.setStorageSync('defaultUpXingShiZhengImage', objImageUrl);
                                thisView.setData({
                                    defaultUpXingShiZhengImage: tempFilePaths[0]
                                })
                                thisView.confirmSave("3", objImageUrl);
                                break;
                            case 'imgHeadImage':
                                wx.setStorageSync('myHeadImg', objImageUrl);
                                thisView.setData({
                                    image: tempFilePaths[0]
                                })
                                thisView.confirmSave("1", objImageUrl);
                                break;
                        }
                    },
                    fail: function (e) {
                        wx.hideLoading()
                    }
                })
            }
        })
    },
    confirmSave(imageIndex, img) {
        var thisView = this;
        var mobile = thisView.data.myTelephone;
        if (mobile.length == 0) {
            wx.showToast({
                title: '请输入手机号',
                icon: 'none',
                duration: 1500
            })
            return;
        }
        wx.showLoading({
            title: '正在保存',
            mask: true
        })
        var jsonAllImage = '';
        switch (imageIndex) {
            case "1":
                jsonAllImage = JSON.stringify({
                    HeadImage: img,
                    DrivingLicense: null,
                    VehicleLicense: null
                })
                break;

            case "2":
                jsonAllImage = JSON.stringify({
                    HeadImage: null,
                    DrivingLicense: img,
                    VehicleLicense: null
                })
                break;

            case "3":
                jsonAllImage = JSON.stringify({
                    HeadImage: null,
                    DrivingLicense: null,
                    VehicleLicense: img
                })
                break;

            default:
                break;
        }
        wx.request({
            url: 'https://www.xiang-cloud.com/Api/Mini/SignIn.ashx?act=SaveAllImages',
            data: {
                paraTelphone: mobile,
                paraAllImagesUrl: jsonAllImage
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            success: function (res) {
                var rtn = JSON.parse(JSON.stringify(res));
                console.log(res)
                if (rtn == undefined || rtn == "")
                    return;
                var result = rtn.data;
                try {
                    if (result.ErrorDesc || result.ErrorCode || result.HasError) {
                        let msg = (result.ErrorCode ? '(' + result.ErrorCode + ') ' : '') + result.ErrorDesc;
                        thisView.setData({
                            errDialogShow: true,
                            errTitle: '保存失败',
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
                            errTitle: '保存失败',
                            errinfo: result,
                            errConfirmBtn: {
                                content: '确定',
                                variant: 'base'
                            }
                        })
                        return;
                    }
                    thisView.setData({
                        errDialogShow: true,
                        errTitle: '保存成功',
                        errinfo: '保存成功!',
                        errConfirmBtn: {
                            content: '确定',
                            variant: 'base'
                        }
                    })
                    if (imageIndex == "2") {
                        thisView.ocrImg('https://www.xiang-cloud.com/Api/Mini/SignIn.ashx?act=OcrDrivingLicense', img, imageIndex)
                    } else if (imageIndex == "3") {
                        thisView.ocrImg('https://www.xiang-cloud.com/Api/Mini/SignIn.ashx?act=OcrVehicleLicense', img, imageIndex)
                    }
                } catch (e) {
                    throw e;
                }
            },
            fail: function (res) {
                thisView.setData({
                    errDialogShow: true,
                    errTitle: '保存失败',
                    errinfo: res,
                    errConfirmBtn: {
                        content: '确定',
                        variant: 'base'
                    }
                })
            },
            complete: function (res) {
                wx.hideLoading()
            },
        })
    },
    ocrImg(url, img, imageIndex) {
        var thisView = this;
        wx.showLoading({
            title: '正在解析证件号码',
            mask: true
        })
        wx.request({
            url: url,
            data: {
                path: img
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
                if (result == null || result == '') {
                    return;
                }
                if (imageIndex == "2") {
                    thisView.data.driverDetail.CrmDrivingLicense = rtn.data
                    thisView.setData({
                        driverDetail: thisView.data.driverDetail,
                        myUserName: rtn.data.Name
                    })
                    wx.setStorageSync("myUserName", rtn.data.Name);
                } else if (imageIndex == "3") {
                    thisView.data.driverDetail.CrmDriverVehicleLicense = rtn.data
                    thisView.setData({
                        driverDetail: thisView.data.driverDetail
                    })
                }
            },
            fail: function (res) {
                thisView.setData({
                    errDialogShow: true,
                    errTitle: '解析证件号码失败',
                    errinfo: res,
                    errConfirmBtn: {
                        content: '确定',
                        variant: 'base'
                    }
                })
            },
            complete: function (res) {
                wx.hideLoading()
            },
        })
    },

    GetDriverInfo() {
        var thisView = this
        wx.showLoading({
            title: '加载中...',
            mask: true
        })
        wx.request({
            url: 'https://www.xiang-cloud.com/Api/Mini/Index.ashx?act=GetDriverInfo',
            data: {
                phone: thisView.data.myTelephone
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                'Authorization': wx.getStorageSync("myToken")
            },
            method: 'POST',
            success: function (res) {
                var rtn = JSON.parse(JSON.stringify(res));
                if (rtn == undefined || rtn == "")
                    return;
                var result = rtn.data;
                if (result.CrmDrivingLicense) {
                    result.CrmDrivingLicense.Birth = result.CrmDrivingLicense.Birth.substring(0, 10)
                    result.CrmDrivingLicense.FirstIssueDate = result.CrmDrivingLicense.FirstIssueDate.substring(0, 10)
                    result.CrmDrivingLicense.ValidFrom = result.CrmDrivingLicense.ValidFrom.substring(0, 10)
                    result.CrmDrivingLicense.ValidTo = result.CrmDrivingLicense.ValidTo.substring(0, 10)
                }
                if (result.CrmDriverVehicleLicense) {
                    if (result.CrmDriverVehicleLicense.RegisterDate)
                        result.CrmDriverVehicleLicense.RegisterDate = result.CrmDriverVehicleLicense.RegisterDate.substring(0, 10)
                    if (result.CrmDriverVehicleLicense.IssueDate)
                        result.CrmDriverVehicleLicense.IssueDate = result.CrmDriverVehicleLicense.IssueDate.substring(0, 10)
                }
                if (result.DrivingLicense != null && result.DrivingLicense != '') {
                    thisView.setData({
                        defaultUpJiaShiZhengImage: 'https://www.xiang-cloud.com' + result.DrivingLicense,
                    })

                }
                if (result.VehicleLicense != null && result.VehicleLicense != '') {
                    thisView.setData({
                        defaultUpXingShiZhengImage: 'https://www.xiang-cloud.com' + result.VehicleLicense,
                    }) 

                }
                thisView.setData({
                    driverDetail: result,
                })
            },
            fail: function (res) {
                thisView.setData({
                    errDialogShow: true,
                    errTitle: '加载个人信息失败',
                    errinfo: res,
                    errConfirmBtn: {
                        content: '确定',
                        variant: 'base'
                    }
                })
            },
            complete: function (res) {
                wx.hideLoading()
            },
        })
    },
    closeErrDialog() {
        var thisView = this
        thisView.setData({
            errDialogShow: false
        })
    },
    //预览照片
    showImg(e) {
        var thisView = this
        thisView.setData({
            images: [e.currentTarget.dataset.imgsrc],
            showIndex: true,
            visible: true,
            closeBtn: true
        });
    },
    onChange(e) {
        const {
            index
        } = e.detail;
    },
    onDelete(e) {
        const {
            index
        } = e.detail;
    },
    onClose(e) {
        const {
            trigger
        } = e.detail;
        console.log(trigger);
        this.setData({
            visible: false,
        });
    },
    //修改个人信息
    confirmEditDialog() {
        var thisView = this
        if (thisView.data.userName == '') {
            Toast({
                context: this,
                selector: '#t-toast',
                message: '司机姓名不能为空',
                theme: 'warning',
                direction: 'column',
            });
            return;
        }
        if (thisView.data.plateNo == '') {
            Toast({
                context: this,
                selector: '#t-toast',
                message: '车牌号码不能为空',
                theme: 'warning',
                direction: 'column',
            });
            return;
        }
        var regExp = /(^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$)/;
        if (!(/(^[\u4E00-\u9FA5]{1}[A-Z0-9]{6}$)|(^[A-Z]{2}[A-Z0-9]{2}[A-Z0-9\u4E00-\u9FA5]{1}[A-Z0-9]{4}$)|(^[\u4E00-\u9FA5]{1}[A-Z0-9]{5}[挂学警军港澳]{1}$)|(^[A-Z]{2}[0-9]{5}$)|(^(08|38){1}[A-Z0-9]{4}[A-Z0-9挂学警军港澳]{1}$)/.test(thisView.data.plateNo))) {
            Toast({
                context: this,
                selector: '#t-toast',
                message: '请输入正确的车牌号',
                theme: 'warning',
                direction: 'column',
            });
            return;
        }
        wx.showLoading({
            title: '确认...',
        })
        wx.request({
            url: 'https://www.xiang-cloud.com/Api/Mini/Index.ashx?act=ConfirmPlateNo',
            data: {
                userName: thisView.data.userName,
                plateNo: thisView.data.plateNo
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                'Authorization': wx.getStorageSync("myToken")
            },
            method: 'POST',
            success: function (res) {
                wx.hideLoading();
                wx.showLoading({
                    title: '保存成功',
                })
                thisView.setData({
                    myUserName: thisView.data.userName,
                    EditDialogShow: false,
                })
                thisView.GetDriverInfo();
                wx.setStorageSync('myUserName', thisView.data.userName);
            },
            fail: function (res) {
                wx.hideLoading()
                thisView.setData({
                    errDialogShow: true,
                    errTitle: '提交失败',
                    errinfo: res,
                    errConfirmBtn: {
                        content: '确定',
                        variant: 'base'
                    }
                })
            },
            complete: function (res) {
                wx.hideLoading()
            },
        })
    },
    closeEditDialog() {
        var thisView = this
        thisView.setData({
            EditDialogShow: false,
        });
    },
    showEdit() {
        var thisView = this
        thisView.setData({
            EditDialogShow: true,
            userName: thisView.data.myUserName,
            plateNo: thisView.data.driverDetail.CrmDriverVehicleLicense == null ? '' : thisView.data.driverDetail.CrmDriverVehicleLicense.PlateNo
        });
    },
    //切换车辆
    onCallVisibleChange() {
        var thisView = this
        thisView.setData({
            changeCarvisible: false
        });
    },
    clossCar() {
        var thisView = this
        thisView.setData({
            changeCarvisible: false
        });
    },
    carradioChange(res) {
        var thisView = this;
        var cph = res.detail.value;
        this.setData({
            cph: cph
        })
    },
    confirmCar() {
        var thisView = this
        if (thisView.data.cph == '' || thisView.data.cph == '请选择车牌') {
            Toast({
                context: this,
                selector: '#t-toast',
                message: '请选择车牌号',
                theme: 'warning',
                direction: 'column',
            });
            return
        }
        wx.showLoading({
            title: '确认更换...',
        })
        wx.request({
            url: 'https://www.xiang-cloud.com/Api/Mini/index.ashx?act=ChangeDriverPlateNo',
            data: {
                plateNo: thisView.data.cph,
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                'Authorization': wx.getStorageSync("myToken")
            },
            method: 'POST',
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
                            errTitle: '提交失败',
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
                            errTitle: '提交失败',
                            errinfo: result,
                            errConfirmBtn: {
                                content: '确定',
                                variant: 'base'
                            }
                        })
                        return;
                    }
                    thisView.setData({
                        changeCarvisible: false
                    });
                    setTimeout(function () {
                        wx.showToast({
                            title: '更换成功',
                        })
                    }, 1000)
                } catch (e) {
                    throw e;
                }
            },
            fail: function (res) {
                wx.hideLoading()
                thisView.setData({
                    errDialogShow: true,
                    errTitle: '提交失败',
                    errinfo: res,
                    errConfirmBtn: {
                        content: '确定',
                        variant: 'base'
                    }
                })
            },
            complete: function (res) {
                wx.hideLoading()
            },
        })
    },
    addCar() {
        var thisView = this
        thisView.GetOwnerCompanyPlateNo();
        thisView.setData({
            changeCarvisible: true
        });
    },
    //新增挂靠
    focusHandle() {
        this.setData({
            actionText: '搜索',
        });
    },

    blurHandle() {
        this.setData({
            actionText: '搜索',
        });
    },
    changeHandle(e) {
        const {
            value
        } = e.detail;
        this.setData({
            searchCom: value
        });
    },
    onVisibleChange() {
        var thisView = this
        thisView.setData({
            addvisible: false
        });
    },
    addGuakao() {
        var thisView = this
        thisView.setData({
            addvisible: true
        });
    },
    clossGuakao() {
        var thisView = this
        thisView.setData({
            addvisible: false
        });
    },
    GuakaoonChange(event) {
        const {
            value
        } = event.detail;

        this.setData({
            current: value
        });
    },
    radioChange: function (res) {
        var thisView = this;
        var idVal = res.detail.value;
        if (idVal == undefined || idVal == null || idVal == "")
            return;
        thisView.setData({
            comIndex: idVal
        })
        wx.showLoading({
            title: '正在加载',
        })
        wx.request({
            url: 'https://www.xiang-cloud.com/Api/Mini/SignIn.ashx?act=BizLocation',
            data: {
                pageIndex: 1,
                pageSize: 100,
                queryText: '',
                companyId: idVal
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                'Authorization': wx.getStorageSync("myToken")
            },
            method: 'POST',
            success: function (res) {
                var rtn = JSON.parse(JSON.stringify(res));
                if (rtn == undefined || rtn == "")
                    return;
                var result = rtn.data;
                thisView.setData({
                    arrayBizLocation: result
                })
            },
            fail: function (res) {
                wx.hideLoading()
                thisView.setData({
                    errDialogShow: true,
                    errTitle: '挂靠失败',
                    errinfo: res,
                    errConfirmBtn: {
                        content: '确定',
                        variant: 'base'
                    }
                })

            },
            complete: function (res) {
                wx.hideLoading()
            },
        })
    },
    bindSearchCom: function () {
        var thisView = this;
        var arrItems = [];
        if (thisView.data.searchCom == null || thisView.data.searchCom == "") {
            for (var i = 0; i < thisView.data.arrayCompany.length; i++) {
                var objJson = {};
                objJson.Id = thisView.data.arrayCompany[i].Id;
                objJson.Name = thisView.data.arrayCompany[i].Name;
                arrItems.push(objJson);
            }
        } else {
            for (var i = 0; i < thisView.data.arrayCompany.length; i++) {
                if (thisView.data.arrayCompany[i].Name.indexOf(thisView.data.searchCom) != -1) {
                    var objJson = {};
                    objJson.Id = thisView.data.arrayCompany[i].Id;
                    objJson.Name = thisView.data.arrayCompany[i].Name;
                    arrItems.push(objJson);
                }
            }
        }
        var arrList = JSON.parse(JSON.stringify(arrItems));
        thisView.setData({
            items: arrList
        })
    },
    getCompany() {
        var thisView = this;
        wx.request({
            url: 'https://www.xiang-cloud.com/Api/Mini/SignIn.ashx?act=Company',
            data: {
                pageIndex: 1,
                pageSize: 100,
                queryText: ''
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                'Authorization': wx.getStorageSync("myToken")
            },
            method: 'POST',
            success: function (res) {
                var rtn = JSON.parse(JSON.stringify(res));
                if (rtn == undefined || rtn == "")
                    return;
                var result = rtn.data;
                thisView.setData({
                    arrayCompany: result
                })
                var arrItems = [];
                for (var i = 0; i < thisView.data.arrayCompany.length; i++) {
                    var objJson = {};
                    objJson.Id = thisView.data.arrayCompany[i].Id;
                    objJson.Name = thisView.data.arrayCompany[i].Name;
                    arrItems.push(objJson);
                }
                var arrList = JSON.parse(JSON.stringify(arrItems));
                thisView.setData({
                    items: arrList
                })
            },
            fail: function (res) {
                thisView.setData({
                    errDialogShow: true,
                    errTitle: '',
                    errinfo: res,
                    errConfirmBtn: {
                        content: '确定',
                        variant: 'base'
                    }
                })
            },
            complete: function (res) {},
        })
    },
    confirmGuakao() {
        var thisView = this;
        if (thisView.data.myTelephone == "") {
            wx.showToast({
                title: '无手机号',
                icon: 'none',
                duration: 1500
            })
            return;
        }
        var selectedCompanyName = '';
        var idCompanyVal = thisView.data.comIndex;
        for (var i = 0; i < thisView.data.arrayCompany.length; i++) {
            if (thisView.data.arrayCompany[i].Id == idCompanyVal) {
                selectedCompanyName = thisView.data.arrayCompany[i].Name;
            }
        }
        if (selectedCompanyName == '') {
            Toast({
                context: this,
                selector: '#t-toast',
                message: '请点击搜索，选择正确的挂靠公司',
                theme: 'warning',
                direction: 'column',
            });
            return;
        }
        if ((idCompanyVal == undefined || idCompanyVal == null || idCompanyVal == "" || idCompanyVal == 0) && thisView.data.searchCom == '') {
            Toast({
                context: this,
                selector: '#t-toast',
                message: '请选择公司',
                theme: 'warning',
                direction: 'column',
            });
            return;
        }

        wx.showLoading({
            title: '正在绑定',
        })
        wx.request({
            url: 'https://www.xiang-cloud.com/Api/Mini/index.ashx?act=AddDriverAssociate',
            data: {
                companyId: idCompanyVal,
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                'Authorization': wx.getStorageSync("myToken")
            },
            method: 'POST',
            success: function (res) {
                console.log(res)
                var rtn = JSON.parse(JSON.stringify(res));
                if (rtn == undefined || rtn == "")
                    return;
                var result = rtn.data;
                thisView.getBindCom()
                thisView.setData({
                    searchCom: '',
                    addvisible: false
                })
                try {
                    if (result.ErrorDesc || result.ErrorCode || result.HasError) {
                        let msg = (result.ErrorCode ? '(' + result.ErrorCode + ') ' : '') + result.ErrorDesc;
                        thisView.setData({
                            errDialogShow: true,
                            errTitle: '',
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
                            errTitle: '',
                            errinfo: result,
                            errConfirmBtn: {
                                content: '确定',
                                variant: 'base'
                            }
                        })
                        return;
                    }
                } catch (e) {
                    throw e;
                }
            },
            fail: function (res) {
                wx.hideLoading()
                thisView.setData({
                    errDialogShow: true,
                    errTitle: '',
                    errinfo: res,
                    errConfirmBtn: {
                        content: '确定',
                        variant: 'base'
                    }
                })
            },
            complete: function (res) {
                wx.hideLoading()
            },
        })
    },
    getBindCom() {
        var thisView = this
        wx.showLoading({
            title: '获取公司...',
        })
        wx.request({
            url: 'https://www.xiang-cloud.com/Api/Mini/index.ashx?act=GetDriverAssociate',
            data: {},
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                'Authorization': wx.getStorageSync("myToken")
            },
            method: 'POST',
            success: function (res) {
                var rtn = JSON.parse(JSON.stringify(res));
                if (rtn == undefined || rtn == "")
                    return;
                var result = rtn.data;
                thisView.setData({
                    haveBindCom: result
                })

                try {
                    if (result.ErrorDesc || result.ErrorCode || result.HasError) {
                        let msg = (result.ErrorCode ? '(' + result.ErrorCode + ') ' : '') + result.ErrorDesc;
                        thisView.setData({
                            errDialogShow: true,
                            errTitle: '',
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
                            errTitle: '',
                            errinfo: result,
                            errConfirmBtn: {
                                content: '确定',
                                variant: 'base'
                            }
                        })
                        return;
                    }
                } catch (e) {
                    throw e;
                }
            },
            fail: function (res) {
                wx.hideLoading()
                thisView.setData({
                    errDialogShow: true,
                    errTitle: '',
                    errinfo: res,
                    errConfirmBtn: {
                        content: '确定',
                        variant: 'base'
                    }
                })
            },
            complete: function (res) {
                wx.hideLoading()
            },
        })
    },
    unbindCom(e) {
        console.log(e)
        var thisView = this
        var idCompanyVal = e.currentTarget.dataset.comid
        wx.showLoading({
            title: '获取公司...',
        })
        wx.request({
            url: 'https://www.xiang-cloud.com/Api/Mini/index.ashx?act=CancelDriverAssociate',
            data: {
                companyId: idCompanyVal,
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                'Authorization': wx.getStorageSync("myToken")
            },
            method: 'POST',
            success: function (res) {
                console.log(res)
                var rtn = JSON.parse(JSON.stringify(res));
                if (rtn == undefined || rtn == "")
                    return;
                var result = rtn.data;
                thisView.getBindCom()

                try {
                    if (result.ErrorDesc || result.ErrorCode || result.HasError) {
                        let msg = (result.ErrorCode ? '(' + result.ErrorCode + ') ' : '') + result.ErrorDesc;
                        thisView.setData({
                            errDialogShow: true,
                            errTitle: '',
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
                            errTitle: '',
                            errinfo: result,
                            errConfirmBtn: {
                                content: '确定',
                                variant: 'base'
                            }
                        })
                        return;
                    }
                } catch (e) {
                    throw e;
                }
            },
            fail: function (res) {
                wx.hideLoading()
                thisView.setData({
                    errDialogShow: true,
                    errTitle: '',
                    errinfo: res,
                    errConfirmBtn: {
                        content: '确定',
                        variant: 'base'
                    }
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