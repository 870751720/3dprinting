//添加地址页面
var area = require('../../utils/area.js');
var areaInfo = []; //所有省市区县数据
var provinces = []; //省
var provinceNames = []; //省名称
var citys = []; //城市
var cityNames = []; //城市名称
var countys = []; //区县
var countyNames = []; //区县名称
var value = [0, 0, 0]; //数据位置下标
var addressList = null;//地址信息

Page({

  data: {
    provinceIndex: 0, 
    cityIndex: 0, 
    countyIndex: 0,
  },
  //onshow加载数据
  onShow: function() {
    var that = this;
    area.getAreaInfo(function(arr) {
      areaInfo = arr;
      that.getProvinceData();
    });
    console.log('添加地址页面显示,并且加载数据')
  },
  // 获取省份数据
  getProvinceData: function() {
    var that = this;
    var s;
    provinces = [];
    provinceNames = [];
    var num = 0;
    for (var i = 0; i < areaInfo.length; i++) {
      s = areaInfo[i];
      if (s.di == "00" && s.xian == "00") {
        provinces[num] = s;
        provinceNames[num] = s.name;
        num++;
      }
    }
    that.setData({
      provinceNames: provinceNames
    })
    that.getCityArr();
    that.getCountyInfo();
  },
  // 获取城市数据
  getCityArr: function(count = 0) {
    var c;
    citys = [];
    cityNames = [];
    var num = 0;
    for (var i = 0; i < areaInfo.length; i++) {
      c = areaInfo[i];
      if (c.xian == "00" && c.sheng == provinces[count].sheng && c.di != "00") {
        citys[num] = c;
        cityNames[num] = c.name;
        num++;
      }
    }
    if (citys.length == 0) {
      citys[0] = {
        name: ''
      };
      cityNames[0] = {
        name: ''
      };
    }
    var that = this;
    that.setData({
      citys: citys,
      cityNames: cityNames
    })
    that.getCountyInfo(count, 0);
  },
  // 获取区县数据
  getCountyInfo: function(column0 = 0, column1 = 0) {
    var c;
    countys = [];
    countyNames = [];
    var num = 0;
    for (var i = 0; i < areaInfo.length; i++) {
      c = areaInfo[i];
      if (c.xian != "00" && c.sheng == provinces[column0].sheng && c.di == citys[column1].di) {
        countys[num] = c;
        countyNames[num] = c.name;
        num++;
      }
    }
    if (countys.length == 0) {
      countys[0] = {
        name: ''
      };
      countyNames[0] = {
        name: ''
      };
    }
    var that = this;
    that.setData({
      countys: countys,
      countyNames: countyNames,
    })
  },
  //修改省份
  bindProvinceNameChange: function(e) {
    var that = this;
    var val = e.detail.value
    that.getCityArr(val); 
    that.getCountyInfo(val, 0); 
    value = [val, 0, 0];
    this.setData({
      provinceIndex: e.detail.value,
      cityIndex: 0,
      countyIndex: 0,
      value: value
    })
    console.log('修改省份数据')
  },
  //修改城市
  bindCityNameChange: function(e) {
    var that = this;
    var val = e.detail.value
    that.getCountyInfo(value[0], val); 
    value = [value[0], val, 0];
    this.setData({
      cityIndex: e.detail.value,
      countyIndex: 0,
      value: value
    })
    console.log('修改城市数据')
  },
  //修改区县
  bindCountyNameChange: function(e) {
    var that = this;
    this.setData({
      countyIndex: e.detail.value
    })
    console.log('修改区县数据')
  },
  //保存地址
  saveAddress: function(e) {
    var consignee = e.detail.value.consignee;
    var mobile = e.detail.value.mobile;
    var provinceName = e.detail.value.provinceName;
    var cityName = e.detail.value.cityName;
    var countyName = e.detail.value.countyName;
    var address = e.detail.value.address;
    if (consignee == '' || mobile == '' || provinceName == '' || cityName == '' || countyName == '' || address == '')
      wx.showToast({
        title: '请填写完整地址信息',
        icon: 'none',
        duration: 1000
      })
    else {
      var arr = wx.getStorageSync('addressList') || [];
      addressList = {
        consignee: consignee,
        mobile: mobile,
        address: provinceName + cityName + countyName + address,
      }
      arr.push(addressList);
      wx.setStorageSync('addressList', arr);
      console.log('保存地址完成并返回')
      wx.navigateBack({
      })
    }   
  }

})
