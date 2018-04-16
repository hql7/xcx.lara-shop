//index.js
const app = getApp()
// import { changePage } from '../../common/component/commonHeader/commonHeader.js'

Page({
  data: {
    banner: [],
    hotSale:[],
    footprint:[],
    flashSale:[],
    nav:[],
    noticeList:[],
    bannerImg:[]
  },
  // nav跳转
  nav:function(e){
    var id = e.currentTarget.dataset.id;
    var url = '';
    switch (id) {
      case 1:
        //团购
        url = '../goods/flashSale/flashSale?type=0';
        break;
      case 2:
        //优惠券中心
        url = '../mine/voucherCenter/voucherCenter';
        break; 
      case 3:
        //促销商品
        url = '../goods/flashSale/flashSale';
        break;
      case 4:
        //抢购
        url = '../goods/flashSale/flashSale?type=1';
        break; 
    }
    wx.navigateTo({
      url: url
    })
  },
  // 页面跳转
  skip: function (e) {
    var url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: url
    })
  },
  article: function (e) {
    var article_id = e.currentTarget.dataset.article_id;
    var title = e.currentTarget.dataset.title;
    wx.navigateTo({
      url: '../news/mallInformation/mallInformation?article_id=' + article_id + '&title=' + title
    })
  },
  //商品信息单行滚动
  onLoad: function (options) {
    // 切换搜索页面
    var info = wx.getStorageSync('loginInfo');
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          wx.authorize({
            scope: 'scope.userInfo',
            success() {
              wx.getUserInfo()
            }
          })
        }
      }
    })
    var that = this;
    // if (info.openid != ''){
      // app.ajax.req('web/user_center', { user_id: info.id, token: info.token }, function (res) {
      //   if (res.code == 2) {
      //     wx.showToast({
      //       title: res.msg,
      //       icon: 'loading',
      //       duration: 2000,
      //       success:function(){
      //         wx.navigateTo({
      //           url: '../logs/login/login?openid=' + info.openid,
      //         })
      //       }
      //     })
      //   }
      // })
    // }
    //banner轮播
    // app.ajax.req('web/ad_position', {type:2}, function (res) {
    //   if (res.code == 0) {
    //     that.setData({
    //       bannerImg: res.list
    //     })
    //   }
    // })
    app.ajax.req('web/ad_position', {type:2}, function (res) {
      if (res.code == 0) {
        that.setData({
          bannerImg: res.list
        })
      }
    })
    //首页导航
    app.ajax.req('web/nav', '', function (res) {
      if (res.code == 0) {
        that.setData({
          nav: res.list
        })
      } 
    })
    // 首页公告
    app.ajax.req('web/notice', '', function (res) {
      if (res.code == 0) {
        that.setData({
          noticeList: res.notice
        })
      }
    })
    // 限时抢购商品轮播
    app.ajax.req('web/flash_sale', '', function (res) {
      if (res.code == 0) {
        that.setData({
          flashSale: res.list
        })
      } else {
        console.log(res.msg)
      }
    })
    // 热卖商品
    app.ajax.req('web/hot_sale', '', function (res) {
      if (res.code == 0) {
        that.setData({
          hotSale: res.list
        })
      } else {
        console.log(res.msg)
      }
    })
    // 我的足迹
    app.ajax.req('web/visit_list', { user_id: info.id, token: info.token},function (res){
      if (res.code == 0){
        that.setData({
          footprint: res.list
        })
      } 
    })
    
  },
  flashSale:function(){
    wx.navigateTo({
      url: '../goods/flashSale/flashSale?type=1',
    })
  },
  goodaDetail: function(e){
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../goods/reviews/reviews?goods_id='+id
    })
  }
})