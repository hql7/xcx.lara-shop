// pages/news/shopInformation/shopInformation.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msgList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var info = wx.getStorageSync('loginInfo');
    app.ajax.req('web/notice', { user_id: info.id, token: info.token }, function (res) {
      if (res.code == 0)
        that.setData({
          msgList: res.notice
        })
    })
  },
  skip: function (e) {
    var article_id = e.currentTarget.dataset.article_id;
    var title = e.currentTarget.dataset.title;
    wx.navigateTo({
      url: '../../news/mallInformation/mallInformation?article_id=' + article_id + '&title=' + title
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