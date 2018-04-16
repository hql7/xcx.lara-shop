// pages/order/pay/pay.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: "",
    no: '',
    money: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id : options.id,
      no : options.no,
      money : options.money,  
    })
  },
  formSubmit:function(e){
    var that = this;
    var info = wx.getStorageSync('loginInfo')
    var url = 'web/pay_order'; 
    var pay_id = e.detail.value.pay_id;
    var safepass = e.detail.value.safepass;
    var data = {
      "user_id": info.id,   
      'token': info.token,  
      'openid': info.openid,
      "safepass": safepass,     
      "order_no": this.data.no,     //订单编号   C_开头为账户充值单号,否则为商品订单号
      "pay_id": pay_id,     //支付方式ID 
      "pay_type": 3,     //支付类型  0=PC端 1=手机端 2=公众号 3=小程序 4=app  pay_type仅在第三方支付时有效
    }
    if (safepass == '') {
      wx.showToast({
        title: '密码不能为空',
        icon: 'loading',
        duration: 2000
        })
    }else{
      app.ajax.req(url, data, function (res) {
        if (res != '参数错误') {
          //当前的时间
          var timeStamp = res.timeStamp;

          //统一下单接口返回的 prepay_id 参数值
          var packages = res.package;

          //签名,
          var paySign = res.paySign;

          //随机字符串
          var nonceStr = res.nonceStr;

          var param = { "timeStamp": timeStamp, "package": packages, "paySign": paySign, "signType": "MD5", "nonceStr": nonceStr };
          that.pay(param)
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'loading',
            duration: 2000,
            complete: function () {
              setTimeout((function callback() {
                wx.redirectTo({
                  url: '../../order/my-order/my-order'
                })
              }).bind(this), 1000)
            }
          })
        }
      })
    }
  },
  // 微信支付
  pay: function (param) {
    console.log(param);
    wx.requestPayment({
      'timeStamp': param.timeStamp,
      'nonceStr': param.nonceStr,
      'package': param.package,
      'signType': 'MD5',
      'paySign': param.paySign,
      'success': function (res) {
        wx.showToast({
          title: '支付成功',
          icon: 'success',
          duration: 3000,
          complete: function () {
            wx.redirectTo({
              url: '../../order/my-order/my-order'
            })
          }
        });
      },
      'fail': function (res) {
        console.log(res);
      },
      'complete': function (res) {
        console.log(res);
      }
    });
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