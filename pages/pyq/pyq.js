// pages/pyq/pyq.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userNumber: 0,
    pyqList: [], //
  },
  //跳转至发表动态界面
  toPyqPublish: function () {
    wx.navigateTo({
      url: '/pages/pyqpublish/pyqpublish',
    })
  },
  //获取所有动态内容
  getPyqList: function () {
    wx.showLoading({
      title: '加载中...',
    })
    //获取动态数据列表
    wx.cloud.callFunction({
      name: 'getData',
      data: {
        name: "pyqList"
      }
    }).then(res => {
      console.log("获取动态数据成功", res.result.data)
      let list = res.result.data.sort((a, b) => a['date'] > b['date'] ? -1 : 1)
      wx.hideLoading()
      this.setData({
        pyqList: list
      })
    }).catch(res => {
      console.log("获取动态数据失败", res)
      wx.hideLoading()
      wx.showToast({
        icon: "none",
        title: '加载失败'
      })
    })
    //获取当前社区人数
    wx.cloud.callFunction({
      name:'getData',
      data:{
        name: 'community'
      }
    }).then(res=>{
      console.log("获取社区人数成功",res.result.data)
      this.setData({
        userNumber: res.result.data.length
      })
    }).catch(res=>{
      console.log("获取社区人数失败",res.result.data)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    this.getPyqList()
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