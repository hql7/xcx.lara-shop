// pages/search/search.js
var WxSearch = require('../../wxSearch/wxSearch.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    app.ajax.req('web/hot_keywords', '' , function (res) {
      if (res.code == 0) {
        //初始化的时候渲染wxSearchdata
        WxSearch.init(that, 43, res.list);
        WxSearch.initMindKeys(res.list);
      } 
    })
  },
  wxSearchInput: function (e) {
    var that = this;
    WxSearch.wxSearchInput(e, that);
  },
  wxSerchFocus: function (e) {
    var that = this;
    WxSearch.wxSearchFocus(e, that);
  },
  wxSearchBlur: function (e) {
    var that = this;
    WxSearch.wxSearchBlur(e, that);
  },
  wxSearchKeyTap: function (e) {
    var that = this;
    WxSearch.wxSearchKeyTap(e, that);
  },
  wxSearchDeleteKey: function (e) {
    var that = this;
    WxSearch.wxSearchDeleteKey(e, that);
  },
  wxSearchDeleteAll: function (e) {
    var that = this;
    WxSearch.wxSearchDeleteAll(that);
  },
  wxSearchTap: function (e) {
    var that = this;
    WxSearch.wxSearchHiddenPancel(that);
  },
  /**
   * 获取搜索信息
   */
  bindInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  /**
   * 跳转商品列表
   */
  setSearchStorage: function (e) {
    var that = this;
    WxSearch.wxSearchAddHisKey(that);
    let data;
    let localStorageValue = [];
    if (that.data.inputValue != '') {
      //调用API从本地缓存中获取数据
      var searchData = wx.getStorageSync('searchData') || []
      searchData.push(that.data.inputValue)
      wx.setStorageSync('searchData', searchData)
      wx.navigateTo({
        url: '../goods/goodslist/goodslist?keyword=' + that.data.inputValue
      })
    } else {
      wx.showToast({
        title: '请输入商品名',
        icon: '../../../../images/wrong.png'
      })
    }
  },
})