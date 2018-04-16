// pages/order/afterDetail/afterDetail.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    express_list : [],
    express: '',
    index: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var express_name = "";
    var express = [];
    var list = [];
    var url = 'web/after_detail';
    var info = wx.getStorageSync('loginInfo');
    var data = {
      user_id : info.id,
      token : info.token,
      return_id: options.return_id
    }
    app.ajax.req(url,data,function(res){
      if(res.code == 0){
        that.setData({
          list: res.info
        })
      }
    })

    //获取物流数据
    app.ajax.req('root/auth/express_company_list','',function(res){
      console.log(res);
      res.list.forEach(item=>{
          express_name = item.name        
          express.push(express_name)
      })
      that.setData({
        express: express,
        express_list: res.list
      })
    })
  },
  //选择物流商家
  bindCountryChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },
  //取消服务
  bindService: function(e){
    var url = 'web/after_cancel';
    var info = wx.getStorageSync('loginInfo');
    var data = {
      user_id : info.id,
      token : info.token,
      return_id: e.currentTarget.dataset.return_id
    }
    app.ajax.req(url,data,function(res){
      if(res.code == 0){
        wx.showToast({
          title: res.msg,
          icon: 'success',
          duration: 2000,
          complete: function () {
            setTimeout((function callback() {
              wx.redirectTo({
                url: '../../order/afterGoods/afterGoods',
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
  },

  //提交物流信息
  formSubmit:function(e){
  var info = wx.getStorageSync('loginInfo');
  var url = "web/after_send";
  var return_id = e.detail.target.dataset.return_id;
  var data = {
    express_no: e.detail.value.express_no,
    express_company_id: this.data.express_list[this.data.index].id,
    user_id: info.id,
    token: info.token,
    return_id: return_id
  }
    app.ajax.req(url,data,function(res){
      if(res.code == 0){
        wx.showToast({
          title: res.msg,
          icon: 'success',
          duration: 2000,
          complete: function () {
            setTimeout((function callback() {
              wx.navigateTo({
                url: '../afterGoods/afterGoods',
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