//物流页面
const ajax = require('../../utils/ajax.js');
Page({

  data: {
    courier:[]//物流信息
  },
  //页面加载
  onLoad: function (options) {
    console.log('加载物流信息')
    var that = this;  
    ajax.request({
      method: 'GET',
      url: 'getlogistics.php?couriernumber=' + options.couriernumber + '&company=' + options.company,
      success:data => {
        console.log(data)
        that.setData({
          courier:data.data
        })
      }
    })
  },

})