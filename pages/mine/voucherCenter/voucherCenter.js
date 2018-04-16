// pages/mine/voucherCenter/voucherCenter.js
var app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    currentTab: -1,
    // winHeight: 0,
    flashSaleNav: [],
    flag: true,
    count: 0,
    voucher: [],
    page: 1,
    hasMore: true,
    hasRefesh: true,
    cate_id: 0
  },
  draw:function(e){
    var that = this;
    var info = wx.getStorageSync('loginInfo');
    var id = e.currentTarget.dataset.id;
    app.ajax.req('web/receive_coupon', { user_id: info.id, token: info.token, temp_id: id }, function (res) {
      if (res.code == 0) {
        wx.showToast({
          title: res.msg,
          icon: 'success',
          duration: 2000
        })
        that.data.voucher.forEach(item => {
          if (id == item.id){
            item.is_receive = 1
          }
        })
        that.setData({
          voucher: that.data.voucher
        })
      }
    })
  },
  // 滑动切换tab 
  // bindChange: function (e) {
  //   var that = this;
  //   that.setData({
  //     voucher: ''
  //   })
  //   app.ajax.req('web/group_flash_buy', { type: 1, category_id: e.detail.id }, function (res) {
  //     if (res.code == 0) {
  //       that.setData({
  //         goodsList: res.list,
  //         currentTab: e.detail.current
  //       })
  //     }
  //   })
  //   that.setData({
  //     currentTab: e.detail.current
  //   });
  // },

  // 点击tab切换
  swichNav: function (e) {
    var that = this;
    that.setData({
      voucher: ''
    })
    var info = wx.getStorageSync('loginInfo');
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      app.ajax.req('web/coupon_center', { user_id: info.id, token: info.token, cate_id: e.currentTarget.dataset.id }, function (res) {
        if (res.code == 0) {
          that.setData({
            voucher: res.list,
            currentTab: e.currentTarget.dataset.current,
            cate_id: e.currentTarget.dataset.id
          })
        }
      })
    }
  },

  // 点击显示遮罩层
  btnShow: function () {
    this.setData({
      flag: (!this.data.flag)
    })
  },
  // 点击切换选项按钮
  selectKind: function (e) {
    var that = this;
    that.setData({
      voucher: ''
    })
    var info = wx.getStorageSync('loginInfo');
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      app.ajax.req('web/coupon_center', { user_id: info.id, token: info.token,  cate_id: e.currentTarget.dataset.id }, function (res) {
        if (res.code == 0) {
          that.setData({
            voucher: res.list,
            currentTab: e.currentTarget.dataset.current,
            flag: true
          })
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // 获取系统信息
    that.setData({
      voucher: ''
    })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winHeight: res.windowHeight
        });
      }
    });
    app.ajax.req('web/category', '', function (res) {
      if (res.code == 0) {
        that.setData({
          flashSaleNav: res.list,
          count: res.list.length+1
        })
      } else {
        console.log(res.msg)
      }
    })

    var info = wx.getStorageSync('loginInfo');
    app.ajax.req('web/coupon_center', { user_id: info.id, token: info.token,cate_id:0 }, function (res) {
      if (res.code == 0) {
        that.setData({
          voucher: res.list
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
  voucherStatus: function (event) {
    var that = this;
    var status = event.currentTarget.dataset.status;
    var info = wx.getStorageSync('loginInfo');
    app.ajax.req('web/my_voucher', { user_id: info.id, status: status, token: info.token }, function (res) {
      if (res.code == 0) {
        that.setData({
          voucher: res.list
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
  loadMore: function (e) {
    var that = this;
    var info = wx.getStorageSync('loginInfo');
    if (!that.data.hasMore) return
    var pgCur = ++that.data.page;
    app.ajax.req('web/coupon_center', { user_id: info.id, index: pgCur, token: info.token, cate_id: that.data.cate_id }, function (res) {
      if (res.fy_pgCount < pgCur) {
        that.setData({
          hasMore: false
        });
      }
      if (res.code == 0 && res.fy_pgcur == pgCur) {
        that.setData({
          voucher: that.data.voucher.concat(res.list),
          hasRefesh: false,
        });
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