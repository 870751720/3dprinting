//详细分类页面
const ajax = require('../../utils/ajax.js');
var classifyId = null;
var smallclassifyId = null;
var page = 0;

Page({

  data: {
    Goods: [],//商品信息
  },
  //用上级页面传来的分类来加载商品
  onLoad: function (options) {
    console.log('用上级页面传来的分类来加载商品')
    classifyId = options.classifyId;
    smallclassifyId = options.smallclassifyId;
    this.GoodsShow();
  },
  //监听页面卸载,数据清空
  onUnload: function () {
    classifyId = null;
    smallclassifyId = null;
    page = 0;
    this.data.Goods = [];
  },
  //向服务器请求商品信息
  GoodsShow: function () {
    console.log('向服务器请求商品信息')
    var that = this;
    ajax.request({
      method: 'GET',
      url: 'getclassifygoods.php?page=' + page + '&classifyId=' + classifyId + '&smallclassifyId=' + smallclassifyId + '&size=10 ',
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
          var goods = that.data.Goods;
          for (var i = 0; i < data.result.length; i++)
            goods.push(data.result[i]);
          that.setData({
            Goods: goods,
          });
        }
        wx.hideNavigationBarLoading();
      }
    })
  },
  //触底加载信息
  onReachBottom: function () {
    console.log('触底加载')
    this.GoodsShow();
  },
  //下拉刷新
  onPullDownRefresh: function () {
    console.log('下拉刷新')
    wx.showNavigationBarLoading();
    page = 0;
    this.data.Goods = [];
    this.GoodsShow();
  },
  //查看商品详情
  catchTapCategory: function (e) {
    console.log('跳转到商品详情')
    var goodsId = e.currentTarget.dataset.goodsid;
    wx.navigateTo({ url: '../detail/detail?goodsId=' + goodsId })
  },
})
