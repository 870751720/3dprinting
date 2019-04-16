//来自购物车的订单页面
var app = getApp();

Page({

  data: {
    paygoods:null,//商品信息
    orderaddress:null,//收货人地址
    note:'null',//顾客备注
    totalmoney:null,//总价
  },
  //加载来自购物车传送过来的信息
  onLoad: function (options) {
    console.log('加载商品信息,总价,以及顾客地址')
    var that = this;
    var money= 0;
    that.setData({
      paygoods: JSON.parse(options.paygoods)
    });
    for (var i = 0; i < that.data.paygoods.length; i++)
    {
      money = money + parseFloat(that.data.paygoods[i].totalMoney)
    }
    that.setData({
      totalmoney: money
    });
    var arr = wx.getStorageSync('addressList') || [];
    that.setData({
      orderaddress: arr[wx.getStorageSync('orderaddress')]
    });
  },
  //页面卸载,清空数据
  onUnload: function () {
    console.log('清空页面数据')
    this.data.paygoods = null;
    this.data.orderaddress = null;
    this.data.note = 'null';
    this.data.totalmoney = null;
  },
  //加载地址信息
  onShow:function(){
    console.log('加载收货人地址')
    var that = this;
    var arr = wx.getStorageSync('addressList') || [];
    that.setData({
      orderaddress: arr[wx.getStorageSync('orderaddress')]
    });
  },    
  //支付订单
  pay: function () {
    console.log('发起支付')
    var that = this;
    if (that.data.note == '')
      that.setData({
        note: 'null'
      });
    if (that.data.orderaddress != null) {
      console.log('支付成功')
      wx.showModal({
        title: '提示',
        content: '支付成功',
        success: function (res) {
          if (res.confirm) {
            wx.request({
              url: 'https://www.buleboy.cn/3dprinting/setorder.php',
              method: "POST",
              data: {
                userid: app.globalData.userid,
                orderaddress: JSON.stringify(that.data.orderaddress),
                paygoods: JSON.stringify(that.data.paygoods),
                totalmoney: that.data.totalmoney,
                note: that.data.note,
              },
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              success: data => { 
                if (data.data == 'success')
                  {
                  wx.setStorageSync('cart', [])
                  wx.navigateBack({
                  })
                  wx.showToast({
                    title: '支付成功',
                    icon: 'none',
                    duration: 1000
                  })
                  }
                else {
                  wx.showToast({
                    title: '失败,数据出错',
                    icon: 'none',
                    duration: 1000
                  })
                  console.log('失败返回数据:' )
                  console.log(data)
                }     
              },
              fail: data => {
                wx.showToast({
                  title: '失败,请稍候再试',
                  icon: 'none',
                  duration: 1000
                })
                console.log(data)
              }
            })
          }
        }
      })
    }
    else{
      console.log('填写信息未完善')
      wx.showToast({
        title: '请填写地址',
        icon: 'none',
        duration: 1000
      })
    }
  },
  //取消支付
  notpay: function () {
    console.log('取消支付')
    wx.navigateBack({
    })
  },
  //改变地址
  gochangeaddress:function(){
    console.log('改变地址')
    wx.navigateTo({ url: '../changeaddress/changeaddress' });
  },
  //添加备注
  noteInput: function (res) {
    console.log('添加备注' + res.detail.value)
    this.setData({
      note: res.detail.value
    })
  },
})