var app = getApp();
// pages/order/my-order/firm-order.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    items: [
      { name: '0', value: '否', checked: 'true' },
      { name: '1', value: '是'},
    ],
    type: [
      { name: '0', value: '个人' },
      { name: '1', value: '企业', checked: 'true' }
    ],
    address: '',
    sj: 1,
    invoiceName:'',
    goods: [],
    prom_orders: [],
    amount_info: [],
    vouchers: [],
    voucher_id: '',
    winHeight: 0,

    sj_status:false,
    voucher_status:false,
    porm_status:false,
    porm_money:0,
    voucher_money: 0,
    sj_money:0,
    ship_money:0,
    goods_money:0,
    amount_money:0,


    flag: true,
    flag2: true,
    flag3: true,
    userPoint: true,
    unuserPoint: false,
    status: false,
    tax_invoice:''
  },
  select_fp:function(e){
    var that = this;
    var value = e.currentTarget.dataset.value;
    var items = this.data.items;
    var sj = this.data.sj;
    var sj_status = false;
    var sj_money = 0;
    if (value == 0) {
      items[0].checked = true;
      items[1].checked = '';
      sj = 0;
    } else {
      items[0].checked = '';
      items[1].checked = true;
      sj = 1;
      sj_status = true;
    }
    var amount_money = parseFloat(that.data.goods_money + that.data.ship_money);
    if (sj_status == true) {
      sj_money = parseFloat(that.data.goods_money * that.data.tax_invoice / 100)
      amount_money += sj_money;
    }
    if (that.data.voucher_status == true) {
      amount_money -= parseFloat(that.data.voucher_money);
    }
    if (that.data.porm_status == true) {
      amount_money -= parseFloat(that.data.porm_money);
    }
    this.setData({
      items: items,
      sj: sj,
      sj_status: sj_status,
      sj_money:parseFloat(sj_money).toFixed(2),
      amount_money: parseFloat(amount_money).toFixed(2)
    })
  },
  // 点击显示优惠券弹出框
  btnShow: function () {
    this.setData({
      flag: (!this.data.flag)
    })
  },
  // 点击显示积分弹出框
  btnShow2: function () {
    this.setData({
      flag2: (!this.data.flag2)
    })
  },
  // 点击显示促销活动弹出框
  btnShow3: function () {
    this.setData({
      flag3: (!this.data.flag3)
    })
  },

  // 选择积分
  selectPoint: function () {
    this.setData({
      userPoint: (!this.data.userPoint)
    })
    this.setData({
      unuserPoint: (!this.data.unuserPoint)
    })
  },
  // 验证是否选择发票
  // validate: function (e) {
  //   if (e.detail.value == "") {
  //     wx.showToast({
  //       title: '是否索要发票',
  //       image: '../../../images/wrong.png',
  //       duration: 3000
  //     })
  //     this.setData({
  //       status: false
  //     })
  //   } else {
  //     this.setData({
  //       status: true
  //     })
  //   }
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.WxValidate = app.WxValidate(
        {
          co_inv: {
            required: true
          },
          co_inv_tp: {
            required: true,
          },
          order_title: {
            required: true
          },
          order_number: {
            number: true,
            minlength: 15,
            maxlength: 20,
            required: true
          }
        },
        {
          co_inv: {
            required: "请填写发票信息"
          },
          co_inv_tp: {
            required: "请勾选发票抬头类型"
          },
          order_title: {
            required: "请输入发票抬头"
          },
          order_number: {
            number: "请输入合法数字",
            minlength: "纳税人识别号不能小于15位",
            maxlength: "纳税人识别号不能大于20位",
            required: "请输入纳税人识别号"
          }
        }
      )
      this.WxValidate1 = app.WxValidate(
        {
          co_inv: {
            required: true
          },
          co_inv_tp: {
            required: true,
          },
          order_title: {
            required: true
          }
        },
        {
          co_inv: {
            required: "请填写发票信息"
          },
          co_inv_tp: {
            required: "请勾选发票抬头类型"
          },
          order_title: {
            required: "请输入发票抬头"
          }
        }
      )
    
    var that = this;
    var info = wx.getStorageSync('loginInfo');
    // 获取系统信息
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winHeight: res.windowHeight
        });
      }
    });
    app.ajax.req('web/config_info', {'title':'shopping'}, function (res) {
      that.setData({
        tax_invoice: res.info.tax_invoice
      })
    })
    
    var url = "web/wx_order_confirm";
    var addr_id = options.addr_id;
    var param = wx.getStorageSync('param');
    var data = { 'user_id': info.id, 'param': param, 'addr_id': addr_id, 'token': info.token }
    app.ajax.req(url, data, function (res) {
      if (res.code == 0) {
        if (res.address.length == 0) {
          wx.showModal({
            content: '你未设置收货地址，请设置',
            confirmText: '设置地址',
            success: function (res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '../../mine/addressEdit/addressEdit',
                })
              }
            }
          })
        } else {
          that.setData({
            address: res.address,
            goods: res.goods,
            amount_info: res.amount_info,
            prom_orders: res.prom_orders,
            vouchers: res.vouchers,
            goods_money: parseFloat(res.amount_info.total_price),
            ship_money: parseFloat(res.amount_info.total_ship),
            amount_money: parseFloat(res.amount_info.total_price + res.amount_info.total_ship).toFixed(2)
          })
        }

      } else if (res.code == 4) {
        wx.navigateTo({
          url: '../../mine/accountPass/accountPass',
        })
      } else {
        wx.showToast({
          title: res.msg,
          image: '/images/msg.png',
          duration: 2000,
          complete: function () {
            setTimeout((function callback() {
              wx.navigateBack({
                delta: 1
              })
            }).bind(this), 1000)
          }
        })
      }
    })
  },
  checkboxChange:function(e){
    var value = e.currentTarget.dataset.value;
    var type = this.data.type;
    if (value == 0) {
      type[0].checked = true;
      type[1].checked = '';
    } else {
      type[0].checked = '';
      type[1].checked = true;
    }
    this.setData({
      type: type
    })
  },
  
  formSubmit: function (e) {
    var that = this;
    var info = wx.getStorageSync('loginInfo');
    var url = "web/create_order";
    if (e.detail.value.co_inv == 0) {
      var invoice = " ";
    } else {
      if (this.data.sj==1&&this.data.type[0].checked == true){
        if (!this.WxValidate1.checkForm(e)) {
          var error = this.WxValidate1.errorList[0]
          wx.showToast({
            title: error.msg,
            image: '../../../images/wrong.png',
            duration: 2000
          })
          return false
        }
      }
      if (this.data.sj == 1 && this.data.type[1].checked == true) {
        if (!this.WxValidate.checkForm(e)) {
          var error = this.WxValidate.errorList[0]
          wx.showToast({
            title: error.msg,
            image: '../../../images/wrong.png',
            duration: 2000
          })
          return false
        }
      }
      var invoice = e.detail.value.co_inv_tp + ":" + e.detail.value.order_title + ":" + e.detail.value.order_number;
    }
    var data = {
      "user_id": info.id,
      "addr_id": e.detail.target.dataset.addr_id,
      "voucher_id": this.data.voucher_id,
      "token": info.token,
      "prom_order_id": this.data.porm_id,
      "use_point": 0,
      'param': wx.getStorageSync('param'),
      "invoice": invoice,
    }
    app.ajax.req(url, data, function (res) {
      var price = '';
      if (res.code == 0) {
        app.globalData.param = [];
        if (that.data.sj == 1 && that.data.items[1].checked == true){
          price = res.order_info.real_price*1 + res.order_info.real_price * that.data.tax_invoice/100 + that.data.amount_info.total_ship;
        }else{
          price = res.order_info.real_price * 1 + that.data.amount_info.total_ship;
        }
        wx.navigateTo({
          url: '../../order/pay/pay?oid=' + res.order_info.id + '&no=' + res.order_info.no + '&money=' + price
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
  useVoucher: function (e) {
    var that = this;
    var amount_money = that.data.goods_money +that.data.ship_money;
    if (that.data.sj_status == true){
      amount_money += parseFloat(that.data.sj_money);
    }
    if (that.data.porm_status == true) {
      amount_money -= parseFloat(that.data.porm_money);
    }
    this.setData({
      flag: (!this.data.flag),
      voucher_id: e.currentTarget.dataset.voucher_id,
      voucher_money: e.currentTarget.dataset.money.toFixed(2),
      voucher_status:true,
      amount_money: parseFloat(amount_money - e.currentTarget.dataset.money).toFixed(2)
    })
  },
  // 使用订单促销
  useProm: function (e) {
    var that = this;
    var type = e.currentTarget.dataset.type;
    var expression = e.currentTarget.dataset.expression;
    var porm_id = e.currentTarget.dataset.porm_id;
    var amount_money = that.data.goods_money + that.data.ship_money;
    var porm_money = 0;
    if (type == 0){
      porm_money = parseFloat(amount_money) * (100-parseFloat(expression)) / 100;
    }else if(type == 1){
      porm_money = parseFloat(amount_money) - parseFloat(expression)
    }

    if (that.data.sj_status == true) {
      amount_money += parseFloat(that.data.sj_money);
    }
    if (that.data.voucher_status == true) {
      amount_money -= parseFloat(that.data.voucher_money);
    }
    that.setData({
      flag3: (!that.data.flag3),
      porm_id: e.currentTarget.dataset.voucher_id,
      porm_status: true,
      porm_id: porm_id,
      porm_money: porm_money.toFixed(2),
      amount_money: parseFloat(amount_money-porm_money).toFixed(2)
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