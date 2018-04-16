// pages/goods/flashSale/flashSale.js
var app = getApp()
Page({
  data: {
    currentTab: -1,
    winHeight: 0,
    flashSaleNav: [],
    goodsList: [],
    relative: [],
    flag: true,
    count: 0,
    goodsType: '',
    page:1,
    height: '',
    hasMore:true
  },
  /**
   * 加载更多
   */
  loadMore: function (e) {
    var that = this;
    var info = wx.getStorageSync('loginInfo');
    var pgCur = ++that.data.page;
    var goodsType = that.data.goodsType;
    if (goodsType != null) {
      // 获取商品信息
      app.ajax.req('web/group_flash_buy', { type: goodsType, category_id: 0, index: pgCur}, function (res) {
        if (res.fy_pgCount < pgCur) {
          that.setData({
            hasMore:false
          })
          return
        }
        if (res.list.length != 0) {
          res.list.forEach(item => {
            relative.push((item.sell_num / item.max_num * 100).toFixed(2))
          })
        }
        if (res.code == 0) {
          that.setData({
            goodsList: that.data.pointLog.concat(res.list),
            goodsType: goodsType
          })
        }
      })
    } else {
      // 获取商品信息
      app.ajax.req('web/prom_goods', { index: pgCur, category_id: 0 }, function (res) {
        if (res.fy_pgCount < pgCur) {
          that.setData({
            hasMore: false
          })
          return
        }
        if (res.code == 0) {
          that.setData({
            goodsList: that.data.goodsList.concat(res.list),
            goodsType: goodsType
          })
        }
      })
    }
  },
  // 滑动切换tab 
  // bindChange: function (e) {
  //   var that = this;
  //   app.ajax.req('web/group_flash_buy', { type: 1, category_id: e.detail.id }, function (res) {
  //     if (res.code == 0) {
  //       that.setData({
  //         goodsList: res.list,
  //         currentTab: e.detail.current
  //       })
  //     }
  //   })
  // },

  // 点击tab切换
  swichNav: function (e) {
    var that = this;
    var relative = [];
    that.setData({
      goodsList: ''
    })
    if (that.data.currentTab === e.currentTarget.dataset.current) {
      return false;
    } else {
      if (that.data.goodsType != null) {
        // 获取商品信息
        app.ajax.req('web/group_flash_buy', { type: that.data.goodsType, category_id: e.currentTarget.dataset.id }, function (res) {
          if (res.list != null) {
            res.list.forEach(item => {
              relative.push((item.sell_num / item.max_num * 100).toFixed(2))
            })
          }
          if (res.code == 0) {
            that.setData({
              relative: relative,
              goodsList: res.list,
              currentTab: e.currentTarget.dataset.current,
              goodsType: that.data.goodsType
            })
          } else {
            console.log(res.msg)
          }
        })
      } else {
        // 获取商品信息
        app.ajax.req('web/prom_goods', { category_id: e.currentTarget.dataset.id }, function (res) {
          if (res.code == 0) {
            that.setData({
              goodsList: res.list,
              currentTab: e.currentTarget.dataset.current,
              goodsType: that.data.goodsType
            })
          } else {
            console.log(res.msg)
          }
        })
      }
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
    var relative = [];
    that.setData({
      goodsList: ''
    })
    if (that.data.currentTab === e.currentTarget.dataset.current) {
      return false;
    } else {
      if (this.data.goodsType != null) {
        // 获取商品信息
        app.ajax.req('web/group_flash_buy', { type: that.data.goodsType, category_id: e.currentTarget.dataset.id }, function (res) {
          if (res.list != null) {
            res.list.forEach(item => {
              relative.push((item.sell_num / item.max_num * 100).toFixed(2))
            })
          }
          if (res.code == 0) {
            that.setData({
              relative: relative,
              goodsList: res.list,
              currentTab: e.currentTarget.dataset.current,
              goodsType: that.data.goodsType
            })
          } else {
            console.log(res.msg)
          }
        })
      } else {
        // 获取商品信息
        app.ajax.req('web/prom_goods', { category_id: e.currentTarget.dataset.id }, function (res) {
          if (res.code == 0) {
            that.setData({
              goodsList: res.list,
              currentTab: e.target.dataset.current,
              goodsType: that.data.goodsType
            })
          } else {
            console.log(res.msg)
          }
        })
      }
    }
    this.setData({
      flag: (!this.data.flag)
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          height: res.windowHeight
        });
      }
    });
    var relative = [];
    var goodsType = options.type;
    switch (goodsType) {
      case "0":
        var title = '团购';
        break;
      case "1":
        var title = '限时抢购';
        break;
      default:
        var title = '商品促销';
        break;
    }
    wx.setNavigationBarTitle({
      title: title
    })
    // 获取系统信息
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winHeight: res.windowHeight
        });
      }
    });


    // 获取分类导航
    app.ajax.req('web/category', '', function (res) {
      if (res.code == 0) {
        that.setData({
          flashSaleNav: res.list,
          count: res.list.length
        })
      } else {
        console.log(res.msg)
      }
    })
    // 获取商品信息
    // app.ajax.req('web/group_flash_buy', { type: 1, category_id: 0 }, function (res) {
    //   if (res.code == 0) {
    //     that.setData({
    //       goodsList: res.list
    //     })
    //   } else {
    //     console.log(res.msg)
    //   }
    // })
    if (goodsType != null) {
      // 获取商品信息
      app.ajax.req('web/group_flash_buy', { type: goodsType, category_id: 0 }, function (res) {
        if (res.list.length != 0) {
          res.list.forEach(item => {
            relative.push((item.sell_num / item.max_num * 100).toFixed(2))
          })
        }
        if (res.code == 0) {
          that.setData({
            relative: relative,
            goodsList: res.list,
            goodsType: goodsType
          })
        } else {
          console.log(res.msg)
        }
      })
    } else {
      // 获取商品信息
      app.ajax.req('web/prom_goods', { category_id: 0 }, function (res) {
        if (res.code == 0) {
          that.setData({
            goodsList: res.list,
            goodsType: goodsType
          })
        } else {
          console.log(res.msg)
        }
      })
    }
  },


  // 跳转到商品详情
  goodaDetail: function (e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../../goods/reviews/reviews?goods_id=' + id
    })
  },
  buy: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../../goods/reviews/reviews?goods_id=' + id
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