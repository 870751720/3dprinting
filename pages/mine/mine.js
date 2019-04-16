//用户界面
const ajax = require('../../utils/ajax.js');
var app = getApp() ;
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    orderItems: [
      {
        typeId: 0,
        name: '待发货',
        url: 'bill',
        imageurl: '../../images/person/personal_del.png',
      },
      {
        typeId: 1,
        name: '待收货',
        url: 'bill',
        imageurl: '../../images/person/personal_receipt.png',
      },
      {
        typeId: 2,
        name: '待评价',
        url: 'bill',
        imageurl: '../../images/person/personal_comment.png'
      }
    ],
  },
  //前往选中类别的订单
  toOrder: function (e) {
    console.log('前往选中类别的订单')
    var index = e.currentTarget.dataset.index + 1
    wx.navigateTo({
      url: '../orders/orders?index=' + index
    })
  },
  //查看全部订单
  toallOrder: function () {
    console.log('查看全部订单')
    wx.navigateTo({
      url: '../orders/orders?index=' + 0
    })
  },
  //加载用户信息
  onLoad: function () { 
    console.log('加载用户信息')   
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }

    } else {
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })  
        }
      })
    }
  },
  //获得用户信息
  getUserInfo: function (e) {
    console.log('获得用户信息')
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    ajax.request({
      method: 'GET',
      url: 'setusername.php?id=' + app.globalData.userid + '&name=' + this.data.userInfo.nickName,
      success: data => {}
    }) 
  },
  //前往收藏页面
  gocollection: function () {
    console.log('前往收藏页面')
    wx.navigateTo({ url: '../collection/collection'})
  },
  //前往客服页面
  gochat: function () {
    console.log('前往客服页面')
    wx.navigateTo({ url: '../chat/chat' })
  },
  //前往我的评论页面
  gomycomments: function () {
    console.log('前往我的评论页面')
    wx.navigateTo({ url: '../mycomments/mycomments' })
  },
  //前往售后页面
  goaftersalerecord: function () {
    console.log('前往售后页面')
    wx.navigateTo({ url: '../aftersalerecord/aftersalerecord' })
  },
  //前往收货地址页面
  myAddress:function(e){
    console.log('前往收货地址页面')
    wx.navigateTo({ url: '../addressList/addressList' });
  }
})