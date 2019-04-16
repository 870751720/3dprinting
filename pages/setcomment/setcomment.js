//评价商品页面
var app = getApp();
Page({

  data: {
    paygoods:[],//商品信息
    comments:[],//评论
    goodsid:[],//商品id
    orderid:null//订单id
  },
  //接受上级页面传递过来的订单信息
  onLoad: function (options) {
    console.log('接受上级页面传递过来的订单信息')
    var that = this;
    var arr = [];
    that.setData({
      paygoods: JSON.parse(options.paygoods)
    });
    that.setData({
      orderid: options.orderid
    });
    for(var i=0;i<that.data.paygoods.length;i++){
      arr.push(that.data.paygoods[i].goodsId)
      that.setData({
        goodsid:arr
      })
      that.data.comments[i]=null;
    }
  },
  //接受评论的输入
  intext: function (res) {
    console.log('输入评论' + res.detail.value)
    var index = res.currentTarget.dataset.index;
    this.data.comments[index] = res.detail.value;
  },  
  //提交评论
  submitClick:function(){
    console.log('提交评论')
    var that = this;
    var commentsexistnull = false;
    for (var i = 0; i < that.data.paygoods.length; i++)
      if (that.data.comments[i] == null || that.data.comments[i] == '')
        commentsexistnull = true;
    if (commentsexistnull == false){
        wx.request({
          url: 'https://www.buleboy.cn/3dprinting/setusercomments.php',
          method: "POST",
          data: {
            userid: app.globalData.userid,
            goodsid: JSON.stringify(that.data.goodsid),
            comments: JSON.stringify(that.data.comments),
            orderid: that.data.orderid
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            wx.switchTab({
              url: '../mine/mine'
            })
            wx.showToast({
              title: res.data,
              icon: 'none',
              duration: 1000
              })
          }
        })
    }
    else 
      wx.showToast({
        title: '请填写完评价',
        icon: 'none',
        duration: 1000
      })
  }
})