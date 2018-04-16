// pages/order/afterGoods/afterGoods.js
var app = getApp()
Page({
  data: {
    winWidth: 0,
    winHeight: 0,
    // tab切换  
    currentTab: 0,
    afterGoods:[],
    afterList:[],
    refundList:[]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this;
    var info = wx.getStorageSync('loginInfo');
    // 获取系统信息
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
    app.ajax.req('web/after_goods', { user_id: info.id, token: info.token }, function (res) {
      console.log(res);
      if (res.code == 0) {
        that.setData({
          afterGoods: res.list
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'loading',
          duration: 2000
        })
      }
    })
    app.ajax.req('web/after_list', { user_id: info.id, token: info.token }, function (res) {
      console.log(res);
      if (res.code == 0) {
        that.setData({
          afterList: res.list
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'loading',
          duration: 2000
        })
      }
    })
    app.ajax.req('web/refund_list', { user_id: info.id, token: info.token }, function (res) {
      console.log(res);
      if (res.code == 0) {
        that.setData({
          refundList: res.list
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

  //申请售后
  afterSale: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../../order/afterPage/afterPage?id=' + id
    })
  },

  // 滑动切换tab 
  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });
  },

  // 点击tab切换
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },

  //查看
  bindShow:function(e){
    var return_id = e.target.dataset.return_id
    wx.navigateTo({
      url: '../../order/afterDetail/afterDetail?return_id=' + 　return_id,
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