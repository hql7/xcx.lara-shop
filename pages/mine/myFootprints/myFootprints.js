// pages/mine/myFootprints/myFootprints.js

var app = getApp()
Page({
  data: {
    currentTab: -1,
    winHeight: 0,
    flashSaleNav: [],
    goodsList: [],
    flag: true,
    count: 0,
    page:1,
    category:0,
    hasMore: true
  },
  /**
   * 加载更多
   */
  loadMore: function (e) {
    var that = this;
    var info = wx.getStorageSync('loginInfo');
    var pgCur = ++that.data.page;
    var category = that.data.category;
    // 获取商品信息
    app.ajax.req('web/visit_list', { user_id: info.id, token: info.token, category: category ,index:pgCur}, function (res) {
      if (res.fy_pgCount < pgCur) {
        that.setData({
          hasMore: false
        })
        return
      }
      if (res.code == 0) {
        that.setData({
          goodsList: that.data.goodsList.concat(res.list),
        })
      } else {
        console.log(res.msg)
      }
    })
  },
  // 滑动切换tab 
  // bindChange: function (e) {
  //   var info = wx.getStorageSync('loginInfo');
  //   var that = this;
  //   that.setData({
  //     goodsList: []
  //   })
  //   app.ajax.req('web/visit_list', { user_id: info.id, token: info.token, category: e.detail.id }, function (res) {
  //     if (res.code == 0) {
  //       that.setData({
  //         goodsList: res.list,
  //         currentTab: e.detail.current
  //       })
  //     }
  //   })
  //   that.setData({
  //     currentTab: e.detail.current
  //   });
  // },

  // 点击tab切换
  swichNav: function (e) {
    var info = wx.getStorageSync('loginInfo');
    var that = this;
    that.setData({
      goodsList: []
    })
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      app.ajax.req('web/visit_list', { user_id: info.id, token:info.token, category: e.currentTarget.dataset.id }, function (res) {
        if (res.code == 0) {
          that.setData({
            goodsList: res.list,
            currentTab: e.currentTarget.dataset.current,
            category: e.currentTarget.dataset.id,
            page: 1,
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
  selectKind: function (e) {
    var info = wx.getStorageSync('loginInfo');
    var that = this;
    that.setData({
      goodsList: []
    })
    if (that.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      app.ajax.req('web/visit_list', { user_id: info.id, token: info.token, category: e.currentTarget.dataset.id }, function (res) {
        if (res.code == 0) {
          that.setData({
            goodsList: res.list,
            currentTab: e.currentTarget.dataset.current,
            category: e.currentTarget.dataset.id,
            page: 1,
          })
        }
      })
    }
    that.setData({
      flag: (!that.data.flag)
    })
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
    that.setData({
      goodsList: []
    })
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
    app.ajax.req('web/visit_list', { user_id: info.id, token: info.token, category: 0 }, function (res) {
      if (res.code == 0) {
        that.setData({
          goodsList: res.list,
          category: 0
        })
      } else {
        console.log(res.msg)
      }
    })
  },
  goods: function (e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../../goods/reviews/reviews?goods_id=' + id
    })
  },
  addCart: function (e) {
    var id = e.currentTarget.dataset.id;
    var info = wx.getStorageSync('loginInfo');
    app.ajax.req('web/add_cart', { product_id: id, user_id: info.id,token: info.token, num: 1 }, function (res) {
      if (res.code == 0) {
        wx.showToast({
          title: "加入购物车成功",
          icon: 'success',
          duration: 1000
        })
      } else {
        wx.showToast({
          title: '加入购物车失败',
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