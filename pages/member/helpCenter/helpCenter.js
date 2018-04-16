// pages/member/helpCenter/helpCenter.js
var app = getApp()
Page({
  data: {
    help:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var help = [];
    app.ajax.req('web/article_center', { type: 1} , function (res) {
      if (res.code == 0) {
        res.list.forEach(item => {
          that.setData({
            help: that.data.help.concat(item.articles),
          })
        })
      }
    })
  },
  detail:function(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../../member/helpDetail/helpDetail?id=' + id
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
  
  },
  /**
   * 帮助信息详情
   */
  helpDetail: function () {
    wx.navigateTo({
      url: '../../member/helpDetail/helpDetail'
    })
  }
})