import gcoord from '../../utils/gcoord.js' //引入坐标矫正函数
Page({
  data: {
    Height: 0,
    scale: 13,
    latitude: "", //纬度
    longitude: "", //经度
    markers: [], //所有位置
    // controls: [{
    //   id: 1,
    //   iconPath: '/image/location.png',
    //   position: {
    //     left: 320,
    //     top: 100 - 50,
    //     width: 20,
    //     height: 20
    //   },
    //   clickable: true
    // },
    // {
    //   id: 2,
    //   iconPath: '/image/location.png',
    //   position: {
    //     left: 340,
    //     top: 100 - 50,
    //     width: 20,
    //     height: 20
    //   },
    //   clickable: true
    // }
    // ],
    circles: [] //位置所代表的圈圈
  },
  //跳转只动态界面
  toPyq: function(){
    wx.navigateTo({
      url: '/pages/pyq/pyq',
    })
  },
  //将获取的信息渲染到页面上
  setMessage: function (latitude, longitude) {
    //将校正的作为信息存进result中
    var result = gcoord.transform(
      [latitude,longitude],    // 经纬度坐标
      gcoord.WGS84,               // 当前坐标系
      gcoord.BD09                 // 目标坐标系
    );
    //console.log("result",result); 
    wx.cloud.callFunction({
      name: 'getData',
      data: {
        name: "community"
      }
    }).then(res => {
      console.log("查询community数据成功", res.result.data)
      let {
        data
      } = res.result //查询的数组
      let markers = [] //位置数组
      let circles = [] //代表位置的圈圈
      data.map((dataItem, index) => {
        let marketItem = {}
        let circleItem = {}
        marketItem.id = index
        marketItem.latitude = dataItem.latitude
        marketItem.longitude = dataItem.longitude
        marketItem.width = 50
        marketItem.height = 50
        marketItem.iconPath = "/image/location.png"
        marketItem.title = dataItem.userInfo.nickName
        markers.push(marketItem)
        circleItem.latitude = dataItem.latitude
        circleItem.longitude = dataItem.longitude
        circleItem.color = '#FF0000DD'
        circleItem.fillColor = '#7cb5ec88'
        circleItem.radius = 30
        circleItem.strokeWidth = 1
        circles.push(circleItem)
      })
      //console.log(markers, circles)
      this.setData({
        latitude: result[0],
        longitude: result[1],
        markers: markers,
        circles: circles
      })
    }).catch(res => {
      console.log("查询community数据失败", res)
    })
  },
  //获取地图所需数据
  getMap: function () {
    var that = this;
    let db = wx.cloud.database()
    let openid = wx.getStorageSync('openid') //openid
    let userInfo = wx.getStorageSync('userInfo') //用户信息
    wx.getLocation({
      type: 'gcj02', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
      success: function (res) {
        let latitude = res.latitude //经度
        let longitude = res.longitude //维度
        console.log("经纬度", latitude, longitude)
        //将community数据渲染到页面上
        db.collection('community').where({
          openid: openid
        }).get().then(res => {
          console.log("查询地理位置成功", res)
          //将community数据渲染到页面上
          if (res.data.length == 0) {
            db.collection('community').add({
              data: {
                openid: openid,
                userInfo: userInfo,
                latitude: latitude,
                longitude: longitude
              }
            }).then(res => {
              console.log("首次插入地理位置信息成功", res)
              //数据插入成功后将数据渲染到页面上
              that.setMessage(latitude, longitude)
            }).catch(res => {
              console.log("首次插入地理位置信息失败", res)
            })
          } else {
            db.collection('community').doc(res.data[0]._id).update({
              data: {
                latitude: latitude,
                longitude: longitude
              }
            }).then(res => {
              console.log("更新地理位置信息成功", res)
              //数据更新成功后将数据渲染到页面上
              that.setMessage(latitude, longitude)
            }).catch(res => {
              console.log("更新地理位置信息失败", res)
            })
          }
        }).catch(res => {
          console.log("获取地理位置失败", res)
        })
      }
    })
  },
  //地图的使用，参考https://www.jianshu.com/p/01efa02134ba
  onLoad: function () {
    this.getMap()
    // this.setMessage()
  },
  regionchange(e) {
    //console.log("regionchange===" + e.type)
  },
  //点击merkers
  markertap(e) {
    //console.log("点击了坐标点", e.markerId, e)
    //底部弹出框
    // wx.showActionSheet({
    //   itemList: ["A"],
    //   success: function (res) {
    //     console.log(res.tapIndex)
    //   },
    //   fail: function (res) {
    //     console.log(res.errMsg)
    //   }
    // })
  },
  //点击缩放按钮动态请求数据
  controltap(e) {
    var that = this;
    console.log("scale===" + this.data.scale)
    if (e.controlId === 1) {
      // if (this.data.scale === 13) {
      that.setData({
        scale: --this.data.scale
      })
      // }
    } else {
      //  if (this.data.scale !== 13) {
      that.setData({
        scale: ++this.data.scale
      })
      // }
    }
  },
})