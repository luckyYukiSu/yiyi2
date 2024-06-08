Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {}, //用户信息
    credits: 188, //积分
    level: "lv8", //用户等级
    condition: ["全部", "公益", "出行", "美食", "娱乐", "日用"], //筛选条件列表
    conditionIndex: 0, //选中条件的索引
    goodList: [{
        img: "https://img2.baidu.com/it/u=2669208947,469529225&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=333",
        name: "牛奶",
        credits: 120,
        sales: 8888
      },
      {
        img: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fcbu01.alicdn.com%2Fimg%2Fibank%2F2016%2F469%2F058%2F3260850964_721023602.jpg&refer=http%3A%2F%2Fcbu01.alicdn.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1650625416&t=bfbe1066672504dbae0647b68195152e",
        name: "纸巾",
        credits: 50,
        sales: 666
      },
      {
        img: "https://t00img.yangkeduo.com/openapi/images/2020-09-09/7aaa5bb4ea83c1a9e0cfbea60603b155.jpg",
        name: "剥蒜器",
        credits: 150,
        sales: 189
      },
      {
        img: "https://img0.baidu.com/it/u=1373315815,3662288451&fm=253&fmt=auto&app=138&f=JPEG?w=220&h=197",
        name: "环保袋",
        credits: 50,
        sales: 1000
      },
      {
        img: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Finews.gtimg.com%2Fnewsapp_bt%2F0%2F13962431716%2F641&refer=http%3A%2F%2Finews.gtimg.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1650627223&t=9d7af9c2d095ca44f6847a4801b0f723",
        name: "鸡蛋",
        credits: 90,
        sales: 1000
      },
      {
        img: "https://img1.baidu.com/it/u=2314653885,4126488686&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=452",
        name: "保鲜袋",
        credits: 100,
        sales: 1200
      },
      {
        img: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg1.mydrivers.com%2Fimg%2F20211105%2FS3d61ec68-5f76-457c-8bea-10dc7f54e3f4.png&refer=http%3A%2F%2Fimg1.mydrivers.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1650627349&t=0ecf80d6ad99f3af952617a46ca46020",
        name: "口罩",
        credits: 90,
        sales: 2000
      },
    ], //商品列表
  },
  //选中条件
  setConIndex: function (data) {
    let {
      index
    } = data.currentTarget.dataset
    this.setData({
      conditionIndex: index
    })
  },
  //跳转到购物车界面
  toShoppingCart: function () {
    wx.navigateTo({
      url: '/pages/shoppingcart/shoppingcart',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: wx.getStorageSync('userInfo') ? wx.getStorageSync('userInfo') : {},
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