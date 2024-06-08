
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sportList: [], //推荐运动列表
  },
  //从本地缓存获取运动方案
  getSportList: function(){
    let {sportList} = wx.getStorageSync('sportMessage')
    let newSportList = sportList.map(sportItem=>{
      sportItem.timer = null
      sportItem.isStart = false
      return sportItem
    })
    //渲染数据
    this.setData({
      sportList: newSportList
    })
    //console.log("sportList",newSportList,this.data.sportList)
  },
  //计算百分数
  precrent: function (num, total) {
    return num <= 0 || total == 0 ? "0%" : (Math.round(num / total * 10000) / 100.00) + "%"
  },
  //跳转到观看视频界面
  toVideo: function () {
    wx.navigateTo({
      url: '/pages/video/video',
    })
  },
  //更新云上面的运动信息
  updateCloud: function(){
    let db = wx.cloud.database()
    const command = db.command
    let sportMessage = wx.getStorageSync('sportMessage') //从缓存当中获取运动信息
    //sportMessage.sportList = sportList //更新缓存运动信息信息
    //更新云上面的运动数据
    db.collection('sportMessage').where({
        openid: wx.getStorageSync('openid'),
        sportMessage: {
          date: sportMessage.date
        }
    }).get().then(res=>{
      console.log("查找当天运动信息成功",res)
      //查找成功之后进行运动时间更新
      db.collection('sportMessage').doc(res.data[0]._id).update({
        data:{
          sportMessage: sportMessage
      }}).then(res=>{
        console.log("当天运动时间更新",res)
      }).catch(res=>{
        console.log("当天运动时间失败",res)
      })
    }).catch(res=>{
      console.log("查找当天运动信息失败",res)
    })
  },
  //设置百分比
  setProcess: function(){
    let {sportList} = this.data
    // 通过map方法对运动列表进行遍历
    // map()是JavaScript中数组对象的方法之一，它可以对数组中的每一个元素执行同一个操作，生成一个新的数组。
    sportList = sportList.map((item) => {
      // 通过 precrent() 方法计算每个运动项目的完成百分比
      let precentNum = this.precrent(item.doneNumbers, item.numbers)
      let precentMin = this.precrent(item.doneMin, item.sportMin) 
      let precentSec = this.precrent(item.doneMin*60 + item.doneSec, item.sportMin*60)
      item["precentMin"] = precentMin
      item["precentNum"] = precentNum
      item["precentSec"] = precentSec
      console.log(precentSec)
      return item
    })
    //渲染数据到页面上
    this.setData({
      sportList: sportList
    })
    let sportMessage = wx.getStorageSync('sportMessage') //从缓存当中拿去运动信息
    sportMessage.sportList = sportList
    wx.setStorageSync('sportMessage', sportMessage) //更新缓存当中的运动信息
  },
  //开始和停止运动,更改运动状态
  setSportStatu: function (e) {
    // 从事件对象的 currentTarget 属性中取出 dataset 属性，并从中解构出 index 属性，赋值给变量 index。
    let {index} = e.currentTarget.dataset 
    let {isStart,doneMin,doneSec,doneNumbers,sportMin,numbers,timer} = this.data.sportList[index] //取得状态,运动时间,定时器
    // ` `是ES6的模板字符串语法
    let setStatu = `sportList[${index}].isStart` //更改状态
    let setMin = `sportList[${index}].doneMin` //更改运动时间
    let setSec = `sportList[${index}].doneSec`
    let setNumbers = `sportList[${index}].doneNumbers` //更改运动次数
    let setTimer = `sportList[${index}].timer` //设置定时器
    //定时器不能关闭的原因：每次点击按钮触发这个函数的时候，都会生成一个定时器，所以，
    //在点击停止运动的时候又生成了一个定时器，和开始运动那个定时器加起来一共两个定时器了，
    //所以只停止一次是不行的

    if(!isStart){
      console.log("开启定时器")
      this.setData({
        // [setTimer]和[setStatu]是用ES6的计算属性名称语法动态生成的属性名。
        // 设置定时器，每秒执行一次函数中的逻辑。
        // setInterval()是一个异步函数
        [setTimer]: setInterval(()=>{
          //console.log("timer")
          if(doneNumbers==numbers){  //运动次数够了清除定时器
            console.log("运动完成")
            clearInterval(this.data.sportList[index].timer)
            this.setProcess() //同步百分比
            this.setData({
              [setStatu]: false
            })
          }else if(doneMin==sportMin){ //运动时间满了，运动次数+1
            console.log("运动组数+1")
            doneNumbers+=1
            doneMin = doneNumbers==numbers?doneMin: 0 //运动是否完成
            this.setData({
              [setMin]: doneMin,
              [setNumbers]: doneNumbers
            })
            this.setProcess() //同步百分比
          }else {
            console.log("运动中...")
            doneSec+=1
            if(doneSec == 60){
              doneMin+=1
              doneSec = 0
            }
            this.setData({
              [setMin]: doneMin,
              [setSec]: doneSec
            })
            this.setProcess() //同步百分比
          }
        },1000)
      })
    }else{
      console.log("关闭定时器")
      clearInterval(timer)
    }
    this.setData({
      [setStatu]: !isStart, //状态设为反
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSportList() //获取运动列表
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
    //离开页面调用更新云数据
    this.updateCloud()
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