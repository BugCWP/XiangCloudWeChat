// pages/barcodelist/barcodelist.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
      xianghao:'001',
      xiangxing:'002',
      maxxiangcount:15,
      preparexiangcount:7,
      remianxiangcount:8,
      arrHaveProduct: [],
      arrRemainProduct: []
    },
  
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      if(options == undefined || options == null || options == "")
        return;
      var paraId = options.id;
  
      var thisView = this;
      thisView.setData({
        xianghao: options.packageNo,
        xiangxing: options.packageType
      })
  
      //GetPackingDocumentBarCodeInfo根据id获取数据
      wx.request({
        url: "https://www.xiang-cloud.com/Api/Mini/Index.ashx?act=GetPackingDocumentBarCodeInfo",
        data: {
          id: paraId
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
  
          thisView.setData({
            maxxiangcount: result.MaxPalletCount,
            preparexiangcount:result.RealPalleCount,
            remianxiangcount: result.MaxPalletCount - result.RealPalleCount
          })
  
          var intIndex = 0;
          var arrData = [];
          var obj = {};
          for(var i=0;i<result.BarCodes.length;i++)
          {
            if(result.BarCodes[i].BarCode != undefined && result.BarCodes[i].BarCode != null && result.BarCodes[i].BarCode != "")
            {
              obj = {};
              intIndex++;
              obj.Index = intIndex;
              obj.BarCode = result.BarCodes[i].BarCode == null?'':result.BarCodes[i].BarCode;
              obj.Qty = result.BarCodes[i].Qty == null?'0':result.BarCodes[i].Qty;
              obj.StorageCode = result.BarCodes[i].StorageCode == null?'':result.BarCodes[i].StorageCode;
              arrData.push(obj);
            }
          }
  
          thisView.setData({
            arrHaveProduct:arrData
          })
  
          var arrData1 = [];
          var obj1 = {};
          for(var i=0;i<result.PendingBarCodes.length;i++)
          {
            if(result.PendingBarCodes[i].BarCode != undefined && result.PendingBarCodes[i].BarCode != null && result.PendingBarCodes[i].BarCode != "")
            {
              obj1 = {};
              intIndex++;
              obj1.Index = intIndex;
              obj1.BarCode = result.PendingBarCodes[i].BarCode == null?'':result.PendingBarCodes[i].BarCode;
              obj1.Qty = result.PendingBarCodes[i].Qty == null?'0':result.PendingBarCodes[i].Qty;
              obj1.StorageCode = result.PendingBarCodes[i].StorageCode == null?'':result.PendingBarCodes[i].StorageCode;
              arrData1.push(obj1);
            }
          }
  
          thisView.setData({
            arrRemainProduct:arrData1
          })
        },
        fail: function (eq) {
          wx.hideLoading()
        },
        complete: function (e3) {
          wx.hideLoading()
        },
      })
    },
  })