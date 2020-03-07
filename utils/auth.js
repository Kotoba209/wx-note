import regeneratorRuntime from '../lib/runtime/runtime';
const WXAPI = require('apifm-wxapi');


async function login(page) {
  const _this = this
  wx.login({
    success: function (res) {
      WXAPI.login_wx(res.code).then(function (res) {
        if (res.code == 10000) {
          // 去注册
          // _this.register(page)
          return;
        }
        if (res.code != 0) {
          // 登录错误
          wx.showModal({
            title: '无法登录',
            content: res.msg,
            showCancel: false
          })
          return;
        }
        wx.setStorageSync('token', res.data.token)
        wx.setStorageSync('uid', res.data.uid)
        if (page) {
          page.onShow()
        }
      })
    }
  })
}

// async function onShow(e) {
//   // 自动登录
//   checkHasLogined().then(isLogined => {
//     console.log(isLogined, '<-isLogined->');
//     if (!isLogined) {
//       login()
//     }
//   })
// }

// 检测登录状态，返回 true / false
async function checkHasLogined() {
  const token = wx.getStorageSync('token')
  if (!token) {
    return false
  }
  const loggined = await checkSession()

  console.log(loggined, '<-loggined343->');
  if (!loggined) {
    wx.removeStorageSync('token')
    return false
  }
  const checkTokenRes = await WXAPI.checkToken(token)
  if (checkTokenRes.code != 0) {
    wx.removeStorageSync('token')
    return false
  }
  return true
}

async function checkSession() {
  return new Promise((resolve, reject) => {
    wx.checkSession({
      success() {
        return resolve(true)
      },
      fail() {
        return resolve(false)
      }
    })
  })
}

async function register(page) {
  let _this = this;
  wx.login({
    success: function (res) {
      let code = res.code; // 微信登录接口返回的 code 参数，下面注册接口需要用到
      wx.getUserInfo({
        success: function (res) {
          let iv = res.iv;
          let encryptedData = res.encryptedData;
          WXAPI.register_complex({
            code: code,
            encryptedData: encryptedData,
            iv: iv,
          }).then(function (res) {
            _this.login(page);
          })
        }
      })
    }
  })
}


async function checkAndAuthorize(scope) {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success(res) {
        if (!res.authSetting[scope]) {
          wx.authorize({
            scope: scope,
            success() {
              resolve() // 无返回参数
            },
            fail(e) {
              console.error(e)
              // if (e.errMsg.indexof('auth deny') != -1) {
              //   wx.showToast({
              //     title: e.errMsg,
              //     icon: 'none'
              //   })
              // }
              wx.showModal({
                title: '无权操作',
                content: '需要获得您的授权',
                showCancel: false,
                confirmText: '立即授权',
                confirmColor: '#e64340',
                success(res) {
                  wx.openSetting();
                },
                fail(e) {
                  console.error(e)
                  reject(e)
                },
              })
            }
          })
        } else {
          resolve() // 无返回参数
        }
      },
      fail(e) {
        console.error(e)
        reject(e)
      }
    })
  })
}

function loginOut() {
  wx.removeStorageSync('token')
  wx.removeStorageSync('uid')
  wx.removeStorageSync('userinfo');
}

module.exports = {
  checkHasLogined: checkHasLogined,
  login: login,
  register: register,
  checkAndAuthorize: checkAndAuthorize,
  loginOut: loginOut,
}