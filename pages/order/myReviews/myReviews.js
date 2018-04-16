var app = getApp();
Page({
  data: {
    winWidth: 0,
    winHeight: 0,
    // tab切换  
    currentTab: 0,
    commentiList:[],
    reviewsList:[]
  },
  onLoad: function () {
    var that = this
    var url = 'web/my_reviews'
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

    //获取待评价信息
    app.ajax.req(url, {user_id: info.id, type: 1, token: info.token}, function (res) {
      if (res.code == 0) {
        that.setData({
          reviewsList: res.list
        })
      }
    })
    //获取已评价信息
    app.ajax.req(url, { user_id: info.id, type: 2, token: info.token}, function (res) {
      if (res.code == 0) {
        that.setData({
          commentiList: res.list
        })
      }
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
 
  // 去评价
  publicReview: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../../order/publicReview/publicReview?id=' + id 
    })
  },
  //订单详情
  orderDetail:function(e){
    var id = e.currentTarget.dataset.id;
    console.log(e);
    wx.navigateTo({
      url: '../../order/orderDetail/orderDetail?id=' + id
    })
  }
});