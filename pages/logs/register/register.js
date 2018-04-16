// pages/logs/register/register.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lock:'',
    phone:'',
    msg:'获取验证码',
    col:'',
    getfocus: false
  },
  onLoad:function(){
    var k = Math.random()
    this.setData({
      img_code: 'http://api.weieryingoa.top/api/coms/user-code?k=' + k
    })
  },
  login:function(){
    wx.navigateTo({
      url: '../../logs/login/login',
    })
  },
  lock:function(e){
    if (e.currentTarget.dataset.lock == ''){
      this.setData({
        lock: 'true',
        col:'',
        getfocus: true
      })
    }else{
      this.setData({
        lock: '',
        col:'#f51322',
        getfocus: true
      })
    }
  },
  phone:function(event){
    this.setData({
      phone: event.detail.value
    })
  },

  code:function(){
    var mobile = this.data.phone;
    var that = this;        
    app.ajax.req('coms/wx_mobile_code', { mobile: mobile }, function (res) {
      if(res.code == 0){
        var timer, num = 120;
        that.setData({
          msg:num+'后重新发送'
        })
        timer = setInterval(function () {
          num--;
          that.setData({
            msg: num+'s后重新发送'
          })
          if (num <= 0) {
            clearInterval(timer);
            that.setData({
              msg: "获取验证码"
            })
          }
        }, 1000)
        wx.showToast({
          title: res.msg,
          icon: 'success',
          duration: 2000
        })
      }else{
        wx.showToast({
          title: res.msg,
          icon: 'loading',
          duration: 2000
        })
      }
    })
  },
  formSubmit:function(e){
    var info = e.detail.value;
    var url = 'web/register';
    var data = { 'reg_type': 1,'username':info.username ,'userpass': info.userpass, 'account': info.account, 'reg_code': info.reg_code };
    app.ajax.req(url,data,function(res){
      if(res.code == 0){
        wx.showToast({
          title: "登录成功，将跳转到登陆",
          icon: 'success',
          duration: 2000,
          complete:function(){
            wx.navigateTo({
              url: '../../logs/login/login',
            })
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
})