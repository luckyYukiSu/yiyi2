const util = require('../../utils/util.js') //引入公共函数
const sportData = require('../../utils/json.js')
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sportMin: 0, //用户锻炼时间
    isLogin: false, //是否登录
    userInfo: {}, //用户信息
    doneNum: 0, //已经完成目标数目
    sportList: [], //运动方案
  },
  //跳转到推荐方案页面
  toSport: function () {
    wx.navigateTo({
      url: '/pages/sportDetail/sportDetail',
    })
  },
  //跳转到更新数据界面
  toPerson: function () {
    // wx.switchTab({
    wx.navigateTo({
      url: '/pages/consultation/consultation',
    })
  },
  //跳转至自定义方案界面
  toCustom: function () {
    wx.navigateTo({
      url: '/pages/custom/custom',
    })
  },
  //跳转到统计界面
  toStatistics: function () {
    wx.navigateTo({
      url: '/pages/statistics/statistics',
    })
  },
  //登录获取用户信息
  login: function () {
    wx.getUserProfile({
      desc: '用于获取用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log("获取成功: ", res)
        this.setData({
          isLogin: true,
          userInfo: res.userInfo
        })
        wx.setStorageSync('userInfo', this.data.userInfo)
        this.dataRequest() //登录之后请求数据
        //更新数据到云平台
        util.insertData(null)
      },
      fail: function (err) {
        console.log("获取失败: ", err)
      }
    })
  },

  //获取用户头像
  bindchooseavatar(e) {
    this.setData({
      avatarUrl: e.detail.avatarUrl
    })
  },
  //计算百分数
  precrent: function (num, total) {
    return num <= 0 || total == 0 ? "0%" : (Math.round(num / total * 10000) / 100.00) + "%"
  },
  //将推荐方案的运动进程放进运动目标进程
  setProcess: function () {
    let {
      sportList,
      doneNum
    } = this.data
    //首先根据完成分钟来计算推荐方案的运动进度
    sportList = sportList.map((planObj) => {
      let precentNum = this.precrent(planObj.doneNumbers, planObj.numbers)
      let precentMin = this.precrent(planObj.doneMin, planObj.sportMin)
      planObj["precentMin"] = precentMin
      planObj["precentNum"] = precentNum
      return planObj
    })
    //完成目标数
    /* 
    reduce（）方法：对数组中的每一个元素继续宁遍历，并将他们合并成一个单独的值

    第二个参数的‘0’表示累加器的初始值。
    cur表示当前累加器的值，pre表示当前遍历元素
    */
    doneNum = sportList.reduce((cur, pre) => {
      return cur + (pre.precentNum == '100%' ? 1 : 0)
    }, 0)
    //运动时间
    let sportMin = sportList.reduce((cur, pre) => {
      return pre.doneNumbers == pre.numbers ? cur + pre.sportMin * pre.doneNumbers : cur + pre.sportMin * pre.doneNumbers + pre.doneMin
    }, 0)
    this.setData({
      sportList,
      doneNum,
      sportMin
    })
    //更新云上面的运动数据
    let db = wx.cloud.database()
    db.collection('sportMessage').where({
      openid: wx.getStorageSync('openid'),
      sportMessage: {
        date: wx.getStorageSync('sportMessage').date
      }
    }).get().then(res => {
      console.log("查找当天运动信息成功", res)
      //查找成功之后进行运动时间更新
      db.collection('sportMessage').doc(res.data[0]._id).update({
        data: {
          sportMessage: wx.getStorageSync('sportMessage')
        }
      }).then(res => {
        console.log("当天运动时间更新", res)
        //调用公共函数getDayList获取近七天运动时间
        util.getDayList()
      }).catch(res => {
        console.log("当天运动时间失败", res)
      })
    }).catch(res => {
      console.log("查找当天运动信息失败", res)
    })
  },
  //通过用户类别查询运动方案
  getSportList: function (label) {
    //类别为6的不推荐运动
    if (label == 6) {
      wx.showModal({
        title: '提示',
        content: '不推荐运动,请退出小程序',
        showCancel: false,
        success(res) {
          if (res.confirm) {
            //wx.exitMiniProgram()
          }
        }
      })
    } else {
      let sportMessage = {} //运动信息，用来存在运动方案的生成时间和运动方案
      sportMessage.date = util.formatTime2(new Date())
      let localSportMeaasge = wx.getStorageSync('sportMessage') || {} //用于比较运动方案生成时间
      console.log("sportMessage", sportMessage, localSportMeaasge)
      //今天于最近生成的运动方案相差天数
      let day = JSON.stringify(localSportMeaasge) !== "{}" ? util.dateDiff(sportMessage.date, localSportMeaasge.date) : 2
      //console.log(day,label,wx.getStorageSync('label'),!wx.getStorageSync('label')?label===wx.getStorageSync('label'):false||day<1) 
      //类别没有发生改变或者相隔不超过1天运动方案不变
      if ((!wx.getStorageSync('label')) ? label === wx.getStorageSync('label') : false || day <= 1) {
        console.log("运动方案不发生改变")
        wx.setStorageSync('label', label) //将获取的label存进缓存,用于将来作比较看看类别是否发生改变
        // if(false){
        let {
          sportList
        } = localSportMeaasge //从本地取得运动方案
        //把运动方案渲染到页面上
        this.setData({
          sportList: sportList
        })
        this.setProcess() //将推荐方案的运动进程放进运动目标进程
      } else {
        console.log("运动方案发生改变")
        wx.setStorageSync('label', label) //将获取的label存进缓存,用于将来作比较看看类别是否发生改变
        let sportList = sportData.sport[`sport${label}`] //运动方案
        let arr = [] //存储随机索引
        for (let i = 0; i < sportList.length; i++) {
          arr.push(i)
        }
        arr.sort(() => 0.5 - Math.random())
        arr.length = 2 //取出两位
        console.log("arr:", arr)
        let selectSportList = arr.map(item => {
          return sportList[item]
        })
        console.log("运动方案：", sportMessage, selectSportList)
        //把运动方案渲染到页面上
        selectSportList = selectSportList.map(sportItem => {
          sportItem.doneMin = 0
          sportItem.doneNumbers = 0
          return sportItem
        })
        this.setData({
          sportList: selectSportList
        })
        this.setProcess() //将推荐方案的运动进程放进运动目标进程
        sportMessage.sportList = selectSportList //将随机生成的运动方案放进运动信息了
        wx.setStorageSync('sportMessage', sportMessage) //将运动信息存进缓存
        let db = wx.cloud.database()
        //查找当天云上面的运动数据，如果已经有运动方案则更新，没有则添加
        db.collection('sportMessage').where({
          openid: wx.getStorageSync('openid'),
          sportMessage: {
            date: sportMessage.date
          }
        }).get().then(res => {
          console.log("查找当天运动信息成功", res)
          if (res.data.length !== 0) {
            //查找成功之后进行运动时间更新
            db.collection('sportMessage').doc(res.data[0]._id).update({
              data: {
                sportMessage: sportMessage
              }
            }).then(res => {
              console.log("当天运动时间更新", res)
            }).catch(res => {
              console.log("当天运动时间失败", res)
            })
          } else {
            //将运动信息添加至云平台
            wx.cloud.database().collection('sportMessage').add({
              data: {
                openid: wx.getStorageSync('openid'),
                sportMessage: sportMessage
              }
            }).then(res => {
              console.log("当天添加运动方案成功", res)
            }).catch(res => {
              console.log("当天添加运动方案成功", res)
            })
          }
        }).catch(res => {
          console.log("查找当天运动信息失败", res)
        })
      }
    }
  },
  //根据指标向后台请求数据返回运动群体分类
  dataRequest: function () {
    //用户如果没有登录则不做任何事
    if (!wx.getStorageSync('userInfo')) {
      return
    }
    //如果没有填写信息，跳转至填写信息界面
    // if (JSON.stringify(wx.getStorageSync('message')) == '{}' || wx.getStorageSync('inputData').length == 0) {
    //   wx.showModal({
    //     title: '提示',
    //     content: '请先填写体质数据',
    //     showCancel: false,
    //     success(res) {
    //       if (res.confirm) {
    //         wx.switchTab({
    //           url: '/pages/person/person'
    //         })
    //       }
    //     }
    //   })
    // } else {
      let that = this
      wx.cloud.database().collection('user').where({
          // openid: wx.getStorageSync('openid')
        }).get().then(res => {
          console.log("@@@index.js获取user数据成功", res.data)
          let {
            postData
          } = res.data[0]
          let data = {
            "include_req": false,
            "data": [postData]
          }
          wx.showLoading({
            title: '加载中...',
          })
          wx.request({
            url: 'https://aip.baidubce.com/rpc/2.0/ai_custom_bml/v1/table_infer/user_classification?access_token=24.dc8d9583c52125e80ada59bed5ca3932.2592000.1650512731.282335-25791958',
            method: 'post',
            data: JSON.stringify(data),
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            success: (res) => {
              console.log("获取用户分类成功", res.data)
              wx.hideLoading()
              //有资源返回
              if (res.data.batch_result) {
                console.log(11111)
                let label = res.data.batch_result[0] ? res.data.batch_result[0].label : null
                // wx.setStorageSync('label', label) //将获取的label存进缓存
                that.getSportList(label) //获取运动方案
                util.insertData(label) //更新类别
              } else {
                //假设的类别
                // wx.setStorageSync('label', 2) //将获取的label存进缓存
                that.getSportList(2) //获取运动方案
                util.insertData(2) //更新类别
              }
            },
            fail: (res) => {
              console.log("获取用户分类失败", res)
              return false
            }
          })
        })
        .catch(res => {
          wx.hideLoading()
          console.log("index.js获取user数据失败", res)
        })
    // }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //this.dataRequest()
    this.setData({
      isLogin: wx.getStorageSync('userInfo') ? true : false,
      userInfo: wx.getStorageSync('userInfo') ? wx.getStorageSync('userInfo') : {}
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
    if (wx.getStorageSync('userInfo')) {
      this.dataRequest() //向百度智能云发送数据，请求返回label
    }

    if(!wx.getStorageSync('avatarUrl')){
      db.collection('user').where({ name: 'avatarUrl' ,_openid: wx.getStorageSync('openid')}).get()
      .then(res => {
        this.setData({
          avatarUrl: res.data[0].avatarUrl
        })
        wx.setStorageSync('avatarUrl', res.data[0].avatarUrl)
      })
      .catch(err => {
        console.log('获取数据失败', err);
      });
    }
    else{
      this.setData({
        avatarUrl:wx.getStorageSync('avatarUrl')
      })
    }
  
    // this.updateLabel() //更新用户类别

    //util.insertData() //查询数据中是否有数据，没有则插入
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})