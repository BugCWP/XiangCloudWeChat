// packageA/pages/login/employee.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        firstInput: true,
        username: '',
        usernameerror: '',
        company: '',
        companyerror: '',
        address: '',
        arrayCompany: [],
        modalHidden: true,
        errinfo: '',
        items: [],
        companycolumns: [{
            label: '测试',
            value: '测试'
        }],
        companyselectpage: false,
        addressselectpage: false,
        companyId: 0,
        addresscolumns: [],
        addressList: [],
        addressId: 0,
        phoneNo: '',
        modalSuccessHidden: true,
        successinfo: '',
        sessionkeyval: '',
        mToken: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        var thisView = this;
        thisView.setData({
            mToken: wx.getStorageSync("myToken")
        })
        var myToken = wx.getStorageSync('myToken');
        if (myToken == undefined || myToken == null || myToken == "") {
            wx.login({
                success: function (res) {
                    if (res.code) {
                        var js_code = res.code;
                        wx.request({
                            method: 'POST',
                            url: 'https://www.xiang-cloud.com/Api/Mini/SignIn.ashx?act=WeXinLogin2',
                            data: {
                                code: js_code
                            },
                            header: {
                                'content-type': 'application/json'
                            },
                            success: function (myres) {
                                console.log(myres)
                                var rtn = JSON.parse(JSON.stringify(myres));

                                if (rtn == undefined || rtn == "")
                                    return;

                                thisView.setData({
                                    sessionkeyval: rtn.data
                                })
                            },
                            fail: function (err) {
                                var errResult123 = err;
                            }
                        })
                    }
                }
            })
        }
        this.getCompany();
    },
    getPhoneNumber(e) {
        debugger;
        var thisView = this;
        if (thisView.data.username == null || thisView.data.username == '') {
            thisView.setData({
                usernameerror: '用户名不能为空'
            });
            return;
        } else {
            thisView.setData({
                usernameerror: ''
            });
        }
        if (thisView.data.company == null || thisView.data.company == '' || thisView.data.companyId == null || thisView.data.companyId == 0) {
            thisView.setData({
                companyerror: '绑定公司不能为空'
            });
            return;
        } else {
            thisView.setData({
                companyerror: ''
            });
        }
        wx.request({
            url: "https://www.xiang-cloud.com/Api/Mini/SignIn.ashx?act=DecryptPhoneNumber",
            data: {
                sessionId: thisView.data.sessionkeyval,
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
                        modalHidden: false,
                        errinfo: "由于用户主动拒绝，未获取到手机号，请重新授权"
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

    searchViaKeyWord: function (e) {
        var thisView = this;
        if (thisView.data.company == null || thisView.data.company == "") {
            thisView.setData({
                companyerror: "请输入公司名称搜索"
            })
            return;
        }

        var arrItems = [];
        var existingData = false;
        for (var i = 0; i < thisView.data.arrayCompany.length; i++) {
            if (thisView.data.arrayCompany[i].Name.indexOf(thisView.data.keyValueCompanyName) != -1) {
                var objJson = {};
                objJson.Id = thisView.data.arrayCompany[i].Id;
                objJson.Name = thisView.data.arrayCompany[i].Name;
                console.log(objJson);
                arrItems.push(objJson.Name);
                existingData = true;
            }
        }

        var arrList = JSON.parse(JSON.stringify(arrItems));
        console.log(arrList);
        if (existingData == false) {
            thisView.setData({
                modalHidden: false,
                errinfo: '此公司未注册，请先注册公司账号'
            })
        }
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
                pageSize: 1000,
                queryText: thisView.data.company
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
                console.log(result);
                thisView.setData({
                    arrayCompany: result
                })
                var arrItems = [];
                for (var i = 0; i < thisView.data.arrayCompany.length; i++) {
                    var objJson = {};
                    objJson.Id = thisView.data.arrayCompany[i].Id;
                    objJson.Name = thisView.data.arrayCompany[i].Name;
                    arrItems.push({
                        label: objJson.Name,
                        value: objJson.Id
                    });
                }
                thisView.setData({
                    companycolumns: arrItems
                })
            },
            fail: function (res) {
                wx.hideLoading()
                thisView.setData({
                    modalHidden: false,
                    errinfo: res
                })
            },
            complete: function (res) {
                wx.hideLoading()
            },
        })
    },
    resetModal: function () {
        this.setData({
            modalHidden: true,
            errinfo: null
        })
    },
    getAddress() {
        var thisView = this;
        wx.request({
            url: 'https://www.xiang-cloud.com/Api/Mini/SignIn.ashx?act=BizLocation',
            data: {
                pageIndex: 1,
                pageSize: 1000,
                queryText: '',
                companyId: thisView.data.companyId
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
                console.log(result);
                var arrItems = [];
                for (var i = 0; i < result.length; i++) {
                    var objJson = {};
                    objJson.Id = result[i].Id;
                    objJson.Name = result[i].Name;
                    arrItems.push({
                        label: objJson.Name,
                        value: objJson.Id
                    });
                }
                thisView.setData({
                    addressList: result,
                    addresscolumns: arrItems,
                    addressselectpage: true
                })

            },
            fail: function (res) {
                wx.hideLoading()
                thisView.setData({
                    modalHidden: false,
                    errinfo: res
                })
            },
            complete: function (res) {
                wx.hideLoading()
            },
        })
    },
    selectCompang() {
        var thisView = this;
        var arrItems = [];
        for (var i = 0; i < thisView.data.arrayCompany.length; i++) {
            if (thisView.data.company != null && thisView.data.company != "" && thisView.data.arrayCompany[i].Name.indexOf(thisView.data.company) != -1) {
                var objJson = {};
                objJson.Id = thisView.data.arrayCompany[i].Id;
                objJson.Name = thisView.data.arrayCompany[i].Name;
                arrItems.push({
                    label: objJson.Name,
                    value: objJson.Id
                });
            }
        }
        thisView.setData({
            companycolumns: arrItems
        })
        this.setData({
            companyselectpage: true
        })
    },
    companyselectpageonClose() {
        this.setData({
            companyselectpage: false
        })
    },
    addressselectpageonClose() {
        this.setData({
            addressselectpage: false
        })
    },
    companyonChange(event) {
        var thisView = this;
        const {
            picker,
            value,
            index
        } = event.detail;
        for (var i = 0; i < thisView.data.arrayCompany.length; i++) {
            if (thisView.data.arrayCompany[i].Id == value) {
                var objJson = {};
                objJson.Id = thisView.data.arrayCompany[i].Id;
                objJson.Name = thisView.data.arrayCompany[i].Name;
                this.setData({
                    company: objJson.Name,
                    companyId: objJson.Id,
                    companyselectpage: false
                })
            }
        }
    },
    addressonChange(event) {
        var thisView = this;
        const {
            picker,
            value,
            index
        } = event.detail;
        for (var i = 0; i < thisView.data.addressList.length; i++) {
            if (thisView.data.addressList[i].Id == value) {
                var objJson = {};
                objJson.Id = thisView.data.addressList[i].Id;
                objJson.Name = thisView.data.addressList[i].Name;
                this.setData({
                    address: objJson.Name,
                    addressId: objJson.Id,
                    addressselectpage: false
                })
            }
        }
    },
    confirmContinue: function (e) {
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
                paraUserName: thisView.data.username,
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
                                modalHidden: false,
                                errinfo: msg
                            })
                            return;
                        } else if (typeof result === 'string' && result.match(/error/)) {
                            thisView.setData({
                                modalHidden: false,
                                errinfo: result
                            })
                            return;
                        }
                    }
                catch (e) {
                    throw e;
                }
                thisView.bindingCompany();
                return;
            },
            fail: function (res) {
                wx.hideLoading()
                thisView.setData({
                    modalHidden: false,
                    errinfo: res
                })
            },
            complete: function (res) {
                wx.hideLoading()
            },
        })
    },
    bindingCompany: function () {
        var thisView = this;
        if (thisView.data.companyId == null || thisView.data.companyId == 0) {
            wx.showToast({
                title: '请选择公司',
                icon: 'none',
                duration: 1500
            })
            return;
        }

        wx.showLoading({
            title: '正在绑定',
        })

        wx.request({
            url: 'https://www.xiang-cloud.com/Api/Mini/SignIn.ashx?act=BindCompany',
            data: {
                paraTelphone: thisView.data.phoneNo,
                companyId: thisView.data.companyId,
                bizLocationId: thisView.data.addressId == 0 ? '' : thisView.data.addressId,
                isDriver: false
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
                if (result == null || result == '') {
                    var isCompanyUser = '绑定成功\n\n恭喜您成功成为箱云科技用户，请访问https://user.xiang-cloud.com\n\n' +
                        '登陆账号：' + thisView.data.phoneNo + '\n\n' +
                        '初始密码：' + thisView.data.phoneNo + '\n\n' +
                        '登陆后，请尽快登陆并及时更改初始密码!';
                    thisView.setData({
                        modalSuccessHidden: false,
                        successinfo: isCompanyUser
                    })
                    wx.setStorageSync('BindCompanyName', thisView.data.company);
                    wx.setStorageSync('BindCompanyLocationAddress', thisView.data.address);
                    return;
                }
                try {
                    if (result.ErrorDesc || result.ErrorCode || result.HasError) {
                        let msg = (result.ErrorCode ? '(' + result.ErrorCode + ') ' : '') + result.ErrorDesc;
                        thisView.setData({
                            modalHidden: false,
                            errinfo: msg
                        })
                        return;
                    } else if (typeof result === 'string' && result.match(/error/)) {
                        thisView.setData({
                            modalHidden: false,
                            errinfo: result
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
                    modalHidden: false,
                    errinfo: res
                })

            },
            complete: function (res) {
                wx.hideLoading()
            },
        })

    },
    resetSuccessModal: function () {
        this.setData({
            modalSuccessHidden: true,
            successinfo: null
        })
        if (wx.getStorageSync("myToken") == undefined || wx.getStorageSync("myToken") == null || wx.getStorageSync("myToken") == '') {
            this.gotoLogin()
        }
    },
    gotoLogin: function () {
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