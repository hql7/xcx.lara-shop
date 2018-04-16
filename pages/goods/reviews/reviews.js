// pages/goods/reviews/reviews.js
var app = getApp()
var Base64 = require('../../../utils/base64.modified.js');
var util = require('../../../utils/util.js');
var timer = require('../../../utils/wxTimer.js');
Page({
  data: {
    winWidth: 0,
    winHeight: 0,
    // tab切换  
    currentTab: 0,
    // 商品详情
    selectStyleNo: "border: 1rpx solid #fdd9d9;color:#333333;",
    selectStyleOff: "border: 1rpx solid #f67588;color:#f4526a;",
    goodDespriction: [],
    goodsReviews: [],
    img: [],
    spec_attr: [],
    flag: true,
    color: "font-size: 38rpx",
    num: 1,
    index: 0,
    good_id: '',
    selectGoodSpec: [],
    clock: '',
    wxTimerList: {},
    reviewPrice: '',
    d:'',
    goodsSpec:''
  },

  // 点击切换覆盖层
  btnShow: function () {
    var that = this;
    var goodsInfo = that.data.goodDespriction;
    var sale_price = goodsInfo.sell_price;
    if (goodsInfo.sale_price == null){
      goodsInfo.sale_price = sale_price;
    }
    goodsInfo.specs.forEach(item => {
      var select = false;
      item.value.forEach(itemClass => {
        if (itemClass.class == 'selectSpecs'){
          select = true;
        }
      })
      if(select == false){
        item.value[0].class = 'selectSpecs'
      } 
    })
    that.setData({
      goodDespriction: goodsInfo,
      flag: !this.data.flag
    })
  },
  //规格选择
  selectSpecs: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var pid = e.currentTarget.dataset.pid;
    var goodsInfo = that.data.goodDespriction;
    var spec = '';
    var selectSpec = false;
    goodsInfo.specs.forEach(item => {
      if (item.id == pid) {
        item.value.forEach(itemSpec => {
          if (itemSpec.id == id) {
            itemSpec.class = 'selectSpecs'
          } else {
            itemSpec.class = 'typeDetail'
          }
        })
      }
    })
    that.setData({
      goodDespriction: goodsInfo
    })
    goodsInfo.specs.forEach(item => {
      selectSpec = false;
      spec = spec + item.id + ':';
      item.value.forEach(itemSpec => {
        if (itemSpec.class == 'selectSpecs') {
          spec = spec + itemSpec.id + ';';
          selectSpec = true;
        }
      })
    })
    var goodsSpec = '';
    goodsInfo.specs.forEach(item => {
      item.value.forEach(itemSpec => {
        if (itemSpec.class == 'selectSpecs') {
          goodsSpec = goodsSpec + '#' + itemSpec.name;
        }
      })
      
    })
    if (selectSpec == true) {
      app.ajax.req('web/product_detail', { good_id: that.data.goodDespriction.id, spec: spec.substr(0, spec.length - 1) }, function (res) {
        var goodsInfo1 = that.data.goodDespriction;

        if (res.code == 0) {
          if (res.info != []) {
            goodsInfo1.product_id = res.info.product_id;
            goodsInfo1.product_no = res.info.product_no;
            goodsInfo1.store_nums = res.info.store_nums;
            goodsInfo1.sale_price = res.info.sale_price;
            goodsInfo1.sell_price = res.info.sell_price;
          }
          that.setData({
            goodDespriction: goodsInfo1,
            goodsSpec: goodsSpec
          })
        }
      })
    }
  },
  // 点击更改样式
  bindSelect: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index
    if (this.data.index != index) {
      app.ajax.req('web/good_reviews', { good_id: this.data.good_id, type: index, sort: 0 }, function (res) {
        console.log(res)
        if (res.code == 0) {
          that.setData({
            goodsReviews: res,
            index: e.currentTarget.dataset.index
          })
        }
      })
    }
  },

  // 添加收藏
  addAttention: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var product_id = e.currentTarget.dataset.product_id
    var info = wx.getStorageSync('loginInfo');
    app.ajax.req('web/add_attention', { good_id: id, product_id: product_id, user_id: info.id, token: info.token }, function (res) {
      if (res.code == 0) {
        that.setData({
          color: "color:#f2302e;font-size:38rpx"
        })
        wx.showToast({
          title: res.msg,
          icon: 'success',
          duration: 2000
        })
      } else if (res.code == 1) {
        wx.showToast({
          title: res.msg,
          icon: 'loading',
          duration: 2000
        })
      } else {
        that.setData({
          color: ""
        })
        wx.showToast({
          title: res.msg,
          icon: 'loading',
          duration: 2000
        })
      }
    })
  },

  // 跳转购物车
  cart: function (e) {
    wx.switchTab({
      url: '../../cart/cart',
      success: function (e) {
        var page = getCurrentPages().pop();
        if (page == undefined || page == null) return;
        page.onShow();
      }
    });
  },
  // 加入购物车
  addCart: function (e) {
    var that = this;
    var product_id = e.currentTarget.dataset.product_id;
    var info = wx.getStorageSync('loginInfo');
    if (that.data.goodDespriction.store_nums == 0){
      wx.showToast({
        title: "抱歉，因售罄",
        image: '/images/wrong.png',
        duration: 1000
      })
      that.setData({
        flag: true
      })
    }else{
      app.ajax.req('web/add_cart', { product_id: product_id, user_id: info.id, num: that.data.num, token: info.token }, function (res) {
        if (res.code == 0) {
          wx.showToast({
            title: "加入购物车成功",
            icon: 'success',
            duration: 1000
          })
          that.setData({
            flag: true
          })
        } else {
          wx.showToast({
            title: '加入购物车失败',
            icon: 'loading',
            duration: 2000
          })
        }
      })
    }
  },
  //更改数量
  changeNumber: function (event) {
    var that = this;
    var optType = event.currentTarget.dataset.type;
    var num = that.data.num;
    if (optType == 'min') {
      if (num <= 1) {
        wx.showToast({
          title: '不能再少了',
          icon: 'success',
          duration: 2000
        })
      } else {
        num--;
      }
    } else {
      if (num >= that.data.goodDespriction.store_num) {
        wx.showToast({
          title: '不能购买更多了',
          icon: 'success',
          duration: 2000
        })
      } else {
        num++;
      }
    }
    that.setData({
      num: num
    });
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.goods_id;
    var that = this;
    var info = wx.getStorageSync('loginInfo');
    // 获取系统信息
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          good_id: id,
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
    //添加到足迹
    app.ajax.req('web/visit_log', { good_id: id, user_id: info.id, token: info.token }, function (res) {
    })
    
    // 获取商品信息
    app.ajax.req('web/good_detail', { good_id: id, product_id: '', user_id: info.id }, function (res) {
      var image = [];
      if (res.code == 0) {
        if (res.good_info.attention == 0) {
          that.setData({
            color: "color:#f2302e;font-size:38rpx"
          })
        } else {
          that.setData({
            color: ""
          })
        }
        var goodsSpec= '';
        res.good_info.specs.forEach(item => {
          item.value.forEach(itemSpec => {
            itemSpec.class = 'typeDetail';
          })
          goodsSpec = goodsSpec+'#'+item.value[0].name;
        })
        var goodDetail = Base64.decode(res.good_info.detail);
        image = goodDetail.match(/http:\/\/api\.lara-shop\.cn\/files\/quilt_imgs\/\d{2}\/\d{2}\/\d{2}\/\w{32}\.(jpg|png|gif)/g);
        that.setData({
          goodDespriction: res.good_info,
          reviewPrice: (res.good_info.sell_price - res.good_info.sale_price).toFixed(2),
          img: image,
          goodsSpec: goodsSpec
        })
        var end_time = res.good_info.end_time;
        var timestamp = Date.parse(new Date()) / 1000;
        var timedifference = end_time - timestamp;
        var d = parseInt(timedifference / 3600 / 24);
        var h = parseInt((timedifference - d * 3600 * 24) / 3600);
        var i = parseInt((timedifference - d * 3600 * 24 - h * 3600) / 60);
        var s = timedifference - d * 3600 * 24 - h * 3600 - i * 60;
        var time = h + ':' + i + ':' + s;
        that.setData({
          d: d
        })
        //开启定时器
        var wxTimer = new timer({
          beginTime: time,
          name: 'wxTimer'
        })
        wxTimer.start(that);
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'loading',
          duration: 2000
        })
      }
    })
    // 获取评价
    app.ajax.req('web/good_reviews', { good_id: id, type: 0, sort: 0 }, function (res) {
      if (res.code == 0) {
        that.setData({
          goodsReviews: res,
          selectStyle: "border: 1rpx solid #f67588;color:#f4526a;",
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

  // 滑动切换tab 
  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });
  },

  // 点击tab切换
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },

  // 立即购买
  buy: function (e) {
    var id = e.currentTarget.dataset.id;
    var product = e.currentTarget.dataset.product;
    var param = [{ good_id: id, product_id: product, num: this.data.num }];
    if (this.data.goodDespriction.store_nums == 0) {
      wx.showToast({
        title: "抱歉，因售罄",
        image: '/images/wrong.png',
        duration: 1000
      })
    }else{
      wx.setStorageSync("param", param);
      wx.navigateTo({
        url: '../../order/firm-order/firm-order',
      })
    }
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