// pages/goods/goodsList/goodsList.js
//获取应用实例
const app = getApp()
Page({
  data: {
    sHeight: 0,
    category:[],
    childs:[],
    category_img:'',
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 3000,
    duration: 1200,
    hidden1: true,
    chosen: ''
  },
  // 页面跳转
  skip: function (e) {
    var url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: url
    })
  },
  changeIndicatorDots: function (e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeVertical: function (e) {
    this.setData({
      vertical: !this.data.vertical
    })
  },
  changeAutoplay: function (e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange: function (e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange: function (e) {
    this.setData({
      duration: e.detail.value
    })
  },
  bindViewTap: function () {
    console.log('222')
  },
  tap1: function (e) {
    let obj = {}
    obj['hidden1'] = false
    this.setData(obj)
  },
  mask1: function (e) {
    var obj = {}
    obj['hidden1'] = true
    this.setData(obj)
  },
  formReset: function (e) {
    this.setData({
      chosen: ''
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this;  
    //获取系统信息
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sHeight: res.windowHeight
        });
      }
    });
    app.ajax.req('web/floor_sale', '', function (res) {
      if (res.code == 0) {
        res.list.forEach(item=>{
          if (item.cate_id == 1){
            item.checked = 'topic'
            that.setData({
              childs: item.categorys,
              category_img: item.img_phone
            })
          }else{
            item.checked = ''
          }
        })
        that.setData({
          category: res.list
        })
      }
    })
  },
  cut:function(e){
    var that = this;
    var parentId = e.currentTarget.dataset.id;
    app.ajax.req('web/floor_sale', '', function (res) {
      if (res.code == 0) {
        res.list.forEach(item => {
          if (item.cate_id == parentId){
            item.checked = 'topic'
            that.setData({
              childs: item.categorys,
              category_img: item.img_phone
            })
          }else{
            item.checked = ''
          }
        })
        that.setData({
          category: res.list
        })
      }
    })
  },
  /**
   * 跳商品类表
   */
  goodsList:function(e){
    var cid = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../../goods/goodslist/goodslist?cid=' + cid
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