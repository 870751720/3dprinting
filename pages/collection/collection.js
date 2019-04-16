//收藏页面
const ajax = require('../../utils/ajax.js');
var app = getApp();
var page = 0;
Page({

  data: {
    userlike: [],//收藏商品信息
  },
  //加载收藏的商品信息
  onLoad: function (options) {
    this.collectionShow();
  },
  //监听页面卸载,清空页面信息
  onUnload: function () {
    console.log('页面卸载')
    var that = this;
    that.setData({
      userlike: []
    })
  }, 
  //向服务器请求收藏信息
  collectionShow: function () {
    console.log('向服务器请求收藏信息')
    var that = this;
    ajax.request({
      method: 'GET',
      url: 'getuserlike.php?page=' + page + '&userid=' + app.globalData.userid + '&size=10 ',
      success: data => {
        if (data.result.length == 0) {
          wx.showToast({
            title: '暂没有更多数据',
            icon: 'none',
            duration: 1000
          })
        }
        else {
          page += 1;
          var like = that.data.userlike;
          for (var i = 0; i < data.result.length; i++)
            like.push(data.result[i]);
          that.setData({
            userlike: like,
          });
        }
        wx.hideNavigationBarLoading();
      }
    })
  },
  //触底加载信息
  onReachBottom: function () {
    console.log('触底加载')
    this.collectionShow();
  },
  //下拉刷新
  onPullDownRefresh: function () {
    console.log('下拉刷新')
    wx.showNavigationBarLoading();
    page = 0;
    this.data.userlike = [];
    this.collectionShow();
  },
  //查看商品详情
  gogoodsdetail: function (e) {
    console.log('跳转商品详情')
    var that = this;
    var goodsId = e.currentTarget.dataset.goodsid;
    wx.navigateTo({ url: '../detail/detail?goodsId=' + goodsId })
  },
})