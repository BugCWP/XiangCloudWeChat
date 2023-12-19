// pages/railwaypackagestep/railwaypackagestep.js
import {
  $wuxActionSheet
} from '../../../lib/index'
import {
  $wuxDialog
} from '../../../lib/index'

const innerAudioContext = wx.createInnerAudioContext()
Page({

  data: {
    comID: '',
    flashFlag: false,
    halfPhotoList: [],
    imgSourceTemp: '',
    cameraIndex: 0,
    flashSet: 'off',
    flashArr: [{
      num: 'torch',
      value: '打开',
      checked: true
    }, {
      num: 'off',
      value: '关闭',
      checked: false
    }],
    slectIndex: 0,

    changeArray: [{
      status: 0,
      name: '空箱照'
    }, {
      status: 0,
      name: '半装照片'
    }, {
      status: 0,
      name: '满装照片'
    }, {
      status: 0,
      name: '加固照片'
    }, {
      status: 0,
      name: '半关门照片'
    }, {
      status: 0,
      name: '关门照'
    }, {
      status: 0,
      name: '施封照'
    }],
    slectArray: [{
        selected: true
      },
      {
        selected: false
      },
      {
        selected: false
      },
      {
        selected: false
      },
      {
        selected: false
      },
      {
        selected: false
      }, {
        selected: false
      }
    ],

    //上个页面复制过来未整理
    imageMode: 'aspectFill',
    srcImg2: '../../../img/photo-camera.png',
    srcImgAdd: '../../../img/Add1.png',
    emptyImageBanFengMenImg: '',
    emptyImageFengZhiImg: '',
    emptyImageFengZhiImg2: '',
    imgBackUp: '../../../img/backup.png',
    imgexchange: '../../../img/exchange.png',
    imgTakePhoto: '../../../img/takemyphoto.png',
    imgPackagePhotos: '../../../img/packagephotos.png',
    imgSingalPhoto: '../../../img/singalphoto.png',
    imgScanBarcode: '../../../img/scanbarcode.png',
    packageNo: '',
    packageType: '',
    guandanhao: '',
    liushuihao: '',
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
    hidden1stPage: false,
    hidden2ndPage: false,
    hiddenRules: true,
    imgmodalnameandplan: '',
    imgxiangkuangandphoto: '',
    hiddenModalNameAndPhoto: true,
    hiddenXiangKuangAndPhoto: true,
    imgBanGuanMenPhoto: '',
    imgGuanMenShiFengPhoto: '',
    imgMingPaiPhoto: '',
    hiddenBanGuanMenPhoto: true,
    hiddenGuanMenShiFengPhoto: true,
    currentImgIndex2nd: 5,
    currentImgIndex3rd: 9,
    currentImgIndex4th: 13,
    currentImgIndexOther: 17,
    hiddenGoOnSaveBill: true,
    myNewErrorInfo: '',

    hiddenPhotoButtonPage: true,
    hiddenPhotoPage: true,
    templateImg: '../../../img/102.png',
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
    hiddenPhotoButtonPage6: true,
    hiddenPhotoButtonPage7: true,

    isshowimg1: false,
    isshowimg2: false,
    isshowimg3: false,
    isshowimg4: false,
    isshowimg5: false,
    isshowimg6: false,
    isshowimg7: false,

    KongXiangZhao: [],
    ManZhuangZhao: [],
    JiaGuZhao: [],
    FengZhiZhao: [],
    FenShu: [],
    YanZheng: '',
    photoNum: -1,
    bigPhotos: [],
    photoType: ''
  },
  GetPhotoPackingRailAiResultByFile() {
    var thisView = this;
    var files = [];
    switch (thisView.data.slectIndex) {
      case '0':
        files = thisView.data.KongXiangZhao;
        break;
      case '1':
        files = thisView.data.halfPhotoList;
        break;
      case '2':
        files = thisView.data.ManZhuangZhao;
        break;
      case '3':
        files = thisView.data.JiaGuZhao;
        break;
      case '4':
        files.push(thisView.data.imgBanGuanMenPhoto);
        break;
      case '5':
        files.push(thisView.data.imgGuanMenShiFengPhoto);
        break;
      case '6':
        files = thisView.data.FengZhiZhao;
        break;
      case '7':
        files.push(thisView.data.imgMingPaiPhoto);
    }
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
  nextshow1()
  {
    this.setData({
      slectIndex: 1
    })
    this.takeBanZhuangPhoto();
    this.loadPageData();
  },
  nextshow2()
  {
    this.setData({
      slectIndex: 2
    })
    this.takeManZhuangPhoto();
    this.loadPageData();
  },
  nextshow3()
  {
    this.setData({
      slectIndex: 3
    })
    this.takePhotoJiaGu();
    this.loadPageData();
  },
  nextshow4()
  {
    this.setData({
      slectIndex: 4
    })
    this.takeBanGuanMenPhoto();
    this.loadPageData();
  },
  nextshow5()
  {
    this.setData({
      slectIndex: 5
    })
    this.takeGuanMenShiFengPhoto();
    this.loadPageData();
  },
  nextshow6()
  {
    this.setData({
      slectIndex: 6
    })
    this.takeOtherPhoto();
    this.loadPageData();
  },
  nextshow7()
  {
    this.setData({
      slectIndex: 7
    })
    this.takeMingPaiPhoto();
    this.loadPageData();
  },
  lightOpen: function () {
    this.setData({
      flashSet: 'torch'
    })
    wx.setStorageSync('flashSet', 'torch');
  },
  lightClose: function () {
    this.setData({
      flashSet: 'off'
    })
    wx.setStorageSync('flashSet', 'off');
  },
  showImg1() {
    this.setData({
      isshowimg1: !this.data.isshowimg1
    })
  },
  showImg2() {
    this.setData({
      isshowimg2: !this.data.isshowimg2
    })
  },
  showImg3() {
    this.setData({
      isshowimg3: !this.data.isshowimg3
    })
  },
  showImg4() {
    this.setData({
      isshowimg4: !this.data.isshowimg4
    })
  },
  showImg5() {
    this.setData({
      isshowimg5: !this.data.isshowimg5
    })
  },
  showImg6() {
    this.setData({
      isshowimg6: !this.data.isshowimg6
    })
  },
  showImg7() {
    this.setData({
      isshowimg7: !this.data.isshowimg7
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

  // bigimg: function (event) {
  //   console.log(event)
  //   var imglist = []
  //   var src = event.currentTarget.dataset.src;
  //   imglist.push(src)
  //   console.log(event)
  //   wx.previewImage({
  //     current: src,
  //     urls: imglist
  //   })
  //   this.setData({
  //     flashFlag: true
  //   })
  // },
  flashChange() {
    if (this.data.flashSet == 'torch') {
      this.setData({
        flashSet: 'off'
      })
    } else {
      this.setData({
        flashSet: 'torch'
      })
    }
  },
  imgRadioChange(e) {
    
    this.setData({
      photoNum: parseInt(e.detail.value)
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
  onLoad: function (options) {
    var flash = wx.getStorageSync('flashSet')
    ;
    if (flash == 'torch' || flash == 'off') {
      this.setData({
        flashSet: flash,
      })
    }


    this.ctx = wx.createCameraContext()
    var thisView = this;
    this.setData({
      slectIndex: options.selectIndex
    })
    ;
    switch (options.selectIndex) {
      case '0':
        thisView.takePhotoKongXiang();
        break;
      case '1':
        thisView.takeBanZhuangPhoto();
        break;
      case '2':
        thisView.takeManZhuangPhoto();
        break;
      case '3':
        thisView.takePhotoJiaGu();
        break;
      case '4':
        thisView.takeBanGuanMenPhoto();
        break;
      case '5':
        thisView.takeGuanMenShiFengPhoto();
        break;
      case '6':
        thisView.takeOtherPhoto();
        break;
      case '7':
        thisView.takeMingPaiPhoto();
        break;
    }
    thisView.data.changeArray.forEach((v, i) => v.status = i == thisView.data.slectIndex ? 2 : 0);
    thisView.setData({
      changeArray: thisView.data.changeArray
    });
    console.log(thisView.data.changeArray)
    if (options != undefined && options != null && options != '') {
      thisView.setData({
        id: options.id
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
  },

  onShow: function (options) {
    var thisView = this;
    if (thisView.data.flashFlag) {
      thisView.setData({
        flashFlag: false
      })
    } else {
      thisView.setData({
        halfPhotoList: []
      })
      if (thisView.data.id) {
        thisView.loadPageData();
      }
    }
  },

  //上个页面复制过来未整理

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
  },

  resetSuccessModal: function () {
    this.setData({
      modalSuccessHidden: true,
      successinfo: ''
    })
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

          thisView.setData({
            comID: result.CompanyId,
            PendingCount: result.RealPalleCount == null ? 0 : result.RealPalleCount,
            TotalCount: result.MaxPalletCount == null ? 0 : result.MaxPalletCount,
            srcImg1: (result.DoorPhoto.indexOf('https://www.xiang-cloud.com/uploads/zxzp/') != -1) ? result.DoorPhoto : 'https://www.xiang-cloud.com/uploads/zxzp/' + result.DoorPhoto,
            packageNo: result.CntrNo,
            packageType: result.CntrSizeCode + result.CntrTypeCode,
            guandanhao: result.BillNo,
            liushuihao: result.BizNo,
            hiddenConfirmButton: true,
            hiddenBackUp: true,
            imgBanGuanMenPhoto: '',
            imgMingPaiPhoto: '',
            imgGuanMenShiFengPhoto: '',
            imgmodalnameandplan: '',
            imgxiangkuangandphoto: ''
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
          var myMingPaiPhoto = result.MpsPhoto;
          var mysealPhoto = result.SealPhoto;
          var mynamePlanPhoto = result.NamePlanPhoto;
          var mycertificatePhoto = result.CertificatePhoto;

          if (myhalfCloseDoorPhoto != undefined && myhalfCloseDoorPhoto != null && myhalfCloseDoorPhoto != '') {
            thisView.setData({
              imgBanGuanMenPhoto: myhalfCloseDoorPhoto.indexOf('https://www.xiang-cloud.com/uploads/zxzp/') != -1 ? myhalfCloseDoorPhoto : 'https://www.xiang-cloud.com/uploads/zxzp/' + myhalfCloseDoorPhoto
            })
          }

          if (myMingPaiPhoto != undefined && myMingPaiPhoto != null && myMingPaiPhoto != '') {
            thisView.setData({
              imgMingPaiPhoto: myMingPaiPhoto.indexOf('https://www.xiang-cloud.com/uploads/zxzp/') != -1 ? myMingPaiPhoto : 'https://www.xiang-cloud.com/uploads/zxzp/' + myMingPaiPhoto
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
            if (thisView.data.changeArray[6].status == 0) {
              thisView.data.changeArray[6].status = 1
            }
            thisView.setData({
              changeArray: thisView.data.changeArray
            })
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
            if (thisView.data.changeArray[3].status == 0) {
              thisView.data.changeArray[3].status = 1
            }
            thisView.setData({
              changeArray: thisView.data.changeArray
            })
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
            if (thisView.data.changeArray[2].status == 0) {
              thisView.data.changeArray[2].status = 1
            }
            thisView.setData({
              changeArray: thisView.data.changeArray
            })
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
            if (thisView.data.changeArray[1].status == 0) {
              thisView.data.changeArray[1].status = 1
            }
            thisView.setData({
              changeArray: thisView.data.changeArray
            })
            var arrhalfPhotosData = arrhalfPhotos.split(';');
            var arrfull = [];
            for (var i = 0; i < arrhalfPhotosData.length; i++) {
              arrfull.push((arrhalfPhotosData[i].indexOf('https://www.xiang-cloud.com/uploads/zxzp/') != -1) ? arrhalfPhotosData[i] : 'https://www.xiang-cloud.com/uploads/zxzp/' + arrhalfPhotosData[i])

            }
            thisView.setData({
              halfPhotoList: arrfull
            })
          }
          ;
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
        thisView.GetPhotoPackingRailAiResultByFile();
      },
      fail: function (res) {
        wx.hideLoading()
      },
      complete: function (res) {
        wx.hideLoading()
      },
    })
  },
  bigimg: function (event) {
    var thisView = this;
    console.log(event)
    var imglist = []
    var src = event.currentTarget.dataset.src;
    ;
    switch (thisView.data.slectIndex) {
      case '0':
        imglist = thisView.data.KongXiangZhao;
        break;
      case '1':
        imglist = thisView.data.halfPhotoList;
        break;
      case '2':
        imglist = thisView.data.ManZhuangZhao;
        break;
      case '3':
        imglist = thisView.data.JiaGuZhao;
        break;
      case '4':
        imglist.push(thisView.data.imgBanGuanMenPhoto);
        break;
      case '5':
        imglist.push(thisView.data.imgGuanMenShiFengPhoto);
        break;
      case '6':
        imglist = thisView.data.FengZhiZhao;
        break;
      case '7':
        imglist.push(thisView.data.imgMingPaiPhoto);
        break;
    }
    console.log(event)
    wx.previewImage({
      current: src,
      urls: imglist
    })
    this.setData({
      flash: true
    })
  },
  takePhotoJiaGu() {
    var thisView = this;
    thisView.setData({
      hiddenPhotoPage: false,
      hiddenPhotoButtonPage: true,
      hiddenPhotoButtonPage1: true,
      hiddenPhotoButtonPage2: true,
      hiddenPhotoButtonPage3: false,
      hidden1stPage: true,
      hidden2ndPage: true,
      templateImg: '../../../img/jiagudi.png'
    })
  },

  closePhoto3: function () {
    var thisView = this;
    wx.navigateBack();
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
    thisView.setData({
      hiddenPhotoPage: false,
      hiddenPhotoButtonPage: true,
      hiddenPhotoButtonPage1: true,
      hiddenPhotoButtonPage2: true,
      hiddenPhotoButtonPage3: true,
      hiddenPhotoButtonPage4: false,
      hidden1stPage: true,
      hidden2ndPage: true,
      templateImg: '../../../img/halfclosedoor.png'
    })
  },

  closePhoto4() {
    var thisView = this;
    wx.navigateBack();
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

  ocrImg6(filePath, imgSource) {
    var thisView = this;
    var arr = thisView.data.FengZhiZhao;
    arr.push(filePath);
    thisView.setData({
      FengZhiZhao: arr,
      imgSourceTemp: filePath
    });
    thisView.doBoxPacking(false, true);
  },

  takeOtherPhoto() {
    var thisView = this;
    thisView.setData({
      hiddenPhotoPage: false,
      hiddenPhotoButtonPage: true,
      hiddenPhotoButtonPage1: true,
      hiddenPhotoButtonPage2: true,
      hiddenPhotoButtonPage3: true,
      hiddenPhotoButtonPage4: true,
      hiddenPhotoButtonPage5: true,
      hiddenPhotoButtonPage6: false,
      templateImg: ''
    })
  },
  takeMingPaiPhoto() {
    var thisView = this;
    thisView.setData({
      hiddenPhotoPage: false,
      hiddenPhotoButtonPage: true,
      hiddenPhotoButtonPage1: true,
      hiddenPhotoButtonPage2: true,
      hiddenPhotoButtonPage3: true,
      hiddenPhotoButtonPage4: true,
      hiddenPhotoButtonPage5: true,
      hiddenPhotoButtonPage6: true,
      hiddenPhotoButtonPage7: false,
      hidden1stPage: true,
      hidden2ndPage: true
    })
  },
  fengzhuang6(imgSource) {
    var thisView = this;
    var dateonly = new Date();
    var dateInfo = wx.getStorageSync('myTelephone').substring(7, 11) + '@' +
      (dateonly.getFullYear() + '-' + (dateonly.getMonth() + 1) + '-' + dateonly.getDate() + " " + dateonly.getHours() + ":" + dateonly.getMinutes() + ":" + dateonly.getSeconds()) +
      thisView.data.photoType;

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
        thisView.ocrImg6(rtn.FileName, imgSource)
      },
      fail(res) {
        console.log(res);
      }
    })
  },

  takeGuanMenShiFengPhoto() {
    var thisView = this;
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
      templateImg: '../../../img/shifeng.png'
    })
  },


  closePhoto5() {
    var thisView = this;
    wx.navigateBack();
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
  closePhoto6() {
    var thisView = this;
    wx.navigateBack();
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
    thisView.setData({
      hiddenPhotoPage: false,
      hiddenPhotoButtonPage1: true,
      hiddenPhotoButtonPage: true,
      hiddenPhotoButtonPage2: false,
      hiddenPhotoButtonPage3: true,
      hidden1stPage: true,
      hidden2ndPage: true,
      templateImg: '../../../img/102.png'
    })
  },

  closePhoto2: function () {
    var thisView = this;
    wx.navigateBack();
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
    thisView.setData({
      hiddenPhotoPage: false,
      hiddenPhotoButtonPage1: false,
      hiddenPhotoButtonPage: true,
      hiddenPhotoButtonPage2: true,
      hiddenPhotoButtonPage3: true,
      hidden1stPage: true,
      hidden2ndPage: true,
      templateImg: '../../../img/102.png'
    })
  },

  closePhoto1: function () {
    var thisView = this;
    wx.navigateBack();
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
    var thisView = this;
    thisView.setData({
      hiddenPhotoPage: false,
      hiddenPhotoButtonPage: false,
      hiddenPhotoButtonPage1: true,
      hiddenPhotoButtonPage2: true,
      hiddenPhotoButtonPage3: true,
      hidden1stPage: true,
      hidden2ndPage: true,
      templateImg: '../../../img/102.png'
    })
  },


  closePhoto: function () {
    var thisView = this;
    wx.navigateBack();
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

  upImg5: function () {
    var thisView = this;
    // if (thisView.data.comID != 75 && thisView.data.comID != 76 && thisView.data.comID != 54) {
    //   return
    // }
    var imgSource = '';
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        imgSource = tempFilePaths[0].replace('.unknown', '.jpg')
        wx.showLoading({
          title: 'upload picture...',
          mask: true
        })
        thisView.setData({
          imgSourceTemp: imgSource,
          YanZheng: '关门照',
          photoType: 'MP'
        })
        let sysres = wx.getSystemInfoSync();
        thisView.saveImg(imgSource)

        thisView.fengzhuang5(imgSource)
      }
    })
  },


  ocrImgBgm5(filePath, imgSource) {
    var thisView = this;
    thisView.setData({
      cameraIndex: 6,
      imgGuanMenShiFengPhoto: filePath,
      imgSourceTemp: filePath
    })
    thisView.doBoxPacking(false, false);
  },


  ocrImg5(filePath, imgSource) {
    var thisView = this;
    thisView.ocrImgBgm5(filePath, imgSource)
  },

  fengzhuang5(imgSource) {
    var thisView = this;
    var dateonly = new Date();
    var dateInfo = wx.getStorageSync('myTelephone').substring(7, 11) + '@' +
      (dateonly.getFullYear() + '-' + (dateonly.getMonth() + 1) + '-' + dateonly.getDate() + " " + dateonly.getHours() + ":" + dateonly.getMinutes() + ":" + dateonly.getSeconds()) +
      thisView.data.photoType;

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
        thisView.ocrImg5(rtn.FileName, imgSource)
      },
      fail(res) {
        console.log(res);
      }
    })
  },

  takePhotoCreateCameraContext5() {
    var thisView = this;
    var imgSource = '';

    thisView.ctx.takePhoto({
      quality: 'high',
      success: (res) => {

        wx.showLoading({
          title: '上传照片...',
          mask: true
        })

        imgSource = res.tempImagePath;
        thisView.setData({
          imgSourceTemp: imgSource,
          YanZheng: '关门照',
          photoType: 'LA'
        })
        let sysres = wx.getSystemInfoSync();
        thisView.saveImg(imgSource)
        thisView.fengzhuang5(imgSource)
      }
    })
  },
  takePhotoCreateCameraContext6() {
    var thisView = this;
    var imgSource = '';

    thisView.ctx.takePhoto({
      quality: 'high',
      success: (res) => {

        wx.showLoading({
          title: '上传照片...',
          mask: true
        })

        imgSource = res.tempImagePath;
        thisView.setData({
          imgSourceTemp: imgSource,
          YanZheng: '封志照',
          photoType: 'LA'
        })
        let sysres = wx.getSystemInfoSync();
        thisView.saveImg(imgSource)

        thisView.fengzhuang6(imgSource)
      }
    })
  },

  upImg4: function () {
    var thisView = this;
    // if (thisView.data.comID != 75 && thisView.data.comID != 76 && thisView.data.comID != 54) {
    //   return
    // }
    var imgSource = '';

    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        imgSource = tempFilePaths[0].replace('.unknown', '.jpg')
        wx.showLoading({
          title: 'upload picture...',
          mask: true
        })
        thisView.setData({
          imgSourceTemp: imgSource,
          YanZheng: '半关门照',
          photoType: 'MP'
        })
        let sysres = wx.getSystemInfoSync();
        thisView.saveImg(imgSource)
        thisView.fengzhuang4(imgSource)
      }
    })
  },


  ocrImgBgm4(filePath, imgSource) {
    var thisView = this;
    thisView.setData({
      cameraIndex: 5,
      imgBanGuanMenPhoto: filePath,
      imgSourceTemp: filePath
    })
    thisView.doBoxPacking(false, false);
  },

  ocrImgBgm7(filePath, imgSource) {
    var thisView = this;
    thisView.setData({
      cameraIndex: 7,
      imgMingPaiPhoto: filePath,
      imgSourceTemp: filePath
    })
    thisView.doBoxPacking(true, false);
  },


  ocrImg4(filePath, imgSource) {
    var thisView = this;
    thisView.ocrImgBgm4(filePath, imgSource)
  },

  fengzhuang4(imgSource) {
    var thisView = this;
    var dateonly = new Date();
    var dateInfo = wx.getStorageSync('myTelephone').substring(7, 11) + '@' +
      (dateonly.getFullYear() + '-' + (dateonly.getMonth() + 1) + '-' + dateonly.getDate() + " " + dateonly.getHours() + ":" + dateonly.getMinutes() + ":" + dateonly.getSeconds()) +
      thisView.data.photoType;
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
        thisView.ocrImg4(rtn.FileName, imgSource)

      },
      fail(res) {
        console.log(res);
      }
    })
  },

  takePhotoCreateCameraContext4() {
    var thisView = this;
    var imgSource = '';

    thisView.ctx.takePhoto({
      quality: 'high',
      success: (res) => {

        wx.showLoading({
          title: '上传照片...',
          mask: true
        })

        imgSource = res.tempImagePath;
        thisView.setData({
          imgSourceTemp: imgSource,
          YanZheng: '半关门照',
          photoType: 'LA'
        })
        let sysres = wx.getSystemInfoSync();
        thisView.saveImg(imgSource)
        thisView.fengzhuang4(imgSource)

      }
    })
  },

  upImg3: function () {
    var thisView = this;
    var imgSource = '';

    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        imgSource = tempFilePaths[0].replace('.unknown', '.jpg')
        wx.showLoading({
          title: 'upload picture...',
          mask: true
        })
        ;
        thisView.setData({
          imgSourceTemp: imgSource,
          YanZheng: '加固照',
          photoType: 'MP'
        })
        let sysres = wx.getSystemInfoSync();
        thisView.saveImg(imgSource)
        thisView.fengzhuang3(imgSource)

      }
    })
  },

  upImg6: function () {
    var thisView = this;
    var imgSource = '';

    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        imgSource = tempFilePaths[0].replace('.unknown', '.jpg')
        wx.showLoading({
          title: 'upload picture...',
          mask: true
        })
        thisView.setData({
          imgSourceTemp: imgSource,
          YanZheng: '封志照',
          photoType: 'MP'
        })
        let sysres = wx.getSystemInfoSync();
        thisView.saveImg(imgSource)
        thisView.fengzhuang6(imgSource)

      }
    })
  },
  upImg7: function () {
    var thisView = this;
    var imgSource = '';

    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        imgSource = tempFilePaths[0].replace('.unknown', '.jpg')
        wx.showLoading({
          title: 'upload picture...',
          mask: true
        })
        thisView.setData({
          imgSourceTemp: imgSource,
          YanZheng: '铭牌照',
          photoType: 'MP'
        })
        let sysres = wx.getSystemInfoSync();
        thisView.saveImg(imgSource)
        thisView.fengzhuang7(imgSource)
      }
    })
  },
  fengzhuang7(imgSource) {
    var thisView = this;
    var dateonly = new Date();
    var dateInfo = wx.getStorageSync('myTelephone').substring(7, 11) + '@' +
      (dateonly.getFullYear() + '-' + (dateonly.getMonth() + 1) + '-' + dateonly.getDate() + " " + dateonly.getHours() + ":" + dateonly.getMinutes() + ":" + dateonly.getSeconds()) +
      thisView.data.photoType;
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
        thisView.ocrImg7(rtn.FileName, imgSource)

      },
      fail(res) {
        console.log(res);
      }
    })
  },
  ocrImg7(filePath, imgSource) {
    var thisView = this;
    thisView.ocrImgBgm7(filePath, imgSource)
  },

  ocrImg3(filePath, imgSource) {
    var thisView = this;

    thisView.setData({
      cameraIndex: 4
    })
    var arr = thisView.data.JiaGuZhao;
    arr.push(filePath);
    thisView.setData({
      JiaGuZhao: arr,
      imgSourceTemp: filePath
    });
    thisView.doBoxPacking(false, true);
  },
  upImg7: function () {
    var thisView = this;
    var imgSource = '';

    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        imgSource = tempFilePaths[0].replace('.unknown', '.jpg')
        wx.showLoading({
          title: 'upload picture...',
          mask: true
        })
        thisView.setData({
          imgSourceTemp: imgSource,
          YanZheng: '铭牌照',
          photoType: 'MP'
        })
        let sysres = wx.getSystemInfoSync();
        thisView.saveImg(imgSource)
        thisView.fengzhuang7(imgSource)
      }
    })
  },

  fengzhuang3(imgSource) {
    var thisView = this;
    var dateonly = new Date();
    var dateInfo = wx.getStorageSync('myTelephone').substring(7, 11) + '@' +
      (dateonly.getFullYear() + '-' + (dateonly.getMonth() + 1) + '-' + dateonly.getDate() + " " + dateonly.getHours() + ":" + dateonly.getMinutes() + ":" + dateonly.getSeconds()) +
      thisView.data.photoType;

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
        thisView.ocrImg3(rtn.FileName, imgSource)
      },
      fail(res) {
        console.log(res);
      }
    })

  },

  takePhotoCreateCameraContext3() {
    var thisView = this;
    var imgSource = '';

    thisView.ctx.takePhoto({
      quality: 'high',
      success: (res) => {

        wx.showLoading({
          title: '上传照片...',
          mask: true
        })

        imgSource = res.tempImagePath;
        thisView.setData({
          imgSourceTemp: imgSource,
          YanZheng: '加固照',
          photoType: 'LA'
        })
        let sysres = wx.getSystemInfoSync();
        thisView.saveImg(imgSource)
        thisView.fengzhuang3(imgSource)
      }
    })
  },

  upImg2: function () {
    var thisView = this;
    var imgSource = '';

    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        imgSource = tempFilePaths[0].replace('.unknown', '.jpg')
        wx.showLoading({
          title: 'upload picture...',
          mask: true
        })
        thisView.setData({
          imgSourceTemp: imgSource,
          YanZheng: '满装照',
          photoType: 'MP'
        })
        thisView.fengzhuang2(imgSource)

      }
    })
  },

  ocrImg2(filePath, imgSource) {
    var thisView = this;
    thisView.setData({
      cameraIndex: 3
    })
    if (thisView.data.ManZhuangZhao.length >= 2 && thisView.data.photoNum == -1) {
      wx.showToast({
        title: '满装箱照已满2张，请选择要覆盖的照片进行替换',
        icon: 'none',
        duration: 3000
      })
    } else if (thisView.data.ManZhuangZhao.length >= 2 && thisView.data.photoNum >= 0) {
      var arr = thisView.data.ManZhuangZhao;
      arr[thisView.data.photoNum] = filePath;
      thisView.setData({
        ManZhuangZhao: arr
      });
      thisView.doBoxPacking(false, true);
    } else {
      var arr = thisView.data.ManZhuangZhao;
      arr.push(filePath);
      thisView.setData({
        ManZhuangZhao: arr,
        imgSourceTemp: filePath
      });
      thisView.doBoxPacking(false, true);
    }
  },

  fengzhuang2(imgSource) {
    var thisView = this;
    var dateonly = new Date();
    var dateInfo = wx.getStorageSync('myTelephone').substring(7, 11) + '@' +
      (dateonly.getFullYear() + '-' + (dateonly.getMonth() + 1) + '-' + dateonly.getDate() + " " + dateonly.getHours() + ":" + dateonly.getMinutes() + ":" + dateonly.getSeconds()) +
      thisView.data.photoType;

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
        thisView.ocrImg2(rtn.FileName, imgSource)

      },
      fail(res) {
        console.log(res);
      }
    })

  },

  takePhotoCreateCameraContext2() {
    var thisView = this;
    var imgSource = '';

    thisView.ctx.takePhoto({
      quality: 'high',
      success: (res) => {

        wx.showLoading({
          title: '上传照片...',
          mask: true
        })

        imgSource = res.tempImagePath;
        thisView.setData({
          imgSourceTemp: imgSource,
          YanZheng: '满装照',
          photoType: 'LA'
        })
        let sysres = wx.getSystemInfoSync();
        thisView.saveImg(imgSource)
        thisView.fengzhuang2(imgSource)
      }
    })
  },

  upImg1: function () {
    var thisView = this;
    var imgSource = '';

    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        imgSource = tempFilePaths[0].replace('.unknown', '.jpg')
        wx.showLoading({
          title: 'upload picture...',
          mask: true
        })
        thisView.setData({
          imgSourceTemp: imgSource,
          YanZheng: '装箱照',
          photoType: 'MP'
        })
        thisView.fengzhuang1(imgSource)
      }
    })
  },


  ocrImg1(filePath, imgSource) {
    var thisView = this;

    thisView.setData({
      cameraIndex: 2
    })
    var arr = thisView.data.halfPhotoList;
    arr.push(filePath);
    thisView.setData({
      halfPhotoList: arr,
      imgSourceTemp: filePath
    });
    thisView.doBoxPacking(false, true);

  },

  fengzhuang1(imgSource) {
    var thisView = this;
    var dateonly = new Date();
    var dateInfo = wx.getStorageSync('myTelephone').substring(7, 11) + '@' +
      (dateonly.getFullYear() + '-' + (dateonly.getMonth() + 1) + '-' + dateonly.getDate() + " " + dateonly.getHours() + ":" + dateonly.getMinutes() + ":" + dateonly.getSeconds()) +
      thisView.data.photoType;

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
        thisView.ocrImg1(rtn.FileName, imgSource)
      },
      fail(res) {
        console.log(res);
      }
    })
  },

  takePhotoCreateCameraContext1() {
    var thisView = this;
    var imgSource = '';
    thisView.ctx.takePhoto({
      quality: 'high',
      success: (res) => {

        wx.showLoading({
          title: '上传照片...',
          mask: true
        })

        imgSource = res.tempImagePath;
        thisView.setData({
          imgSourceTemp: imgSource,
          YanZheng: '装箱照',
          photoType: 'LA'
        })
        let sysres = wx.getSystemInfoSync();
        thisView.saveImg(imgSource)
        thisView.fengzhuang1(imgSource)
      }
    })
  },

  upImg0: function () {
    var thisView = this;
    var imgSource = '';

    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album'],
      success(res) {
        ;
        // tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        imgSource = tempFilePaths[0].replace('.unknown', '.jpg')
        wx.showLoading({
          title: 'upload picture...',
          mask: true
        })
        thisView.setData({
          imgSourceTemp: imgSource,
          YanZheng: '空箱照',
          photoType: 'MP'
        })
        thisView.fengzhuang0(imgSource)

      }
    })
  },

  ocrImgBgm0(filePath, imgSource) {
    var thisView = this;
    thisView.setData({
      cameraIndex: 1
    })
    ;
    if (thisView.data.KongXiangZhao.length >= 6 && thisView.data.photoNum == -1) {
      wx.showToast({
        title: '空相照已满6张，请选择要覆盖的照片进行替换',
        icon: 'none',
        duration: 3000
      })
    } else if (thisView.data.KongXiangZhao.length >= 6 && thisView.data.photoNum >= 0) {
      var arr = thisView.data.KongXiangZhao;
      arr[thisView.data.photoNum] = filePath;
      thisView.setData({
        KongXiangZhao: arr,
        imgSourceTemp: filePath
      });
      thisView.doBoxPacking(false, true);
    } else {
      var arr = thisView.data.KongXiangZhao;
      arr.push(filePath);
      thisView.setData({
        KongXiangZhao: arr,
        imgSourceTemp: filePath
      });
      thisView.doBoxPacking(false, true);
    }
  },
  ocrImgNum() {
    ;
    var thisView = this;
    var apiUrl = "https://www.xiang-cloud.com/Api/Mini/Rail.ashx?act=GetPhotoPackingRailAiResultByFile";
    var fileArr = [];
    fileArr.push(thisView.data.imgSourceTemp);
    wx.showLoading({
      title: 'upload...',
      mask: true
    })
    wx.request({
      url: apiUrl,
      data: {
        fileNames: JSON.stringify(fileArr)
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': wx.getStorageSync('myToken')
      },
      method: 'POST',
      success: function (res) {
        console.log('ocr', res)
        if (res.data[0] >= 7 || thisView.data.YanZheng == '加固照') {
          thisView.setData({
            imgSourceTemp: ''
          })
        } else {
          wx.showModal({
            title: '信息确认',
            content: '您所拍摄的照片不符合“' + thisView.data.YanZheng + '”的特征，请重新拍摄上传，以保证您所拍摄的照片符合相关要求。如您确定上传照片符合要求，请选择“确定”继续保存，否则请选择”重拍”',
            showCancel: true, //是否显示取消按钮
            cancelText: "重拍", //默认是“取消”
            confirmText: "确定", //默认是“确定”
            confirmColor: '#a5040d', //确定文字的颜色
            success: function (res) {
              if (res.cancel) {
                ;
                var temp = thisView.data.imgSourceTemp.replace('wxfile://', '');
                var temp2 = (temp.indexOf('https://www.xiang-cloud.com/uploads/zxzp/') != -1) ? temp : 'https://www.xiang-cloud.com/uploads/zxzp/' + temp;
                var emptyPhotos = thisView.data.KongXiangZhao.filter(function (item) {
                  return item != temp && item != temp2
                });
                thisView.setData({
                  KongXiangZhao: emptyPhotos
                });

                var halfPhotos = thisView.data.halfPhotoList.filter(function (item) {
                  return item != temp && item != temp2
                });
                thisView.setData({
                  halfPhotoList: halfPhotos
                });

                var fullPhotos = thisView.data.ManZhuangZhao.filter(function (item) {
                  return item != temp && item != temp2
                });
                thisView.setData({
                  ManZhuangZhao: fullPhotos
                });

                var strengthenPhotos = thisView.data.JiaGuZhao.filter(function (item) {
                  return item != temp && item != temp2
                });
                thisView.setData({
                  JiaGuZhao: strengthenPhotos
                });

                var qitaPhotos = thisView.data.FengZhiZhao.filter(function (item) {
                  return item != temp && item != temp2
                });
                thisView.setData({
                  FengZhiZhao: qitaPhotos
                });
                thisView.setData({
                  imgBanGuanMenPhoto: ''
                });
                thisView.setData({
                  imgMingPaiPhoto: ''
                });
                thisView.setData({
                  imgGuanMenShiFengPhoto: ''
                });

                thisView.setData({
                  imgSourceTemp: ''
                })

                thisView.doBoxPacking(true, true);
              } else {

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

  ocrImg0(filePath, imgSource) {
    var thisView = this;
    thisView.ocrImgBgm0(filePath, imgSource)
  },

  fengzhuang0(imgSource) {
    var thisView = this;

    var dateonly = new Date();
    var dateInfo = wx.getStorageSync('myTelephone').substring(7, 11) + '@' +
      (dateonly.getFullYear() + '-' + (dateonly.getMonth() + 1) + '-' + dateonly.getDate() + " " + dateonly.getHours() + ":" + dateonly.getMinutes() + ":" + dateonly.getSeconds()) +
      thisView.data.photoType;

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
        thisView.ocrImg0(rtn.FileName, imgSource)

      },
      fail(res) {
        console.log(res);
      }
    })
  },

  takePhotoCreateCameraContext0() {
    var thisView = this;
    var imgSource = '';

    thisView.ctx.takePhoto({
      quality: 'high',
      success: (res) => {

        wx.showLoading({
          title: 'upload picture...',
          mask: true
        })

        imgSource = res.tempImagePath;
        thisView.setData({
          imgSourceTemp: imgSource,
          YanZheng: '空箱照',
          photoType: 'LA'
        })
        let sysres = wx.getSystemInfoSync();
        thisView.saveImg(imgSource)
        thisView.fengzhuang0(imgSource)
      }
    })
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
        var dateInfo = wx.getStorageSync('myTelephone').substring(7, 11) + '@' +
          (dateonly.getFullYear() + '-' + (dateonly.getMonth() + 1) + '-' + dateonly.getDate() + " " + dateonly.getHours() + ":" + dateonly.getMinutes() + ":" + dateonly.getSeconds()) +
          'LA';
        //+ ' ' + dateonly.getHours() + ':' + dateonly.getMinutes() + ':' + dateonly.getSeconds()

        wx.uploadFile({
          url: 'https://www.xiang-cloud.com/Api/Shared/FileUpload.ashx',
          filePath: imgSource,
          name: thisView.data.currentImgIndex.toString(),
          formData: {
            'dir': 'zxzp',
            'watermark': dateInfo
          },
          success: function (res) {
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
        var dateInfo = wx.getStorageSync('myTelephone').substring(7, 11) + '@' +
          (dateonly.getFullYear() + '-' + (dateonly.getMonth() + 1) + '-' + dateonly.getDate() + " " + dateonly.getHours() + ":" + dateonly.getMinutes() + ":" + dateonly.getSeconds()) + 'LA';
        //+ ' ' + dateonly.getHours() + ':' + dateonly.getMinutes() + ':' + dateonly.getSeconds()

        wx.uploadFile({
          url: 'https://www.xiang-cloud.com/Api/Shared/FileUpload.ashx',
          filePath: imgSource,
          name: thisView.data.currentImgIndex2nd.toString(),
          formData: {
            'dir': 'zxzp',
            'watermark': dateInfo
          },
          success: function (res) {
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
        var dateInfo = wx.getStorageSync('myTelephone').substring(7, 11) + '@' +
          (dateonly.getFullYear() + '-' + (dateonly.getMonth() + 1) + '-' + dateonly.getDate() + " " + dateonly.getHours() + ":" + dateonly.getMinutes() + ":" + dateonly.getSeconds()) + 'LA';
        //+ ' ' + dateonly.getHours() + ':' + dateonly.getMinutes() + ':' + dateonly.getSeconds()

        wx.uploadFile({
          url: 'https://www.xiang-cloud.com/Api/Shared/FileUpload.ashx',
          filePath: imgSource,
          name: thisView.data.currentImgIndex3rd.toString(),
          formData: {
            'dir': 'zxzp',
            'watermark': dateInfo
          },
          success: function (res) {
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
        var dateInfo = wx.getStorageSync('myTelephone').substring(7, 11) + '@' +
          (dateonly.getFullYear() + '-' + (dateonly.getMonth() + 1) + '-' + dateonly.getDate() + " " + dateonly.getHours() + ":" + dateonly.getMinutes() + ":" + dateonly.getSeconds()) +
          'LA';
        //+ ' ' + dateonly.getHours() + ':' + dateonly.getMinutes() + ':' + dateonly.getSeconds()

        wx.uploadFile({
          url: 'https://www.xiang-cloud.com/Api/Shared/FileUpload.ashx',
          filePath: imgSource,
          name: thisView.data.currentImgIndex4th.toString(),
          formData: {
            'dir': 'zxzp',
            'watermark': dateInfo
          },
          success: function (res) {
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
        var dateInfo = wx.getStorageSync('myTelephone').substring(7, 11) + '@' +
          (dateonly.getFullYear() + '-' + (dateonly.getMonth() + 1) + '-' + dateonly.getDate() + " " + dateonly.getHours() + ":" + dateonly.getMinutes() + ":" + dateonly.getSeconds()) +
          'LA';

        wx.uploadFile({
          url: 'https://www.xiang-cloud.com/Api/Shared/FileUpload.ashx',
          filePath: imgSource,
          name: 'modalnameandplan',
          formData: {
            'dir': 'zxzp',
            'watermark': dateInfo
          },
          success(res) {
            thisView.setData({
              imgmodalnameandplan: imgSource,
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
        var dateInfo = wx.getStorageSync('myTelephone').substring(7, 11) + '@' +
          (dateonly.getFullYear() + '-' + (dateonly.getMonth() + 1) + '-' + dateonly.getDate() + " " + dateonly.getHours() + ":" + dateonly.getMinutes() + ":" + dateonly.getSeconds()) +
          'LA';

        wx.uploadFile({
          url: 'https://www.xiang-cloud.com/Api/Shared/FileUpload.ashx',
          filePath: imgSource,
          name: 'xiangkuangandphoto',
          formData: {
            'dir': 'zxzp',
            'watermark': dateInfo
          },
          success(res) {
            thisView.setData({
              imgxiangkuangandphoto: imgSource,
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
    ;
    var emptyPhotos = thisView.data.KongXiangZhao.join(';');
    var halfPhotos = thisView.data.halfPhotoList.join(';');
    var fullPhotos = thisView.data.ManZhuangZhao.join(';');
    var strengthenPhotos = thisView.data.JiaGuZhao.join(';');
    var qitaPhotos = thisView.data.FengZhiZhao.join(';');

    var arrValQitaPhotos = qitaPhotos.split(';');
    var arrListQitaPhotos = qitaPhotos == '' ? null : JSON.stringify(arrValQitaPhotos);


    var arrValemptyPhotos = emptyPhotos.split(';');
    var arrListemptyPhotos = emptyPhotos == '' ? null : JSON.stringify(arrValemptyPhotos);

    var arrHalfPhotos = halfPhotos.split(';');
    var arrListhalfPhotos = halfPhotos == '' ? null : JSON.stringify(arrHalfPhotos);

    var arrValfullPhotos = fullPhotos.split(';');
    var arrListfullPhotos = fullPhotos == '' ? null : JSON.stringify(arrValfullPhotos);

    var arrValstrengthenPhotos = strengthenPhotos.split(';');
    var arrListstrengthenPhotos = strengthenPhotos == '' ? null : JSON.stringify(arrValstrengthenPhotos);

    var jsonData = '';
    console.log(emptyPhotos)
    console.log('新', arrListemptyPhotos)
    if (validHalfCloseDoorPhoto || validSealPhoto) {
      jsonData = {
        id: thisView.data.id,
        emptyPhotos: arrListemptyPhotos,
        halfPhotos: arrListhalfPhotos,
        fullPhotos: arrListfullPhotos,
        strengthenPhotos: arrListstrengthenPhotos,
        otherPhotos: arrListQitaPhotos,
        halfCloseDoorPhoto: thisView.data.imgBanGuanMenPhoto,
        MpsPhoto: thisView.data.imgMingPaiPhoto,
        sealPhoto: thisView.data.imgGuanMenShiFengPhoto,
        // halfCloseDoorPhoto: 'tmp_ee45210966d0bdd305ff8436069b3ce1.jpg',
        // sealPhoto: 'tmp_ee45210966d0bdd305ff8436069b3ce1.jpg',
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
        MpsPhoto: thisView.data.imgMingPaiPhoto,
        sealPhoto: thisView.data.imgGuanMenShiFengPhoto,
        // halfCloseDoorPhoto: 'tmp_ee45210966d0bdd305ff8436069b3ce1.jpg',
        // sealPhoto: 'tmp_ee45210966d0bdd305ff8436069b3ce1.jpg',
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
        console.log('检测:', res);
        var rtn = JSON.parse(JSON.stringify(res));

        if (rtn == undefined || rtn == "")
          return;

        var result = rtn.data;
        ;
        if (result.ErrorDesc != undefined && result.ErrorDesc != null && result.ErrorDesc != "") {

          var errTitle = result.ErrorDesc
          // result.ErrorDesc == "无法识别的箱门照"

          if (result.ErrorDesc == "此箱号与文档箱号不符")
            errTitle = result.ErrorDesc + '\nThe container No. does not match the file';
          if (result.ErrorDesc == "无法识别的箱门照")
            errTitle = result.ErrorDesc + '\nContainer No. does not captured';

          thisView.setData({
            hiddenGoOnSaveBill: false,
            myNewErrorInfo: errTitle
          })

        } else {
          console.log('hhahahahaa', thisView.data.cameraIndex)
          console.log('hhahahahaa', thisView.data.currentImgIndex)

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
        ;
        if (thisView.data.imgSourceTemp != '' && thisView.data.hiddenGoOnSaveBill && !validHalfCloseDoorPhoto) {
          thisView.loadPageData();
          thisView.ocrImgNum();
        }
        if (validHalfCloseDoorPhoto && !validSealPhoto) {
          thisView.loadPageData();
        }
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

  changePackage() {
    var arrData = [];
    var obj = {};
    var thisView = this;
    var storageSaveIds = wx.getStorageSync('saveIdsArrayRailwayPackage');

    for (var i = 0; i < storageSaveIds.length; i++) {
      if (thisView.data.packageNo != storageSaveIds[i]["packageNo"] && storageSaveIds[i]["packageNo"] != '') {
        obj = {};
        obj.text = storageSaveIds[i]["packageNo"];
        arrData.push(obj);
      }
    }
    var arrList = JSON.parse(JSON.stringify(arrData));

    $wuxActionSheet().showSheet({
      titleText: '箱照切换',
      buttons: arrList,
      buttonClicked(index, item) {
        var packageNo = item.text;
        for (var i = 0; i < storageSaveIds.length; i++) {
          if (storageSaveIds[i]["packageNo"] != undefined && storageSaveIds[i]["packageNo"] != null && storageSaveIds[i]["packageNo"] != '') {
            if (packageNo == storageSaveIds[i]["packageNo"]) {
              thisView.setData({
                id: storageSaveIds[i]["Id"]
              })

              thisView.loadPageData();
            }
          }
        }

        return true
      },
      cancelText: '取消',
      cancel() {}
    })
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
    var thisView = this
    this.doBoxPacking(true, false);
    this.setData({
      hiddenGoOnSaveBill: true,
      myNewErrorInfo: ''
    })
  },

  cancelSaveBill() {
    var thisView = this
    this.setData({
      imgSourceTemp: '',
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