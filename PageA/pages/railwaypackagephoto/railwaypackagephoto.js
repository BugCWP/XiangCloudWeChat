  const innerAudioContext = wx.createInnerAudioContext()
  import {
    helper
  } from '../../../core/index';

  Page({
  
    /**
     * 页面的初始数据
     */
    data: {
      flash: false,
      halfPhotoList: [],
      hiddenShowShoudong: true,
      imageMode: 'aspectFill',
      srcImg1: '',
      packageNo: '',
      packageType: '',
      guandanhao: '',
      liushuihao: '',
      DoorPhotoBy:'',
      ResvPlateNo:'',
      id: '',
      currentImgIndex: 1,
      modalSuccessHidden: true,
      modalTitle: '识别结果',
      successinfo: '',
      hiddenConfirmButton: true,
      hiddenConfirm: true,
      hiddenBackUp: true,
      currentPackageIndex: 0,
      canvasWidth: 0,
      canvasHeight: 0,
      PendingCount: 0,
      TotalCount: 0,
      hiddenSecImage: true,
      hiddenNotice: true,
      hidden1stPage: true,
      hidden2ndPage: true,
      hiddenRules: true,
      imgmodalnameandplan: '',
      imgxiangkuangandphoto: '',
      hiddenModalNameAndPhoto: true,
      hiddenXiangKuangAndPhoto: true,
      imgBanGuanMenPhoto: '',
      imgGuanMenShiFengPhoto: '',
      hiddenBanGuanMenPhoto: true,
      hiddenGuanMenShiFengPhoto: true,
      currentImgIndex2nd: 5,
      currentImgIndex3rd: 9,
      currentImgIndex4th: 13,
      hiddenGoOnSaveBill: true,
      myNewErrorInfo: '',
  
      hiddenPhotoButtonPage: true,
      hiddenPhotoPage: true,
      templateImg: '../../img/102.png',
      widthval: 0,
      heightval: 0,
      hiddenShowTipKongXiang: true,
      hiddenShowTipBanZhuangXiang: true,
      hiddenShowTipManZhuangXiang: true,
      hiddenShowTipJiaGu: true,
      hiddenShowTipBanGuanMen: true,
      hiddenShowTipShiFeng: true,
      hiddenPhotoButtonPage1: true,
      hiddenPhotoButtonPage2: true,
      hiddenPhotoButtonPage3: true,
      hiddenPhotoButtonPage4: true,
      hiddenPhotoButtonPage5: true,
      companyCode: '',
      inputGuandan: '',
      iscb: false,
      isFront: false,
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
      ClearAllPhoto: true,
      KongXiangZhao: [],
      ManZhuangZhao: [],
      JiaGuZhao: [],
      FengZhiZhao: [],
      guidImg: [],
      img1: false,
      img2: false,
      img3: false,
      img4: false,
      img5: false,
      img6: false,
      img7: false,
      imgmain: true,
      img1Color: 'green',
      img2Color: 'green',
      img3Color: 'green',
      img4Color: 'green',
      img5Color: 'green',
      img6Color: 'green',
      img7Color: 'green',
      img8Color: 'green',
      showRemark: false,
      FenShu: [],
      documentId: '',
      changePackageVisible:false,
      changeDatas:[],
      lightName: '../../../img/lightning-no.png',
    },
    GetPhotoPackingRailAiResultByFile(files) {
      var thisView = this;
      var apiUrl = "https://www.xiang-cloud.com/Api/Mini/Rail.ashx?act=GetPhotoPackingRailAiResultByFile";
      var filesName = []
      for (var i = 0; i < files.length; i++) {
        filesName.push(files[i].replace("https://www.xiang-cloud.com/uploads/zxzp/", ""));
      }
      wx.showLoading({
        title: 'upload...',
        mask: true
      })
      wx.request({
        url: apiUrl,
        data: {
          fileNames: JSON.stringify(filesName)
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'Authorization': wx.getStorageSync('myToken')
        },
        method: 'POST',
        success: function (res) {
          thisView.setData({
            FenShu: res.data
          })
        },
        complete: function (res) {
          wx.hideLoading()
        },
      })
    },
    GetphotoPackingRailAiResult() {
      var thisView = this;
      var apiUrl = 'https://www.xiang-cloud.com/Api/Mini/Rail.ashx?act=GetphotoPackingRailAiResult';
      wx.showLoading({
        title: 'upload...',
        mask: true
      })
      wx.request({
        url: apiUrl,
        data: {
          id: thisView.data.id
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'Authorization': wx.getStorageSync('myToken')
        },
        method: 'POST',
        success: function (res) {
          if (res.data.HasError) {
            wx.showToast({
              title: res.data.ErrorDesc,
              icon: 'warning',
              duration: 1500
            })
          } else {
            if (res.data.DoorPhoto >= 7) {
              thisView.setData({
                img1Color: 'green'
              });
            } else if (res.data.DoorPhoto == 0) {
              thisView.setData({
                img1Color: 'red',
                showRemark: true
              });
            } else {
              thisView.setData({
                img1Color: 'yellow'
              });
            }
  
            if (res.data.EmptyPhotos >= 7) {
              thisView.setData({
                img2Color: 'green'
              });
            } else if (res.data.EmptyPhotos == 0) {
              thisView.setData({
                img2Color: 'red',
                showRemark: true
              });
            } else {
              thisView.setData({
                img2Color: 'yellow'
              });
            }
  
            if (res.data.HalfPhotos >= 7) {
              thisView.setData({
                img3Color: 'green'
              });
            } else if (res.data.HalfPhotos == 0) {
              thisView.setData({
                img3Color: 'red',
                showRemark: true
              });
            } else {
              thisView.setData({
                img3Color: 'yellow'
              });
            }
  
            if (res.data.FullPhotos >= 7) {
              thisView.setData({
                img4Color: 'green'
              });
            } else if (res.data.FullPhotos == 0) {
              thisView.setData({
                img4Color: 'red',
                showRemark: true
              });
            } else {
              thisView.setData({
                img4Color: 'yellow'
              });
            }
  
            if (res.data.StrengthenPhotos >= 7) {
              thisView.setData({
                img5Color: 'green'
              });
            } else {
              thisView.setData({
                img5Color: 'yellow'
              });
            }
  
            if (res.data.HalfCloseDoorPhoto >= 7) {
              thisView.setData({
                img6Color: 'green'
              });
            } else if (res.data.HalfCloseDoorPhoto == 0) {
              thisView.setData({
                img6Color: 'red',
                showRemark: true
              });
            } else {
              thisView.setData({
                img6Color: 'yellow'
              });
            }
  
            if (res.data.SealPhoto >= 7) {
              thisView.setData({
                img7Color: 'green'
              });
            } else if (res.data.SealPhoto == 0) {
              thisView.setData({
                img7Color: 'red',
                showRemark: true
              });
            } else {
              thisView.setData({
                img7Color: 'yellow'
              });
            }
            if (res.data.OtherPhotos >= 7) {
              thisView.setData({
                img8Color: 'green'
              });
            } else if (res.data.OtherPhotos == 0) {
              thisView.setData({
                img8Color: 'red',
                showRemark: true
              });
            } else {
              thisView.setData({
                img8Color: 'yellow'
              });
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
    changeImg1() {
      this.setData({
        img1: true,
        imgmain: false
      })
      this.GetPhotoPackingRailAiResultByFile(this.data.KongXiangZhao);
    },
    changeImg2() {
      this.setData({
        img2: true,
        imgmain: false
      })
      this.GetPhotoPackingRailAiResultByFile(this.data.halfPhotoList);
    },
    changeImg3() {
      this.setData({
        img3: true,
        imgmain: false
      })
      this.GetPhotoPackingRailAiResultByFile(this.data.ManZhuangZhao);
    },
    changeImg4() {
      this.setData({
        img4: true,
        imgmain: false
      })
      this.GetPhotoPackingRailAiResultByFile(this.data.JiaGuZhao);
    },
    changeImg5() {
      this.setData({
        img5: true,
        imgmain: false
      })
      this.GetPhotoPackingRailAiResultByFile(this.data.FengZhiZhao);
    },
    changeImg6() {
      this.setData({
        img6: true,
        imgmain: false
      })
      this.GetPhotoPackingRailAiResultByFile(this.data.imgBanGuanMenPhoto);
    },
    changeImg7() {
      this.setData({
        img7: true,
        imgmain: false
      })
      this.GetPhotoPackingRailAiResultByFile(this.data.imgGuanMenShiFengPhoto);
    },
    closeimg1() {
      this.setData({
        img1: false,
        imgmain: true
      })
    },
    closeimg2() {
      this.setData({
        img2: false,
        imgmain: true
      })
    },
    closeimg3() {
      this.setData({
        img3: false,
        imgmain: true
      })
    },
    closeimg4() {
      this.setData({
        img4: false,
        imgmain: true
      })
    },
    closeimg5() {
      this.setData({
        img5: false,
        imgmain: true
      })
    },
    closeimg6() {
      this.setData({
        img6: false,
        imgmain: true
      })
    },
    closeimg7() {
      this.setData({
        img7: false,
        imgmain: true
      })
    },
    ClearAllPhotos() {
      var thisView = this;
      var apiUrl = 'https://www.xiang-cloud.com/Api/Mini/Rail.ashx?act=ClearAllPhotos&id=' + thisView.data.id;
      wx.showLoading({
        title: 'upload...',
        mask: true
      })
      wx.request({
        url: apiUrl,
        data: {},
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'Authorization': wx.getStorageSync('myToken')
        },
        method: 'POST',
        success: function (res) {
          if (res.data.HasError) {
            thisView.setData({
              ClearAllPhoto: true
            })
            wx.showToast({
              title: res.data.ErrorDesc,
              icon: 'warning',
              duration: 1500
            })
          } else {
            wx.showToast({
              title: '清除所有照片成功！',
              icon: 'success',
              duration: 3000
            })
            thisView.setData({
              ClearAllPhoto: true
            })
            if (thisView.data.id) {
              thisView.loadPageData();
            }
            thisView.GetphotoPackingRailAiResult();
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
    closeClearAllPhotos() {
      this.setData({
        ClearAllPhoto: true
      })
    },
    showClearAllPhotos() {
      this.setData({
        ClearAllPhoto: false
      })
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
          title: '集装箱未拍摄！',
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
      wx.showLoading({
        title: 'upload...',
        mask: true
      })
      wx.request({
        url: apiUrl,
        data: {
          id: thisView.data.id,
          truckPic: thisView.data.truckPic,
          container1Pic: thisView.data.container1Pic,
          container2Pic: thisView.data.container2Pic,
          tailTruckPic: thisView.data.tailTruckPic
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'Authorization': wx.getStorageSync('myToken')
        },
        method: 'POST',
        success: function (res) {
          if (res.data.HasError) {
            wx.showToast({
              title: res.data.ErrorDesc,
              icon: 'warning',
              duration: 1500
            })
          } else {
            wx.showToast({
              title: "完成车辆进出拍摄成功！",
              icon: 'success',
              duration: 2500
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
  
    cbChange() {
      this.setData({
        iscb: !this.data.iscb
      })
    },
  
    bindscann() {
      var that = this
      wx.scanCode({
        onlyFromCamera: true,
        success(res) {
          console.log('条码', res.result)
          that.setData({
            guandanhao: res.result
          })
        }
      })
    },
  
    bindGuandan(e) {
      this.setData({
        inputGuandan: e.detail.value
      })
    },
  
    confirmGuanDan() {
      this.setData({
        hiddenShowShoudong: true,
        guandanhao: this.data.inputGuandan
      })
      this.setData({
        inputGuandan: '',
      })
    },
  
    showShoudong() {
      this.setData({
        hiddenShowShoudong: false
      })
    },
  
    showTipGuanMenShiFeng() {
      this.setData({
        hiddenShowTipShiFeng: false
      })
    },
  
    closeShowTipShiFeng() {
      this.setData({
        hiddenShowTipShiFeng: true
      })
    },
  
    showTipBanGuanMen() {
      this.setData({
        hiddenShowTipBanGuanMen: false
      })
    },
  
    closeShowTipBanGuanMen() {
      this.setData({
        hiddenShowTipBanGuanMen: true
      })
    },
  
    showTipJiaGu() {
      this.setData({
        hiddenShowTipJiaGu: false
      })
    },
  
    closeShowTipJiaGu() {
      this.setData({
        hiddenShowTipJiaGu: true
      })
    },
  
    showTipKongXiang() {
      this.setData({
        hiddenShowTipKongXiang: false
      })
    },
  
    closeShowTipKongXiang() {
      this.setData({
        hiddenShowTipKongXiang: true
      })
    },
  
    showTipManZhuangXiang() {
      this.setData({
        hiddenShowTipManZhuangXiang: false
      })
    },
  
    closeShowTipManZhuangXiang() {
      this.setData({
        hiddenShowTipManZhuangXiang: true
      })
    },
  
    showTipBanZhuangXiang() {
      this.setData({
        hiddenShowTipBanZhuangXiang: false
      })
    },
  
    closeShowTipBanZhuangXiang() {
      this.setData({
        hiddenShowTipBanZhuangXiang: true
      })
    },
  
    hiddenShowRules() {
      this.setData({
        hiddenRules: true,
        hiddenNotice: false,
        hidden1stPage: true,
        hidden2ndPage: true
      })
    },
  
    showRules() {
      this.setData({
        hiddenRules: false,
        hiddenNotice: true,
        hidden1stPage: true,
        hidden2ndPage: true
      })
    },
  
    hiddenNoticePage() {
      this.setData({
        hiddenNotice: true,
        hidden1stPage: false,
        hidden2ndPage: false
      })
      wx.setStorageSync('iscb', this.data.iscb)
    },
  
    resetSuccessModal: function () {
      this.setData({
        modalSuccessHidden: true,
        successinfo: ''
      })
    },
  
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      var thisView = this;
      var ischecked = true;
       ischecked = wx.getStorageSync('iscb');
      if (ischecked) {
        this.setData({
          hiddenNotice: true,
          hidden1stPage: false,
          hidden2ndPage: false
        })
      } else {
        this.setData({
          hiddenNotice: false,
          hidden1stPage: false,
          hidden2ndPage: false
        })
      }
  
      if (options != undefined && options != null && options != '') {
        thisView.setData({
          id: options.id,
          documentId: options.documentId
        })
  
        wx.getSystemInfo({
          success: (result) => {
  
            thisView.setData({
              widthval: result.windowWidth,
              heightval: result.windowHeight - 150
            })
  
          },
        })
      }
      wx.showLoading({
        title: 'upload...',
        mask: true
      })
      debugger;
      helper.httpRequest('Index', 'GetPermission')
        .then(x => {
          console.log(x);
          if (x.indexOf(172) >= 0 || x.indexOf(232) >= 0 || x.indexOf(250) >= 0 || x.indexOf(257) >= 0) {
            thisView.setData({
              isFront: true
            })
          }
          wx.hideLoading();
        });
    },
  
    onShow: function () {
      var thisView = this;
      if (thisView.data.flash) {
        thisView.setData({
          flash: false
        })
      } else {
        thisView.setData({
          halfPhotoList: []
        })
        if (thisView.data.id) {
          thisView.loadPageData();
        }
      }
      thisView.GetphotoPackingRailAiResult();
    },
  
    loadPageData() {
      var thisView = this;
  
      //通过ID获取箱照信息
      var apiUrl = "https://www.xiang-cloud.com/Api/Mini/Rail.ashx?act=GetBoxPackingDocument";
  
      if (thisView.data.id == undefined || thisView.data.id == null || thisView.data.id == '') {
        thisView.setData({
          modalSuccessHidden: false,
          modalTitle: '错误信息',
          successinfo: '未识别到箱门照信息，请确认箱照ID是否存在'
        })
        return;
      }
  
      wx.showLoading({
        title: '获取其他照片清单...',
        mask: true
      })
      wx.showLoading({
        title: 'upload...',
        mask: true
      })
      wx.request({
        url: apiUrl,
        data: {
          id: thisView.data.id
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'Authorization': wx.getStorageSync('myToken')
        },
        method: 'POST',
        success: function (res) {
  
          console.log(res);
          wx.hideLoading()
  
          var rtn = JSON.parse(JSON.stringify(res));
  
          if (rtn == undefined || rtn == "")
            return;
  
          var result = rtn.data;
          console.log('2222222');
          console.log(result);
  
          if (result.ErrorDesc != undefined && result.ErrorDesc != null && result.ErrorDesc != "") {
            thisView.setData({
              modalSuccessHidden: false,
              successinfo: result.ErrorDesc,
              modalTitle: '错误信息'
            })
          } else {
            helper.httpRequest('Rail', 'GetCompanyCode', {
                id: result.CompanyId
              })
              .then(x => {
                console.log('companyCode: ', x);
                thisView.companyCode = x || '';
              });
  
            thisView.setData({
              PendingCount: result.RealPalleCount == null ? 0 : result.RealPalleCount,
              TotalCount: result.MaxPalletCount == null ? 0 : result.MaxPalletCount,
              srcImg1: (result.DoorPhoto.indexOf('https://www.xiang-cloud.com/uploads/zxzp/') != -1) ? result.DoorPhoto : 'https://www.xiang-cloud.com/uploads/zxzp/' + result.DoorPhoto,
              packageNo: result.CntrNo,
              packageType: result.CntrSizeCode + result.CntrTypeCode,
              guandanhao: result.BillNo,
              liushuihao: result.BizNo,
              DoorPhotoBy: result.DoorPhotoBy,
              ResvPlateNo:result.ResvPlateNo,
              hiddenConfirmButton: true,
              hiddenBackUp: true,
              imgBanGuanMenPhoto: '',
              imgGuanMenShiFengPhoto: '',
              imgmodalnameandplan: '',
              imgxiangkuangandphoto: '',
              truckPic: result.TruckPic == null ? '' : result.TruckPic ,
              container1Pic: result.Container1Pic == null ? '' :result.Container1Pic,
              tailTruckPic: result.TailTruckPic == null ? '' :result.TailTruckPic
            })
  
  
  
            if (result.CompleteDate == undefined || result.CompleteDate == null || result.CompleteDate == '') {
              thisView.setData({
                hiddenConfirmButton: false
              })
            } else {
              thisView.setData({
                hiddenBackUp: false
              })
            }
  
            var myhalfCloseDoorPhoto = result.HalfCloseDoorPhoto;
            var mysealPhoto = result.SealPhoto;
            var mynamePlanPhoto = result.NamePlanPhoto;
            var mycertificatePhoto = result.CertificatePhoto;
  
            if (myhalfCloseDoorPhoto != undefined && myhalfCloseDoorPhoto != null && myhalfCloseDoorPhoto != '') {
              thisView.setData({
                imgBanGuanMenPhoto: myhalfCloseDoorPhoto.indexOf('https://www.xiang-cloud.com/uploads/zxzp/') != -1 ? myhalfCloseDoorPhoto : 'https://www.xiang-cloud.com/uploads/zxzp/' + myhalfCloseDoorPhoto
              })
            }
  
            if (mysealPhoto != undefined && mysealPhoto != null && mysealPhoto != '') {
              thisView.setData({
                imgGuanMenShiFengPhoto: mysealPhoto.indexOf('https://www.xiang-cloud.com/uploads/zxzp/') != -1 ? mysealPhoto : 'https://www.xiang-cloud.com/uploads/zxzp/' + mysealPhoto
              })
            }
  
            if (mynamePlanPhoto != undefined && mynamePlanPhoto != null && mynamePlanPhoto != '') {
              thisView.setData({
                imgmodalnameandplan: (mynamePlanPhoto.indexOf('https://www.xiang-cloud.com/uploads/zxzp/') != -1) ? mynamePlanPhoto : 'https://www.xiang-cloud.com/uploads/zxzp/' + mynamePlanPhoto,
                hiddenModalNameAndPhoto: false
              })
            }
  
            if (mycertificatePhoto != undefined && mycertificatePhoto != null && mycertificatePhoto != '') {
              thisView.setData({
                imgxiangkuangandphoto: (mycertificatePhoto.indexOf('https://www.xiang-cloud.com/uploads/zxzp/') != -1) ? mycertificatePhoto : 'https://www.xiang-cloud.com/uploads/zxzp/' + mycertificatePhoto,
                hiddenXiangKuangAndPhoto: false
              })
            }
  
            var arremptyPhotos = result.EmptyPhotos;
            var arrhalfPhotos = result.HalfPhotos;
            var arrfullPhotos = result.FullPhotos;
            var arrstrengthenPhotos = result.StrengthenPhotos;
            var qitaPhotos = result.OtherPhotos;
  
            if (qitaPhotos != undefined && qitaPhotos != null && qitaPhotos != '') {
              var qitaPhotosData = qitaPhotos.split(';');
              var qita = [];
              for (var i = 0; i < qitaPhotosData.length; i++) {
                qita.push((qitaPhotosData[i].indexOf('https://www.xiang-cloud.com/uploads/zxzp/') != -1) ? qitaPhotosData[i] : 'https://www.xiang-cloud.com/uploads/zxzp/' + qitaPhotosData[i]);
              }
              thisView.setData({
                FengZhiZhao: qita
              })
            }
  
            if (arrstrengthenPhotos != undefined && arrstrengthenPhotos != null && arrstrengthenPhotos != '') {
              var arrstrengthenPhotosData = arrstrengthenPhotos.split(';');
              var arrstreng = [];
              for (var i = 0; i < arrstrengthenPhotosData.length; i++) {
                arrstreng.push((arrstrengthenPhotosData[i].indexOf('https://www.xiang-cloud.com/uploads/zxzp/') != -1) ? arrstrengthenPhotosData[i] : 'https://www.xiang-cloud.com/uploads/zxzp/' + arrstrengthenPhotosData[i]);
              }
              thisView.setData({
                JiaGuZhao: arrstreng
              })
            }
            if (arrfullPhotos != undefined && arrfullPhotos != null && arrfullPhotos != '') {
              var arrfullPhotosData = arrfullPhotos.split(';');
              var arrfull = [];
              for (var i = 0; i < arrfullPhotosData.length; i++) {
                arrfull.push((arrfullPhotosData[i].indexOf('https://www.xiang-cloud.com/uploads/zxzp/') != -1) ? arrfullPhotosData[i] : 'https://www.xiang-cloud.com/uploads/zxzp/' + arrfullPhotosData[i]);
              }
              thisView.setData({
                ManZhuangZhao: arrfull
              })
            }
  
  
            if (arrhalfPhotos != undefined && arrhalfPhotos != null && arrhalfPhotos != '') {
              var arrhalfPhotosData = arrhalfPhotos.split(';');
              var arrhalf = [];
              for (var i = 0; i < arrhalfPhotosData.length; i++) {
                arrhalf.push((arrhalfPhotosData[i].indexOf('https://www.xiang-cloud.com/uploads/zxzp/') != -1) ? arrhalfPhotosData[i] : 'https://www.xiang-cloud.com/uploads/zxzp/' + arrhalfPhotosData[i])
              }
              thisView.setData({
                halfPhotoList: arrhalf
              })
            }
  
            if (arremptyPhotos != undefined && arremptyPhotos != null && arremptyPhotos != '') {
              var arremptyPhotosData = arremptyPhotos.split(';');
              var arrempty = [];
              for (var i = 0; i < arremptyPhotosData.length; i++) {
                arrempty.push((arremptyPhotosData[i].indexOf('https://www.xiang-cloud.com/uploads/zxzp/') != -1) ? arremptyPhotosData[i] : 'https://www.xiang-cloud.com/uploads/zxzp/' + arremptyPhotosData[i]);
              }
              thisView.setData({
                KongXiangZhao: arrempty
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
  
    takePhotoJiaGu() {
      var thisView = this;
      if (thisView.data.isFront)
        return;
      wx.navigateTo({
        url: '../railwaypackagestep/railwaypackagestep?selectIndex=3&id=' + thisView.data.id,
      })
      return
  
      thisView.setData({
        hiddenPhotoPage: false,
        hiddenPhotoButtonPage: true,
        hiddenPhotoButtonPage1: true,
        hiddenPhotoButtonPage2: true,
        hiddenPhotoButtonPage3: false,
        hidden1stPage: true,
        hidden2ndPage: true,
        templateImg: '../../img/jiagudi.png'
      })
    },
  
    closePhoto3: function () {
      var thisView = this;
  
      thisView.setData({
        hiddenPhotoPage: true,
        hiddenPhotoButtonPage: true,
        hiddenPhotoButtonPage1: true,
        hiddenPhotoButtonPage2: true,
        hiddenPhotoButtonPage3: true,
        hidden1stPage: false,
        hidden2ndPage: false
      })
    },
  
    takeBanGuanMenPhoto() {
      var thisView = this;
      if (thisView.data.isFront)
        return;
      wx.navigateTo({
        url: '../railwaypackagestep/railwaypackagestep?selectIndex=4&id=' + thisView.data.id,
      })
      return
  
      thisView.setData({
        hiddenPhotoPage: false,
        hiddenPhotoButtonPage: true,
        hiddenPhotoButtonPage1: true,
        hiddenPhotoButtonPage2: true,
        hiddenPhotoButtonPage3: true,
        hiddenPhotoButtonPage4: false,
        hidden1stPage: true,
        hidden2ndPage: true,
        templateImg: '../../img/halfclosedoor.png'
      })
    },
  
    closePhoto4() {
      var thisView = this;
  
      thisView.setData({
        hiddenPhotoPage: true,
        hiddenPhotoButtonPage: true,
        hiddenPhotoButtonPage1: true,
        hiddenPhotoButtonPage2: true,
        hiddenPhotoButtonPage3: true,
        hiddenPhotoButtonPage4: true,
        hidden1stPage: false,
        hidden2ndPage: false
      })
    },
  
    takeOtherPhoto() {
      var thisView = this;
      if (thisView.data.isFront)
        return;
      wx.navigateTo({
        url: '../railwaypackagestep/railwaypackagestep?selectIndex=6&id=' + thisView.data.id,
      })
      return
    },
  
  
    takeGuanMenShiFengPhoto() {
      var thisView = this;
      if (thisView.data.isFront)
        return;
      wx.navigateTo({
        url: '../railwaypackagestep/railwaypackagestep?selectIndex=5&id=' + thisView.data.id,
      })
      return
  
      thisView.setData({
        hiddenPhotoPage: false,
        hiddenPhotoButtonPage: true,
        hiddenPhotoButtonPage1: true,
        hiddenPhotoButtonPage2: true,
        hiddenPhotoButtonPage3: true,
        hiddenPhotoButtonPage4: true,
        hiddenPhotoButtonPage5: false,
        hidden1stPage: true,
        hidden2ndPage: true,
        templateImg: '../../img/shifeng.png'
      })
    },
  
    closePhoto5() {
      var thisView = this;
  
      thisView.setData({
        hiddenPhotoPage: true,
        hiddenPhotoButtonPage: true,
        hiddenPhotoButtonPage1: true,
        hiddenPhotoButtonPage2: true,
        hiddenPhotoButtonPage3: true,
        hiddenPhotoButtonPage4: true,
        hiddenPhotoButtonPage5: true,
        hidden1stPage: false,
        hidden2ndPage: false
      })
    },
  
    takeManZhuangPhoto() {
      var thisView = this;
      if (thisView.data.isFront)
        return;
      wx.navigateTo({
        url: '../railwaypackagestep/railwaypackagestep?selectIndex=2&id=' + thisView.data.id,
      })
      return
  
      thisView.setData({
        hiddenPhotoPage: false,
        hiddenPhotoButtonPage1: true,
        hiddenPhotoButtonPage: true,
        hiddenPhotoButtonPage2: false,
        hiddenPhotoButtonPage3: true,
        hidden1stPage: true,
        hidden2ndPage: true,
        templateImg: '../../img/102.png'
      })
    },
  
    closePhoto2: function () {
      var thisView = this;
  
      thisView.setData({
        hiddenPhotoPage: true,
        hiddenPhotoButtonPage2: true,
        hiddenPhotoButtonPage1: true,
        hiddenPhotoButtonPage: true,
        hiddenPhotoButtonPage3: true,
        hidden1stPage: false,
        hidden2ndPage: false
      })
    },
  
    takeBanZhuangPhoto() {
      var thisView = this;
      if (thisView.data.isFront)
        return;
      wx.navigateTo({
        url: '../railwaypackagestep/railwaypackagestep?selectIndex=1&id=' + thisView.data.id,
      })
      return
  
      thisView.setData({
        hiddenPhotoPage: false,
        hiddenPhotoButtonPage1: false,
        hiddenPhotoButtonPage: true,
        hiddenPhotoButtonPage2: true,
        hiddenPhotoButtonPage3: true,
        hidden1stPage: true,
        hidden2ndPage: true,
        templateImg: '../../img/102.png'
      })
    },
  
    closePhoto1: function () {
      var thisView = this;
  
      thisView.setData({
        hiddenPhotoPage: true,
        hiddenPhotoButtonPage1: true,
        hiddenPhotoButtonPage2: true,
        hiddenPhotoButtonPage: true,
        hiddenPhotoButtonPage3: true,
        hidden1stPage: false,
        hidden2ndPage: false
      })
    },
  
    takePhotoKongXiang() {
      debugger;
      var thisView = this;
      if (thisView.data.isFront)
        return;
      wx.navigateTo({
        url: '../railwaypackagestep/railwaypackagestep?selectIndex=0&id=' + thisView.data.id,
      })
      return
      thisView.setData({
        hiddenPhotoPage: false,
        hiddenPhotoButtonPage: false,
        hiddenPhotoButtonPage1: true,
        hiddenPhotoButtonPage2: true,
        hiddenPhotoButtonPage3: true,
        hidden1stPage: true,
        hidden2ndPage: true,
        templateImg: '../../img/102.png'
      })
    },
  
  
    closePhoto: function () {
      var thisView = this;
  
      thisView.setData({
        hiddenPhotoPage: true,
        hiddenPhotoButtonPage: true,
        hiddenPhotoButtonPage1: true,
        hiddenPhotoButtonPage2: true,
        hiddenPhotoButtonPage3: true,
        hidden1stPage: false,
        hidden2ndPage: false
      })
    },
  
    confirmPackagePhoto() {
      var thisView = this;
      console.log('?')
      if (thisView.data.KongXiangZhao.length == 0 || thisView.data.halfPhotoList.length == 0 || thisView.data.ManZhuangZhao.length == 0 || thisView.data.JiaGuZhao.length == 0 || thisView.data.imgBanGuanMenPhoto == '' || thisView.data.imgGuanMenShiFengPhoto == '') {
        console.log('??')
        wx.showModal({
          title: '提示',
          content: '你还有图片没有拍照，是否确定完成?',
          showCancel: true, //是否显示取消按钮
          cancelText: "取消", //默认是“取消”
          confirmText: "确定", //默认是“确定”
          confirmColor: '#a5040d', //确定文字的颜色
          success: function (res) {
            if (res.cancel) {
              //点击取消,默认隐藏弹框
            } else {
              thisView.confirmGoOn();
            }
          },
          fail: function (res) {}, //接口调用失败的回调函数
          complete: function (res) {}, //接口调用结束的回调函数（调用成功、失败都会执行）
        })
      } else {
        console.log('???')
        thisView.confirmGoOn();
      }
    },
  
    takePhoto() {
      var thisView = this;
      var imgSource = '';
  
      wx.chooseImage({
        sizeType: ['compressed'],
        sourceType: ['camera'],
        success: function (res) {
  
          imgSource = res.tempFilePaths[0].replace('.unknown', '.jpg');
  
          wx.showLoading({
            title: '上传照片...',
            mask: true
          })
  
          var dateonly = new Date();
          var dateInfo = thisView.companyCode + wx.getStorageSync('myTelephone').substring(7, 11) + '@' +
            (dateonly.getFullYear() + '-' + (dateonly.getMonth() + 1) + '-' + dateonly.getDate()) + 'LA';
  
          wx.uploadFile({
            url: 'https://www.xiang-cloud.com/Api/Shared/FileUpload.ashx',
            filePath: imgSource,
            name: thisView.data.KongXiangZhao.length.toString(),
            formData: {
              'dir': 'zxzp',
              'watermark': dateInfo
            },
            success: function (res) {
              var rtn = JSON.parse(res.data);
              var arr = thisView.data.KongXiangZhao;
              arr.push(rtn.FileName);
              thisView.setData({
                KongXiangZhao: arr
              });
              wx.hideLoading();
              thisView.doBoxPacking(false, false);
            },
            fail: function (res) {},
            complete: function (res) {}
          })
        },
      })
    },
  
    takePhoto1() {
      var thisView = this;
      var imgSource = '';
  
      wx.chooseImage({
        sizeType: ['compressed'],
        sourceType: ['camera'],
        success: function (res) {
  
          imgSource = res.tempFilePaths[0].replace('.unknown', '.jpg');
  
          wx.showLoading({
            title: '上传照片...',
            mask: true
          })
  
          var dateonly = new Date();
          var dateInfo = thisView.companyCode + wx.getStorageSync('myTelephone').substring(7, 11) + '@' +
            (dateonly.getFullYear() + '-' + (dateonly.getMonth() + 1) + '-' + dateonly.getDate()) + 'LA';
  
          wx.uploadFile({
            url: 'https://www.xiang-cloud.com/Api/Shared/FileUpload.ashx',
            filePath: imgSource,
            name: thisView.data.halfPhotoList.length.toString(),
            formData: {
              'dir': 'zxzp',
              'watermark': dateInfo
            },
            success: function (res) {
              var rtn = JSON.parse(res.data);
              var arr = thisView.data.halfPhotoList;
              arr.push(rtn.FileName);
              thisView.setData({
                halfPhotoList: arr
              })
              wx.hideLoading();
              thisView.doBoxPacking(false, false);
            },
            fail: function (res) {},
            complete: function (res) {}
          })
        },
      })
    },
  
    takePhoto2() {
      var thisView = this;
      var imgSource = '';
  
      wx.chooseImage({
        sizeType: ['compressed'],
        sourceType: ['camera'],
        success: function (res) {
  
          imgSource = res.tempFilePaths[0].replace('.unknown', '.jpg');
  
          wx.showLoading({
            title: '上传照片...',
            mask: true
          })
  
          var dateonly = new Date();
          var dateInfo = thisView.companyCode + wx.getStorageSync('myTelephone').substring(7, 11) + '@' +
            (dateonly.getFullYear() + '-' + (dateonly.getMonth() + 1) + '-' + dateonly.getDate()) + 'LA';
          //+ ' ' + dateonly.getHours() + ':' + dateonly.getMinutes() + ':' + dateonly.getSeconds()
  
          wx.uploadFile({
            url: 'https://www.xiang-cloud.com/Api/Shared/FileUpload.ashx',
            filePath: imgSource,
            name: thisView.data.ManZhuangZhao.length.toString(),
            formData: {
              'dir': 'zxzp',
              'watermark': dateInfo
            },
            success: function (res) {
              var rtn = JSON.parse(res.data);
              var arr = thisView.data.ManZhuangZhao;
              arr.push(rtn.FileName);
              thisView.setData({
                ManZhuangZhao: arr
              });
              wx.hideLoading();
              thisView.doBoxPacking(false, false);
            },
            fail: function (res) {},
            complete: function (res) {}
          })
        },
      })
    },
  
    takePhoto3() {
      var thisView = this;
      var imgSource = '';
  
      wx.chooseImage({
        sizeType: ['compressed'],
        sourceType: ['camera'],
        success: function (res) {
  
          imgSource = res.tempFilePaths[0].replace('.unknown', '.jpg');
  
          wx.showLoading({
            title: '上传照片...',
            mask: true
          })
  
          var dateonly = new Date();
          var dateInfo = thisView.companyCode + wx.getStorageSync('myTelephone').substring(7, 11) + '@' +
            (dateonly.getFullYear() + '-' + (dateonly.getMonth() + 1) + '-' + dateonly.getDate()) + 'LA';
          //+ ' ' + dateonly.getHours() + ':' + dateonly.getMinutes() + ':' + dateonly.getSeconds()
  
          wx.uploadFile({
            url: 'https://www.xiang-cloud.com/Api/Shared/FileUpload.ashx',
            filePath: imgSource,
            name: thisView.data.JiaGuZhao.length.toString(),
            formData: {
              'dir': 'zxzp',
              'watermark': dateInfo
            },
            success: function (res) {
              var rtn = JSON.parse(res.data);
              var arr = thisView.data.JiaGuZhao;
              arr.push(rtn.FileName);
              thisView.setData({
                JiaGuZhao: arr
              })
              wx.hideLoading();
              thisView.doBoxPacking(false, false);
            },
            fail: function (res) {},
            complete: function (res) {}
          })
        },
      })
    },
  
  
    takeModalNameAndPlanPhoto() {
      var thisView = this;
      var imgSource = '';
  
      wx.chooseImage({
        sizeType: ['original', 'compressed'],
        sourceType: ['camera'],
        success: function (res) {
          //for (var i = 0; i < res.tempFiles.length; i++) {
          imgSource = res.tempFilePaths[0].replace('.unknown', '.jpg');
  
          console.log(imgSource);
  
          var dateonly = new Date();
          var dateInfo = thisView.companyCode + wx.getStorageSync('myTelephone').substring(7, 11) + '@' +
            (dateonly.getFullYear() + '-' + (dateonly.getMonth() + 1) + '-' + dateonly.getDate()) + 'LA';
  
          wx.uploadFile({
            url: 'https://www.xiang-cloud.com/Api/Shared/FileUpload.ashx',
            filePath: imgSource,
            name: 'modalnameandplan',
            formData: {
              'dir': 'zxzp',
              'watermark': dateInfo
            },
            success(res) {
              var rtn = JSON.parse(res.data);
              thisView.setData({
                imgmodalnameandplan: rtn.FileName,
                hiddenModalNameAndPhoto: false
              });
  
              thisView.doBoxPacking(false, false);
            },
            fail(res) {
              console.log(res);
            }
          })
          //}
        },
      })
    },
  
    takeXiangKuangAndPhoto() {
      var thisView = this;
      var imgSource = '';
  
      wx.chooseImage({
        sizeType: ['original', 'compressed'],
        sourceType: ['camera'],
        success: function (res) {
          //for (var i = 0; i < res.tempFiles.length; i++) {
          imgSource = res.tempFilePaths[0].replace('.unknown', '.jpg');
  
          console.log(imgSource);
  
          var dateonly = new Date();
          var dateInfo = thisView.companyCode + wx.getStorageSync('myTelephone').substring(7, 11) + '@' +
            (dateonly.getFullYear() + '-' + (dateonly.getMonth() + 1) + '-' + dateonly.getDate()) + 'LA';
  
          wx.uploadFile({
            url: 'https://www.xiang-cloud.com/Api/Shared/FileUpload.ashx',
            filePath: imgSource,
            name: 'xiangkuangandphoto',
            formData: {
              'dir': 'zxzp',
              'watermark': dateInfo
            },
            success(res) {
              var rtn = JSON.parse(res.data);
              thisView.setData({
                imgxiangkuangandphoto: rtn.FileName,
                hiddenXiangKuangAndPhoto: false
              });
  
              thisView.doBoxPacking(false, false);
            },
            fail(res) {
              console.log(res);
            }
          })
          //}
        },
      })
    },
  
    doBoxPacking(validHalfCloseDoorPhoto, validSealPhoto) {
      var thisView = this;
  
      var apiUrl = "https://www.xiang-cloud.com/Api/Mini/Rail.ashx?act=DoBoxPacking";
  
      if (thisView.data.id == undefined || thisView.data.id == null || thisView.data.id == '') {
        thisView.setData({
          modalSuccessHidden: false,
          modalTitle: '错误信息',
          successinfo: '未识别到箱门照信息，不允许确认装箱完成'
        })
        return;
      }
  
      var emptyPhotos = thisView.data.KongXiangZhao.join(';');
      var halfPhotos = thisView.data.halfPhotoList.join(';');
      var fullPhotos = thisView.data.ManZhuangZhao.join(';');
      var strengthenPhotos = thisView.data.JiaGuZhao.join(';');
      var qitaPhotos = thisView.data.FengZhiZhao.join(';');
  
      var arrValQitaPhotos = qitaPhotos.split(';');
      var arrListQitaPhotos = qitaPhotos == '' ? null : JSON.stringify(arrValQitaPhotos);
  
      var arrValemptyPhotos = emptyPhotos.split(';');
      var arrListemptyPhotos = emptyPhotos == '' ? null : JSON.stringify(arrValemptyPhotos);
  
      var arrValhalfPhotos = halfPhotos.split(';');
      var arrListhalfPhotos = halfPhotos == '' ? null : JSON.stringify(arrValhalfPhotos);
  
      var arrValfullPhotos = fullPhotos.split(';');
      var arrListfullPhotos = fullPhotos == '' ? null : JSON.stringify(arrValfullPhotos);
  
      var arrValstrengthenPhotos = strengthenPhotos.split(';');
      var arrListstrengthenPhotos = strengthenPhotos == '' ? null : JSON.stringify(arrValstrengthenPhotos);
  
      wx.showLoading({
        title: '照片保存中...',
        mask: true
      })
  
      var jsonData = '';
  
      console.log(888)
      console.log(validHalfCloseDoorPhoto)
  
      if (validHalfCloseDoorPhoto || validSealPhoto) {
        jsonData = {
          id: thisView.data.id,
          emptyPhotos: arrListemptyPhotos,
          halfPhotos: arrListhalfPhotos,
          fullPhotos: arrListfullPhotos,
          strengthenPhotos: arrListstrengthenPhotos,
          otherPhotos: arrListQitaPhotos,
          halfCloseDoorPhoto: thisView.data.imgBanGuanMenPhoto,
          sealPhoto: thisView.data.imgGuanMenShiFengPhoto,
          namePlanPhoto: thisView.data.imgmodalnameandplan,
          certificatePhoto: thisView.data.imgxiangkuangandphoto,
          noValidHalfCloseDoorPhoto: true,
          noValidSealPhoto: true
        }
      } else {
        jsonData = {
          id: thisView.data.id,
          emptyPhotos: arrListemptyPhotos,
          halfPhotos: arrListhalfPhotos,
          fullPhotos: arrListfullPhotos,
          strengthenPhotos: arrListstrengthenPhotos,
          otherPhotos: arrListQitaPhotos,
          halfCloseDoorPhoto: thisView.data.imgBanGuanMenPhoto,
          sealPhoto: thisView.data.imgGuanMenShiFengPhoto,
          namePlanPhoto: thisView.data.imgmodalnameandplan,
          certificatePhoto: thisView.data.imgxiangkuangandphoto
        }
      }
      wx.showLoading({
        title: 'upload...',
        mask: true
      })
      wx.request({
        url: apiUrl,
        data: jsonData,
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'Authorization': wx.getStorageSync('myToken')
        },
        method: 'POST',
        success: function (res) {
  
          console.log(res);
          wx.hideLoading()
  
          var rtn = JSON.parse(JSON.stringify(res));
  
          if (rtn == undefined || rtn == "")
            return;
  
          var result = rtn.data;
  
          if (result.ErrorDesc != undefined && result.ErrorDesc != null && result.ErrorDesc != "") {
  
            var errTitle = '无法检测到箱号，请确认集装箱箱号，清晰准确!否则请取消后重拍';
  
            if (result.ErrorDesc == "此箱号与文档箱号不符" || result.ErrorDesc == "无法识别的箱门照")
              errTitle = result.ErrorDesc;
  
            thisView.setData({
              hiddenGoOnSaveBill: false,
              myNewErrorInfo: errTitle //result.ErrorDesc
            })
            return;
          } else {
  
            wx.showToast({
              title: '成功',
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
  
    confirmGoOn() {
      var thisView = this;
      thisView.setData({
        hiddenConfirm: true
      })
  
      var apiUrl = "https://www.xiang-cloud.com/Api/Mini/Rail.ashx?act=CompleteBoxPacking";
  
      if (thisView.data.id == undefined || thisView.data.id == null || thisView.data.id == '') {
        thisView.setData({
          modalSuccessHidden: false,
          modalTitle: '错误信息',
          successinfo: '未识别到箱门照信息，不允许确认装箱完成'
        })
        return;
      }
  
      var emptyPhotos = thisView.data.KongXiangZhao.join(';');
      var halfPhotos = thisView.data.halfPhotoList.join(';');
      var fullPhotos = thisView.data.ManZhuangZhao.join(';');
      var strengthenPhotos = thisView.data.JiaGuZhao.join(';');
  
      var arrValemptyPhotos = emptyPhotos.split(';');
      var arrListemptyPhotos = emptyPhotos == '' ? null : JSON.stringify(arrValemptyPhotos);
  
      var arrValhalfPhotos = halfPhotos.split(';');
      var arrListhalfPhotos = halfPhotos == '' ? null : JSON.stringify(arrValhalfPhotos);
  
      var arrValfullPhotos = fullPhotos.split(';');
      var arrListfullPhotos = fullPhotos == '' ? null : JSON.stringify(arrValfullPhotos);
  
      var arrValstrengthenPhotos = strengthenPhotos.split(';');
      var arrListstrengthenPhotos = strengthenPhotos == '' ? null : JSON.stringify(arrValstrengthenPhotos);
      wx.showLoading({
        title: '确认装箱完成中...',
        mask: true
      })
      wx.request({
        url: apiUrl,
        data: {
          id: thisView.data.id,
          billNo: thisView.data.guandanhao,
          emptyPhotos: arrListemptyPhotos,
          halfPhotos: arrListhalfPhotos,
          fullPhotos: arrListfullPhotos,
          strengthenPhotos: arrListstrengthenPhotos,
          halfCloseDoorPhoto: thisView.data.imgBanGuanMenPhoto,
          sealPhoto: thisView.data.imgGuanMenShiFengPhoto,
          namePlanPhoto: thisView.data.imgmodalnameandplan,
          certificatePhoto: thisView.data.imgxiangkuangandphoto,
          noValidHalfCloseDoorPhoto: true,
          noValidSealPhoto: true
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'Authorization': wx.getStorageSync('myToken')
        },
        method: 'POST',
        success: function (res) {
  
          console.log(res);
          wx.hideLoading()
  
          var rtn = JSON.parse(JSON.stringify(res));
  
          if (rtn == undefined || rtn == "")
            return;
  
          var result = rtn.data;
  
          if (result.ErrorDesc != undefined && result.ErrorDesc != null && result.ErrorDesc != "") {
            thisView.setData({
              modalSuccessHidden: false,
              successinfo: result.ErrorDesc,
              modalTitle: '错误信息'
            })
          } else {
            thisView.setData({
              hiddenConfirmButton: true,
              hiddenBackUp: false
            })
  
            wx.showToast({
              title: '成功(success)',
              icon: 'success',
              duration: 3000
            })
  
            var storageSaveIds = wx.getStorageSync('saveIdsArrayRailwayPackage');
            var arrData = [];
            var obj = {};
  
            for (var i = 0; i < storageSaveIds.length; i++) {
              if (storageSaveIds[i]["Id"] != undefined && storageSaveIds[i]["Id"] != null && storageSaveIds[i]["Id"] != '') {
                if (storageSaveIds[i]["Id"] != thisView.data.id) {
                  obj = {};
                  obj.Id = storageSaveIds[i]["Id"];
                  obj.srcImg = (storageSaveIds[i]["srcImg"].indexOf('wxfile://') < 0) ? storageSaveIds[i]["srcImg"] :
                    'https://www.xiang-cloud.com/uploads/zxzp/' + storageSaveIds[i]["srcImg"].substr(9, 10000);
                  obj.packageNo = storageSaveIds[i]["packageNo"];
                  obj.packageType = storageSaveIds[i]["packageType"];
                  obj.guandanhao = storageSaveIds[i]["guandanhao"];
                  obj.liushuihao = storageSaveIds[i]["liushuihao"];
                  obj.importImageTitle = storageSaveIds[i]["importImageTitle"];
                  obj.completeDate = storageSaveIds[i]["completeDate"]; //nowToday.getFullYear() + '.' + nowToday.getMonth() + '.' + nowToday.getDate();
                  obj.createdDate = storageSaveIds[i]["createdDate"];
                  arrData.push(obj);
                }
              }
            }
  
            var arrList = JSON.parse(JSON.stringify(arrData));
            wx.setStorageSync('saveIdsArrayRailwayPackage', arrList);
            let pages = getCurrentPages();
            let prevPage = pages[pages.length - 2]; //上一个页面
            //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
            prevPage.setData({
                documentId: thisView.data.documentId,
                JiaoYan:true
            })
            wx.navigateBack({
              delta: 1
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
  
    cancelHiddenModal() {
      var thisView = this;
      thisView.setData({
        hiddenConfirm: true
      })
    },
    changePackageCancel() {
      var thisView = this;
      thisView.setData({
        changePackageVisible: false,
      })
    },
    onchange() {
      debugger;
      var thisView = this;
      var storageSaveIds = wx.getStorageSync('saveIdsArrayRailwayPackage');
      var arrData = [];
      for (var i = 0; i < storageSaveIds.length; i++) {
        if (thisView.data.packageNo != storageSaveIds[i]["packageNo"] && storageSaveIds[i]["packageNo"] != '') {
          arrData.push({
            label: storageSaveIds[i]["packageNo"],
            value: storageSaveIds[i]["Id"]
          });
        }
      }
      thisView.setData({
        changePackageVisible: true,
        changeDatas: arrData
      })
    },
    changePackage(e) {
      var thisView = this;
      const {
        key
      } = e.currentTarget.dataset;
      const {
        value,
        label
      } = e.detail;
      thisView.setData({
        changePackageVisible: false,
        id: value
      });
      thisView.loadPageData();
    },
  
    gotobarcodelist() {
      var thisView = this;
  
      wx.navigateTo({
        url: '../barcodelist/barcodelist?id=' + thisView.data.id + '&packageNo=' + thisView.data.packageNo +
          '&packageType=' + thisView.data.packageType,
      })
    },
  
    audioSuccess() {
      innerAudioContext.src = "http://www.xiang-cloud.com:8099/voice/ok.mp3";
      innerAudioContext.autoplay = true;
      innerAudioContext.play();
    },
  
    audioFail() {
      innerAudioContext.src = "http://www.xiang-cloud.com:8099/voice/error.mp3";
      innerAudioContext.autoplay = true;
      innerAudioContext.play();
    },
  
    audioFailDuplicate() {
      innerAudioContext.src = "http://www.xiang-cloud.com:8099/voice/duplicate.mp3";
      innerAudioContext.autoplay = true;
      innerAudioContext.play();
    },
  
    audioAllComplete() {
  
    },
  
    continueSaveBill() {
      this.doBoxPacking(true, true);
  
      this.setData({
        hiddenGoOnSaveBill: true,
        myNewErrorInfo: ''
      })
    },
  
    cancelSaveBill() {
      this.setData({
        hiddenGoOnSaveBill: true,
        myNewErrorInfo: ''
      })
    },
  
    scanmybarcode() {
      var thisView = this;
  
      if (thisView.data.id == undefined || thisView.data.id == null || thisView.data.id == '') {
        thisView.setData({
          modalSuccessHidden: false,
          modalTitle: '错误信息',
          successinfo: '未识别到箱门照信息，不允许扫码'
        })
        return;
      }
  
      wx.scanCode({
        onlyFromCamera: true,
        scanType: ['barCode', 'qrCode', 'datamatrix', 'pdf417'],
        success: function (res) {
          if (res.errMsg == "scanCode:ok") {
            wx.showLoading({
              title: '扫码识别中...',
              mask: true
            })
  
            var scanResult = res.result;
  
            wx.request({
              url: "https://www.xiang-cloud.com/Api/Mini/Rail.ashx?act=ScanBarCode",
              data: {
                id: thisView.data.id,
                barCode: scanResult
              },
              header: {
                'content-type': 'application/x-www-form-urlencoded',
                'Authorization': wx.getStorageSync('myToken')
              },
              method: 'POST',
              success: function (ee) {
  
                wx.hideLoading()
  
                console.log(ee);
  
                var rtn = JSON.parse(JSON.stringify(ee));
  
                if (rtn == undefined || rtn == "")
                  return;
  
                var result = rtn.data;
  
                if (result.HasError) {
                  thisView.setData({
                    modalSuccessHidden: false,
                    modalTitle: '错误信息',
                    successinfo: result.ErrorDesc
                  })
  
                  if (result.ErrorDesc.indexOf('重复扫描') != -1) {
                    thisView.audioFailDuplicate();
                  } else {
                    thisView.audioFail();
                  }
  
                  return;
                }
  
                thisView.loadPageData();
                thisView.audioSuccess();
              },
              fail: function (eq) {
                wx.hideLoading()
              },
              complete: function (e3) {
                wx.hideLoading()
              },
            })
          }
        }
      })
    }
  })