// pages/railwayImport/railwayImport.js
import {
    helper
  } from '../../../core/index';

  Page({
  
    /**
     * 页面的初始数据
     */
    data: {
      address: {},
      PortName: '',
      BillNo: '',
      CntrNo: '',
      CntrSizeCode: '',
      Lng: 0,
      Lat: 0,
      addressName: '',
      covers: [{
        latitude: 0, // 定位图标所在的位置(北京天安门)
        longitude: 0,
      }],
      remarkNo: true,
      showGetPhoneNumberBtn: false,
      thisId: 0,
      emptyImageBanFengMenImg: '../../img/imagept1.png',
      iscamera: false,
      flashSet: 'off',
      carphotonum: 0,
      flashArr: [{
        num: 'torch',
        value: '打开',
        checked: true
      }, {
        num: 'off',
        value: '关闭',
        checked: false
      }],
      truckPic: '',
      container1Pic: '',
      container2Pic: '',
      tailTruckPic: '',
      Id: 0,
      flash: false,
      isFront: false
    },
    takePhotoCar() {
      this.setData({
        iscamera: true,
        carphotonum: 1
      })
    },
    takePhotoCar2() {
      this.setData({
        iscamera: true,
        carphotonum: 2
      })
    },
    takePhotoCar3() {
      this.setData({
        iscamera: true,
        carphotonum: 3
      })
    },
    takePhotoCar4() {
      this.setData({
        iscamera: true,
        carphotonum: 4
      })
    },
    closeCarPhoto() {
      this.setData({
        iscamera: false,
      })
    },
    finishCar() {
      if (this.data.truckPic == '') {
        wx.showToast({
          title: '集卡车头未拍摄！',
          icon: 'warning',
          duration: 1500
        })
        return;
      }
      if (this.data.container1Pic == '') {
        wx.showToast({
          title: '集装箱1未拍摄！',
          icon: 'warning',
          duration: 1500
        })
        return;
      }
      if (this.data.tailTruckPic == '') {
        wx.showToast({
          title: '集卡车尾未拍摄！',
          icon: 'warning',
          duration: 1500
        })
        return;
      }
      this.SaveCar();
    },
    SaveCar() {
      var thisView = this;
      var apiUrl = 'https://www.xiang-cloud.com/Api/Mini/Rail.ashx?act=LogBoxPackingRailVehiclePhoto';
      wx.request({
        url: apiUrl,
        data: {
          id: thisView.data.Id,
          truckPic: thisView.data.truckPic,
          container1Pic: thisView.data.container1Pic,
          container2Pic: thisView.data.container2Pic,
          tailTruckPic: thisView.data.tailTruckPic,
          type: 'in'
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
            wx.showToast({
              title: "完成车辆进出拍摄成功！",
              icon: 'success',
              duration: 3000
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
    takeCarPhoto() {
      var thisView = this;
      var imgSource = '';
      const ctx = wx.createCameraContext()
      ctx.takePhoto({
        quality: 'high',
        success: (res) => {
  
          wx.showLoading({
            title: '上传箱照...',
            mask: true
          })
  
          thisView.setData({
            iscamera: false,
          })
  
          imgSource = res.tempImagePath;
          var dateonly = new Date();
          var dateInfo = wx.getStorageSync('myTelephone').substring(7, 11) + '@' +
            (dateonly.getFullYear() + '-' + (dateonly.getMonth() + 1) + '-' + dateonly.getDate()) + 'LA';
          wx.uploadFile({
            url: 'https://www.xiang-cloud.com/Api/Shared/FileUpload.ashx',
            filePath: imgSource,
            name: '1',
            formData: {
              'dir': 'zxzp',
              'watermark': dateInfo
            },
            success(res) {
              var rtn = JSON.parse(res.data);
              console.log(rtn.FileName)
  
              //thisView.ocrImg(rtn.FileName, scanImgSource)
              wx.hideLoading()
              if (thisView.data.carphotonum == 1) {
                thisView.setData({
                  truckPic: rtn.FileName
                });
              }
              if (thisView.data.carphotonum == 2) {
                thisView.setData({
                  container1Pic: rtn.FileName
                });
              }
              if (thisView.data.carphotonum == 3) {
                thisView.setData({
                  container2Pic: rtn.FileName
                });
              }
              if (thisView.data.carphotonum == 4) {
                thisView.setData({
                  tailTruckPic: rtn.FileName
                });
              }
            },
            fail(res) {
              console.log(res);
            }
          })
  
        }
      })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      debugger;
      var that = this;
      var key = 'N7ABZ-ZXXEF-UBZJB-N4IOA-7LNAV-66BNQ';
      //获取扫码携带参数
      let scene = decodeURIComponent(options.scene).split(',');
      //let thisId = scene[2];
      that.setData({
        thisId: scene[2]
      });
      if (!wx.getStorageSync('myToken')) { //事先未登录
        this.setData({
          showGetPhoneNumberBtn: true
        });
        return;
      }
      that.getDetailData();
      helper.httpRequest('Index', 'GetPermission')
      .then(x => {
        console.log(x);
        if (x.indexOf(172) >= 0 || x.indexOf(232) >= 0 || x.indexOf(250) >= 0 || x.indexOf(257) >= 0) {
          that.setData({
            isFront: true
          })
        }
      });
    },
  
    getDetailData() {
      var that = this;
      wx.getLocation({
        type: "wgs84",
        success(res) {
          that.setData({
            address: res
          });
          wx.request({
            url: 'https://www.xiang-cloud.com/Api/Mini/Rail.ashx?act=GetPhotoPackingRailIn',
            data: {
              id: that.data.thisId,
              latitude: that.data.address.latitude,
              longitude: that.data.address.longitude
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded',
              'Authorization': wx.getStorageSync('myToken')
            },
            method: 'POST',
            success: function (res) {
              var rtn = JSON.parse(JSON.stringify(res));
              if (rtn.data.HasError) {
                wx.showModal({
                  title: '提示',
                  content: '二维码内的参数id不正确，请确认后重新扫码',
                  success: function (res) {
                    if (res.confirm) { //这里是点击了确定以后
                      wx.navigateBack({
                        delta: -1
                      })
                    } else { //这里是点击了取消以后
  
                    }
                  }
                })
              }
              that.setData({
                PortName: rtn.data.PortName,
                BillNo: rtn.data.BillNo,
                CntrNo: rtn.data.CntrNo,
                CntrSizeCode: rtn.data.CntrSizeCode,
                Lat: '31.337681',
                Lng: '120.552742',
                covers: [{
                  latitude: '31.337681',
                  longitude: '120.552742',
                }],
                Id: rtn.data.Id,
                truckPic: rtn.data.TruckPic == null ? '' : ((rtn.data.TruckPic.indexOf('https://www.xiang-cloud.com/uploads/zxzp/') != -1) ? rtn.data.TruckPic : 'https://www.xiang-cloud.com/uploads/zxzp/' + rtn.data.TruckPic),
                container1Pic: rtn.data.Container1Pic == null ? '' : ((rtn.data.Container1Pic.indexOf('https://www.xiang-cloud.com/uploads/zxzp/') != -1) ? rtn.data.Container1Pic : 'https://www.xiang-cloud.com/uploads/zxzp/' + rtn.data.Container1Pic),
                tailTruckPic: rtn.data.TailTruckPic == null ? '' : ((rtn.data.TailTruckPic.indexOf('https://www.xiang-cloud.com/uploads/zxzp/') != -1) ? rtn.data.TailTruckPic : 'https://www.xiang-cloud.com/uploads/zxzp/' + rtn.data.TailTruckPic)
              });
              if (rtn.data.Remark != null && rtn.data.Remark.indexOf("太仓") != -1) {
                wx.setNavigationBarTitle({
                  title: '太仓提箱',
                });
                that.setData({
                  Lat: '31.638023',
                  Lng: '121.193769',
                  covers: [{
                    latitude: '31.638023',
                    longitude: '121.193769',
                  }],
                  addressName: '太仓中集冷藏物流装备有限公司东50米(浮浏线北)',
                  remarkNo: false
                });
              } else {
                that.getCity('120.552742', '31.337681');
              }
            },
            fail: function (res) {
              wx.hideLoading()
            },
            complete: function (res) {
              wx.hideLoading()
            },
          })
          console.log(res)
        }
      })
    },
    nav: function () {
      wx.openLocation({
        latitude: this.data.Lat * 1, //维度
        longitude: this.data.Lng * 1, //经度
        name: this.data.addressName, //目的地定位名称
        scale: 15, //缩放比例
        address: this.data.addressName //导航详细地址
      })
    },
    bigimg: function (event) {
      console.log(event)
      var imglist = []
      var src = event.currentTarget.dataset.src;
      imglist.push(src)
      console.log(event)
      wx.previewImage({
        current: src,
        urls: imglist
      })
      this.setData({
        flash: true
      })
  
    },
    getCity(Lng, Lat) {
      var that = this;
      var mykey = 'N7ABZ-ZXXEF-UBZJB-N4IOA-7LNAV-66BNQ';
      wx.request({
        url: 'https://apis.map.qq.com/ws/geocoder/v1',
        data: {
          key: mykey,
          location: (Lat + "," + Lng)
        },
        success: res => {
          var rtn = JSON.parse(JSON.stringify(res));
          that.setData({
            addressName: rtn.data.result.address
          });
        }
      })
  
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
  
  
    },
  
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
  
    },
  
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
  
    },
  
    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
  
    },
  
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
  
    },
  
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
  
    },
  
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
  
    },
    getPhoneNumber(e) {
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
          this.getDetailData();
        });
    },
  })