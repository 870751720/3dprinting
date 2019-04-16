//订单查看页面
const ajax = require('../../utils/ajax.js');
var page = 0;
var sectionData = [];
var app = getApp();
Page({

  data: {
    navbar:["全部","待发货","待收货","待评价"],
    currentTab: 0,
    orders:[],
    paygoods:[],
    statetitleright:["订单完成","催单","确认收货","前去评价","退单中","退单失败","退单成功"],
    statetitleleft:["欢迎惠顾","退单","查看物流","退单","取消退单","重新申请","订单完成"]
  },
  //订单信息加载
  onLoad: function (options) {
    console.log('加载上级页面查询的订单信息')
    this.setData({
      currentTab: options.index
    })  
    this.ordersshow();
  },
  //页面显示
  onShow:function(){
    this.flush();
  },
  //监听页面卸载
  onUnload:function(){
    console.log('页面卸载,数据清空')
    page=0;
    this.setData({
      orders: null
    })
  },
  //导航切换监听
  navbarTap: function (e) {
    console.log('导航切换')
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
    page = 0;
    this.setData({
      orders: null
    })
    this.ordersshow();
  },
  //向服务器请求订单信息
  ordersshow:function(){
    console.log('向服务器请求订单信息')
    var that = this;
    ajax.request({
      method: 'GET',
      url: 'getorder.php?page=' + page + '&index=' + that.data.currentTab + '&userid=' + app.globalData.userid + '&size=10 ',
      success: data => {
        var Order = data.result;
        var arr=[];
        page += 1;
        sectionData['orders'] = Order;
        that.setData({
          orders: sectionData['orders'],
        });
        for (var i = 0; i < that.data.orders.length;i++){
          arr.push(JSON.parse(that.data.orders[i].paygoods))
        }
        that.setData({
          paygoods: arr,
        });
      }
    })  
  },
  //上拉触底
  onReachBottom: function () {
    console.log('上拉触底')
    var that = this;
    ajax.request({
      method: 'GET',
      url: 'getorder.php?page=' + page + '&index=' + that.data.currentTab + '&userid=' + app.globalData.userid + '&size=10 ',
      success: data => {
        if(data.result != null){
        var Orders = data.result;
        page += 1;
        sectionData['orders'] = sectionData['orders'].concat(Orders);
        for (var i = 0; i < that.data.orders.length; i++) {
          arr.push(JSON.parse(that.data.orders[i].paygoods))
        }
        that.setData({
          paygoods: arr,
        });
      }
      }
    })
  }, 
  //刷新页面
  flush:function(){
    console.log('刷新当前页面')
    page = 0;
    this.setData({
      orders: null
    })
    this.ordersshow();
  },
  //下拉刷新
  onPullDownRefresh:function(){
    console.log('下拉刷新页面')
    this.flush();
  },
  //左边选项功能实现
  leftways:function(e){
    var index = e.currentTarget.dataset.index;
    var that =this;
    if (that.data.orders[index].state == 1 || that.data.orders[index].state == 3 || that.data.orders[index].state == 5) { 
      console.log('退单')
      wx.showModal({
        title: '提示',
        content: '确认退单',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../aftersale/aftersale?order=' + JSON.stringify(that.data.orders[index])
            })
          }
        }
      })
    }
    else if (that.data.orders[index].state == 2) { 
      console.log('查看物流')
      wx.navigateTo({
        url: '../logistics/logistics?couriernumber=' + that.data.orders[index].couriernumber + ' &company=' + that.data.orders[index].company
      })
    }
    else if (that.data.orders[index].state == 4) {
      wx.showModal({
        title: '提示',
        content: '确认取消退单',
        success: function (res) {
          if (res.confirm) {
            ajax.request({
              method: 'GET',
              url: 'setnotreturn.php?orderid=' + that.data.orders[index].orderid + '&returnstate=' + that.data.orders[index].returnstate,
              success: data => {
                that.flush();
                wx.showToast({
                  title: data,
                  icon: 'none',
                  duration: 1000
                })  
              }
            })
          }
        }
      })
     }
   
  },
  //右边功能实现
  rightways:function(e){
    var that =this;
    var index = e.currentTarget.dataset.index;
    if(that.data.orders[index].state ==1){
      console.log('催单')
      wx.showModal({
        title: '提示',
        content: '确认催单',
        success: function (res) {
          if (res.confirm) {
            ajax.request({
              method: 'GET',
              url: 'seturged.php?orderid=' + that.data.orders[index].orderid,
              success: data => {
                wx.showToast({
                  title: data,
                  icon: 'none',
                  duration: 1000
                }) 
              }
            })
          }
        }
      })
    }
    else if (that.data.orders[index].state == 2){
      console.log('收货')
      wx.showModal({
        title: '提示',
        content: '确认收货',
        success: function (res) {
          if (res.confirm) {
            ajax.request({
              method: 'GET',
              url: 'setreceive.php?orderid=' + that.data.orders[index].orderid,
              success: data => {
                that.flush();
                wx.showToast({
                  title: data,
                  icon: 'none',
                  duration: 1000
                })
              }
            })
          }
        }
      })
    }
    else if (that.data.orders[index].state == 3) {
      console.log('前往评价页面')
      wx.navigateTo({ url: '../setcomment/setcomment?paygoods=' + JSON.stringify(that.data.paygoods[index]) + '&orderid=' + that.data.orders[index].orderid})
    }
  },
  //跳转到订单详情
  orderdetail:function(e){
    console.log('跳转到订单详情页面')
    var that = this;
    var index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '../orderdetail/orderdetail?order=' + JSON.stringify(that.data.orders[index])
    })
  }
})