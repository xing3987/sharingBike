//index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //该页面中的两个变量
    latitude: 0,
    longitude: 0,
    qrCode: 0,
    controls: [],
    markers: [] //页面上的所有图标
  },

  /*
    getAllBikes: function (res) {
      wx.request({
        url: "http://localhost:8888/bike/list",
        method: 'GET',
        success: function (res) {
          const bikes = res.data.map((item) => {
            return {
              id: item.id,
              iconPath: "/images/bike.png",
              width: 20,
              height: 15,
              latitude: item.latitude,
              longitude: item.longitude
            };
          });
          // 修改data里面的markers
          that.setData({
            markers: bikes
          });
        }
      })
    },
    */

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //将当前对象赋给that，就是获取当前信息的拷贝。
    var that = this;
    //获取当前的位置信息
    wx.getLocation({
      //如果获取成功，会调用success
      success: function(res) {
        var lat = res.latitude;
        var log = res.longitude;
        //console.log("纬度" + lat + "经度" + log)
        that.setData({
          latitude: lat,
          longitude: log
        });

        wx.request({
          url: "http://localhost:8888/bike/list",
          method: 'GET',
          success: function(res) {
            const bikes = res.data.map((item) => {
              return {
                id: item.id,
                iconPath: "/images/bike.png",
                width: 20,
                height: 15,
                latitude: item.latitude,
                longitude: item.longitude
              };
            });
            // 修改data里面的markers
            that.setData({
              markers: bikes
            });
          }
        })
      }
    });

    //在地图页中加入按钮（归位、扫描、充值）
    //获取当前设备的信息，获取屏幕的宽高
    wx.getSystemInfo({
      success: function(res) {
        //屏幕高
        var height = res.windowHeight;
        //屏幕宽
        var width = res.windowWidth;
        //往页面中设置数据
        that.setData({
          controls: [{
            //中心点位置
            id: 1,
            iconPath: '/images/location.png',
            position: {
              width: 20,
              height: 35,
              left: width / 2 - 10,
              top: height / 2 - 35.
            },
            //是否可点击
            clickable: true
          }, {
            //定位按钮安置
            id: 2,
            iconPath: '/images/img1.png',
            position: {
              width: 40,
              height: 40,
              left: 20,
              top: height - 60.
            },
            //是否可点击
            clickable: true
          }, {
            //扫码按钮
            id: 3,
            iconPath: '/images/qrcode.png',
            position: {
              width: 100,
              height: 40,
              left: width / 2 - 50,
              top: height - 60.
            },
            //是否可点击
            clickable: true
          }, {
            //充值按钮
            id: 4,
            iconPath: '/images/pay.png',
            position: {
              width: 40,
              height: 40,
              left: width - 45,
              top: height - 60.
            },
            //是否可点击
            clickable: true
          }, {
            //添加一辆小飞机
            id: 5,
            iconPath: '/images/bike.png',
            position: {
              width: 20,
              height: 15,
            },
            //是否可点击
            clickable: true
          }]
        })
      },
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    //创建一个map上下文，如果想要调用地图相关的方发
    this.mapCtx = wx.createMapContext('map');
    //获取当前位置
    wx.getLocation({
      success: function(res) {
        //纬度
        var lat = res.latitude;
        //经度
        var log = res.longitude;
        //从本地存储中取出唯一身份标识(同步获取)
        var openid = wx.getStorageSync('openid')
        //发送request向mongo中添加数据（添加一条文档（json））
        wx.request({
          //用POST方式请求es可以只指定index和type，不用指定id
          url: "http://localhost:8888/log/ready",
          data: {
            time: new Date(),
            openid: openid,
            latitude: lat,
            longitude: log
          },
          method: "POST"
        })
      },
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  //按钮点击事件
  contap(e) {
    var that = this;
    if (e.controlId == 2) {
      //点击定位当前位置
      that.mapCtx.moveToLocation();
    }

    /*
    if (e.controlId == 3) {
      //点击扫描按钮
      wx.scanCode({
        success:function(r){
          //扫描成功获取二维码的信息
          var code=r.result
          //向后台发送请求
          wx.request({
            //method: 'POST',
            url: 'http://localhost:8888/bike',
            data:{
              qrCode:code,
              latitude:that.data.latitude,
              longitude:that.data.longitude
            },
            header: {
              'content-type':'application/json' // 默认值
            },
            success: function (res) {
              console.log(res.data)
            }
          })
        }
      })
    }
    */

    if (e.controlId == 3) {
      //获取全局变量中的status属性值
      var status = getApp().globalData.status;
      if (status == 0) {
        //跳转到注册页面
        wx.navigateTo({
          url: '../register/register',
        });
      } else if (status == 1) {
        wx.navigateTo({
          url: '../deposit/deposit',
        });
      } else if (status == 2) {
        wx.navigateTo({
          url: '../identify/identify',
        });
      } else if (status == 3) {
        scanCode()
      }
    }

    if (e.controlId == 5) {
      //添加车辆
      that.mapCtx.getCenterLocation({
        success: function(res) {
          var lat = res.latitude
          var log = res.longitude
          wx.request({
            method: 'POST',
            url: 'http://localhost:8888/bike',
            data: {
              latitude: lat,
              longitude: log
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function(res) {
              console.log('success!')
              //向后台发送请求，将单车查找出来
              wx.request({
                url: "http://localhost:8888/bike/list",
                method: 'GET',
                success: function(res) {
                  const bikes = res.data.map((item) => {
                    return {
                      id: item.id,
                      iconPath: "/images/bike.png",
                      width: 20,
                      height: 15,
                      latitude: item.latitude,
                      longitude: item.longitude
                    };
                  });
                  // 修改data里面的markers
                  that.setData({
                    markers: bikes
                  });
                }
              })
            }
          })
        }
      })
    }
  }
})

function scanCode() {
  wx.scanCode({
    success: function(res) {
      var bikeNo = res.result;
      console.log(bikeNo);
      var openid = wx.getStorageSync('openid');
      qqmapsdk.reverseGeocoder({
        location: {
          latitude: that.data.lat,
          longitude: that.data.log
        },
        success: function(res) {
          var addr = res.result.address_component
          var province = addr.province;
          var city = addr.city;
          var district = addr.district;
          //将数据写入到es中
          wx.request({
            url: "http://localhost:8888/bike/unlock",
            data: {
              bikeNo: bikeNo,
              time: new Date(),
              openid: openid,
              lat: that.data.lat,
              log: that.data.log,
              province: province,
              city: city,
              district: district
            },
            method: "POST"
          })
        }
      });

      //wx.navigateTo({
      //  url: '../lock/index',
      //});
    }
  })
}