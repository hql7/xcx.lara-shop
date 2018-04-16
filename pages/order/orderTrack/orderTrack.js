// pages/mine/addressEdit/addressEdit.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    orderAddress: 'order-last-address',
    addr: [{
      addr: '为尔盈配送员【马云】已发出,联系电话【123456或654321】，感谢您的耐心等待，参加评价还能赢取金豆呦',
      time: '2017-10-31 16:25:35'
    }, {
      addr: '您的订单在【郑州为尔盈】验货完成，正在分配配送员',
      time: '2017-10-31 16:15:35'
    }, {
      addr: '您的订单在【郑州分拨中心】验货完成，准备送往【郑州为尔盈】',
      time: '2017-10-31 16:5:35'
    }, {
      addr: '您的订单在【北京分拨中心】验货完成，准备送往【郑州分拨中心】',
      time: '2017-10-31 15:25:35'
    }, {
      addr: '您的订单在【北京分拨中心】分拣完成',
      time: '2017-10-31 14:25:35'
    }, {
      addr: '您的订单已经打包完毕',
      time: '2017-10-31 13:25:35'
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var order_id = options.id;
    var url = 'web/order_detail';
    var info = wx.getStorageSync('loginInfo');
    var data = { 'user_id': info.id, 'order_id': order_id, 'token': info.token };
    app.ajax.req(url, data, function (res) {
      console.log(res.order_info);
      if (res.code == 0) {
        that.setData({
          list: res.order_info
        })
      } else {
        wx.showToast({
          title: '请重试',
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})