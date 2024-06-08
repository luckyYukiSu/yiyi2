import * as echarts from '../ec-canvas/echarts'
import utils from '../../utils/util.js'
//画图表参考https://www.jianshu.com/p/8ae97f4ae7dc
//https://www.cnblogs.com/cnzlz/p/9245189.html
// 七天运动时间折线图
function initChart(canvas, width, height) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);
  var option = {
    title: {
      text: "近7日运动时间：单位(分钟)",
      textStyle: {
        color: '#445553',
        fontWeight: 'bold',
        fontSize: 18
      }
    },
    xAxis: {
      type: 'category',
      data: wx.getStorageSync('xAxis')
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      data: wx.getStorageSync('yAxis'),
      type: 'line',
      color: '#2A8B8A',
      // 显示数值
      itemStyle: {
        normal: {
          label: {
            show: true
          }
        }
      }
    }]
  };
  chart.setOption(option);
  return chart;
}
Page({
  data: {
    chartBar: { //图表柱状图表
      onInit: initChart
    },
    // chartData: {
    //   title: {
    //     text: "近7日运动时间：单位(分钟)",
    //     textStyle: {
    //       color: '#445553',
    //       fontWeight: 'bold',
    //       fontSize: 18
    //     }
    //   },
    //   xAxis: {
    //     type: 'category',
    //     data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    //   },
    //   yAxis: {
    //     type: 'value'
    //   },
    //   series: [{
    //     data: [120, 200, 150, 80, 70, 110, 130],
    //     type: 'line',
    //     color: '#2A8B8A',
    //     // 显示数值
    //     itemStyle: {
    //       normal: {
    //         label: {
    //           show: true
    //         }
    //       }
    //     }
    //   }]
    // }
  },
  onLoad: function (options) {
    //this.getList()
    //this.getDayList()
  },
  //图表结果
  initCharts(canvas, width, height) {
    console.log("chartData", this.data.chartData)
    let chartData = this.data.chartData;
    const chart = echarts.init(canvas, null, {
      width: width,
      height: height
    });
    canvas.setChart(chart);
    let option = chartData
    chart.setOption(option);
    return chart;
  },
  //用数据初始化图表
  getList() {
    console.log("调用getList")
    let that = this;
    let chartBar = 'chartBar.onInit';
    that.setData({
      [chartBar]: that.initCharts,
    })
  },
  //获取进七天日期
  getDayList: function () {
    let that = this
    //设置日期，当前日期的前七天
    let myDate = new Date(); //获取今天日期
    myDate.setDate(myDate.getDate() - 6);
    let dateArray = [];
    let dateTemp;
    let flag = 1;
    for (let i = 0; i < 7; i++) {
      dateTemp = `${myDate.getFullYear()}/${utils.formatNumber((myDate.getMonth()+1))}/${utils.formatNumber(myDate.getDate())}`;
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
    //#region
    // let getYAxis = function () {
    //   return new Promise((resolve, reject) => {
    //     dateArray.forEach(dateItem => {
    //       db.collection('sportMessage').where({
    //         openid: wx.getStorageSync('openid'),
    //         sportMessage: {
    //           date: dateItem
    //         }
    //       }).get().then(res => {
    //         //console.log("获取运动数据成功",res.data)
    //         if (res.data.length == 0) {
    //           yAxis.push({
    //             date: dateItem,
    //             sumMin: 0
    //           })
    //         } else {
    //           let min = res.data[0].sportMessage.sportList.reduce((cur, pre) => {
    //             return cur + pre.sportMin * pre.doneNumbers + pre.doneMin
    //           }, 0)
    //           yAxis.push({
    //             date: res.data[0].sportMessage.date,
    //             sumMin: min
    //           })
    //         }
    //       }).catch(res => {
    //         console.log("获取运动数据失败", res)
    //       })
    //     })
    //     //注意：这里得到的yAxis是不按日期顺序来的，返回前应该要排序，还有就是异步的问题，
    //     //可能没有设定好值就返回了
    //     resolve()
    //     //resolve(yAxis)
    //   })
    // }
    // getYAxis().then(() => {
    //   let setXAxis = 'chartData.xAxis' //设置x轴数据
    //   let setYAxis = 'chartData.yAxis' //设置y轴数据
    //   for (let i = 0; i < yAxis.length; i++) {
    //       console.log(yAxis[i])
    //   }
    //   let newYAxis = dateArray.map(dateItem => {
    //     console.log(xAxis, yAxis)
    //     //console.log(dateItem)
    //     // for (let i = 0; i < yAxis.length; i++) {
    //     //   if (dateItem == yAxis[i].date) {
    //     //     console.log(yAxis[i].sumMin)
    //     //     return yAxis[i].sumMin
    //     //   }
    //     // }
    //   })
    //   //console.log(xAxis, yAxis)
    //   // this.setData({
    //   //   [setXAxis]: xAxis,
    //   //   [setYAxis]: newYAxis
    //   // })
    // })
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
          return cur + pre.sportMin * pre.doneNumbers + pre.doneMin
        }, 0)
        return {
          date: item.sportMessage.date,
          sumMin: min
        }
      })
      yAxis = dateArray.map(dateItem => {
        //遍历看看是否有当天运动时间，有则返回运动时长，没有则返回0
        for (let i = 0; i < sportMessageList.length; i++) {
          if (dateItem == sportMessageList[i].date) {
            //console.log(sportMessageList[i].sumMin)
            return sportMessageList[i].sumMin
          } else {
            return 0
          }
        }
      })
      console.log(xAxis, yAxis)
      //将数据存进缓存
      wx.getStorageSync('xAxis',xAxis)
      wx.getStorageSync('yAxis',yAxis)
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
})