//我的地址
Page({

  data: {
    addressList:[],
  },
  //onshow页面加载地址数据
  onShow: function () {
    var arr = wx.getStorageSync('addressList') || [];
    this.setData({
      addressList: arr
    });
    console.log('我的地址页面显示并且加载数据')
  },
  //跳转添加地址页面
  addAddress:function(){
    console.log('跳转到添加地址页面')
    wx.navigateTo({ url: '../address/address' });
  },
  //删除选中地址
  delAddress: function (e) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确认删除该地址',
      success: function (res) {
        if (res.confirm) {
          that.data.addressList.splice(e.target.id.substring(3), 1);
          if (that.data.addressList.length > 0) {
            that.setData({
              addressList: that.data.addressList
            })
            wx.setStorageSync('addressList', that.data.addressList);
          }
          else {
            that.setData({
              addressList: that.data.addressList
            })
            wx.setStorageSync('addressList', []);
          }
          console.log('删除选中地址')
        }
      }
    })
  },

})