//售后记录页面
const ajax = require('../../utils/ajax.js');
var app = getApp();
var sectionData = [];
var page = 0;
Page({

  data: {
    orders: [],
    paygoods: [],
    aftersalestate: ["退单中", "退单失败", "退单成功"],
    hides: [],//评论删除按钮隐藏
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:function(){
    this.aftersaleorder();
  },
  //页面卸载初始化页数
  onUnload:function(){
    page = 0;
  },
  //加载售后记录信息
  aftersaleorder: function () {
    var that = this;
    var hides = that.data.hides;
    ajax.request({
      method: 'GET',
      url: 'getaftersaleorder.php?userid=' + app.globalData.userid + '&page=' + page + '&size=10',
      success: data => {
        if (data.result.length == 0){
          wx.showToast({
            title: '暂没有更多数据',
            icon: 'none',
            duration: 1000
          })
        }
        else {
          page += 1;
          var Order = that.data.orders;
          var arr = [];
          for(var i= 0;i < data.result.length;i++)
            Order.push(data.result[i]);
          that.setData({
            orders: Order,
          });
          for (var i = 0; i < that.data.orders.length; i++) {
            arr.push(JSON.parse(that.data.orders[i].paygoods))
          }
          that.setData({
            paygoods: arr,
          });
          var Hides = [];
          for (var i = 0; i < that.data.orders.length; i++) { 
            if (that.data.orders[i].aftersalestate == 1)
              Hides.push(false);
            else Hides.push(true);
          }
          that.setData({ hides: Hides });
        }
        wx.hideNavigationBarLoading();
      }
    })
  }, 
  //触底加载信息
  onReachBottom:function(){
    console.log('触底加载')
    this.aftersaleorder();
  },
  //下拉刷新
  onPullDownRefresh: function () {
    console.log('下拉刷新')
    wx.showNavigationBarLoading();
    this.flush();
  },
  //刷新
  flush:function(){
    this.data.orders= [],
    this.data.paygoods = [],
    this.data.hides = [],
    page = 0;
    this.aftersaleorder();
  },
  //取消退单
  cancel:function(e){
    var index = e.currentTarget.dataset.index;
    var that = this;
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
  },
  //查看详细信息
  orderdetail: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '../aftersaledetail/aftersaledetail?order=' + JSON.stringify(that.data.orders[index])
    })
  },

})