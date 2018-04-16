// pages/cart/cart.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    delBtnWidth: 60,//删除按钮宽度单位（rpx）  
    cartList: [],
    nums:'',
    priceNum:'',
    checkedStatus: true,
  },
  viewShow: function () {
    var that = this;
    var info = wx.getStorageSync('loginInfo');
    var arr = [];
    var priceNum = 0;
    if (info.length == 0) {
      wx.login({
        success: function (res) {
          if (res.code) {
            //发起网络请求
            wx.request({
              url: 'https://api.weixin.qq.com/sns/jscode2session',
              data: {
                secret: '4eeee1bfb07f732978b3b66943f767e8',
                appid: 'wxd0b35cbb7bf376b6',
                js_code: res.code,
                grant_type: 'authorization_code'
              },
              method: 'GET',
              header: {
                'content-type': 'application/json'
              },
              success: function (res) {
                var openid = res.data.openid
                wx.getUserInfo({
                  success: function (res) {
                    that.setData({
                      hasUserInfo: true,
                      wxInfo: res.userInfo
                    })
                  }
                })
                wx.navigateTo({
                  url: '../logs/login/login?openid=' + openid,
                })
              }
            })

          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
          }
        }
      });
    }else{
      app.ajax.req('web/carts', { user_id: info.id, token: info.token }, function (res) {
        if (res.code == 0 && res.list != null) {
          res.list.forEach(item => {
            if (item.num == 1) {
              item.stopjian = 'not';
            }
            if (item.num == item.store) {
              item.stopjia = 'not';
            }
            if (that.data.checkedStatus == true) {
              item.status = true;
              priceNum += item.total;
            } else {
              item.status = false;
              res.nums = 0;
            }
          });
          that.setData({
            cartList: res.list,
            nums: res.nums,
            priceNum: priceNum.toFixed(2)
          })
        } else if (res.code == 0 && res.list == null) {
          that.setData({
            cartList: "",
            nums: 0,
            priceNum: 0
          })
        } else {
          wx.showToast({
            title: "请重新登录",
            icon: 'loading',
            duration: 2000
          })
          wx.navigateTo({
            url: '../logs/login/login?openid=' + info.openid,
          })
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.viewShow();
  },

  /**
   * 选择商品
   */
  selectProduct:function(event){
    var cartId = event.currentTarget.dataset.id;
    var checkedStatus = event.currentTarget.dataset.status;
    var priceNum = 0;
    var nums = 0;
    var arr = [];   
    var status = '';
    this.data.checkedStatus = true;
    this.data.cartList.forEach(item => {
      if (item.product_id == cartId || cartId == 0) {
        if (checkedStatus == true){
          item.status = false;
        }else{
          item.status = true;
          priceNum += item.total;        
          nums += item.num;
        }
      }else{
        if (item.status == true){
          priceNum += item.total;
          nums += item.num;
        }
      }
      if (item.status == false){
        this.data.checkedStatus = false;
      }
    });
    this.setData({
      cartList: this.data.cartList,
      checkedStatus: this.data.checkedStatus,
      priceNum: priceNum.toFixed(2),
      nums: nums
    });
  },
  /**
   * 改变商品数量
   */
  changeNumber:function(event) {
    var cartId = event.currentTarget.dataset.id;
    var optType = event.currentTarget.dataset.type;
    var priceNum = 0;
    var nums = 0;
    this.data.cartList.forEach(item => {
      if (item.product_id == cartId) {
        if (optType == 'min') {
          if(item.num <= 1){
            wx.showToast({
              title: '不能再少了',
              icon: 'success',
              duration: 2000
            })
            item.stopjian = 'not';
          }else{
            item.num--;
            item.total = item.sell_price * item.num;
            item.stopjian = '';
            item.stopjia = '';
          }
        }else{
          if (item.num >= item.store){
            wx.showToast({
              title: '不能购买更多了',
              icon: 'success',
              duration: 2000
            })
            item.stopjia = 'not';
          }else{
            item.num++;
            item.total = item.sell_price * item.num;
            item.stopjian = '';
            item.stopjia = '';
          }
        }
      }
      priceNum += item.total;
      nums += item.num;
    });
    this.setData({
      cartList: this.data.cartList,
      priceNum: priceNum.toFixed(2),
      nums:nums,
    });
  },
  touchS: function (e) {
    if (e.touches.length == 1) {
      this.setData({
        //设置触摸起始点水平方向位置  
        startX: e.touches[0].clientX
      });
    }
  },
  touchM: function (e) {
    if (e.touches.length == 1) {
      //手指移动时水平方向位置  
      var moveX = e.touches[0].clientX;
      //手指起始点位置与移动期间的差值  
      var disX = this.data.startX - moveX;
      var delBtnWidth = this.data.delBtnWidth;
      var txtStyle = "";
      if (disX == 0 || disX < 0) {//如果移动距离小于等于0，文本层位置不变  
        txtStyle = "left:0rpx";
      } else if (disX > 0) {//移动距离大于0，文本层left值等于手指移动距离  
        txtStyle = "left:-" + disX + "px";
        if (disX >= delBtnWidth) {
          //控制手指移动距离最大值为删除按钮的宽度  
          txtStyle = "left:-" + delBtnWidth + "px";
        }
      }
      //获取手指触摸的是哪一项  
      var index = e.currentTarget.dataset.index;
      var list = this.data.cartList;
      list.forEach(item => {
        item.txtStyle = ""
      })
      this.setData({
        cartList: list,
      })
      list[index].txtStyle = txtStyle
      //更新列表的状态  
      this.setData({
        cartList: list,
      })
    }
  },
  touchE: function (e) {
    if (e.changedTouches.length == 1) {
      //手指移动结束后水平位置  
      var endX = e.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离  
      var disX = this.data.startX - endX;
      var delBtnWidth = this.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮  
      var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "px" : "left:0px";
      //获取手指触摸的是哪一项  
      var index = e.currentTarget.dataset.index;
      var list = this.data.cartList;

      list.forEach(item => {
        item.txtStyle = ""
      })
      this.setData({
        cartList: list,
      })
      list[index].txtStyle = txtStyle;
      //更新列表的状态  
      this.setData({
        cartList: list
      });
    }
  },
  //获取元素自适应后的实际宽度  
  getEleWidth: function (w) {
    var real = 0;
    try {
      var res = wx.getSystemInfoSync().windowWidth;
      var scale = (750 / 2) / (w / 2);//以宽度750px设计稿做宽度的自适应  
      real = Math.floor(res / scale);
      return real;
    } catch (e) {
      return false;
    }
  },
  initEleWidth: function () {
    var delBtnWidth = this.getEleWidth(this.data.delBtnWidth);
    this.setData({
      delBtnWidth: delBtnWidth
    });
  },
  delItem: function (e) {
    var that = this
    var id = e.currentTarget.dataset.id;
    var info = wx.getStorageSync('loginInfo');
    wx.showModal({
      title: '删除商品',
      content: '确定要删除商品吗？',
      success: function (res) {
        if (res.confirm) {
          var url = 'web/del_cart';
          var data = { 'user_id': info.id, 'id_list': [id], 'act_type': 0, token: info.token };
          app.ajax.req(url, data, function (res) {
            if (res.code === 0) {

              wx.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 2000,
                complete: function () {
                  setTimeout((function callback() {
                    that.onShow()
                  }).bind(this), 1000)
                }
              })

            } else {
              wx.showToast({
                title: res.msg,
                image: '/images/msg.png',
                duration: 2000
              })
              setTimeout((function callback() {
                that.onLoad()
              }).bind(this), 1000);
            }
          })
        }
      }
    })
  },
  settle: function(e){
    var param = [];
    var that =this
    if (that.data.cartList.length != 0){
      that.data.cartList.forEach(item => {
        if (item.status) {
          var arr = {
            good_id: "",
            product_id: "",
            num: ""
          };
          arr.good_id = item.good_id;
          arr.product_id = item.product_id;
          arr.num = item.num;
          param.push(arr);
        }
      });
    }
    if(param.length == 0){
      wx.showToast({
        title: '请选择购买商品',
        image: '/images/msg.png',
        duration: 2000
      })
      return false;
    }
    wx.setStorageSync('param', param);
    wx.navigateTo({
      url: '../order/firm-order/firm-order'
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
    this.viewShow();
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