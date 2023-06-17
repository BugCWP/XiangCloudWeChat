// PageA/pages/containerSuccess/containerSuccess.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        theme:'success',
        title:'提交成功',
        description:'场内限速5KM/小时，请勿超速；到场后，请在选择安全区域下车，打开集装箱角件锁扣；本堆场不接受危险品集装箱，违者后果自行承担；如您业务数据为手工填写，后续可跟堆场联系，达成长期协议，以便您后续简化登记手续。'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

    },
    goback(){
        wx.redirectTo({
          url: '../../../pages/main/main',
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