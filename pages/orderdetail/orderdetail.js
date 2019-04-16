//订单详情页面
const ajax = require('../../utils/ajax.js');
Page({

  data: {
    order:[],
    paygoods: null,
    orderaddress: null,
    state:null,
    returnstate:null,
    statetitleright: ["订单完成", "催单", "确认收货", "前去评价", "退单中", "退单失败", "退单成功"],
    statetitleleft: ["多谢惠顾", "退单", "查看物流", "退单", "取消退单", "重新申请", "订单完成"]
  },
  //加载订单详情
  onLoad: function (options) {
    console.log('监听订单页面加载')
    var arr = JSON.parse(options.order);
    if (arr.note == 'null')arr.note='暂无备注信息';
    if (arr.storenote == 'null') arr.storenote ='暂无备注信息';
    if (arr.couriernumber == '0') arr.couriernumber ='暂无物流信息';
    if (arr.paynumber == '0') arr.paynumber = '暂无支付信息';
    this.setData({
      order: arr
    })
    this.setData({
      state: arr.state
    })
    this.setData({
      returnstate: arr.returnstate
    })
    this.setData({
      paygoods: JSON.parse(this.data.order.paygoods)
    })  
    this.setData({
      orderaddress: JSON.parse(this.data.order.orderaddress)
    })  
  },
  //左边选项功能实现
  leftways: function () {
    var that = this;
    if (that.data.state == 1 || that.data.state == 3 || that.data.state == 5) {
      console.log('退单')
      wx.showModal({
        title: '提示',
        content: '确认退单',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../aftersale/aftersale?order=' + JSON.stringify(that.data.order)
            })
          }
        }
      })
    }
    else if (that.data.state == 2) {
      console.log('查看物流')
      wx.navigateTo({
        url: '../logistics/logistics?couriernumber=' + that.data.order.couriernumber + ' &company=' + that.data.order.company
      })
    }
    else if (that.data.state == 4) {
      console.log('取消退单')
      wx.showModal({
        title: '提示',
        content: '确认取消退单',
        success: function (res) {
          if (res.confirm) {
            ajax.request({
              method: 'GET',
              url: 'setnotreturn.php?orderid=' + that.data.order.orderid + '&returnstate=' + that.data.order.returnstate,
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

  },
  //右边选项功能实现
  rightways: function () {
    var that = this;
    if (that.data.state == 1) {
      console.log('催单')
      wx.showModal({
        title: '提示',
        content: '确认催单',
        success: function (res) {
          if (res.confirm) {
            ajax.request({
              method: 'GET',
              url: 'seturged.php?orderid=' + that.data.order.orderid,
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
    else if (that.data.state == 2) {
      console.log('收货')
      wx.showModal({
        title: '提示',
        content: '确认收货',
        success: function (res) {
          if (res.confirm) {
            ajax.request({
              method: 'GET',
              url: 'setreceive.php?orderid=' + that.data.order.orderid,
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
    else if (that.data.state == 3) {
      console.log('跳转评价页面')
      wx.navigateTo({ url: '../setcomment/setcomment?paygoods=' + JSON.stringify(that.data.paygoods) + '&orderid=' + that.data.order.orderid })
    }
  },

})