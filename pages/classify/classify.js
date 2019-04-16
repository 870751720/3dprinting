//分类页面
const ajax = require('../../utils/ajax.js');
Page({

  data: {
    classifyItems:[],//分类的总数据
    curNav: 1,//选中的大类
    curIndex: 0//选中的小类
  },
  //切换大类
  switchRightTab: function (e) {
    console.log('切换大类')
    let id = e.target.dataset.id,index = parseInt(e.target.dataset.index);
    this.setData({
      curNav: id,
      curIndex: index
    })
  },
  //加载分类数据
  onLoad: function (options) {
    console.log('加载数据')
    this.classifyShow();
  },
  //请求服务器分类数据
  classifyShow: function (success) {
    var that = this;
    ajax.request({
      method: 'GET',
      url: 'getclassify.php',
      success: data => {
        that.setData({
          classifyItems: data.result
        })
      }
    })
  },
  //跳转分类商品详情
  catchTapCategory: function (e) {
    console.log('跳转分类商品详情')
    var that = this;
    var classifyId = e.currentTarget.dataset.classifyid;
    var smallclassifyId = e.currentTarget.dataset.smallclassifyid;
    wx.navigateTo({
      url: '../classifyGoods/classifyGoods?classifyId=' + classifyId +'&smallclassifyId=' + smallclassifyId })
  },
  
})