// pages/goods/goodslist/goodslist.js
var app = getApp()
var cid = ''
var voucher_id = ''
var keyword = ''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    winWidth: 0,
    winHeight: 0,
    // tab切换  
    currentTab: 0,
    // 商品详情
    selectStyle: "border: 1rpx solid #fdd9d9;color:#333333;",
    markDisplay: "none",
    goodDespriction: [],
    goodsList: [],
    page: 1,
    hasMore: true,
    sort: '',
    status: 0,
    display: false,
    price:[],
    brands:[],
    selectType: '',
    selectPrice: '',
    selectBrand: '',
    searchInfo:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var searchInfo = that.data.searchInfo;
    searchInfo['cid'] = options.cid;
    searchInfo['keyword'] = options.keyword;
    searchInfo['voucher_id'] = options.voucher_id;
    // 获取系统信息
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight,
          searchInfo: searchInfo
        });
      }
    });

    // 获取商品信息
    app.ajax.req('web/goods_list', searchInfo, function (res) {
      if (res.code == 0) {
        that.setData({
          goodsList: res.goods,
          price:res.price_range,
          brands:res.brands
        })
      }
    })
  },
  /**
   * tab切换
   */
  swichNav: function (e) {
    var that = this;
    var current = e.target.dataset.current;
    var sort = e.target.dataset.sort;
    var searchInfo = that.data.searchInfo;
    searchInfo['sort'] = sort;
    if (this.data.currentTab === current) {
      return false;
    } else {
      that.setData({
        currentTab: current
      })
    }
    // 获取商品信息
    app.ajax.req('web/goods_list', searchInfo, function (res) {
      if (res.code == 0) {
        that.setData({
          goodsList: res.goods,
          hasMore: true,
          searchInfo: searchInfo
        })
      }
    })

  },
  bindSelect: function () {
    this.setData({
      selectStyle: "border: 1rpx solid #f67588;color:#f4526a;",
      markDisplay: "inline-block"
    })
  },
  /**
   * 加载更多
   */
  loadMore: function (e) {
    var that = this;
    var info = wx.getStorageSync('loginInfo');
    if (!that.data.hasMore) return
    var pgCur = ++that.data.page;
    var sort = that.data.sort;
    var searchInfo = that.data.searchInfo;
    searchInfo['index'] = pgCur;
    searchInfo['sort'] = sort;
    // 获取商品信息
    app.ajax.req('web/goods_list', searchInfo, function (res) {
      if (res.fy_pgCount < pgCur) {
        that.setData({
          hasMore: false
        })
        return
      }
      if (res.code == 0) {
        that.setData({
          goodsList: that.data.goodsList.concat(res.goods),
          searchInfo: searchInfo
        })
      }
    })
  },
  /**
   * 跳搜索页面
   */
  skip: function (e) {
    wx.navigateTo({
      url: '../../search/search'
    })
  },
  /**
   * 跳商品详情
   */
  goodaDetail: function (e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../../goods/goodsdetail/goodsdetail?goods_id=' + id
    })
  },
  /**
   * 切换商品列表样式
   */
  cut: function (e) {
    var that = this;
    var status = e.currentTarget.dataset.status;
    if (status == 1) {
      that.setData({
        status: 0
      })
    } else {
      that.setData({
        status: 1
      })
    }
  },
  /**
   * 显示分类
   */
  filtrate: function (e) {
    var that = this;
    that.setData({
      display: true
    })
  },
  /**
   * 关闭分类
   */
  hideCate: function (e) {
    var that = this;
    that.setData({
      display: false
    })
  },
  /**
   * 搜索选择
   */
  select: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var type = e.currentTarget.dataset.type;
    var selectType = that.data.selectType;
    var selectPrice = that.data.selectPrice;
    var selectBrand = that.data.selectBrand;
    if(type == 1){
      selectType = id;
    }
    if (type == 2) {
      selectPrice = id;
    }
    if (type == 3) {
      selectBrand = id;
    }
    that.setData({
      selectType: selectType,
      selectPrice: selectPrice,
      selectBrand: selectBrand
    })
  },
  /**
   * 重置筛选
   */
  reset: function (e) {
    var that = this;
    that.setData({
      selectType: '',
      selectPrice: '',
      selectBrand: ''
    })
  },
  /**
   * 提交
   */
  submit: function (e) {
    var that = this;
    var selectType = that.data.selectType;
    var selectPrice = that.data.selectPrice;
    var selectBrand = that.data.selectBrand;
    var searchInfo = that.data.searchInfo;
    var price = that.data.price;
    var brands = that.data.brands;
    searchInfo['price'] = price[selectPrice];
    searchInfo['brand'] = selectBrand;
    if (selectType == 1){
      searchInfo['commend'] = 1;
      searchInfo['prom'] = '';
      searchInfo['in_stock'] = '';
    }
    if (selectType == 2) {
      searchInfo['commend'] = '';
      searchInfo['prom'] = 1;
      searchInfo['in_stock'] = '';
    }
    if (selectType == 3) {
      searchInfo['commend'] = '';
      searchInfo['prom'] = '';
      searchInfo['in_stock'] = 1;
    }
    that.setData({
      goodsList: []
    })
    // 获取商品信息
    app.ajax.req('web/goods_list', searchInfo, function (res) {
      if (res.code == 0) {
        that.setData({
          goodsList: res.goods
        }) 
      }
    })
    if (that.data.goodsList == []){
      that.setData({
        hasMore:false
      })
    }
    that.setData({
      display: false,
      searchInfo: searchInfo
    })
  }
})