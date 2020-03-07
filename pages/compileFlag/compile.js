// pages/compile/compile.js
import regeneratorRuntime from '../../lib/runtime/runtime';
import {
  formatTime
} from '../../utils/util';
const AUTH = require('../../utils/auth')
const WXAPI = require('apifm-wxapi');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    textVal: null,
    wxlogin: true,
    userinfo: {},
    list: [],
    currentYear: null,
  },

  onLoad: function (options) {
    const userinfo = wx.getStorageSync("userinfo");
    if (!userinfo) {
      this.setData({
        wxlogin: false,
        userinfo: {},
      })
    } else {
      this.setData({
        userinfo,
      })
    }
    this.getList();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const year = new Date().getFullYear();
    this.setData({
      currentYear: year,
    })
  },

  handleTextInput(e) {
    this.setData({
      textVal: e.detail.value,
    })
  },

  async handleSubmit() {
    // 1 判断缓存中有没有token 
    const token = wx.getStorageSync("token");
    // 2 判断
    if (!token) {
      // AUTH.login();
      wx.showToast({
        title: '请先登录~',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: true,
      });
      return;
    }
    if (!this.data.textVal) {
      wx.showToast({
        title: '请输入内容~',
        icon: 'none',
        image: '',
        duration: 500,
        mask: true,
      });
      return;
    }
    let dateTime = new Date().getFullYear();
    console.log(dateTime, '<-dateTime->');
    let content = {
      time: dateTime,
      some: this.data.textVal,
      id: 2
    }

    // toDoList.push(content);

    let postData = {
      token: token,
      content: JSON.stringify(content)
    }

    this.createMsg(postData);
  },

  async createMsg(data) {
    await WXAPI.jsonSet(data).then((res) => {
      console.log(res, '<-res->');
    });
    this.onLoad();
    this.setData({
      textVal: '',
    })
  },

  async getList() {
    const currentTime = new Date().getFullYear();
    const token = wx.getStorageSync('token');
    if (!token) {
      // wx.showToast({
      //   title: '暂未登录~',
      //   icon: 'none',
      //   image: '',
      //   duration: 1500,
      // });
      return;
    }
    var postData = {
      token,
    };
    await WXAPI.jsonList(postData).then((res) => {
      console.log(res, '<-res->');
      if (res.code == 0) {
        let todoArr = res.data.filter(v => v.jsonData.id === 2);
        let todayTodo = todoArr.filter(v => v.jsonData.time === currentTime);
        this.setData({
          list: todayTodo.reverse(),
        })
      }
    });
  },

  async handleDel(e) {
    const token = wx.getStorageSync('token');
    const {
      id
    } = e.target.dataset;

    await WXAPI.jsonDelete(token, id);
    this.onLoad();
  },

  cancelLogin() {
    this.setData({
      wxlogin: true
    })
  },
  processLogin(e) {
    if (!e.detail.userInfo) {
      wx.showToast({
        title: '已取消',
        icon: 'none',
      })
      return;
    }
    const {
      userInfo
    } = e.detail;
    wx.setStorageSync("userinfo", userInfo);
    this.getUserInfo()
    AUTH.register(this);
  },

  getUserInfo() {
    const userinfo = wx.getStorageSync("userinfo");
    this.setData({
      userinfo,
      wxlogin: true,
    });
  },

})