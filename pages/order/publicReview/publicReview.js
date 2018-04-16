// pages/order/publicReview/publicReview.js
var app = getApp()
Page({
  data: {
    reviews: {},
    goods: [],
    order_id: "",
    files:[],
  },
  selectStar: function(e){
    var key = e.currentTarget.dataset.key;
    if (this.data.key == 1 && this.data.key == 2 ){

    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var info = wx.getStorageSync('loginInfo');
    var id = options.id;
    app.ajax.req('web/review_page', { "user_id": info.id, "token": info.token, "order_id": id }, function (res) {
      console.log(res);
      if (res.code == 0) {
        res.info.goods.forEach(item => {
          item.star = 5;
          item.content = '';
          item.imgs = []
        })

        that.setData({
          reviews: res.info,
          goods: res.info.goods
        })
      }
    })
  },
  //上传图片
  chooseImage: function (e) {
    var arr = this.data.goods
    var that = this;
    var imgs = [];
    var img = {};
    if (wx.getStorageSync('id')==null){
      wx.setStorageSync('id', e.currentTarget.dataset.index)      
    }
    if (wx.getStorageSync('id') != e.currentTarget.dataset.index) {
      that.setData({
        files: []
      });
      wx.setStorageSync('id', e.currentTarget.dataset.index)
    }
    if (that.data.files.length > 2) {
      wx.showToast({
        title: "最多上传三张图片",
        icon: 'loading',
        duration: 2000
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
        arr[e.currentTarget.dataset.index].imgs = that.data.files        
        that.setData({
          goods: arr,
        })
        console.log(that.data.goods);
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
  //选择星星
  changeColor: function (e) {
    var arr = this.data.goods
    arr[e.currentTarget.dataset.index].star = e.currentTarget.dataset.choose
    this.setData({
      goods: arr
    })
  },

  //评价提交
  fromSubmit(e) {
    var reviewsInfo = []; 
    this.data.goods.forEach(function(item,index,arr){
      var comment = {
        good_id: '',
        product_id: '',
        point: '',
        content: '',
        imgs: '',
      }
      comment.good_id = arr[index].good_id;
      comment.product_id = arr[index].product_id;
      comment.point = arr[index].star;
      comment.content = e.detail.value[index];
      comment.imgs = item.imgs;
      reviewsInfo.push(comment);
    })
    var url = "web/review_act";
    var info = wx.getStorageSync('loginInfo');
    var data = {
      user_id: info.id,
      token: info.token,
      order_id: this.data.reviews.order_id,
      reviews: reviewsInfo
    };
    app.ajax.req(url,data,function(res){
      if(res.code == 0){
        wx.showToast({
          title: res.msg,
          icon: 'success',
          duration: 2000,
          complete: function () {
            setTimeout((function callback() {
              wx.redirectTo({
                url: '../../order/myReviews/myReviews',
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