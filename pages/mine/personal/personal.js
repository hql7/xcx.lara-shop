// pages/user/person/person.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: [],
    wxInfo: {},
    voucher_num: "",
    point: "",
    balance: "",
    haeUserInfo: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  // 判断是否登录
  loginOrNot: function () {
    var that = this;
    var info = wx.getStorageSync('loginInfo');
    if (info.length == 0) {
      wx.login({
        success: function (res) {
          if (res.code) {
            //发起网络请求
            wx.request({
              url: 'https://api.weixin.qq.com/sns/jscode2session',
              data: {
                secret: app.globalData.secret,
                appid: app.globalData.appid,
                js_code: res.code,
                grant_type: 'authorization_code'
              },
              method: 'GET',
              header: {
                'content-type': 'application/json'
              },
              success: function (res) {
                console.log(res);
                var openid = res.data.openid
                wx.getUserInfo({
                  success: function (res) {
                    that.setData({
                      hasUserInfo: true,
                      wxInfo: res.userInfo
                    })
                  }
                })
                wx.navigateTo({
                  url: '../../logs/login/login?openid=' + openid,
                })
              }
            })

          } else {
            wx.showToast({
              title: '获取用户登录状态失败！',
              icon: 'loading',
              duration: 2000
            })
          }
        },
        fail: function(res){
        console.log(res);
        }
      });
    
    } else {
      app.ajax.req('web/user_center', { user_id: info.id, token: info.token }, function (res) {
        if (res.code == 0) {
          that.setData({
            userInfo: res.info,
            point: res.info.point,
            voucher_num: res.info.voucher_num,
            balance: res.info.balance
          })
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'loading',
            duration: 2000
          })
          if (res.code == 2) {
            wx.navigateTo({
              url: '../../logs/login/login?openid=' + info.openid,
            })
          }
        }
      })
    }
  },

  //模板消息
  // orderSign:function(e){
    
  //   var fId = e.detail.formId;  
  //   var fObj = e.detail.value;  
  //   var info = wx.getStorageSync('loginInfo');
  //   var template_id = 'aJgS3uh24eWb6vQLoQwAELjQq8Xem-xo3UEM9MiDWgY';
  //   app.ajax.req('web/send_message', { fid: fId, fobj: fObj, openid: info.openid, template_id: template_id },function(res){
  //     console.log(res);
  //   })
  // }  ,
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.loginOrNot(); 
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
    wx.showNavigationBarLoading() //在标题栏中显示加载
    //模拟加载
    setTimeout(function () {
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);
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
   * 用户订单状态
   */
  showOrders:function(e){
    var status = e.currentTarget.dataset.status;
    wx.navigateTo({
      url: '../../order/my-order/my-order?status=' + status
    })
  },
  /**
    * 评价
    */
  showReviews: function () {
    wx.navigateTo({
      url: '../../order/myReviews/myReviews'
    })
  },
  /**
   * 售后
   */
  skip: function (e) {
    var url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: url
    })
  },
})