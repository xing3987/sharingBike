//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          var appid = "wx4658b77a518f26a2";
          var secret = "dd95e287fb3b8f38685e59d2c7949e05";
          var code = res.code;
          //发起网络请求
          wx.request({
            url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appid + '&secret=' + secret + '&js_code=' + code + '&grant_type=authorization_code',
            success: function (r) {
              //获取到每个用户的对立id
              //console.log(r.data.openid)
              //把openid保存到本地
              wx.setStorageSync('openid', r.data.openid)
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    })
  },
  globalData: {
    userInfo: null
  }
})