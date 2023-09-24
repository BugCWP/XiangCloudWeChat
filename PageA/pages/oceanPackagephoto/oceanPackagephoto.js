// PageA/pages/oceanPackagephoto/oceanPackagephoto.js
const innerAudioContext = wx.createInnerAudioContext()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    showMsg: false,
    MsgTitle: '',
    MsgText: '',
    MsgBtn: '',
    iscamera: false,
    flashSet: '',
    lightName: '../../../img/lightning-no.png',
    watermarkText: '无时间水印',
    watermarkValue: 2,
    watermarkVisible: false,
    emptyImageBanFengMenImg: '',
    emptyImageFengZhiImg: '',
    emptyImageFengZhiImg2: '',
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
    showFenzhi: false,
    FenZhiBtn: {
      content: '确定',
      variant: 'base'
    },
    showSeven: false,
    OutsideUndercarriagePhoto: '',
    OutsideUndercarriagePhotoList: [],
    OutsideUndercarriageOk: false,
    OutsideUndercarriageRemark: "",
    OutsideInsideDoorPhoto: '',
    OutsideInsideDoorPhotoList: [],
    OutsideInsideDoorOk: false,
    OutsideInsideDoorRemark: '',
    RightSidePhoto: '',
    RightSidePhotoList: [],
    RightSideOk: false,
    RightSideRemark: '',
    LeftSidePhoto: '',
    LeftSidePhotoList: [],
    LeftSideOk: false,
    LeftSideRemark: '',
    FrontWallPhoto: '',
    FrontWallPhotoList: [],
    FrontWallOk: false,
    FrontWallRemark: '',
    CeilingRoofPhoto: '',
    CeilingRoofPhotoList: [],
    CeilingRoofOk: false,
    CeilingRoofRemark: true,
    FloorPhoto: '',
    FloorPhotoList: [],
    FloorOk: false,
    FloorRemark: '',
    LightTestPhoto: '',
    LightTestPhotoList: [],
    LightTestOk: false,
    LightTestRemark: '',
    CleannessPhoto: '',
    CleannessPhotoList: [],
    CleannessOk: false,
    CleannessRemark: '',
    CreatedBy: '',
    CreatedDate: '',
    OutsideUndercarriageShow: false,
    OutsideInsideDoorShow: false,
    LeftSideShow: false,
    CeilingRoofShow: false,
    FrontWallShow: false,
    RightSideShow: false,
    FloorShow: false,
    LightTestShow: false,
    CleannessShow: false,
    takePhotoType: 0,
    noValidHalfCloseDoorPhoto: false,
    changePackageVisible: false,
    changeDatas: [],
    PendingCount: 0,
    TotalCount: 0,
    visible: false,
    showIndex: false,
    closeBtn: true,
    deleteBtn: false,
    images: [],
    initialindex: 1,
    UsingCustomNavbar: true,
    bigImgUrl: '',
    touchS: [0, 0],
    touchE: [0, 0],
    style: 'height: 248rpx',
    inspectionStatus:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var thisView = this;
    if (options != undefined && options != null && options != '') {
      thisView.setData({
        id: options.id
      })
      thisView.loadPageData();
    }
    var flash = wx.getStorageSync('flashSet');
    thisView.setData({
      flashSet: flash,
      lightName: flash == 'torch' ? '../../../img/lightning.png' : '../../../img/lightning-no.png'
    })
    var watermark = wx.getStorageSync('watermarkValue');
    var watermarkText = "无时间水印"
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
  openBigImg(e) {
    var thisView = this;
    var index = e.target.dataset.index;
    var type = e.target.dataset.type;
    var img = [];
    var indexNumber = 0;
    var showIndexValue = false;
    if (type == 1) {
      indexNumber = index;
      img = thisView.data.arrloadphotoList;
      Array.prototype.push.apply(img, thisView.data.arrphotoList);
      showIndexValue = true
    } else if (type == 2) {
      indexNumber = index + thisView.data.arrloadphotoList.length;
      img = thisView.data.arrloadphotoList;
      Array.prototype.push.apply(img, thisView.data.arrphotoList);
      showIndexValue = true
    } else if (type == 3) {
      img.push(thisView.data.emptyImageBanFengMenImg);
      showIndexValue = false
    } else if (type == 4) {
      img.push(thisView.data.emptyImageFengZhiImg);
      showIndexValue = false
    } else if (type == 5) {
      img.push(thisView.data.emptyImageFengZhiImg2);
      showIndexValue = false
    }else if(type == 6){
        indexNumber = index;
      img=thisView.data.OutsideUndercarriagePhotoList;
      showIndexValue = true
    }else if(type == 7){
        indexNumber = index;
        img=thisView.data.OutsideInsideDoorPhotoList;
        showIndexValue = true
    }else if(type == 8){
        indexNumber = index;
        img=thisView.data.LeftSidePhotoList;
        showIndexValue = true
    }else if(type == 9){
        indexNumber = index;
        img=thisView.data.CeilingRoofPhotoList;
        showIndexValue = true
    }else if(type == 10){
        indexNumber = index;
        img=thisView.data.FrontWallPhotoList;
        showIndexValue = true
    }
    else if(type == 11){
        indexNumber = index;
        img=thisView.data.RightSidePhotoList;
        showIndexValue = true
    } else if(type == 12){
        indexNumber = index;
        img=thisView.data.FloorPhotoList;
        showIndexValue = true
    }else if(type == 13){
        indexNumber = index;
        img=thisView.data.LightTestPhotoList;
        showIndexValue = true
    }else if(type == 14){
        indexNumber = index;
        img=thisView.data.CleannessPhotoList;
        showIndexValue = true
    }
    var bigImg=img[indexNumber];
    debugger;
    thisView.setData({
      visible: true,
      initialindex: indexNumber,
      images: img,
      showIndex: showIndexValue,
      bigImgUrl: bigImg
    });
  },
  touchStart: function (e) {
    let sx = e.touches[0].pageX
    let sy = e.touches[0].pageY
    this.data.touchS = [sx, sy]
  },
  touchMove: function (e) {
    let sx = e.touches[0].pageX;
    let sy = e.touches[0].pageY;
    this.data.touchE = [sx, sy]
  },
  touchEnd: function (e) {
    let start = this.data.touchS
    let end = this.data.touchE
    if (start[0] < end[0] - 10) {
      this.lastpage();
    } else if (start[0] > end[0] + 10) {
      this.nextpage();
    }
    if (start[1] > end[1] + 20) {
      this.onClose();
    }
  },
  lastpage: function (e) {
    if (this.data.initialindex - 1 >= 0) {
      var imgIndex = this.data.initialindex - 1;
      var bgUrl = this.data.images[imgIndex];
      this.setData({
        bigImgUrl: bgUrl,
        initialindex: imgIndex
      })
    }
  },
  nextpage: function (e) {
    if (this.data.initialindex != -1) {
      if (this.data.bigimgIndex + 1 < this.data.images.length) {
        var imgIndex = this.data.initialindex + 1;
        var bgUrl = this.data.images[imgIndex];
        this.setData({
          bigImgUrl: bgUrl,
          initialindex: imgIndex
        })
      }
    }
  },
  onClose(e) {
    var thisView = this;
    thisView.setData({
      visible: false,
    });
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

  scanmybarcode() {
    var thisView = this;

    if (thisView.data.id == undefined || thisView.data.id == null || thisView.data.id == '') {
      thisView.setData({
        showMsg: true,
        MsgTitle: '错误信息',
        MsgText: '未识别到箱门照信息，不允许扫码',
        MsgBtn: {
          content: '确定',
          variant: 'base'
        }
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
            url: "https://www.xiang-cloud.com/Api/Mini/Index.ashx?act=ScanBarCode",
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
              var rtn = JSON.parse(JSON.stringify(ee));
              if (rtn == undefined || rtn == "")
                return;
              var result = rtn.data;
              if (result.HasError) {
                thisView.setData({
                  showMsg: true,
                  MsgTitle: '错误信息',
                  MsgText: result.ErrorDesc,
                  MsgBtn: {
                    content: '确定',
                    variant: 'base'
                  }
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
  },
  gotobarcodelist() {
    var thisView = this;
    wx.navigateTo({
      url: '../barcodelist/barcodelist?id=' + thisView.data.id + '&packageNo=' + thisView.data.packageNo +
        '&packageType=' + thisView.data.packageType,
    })
  },
  onchange() {
    debugger;
    var thisView = this;
    var storageSaveIds = wx.getStorageSync('saveIdsArray');
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
  changePackageCancel() {
    var thisView = this;
    thisView.setData({
      changePackageVisible: false,
    })
  },
  showOutsideUndercarriage() {
    var thisView = this;
    thisView.setData({
      OutsideUndercarriageShow: true,
      takePhotoType: 5
    })
  },
  closeOutsideUndercarriage() {
    var thisView = this;
    thisView.setData({
      OutsideUndercarriageShow: false
    })
  },
  showOutsideInsideDoor() {
    var thisView = this;
    thisView.setData({
      OutsideInsideDoorShow: true,
      takePhotoType: 6
    })
  },
  closeOutsideInsideDoor() {
    var thisView = this;
    thisView.setData({
      OutsideInsideDoorShow: false
    })
  },
  showLeftSide() {
    var thisView = this;
    thisView.setData({
      LeftSideShow: true,
      takePhotoType: 7
    })
  },
  closeLeftSide() {
    var thisView = this;
    thisView.setData({
      LeftSideShow: false
    })
  },
  showCeilingRoof() {
    var thisView = this;
    thisView.setData({
      CeilingRoofShow: true,
      takePhotoType: 8
    })
  },
  closeCeilingRoof() {
    var thisView = this;
    thisView.setData({
      CeilingRoofShow: false
    })
  },
  showFrontWall() {
    var thisView = this;
    thisView.setData({
      FrontWallShow: true,
      takePhotoType: 9
    })
  },
  closeFrontWall() {
    var thisView = this;
    thisView.setData({
      FrontWallShow: false
    })
  },
  showRightSide() {
    var thisView = this;
    thisView.setData({
      RightSideShow: true,
      takePhotoType: 10
    })
  },
  closeRightSide() {
    var thisView = this;
    thisView.setData({
      RightSideShow: false
    })
  },
  showFloor() {
    var thisView = this;
    thisView.setData({
      FloorShow: true,
      takePhotoType: 11
    })
  },
  closeFloor() {
    var thisView = this;
    thisView.setData({
      FloorShow: false
    })
  },
  showLightTest() {
    var thisView = this;
    thisView.setData({
      LightTestShow: true,
      takePhotoType: 12
    })
  },
  closeLightTest() {
    var thisView = this;
    thisView.setData({
      LightTestShow: false
    })
  },
  showCleanness() {
    var thisView = this;
    thisView.setData({
      CleannessShow: true,
      takePhotoType: 13
    })
  },
  closeCleanness() {
    var thisView = this;
    thisView.setData({
      CleannessShow: false
    })
  },
  confirmPackagePhoto() {
    var thisView = this;
    if (thisView.data.emptyImageFengZhiImg == "") {
      thisView.setData({
        showFenzhi: true
      })
    } else {
      thisView.confirmGoOn();
    }
  },
  confirmGoOn() {
    var thisView = this;
    var apiUrl = "https://www.xiang-cloud.com/Api/Mini/Index.ashx?act=CompleteBoxPacking";

    if (thisView.data.id == undefined || thisView.data.id == null || thisView.data.id == '') {
      thisView.setData({
        showMsg: true,
        MsgTitle: '错误信息',
        MsgText: '未识别到箱门照信息，不允许确认装箱完成',
        MsgBtn: {
          content: '确定',
          variant: 'base'
        }
      })
      return;
    }
    var arrList = JSON.stringify(thisView.data.photoList);
    wx.showLoading({
      title: '确认装箱完成中...',
      mask: true
    })
    wx.request({
      url: apiUrl,
      data: {
        id: thisView.data.id,
        otherPhotos: arrList
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

        if (result.ErrorDesc != undefined && result.ErrorDesc != null && result.ErrorDesc != "") {
          thisView.setData({
            modalSuccessHidden: false,
            successinfo: result.ErrorDesc,
            modalTitle: '错误信息'
          })
        } else {
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 3000
          })
          var storageSaveIds = wx.getStorageSync('saveIdsArray');
          var arrData = [];
          var obj = {};
          for (var i = 0; i < storageSaveIds.length; i++) {
            if (storageSaveIds[i]["Id"] != undefined && storageSaveIds[i]["Id"] != null && storageSaveIds[i]["Id"] != '') {
              if (storageSaveIds[i]["Id"] != thisView.data.id) {
                obj = {};
                obj.Id = storageSaveIds[i]["Id"];
                obj.srcImg = storageSaveIds[i]["srcImg"];
                obj.packageNo = storageSaveIds[i]["packageNo"];
                obj.packageType = storageSaveIds[i]["packageType"];
                obj.guandanhao = storageSaveIds[i]["guandanhao"];
                obj.liushuihao = storageSaveIds[i]["liushuihao"];
                obj.importImageTitle = storageSaveIds[i]["importImageTitle"];
                obj.completeDate = storageSaveIds[i]["completeDate"];
                obj.createdDate = storageSaveIds[i]["createdDate"];
                arrData.push(obj);
              }
            }
          }
          var arrList = JSON.parse(JSON.stringify(arrData));
          wx.setStorageSync('saveIdsArray', arrList);
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
  closeFenzhi() {
    var thisView = this;
    thisView.setData({
      showFenzhi: false
    })
  },
  loadPageData() {
    var thisView = this;
    //通过ID获取箱照信息
    var apiUrl = "https://www.xiang-cloud.com/Api/Mini/Index.ashx?act=GetBoxPackingDocument";
    if (thisView.data.id == undefined || thisView.data.id == null || thisView.data.id == '') {
      thisView.setData({
        showMsg: true,
        MsgTitle: '错误信息',
        MsgText: '未识别到箱门照信息，请确认箱照ID是否存在',
        MsgBtn: {
          content: '确定',
          variant: 'base'
        }
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
        wx.hideLoading()
        var rtn = JSON.parse(JSON.stringify(res));
        if (rtn == undefined || rtn == "")
          return;
        var result = rtn.data;

        if (result.ErrorDesc != undefined && result.ErrorDesc != null && result.ErrorDesc != "") {
          thisView.setData({
            showMsg: true,
            MsgTitle: '错误信息',
            MsgText: result.ErrorDesc,
            MsgBtn: {
              content: '确定',
              variant: 'base'
            }
          })
        } else {
          thisView.setData({
            PendingCount: result.RealPalleCount == null ? 0 : result.RealPalleCount,
            TotalCount: result.MaxPalletCount == null ? 0 : result.MaxPalletCount,
            srcImg1: result.DoorPhoto,
            packageNo: result.CntrNo,
            packageType: result.CntrSizeCode + result.CntrTypeCode,
            guandanhao: result.BillNo,
            liushuihao: result.BizNo,
            hiddenConfirmButton: true,
            hiddenBackUp: true,
            emptyImageBanFengMenImg: '',
            emptyImageFengZhiImg: '',
            emptyImageFengZhiImg2: '',
            photoList: [],
            AccessCode: result.AccessCode
          })
          var otherPhotosData = result.OtherPhotos;
          var halfDoorPhoto = result.HalfCloseDoorPhoto;
          var sealPhoto = result.SealPhoto;
          var sealPhoto2 = result.SealPhoto2;

          if (result.CompleteDate == undefined || result.CompleteDate == null || result.CompleteDate == '') {
            thisView.setData({
              hiddenConfirmButton: false
            })
          } else {
            thisView.setData({
              hiddenBackUp: false
            })
          }


          thisView.setData({
            emptyImageBanFengMenImg: halfDoorPhoto
          })



          thisView.setData({
            emptyImageFengZhiImg: sealPhoto
          })

          thisView.setData({
            emptyImageFengZhiImg2: sealPhoto2
          })

          var ExcludePhotosData = result.ExcludePhotos;
          thisView.setData({
            ExcludePhotos: result.ExcludePhotos
          });
          var arrExcludePhotosData = [];
          if (ExcludePhotosData != undefined && ExcludePhotosData != null && ExcludePhotosData != '') {
            arrExcludePhotosData = ExcludePhotosData.split(';');
          }
          if (otherPhotosData != undefined && otherPhotosData != null && otherPhotosData != '') {
            var arrOtherPhotosData = otherPhotosData.split(';');
            var loadphotoList = [];
            var arrotherPhotoList = [];
            for (var i = 0; i < arrOtherPhotosData.length; i++) {
              if (!arrExcludePhotosData.includes(arrOtherPhotosData[i])) {
                loadphotoList.push(arrOtherPhotosData[i]);
              } else {
                arrotherPhotoList.push(arrOtherPhotosData[i]);
              }
            }
            thisView.setData({
              photoList: arrOtherPhotosData,
              arrloadphotoList: loadphotoList,
              arrphotoList: arrotherPhotoList
            });
          } else {
            thisView.setData({
              photoList: [],
              arrloadphotoList: [],
              arrphotoList: []
            });
          }
        }
        thisView.getSevenData();
      },
      fail: function (res) {
        wx.hideLoading()
      },
      complete: function (res) {
        wx.hideLoading()
      },
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
  onPickerCancel() {
    var thisView = this;
    thisView.setData({
      watermarkVisible: false
    })
  },
  changeWatermark() {
    var thisView = this;
    thisView.setData({
      watermarkVisible: true
    })
  },
  cameBack() {
    var thisView = this;
    thisView.setData({
      iscamera: false
    })
  },
  swicthChange(e) {
    var thisView = this;
    var index = e.target.dataset.index
    if (index == 5) {
      thisView.setData({
        OutsideUndercarriageOk: e.detail.value
      })
    } else if (index == 6) {
      thisView.setData({
        OutsideInsideDoorOk: e.detail.value
      })
    } else if (index == 7) {
      thisView.setData({
        LeftSideOk: e.detail.value
      })
    } else if (index == 8) {
      thisView.setData({
        CeilingRoofOk: e.detail.value
      })
    } else if (index == 9) {
      thisView.setData({
        FrontWallOk: e.detail.value
      })
    } else if (index == 10) {
      thisView.setData({
        RightSideOk: e.detail.value
      })
    } else if (index == 11) {
      thisView.setData({
        FloorOk: e.detail.value
      })
    } else if (index == 12) {
      thisView.setData({
        LightTestOk: e.detail.value
      })
    } else if (index == 13) {
      thisView.setData({
        CleannessOk: e.detail.value
      })
    }
  },
  tareaChange(e) {
    var thisView = this;
    var index = e.target.dataset.index
    if (index == 5) {
      thisView.setData({
        OutsideUndercarriageRemark: e.detail.value
      })
    } else if (index == 6) {
      thisView.setData({
        OutsideInsideDoorRemark: e.detail.value
      })
    } else if (index == 7) {
      thisView.setData({
        LeftSideRemark: e.detail.value
      })
    } else if (index == 8) {
      thisView.setData({
        CeilingRoofRemark: e.detail.value
      })
    } else if (index == 9) {
      thisView.setData({
        FrontWallRemark: e.detail.value
      })
    } else if (index == 10) {
      thisView.setData({
        RightSideRemark: e.detail.value
      })
    } else if (index == 11) {
      thisView.setData({
        FloorRemark: e.detail.value
      })
    } else if (index == 12) {
      thisView.setData({
        LightTestRemark: e.detail.value
      })
    } else if (index == 13) {
      thisView.setData({
        CleannessRemark: e.detail.value
      })
    }
  },
  takephoto(e) {
    console.log(e.target.dataset.index);
    var thisView = this;
    thisView.setData({
      iscamera: true,
      takePhotoType: e.target.dataset.index
    });
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
  closeMsg() {
    this.setData({
      showMsg: false
    });
  },
  showSevenBtn() {
    var thisView = this;
    thisView.getSevenData();
    thisView.setData({
      showSeven: !thisView.data.showSeven
    });
  },
  DoBoxPackingDocumentInspection(typeName, photo, isOk, remark) {
    var thisView = this;
    var apiUrl = "https://www.xiang-cloud.com/Api/Mini/Index.ashx?act=DoBoxPackingDocumentInspection";
    wx.showLoading({
      title: 'loading...',
      mask: true
    })
    wx.request({
      url: apiUrl,
      data: {
        documentId: thisView.data.id,
        type: typeName,
        photo: photo,
        isOk: isOk,
        remark: remark
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': wx.getStorageSync('myToken')
      },
      method: 'POST',
      success: function (res) {
        wx.showToast({
          title: '提交成功',
          icon: 'success',
          duration: 3000
        })
        thisView.getSevenData();
      },
      complete: function (res) {
        wx.hideLoading()
      },
    })
  },
  getSevenData() {
    var thisView = this;
    var apiUrl = "https://www.xiang-cloud.com/Api/Mini/Index.ashx?act=GetBoxPackingDocumentInspection";
    wx.showLoading({
      title: 'loading...',
      mask: true
    })
    wx.request({
      url: apiUrl,
      data: {
        documentId: thisView.data.id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': wx.getStorageSync('myToken')
      },
      method: 'POST',
      success: function (res) {
        var result = JSON.parse(JSON.stringify(res));
        if (result == undefined || result == "")
          return;
        var rtn = result.data;
        var inspectionNum = 0;
        if(rtn.OutsideUndercarriagePhoto!=null){
            inspectionNum=inspectionNum+1;
        }
        if(rtn.OutsideInsideDoorPhoto!=null){
            inspectionNum=inspectionNum+1;
        }
        if(rtn.RightSidePhoto!=null){
            inspectionNum=inspectionNum+1;
        }
        if(rtn.LeftSidePhoto!=null){
            inspectionNum=inspectionNum+1;
        }
        if(rtn.FrontWallPhoto!=null){
            inspectionNum=inspectionNum+1;
        }
        if(rtn.CeilingRoofPhoto!=null){
            inspectionNum=inspectionNum+1;
        }
        if(rtn.FloorPhoto!=null){
            inspectionNum=inspectionNum+1;
        }
        if(rtn.LightTestPhoto!=null){
            inspectionNum=inspectionNum+1;
        }
        if(rtn.CleannessPhoto!=null){
            inspectionNum=inspectionNum+1;
        }
        thisView.setData({
          inspectionStatus:inspectionNum,
          OutsideUndercarriagePhoto: rtn.OutsideUndercarriagePhoto==null?'': rtn.OutsideUndercarriagePhoto,
          OutsideUndercarriagePhotoList:rtn.OutsideUndercarriagePhoto==null?[]:rtn.OutsideUndercarriagePhoto.split(";"),
          OutsideUndercarriageOk: rtn.OutsideUndercarriageOk==null?'': rtn.OutsideUndercarriageOk,
          OutsideUndercarriageRemark: rtn.OutsideUndercarriageRemark==null?'': rtn.OutsideUndercarriageRemark,
          OutsideInsideDoorPhoto: rtn.OutsideInsideDoorPhoto==null?'': rtn.OutsideInsideDoorPhoto,
          OutsideInsideDoorPhotoList:rtn.OutsideInsideDoorPhoto==null?[]:rtn.OutsideInsideDoorPhoto.split(";"),
          OutsideInsideDoorOk: rtn.OutsideInsideDoorOk==null?'': rtn.OutsideInsideDoorOk,
          OutsideInsideDoorRemark: rtn.OutsideInsideDoorRemark==null?'': rtn.OutsideInsideDoorRemark,
          RightSidePhoto: rtn.RightSidePhoto==null?'': rtn.RightSidePhoto,
          RightSidePhotoList:rtn.RightSidePhoto==null?[]:rtn.RightSidePhoto.split(";"),
          RightSideOk: rtn.RightSideOk==null?'': rtn.RightSideOk,
          RightSideRemark: rtn.RightSideRemark==null?'': rtn.RightSideRemark,
          LeftSidePhoto: rtn.LeftSidePhoto==null?'': rtn.LeftSidePhoto,
          LeftSidePhotoList:rtn.LeftSidePhoto==null?[]:rtn.LeftSidePhoto.split(";"),
          LeftSideOk: rtn.LeftSideOk==null?'': rtn.LeftSideOk,
          LeftSideRemark: rtn.LeftSideRemark==null?'': rtn.LeftSideRemark,
          FrontWallPhoto: rtn.FrontWallPhoto==null?'': rtn.FrontWallPhoto,
          FrontWallPhotoList:rtn.FrontWallPhoto==null?[]:rtn.FrontWallPhoto.split(";"),
          FrontWallOk: rtn.FrontWallOk==null?'': rtn.FrontWallOk,
          FrontWallRemark: rtn.FrontWallRemark==null?'': rtn.FrontWallRemark,
          CeilingRoofPhoto: rtn.CeilingRoofPhoto==null?'': rtn.CeilingRoofPhoto,
          CeilingRoofPhotoList:rtn.CeilingRoofPhoto==null?[]:rtn.CeilingRoofPhoto.split(";"),
          CeilingRoofOk: rtn.CeilingRoofOk==null?'': rtn.CeilingRoofOk,
          CeilingRoofRemark: rtn.CeilingRoofRemark==null?'': rtn.CeilingRoofRemark,
          FloorPhoto: rtn.FloorPhoto==null?'': rtn.FloorPhoto,
          FloorPhotoList:rtn.FloorPhoto==null?[]:rtn.FloorPhoto.split(";"),
          FloorOk: rtn.FloorOk==null?'': rtn.FloorOk,
          FloorRemark: rtn.FloorRemark==null?'': rtn.FloorRemark,
          LightTestPhoto: rtn.LightTestPhoto==null?'': rtn.LightTestPhoto,
          LightTestPhotoList:rtn.LightTestPhoto==null?[]:rtn.LightTestPhoto.split(";"),
          LightTestOk: rtn.LightTestOk==null?'': rtn.LightTestOk,
          LightTestRemark: rtn.LightTestRemark==null?'': rtn.LightTestRemark,
          CleannessPhoto: rtn.CleannessPhoto==null?'': rtn.CleannessPhoto,
          CleannessPhotoList:rtn.CleannessPhoto==null?[]:rtn.CleannessPhoto.split(";"),
          CleannessOk: rtn.CleannessOk==null?'': rtn.CleannessOk,
          CleannessRemark: rtn.CleannessRemark==null?'': rtn.CleannessRemark,
          CreatedBy: rtn.CreatedBy==null?'': rtn.CreatedBy,
          CreatedDate: rtn.CreatedDate==null?'': rtn.CreatedDate,
        });
      },
      complete: function (res) {
        wx.hideLoading()
      },
    })
  },
  closeSeven() {
    var thisView = this;
    thisView.setData({
      showSeven: false
    });
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
            url: "https://www.xiang-cloud.com/Api/Mini/Index.ashx?act=ScanBarCode",
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
  takeImg() {
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
          iscamera: false
        })

        imgSource = res.tempImagePath;
        //thisView.saveImg(imgSource)

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
          filePath: imgSource,
          name: '1',
          formData: {
            'dir': 'zxzp',
            'watermark': dateInfo
          },
          success(res) {
            var rtn = JSON.parse(res.data);
            wx.hideLoading()
            if (thisView.data.takePhotoType == 1) {
              var addphotoList = thisView.data.photoList;
              addphotoList.push(rtn.FileName);
              thisView.setData({
                photoList: addphotoList
              });
              thisView.doBoxPacking();
              thisView.savePhoto();
            } else if (thisView.data.takePhotoType == 2) {
              thisView.ocrImg1(rtn.FileName, imgSource)
              thisView.savePhoto();
            } else if (thisView.data.takePhotoType == 3) {
              thisView.setData({
                emptyImageFengZhiImg: rtn.FileName
              });
              thisView.doBoxPacking();
              thisView.savePhoto();
            } else if (thisView.data.takePhotoType == 4) {
              thisView.setData({
                emptyImageFengZhiImg2: rtn.FileName
              });
              thisView.doBoxPacking();
              thisView.savePhoto();
            } else if (thisView.data.takePhotoType == 5) {
              var list= thisView.data.OutsideUndercarriagePhotoList;
              list.push(rtn.FileName);
              var filephoto = list.join(";");
              thisView.setData({
                OutsideUndercarriagePhoto: filephoto,
                OutsideUndercarriagePhotoList:list
              });
            } else if (thisView.data.takePhotoType == 6) {
                var list= thisView.data.OutsideInsideDoorPhotoList;
                list.push(rtn.FileName);
                var filephoto = list.join(";");
              thisView.setData({
                OutsideInsideDoorPhoto: filephoto,
                OutsideInsideDoorPhotoList:list
              });
            } else if (thisView.data.takePhotoType == 7) {
                var list= thisView.data.LeftSidePhotoList;
                list.push(rtn.FileName);
                var filephoto = list.join(";");
              thisView.setData({
                LeftSidePhoto: filephoto,
                LeftSidePhotoList:list
              });
            } else if (thisView.data.takePhotoType == 8) {
                var list= thisView.data.CeilingRoofPhotoList;
                list.push(rtn.FileName);
                var filephoto = list.join(";");
              thisView.setData({
                CeilingRoofPhoto: filephoto,
                CeilingRoofPhotoList:list
              });
            } else if (thisView.data.takePhotoType == 9) {
                var list= thisView.data.FrontWallPhotoList;
                list.push(rtn.FileName);
                var filephoto = list.join(";");
              thisView.setData({
                FrontWallPhoto: filephoto,
                FrontWallPhotoList:list
              });
            } else if (thisView.data.takePhotoType == 10) {
                var list= thisView.data.RightSidePhotoList;
                list.push(rtn.FileName);
                var filephoto = list.join(";");
              thisView.setData({
                RightSidePhoto: filephoto,
                RightSidePhotoList:list
              });
            } else if (thisView.data.takePhotoType == 11) {
                var list= thisView.data.FloorPhotoList;
                list.push(rtn.FileName);
                var filephoto = list.join(";");
              thisView.setData({
                FloorPhoto: filephoto,
                FloorPhotoList:list
              });
            } else if (thisView.data.takePhotoType == 12) {
                var list= thisView.data.LightTestPhotoList;
                list.push(rtn.FileName);
                var filephoto = list.join(";");
              thisView.setData({
                LightTestPhoto: filephoto,
                LightTestPhotoList:list
              });
            } else if (thisView.data.takePhotoType == 13) {
                var list= thisView.data.CleannessPhotoList;
                list.push(rtn.FileName);
                var filephoto = list.join(";");
              thisView.setData({
                CleannessPhoto: filephoto,
                CleannessPhotoList:list
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
  sevenSubmit() {
    var thisView = this;
    if (thisView.data.takePhotoType == 5) {
      thisView.DoBoxPackingDocumentInspection('OutsideUndercarriage', thisView.data.OutsideUndercarriagePhoto, thisView.data.OutsideUndercarriageOk, thisView.data.OutsideUndercarriageRemark);
      thisView.setData({
        OutsideUndercarriageShow: false
      })
    } else if (thisView.data.takePhotoType == 6) {
      thisView.DoBoxPackingDocumentInspection('OutsideInsideDoor', thisView.data.OutsideInsideDoorPhoto, thisView.data.OutsideInsideDoorOk, thisView.data.OutsideInsideDoorRemark);
      thisView.setData({
        OutsideInsideDoorShow: false
      })
    } else if (thisView.data.takePhotoType == 7) {
      thisView.DoBoxPackingDocumentInspection('LeftSide', thisView.data.LeftSidePhoto, thisView.data.LeftSideOk, thisView.data.LeftSideRemark);
      thisView.setData({
        LeftSideShow: false
      })
    } else if (thisView.data.takePhotoType == 8) {
      thisView.DoBoxPackingDocumentInspection('CeilingRoof', thisView.data.CeilingRoofPhoto, thisView.data.CeilingRoofOk, thisView.data.CeilingRoofRemark);
      thisView.setData({
        CeilingRoofShow: false
      })
    } else if (thisView.data.takePhotoType == 9) {
      thisView.DoBoxPackingDocumentInspection('FrontWall', thisView.data.FrontWallPhoto, thisView.data.FrontWallOk, thisView.data.FrontWallRemark);
      thisView.setData({
        FrontWallShow: false
      })
    } else if (thisView.data.takePhotoType == 10) {
      thisView.DoBoxPackingDocumentInspection('RightSide', thisView.data.RightSidePhoto, thisView.data.RightSideOk, thisView.data.RightSideRemark);
      thisView.setData({
        RightSideShow: false
      })
    } else if (thisView.data.takePhotoType == 11) {
      thisView.DoBoxPackingDocumentInspection('Floor', thisView.data.FloorPhoto, thisView.data.FloorOk, thisView.data.FloorRemark);
      thisView.setData({
        FloorShow: false
      })
    } else if (thisView.data.takePhotoType == 12) {
      thisView.DoBoxPackingDocumentInspection('LightTest', thisView.data.LightTestPhoto, thisView.data.LightTestOk, thisView.data.LightTestRemark);
      thisView.setData({
        LightTestShow: false
      })
    } else if (thisView.data.takePhotoType == 13) {
      thisView.DoBoxPackingDocumentInspection('Cleanness', thisView.data.CleannessPhoto, thisView.data.CleannessOk, thisView.data.CleannessRemark);
      thisView.setData({
        CleannessShow: false
      })
    }
    thisView.getSevenData();
  },
  ocrImgBgm(filePath, imgSource) {
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
        if (res.data.definition == "halfclosed") {
          thisView.setData({
            emptyImageBanFengMenImg: filePath
          });
          thisView.doBoxPacking();
        } else {
          wx.showModal({
            title: '提示',
            content: '该照片不是半关门照片，是否保存?',
            showCancel: true, //是否显示取消按钮
            cancelText: "重拍", //默认是“取消”
            confirmText: "保存", //默认是“确定”
            confirmColor: '#00ff00', //确定文字的颜色
            success: function (res) {
              if (res.cancel) {
                thisView.takePhotoBanGuanMenImage()
                return
              } else {
                thisView.setData({
                  emptyImageBanFengMenImg: filePath
                });
                thisView.doBoxPacking();
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
  ocrImg1(filePath, imgSource) {
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
        if (res.data.definition == "clear") {
          thisView.ocrImgBgm(filePath, imgSource)
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
                thisView.takePhotoBanGuanMenImage()
                return
              } else {
                thisView.ocrImgBgm(filePath, imgSource)
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
  savePhoto() {
    var thisView = this;
    var apiUrl = "https://www.xiang-cloud.com/Api/Mini/Index.ashx?act=CompleteBoxPacking";
    var arrList = JSON.stringify(thisView.data.photoList);
    wx.request({
      url: apiUrl,
      data: {
        id: thisView.data.id,
        otherPhotos: arrList
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
        if (result.ErrorDesc != undefined && result.ErrorDesc != null && result.ErrorDesc != "") {
          thisView.setData({
            showMsg: true,
            MsgTitle: '错误信息',
            MsgText: result.ErrorDesc,
            MsgBtn: {
              content: '确定',
              variant: 'base'
            }
          })
        } else {
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 3000
          })
          var storageSaveIds = wx.getStorageSync('saveIdsArray');
          var arrData = [];
          var obj = {};
          for (var i = 0; i < storageSaveIds.length; i++) {
            if (storageSaveIds[i]["Id"] != undefined && storageSaveIds[i]["Id"] != null && storageSaveIds[i]["Id"] != '') {
              obj = {};
              obj.Id = storageSaveIds[i]["Id"];
              obj.srcImg = storageSaveIds[i]["srcImg"];
              obj.packageNo = storageSaveIds[i]["packageNo"];
              obj.packageType = storageSaveIds[i]["packageType"];
              obj.guandanhao = storageSaveIds[i]["guandanhao"];
              obj.liushuihao = storageSaveIds[i]["liushuihao"];
              obj.importImageTitle = storageSaveIds[i]["importImageTitle"];
              obj.completeDate = storageSaveIds[i]["completeDate"];
              obj.createdDate = storageSaveIds[i]["createdDate"];
              arrData.push(obj);
            }
          }
          var arrList = JSON.parse(JSON.stringify(arrData));
          wx.setStorageSync('saveIdsArray', arrList);
        }
        thisView.loadPageData();
      },
      fail: function (res) {
        wx.hideLoading()
      },
      complete: function (res) {
        wx.hideLoading()
      },
    })
  },
  doBoxPacking() {
    var thisView = this;
    var apiUrl = "https://www.xiang-cloud.com/Api/Mini/Index.ashx?act=DoBoxPacking";
    if (thisView.data.id == undefined || thisView.data.id == null || thisView.data.id == '') {
      thisView.setData({
        modalSuccessHidden: false,
        modalTitle: '错误信息',
        successinfo: '未识别到箱门照信息，不允许确认装箱完成'
      })
      return;
    }
    var arrList = JSON.stringify(thisView.data.photoList);

    wx.showLoading({
      title: '照片保存中...',
      mask: true
    })

    wx.request({
      url: apiUrl,
      data: {
        id: thisView.data.id,
        otherPhotos: arrList,
        halfCloseDoorPhoto: thisView.data.emptyImageBanFengMenImg,
        sealPhoto: thisView.data.emptyImageFengZhiImg,
        sealPhoto2: thisView.data.emptyImageFengZhiImg2,
        noValidHalfCloseDoorPhoto: thisView.data.noValidHalfCloseDoorPhoto,
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

        if (result.ErrorDesc != undefined && result.ErrorDesc != null && result.ErrorDesc != "") {
          var errTitle = '无法检测到箱号，请确认集装箱箱号，清晰准确!否则请取消后重拍';

          if (result.ErrorDesc == "此箱号与文档箱号不符" || result.ErrorDesc == "无法识别的箱门照")
            errTitle = result.ErrorDesc;

          thisView.setData({
            showMsg: true,
            MsgTitle: '错误信息',
            MsgText: errTitle,
            MsgBtn: {
              content: '确定',
              variant: 'base'
            },
            noValidHalfCloseDoorPhoto: true
          })

        } else {
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 3000
          })
          thisView.loadPageData();
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