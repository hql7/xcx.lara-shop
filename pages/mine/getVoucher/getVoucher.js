// pages/mine/getVoucher/getVoucher.js

var app = getApp()
Page({
  data: {
    currentTab: 0,
    winHeight: 0,
    flashSaleNav: [],
    voucherList: [],
    flag: true,
    count: 0
  },
  // 滑动切换tab 
  bindChange: function (e) {
    var info = wx.getStorageSync('loginInfo');
    var that = this;
    app.ajax.req('web/coupon_center', { user_id: info.id, type: 1, category_id: e.detail.id }, function (res) {
      console.log(1)
      if (res.code == 0) {
        that.setData({
          voucherList: res.list,
          currentTab: e.detail.current
        })
      }
    })
    that.setData({
      currentTab: e.detail.current
    });
  },

  // 点击tab切换
  swichNav: function (e) {
    var info = wx.getStorageSync('loginInfo');
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      app.ajax.req('web/coupon_center', { user_id: info.id, type: 1, category_id: e.currentTarget.dataset.id }, function (res) {
        if (res.code == 0) {
          that.setData({
            voucherList: res.list,
            currentTab: e.currentTarget.dataset.current
          })
        }
      })
    }
  },

  // 点击显示弹框
  btnShow: function () {
    this.setData({
      flag: (!this.data.flag)
    })
  },
  // 点击切换选项按钮
  selectKind: function () {
    console.log(1)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var info = wx.getStorageSync('loginInfo');
    // 获取系统信息
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winHeight: res.windowHeight
        });
      }
    });
    // 获取限时抢购分类导航
    app.ajax.req('web/category', '', function (res) {

      if (res.code == 0) {
        that.setData({
          flashSaleNav: res.list,
          count: res.list.length
        })
      } else {
        console.log(res.msg)
      }
    })
    // 获取商品信息
    app.ajax.req('web/coupon_center', { user_id: info.id, type: 1, category_id: 1 }, function (res) {
      if (res.code == 0) {
        that.setData({
          voucherList: res.list
        })
      } else {
        console.log(res.msg)
      }
    })
  },
  getVoucher : function(e){
    var id = e.currentTarget.dataset.id;
    var info = wx.getStorageSync('loginInfo');
    app.ajax.req('web/receive_coupon', { user_id: info.id, temp_id: id }, function (res) {
      if (res.code == 0) {
        wx.showToast({
          title: "领取成功",
          icon: 'success',
          duration: 1000
        })
      } else {
        wx.showToast({
          title: '领取失败',
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