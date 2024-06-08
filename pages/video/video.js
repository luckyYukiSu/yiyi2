// pages/video/video.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoName: "八段锦", //视频名称
    videoSrc: "https://6c6b-lkj-7guox3sve2f77bd6-1311245690.tcb.qcloud.la/video/%E5%85%AB%E6%AE%B5%E9%94%A6.mp4?sign=e79f6cd884acb9f447f6b1c3c5393e39&t=1683474493", //视频链接
    introduction: `八段锦功法是一套独立而完整的健身功法，起源于北宋，共八百多年的历史。古人把这套动作比喻为“锦”，意为五颜六色，美而华贵！体现其动作舒展优美，视其为“祛病健身，效果极好；编排精致；动作完美，”现代的八段锦在内容与名称上均有所改变，此功法分为八段，每段一个动作，故名为“八段锦”，练习无需器械，不受场地局限，简单易学，节省时间，作用极其显著；效果适合于男女老少，可使瘦者健壮，肥者减肥。` ,//视频简介
    comment: [{
      avatarUrl: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg1.doubanio.com%2Fview%2Frichtext%2Flarge%2Fpublic%2Fp39485599.jpg&refer=http%3A%2F%2Fimg1.doubanio.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1649041244&t=f090d01d3640aa1e83e4698930790574",
      nickName: "Laurie",
      time: "2022/03/05",
      content: "八段锦功法是一套独立而完整的健身功法，起源于北宋，共八百多年的历史。"
    },{
      avatarUrl: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg1.doubanio.com%2Fview%2Frichtext%2Flarge%2Fpublic%2Fp39485599.jpg&refer=http%3A%2F%2Fimg1.doubanio.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1649041244&t=f090d01d3640aa1e83e4698930790574",
      nickName: "Laurie",
      time: "2022/03/05",
      content: "八段锦功法是一套独立而完整的健身功法，起源于北宋，共八百多年的历史。"
    }] ,//用户评论
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(wx.getStorageSync('userInfo'))
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