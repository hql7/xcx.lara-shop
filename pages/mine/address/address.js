// pages/mine/address/address.js
var address = require('../../../utils/city.js')
var app = getApp()
var animation
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressList:[],
    display: 'none',
    statusType: true,
    addressInfo:[],
    menuType: 0,
    begin: null,
    status: 1,
    end: null,
    isVisible: false,
    animationData: {},
    animationAddressMenu: {},
    addressMenuIsShow: false,
    value: [0, 0, 0],
    provinces: [],
    citys: [],
    areas: [],
    province: '',
    city: '',
    area: '',
    provinceId: '',
    cityId: '',
    countyId: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var info = wx.getStorageSync('loginInfo');
    app.ajax.req('web/address_list', { user_id: info.id, token: info.token }, function (res) {
      if (res.code == 0) {
        that.setData({
          addressList: res.list
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'loading',
          duration: 2000
        })
      }
    })
    // 初始化动画变量
    var animation = wx.createAnimation({
      duration: 500,
      transformOrigin: "50% 50%",
      timingFunction: 'ease',
    })
    this.animation = animation;
    // 默认联动显示北京
    var id = address.provinces[0].id
    this.setData({
      provinces: address.provinces,
      citys: address.citys[id],
      areas: address.areas[address.citys[id][0].id],
    })
  },
  /**
   * 选择默认地址
   */
  selectProduct: function (event) {
    var addressId = event.currentTarget.dataset.id;
    var status = event.currentTarget.dataset.id;
    var that = this;
    var info = wx.getStorageSync('loginInfo');
    app.ajax.req('web/address_default', { user_id: info.id, address_id: addressId, token: info.token}, function (res) {
      if (res.code == 0) {
        that.data.addressList.forEach(item => {
          if (item.id == addressId) {
            item.is_default = 1;
          } else {
            item.is_default = 0;
          }
        })
        wx.showToast({
          title: res.msg,
          icon: 'success',
          duration: 2000
        })
        setTimeout((function callback() {
          that.onLoad();
        }).bind(this), 1000);
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'loading',
          duration: 2000
        })
      }
    })
    that.setData({
      addressList: that.data.addressList
    });
  },

  // 显示下拉框
  toastShow: function (event) {
    this.setData({
      display: 'block',
      statusType: false
    })
  },

  // 隐藏下拉框
  toastHide: function (event) {
    this.setData({
      display: 'none',
      statusType: true
    })
  },
  /**
   * 信息提交
   */
  formSubmit: function (e) {
    var that = this;
    var sddressInfo = e.detail.value;
    var info = wx.getStorageSync('loginInfo');
    sddressInfo.user_id = info.id;
    sddressInfo.token = info.token;
    sddressInfo.id = e.currentTarget.dataset.id;
    sddressInfo.province = that.data.provinceId;
    sddressInfo.city = that.data.cityId;
    sddressInfo.county = that.data.countyId;
    app.ajax.req('web/address_save',  sddressInfo , function (res) {
      if (res.code == 0) {
        wx.showToast({
          title: res.msg,
          icon: 'loading',
          duration: 2000
        })
        setTimeout((function callback() {
          wx.redirectTo({
            url: '../address/address',
          })         
        }).bind(this), 1000);
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'loading',
          duration: 2000
        })
      }
    })
  },
  /**
   * 地址信息修改
   */
  addressEdit: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var info = wx.getStorageSync('loginInfo');
    app.ajax.req('web/address_edit', { user_id: info.id, address_id: id, token: info.token}, function (res) {
      if (res.code == 0) {
        that.setData({
          addressInfo: res.info,
          provinceId: res.info.province_id,
          cityId: res.info.city_id,
          countyId: res.info.county_id,
          display: 'block',
          statusType: false
        })
      }
    })
  },
  /**
   * 地址信息删除
   */
  addresssDel: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var info = wx.getStorageSync('loginInfo');
    app.ajax.req('web/address_del', { user_id: info.id, address_id: id, token: info.token }, function (res) {
      if(res.code == 0){
        wx.showToast({
          title: res.msg,
          icon: 'loading',
          duration: 2000
        })
        setTimeout((function callback() {
          that.onLoad();
        }).bind(this), 1000);
      }else{
        wx.showToast({
          title: res.msg,
          image: '/images/msg.png',
          duration: 2000
        })
      }
    })
  },
  // 显示
  showMenuTap: function (e) {
    //获取点击菜单的类型 1点击状态 2点击时间 
    var menuType = e.currentTarget.dataset.type
    // 如果当前已经显示，再次点击时隐藏
    if (this.data.isVisible == true) {
      this.startAnimation(false, -200)
      return
    }
    this.setData({
      menuType: menuType
    })
    this.startAnimation(true, 0)
  },
  hideMenuTap: function (e) {
    this.startAnimation(false, -200)
  },
  // 执行动画
  startAnimation: function (isShow, offset) {
    var that = this
    var offsetTem
    if (offset == 0) {
      offsetTem = offset
    } else {
      offsetTem = offset + 'rpx'
    }
    this.animation.translateY(offset).step()
    this.setData({
      animationData: this.animation.export(),
      isVisible: isShow
    })
  },
  // 选择状态按钮
  selectState: function (e) {
    this.startAnimation(false, -200)
    var status = e.currentTarget.dataset.status
    this.setData({
      status: status
    })
  },
  // 点击所在地区弹出选择框
  selectDistrict: function (e) {
    var that = this
    if (that.data.addressMenuIsShow) {
      return
    }
    that.startAddressAnimation(true)
  },
  // 执行动画
  startAddressAnimation: function (isShow) {
    var that = this
    if (isShow) {
      that.animation.translateY(0 + 'vh').step()
    } else {
      that.animation.translateY(40 + 'vh').step()
    }
    that.setData({
      animationAddressMenu: that.animation.export(),
      addressMenuIsShow: isShow,
    })
  },
  // 点击地区选择取消按钮
  cityCancel: function (e) {
    this.startAddressAnimation(false)
  },
  // 点击地区选择确定按钮
  citySure: function (e) {
    var that = this
    var city = that.data.city
    var value = that.data.value
    that.startAddressAnimation(false)
    // 将选择的城市信息显示到输入框
    var areaInfo = that.data.provinces[value[0]].name + ' ' + that.data.citys[value[1]].name + ' ' + that.data.areas[value[2]].name
    that.setData({
      areaInfo: areaInfo,
      provinceId: that.data.provinces[value[0]].id,
      cityId: that.data.citys[value[1]].id,
      countyId: that.data.areas[value[2]].id
    })
  },
  hideCitySelected: function (e) {

    this.startAddressAnimation(false)
  },
  // 处理省市县联动逻辑
  cityChange: function (e) {
    var value = e.detail.value
    var provinces = this.data.provinces
    var citys = this.data.citys
    var areas = this.data.areas
    var provinceNum = value[0]
    var cityNum = value[1]
    var countyNum = value[2]
    if (this.data.value[0] != provinceNum) {
      var id = provinces[provinceNum].id
      this.setData({
        value: [provinceNum, 0, 0],
        citys: address.citys[id],
        areas: address.areas[address.citys[id][0].id],
      })
    } else if (this.data.value[1] != cityNum) {
      var id = citys[cityNum].id
      this.setData({
        value: [provinceNum, cityNum, 0],
        areas: address.areas[citys[cityNum].id],
      })
    } else {
      this.setData({
        value: [provinceNum, cityNum, countyNum]
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