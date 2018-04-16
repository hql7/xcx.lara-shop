// pages/mine/myCollection.js
//获取应用实例
const app = getApp()
Page({
    data: {
      delBtnWidth: 80,//删除按钮宽度单位（rpx）  
      color: "#333333",
      hasMore: false,
      hasRefesh: false,
      page: 1,
      height: '',
      list: []
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function () {
      var that = this;
      var info = wx.getStorageSync('loginInfo');
      wx.getSystemInfo({
        success: function (res) {
          that.setData({
            height: res.windowHeight
          });
        }
      });
      app.ajax.req('web/my_attention', { user_id: info.id, token: info.token, collect_type: 0, good_type:0 }, function (res) {
        if (res.code == 0) {
          that.setData({
            list: res.list,
            height: res.list.length * 220
          })
        }
        if (res.code == 1) {
          wx.showModal({
            title: '信息获取失败',
            content: '请稍候再试。。。。。',
            success: function (res) {
              wx.navigateBack();
            }
          })
        }
      })
    },
    //加载更多
    loadMore: function (e) {
      var info = wx.getStorageSync('loginInfo');
      var that = this;
      that.setData({
        hasRefesh: true,
      });
      if (!that.data.hasMore) return
      var pgCur = ++that.data.page;
      app.ajax.req('web/my_attention', { user_id: info.id, index: pgCur, token: info.token}, function (res) {
        if (res.fy_pgCount == pgCur) {
          that.setData({
            hasMore: false
          });
        }
        if (res.code == 0) {
          that.setData({
            list: that.data.list.concat(res.list),
            hasRefesh: false
          });
        }
      })
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
        var list = this.data.list;
        list.forEach(item => {
          item.txtStyle = ""
        })
        this.setData({
          list: list,
        })
        list[index].txtStyle = txtStyle
        //更新列表的状态  
        this.setData({
          list: list,
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
        var list = this.data.list;

        list.forEach(item => {
          item.txtStyle = ""
        })
        this.setData({
          list: list,
        })
        list[index].txtStyle = txtStyle;
        //更新列表的状态  
        this.setData({
          list: list
        });
      }
    },
    //获取元素自适应后的实际宽度  
    getEleWidth: function (w) {
      var real = 0;
      try {
        var res = wx.getSystemInfoSync().windowWidth;
        var scale = (750 / 2) / (w / 2);//以宽度750px设计稿做宽度的自适应  
        // console.log(scale);  
        real = Math.floor(res / scale);
        return real;
      } catch (e) {
        return false;
        // Do something when catch error  
      }
    },
    initEleWidth: function () {
      var delBtnWidth = this.getEleWidth(this.data.delBtnWidth);
      this.setData({
        delBtnWidth: delBtnWidth
      });
    },
    delItem: function (e) {
      var that = this;
      var id = e.currentTarget.dataset.id;
      var product_id = e.currentTarget.dataset.product_id;    
      var info = wx.getStorageSync('loginInfo');
      wx.showModal({
        title: '删除收藏',
        content: '确定要删除收藏吗？',
        success: function (res) {
          if (res.confirm) {
            var url = 'web/del_attention';
            var data = { user_id: info.id, good_id: id, product_id: product_id, token: info.token };
            app.ajax.req(url, data, function (res) {
              if (res.code === 0) {
                wx.showToast({
                  title: '删除成功',
                  icon: 'success',
                  duration: 2000,
                  complete:function(){
                    that.onLoad();
                  }
                })
              } else {
                wx.showToast({
                  title: res.msg,
                  image: '/images/msg.png',
                  duration: 2000
                })
              }
            })
          }
        }
        })
    },
    goods: function (e) {
      var id = e.currentTarget.dataset.id
      wx.navigateTo({
        url: '../../goods/reviews/reviews?goods_id=' + id
      })
    },
    addCart: function (e) {
      var id = e.currentTarget.dataset.id;
      var info = wx.getStorageSync('loginInfo');
      app.ajax.req('web/add_cart', { product_id: id, user_id: info.id, token: info.token, num: 1 }, function (res) {
        if (res.code == 0) {
          wx.showToast({
            title: "加入购物车成功",
            icon: 'success',
            duration: 1000
          })
        } else {
          wx.showToast({
            title: '加入购物车失败',
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
      wx.showToast({
        title: 'loading...',
        icon: 'loading'
      })
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

    },

  })