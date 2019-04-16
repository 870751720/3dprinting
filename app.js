App({
  onLaunch: function () {
    console.log('获取用户id,以及连接客服系统')
    var that = this;
    wx.login({
      success: res => {
        var code = res.code;
        if (code) {
          wx.request({
            method: 'GET',
            url: 'https://www.buleboy.cn/3dprinting/oauth.php?code=' + code + '',
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              that.globalData.userid = res.data;
              wx.request({
                url: 'https://www.buleboy.cn/3dprinting/getunreadmsg.php',
                method: "POST",
                data: {
                  userid: that.globalData.userid,
                },
                header: {
                  'content-type': 'application/x-www-form-urlencoded'
                },
                success: function (res) {
                  if (res.data != 'no more')
                    that.globalData.chatmsg = res.data.result.concat(that.globalData.chatmsg)
                }
              })
              wx.connectSocket({
                url: 'wss://www.buleboy.cn/wxsale'
              })
              wx.onSocketOpen(function () {
                that.sendSocketuserid(that.globalData.userid);
                console.log('客服系统连接成功')
              })
            },
          })
        } else {
        }
      }
    })
  },
  //发送心跳,以及监听socket客服系统的消息
  onShow:function(){
    console.log('发送心跳,以及监听socket客服系统的消息')
    var that=this;
    setInterval(function () {
      var heart = '0';
      var msg = {heart};
      wx.sendSocketMessage({
        data: JSON.stringify(msg)
      })
    }, 10000) 
    wx.onSocketClose(function () {
      console.log('WebSocket 已关闭！')
    })
    wx.onSocketMessage(function (res) {
      console.log(res)
      that.globalData.chatmsg.push(JSON.parse(res.data))
    })
  },
  //监听socke信息
  onSocketMessage: function (callback){
    wx.onSocketMessage(function (res) {
      callback(res)
    })
  },
  //发送socke信息
  sendSocketMessage:function(msg){
    console.log('发送socke信息')
    wx.sendSocketMessage({
      data: JSON.stringify(msg)
    })
  },
  //发送socket用户id
  sendSocketuserid: function (userid) {
    console.log('发送socket用户id进行登录')
    var msg = { userid };
    wx.sendSocketMessage({
      data: JSON.stringify(msg)
    })
  },
  //全局数据
  globalData: {
    userid: null,//用户id
    userInfo:null,//用户信息
    chatmsg:[],//客服消息
  }
})