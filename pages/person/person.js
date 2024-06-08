const app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    credits: 188, //积分
    tip:'请完善个人信息'
  },
  //跳转至修改信息界面
  toEdit: function(){
    wx.navigateTo({
      url: '/pages/editperson/editperson',
    })
  },
  //跳转到填写体质数据界面
  toPhysique: function(){
    wx.navigateTo({
      url: '/pages/physique/physique',
    })
  },

  //获取头像和昵称的函数
  getUserInfo: function(name){
    if(!wx.getStorageSync(name)){
      db.collection('user').where({ name: name , _openid:wx.getStorageSync('openid')}).get()
      .then(res => {
        let obj = {}
        obj[name] = res.data[0][name]
        this.setData(obj)
        wx.setStorageSync(name, res.data[0][name])
      })
      .catch(err => {
        console.log('获取数据失败', err);
      });
    }
    else{
      let obj = {}
      obj[name] = wx.getStorageSync(name)
      this.setData(obj)
    }
  },
    /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(wx.getStorageSync('userInfo'))
    this.setData({
      userInfo: wx.getStorageSync('userInfo')? wx.getStorageSync('userInfo'): {},
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
    //获取头像信息。如果内存中有则从内存获取，否则请求数据库
    this.getUserInfo('avatarUrl')
    this.getUserInfo('nickName')
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