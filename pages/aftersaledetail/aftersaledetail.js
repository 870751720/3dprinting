//售后记录详情页面
const ajax = require('../../utils/ajax.js');
Page({

  data: {
    order: [],
    paygoods: null,
    orderaddress: null,
    hide:true,//判断是否隐藏取消退单按钮
    aftersalestate: ["退单中", "退单失败", "退单成功"],
  },
  //加载售后记录页面传递过来的数据
  onLoad: function (options) {
    var arr = JSON.parse(options.order);
    console.log('页面传递数据:')
    console.log(arr)
    if (arr.note == 'null') arr.note = '无备注';
    if (arr.storenote == 'null') arr.storenote = '无备注';
    if (arr.couriernumber == '0') arr.couriernumber = '无物流';
    if (arr.paynumber == '0') arr.paynumber = '无支付信息';
    if (arr.paynumber == '0') arr.aftersalenote = '无退货备注';
    if (arr.paynumber == '0') arr.aftersalestorenote = '无商家备注';
    this.setData({
      order: arr,
      state: arr.state,
      returnstate: arr.returnstate,
      paygoods: JSON.parse(arr.paygoods),
      orderaddress: JSON.parse(arr.orderaddress),
    })
    if (this.data.order.aftersalestate == 1)
      this.setData({
        hide: false
      })
  },
  //取消退货
  cancel: function () {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确认取消退单',
      success: function (res) {
        if (res.confirm) {
          ajax.request({
            method: 'GET',
            url: 'setnotreturn.php?orderid=' + that.data.order.orderid + '&returnstate=' + that.data.order.returnstate,
            success: data => {
              if (data == 'success') {
                wx.switchTab({
                  url: '../mine/mine'
                })
                wx.showToast({
                  title: '退单成功',
                  icon: 'none',
                  duration: 1000
                })
                console.log('退单成功')
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
      }
    })
  }

})