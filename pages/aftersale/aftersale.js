//退货页面
const ajax = require('../../utils/ajax.js');
Page({

  data: {
    aftersalenote:null,//退货理由
    order:null,//选择退货的订单
    paygoods:null//退货的货物信息
  },
  //页面加载时载入上级页面传过的数据
  onLoad: function (options) {
    var arr = JSON.parse(options.order);
    this.setData({
      order: arr
    })
    this.setData({
      paygoods: JSON.parse(arr.paygoods)
    })
    console.log('接受上级页面传递的数据:')
    console.log(arr)
  },
  //输入退货理由
  intext: function (res) {
    this.data.aftersalenote = res.detail.value;
    console.log('退货理由为:' + res.detail.value)
  },
  //发表退货申请
  submitClick: function () {
    var that=this;
    if (that.data.aftersalenote != null && that.data.aftersalenote != ''){
      ajax.request({
      method: 'GET',
      url: 'setreturn.php?orderid=' + that.data.order.orderid + '&state=' + that.data.order.state + '&aftersalenote=' + that.data.aftersalenote,
      success: data => {
        if(data == 'success'){
          wx.switchTab({
            url: '../mine/mine'
          })
          wx.showToast({
            title: '申请成功',
            icon: 'none',
            duration: 1000
          })
          console.log('申请成功')
        }
        else {
          wx.showToast({
            title: '失败,数据出错',
            icon: 'none',
            duration: 1000
          })
          console.log('失败返回数据:' + data)
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
    else wx.showToast({
      title: '输入售后理由',
      icon: 'none',
      duration: 1000
    })
  }
})