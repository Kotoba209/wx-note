//index.js
//获取应用实例
const AUTH = require('../../utils/auth')
const WXAPI = require('apifm-wxapi');
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    wxlogin: true,
    items: [{
        title: '今日待办',
        class: 'icon-jinridaiban',
        id: 1,
        url: '/pages/compileTodo/compile',
      },
      {
        title: '历史待办',
        class: 'icon-lishijilu',
        id: 2,
        url: '/pages/hisTodoList/hisTodoList',
      },
      {
        title: '今年Flag',
        class: 'icon-jinnianflag',
        id: 3,
        url: '/pages/compileFlag/compile',
      },
      {
        title: '历年Flag',
        class: 'icon-linianflag',
        id: 4,
        url: '/pages/hisFlagList/hisFlagList',
      },
      {
        title: '退出',
        class: 'icon-tuichu',
        id: 5,
      },
    ],
  },
  onLoad: function () {

    const userInfo = wx.getStorageSync("userinfo");
    if (!userInfo) {
      this.setData({
        wxlogin: false,
        userInfo: {},
      })
    } else {
      this.setData({
        userInfo,
      })
    }
  },

  handleLink(e) {
    const userInfo = wx.getStorageSync('userinfo')
    const {
      id
    } = e.currentTarget.dataset;

    if (id === 5) {
      if (userInfo) {
        AUTH.loginOut();
        wx.showToast({
          title: '退出成功！',
          icon: 'none',
          duration: 1500,
          mask: false,
        });
        this.onLoad();
        this.setData({
          wxlogin: true,
        })
      } else {
        wx.showToast({
          title: '当前未登录~',
          icon: 'none',
          duration: 1500,
          mask: false,
          success: (result) => {

          },
          fail: () => {},
          complete: () => {}
        });
      }
      return;
    }
    let target = this.data.items.filter(v => v.id === id);
    wx.navigateTo({
      url: target[0].url,
    });
  },

  handleLogin() {
    this.setData({
      wxlogin: false,
    })
  },

  cancelLogin() {
    // const token = wx.getStorageSync('token');
    this.setData({
      wxlogin: true
    })
    wx.removeStorageSync('token')
    wx.removeStorageSync('uid')
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
    const userInfo = wx.getStorageSync("userinfo");
    this.setData({
      userInfo,
      wxlogin: true,
    });
    console.log(userInfo, '<-userInfo->');
  },

})