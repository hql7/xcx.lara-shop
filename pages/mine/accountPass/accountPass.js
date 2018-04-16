// pages/mine/accountPass/accountPass.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    msg: '获取验证码'
  },
  onLoad: function (options) {
    this.WxValidate = app.WxValidate(
      {
        account: {
          required: true,
          tel: true
        },
        code: {
          required: true,
        },
        password: {
          minlength: 6,
          maxlength: 18,
          required: true
        },
        password_again: {
          minlength: 6,
          maxlength: 18,
          required: true,
          equalTo:"password"
        }
      },{
        account: {
          required: "请填写手机号",
          tel: '请填写正确的手机号'
        },
        code: {
          required: "请填写验证码"
        },
        password: {
          required: "请填写密码",
          minlength: "密码不能小于6个字符",
          maxlength: "密码不能大于18个字符",
        },
        password_again: {
          required: "请填写确认密码",
          minlength: "密码不能小于6个字符",
          maxlength: "密码不能大于18个字符",
          equalTo: "请输入相同密码"
        }
      }
    ) 
  },
  phone: function (event) {
    this.setData({
      phone: event.detail.value
    })
  },
  code: function () { 
    var mobile = this.data.phone;
    var that = this;        
    app.ajax.req('coms/wx_mobile_code', { mobile: mobile }, function (res) {
      if (res.code == 0) {
        var timer, num = 120;
        that.setData({
          msg: num+'后重新发送'
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
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'loading',
          duration: 2000
        })
      }
    })
  },
  
  formSubmit: function (e) {
    if (!this.WxValidate.checkForm(e)) {
      var error = this.WxValidate.errorList[0]
      wx.showToast({
        title: error.msg,
        image: '../../../images/wrong.png',
        duration: 2000
      })
      return false
    }
    var that = this
    var input = e.detail.value;
    var info = wx.getStorageSync('loginInfo');
    var url = 'web/change_pass';
    var data = { token: info.token, user_id: info.id, verify_type: 0, code: input.code, change_type: 1, new_pass: input.password };
    app.ajax.req(url, data, function (res) {
      if (res.code == 0) {
        wx.showToast({
          title: "支付密码设置成功",
          icon: 'success',
          duration: 2000,
          complete: function () {
           wx.navigateBack({
             delta:2
           })
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
})