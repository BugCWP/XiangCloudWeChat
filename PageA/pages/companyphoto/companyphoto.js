const defaultImg = '../../img/takemyphoto.png';

Page({

  data: {
    finishhidden:true,
    payString:'支付宝',
    payType: [{
      name: '支付宝',
      checked: true,
      value: '支付宝',
    },
    {
      name: '微信',
      checked: false,
      value: '微信',
    }
  ],
    modalSuccessHidden: true,
    successinfo: null,
    toastHidden: true,
    modalHidden: true,
    errinfo: null,
    parenttelphone: '',
    yingyezhizhaoUrl: '',
    daoluxukeUrl: '',
    defaultYingYeZhiZhaoImage: '',
    defaultDaoLuXuKeImage: '',
    imgList: [],
    hiddenSave: false,
    hiddenLogin: true,
    comefromInfo: 0,
    gongsitaitouval:'',
    dizhival:'',
    farenval:'',
    youxiaoqival:'',
    xinyongdaimaval:'',
    kaihuyinhangval:'',
    kaihuzhanghaoval:'',
    bangongdianhuaval:'',
    zhibaoval:'',
    weixinval:'',
    yinhangval:'',
    daoluxukeval:'',
    isUpdate:false,
    id:'',
    myBusinessLicenceUrl:'',
    myLogoUrl:'',
    myRoadTransportUrl:'',
    hiddenNewCompanyView:false,
    hiddenBindingCompanyView:true,
    fontNewCompanyColor:'#a5040d',
    fontBindingCompany:'#ccc',
    arrayCompany: [],
    index: 0,
    arrayBizLocation: [],
    indexBizLocation: 0,
    items: '',
    keyValueCompanyName:'',
    hiddenbindcompany:false,
    hiddenunbindcompany:true,
    modalSuccessUnBind:true,
    businesslocationaddress:'',
    firstShow:false,
    secondShow:false,
    registpage:true
  },

  changePayType(e){
    this.setData({
      payString: e.detail.value
    })
  },

  unbindCompany:function(){
    var thisView = this;

    wx.showLoading({
      title: '解绑中...',
      mask: true
    })

    wx.request({
      url: 'https://www.xiang-cloud.com/Api/Mini/Index.ashx?act=UnBindCompany',
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

        if (result)
        {
          try {
            if (result.ErrorDesc || result.ErrorCode || result.HasError) {
              let msg = (result.ErrorCode ? '(' + result.ErrorCode + ') ' : '') + result.ErrorDesc;

              thisView.setData({
                modalHidden: false,
                errinfo: msg
              })

              return;
            }
            else if (typeof result === 'string' && result.match(/error/)) {
              thisView.setData({
                modalHidden: false,
                errinfo: result
              })

              return;
            }

            thisView.setData({
              modalSuccessUnBind: false,
              successinfo: '解绑成功'
            })

          }
          catch (e) {
            throw e;
          }
        }
        else
        {
          thisView.setData({
            modalSuccessUnBind: false,
            successinfo: '解绑成功,需要重新绑定公司'
          })
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

  resetSuccessModalUnBind: function () {
    wx.setStorageSync('myToken', '');
    wx.setStorageSync('myTelephone', '');
    wx.setStorageSync('myUserProfileType', '');
    wx.setStorageSync("mywechatuser", '');
    wx.setStorageSync("mywechatid", '');
    wx.setStorageSync("myHeadImg", '');
    wx.setStorageSync("BindCompanyName", '');
    wx.setStorageSync("BindCompanyLocationAddress", '');
    wx.clearStorage();

    wx.reLaunch({
      url: '../../packageA/pages/login/login',
    })
  },

  onLoad: function (options) {
    var thisView = this;
    if (options.regist == 1) {
      this.setData({
        firstShow: true,
        registpage:false
      });
    }
    if (options != undefined && options != null) {
      if (options.comefromInfo != undefined && options.comefromInfo != null && options.comefromInfo != "") {
        thisView.setData({
          comefromInfo: 1
        })
      }
    }
    console.log(thisView.data.comefromInfo)

    if (thisView.data.comefromInfo == 1) {
      thisView.setData({
        hiddenbindcompany: true,
        hiddenunbindcompany: false,
        keyValueCompanyName: wx.getStorageSync("BindCompanyName"),
        businesslocationaddress: wx.getStorageSync("BindCompanyLocationAddress")
      })
    }
    else
    {
      thisView.setData({
        hiddenbindcompany: false,
        hiddenunbindcompany: true
      })
    }

    this.setData({
      parenttelphone: wx.getStorageSync("myTelephone")
    })

    wx.request({
      url: 'https://www.xiang-cloud.com/Api/Mini/SignIn.ashx?act=Company',
      data: {
        pageIndex:1,
        pageSize:100,
        queryText:''
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

    if (thisView.data.comefromInfo == 1) {
      thisView.setData({
        hiddenSave: true,
        hiddenLogin: true
      })

      wx.request({
        url: 'https://www.xiang-cloud.com/Api/Mini/Index.ashx?act=GetCompanyInfo',
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

          if (result)
            try {

              var arrImages = thisView.data.imgList;
              arrImages.push('https://www.xiang-cloud.com' + result.BusinessLicenceUrl);

              thisView.setData({
                kaihuyinhangval: result.BankName,
                kaihuzhanghaoval: result.BankAccount,
                gongsitaitouval: result.FullName,
                dizhival: result.RegisterAddress,
                bangongdianhuaval: result.Tel,
                xinyongdaimaval: result.TaxNo,
                zhibaoval: result.AlipayAccount,
                weixinval: result.WechatAccount,
                yinhangval: result.UnionAccount,
                daoluxukeval: result.RoadTransportNo,
                defaultYingYeZhiZhaoImage: 'https://www.xiang-cloud.com' + result.BusinessLicenceUrl,
                imgList: arrImages,
                isUpdate:true,
                id: result.Id,
                myBusinessLicenceUrl: result.BusinessLicenceUrl,
                myLogoUrl: result.LogoUrl,
                myRoadTransportUrl: result.RoadTransportUrl
              })

            }
            catch (e) {
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
    wx.clearStorage();

    wx.reLaunch({
        url: '../login/login',
    })
  },

  codeInputEvent: function (e) {
    this.setData({
      keyValueCompanyName: e.detail.value
    })
  },

  confirmSubmit: function (e) {
    var thisView = this;
    console.log(e)

    var mobile = thisView.data.parenttelphone;

    if (mobile.length == 0) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none',
        duration: 1500
      })

      return;
    }
    if (mobile.length != 11) {
      wx.showToast({
        title: '手机号长度有误',
        icon: 'none',
        duration: 1500
      })

      return;
    }
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (!myreg.test(mobile)) {
      wx.showToast({
        title: '手机号有误',
        icon: 'none',
        duration: 1500
      })

      return;
    }

    if(!thisView.data.isUpdate)
    {
      if (thisView.data.yingyezhizhaoUrl == undefined || thisView.data.yingyezhizhaoUrl == null || thisView.data.yingyezhizhaoUrl == "") {
        wx.showToast({
          title: '请拍营业执照',
          icon: 'none',
          duration: 1500
        })

        return;
      }
    }

    if (e.detail.value.bangongdianhua == undefined || e.detail.value.bangongdianhua == null || e.detail.value.bangongdianhua == "") {
      wx.showToast({
        title: '请输入办公电话',
        icon: 'none',
        duration: 1500
      })

      return;
    }

    if (e.detail.value.gongsishuihao == undefined || e.detail.value.gongsishuihao == null || e.detail.value.gongsishuihao == "") {
      wx.showToast({
        title: '请输入公司税号',
        icon: 'none',
        duration: 1500
      })

      return;
    }
  
    wx.showLoading({
      title: '正在保存',
      mask: true
    })

    if(thisView.data.isUpdate)
    {
      wx.request({
        url: 'https://www.xiang-cloud.com/Api/Mini/Index.ashx?act=UpdateCompany',
        data: {
          entity: JSON.stringify({
            FullName: e.detail.value.gongsidizhi,
            TaxNo: e.detail.value.gongsishuihao,
            BankName: e.detail.value.kaihuhang,
            BankAccount: e.detail.value.zhanghao,
            RegisterAddress: e.detail.value.dizhi,
            Tel: e.detail.value.bangongdianhua,
            WechatAccount: e.detail.value.weixin,
            AlipayAccount: e.detail.value.zhifubao,
            UnionAccount: e.detail.value.yinlian,
            RoadTransportNo: e.detail.value.daoluxukezhenghao,
            Id: this.data.id,
            BusinessLicenceUrl: this.data.myBusinessLicenceUrl,
            LogoUrl:this.data.myLogoUrl,
            RoadTransportUrl:this.data.myRoadTransportUrl
          })
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

          if(result != undefined && result != null && result.ErrorDesc != undefined && result.ErrorDesc != null)
          {
            thisView.setData({
              modalHidden: false,
              errinfo: result.ErrorDesc
            })

            return;
          }

          thisView.setData({
            modalSuccessHidden: false,
            successinfo: '保存成功',
            //finishhidden:false
          })

          thisView.gotoLogin();
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
        
      return;
    }

    wx.request({
      url: 'https://www.xiang-cloud.com/Api/Mini/SignIn.ashx?act=RegisterCompany',
      data: {
        paraTelphone: mobile,
        entity: JSON.stringify({
          FullName: e.detail.value.gongsidizhi,
          TaxNo: e.detail.value.gongsishuihao,
          BankName: e.detail.value.kaihuhang,
          BankAccount: e.detail.value.zhanghao,
          RegisterAddress: e.detail.value.dizhi,
          Tel: e.detail.value.bangongdianhua,
          LogoUrl:'',
          BusinessLicenceUrl: thisView.data.yingyezhizhaoUrl,
          RoadTransportUrl:'',
          WechatAccount: e.detail.value.weixin,
          AlipayAccount: e.detail.value.zhifubao,
          UnionAccount: e.detail.value.yinlian,
          RoadTransportNo: e.detail.value.daoluxukezhenghao
        }),
        locations:null
      },
      header: { 'content-type': 'application/x-www-form-urlencoded' }, 
      method: 'POST',
      success: function (res) {

        var rtn = JSON.parse(JSON.stringify(res));

        if (rtn == undefined || rtn == "")
          return;

        var result = rtn.data;

        if (result == null || result == '') {
          if (wx.getStorageSync("myToken") == undefined || wx.getStorageSync("myToken") == null || wx.getStorageSync("myToken") == '') {
            thisView.setData({
              hiddenSave: true,
              hiddenLogin: false
            })
          }

          thisView.setData({
            //modalSuccessHidden: false,
            finishhidden:false,
            //successinfo: '保存成功'
          })

          //thisView.gotoLogin();
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
          }
          else if (typeof result === 'string' && result.match(/error/)) {
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

          if (wx.getStorageSync("myToken") == undefined || wx.getStorageSync("myToken") == null || wx.getStorageSync("myToken") == '') {
            thisView.setData({
              hiddenSave: true,
              hiddenLogin: false
            })
          }
          thisView.setData({
            //modalSuccessHidden: false,
            finishhidden:false,
            //successinfo: '保存成功'
          })
          //thisView.gotoLogin();
        }
        catch (e) {
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

  previewImage: function (e) {
    var objImageClick = e.currentTarget.id;
    var current = '';
;
    switch (objImageClick) {
      case 'imgYingYeZhiZhao':
        current = 'https://www.xiang-cloud.com' + this.data.yingyezhizhaoUrl;
        break;

      case 'imgDaoLuXuKe':
        current = 'https://www.xiang-cloud.com' + this.data.daoluxukeUrl;
        break;

      default:
        break;
    }

    wx.previewImage({
      current: current,
      urls: this.data.imgList
    })
  },
  photoFunc: function (e) {
    var objImageClick = e.currentTarget.id;

   

    var objView = this;

    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'], 
      sourceType: ['album', 'camera'], 
      success: function (res) {
        var tempFilePaths = res.tempFilePaths

        wx.uploadFile({
          url: 'https://www.xiang-cloud.com/Api/Shared/FileUpload.ashx',
          filePath: tempFilePaths[0].replace('.unknown','.jpg'),
          name: objImageClick,
          success: function (res) {
            var obj = JSON.parse(res.data);
            var cb = objView.data.imgList;
            var objImageUrl = obj.Url;
            cb.push(objImageUrl);
            var ocrUrl = '';

            switch (objImageClick) {
              case 'imgYingYeZhiZhao':
                objView.setData({
                  defaultYingYeZhiZhaoImage: tempFilePaths[0].replace('.unknown','.jpg'),
                  yingyezhizhaoUrl: objImageUrl,
                  imgList: cb
                })

                ocrUrl = 'https://www.xiang-cloud.com/Api/Mini/SignIn.ashx?act=OcrBusinessLicense';

                break;

              case 'imgDaoLuXuKe':
                objView.setData({
                  defaultDaoLuXuKeImage: tempFilePaths[0].replace('.unknown','.jpg'),
                  daoluxukeUrl: objImageUrl,
                  imgList: cb,
                  secondShow:false,
                })

                break;

              default:
                break;
            }

            if (ocrUrl == '')
              return;
              if (objImageClick == "imgDaoLuXuKe")
              return;
            wx.showLoading({
              title: '正在解析证件信息',
              mask: true
            })

            wx.request({
              url: ocrUrl,
              data: {
                path: objImageUrl
              },
              header: { 'content-type': 'application/x-www-form-urlencoded' },
              method: 'POST',
              success: function (res) {

                var rtn = JSON.parse(JSON.stringify(res));

                if (rtn == undefined || rtn == "")
                  return;

                var result = rtn.data;

                if (result == null || result == '') {
                  return;
                }

                try {
                  var valGongSiTaiTou = '';
                  var valDiZhi = '';
                  var valFaren = '';
                  var valYouXiaoQi = '';
                  var valXinYongDaiMa = '';

                  switch (objImageClick) {
                    case 'imgYingYeZhiZhao':

                      if (result.Name != undefined && result.Name != null && result.Name != "")
                      {
                        valGongSiTaiTou = result.Name;
                      }

                      if(result.Address != undefined && result.Address != null && result.Address != "")
                      {
                        valDiZhi = result.Address;
                      }

                      if(result.LegalPerson != undefined && result.LegalPerson != null && result.LegalPerson != "")
                      {
                        valFaren = result.LegalPerson;
                      }

                      if(result.ValidPeriod != undefined && result.ValidPeriod != null && result.ValidPeriod != "")
                      {
                        valYouXiaoQi = result.ValidPeriod;
                      }

                      if (result.SocialCreditCode != undefined && result.SocialCreditCode != null && result.SocialCreditCode != "")
                      {
                        valXinYongDaiMa = result.SocialCreditCode;
                      }

                      objView.setData({
                        gongsitaitouval: valGongSiTaiTou,
                        dizhival: valDiZhi,
                        xinyongdaimaval: valXinYongDaiMa,
                        secondShow:true,
                        firstShow:false
                      });

                      break;

                    default:
                      break;
                  }
                  
                }
                catch (e) {
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
          fail: function (e) {
            
          }
        })
      }
    })
  },

  radioChange: function (res) {
    //console.log(res);

    var thisView = this;
    //var idVal = thisView.data.arrayCompany[i].Id
    var idVal = res.detail.value;

    if (idVal == undefined || idVal == null || idVal == "")
      return;

    thisView.setData(
      {
        index: idVal,
        indexBizLocation:0
      }
    )

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

  searchViaKeyWord:function(e){
    
    var thisView = this;
    console.log(thisView.data.arrayCompany);
    console.log(thisView.data.keyValueCompanyName);

    if (thisView.data.keyValueCompanyName == null || thisView.data.keyValueCompanyName == "")
    {
      thisView.setData({
        modalHidden: false,
        errinfo: "请输入公司名称搜索"
      })
      return;
    }

    var arrItems = [];
    for(var i = 0;i<thisView.data.arrayCompany.length;i++){
      if (thisView.data.arrayCompany[i].Name.indexOf(thisView.data.keyValueCompanyName) != -1)
      {
        var objJson = {};
        objJson.Id = thisView.data.arrayCompany[i].Id;
        objJson.Name = thisView.data.arrayCompany[i].Name;

        console.log(objJson);
        arrItems.push(objJson);
      }
    }

    var arrList = JSON.parse(JSON.stringify(arrItems));

    console.log(arrList);

    thisView.setData({
      items: arrList
    })
  },


  resetModal: function () {
    this.setData({
      modalHidden: true,
      errinfo: null
    })
  },
  resetSuccessModal: function () {
    if (this.data.successinfo == "绑定成功（点击跳转至登录界面）")
    {
      wx.setStorageSync('myToken', '');
      wx.setStorageSync('myTelephone', '');
      wx.setStorageSync('myUserProfileType', '');
      wx.setStorageSync("mywechatuser", '');
      wx.setStorageSync("mywechatid", '');
      wx.setStorageSync("myHeadImg", '');
      wx.setStorageSync("BindCompanyName", '');
      wx.setStorageSync("BindCompanyLocationAddress", '');
      wx.clearStorage();

      wx.reLaunch({
        url: '../../packageA/pages/login/login',
      })
    }
    
    this.setData({
      modalSuccessHidden: true,
      successinfo: null
    })
  },

  createNewCompany:function(){
    var thisView = this;

    thisView.setData({
      hiddenNewCompanyView: false,
      hiddenBindingCompanyView: true,
      fontNewCompanyColor: '#a5040d',
      fontBindingCompany: '#ccc'
    })
  },

  bindCompany:function(){
    var thisView = this;

    thisView.setData({
      hiddenNewCompanyView:true,
      hiddenBindingCompanyView:false,
      fontNewCompanyColor: '#ccc',
      fontBindingCompany: '#a5040d'
    })
  },

  bindingCompany: function(){
    var thisView = this;

    if (thisView.data.parenttelphone == "") {
      wx.showToast({
        title: '无手机号',
        icon: 'none',
        duration: 1500
      })

      return;
    }

    var idCompanyVal = thisView.data.index;
    if (idCompanyVal == undefined || idCompanyVal == null || idCompanyVal == "")
    {
      wx.showToast({
        title: '请选择公司',
        icon: 'none',
        duration: 1500
      })

      return;
    }

    var idBizLocationVal = thisView.data.arrayBizLocation[thisView.data.indexBizLocation].Id;
    console.log(idBizLocationVal);

    var telephoneVal = thisView.data.parenttelphone;

    wx.showLoading({
      title: '正在绑定',
    })

    wx.request({
      url: 'https://www.xiang-cloud.com/Api/Mini/SignIn.ashx?act=BindCompany',
      data: {
        paraTelphone: telephoneVal,
        companyId: idCompanyVal,
        bizLocationId: idBizLocationVal
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
          thisView.setData({
            modalSuccessHidden: false,
            successinfo: '绑定成功（点击跳转至登录界面）'
          })

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
          }
          else if (typeof result === 'string' && result.match(/error/)) {
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

  changePickerBizLocation:function(e){
    var thisView = this;

    thisView.setData({
      indexBizLocation: e.detail.value
    })
  }
})