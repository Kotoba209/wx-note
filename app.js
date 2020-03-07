//app.js
const WXAPI = require('apifm-wxapi');
const AUTH = require('utils/auth')
App({
  onLaunch: function () {},
  onLaunch: function () {
    WXAPI.init(this.globalData.subDomain);
  },
  onShow(e) {
    // 自动登录
    AUTH.checkHasLogined().then(isLogined => {
      console.log(isLogined, '<-isLogined63->');
      if (!isLogined) {
        AUTH.login()
      }
    })
  },
  globalData: {
    subDomain: "Fn",
  }
})