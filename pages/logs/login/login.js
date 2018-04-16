// pages/logs/login/login.js
var app = getApp()
var openid
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:function(e){
    openid = e.openid;
  },
  register: function () {
    wx.navigateTo({
      url: '../../logs/register/register',
      success:function(e){
        var page = getCurrentPages().pop();

        if (page == undefined || page == null) return;
        page.onShow();
      }
    })
  },
  /**
   * 信息提交
   */
  formSubmit: function (e) {
    var loginInfo = e.detail.value;
    loginInfo.openid = openid;
    loginInfo.type = 3;
    app.ajax.req('web/wx_login', loginInfo, function (res) {
      if (res.code == 0) {
        wx.showToast({
          title: res.msg,              
          icon: 'loading',
          duration: 2000
        })
        res.info.openid = openid; 
        wx.setStorageSync('loginInfo', res.info);
        wx.switchTab({
          url: '../../mine/personal/personal'
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
})