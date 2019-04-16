//在线客服页面
const util = require('../../utils/util.js');
const ajax = require('../../utils/ajax.js');
var app = getApp();

Page({

  data: {
   chatmsg:[],//聊天信息
   msgid:null,//单条信息的id
   time:null,//用户发送信息的当前时间
   msg:null,//用户发送的信息
   msguserid:null,//用户id
   tomsguserid:-1,//客服id
   isshow:false//页面是否隐藏
  },
  //页面加载
  onLoad: function (options) { 
    console.log('页面加载用户id,聊天信息')
    this.setData({
      msguserid: app.globalData.userid
    })
    this.setData({
      chatmsg: app.globalData.chatmsg
    })
    console.log('收集未读信息')
    var unread =[];
    for (var i = 0; i < app.globalData.chatmsg.length;i++){
      if (app.globalData.chatmsg[i].isread == '0')
        unread.push(app.globalData.chatmsg[i].msgid)
    }
    if(unread != []){
      console.log('存在未读信息,对服务器上的信息标记已读')
      wx.request({
        url: 'https://www.buleboy.cn/3dprinting/setmsgisread.php',
        method: "POST",
        data: {
          unread: JSON.stringify(unread),
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
        console.log(res)
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    that.data.isshow=true;
    console.log('监听socket的信息')
    app.onSocketMessage(function(res){
      console.log('socket发送信息:')
      console.log(res)
      app.globalData.chatmsg.push(JSON.parse(res.data))
      that.setData({
        chatmsg: app.globalData.chatmsg
      })
      console.log('如果页面是显示的,那么对服务器上对应信息进行标记已读')
      if (that.data.isshow == true && JSON.parse(res.data).msguserid != app.globalData.userid){
        var unread = [];
        unread.push(JSON.parse(res.data).msgid)
        console.log(unread)
        wx.request({
          url: 'https://www.buleboy.cn/3dprinting/setmsgisread.php',
          method: "POST",
          data: {
            unread: JSON.stringify(unread),
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            console.log(res)
          }
        })
      }
    });
  },
  //页面隐藏
  onHide:function(){
    console.log('页面隐藏')
    this.data.isshow=false;
  },
  //页面卸载
  onUnload:function(){
    console.log('页面卸载')
    this.data.isshow = false;
  },
  //输入要发送的信息
  nmsginput: function (res) {
    console.log('输入要发送的信息')
    var that = this;
    that.setData({
      msg: res.detail.value
    })
  },
  //信息发送
  sendmsg:function(){
    var that=this;
    var newtime = util.formatTime(new Date()); 
    that.setData({
      time:newtime
    })
    console.log('把要发送的信息上传到服务器')
    wx.request({
      url: 'https://www.buleboy.cn/3dprinting/setchatmsg.php',
      method: "POST",
      data: {
        time: that.data.time,
        msg: that.data.msg,
        msguserid: that.data.msguserid,
        tomsguserid: that.data.tomsguserid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.setData({
          msgid: res.data.scalar
        })
        var needsendmsg = {
          msgid: that.data.msgid,
          msguserid: that.data.msguserid,
          tomsguserid: that.data.tomsguserid,
          msg: that.data.msg,
          time: that.data.time
        };
        app.sendSocketMessage(needsendmsg);
      }
    })
  },
  //下拉查看历史消息
  onPullDownRefresh:function(){
    var that=this;
    if (JSON.stringify(that.data.chatmsg) !== '[]') {var chatid = that.data.chatmsg[0].msgid;}
    else var chatid = 'max';
    ajax.request({
      method: 'GET',
      url: 'getchatmsg.php?userid=' + app.globalData.userid + '&chatid=' + chatid,
      success: data => {
        if (data != 'no more'){
        app.globalData.chatmsg = data.result.concat(that.data.chatmsg)
        that.setData({
          chatmsg: app.globalData.chatmsg
        })
      }
        else wx.showToast({
          title: data,
          icon: 'no more',
          duration: 1000
        })
      }
    })  
  },

})