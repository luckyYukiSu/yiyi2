// pages/consultation/consultation.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    doctorList: [
      {
        name: '曾祥城',
        position: '运动损伤主管|康复治疗师',
        hospital: '广州和平骨科医院',
        level: '二级',
        img: 'https://6c6b-lkj-7guox3sve2f77bd6-1311245690.tcb.qcloud.la/photo/%E7%94%B7.jpg?sign=c46bea8b53464345f20d16b0f697343d&t=1683693860'
      },
      {
        name: '李小封',
        position: '康复治疗师',
        hospital: '广州和平骨科医院',
        level: '二级',
        img: 'https://6c6b-lkj-7guox3sve2f77bd6-1311245690.tcb.qcloud.la/photo/%E5%A5%B3.jpg?sign=b03799a7de81e029b22bed86bf98dfc1&t=1683693917'
      },
      {
        name: '陈文超',
        position: '康复治疗师',
        hospital: '广州和平骨科医院',
        level: '二级',
        img: 'https://6c6b-lkj-7guox3sve2f77bd6-1311245690.tcb.qcloud.la/photo/cyw.jpg?sign=df104e7904e731b7a02b7a813fd98ef2&t=1683693935'
      },
      {
        name: '李小封',
        position: '康复治疗师',
        hospital: '广州和平骨科医院',
        level: '二级',
        img: ''
      }
    ],
    departmentCategory: [
      '外科手术', 
      '急诊', 
      '关节骨科']
    ,
    category: [
      {
        name: '创伤骨科',
        content: '复杂骨骼脱位'
      },
      {
        name: '关节骨科',
        content: '类风湿关节炎'
      },
      {
        name: '创伤骨科',
        content: '上颈椎损伤'
      },
      {
        name: '创伤骨科',
        content: '复杂骨骼脱位'
      },
      {
        name: '关节骨科',
        content: '类风湿关节炎'
      },
      {
        name: '创伤骨科',
        content: '上颈椎损伤'
      }
    ],
  },

  search(e) {
    console.log(e)
  },

  checkedCategory(e) {
    console.log(e)
  },

  //跳转到在线医师界面
  toOnline() {
    wx.navigateTo({
      url: '/pages/online/online',
    })
  },

  //跳转到预约挂号界面
  toDoctorList(){
    wx.navigateTo({
      url: '/pages/doctorList/doctorList',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})