// PageA/pages/oceanShipping/oceanShipping.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    iscamera: false,
    flashSet: '',
    lightName: '../../../img/lightning-no.png',
    watermarkText: '无时间水印',
    watermarkValue: 2,
    watermarkVisible: false,
    waterTypes: [{
        label: '年月日',
        value: '0'
      },
      {
        label: '年月日时分秒',
        value: '1'
      },
      {
        label: '无时间水印',
        value: '2'
      }
    ],
    imgTemp: '',
    photographNum: 0,
    dataArray: [],
    directUpload: false,
    showMsg: false,
    MsgTitle: '',
    MsgText: '',
    MsgBtn: '',
    containerNo: '',
    showAgain: false,
    showPhoto: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var thisView = this;
    var flash = wx.getStorageSync('flashSet');
    var watermark = wx.getStorageSync('watermarkValue');
    var watermarkText = "无时间水印"
    if (flash == '') {
      flash = 'torch';
    }
    thisView.setData({
      flashSet: flash,
      lightName: flash == 'torch' ? '../../../img/lightning.png' : '../../../img/lightning-no.png'
    })

    if (watermark == 0) {
      watermarkText = "年月日";
    } else if (watermark == 1) {
      watermarkText = "年月日时分秒";
    } else if (watermark == 2) {
      watermarkText = "无时间水印";
    }
    thisView.setData({
      watermarkText: watermarkText,
      watermarkValue: watermark
    })
  },

  onPickerCancel() {
    var thisView = this;
    thisView.setData({
      watermarkVisible: false
    })
  },
  onPickerChange(e) {
    var thisView = this;
    const {
      key
    } = e.currentTarget.dataset;
    const {
      value,
      label
    } = e.detail;
    thisView.setData({
      watermarkVisible: false,
      watermarkValue: value,
      watermarkText: label,
    });
    wx.setStorageSync('watermarkValue', value);
  },
  cameBack() {
    var thisView = this;
    thisView.setData({
      iscamera: false
    })
  },
  changeWatermark() {
    var thisView = this;
    thisView.setData({
      watermarkVisible: true
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
  showCamera() {
    var thisView = this;
    thisView.setData({
      iscamera: true
    })
  },
  takeImg() {
    var thisView = this;
    var scanImgSource = '';
    const ctx = wx.createCameraContext()
    ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        wx.showLoading({
          title: '上传箱照...',
          mask: true
        })
        thisView.setData({
          iscamera: false
        })
        scanImgSource = res.tempImagePath;
        var dateonly = new Date();
        var dateInfo = '';
        if (thisView.data.watermarkValue == 0) {
          dateInfo = wx.getStorageSync('myTelephone').substring(7, 11) + '@' +
            (dateonly.getFullYear() + '-' + (dateonly.getMonth() + 1) + '-' + dateonly.getDate()) + 'LA';
        } else if (thisView.data.watermarkValue == 1) {
          dateInfo = wx.getStorageSync('myTelephone').substring(7, 11) + '@' +
            (dateonly.getFullYear() + '-' + (dateonly.getMonth() + 1) + '-' + dateonly.getDate() + " " + dateonly.getHours() + ":" + dateonly.getMinutes() + ":" + dateonly.getSeconds()) + 'LA';
        } else if (thisView.data.watermarkValue == 2) {
          dateInfo = wx.getStorageSync('myTelephone').substring(7, 11) + '@' + 'LA';
        }
        wx.uploadFile({
          url: 'https://www.xiang-cloud.com/Api/Shared/FileUpload.ashx',
          filePath: scanImgSource,
          name: '1',
          formData: {
            'dir': 'zxzp',
            'watermark': dateInfo
          },
          success(res) {
            var rtn = JSON.parse(res.data);
            thisView.setData({
              imgTemp: rtn.FileName
            })
            wx.hideLoading();
            thisView.getspecifieddata(rtn.FileName);
          },
          fail(res) {
            console.log(res);
          }
        })

      }
    })
  },
  closeMsg() {
    this.setData({
      showMsg: false
    });
  },
  getspecifieddata(filePath) {
    var thisView = this;
    var apiUrl = "https://www.xiang-cloud.com/Api/Mini/Index.ashx?act=OcrBoxPackingDoorPhoto";

    wx.showLoading({
      title: '正在识别箱照...',
      mask: true
    })

    wx.request({
      url: apiUrl,
      data: {
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
        if (thisView.data.photographNum == 2) {
          thisView.setData({
            directUpload: true
          })
          return
        }
        var result = rtn.data;
        if (result.ErrorDesc != null && result.ErrorDesc != "") {
          thisView.setData({
            showMsg: true,
            MsgTitle: '错误信息',
            MsgText: result.ErrorDesc,
            MsgBtn: {
              content: '确定',
              variant: 'base'
            },
            photographNum: thisView.data.photographNum + 1
          })
        } else {
          for (var i = 0; i < thisView.data.dataArray.length; i++) {
            if (thisView.data.dataArray[i]["packageNo"] == result.CntrNo) {
              thisView.setData({
                showMsg: true,
                MsgTitle: '错误信息',
                MsgText: '请勿重复识别相同箱号',
                MsgBtn: {
                  content: '确定',
                  variant: 'base'
                },
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
            dataArray: arrList,
            photographNum: 0
          })
          let sysres = wx.getSystemInfoSync();
          if (sysres.platform == 'ios') {
            wx.saveImageToPhotosAlbum({
              filePath: filePath,
              success: function (data) {
                wx.hideLoading()
                wx.showToast({
                  title: '保存成功',
                  icon: 'success',
                  duration: 2000
                })
              },
              fail: function (err) {
                if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny" || err.errMsg === "saveImageToPhotosAlbum:fail:auth denied") {
                  console.log("当初用户拒绝，再次发起授权")
                  wx.showModal({
                    title: '提示',
                    content: '需要您授权保存相册',
                    showCancel: false,
                    success: modalSuccess => {
                      wx.openSetting({
                        success(settingdata) {
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
                wx.hideLoading()
              }
            })
          }
          wx.setStorageSync('saveIdsArray', thisView.data.dataArray);

          wx.navigateTo({
            url: '../oceanPackagephoto/oceanPackagephoto?id=' + result.Id + '&packageNo=' + result.CntrNo +
              '&packageType=' + result.CntrSizeCode + result.CntrTypeCode + '&guandanhao=' + result.BillNo +
              '&liushuihao=' + result.BizNo + '&srcImg=' + filePath
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

  gotoTakePhotoDetail(e) {
    var thisView = this;
    var indexVal = ''
    if (e) {
      indexVal = e.currentTarget.id.substr(9, 10000);
    }

    for (var i = 0; i < thisView.data.dataArray.length; i++) {
      if (thisView.data.dataArray[i]["Id"] == indexVal) {
        wx.navigateTo({
          url: '../oceanPackagephoto/oceanPackagephoto?id=' + thisView.data.dataArray[i]["Id"] + '&packageNo=' + thisView.data.dataArray[i]["packageNo"] +
            '&packageType=' + thisView.data.dataArray[i]["packageType"] + '&guandanhao=' + thisView.data.dataArray[i]["guandanhao"] +
            '&liushuihao=' + thisView.data.dataArray[i]["liushuihao"] + '&srcImg=' + thisView.data.dataArray[i]["srcImg"]
        })
      }
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
    thisView.refreshData();
  },

  refreshData() {
    var thisView = this;
    var arrData = [];
    var storageSaveIds = wx.getStorageSync('saveIdsArray');
    var storageDate = '';
    var obj = {};
    for (var i = 0; i < storageSaveIds.length; i++) {
      if (storageSaveIds[i]["Id"] != undefined && storageSaveIds[i]["Id"] != null && storageSaveIds[i]["Id"] != '') {
        if (storageSaveIds[i]["createdDate"] == undefined || storageSaveIds[i]["createdDate"] == null || storageSaveIds[i]["createdDate"] == '') {
          storageDate = '1990-01-01';
        } else {
          storageDate = storageSaveIds[i]["createdDate"];
        }
      }
      if ((((storageSaveIds[i]["completeDate"] == undefined || storageSaveIds[i]["completeDate"] == null) ? '' : storageSaveIds[i]["completeDate"]) == '') ||
        Math.floor((new Date().getTime() - new Date(storageDate).getTime()) / (24 * 3600 * 1000)) > 7) {
        obj = {};
        obj.Id = storageSaveIds[i]["Id"];
        obj.srcImg = storageSaveIds[i]["srcImg"];
        obj.packageNo = storageSaveIds[i]["packageNo"];
        obj.packageType = storageSaveIds[i]["packageType"];
        obj.guandanhao = storageSaveIds[i]["guandanhao"];
        obj.liushuihao = storageSaveIds[i]["liushuihao"];
        obj.importImageTitle = '继续拍照';
        arrData.push(obj);
      } else {
        obj = {};
        obj.Id = storageSaveIds[i]["Id"];
        obj.srcImg = storageSaveIds[i]["srcImg"];
        obj.packageNo = storageSaveIds[i]["packageNo"];
        obj.packageType = storageSaveIds[i]["packageType"];
        obj.guandanhao = storageSaveIds[i]["guandanhao"];
        obj.liushuihao = storageSaveIds[i]["liushuihao"];
        obj.importImageTitle = '继续拍照';
        arrData.push(obj);
      }
    }
    var arrList = JSON.parse(JSON.stringify(arrData));
    thisView.setData({
      dataArray: arrList
    })
  },
  handleInputChange(e) {
    // 取出实时的变量值
    let value = e.detail.value;
    this.setData({
      containerNo: value
    })
  },
  cancelDirectUpload: function () {
    this.setData({
      imgTemp: '',
      containerNo: '',
      directUpload: false,
      photographNum: 0,
    })
  },
  confirmDirectUpload() {
    var thisView = this;
    if (this.data.containerNo == '') {
      wx.showToast({
        title: '请填写箱号',
        icon: 'none',
      })
      return
    }
    var apiUrl = "https://www.xiang-cloud.com/Api/Mini/Index.ashx?act=QueryBoxPackingDoorPhoto";
    wx.showLoading({
      title: 'upload...',
      mask: true
    })
    wx.request({
      url: apiUrl,
      data: {
        doorPhoto: thisView.data.imgTemp,
        cntrNo: thisView.data.containerNo,
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
        thisView.setData({
          imgTemp: '',
          containerNo: '',
          directUpload: false,
          photographNum: 0,
        })

        var result = rtn.data;
        if (result.ErrorDesc != null && result.ErrorDesc != "" && result.ErrorDesc.indexOf('不符合') == -1) {
          if (result.ErrorDesc == '无法识别的箱门照') {
            thisView.setData({
              directUpload: false,
              showAgain: true,
              MsgTitle: '错误信息',
              MsgText: result.ErrorDesc + '(Container No. not captured)'
            })
          } else {
            thisView.setData({
              directUpload: false,
              showAgain: true,
              MsgTitle: '错误信息',
              successinfo: result.ErrorDesc
            })
          }
        } else {
          if (result.ErrorDesc != null && result.ErrorDesc != "" && result.ErrorDesc.indexOf('不符合') > 0) {
            thisView.setData({
              directUpload: false,
              showPhoto: true,
              MsgTitle: '提示',
              successinfo: result.ErrorDesc
            })
          } else {
            thisView.data.photographNum = 0
            for (var i = 0; i < thisView.data.dataArray.length; i++) {
              if (thisView.data.dataArray[i]["packageNo"] == result.CntrNo) {
                thisView.setData({
                  modalSuccessHidden2: false,
                  modalTitle: '错误信息(error message)',
                  successinfo: '该箱号已经创建文档(The file has been created)'
                })

                return;
              }
            }

            var arrData = thisView.data.dataArray;

            var obj = {};
            debugger;
            obj.Id = result.Id;
            obj.srcImg =result.DoorPhoto;
            obj.packageNo = result.CntrNo;
            obj.packageType = result.CntrSizeCode + result.CntrTypeCode;
            obj.guandanhao = result.BillNo;
            obj.liushuihao = result.BizNo;
            obj.importImageTitle = '继续拍照';
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
            thisView.setData({
              dataArray: arrData
            })

            wx.setStorageSync('saveIdsArray', thisView.data.dataArray);

            wx.navigateTo({
              url: '../oceanPackagephoto/oceanPackagephoto?id=' + result.Id + '&packageNo=' + result.CntrNo +
                '&packageType=' + result.CntrSizeCode + result.CntrTypeCode + '&guandanhao=' + result.BillNo +
                '&liushuihao=' + result.BizNo + '&srcImg=' + result.DoorPhoto
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
  resetSuccessModal2() {
    var thisView = this;
    thisView.setData({
      showAgain: false
    })
  },
  cancelSuccessModal: function () {
    var thisView = this;
    thisView.setData({
      showAgain: false,
      directUpload: true,
      containerNo: ''
    })
  },
  btnshowPhoto() {
    var thisView = this;
    thisView.setData({
      iscamera: true
    })
  },
  cancelshowPhoto() {
    var thisView = this;
    thisView.setData({
      showPhoto: false
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