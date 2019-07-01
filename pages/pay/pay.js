// pages/pay/pay.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    money: 0, //余额
    currentTab: 3, //默认选中标签
    payMoney: 10 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  //tab的切换
  switchNav: function (e) {
    var that = this;
    if (that.data.currentTab == e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        //tab
        currentTab: e.target.dataset.current,
        payMoney: e.target.dataset.money
      })
    }
  },

  recharge: function () {
    var that = this;
    wx.showModal({
      title: '充值',
      content: '您是否进行充值' + that.data.payMoney + '元?',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: 'https://localhost/pay/recharge',
            method: 'POST',
            //header: { 'content-type': 'application/x-www-form-urlencoded' },
            data: {
              money: that.data.payMoney,
              name: 'kitty'
            },
            success: function (res) {
              wx.request({
                url: 'https://localhost/user/' + 100,
                method: 'GET',
                success: function (r) {
                  that.setData({
                    money: r.data.balance
                  })
                  // wx.showToast({
                  //   title: '充值成功',
                  //   icon: 'success'
                  // })
                  wx.showModal({
                    title: '提示',
                    content: '是否前往单车首页！',
                    success: function (res) {
                      if (res.confirm) {
                        wx.navigateTo({
                          url: '../index/index'
                        })
                      }
                    }
                  })
                }
              })
            }
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  }

})