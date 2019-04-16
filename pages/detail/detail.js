//商品详情页面
const ajax = require('../../utils/ajax.js');
var app = getApp();
var imgUrls = [];  
var detailImg = [];
var goodsId = null;
var goods = null;
var paygoods = null;
Page({

  data: {
    like:null,//用户是否收藏
    showDialog: false,//弹出选择数量的小框
    goods:null,//商品信息
    paygoods:null,//传递给支付页面的商品信息
    indicatorDots: true, //是否显示面板指示点
    autoplay: true, //是否自动切换
    interval: 3000, //自动切换时间间隔,3s
    duration: 1000, //  滑动动画时长1s
  },
  //页面加载,上级页面传过来的商品id加载信息
  onLoad: function (options) {
    console.log('页面加载')
    goodsId = options.goodsId;
    this.goodsInfoShow();
  },
  //页面卸载,清除页面数据
  onUnload:function() {
    console.log('页面卸载,清除页面数据')
    imgUrls = [];
    detailImg = [];
    goodsId = null;
    goods = null;
  },
  //通过商品id请求商品信息
  goodsInfoShow: function (success) {
    console.log('向服务器请求商品信息')
    var that = this;
    ajax.request({
      method: 'GET',
      url: 'getgoodsdetail.php?userid=' + app.globalData.userid + '&goodsid=' + goodsId,
      success: data => {
        var goodsItem = data.result;
        for (var i = 0; i < goodsItem.shopGoodsImageList.length; i++) {  
          imgUrls[i] = goodsItem.shopGoodsImageList[i];  
        }
        for (var j = 0; j < goodsItem.shopGoodsDetailList.length; j++) { 
          detailImg[j] = goodsItem.shopGoodsDetailList[j];
        }
        goods = {
          imgUrls: imgUrls,//幻灯片
          name: goodsItem.name,//商品名字
          price: goodsItem.price,//商品价格
          title: goodsItem.title,//商品简介
          detailImg: detailImg, //商品详情图片
          imgUrl: goodsItem.imgurl,//商品介绍图片
          buyRate: goodsItem.buyRate,//商品销量
          goodsId: goodsId,//商品id
          count:1,//选择数量
          totalMoney: goodsItem.price,//商品总价
        } 
        that.setData({
          goods : goods
        })
        that.setData({
          like: goodsItem.like//用户收藏
        })
      }
    })
  },
  // 收藏
  addLike() {
    console.log('添加或者取消收藏')
    var that = this;
    ajax.request({
      method: 'GET',
      url: 'setuserlike.php?userid=' + app.globalData.userid + '&goodsid=' + goodsId,
      success: data => {
        if (data == 'ok') {
          that.setData({
            like: true
          })
          wx.showToast({
            title: '收藏成功',
            icon: 'success',
            duration: 2000
          })
        }
        else if (data == 'exit') {
          ajax.request({
            method: 'GET',
            url: 'deleteuserlike.php?userid=' + app.globalData.userid + '&goodsid=' + goodsId,
            success: data => {
              that.setData({
                like: false
              })
              wx.showToast({
                title: '取消成功',
                icon: 'success',
                duration: 2000
              });
            }
          })
        }
      }
    })
  },
  // 立即购买
  immeBuy() {
    console.log('跳转支付页面')
    var that = this;
    paygoods = {
      name: that.data.goods.name,
      price: that.data.goods.price,
      imgUrl: that.data.goods.imgUrl,
      goodsId: that.data.goods.goodsId,
      count: that.data.goods.count,
      totalMoney: that.data.goods.totalMoney,
    }
    that.setData({
      paygoods: paygoods
    })
    wx.navigateTo({ url: '../payorder/payorder?paygoods=' + JSON.stringify(that.data.paygoods) })
  },
  //sku 弹出
  toggleDialog: function () {
    console.log('sku 弹出')
    this.setData({
      showDialog: !this.data.showDialog
    });
  },
  //sku 关闭
  closeDialog: function () {
    console.log('sku 关闭')
    this.setData({
      showDialog: false
    });
  },
  // 减数 
  delCount: function (e) {
    console.log('数量-')
    var count = this.data.goods.count;
    if (count > 1) {
      this.data.goods.count--;
    }
    this.setData({
      goods: this.data.goods
    });
    this.priceCount();
  },
  //加数 
  addCount: function (e) {
    console.log('数量+')
    var count = this.data.goods.count;
    if (count < 10) {
      this.data.goods.count++;
    }
    this.setData({
      goods: this.data.goods
    });
    this.priceCount();
  },
  //价格计算
  priceCount: function (e) {
    this.data.goods.totalMoney = this.data.goods.price * this.data.goods.count;
    this.setData({
      goods: this.data.goods
    })
  },
  //跳转评论页面
  gocomments: function () {
    console.log('跳转评论页面')
    wx.navigateTo({ url: '../comment/comment?goodsId=' + goodsId })
  },
  //加入购物车
  addCar: function (e) {
    console.log('添加购物车')
    var goods = this.data.goods;
    goods.isSelect=false;
    var count = this.data.goods.count;
    var title = this.data.goods.title;
    if (title.length > 13) {
      goods.title = title.substring(0, 13) + '...';
    }

    var arr = wx.getStorageSync('cart') || [];
    if (arr.length > 0) {
      for (var j in arr) {
        if (arr[j].goodsId == goodsId) { 
          arr[j].count = arr[j].count + 1;
          try {
            wx.setStorageSync('cart', arr)
          } catch (e) {
            console.log(e)
          }
          wx.showToast({
            title: '加入购物车成功！',
            icon: 'success',
            duration: 2000
          });
          this.closeDialog();
          return;
        }
      }
      arr.push(goods);
    } else {
      arr.push(goods);
    }
    try {
      wx.setStorageSync('cart', arr)
      wx.showToast({
        title: '加入购物车成功！',
        icon: 'success',
        duration: 2000
      });
      this.closeDialog(); 
      return;
    } catch (e) {
      console.log(e)
    }
  }
})