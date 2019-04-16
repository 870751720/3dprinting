//购物车页面
Page({

  data: {
    carts: [],  //购物车总信息 
    paygoods:[],//商品单独信息
    iscart: false,//购物车是否有商品
    hidden: null,//勾选的是否隐藏
    isAllSelect: false,//购物车商品是否全选
    totalMoney: 0,//订单总价格
  },
  //加载购物车信息
  onShow: function () {
    console.log('加载缓存中的购物车信息')
    var arr = wx.getStorageSync('cart') || [];
    if (arr.length > 0) { 
      this.setData({
        carts: arr,
        iscart: true,
        hidden: false
      });
    }else{
      this.setData({
        iscart: false,
        hidden: true,
      });
    }
  }, 
  //页面隐藏处理
  onHide:function(){
    console.log('页面隐藏,清除勾选信息,清除页面已有数据')
    for (var i = 0; i < this.data.carts.length; i++) {
      this.data.carts[i].isSelect =false;
      this.data.carts[i].totalMoney = this.data.carts[i].price
    }
    wx.setStorageSync('cart', this.data.carts)
    this.setData({
      isAllSelect: false
    })
    this.setData({
      hidden: null
    })
    this.setData({
      paygoods: []
    })
    this.setData({
      totalMoney: 0
    })
    this.setData({
      carts: []
    })
    this.setData({
      iscart: false
    })
  },
  //勾选事件处理函数  
  switchSelect: function (e) {
    console.log('物品被勾选,处理相应事件')
    var Allprice = 0, i = 0;
    let index = parseInt(e.target.dataset.index);//获得index的值
    this.data.carts[index].isSelect = !this.data.carts[index].isSelect;//购物车对应index的勾选框取反
    if (this.data.carts[index].isSelect) {
      this.setData({
        totalMoney: this.data.totalMoney + (this.data.carts[index].price * this.data.carts[index].count)
      })  
      this.data.paygoods.push(this.data.carts[index])
    } //如果被选中了，钱总额加上
    else {
      this.setData({
        totalMoney: this.data.totalMoney - (this.data.carts[index].price * this.data.carts[index].count)
      })
      for (i = 0; i < this.data.paygoods.length; i++)
      {
        if (this.data.paygoods[i].goodsId == this.data.carts[index].goodsId)
          this.data.paygoods.splice(i, 1)
      }
    } //如果没有被选中，钱总额减去
    for (i = 0; i < this.data.carts.length; i++) {
      Allprice = Allprice + (this.data.carts[i].price * this.data.carts[i].count);
    } //判断购物车总价
    if (Allprice == this.data.totalMoney) {
      this.setData({
        isAllSelect:true
      })
    }
    else {
      this.setData({
        isAllSelect:false
      })
    }//判断购物车总价和勾选商品总价是否一样，一样全选框点亮
    this.setData({
      carts: this.data.carts,
      totalMoney: this.data.totalMoney,
    })
  },
  //全选
  allSelect: function (e) {
    console.log('全选触发')
    let i = 0;
    if (!this.data.isAllSelect) {
      this.data.totalMoney = 0;
      for (i = 0; i < this.data.carts.length; i++) {
        this.data.carts[i].isSelect = true;
        this.data.totalMoney = this.data.totalMoney + (this.data.carts[i].price * this.data.carts[i].count);
      }
      this.setData({
        paygoods: this.data.carts
      })
    }
    else {
      for (i = 0; i < this.data.carts.length; i++) {
        this.data.carts[i].isSelect = false;
      }
      this.data.totalMoney = 0;
      this.setData({
        paygoods: null
      })
    }
    this.setData({
      carts: this.data.carts,
      isAllSelect: !this.data.isAllSelect,
      totalMoney: this.data.totalMoney,
      paygoods: this.data.carts
    })
  },
  // 去结算
  toBuy() {
    console.log('准备跳转结算页面')
    var that = this;
    if(that.data.paygoods.length >0)
    wx.navigateTo({ url: '../cartpayorder/cartpayorder?paygoods=' + JSON.stringify(that.data.paygoods) })
    else 
    wx.showToast({
      title: '选择要结算的货物',
      icon: 'none',
      duration: 1000
    })
  },
  // 减数 
  delCount: function (e) {
    console.log('物品数量-')
    var index = e.target.dataset.index;
    var count = this.data.carts[index].count;
    if (count > 1) {
      this.data.carts[index].count--;
      this.data.carts[index].totalMoney = parseFloat(this.data.carts[index].totalMoney) - parseFloat(this.data.carts[index].price)
      if (this.data.carts[index].isSelect == true) {
        for (var i = 0; i < this.data.paygoods.length; i++) {
          if (this.data.paygoods[i].goodsId == this.data.carts[index].goodsId)
           { this.data.paygoods[i].count--;
          this.data.paygoods[i].totalMoney = parseFloat(this.data.paygoods[i].totalMoney) - parseFloat(this.data.paygoods[i].price) }
        }
      }
    }
    this.setData({
      carts: this.data.carts
    });
    this.priceCount();
  },
  // 加数
  addCount: function (e) {
    console.log('物品数量+')
    var index = e.target.dataset.index;
    var count = this.data.carts[index].count;
    if (count < 10) {
      this.data.carts[index].count++;
      this.data.carts[index].totalMoney = parseFloat(this.data.carts[index].totalMoney) + parseFloat(this.data.carts[index].price)
      if (this.data.carts[index].isSelect == true) {
        for (var i = 0; i < this.data.paygoods.length; i++) {
          if (this.data.paygoods[i].goodsId == this.data.carts[index].goodsId)
           { this.data.paygoods[i].count++;
          this.data.paygoods[i].totalMoney = parseFloat(this.data.paygoods[i].totalMoney) + parseFloat(this.data.paygoods[i].price)}
        }
      }
    }
    this.setData({
      carts: this.data.carts
    });
    this.priceCount();
  },
  //价格计算
  priceCount: function (e) {
    this.data.totalMoney = 0;
    for (var i = 0; i < this.data.carts.length; i++) {
      if (this.data.carts[i].isSelect == true) {
        this.data.totalMoney = this.data.totalMoney + (this.data.carts[i].price * this.data.carts[i].count);
      }

    }
    this.setData({
      totalMoney: this.data.totalMoney,
    })
  },
  // 删除item
  delGoods: function (e) {
    console.log('删除选中商品')
    let index = parseInt(e.target.dataset.index);
    for (var i = 0; i < this.data.paygoods.length; i++) {
      if (this.data.paygoods[i].goodsId == this.data.carts[index].goodsId)
        this.data.paygoods.splice(i, 1)
    }
    this.data.carts.splice(e.target.id.substring(3),1); 
    if (this.data.carts.length > 0) {
      this.setData({
        carts: this.data.carts
      })
      wx.setStorageSync('cart', this.data.carts);
      this.priceCount();
    } else {
      this.setData({
        cart: this.data.carts,
        iscart: false,
        hidden: true,
      })
      wx.setStorageSync('cart', []);
    }
  }
})
