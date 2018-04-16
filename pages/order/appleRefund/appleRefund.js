// pages/order/appleRefund/appleRefund.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodDetail: '',
    refundStyle: '0',
    styleClass: "refundActive",
    order_id: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var order_id = options.id;
    var url = "web/order_detail";
    var info = wx.getStorageSync('loginInfo');
    var data = {
      user_id: info.id,
      order_id: order_id,
      token: info.token
    }
    app.ajax.req(url, data, function (res) {
      console.log();
      if (res.code == 0) {
        that.setData({
          goodDetail: res.order_info.order_goods[0],
          order_id: order_id
        })
      }
    })

  },

  //选择退款方式
  refundStyle: function (e) {
    var refund_type = e.currentTarget.dataset.refund_type;
    this.setData({
      refundStyle: refund_type
    })
  },

  formSubmit: function (e) {
    var url = 'web/order_refund';
    var info = wx.getStorageSync('loginInfo');
    var input = e.detail.value;
    var data = {
      "user_id": info.id,
      "token": info.token,
      "order_id": this.data.order_id,
      "type": this.data.refundStyle,
      "reason": e.detail.value.reason
    }
    if (e.detail.value)
    app.ajax.req(url, data, function (res) {
      if (res.code == 0) {
        wx.showToast({
          title: res.msg,
          icon: 'success',
          duration: 2000,
          complete: function () {
            setTimeout((function callback() {
              wx.redirectTo({
                url: '../../order/afterGoods/afterGoods',
              })
            }).bind(this), 1000)
          }
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'loading',
          duration: 2000,
        })
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

  }
})