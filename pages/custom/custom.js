import util from '../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    number: 1, //自定义运动项目，最多为3个
    sportCustomList: [{
      sportName: "走路",
      number: 1, //运动次数
      sportMin: 1, //每次运动的数目，也就是频率
      sportNameIndex: 0, //运动项目索引
      numbersIndex: 0, //运动次数索引
      sportMinIndex: 0 //分钟索引
    }], //自定义列表，初始值为空
    sportName: ["快走",
      "肩胛伸展",
      "上背部伸展",
      "阔背肌伸展",
      "胸大肌伸展",
      "髂胫束伸展",
      "梨状肌伸展",
      "股四头肌三点伸展",
      "腿后肌伸展",
      "慢跑",
      "太极拳",
      "八段锦",
      "五禽戏",
      "健身操",
      "内收肌群伸展",
      "广场舞",
      "散步",
      "梨状肌伸展",
      "小腿伸展",
      "游泳",
    ], //可选择的运动
    numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], //今日完成相应组数的运动次数
    sportMin: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30], //运动时间
  },
  //调用选择框函数
  PickerChange: function (e) {
    //console.log(e)
    let {
      index,
      message
    } = e.currentTarget.dataset //获取索引以及是哪个选择框
    let value = parseInt(e.detail.value) //获取选择框选中的索引
    let setMessage = `sportCustomList[${index}].${message}` //设置运动名称
    let setIndex = `sportCustomList[${index}].${message}Index` //设置索引
    let selectMessage = ""
    //使用switch看看是设置运动类型还是次数还是分钟
    switch (message) {
      case 'sportName':
        selectMessage = this.data.sportName[value]
        break;
      case 'numbers':
        selectMessage = this.data.numbers[value]
        break;
      case 'sportMin':
        selectMessage = this.data.sportMin[value]
        break;
      default:
        break;
    }
    // console.log(setMessage,setIndex,value,selectMessage)
    this.setData({
      [setMessage]: selectMessage,
      [setIndex]: value
    })
    //console.log(this.data.sportCustomList)
  },
  //添加运动项目
  add: function () {
    let {
      sportCustomList
    } = this.data
    //console.log(sportCustomList)
    let newsportCustomList = JSON.parse(JSON.stringify(sportCustomList[0]))
    sportCustomList.push(newsportCustomList)
    this.setData({
      number: this.data.number + 1,
      sportCustomList: sportCustomList
    })
  },
  //删除选中的运动方案
  deleteSport: function (e) {
    //console.log(e)
    let {
      index
    } = e.currentTarget.dataset
    let {
      sportCustomList
    } = this.data
    sportCustomList.splice(index, 1)
    this.setData({
      sportCustomList: sportCustomList,
      number: this.data.number - 1
    })
  },
  //保存自定义运动方案
  save: function () {
    wx.setStorageSync('sportCustomList', this.data.sportCustomList)
    let sportNameList = this.data.sportCustomList.map(item=>{
      return item.sportName
    }) //用于判断有没有重复的运动
    // let flag = false //是否有重复的标志
    let temp = sportNameList.join(",") + "," //转为字符串，用于判断是否存在重复项
    // for (var i = 0; i < sportNameList.length; i++) {
    //     if (temp.replace(sportNameList[i] + ",", "").indexOf(sportNameList[i] + ",") > -1) {
    //       // flag = true
    //       wx.showModal({
    //         title: '提示',
    //         content: '有重复的运动项，请重新定义',
    //         showCancel: false,
    //         success (res) {
    //           if (res.confirm) {
    //             return
    //           }
    //         }
    //       })
    //     }
    // }
    let sportMessage = wx.getStorageSync('sportMessage')
    let sportList = this.data.sportCustomList.map(item=>{
      let sportListItem = {}
      sportListItem.name = this.data.sportName[item.sportNameIndex]
      sportListItem.sportMin = this.data.sportMin[item.sportMinIndex]
      sportListItem.doneMin = 0
      sportListItem.doneSec = 0
      sportListItem.numbers = this.data.numbers[item.numbersIndex]
      sportListItem.doneNumbers = 0
      sportListItem.img = "https://img2.baidu.com/it/u=2356160852,617048375&fm=253&fmt=auto&app=138&f=JPEG?w=791&h=500"
      return sportListItem
    })
    sportMessage.sportList = sportList
    wx.setStorageSync('sportMessage', sportMessage)
    wx.navigateBack({
      delta: 1,
    })
    console.log("自定义的方案", sportList)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let sportCustomList = wx.getStorageSync('sportCustomList') //从缓存中获取自定义运动方案
    this.setData({
      sportCustomList: sportCustomList ? sportCustomList : this.data.sportCustomList
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