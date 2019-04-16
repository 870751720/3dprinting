//我的评论页面
const ajax = require('../../utils/ajax.js');
var page = 0;
var app = getApp();
Page({

  data: {
    comments: [],//我的评论数据
  },
  //页面加载
  onLoad: function () {
    this.commentsshow();
  },
  //页面卸载
  onUnload: function () {
    console.log('页面卸载,清空评论数据')
    page = 0;
    this.data.comments = [];
  },
  //向服务器请求我的评论信息
  commentsshow:function() {
    var that = this;
    ajax.request({
      method: 'GET',
      url: 'getusercomments.php?page=' + page + '&userid=' + app.globalData.userid + '&size=10',
      success: data => {
        if (data.comments.length == 0) {
          wx.showToast({
            title: '暂没有更多评论',
            icon: 'none',
            duration: 1000
          })
        }
        else {
          page += 1;
          var commentsdata = that.data.comments;
          for (var i = 0; i < data.comments.length; i++)
            commentsdata.push(data.comments[i]);
          that.setData({
            comments: commentsdata,
          });
        }
        wx.hideNavigationBarLoading();
      }
    })
  },
  //触底加载信息
  onReachBottom: function () {
    console.log('触底加载')
    this.commentsshow();
  },
  //下拉刷新
  onPullDownRefresh: function () {
    console.log('下拉刷新')
    wx.showNavigationBarLoading();
    page = 0;
    this.data.comments = [];
    this.commentsshow();
  },
  //前往商品详情
  gogoodsdetail: function (e) {
    console.log('跳转商品详细页面')
    var goodsId = e.currentTarget.dataset.goodsid;
    wx.navigateTo({ url: '../detail/detail?goodsId=' + goodsId })
  },
})