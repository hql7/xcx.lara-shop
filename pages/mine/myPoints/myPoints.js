// pages/mine/myPoints/myPoints.js
const app = getApp()
Page({
  data: {
    userInfo:[],
    pointLog:[],
    hasMore: true,
    hasRefesh: true,
    page: 1,
    height: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this;
    var info = wx.getStorageSync('loginInfo');
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          height: res.windowHeight
        });
      }
    });

    app.ajax.req('web/user_info', { user_id: info.id, token: info.token }, function (res) {
      if(res.code == 0)
      that.setData({
        userInfo: res.info
      })
    })
    app.ajax.req('web/point_log', { user_id: info.id, token: info.token, type: 0  }, function (res) {
      if (res.code == 0)
        if (res.fy_pgCount == 1){
          that.setData({
            hasMore: false
          });
        }
        that.setData({
          pointLog: res.list
        })
    })
    wx.startPullDownRefresh()
  },

  /**
   * 加载更多
   */
  loadMore: function (e) {
    var that = this;
    var info = wx.getStorageSync('loginInfo');
    if (!that.data.hasMore) return
    var pgCur = ++that.data.page;
    app.ajax.req('web/point_log', { user_id: info.id, index: pgCur, token: info.token, type: 0 }, function (res) {
      if (res.fy_pgCount == pgCur) {
        that.setData({
          hasMore: false
        });
      }
      if (res.code == 0) {
        that.setData({
          pointLog: that.data.pointLog.concat(res.list),
          hasRefesh: false,
        });
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
    wx.showToast({
      title: 'loading...',
      icon:'loading'
    })
    wx.stopPullDownRefresh()
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