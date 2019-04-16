//商品评论页面
const ajax = require('../../utils/ajax.js');
var page = 0;
Page({

  data: {
    goodsId:null,//商品id
    comments:[],//关于商品的评论
  },
  //页面加载
  onLoad: function (options) {
    this.data.goodsId = options.goodsId;
    this.commentsshow();
  },
  onUnload:function(){
    page = 0;
    this.data.comments = [];
  },
  //向服务器请求评论信息
  commentsshow: function () {
    console.log('向服务器请求评论信息')
    var that = this;
    ajax.request({
      method: 'GET',
      url: 'getuserscomments.php?page=' + page + '&goodsId=' + that.data.goodsId + '&size=10',
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
})