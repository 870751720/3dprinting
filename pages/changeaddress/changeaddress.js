//改变地址页面
Page({

  data: {
    addressList: [],//地址列表
  },
  //加载缓存中的地址信息
  onLoad: function (options) {
    console.log('加载缓存中的地址信息')
    var arr = wx.getStorageSync('addressList') || [];
    this.setData({
      addressList: arr
    });
  },
  //加载
  onShow: function () {
    console.log('加载')
    this.onLoad();
  },
  //添加地址
  addAddress: function () {
    console.log('跳转添加地址页面')
    wx.navigateTo({ url: '../address/address' });
  },
  // 删除item
  delAddress: function (e) {
    console.log('删除选中地址')
    this.data.addressList.splice(e.target.id.substring(3), 1);
    if (this.data.addressList.length > 0) {
      this.setData({
        addressList: this.data.addressList
      })
      wx.setStorageSync('addressList', this.data.addressList);
    } else {
      this.setData({
        addressList: this.data.addressList
      })
      wx.setStorageSync('addressList', []);
    }
  },
  //选中地址
  changeaddress: function (e) {
    console.log('选中地址,返回上一级页面')
    wx.setStorageSync('orderaddress', e.currentTarget.dataset.adid);
    wx.navigateBack({
    })
  }

})