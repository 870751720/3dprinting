//首页
const ajax = require('../../utils/ajax.js');
var sectionData = [];
var page = 0;
Page({

  data: {
    navbars:null,//分类导航
    currentTab: 0,//分类选择
    banners:null,//置顶广告
    Goods:null,//商品信息
    indicatorDots: true, //是否显示面板指示点
    autoplay: true, //是否自动切换
    interval: 3000, //自动切换时间间隔,3s
    duration: 1000, //  滑动动画时长1s
  },
  //页面加载
  onLoad: function () {
    console.log('页面加载')
    this.navbarShow();
    this.bannerShow();
    this.GoodsShow();
  },
  //分类向服务器请求
  navbarShow:function(){
    console.log('分类向服务器请求')
    var that = this;
    ajax.request({
      method: 'GET',
      url: 'getnavbar.php',
      success: data => {
        that.setData({
          navbars: data.result
        })
      }
    })
  },
  //广告向服务器请求
  bannerShow: function () {
    console.log('广告向服务器请求')
    var that = this;
    ajax.request({
      method: 'GET',
      url: 'getbanners.php',
      success: data => {
        that.setData({
          banners: data.result
        })
      }
    })
  },
  //商品信息向服务器请求
  GoodsShow: function () {
    console.log('商品信息向服务器请求')
    var that = this;
    ajax.request({
      method: 'GET',
      url: 'gethomegoods.php?page=' + page + '&navbarid=' + that.data.currentTab + '&size=10 ',
      success: data => {
        var GoodsData = data.result;
        page += 1;
        sectionData['Goods'] = GoodsData; 
        that.setData({
          Goods: sectionData['Goods'],
        });
      }
    })
  },
  // 导航切换监听
  navbarTap: function (e) {
    console.log('导航切换监听')
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
    page = 0;
    this.setData({
      Goods: null
    })
    this.GoodsShow();
  },
  //跳转广告商品详细信息
  show: function (e) {
    console.log('跳转广告商品详细信息')
    var that = this;
    var goodsId = e.currentTarget.dataset.goodsid;
    wx.navigateTo({ url: '../detail/detail?goodsId=' + goodsId })
  },
  //跳转商品详细信息
  catchTapCategory: function (e) {
    console.log('跳转商品详细信息')
    var that = this;
    var goodsId = e.currentTarget.dataset.goodsid;
    wx.navigateTo({ url: '../detail/detail?goodsId=' + goodsId })
  },
  //上拉加载商品
  onReachBottom: function () {
    console.log('上拉加载商品')
    var that = this;
    ajax.request({
      method: 'GET',
      url: 'gethomegoods.php?page=' + page + '&navbarid=' + that.data.currentTab + '&size=10 ',
      success: data => {
        var GoodsData = data.result;
        page += 1;
        sectionData['Goods'] = sectionData['Goods'].concat(GoodsData);
        that.setData({
          Goods: sectionData['Goods'],
        });
      }
    })
  },
  //下拉刷新
  onPullDownRefresh:function() {
    console.log('下拉刷新')
    page = 0;
    this.setData({
      Goods: null
    })
    this.GoodsShow();
  }
})