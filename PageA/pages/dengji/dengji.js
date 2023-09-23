// packageA/pages/driverInfo/driverInfo.js

Page({

  data: {
    driverDetail: '',
    defaultUpZhengImage: "../../../img/b.svg",
    defaultUpZhengImage2: "../../../img/c.svg",
    defaultHeadImage: 'http://www.xiang-cloud.com:8099/images/c.png',
    driverusername: '',
    modalHidden: true,
    errinfo: null,
    modalSuccessHidden: true,
    successinfo: null,
    arrayCompany: [],
    items: [],
    arrayBizLocation: [],
    haveBindCom: [],
    indexBizLocation: 0,
    comIndex: '',

    searchCom: '',
    hiddenConfirmSignOut: true,
    fromenroll: false,
    license: true,
    permit: false,
    lincenseSuccess: false,
    permitSuccess: false,
    guakao: false,
    queren: false,
    userName: '',
    plateNo: ''
  },
  guakaoshow() {
    this.setData({
      guakao: true
    });
  },
  guakaoonClose() {
    this.setData({
      guakao: false
    });
  },
  confirmSignOut: function () {
    var thisView = this;

    wx.showLoading({
      title: '注销中...',
      mask: true
    })

    wx.request({
      url: 'https://www.xiang-cloud.com/Api/Mini/Index.ashx?act=CloseAccount',
      data: {

      },
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

        // if (result)
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

          thisView.setData({
            hiddenConfirmSignOut: true
          })

          thisView.confirmLogOut();
        } catch (e) {
          throw e;
        }
      },
      fail: function (res) {
        wx.hideLoading()

        thisView.setData({
          hiddenConfirmSignOut: true,
          modalHidden: false,
          errinfo: res
        })

      },
      complete: function (res) {
        wx.hideLoading()

        thisView.setData({
          hiddenConfirmSignOut: true
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
  signOut: function () {
    this.setData({
      hiddenConfirmSignOut: false
    })
  },

  cancelHiddenModal: function () {
    this.setData({
      hiddenConfirmSignOut: true
    })
  },

  onShow: function () {
    var thisView = this
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    wx.request({
      url: 'https://www.xiang-cloud.com/Api/Mini/Index.ashx?act=GetDriverInfo',
      data: {
        phone: thisView.data.parenttelphone
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
        thisView.setData({
          driverDetail: result,
        })

      },
      fail: function (res) {
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

  onLoad: function (options) {
    if (options.regist == 1) {
      this.setData({
        fromenroll: true
      });
    }
    var thisView = this
    var wechatImg = wx.getStorageSync("myHeadImg");
    console.log(wx.getStorageSync("myHeadImg"))
    console.log(wx.getStorageSync('mywechatuser'))

    if (wx.getStorageSync("myHeadImg") == 'http://static.starfang.com/images/headProfile1.jpg' ||
      wx.getStorageSync("myHeadImg") == '') {
      wechatImg = "http://www.xiang-cloud.com:8099/images/c.png"
    } else {
      wechatImg = 'https://www.xiang-cloud.com' + wx.getStorageSync("myHeadImg")
    }
    thisView.setData({
      driverusername: ((wx.getStorageSync('myUserName') == undefined || wx.getStorageSync('myUserName') == null || wx.getStorageSync('myUserName') == 'undefined' ||
        wx.getStorageSync('myUserName') == '') ? '' : wx.getStorageSync('myUserName') + '  '),
      parenttelphone: wx.getStorageSync("myTelephone"),
      defaultHeadImage: wechatImg
    })

    wx.showLoading({
      title: '加载中...',
      mask: true
    })


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
        console.log(res)
        var rtn = JSON.parse(JSON.stringify(res));
        if (rtn == undefined || rtn == "")
          return;
        var result = rtn.data;
        console.log(result);
        thisView.setData({
          arrayCompany: result
        })
      },
      fail: function (res) {
        thisView.setData({
          modalHidden: false,
          errinfo: res
        })
      },
      complete: function (res) {},
    })
    thisView.getBindCom()
  },
  onClose() {
    this.setData({
      fromenroll: false
    });
  },
  lincenseUp() {
    this.photoFunc("imgJiaShiZheng");
  },
  permitUp() {
    this.photoFunc("imgXingShiZheng");
  },
  goChange() {
    wx.navigateTo({
      url: '/packageA/pages/changeCph/changeCph',
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

  inputSearchCom(e) {
    this.setData({
      searchCom: e.detail.value
    })
  },

  radioChange: function (res) {
    var thisView = this;
    var idVal = res.detail.value;
    console.log(idVal)

    if (idVal == undefined || idVal == null || idVal == "")
      return;

    thisView.setData({
      comIndex: idVal,
      indexBizLocation: 0,
      keyValueCompanyName: ''
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
        console.log(result);
        thisView.setData({
          arrayBizLocation: result
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

  changePickerBizLocation: function (e) {
    var thisView = this;
    thisView.setData({
      indexBizLocation: e.detail.value,
      keyValueCompanyName: thisView.data.arrayBizLocation[e.detail.value].Name + ' >'
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
        console.log(res)
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

  bindingCompany: function (e) {
    var thisView = this;
    if (thisView.data.parenttelphone == "") {
      wx.showToast({
        title: '无手机号',
        icon: 'none',
        duration: 1500
      })
      return;
    }
    console.log(thisView.data.keyValueCompanyName)
    var selectedCompanyName = '';
    var idCompanyVal = thisView.data.comIndex;
    for (var i = 0; i < thisView.data.arrayCompany.length; i++) {
      if (thisView.data.arrayCompany[i].Id == idCompanyVal) {
        selectedCompanyName = thisView.data.arrayCompany[i].Name;
      }
    }
    if (selectedCompanyName == '') {
      thisView.setData({
        modalHidden: false,
        errinfo: '请点击搜索，选择正确的挂靠公司'
      })
      return;
    }
    if ((idCompanyVal == undefined || idCompanyVal == null || idCompanyVal == "" || idCompanyVal == 0) && thisView.data.searchCom == '') {
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
          items: [],
          searchCom: '',
          guakao: false
        })



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

  bindSearchCom: function () {
    var thisView = this;
    if (thisView.data.searchCom == null || thisView.data.searchCom == "") {
      thisView.setData({
        modalHidden: false,
        errinfo: "请输入公司名称搜索"
      })
      return;
    }
    // if(thisView.data.searchCom.length<4){
    //   thisView.setData({
    //     modalHidden: false,
    //     errinfo: "公司名称最少输入4位"
    //   })
    //   return;
    // }

    var arrItems = [];
    var existingData = false;
    for (var i = 0; i < thisView.data.arrayCompany.length; i++) {
      if (thisView.data.arrayCompany[i].Name.indexOf(thisView.data.searchCom) != -1) {
        var objJson = {};
        objJson.Id = thisView.data.arrayCompany[i].Id;
        objJson.Name = thisView.data.arrayCompany[i].Name;
        arrItems.push(objJson);
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
        console.log('分析', res);
        var rtn = JSON.parse(JSON.stringify(res));
        if (rtn == undefined || rtn == "")
          return;
        var result = rtn.data;
        if (result == null || result == '') {
          return;
        }
        console.log('分析', res);
        if (imageIndex == "2") {
          thisView.data.driverDetail.CrmDrivingLicense = rtn.data
          thisView.setData({
            driverDetail: thisView.data.driverDetail
          })
          thisView.setData({
            driverusername: rtn.data.Name
          })
          if (thisView.data.fromenroll) {
            thisView.setData({
              permit: true,
              license: false
            });
          }

          wx.setStorageSync("myUserName", rtn.data.Name);
        } else if (imageIndex == "3") {
          thisView.data.driverDetail.CrmDriverVehicleLicense = rtn.data
          thisView.setData({
            driverDetail: thisView.data.driverDetail,
            permitSuccess: true
          })
          if (thisView.data.fromenroll) {
            thisView.setData({
              permit: false,
              lincense: false,
              fromenroll: false
            });
          }
        }
      },
      fail: function (res) {
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

  confirmSave(imageIndex, img) {
    var thisView = this;
    var mobile = thisView.data.parenttelphone;
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

        if (result == null || result == '') {
          thisView.setData({
            modalSuccessHidden: false,
            successinfo: '保存成功'
          })
          if (imageIndex == "2") {
            thisView.ocrImg('https://www.xiang-cloud.com/Api/Mini/SignIn.ashx?act=OcrDrivingLicense', img, imageIndex)
          } else if (imageIndex == "3") {
            thisView.ocrImg('https://www.xiang-cloud.com/Api/Mini/SignIn.ashx?act=OcrVehicleLicense', img, imageIndex)
          }
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
          thisView.setData({
            modalSuccessHidden: false,
            successinfo: '保存成功'
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
          modalHidden: false,
          errinfo: res
        })
      },
      complete: function (res) {
        wx.hideLoading()
      },
    })
  },


  photoFunc: function (e) {
    var objImageClick = "";
    if (e.currentTarget != null) {
      objImageClick = e.currentTarget.id;
    } else {
      objImageClick = e;
    }
    var objImageUrl = '';
    var thisView = this;

    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['camera'],
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
                thisView.confirmSave("2", objImageUrl);
                break;
              case 'imgXingShiZheng':
                thisView.confirmSave("3", objImageUrl);
                break;
              case 'imgHeadImage':
                wx.setStorageSync('myHeadImg', objImageUrl);
                thisView.setData({
                  defaultHeadImage: tempFilePaths[0]
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
  baocun() {
    debugger;
    var thisView = this;
    thisView.setData({
      queren: true,
      userName: thisView.data.driverDetail.CrmDrivingLicense == null ? '' : thisView.data.driverDetail.CrmDrivingLicense.Name,
      plateNo: thisView.data.driverDetail.CrmDriverVehicleLicense == null ? '' : thisView.data.driverDetail.CrmDriverVehicleLicense.PlateNo
    });
    //wx.navigateBack();
  },
  querenbutton() {
    var thisView = this
    debugger;
    if (thisView.data.userName == '') {
      wx.showToast({
        title: '司机姓名不能为空',
        icon: 'none',
        duration: 1500
      })
      return;
    }
    if (thisView.data.plateNo == '') {
      wx.showToast({
        title: '车牌号码不能为空',
        icon: 'none',
        duration: 1500
      })
      return;
    }
    var regExp = /(^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$)/;
    if (!(/(^[\u4E00-\u9FA5]{1}[A-Z0-9]{6}$)|(^[A-Z]{2}[A-Z0-9]{2}[A-Z0-9\u4E00-\u9FA5]{1}[A-Z0-9]{4}$)|(^[\u4E00-\u9FA5]{1}[A-Z0-9]{5}[挂学警军港澳]{1}$)|(^[A-Z]{2}[0-9]{5}$)|(^(08|38){1}[A-Z0-9]{4}[A-Z0-9挂学警军港澳]{1}$)/.test(thisView.data.plateNo))) {
      Toast('请输入正确的车牌号');
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
          driverusername: thisView.data.userName
        });
        wx.setStorageSync('myUserName', thisView.data.userName);
        wx.navigateBack();
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
  resetSuccessModal: function () {
    this.setData({
      modalSuccessHidden: true,
      successinfo: null
    })
    if (wx.getStorageSync("myToken") == undefined || wx.getStorageSync("myToken") == null || wx.getStorageSync("myToken") == '') {
      this.gotoLogin()
    }
  }

})