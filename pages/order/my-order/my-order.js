// pages/order/my-order.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    fy_count: 0,
    display: 'none',
    index: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var status = options.status;   
    var url = 'web/my_orders';
    var info = wx.getStorageSync('loginInfo');
    if (status == 4) {
      var status = 0;
      var url = 'web/my_reviews';
    }
    app.ajax.req(url, { user_id: info.id, index: this.data.index, type: status,token: info.token }, function (res){
      if (res.code == 0) {
        res.list.forEach(item => {
          var orderGoods = [];
          orderGoods = item.order_goods;
          item.count = orderGoods.length
        })
        that.setData({
          list: res.list,
          fy_count: res.fy_count
        })
      }
    })
    wx.startPullDownRefresh()
  },
  
  //申请退款
  applyRefund:function(e) {
    var id = e.currentTarget.dataset.order_id;    
    wx.showModal({
      title: '申请退款',
      content: '您确定要申请退款吗？',
      success: function (res) {
        if (res.confirm) {
          wx.redirectTo({
            url: '../appleRefund/appleRefund?id=' + id
          })
        } else if (res.cancel) {
          this.onLoad();
        }
      }
    })
  },
  //商品详情
  goodDetail:function(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../../goods/reviews/reviews?goods_id=' + id
    })
  },
  //去支付
  goPay:function(e){
    var id = e.currentTarget.dataset.order_id;
    var no = e.currentTarget.dataset.order_no;
    var money = e.currentTarget.dataset.order_money;    
    wx.navigateTo({
      url: '../../order/pay/pay?oid=' + id + '&no=' + no + '&money=' + money
    })
  },

  //物流信息
  logist : function(e){
    var id = e.currentTarget.dataset.order_id;
    wx.navigateTo({
      url: '../../order/orderTrack/orderTrack?id=' + id
    })

  },
  //评价
  toEvaluate:function(e){
    wx.navigateTo({
      url: '../../order/myReviews/myReviews'
    })
  },
  // 取消订单
  cancelOrder:function(e){
    var that = this
    var id = e.currentTarget.dataset.order_id;
    var info = wx.getStorageSync('loginInfo');
    wx.showModal({
      title: '取消订单',
      content: '确定要取消订单吗？',
      success: function (res) {
        if (res.confirm) {
          var url = 'web/order_cancel';
          var data = { 'user_id': info.id, 'order_id': id, 'token': info.token};
          app.ajax.req(url,data,function(res){
            if (res.code === 0) {
              wx.showToast({
                title: res.msg,
                icon: 'success',
                duration: 2000,
                complete: function () {
                  that.onLoad(0)
                }
              })
            }else{
              wx.showToast({
                title: '请重试',
                icon: 'loading',
                duration: 2000,
                complete: function () {
                  setTimeout((function callback() {
                      that.onLoad();
                  }).bind(this), 1000)
                }
              })
            }
          })
        }
      }
    })
  },
  //删除订单
  delOrder: function(e){
    var id = e.currentTarget.dataset.order_id;
    var info = wx.getStorageSync('loginInfo');
    wx.showModal({
      title: '删除订单',
      content: '确认要将此订单删除吗',
      success: function (res) {
        if (res.confirm) {
          var url = 'web/order_del';
          var data = { 'user_id': info.id, 'order_id': id, 'token': info.token };
          app.ajax.req(url, data, function (res) {
            if (res.code === 0) {
              wx.showToast({
                title: res.msg,
                icon: 'success',
                duration: 2000,
                complete: function () {
                  setTimeout((function callback() {
                    wx.navigateTo({
                      url: '../../order/my-order/my-order'
                    })
                  }).bind(this), 1000)
                }
              })

            } else {
              wx.showToast({
                title: res.msg,
                icon: 'loading',
                duration: 2000
              })
          }
          })
        }
      },
      fail: function (res) {
        wx.showToast({
          title: "请重试",
          icon: 'loading',
          duration: 2000
        })
      }
    })
  },

  //确认收货
  confirmReceipt:function(e){
    var id = e.currentTarget.dataset.order_id;
    var info = wx.getStorageSync('loginInfo');
    wx.showModal({
      title: '确认收货',
      content: '确认收货之前请确认您已收到货物',
      success: function (res) {
        if (res.confirm) {
          var url = "web/order_receipt";
          var data = { user_id: info.id, order_id: id,token: info.token};
          app.ajax.req(url,data,function(res){
            if (res.code === 0) {
              wx.showToast({
                title: res.msg,
                icon: 'success',
                duration: 2000,
                complete: function () {
                setTimeout((function callback() {
                  wx.navigateTo({
                    url: '../../order/my-order/my-order'
                  })
                }).bind(this), 1000)
                }
              })

            }else{
              wx.showToast({
                title: res.msg,
                icon: 'loading',
                duration: 2000
              })
            }
          })
        }
      },
      fail: function (res) {
        wx.showToast({
          title: "请重试",
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})