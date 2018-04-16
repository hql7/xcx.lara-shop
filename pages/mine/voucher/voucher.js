// pages/mine/voucher/voucher.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    voucher:[]
  },
  use:function(e){
    var id = e.currentTarget.dataset.id; 
    wx.navigateTo({
      url: '../../goods/searchList/searchList?voucher_id=' + id
    })
  },
  // 跳转到领券中心
  goCenter:function(){
    wx.navigateTo({
      url: '../voucherCenter/voucherCenter',
      success: function(res) {

      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var info = wx.getStorageSync('loginInfo');
    app.ajax.req('web/my_voucher', { user_id: info.id, token: info.token,status:0}, function (res) {
      if (res.code == 0) {
        that.setData({
          voucher: res.list
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'loading',
          duration: 2000
        })
      }
    })
  },
  voucherStatus: function (event){
    var that = this;
    var status = event.currentTarget.dataset.status;
    var info = wx.getStorageSync('loginInfo');
    app.ajax.req('web/my_voucher', { user_id: info.id, status: status, token: info.token}, function (res) {
      if (res.code == 0) {
        that.setData({
          voucher: res.list
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'loading',
          duration: 2000
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