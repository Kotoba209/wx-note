// pages/hisTodoList/hisTodoList.js
const AUTH = require('../../utils/auth')
const WXAPI = require('apifm-wxapi');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList();
  },
  async getList() {
    // 1 判断缓存中有没有token 
    const token = wx.getStorageSync('token');
    if (!token) {
      // wx.showToast({
      //   title: '暂未登录~',
      //   icon: 'none',
      //   duration: 1500,
      // })
      return;
    }
    const currentTime = new Date().getFullYear();
    var postData = {
      token: wx.getStorageSync('token')
    };
    await WXAPI.jsonList(postData).then((res) => {
      console.log(res, '<-res->');
      if (res.code == 0) {
        let todoArr = res.data.filter(v => v.jsonData.id === 2) || [];
        let todayTodo = todoArr.filter(v => v.jsonData.time !== currentTime) || [];
        this.setData({
          list: todayTodo.reverse(),
        })
      }
    });
  },
})