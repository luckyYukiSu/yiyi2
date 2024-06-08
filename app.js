const app = getApp()
App({
  onLaunch: function () {
    let that = this
    //console.log(this.globalData.postData)
    //初始化云环境
    wx.cloud.init({
      env: 'lkj-7guox3sve2f77bd6'
    })
    //获取openid
    wx.cloud.callFunction({
      name: 'getOpenid',
      success: res => {
        console.log("app.js获取openid成功", res.result)
        //将获取到的openid存进缓存，方便以后各个页面使用
        wx.setStorageSync('openid', res.result.openid)
        //获取最新的postData
        wx.cloud.database().collection('user').where({
          openid: res.result.openid
        }).get().then(res => {
          console.log("app.js的get查询获取user数据成功", res.data)
          //将得到的postData放进缓存里面
          wx.setStorageSync('postData', res.data[0].postData ? res.data[0].postData : that.globalData.postData)
          // wx.setStorageSync('postData', res.data[0].postData ? res.data[0].postData : (wx.getStorageSync('postData') ? wx.getStorageSync('postData') : that.globalData.postData))
        }).catch(res => {
          console.log("获取user数据失败", res)
        })
      },
      fail: res => {
        console.log("app.js获取openid失败", res.result)
      }
    })
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
    // 获取系统状态栏信息
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let capsule = wx.getMenuButtonBoundingClientRect();
        if (capsule) {
          this.globalData.Custom = capsule;
          this.globalData.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight;
        } else {
          this.globalData.CustomBar = e.statusBarHeight + 50;
        }
      }
    })

  },

  
  // 提供云开发的参数
  cloudConfig: {
    env: 'lkj-7guox3sve2f77bd6',
    storageBucket: '6c6b-lkj-7guox3sve2f77bd6-1311245690'
  },
  globalData: {
    userInfo: null,
    postData: wx.getStorageSync('postData') ? wx.getStorageSync('postData') : {
      sex: 0,
      age: 22,
      weight: 55,
      height: 168,
      calfGirth: 38,
      heartRate: 70,
      systolic: 129,
      diastolic: 84,
      exerciseNow: 0,
      exercisePast: 0,
      housework: 5,
      outdoor: 5,
      walk: 3,
      weightlifting: 3,
      squat: 2,
      neck: 2,
      back: 2,
      hands: 2,
      sitUp: 2,
      pickUp: 3,
      isLogin: false
    }
  }
})