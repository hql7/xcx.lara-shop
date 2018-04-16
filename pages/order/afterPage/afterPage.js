// pages/order/afterPage/afterPage.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodDetail: '',
    typeClass: "refundActive",
    refundType: '0',
    refundStyle: '0',
    styleClass: "refundActive",
    refundTake: '0',
    refundInvoice: '0',
    og_id: "",
    files: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var order_no = options.id;
    var url = "web/after_page";
    var info = wx.getStorageSync('loginInfo');
    var data = {
      user_id : info.id,
      og_id: order_no,
      token : info.token
    }
    app.ajax.req(url,data,function(res){
      console.log(res);
      if(res.code == 0){
        that.setData({
          goodDetail: res,
          og_id: order_no
        })
      }
    })
  
  },

  //上传图片
  chooseImage: function (e) {
    var that = this;
    var imgs = [];
    if (that.data.files.length > 1) {
      wx.showToast({
        title: '最多上传2张',
        icon: 'loading',
        duration: 2000,
      })
      return false;
    }
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        that.setData({
          files: that.data.files.concat(res.tempFilePaths)
        });
      },
    })
  },
  //显示上传图片
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },

  //选择服务类型
  bindRefund:function(e){
    var refundType = e.currentTarget.dataset.type;
    this.setData({
      refundType: refundType
    })
  },

  //选择退款方式
  refundStyle: function(e){
    var refund_type = e.currentTarget.dataset.refund_type;
    this.setData({
      refundStyle: refund_type
    })
  },

  //选择货物状态
  refundTake: function(e){
    var is_take = e.currentTarget.dataset.is_take;
    this.setData({
      refundTake: is_take
    })
  },
  
  //选择申请凭证
  refundInvoice: function(e){
    var invoice = e.currentTarget.dataset.invoice;
    this.setData({
      refundInvoice: invoice
    })
  },
  formSubmit:function(e){
    var url = 'web/after_save';
    var info = wx.getStorageSync('loginInfo');
    var input = e.detail.value;
    console.log(input);
    var data = {
      "user_id": info.id,   
      "token": info.token,  
      "og_id": this.data.og_id,  
      "num": input.num, 
      "type": this.data.refundStyle,  
      "refund_type": this.data.refundStyle,   
      "reason": input.reason,  
      "description": input.description,  
      "invoice": this.data.refundInvoice,  
      "is_take": this.data.refundTake,  
      "accept_name": input.accept_name,   
      "mobile": input.mobile,  
      "phone": input.phone,   
      "imgs": this.data.files
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
          duration: 2000,
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