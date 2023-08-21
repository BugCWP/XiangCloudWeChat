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
        photographNum:0
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
            wx.setStorageSync('flashSet', 'torch');
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
                directUpload: false
              })
              return
            }
            var result = rtn.data;
    
            if (result.ErrorDesc != null && result.ErrorDesc != "") {
              thisView.setData({
                modalSuccessHidden: false,
                successinfo: result.ErrorDesc,
                photographNum: thisView.data.photographNum + 1
              })
    
              if (result.ErrorDesc.indexOf('未找到相关数据') < 0) {
                thisView.setData({
                  failRecords: thisView.data.failRecords + 1
                })
              }
    
              // if (thisView.data.failRecords == 3) {
              //   thisView.scanBarcodeAndUploadImage(filePath);
    
              // }
            } else {
              for (var i = 0; i < thisView.data.dataArray.length; i++) {
                if (thisView.data.dataArray[i]["packageNo"] == result.CntrNo) {
                  thisView.setData({
                    modalSuccessHidden: false,
                    modalTitle: '错误信息',
                    successinfo: '请勿重复识别相同箱号'
                  })
    
                  return;
                }
              }
    
              debugger
    
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
                failRecords: 0
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
              wx.setStorageSync('saveIdsArray', thisView.data.dataArray);
    
              wx.navigateTo({
                url: '../packagephoto/packagephoto?id=' + result.Id + '&packageNo=' + result.CntrNo +
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