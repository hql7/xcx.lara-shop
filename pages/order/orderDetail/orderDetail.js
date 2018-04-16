// pages/order/orderDetail/orderDetail.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderInfo : '',
    express: '',
    addr: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var url = 'web/order_detail'
    var info = wx.getStorageSync('loginInfo');
    var addr = []
    var data = {
      user_id: info.id,
      token: info.token,
      order_id: options.id
    }
    app.ajax.req(url,data,function(res){
      console.log(res.order_info);
      if(res.code == 0){
        var accept_addr = res.order_info.accept_addr
        var express = res.order_info.express_info.data
        addr = accept_addr.split('，');
        that.setData({
          orderInfo: res.order_info,
          express: express,
          addr: addr
        })
      }else{
        wx.showToast({
          title: res.msg,
          icon: 'loading',
          duration: 2000
        })
      }
    })
  },
  // 去评价
  publicReview: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../../order/publicReview/publicReview?id=' + id
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