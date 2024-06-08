import * as echarts from '../pages/ec-canvas/echarts'
const getTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('') + '' + [hour, minute, second].map(formatNumber).join('')
}
const formatTime2 = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return [year, month, day].map(formatNumber).join('/')
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
//计算两个日期相差多少天
const dateDiff = (startDateString, endDateString)=>{
	var separator = "/"; //日期分隔符
	var startDates = startDateString.split(separator);
	var endDates = endDateString.split(separator);
	var startDate = new Date(startDates[0], startDates[1]-1, startDates[2]);
	var endDate = new Date(endDates[0], endDates[1]-1, endDates[2]);
	return parseInt(Math.abs(endDate - startDate ) / 1000 / 60 / 60 /24) + 1;//把相差的毫秒数转换为天数 
};
//在云函数中查询自己信息，如果没有信息则插入信息
const insertData = function (label) {
  wx.cloud.callFunction({
        name: 'getUser',
        //给云函数传递的参数
        data:{
          openid:wx.getStorageSync('openid'),
          userInfo: wx.getStorageSync('userInfo') ? wx.getStorageSync('userInfo') : {},
          message: wx.getStorageSync('message') ? wx.getStorageSync('message') : {},
          postData: wx.getStorageSync('postData') ? wx.getStorageSync('postData') : {},
          label: label
        },
        success: res=>{
          console.log("插入或者更新数据成功",res)
        },
        fail: res=>{
          console.log("插入或者更新数据失败",res)
        }
      })
}
//获取近七天日期
const getDayList = function () {
  let that = this
  //设置日期，当前日期的前七天
  let myDate = new Date(); //获取今天日期
  myDate.setDate(myDate.getDate() - 6);
  let dateArray = [];
  let dateTemp;
  let flag = 1;
  for (let i = 0; i < 7; i++) {
    dateTemp = `${myDate.getFullYear()}/${formatNumber((myDate.getMonth()+1))}/${formatNumber(myDate.getDate())}`;
    dateArray.push(dateTemp);
    myDate.setDate(myDate.getDate() + flag);
  }
  //console.log(dateArray)
  let db = wx.cloud.database()
  let _ = db.command
  let xAxis = dateArray.map(dateItem => {
    return dateItem.slice(5)
  }) //x轴数据
  let yAxis = [] //y轴数据

  //#endregion
  db.collection('sportMessage').where({
    openid: wx.getStorageSync('openid'),
    sportMessage: {
      date: _.gte(dateArray[0]).and(_.lte(dateArray[dateArray.length - 1]))
    }
  }).get().then(res => {
    console.log("统计界面获取运动信息成功", res.data)
    let sportMessageList = res.data.map(item => {
      let min = item.sportMessage.sportList.reduce((cur, pre) => {
        return pre.doneNumbers == pre.numbers ? cur + pre.sportMin * pre.doneNumbers : cur + pre.sportMin * pre.doneNumbers + pre.doneMin
      }, 0)
      return {
        date: item.sportMessage.date,
        sumMin: min
      }
    })
    console.log("sportMessageList",sportMessageList)
    dateArray.map((dateItem,index) => {
      // console.log(index,xAxis, yAxis)
      //遍历看看是否有当天运动时间，有则返回运动时长，没有则返回0
      for (let i = 0; i < sportMessageList.length; i++) {
        //这里表示当天有运动，所以将运动时间存进去
        if (dateItem == sportMessageList[i].date) {
          //console.log(sportMessageList[i].sumMin)
          yAxis.push(sportMessageList[i].sumMin) 
          break
        }
      }
      //如果没值则放进0
      if(!yAxis[index]){
        yAxis.push(0)
      }
    })
    console.log("xAxis:",xAxis,"yAxis:", yAxis)
    //将数据存进缓存
    wx.setStorageSync('xAxis', xAxis)
    wx.setStorageSync('yAxis', yAxis)
    // let setXAxis = 'chartData.xAxis.data' //设置x轴数据
    // let setYAxis = 'chartData.series[0].data' //设置y轴数据
    // 渲染数据到页面上
    // this.setData({
    //   [setXAxis]: xAxis,
    //   [setYAxis]: yAxis
    // })
    //更改数据之后渲染图表
    //this.getList()
    //console.log(this.data.chartData.xAxis.data, this.data.chartData.series[0].data)
    //console.log("sportMessageList",sportMessageList)
  }).catch(res => {
    console.log("统计界面获取运动信息失败", res)
  })
}

module.exports = {
  getTime: getTime,
  formatTime: formatTime,
  formatTime2: formatTime2,
  formatNumber: formatNumber,
  insertData: insertData,
  dateDiff: dateDiff,
  getDayList: getDayList
}
