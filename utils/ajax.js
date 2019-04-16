const api = 'https://www.buleboy.cn/3dprinting/';
function request(opt) {
  wx.request({
    method: opt.method || 'GET',
    url: api + opt.url,
    header: {
      'content-type': 'application/json' 
    },
    data: opt.data,
    success: function (res) {
          opt.success(res.data);
    }
  })
}

module.exports.request = request