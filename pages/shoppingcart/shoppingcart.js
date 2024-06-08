// pages/shoppingcart/shoppingcart.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isAllSelect: false, //是否点击全选
    sumCredits: 660, //总需要的积分
    shopList: [{
      store: "牙牙乐",
      select: false,
      logo: "/image/store.png",
      goods: [{
        select: false,
        image: "https://img1.baidu.com/it/u=3153531494,1080716015&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=50",
        name: "牙牙乐营养牙膏",
        type: "草莓味",
        tip: "库存紧张",
        credits: 1288,
        numbers: 1
      }]
    },{
      store: "牙牙乐",
      select: false,
      logo: "/image/store.png",
      goods: [{
        select: false,
        image: "https://img1.baidu.com/it/u=3153531494,1080716015&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=50",
        name: "牙牙乐营养牙膏",
        type: "草莓味",
        tip: "库存紧张",
        credits: 1288,
        numbers: 1
      },{
        select: false,
        image: "https://img1.baidu.com/it/u=3153531494,1080716015&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=50",
        name: "牙牙乐营养牙膏",
        type: "草莓味",
        tip: "库存紧张",
        credits: 1288,
        numbers: 1
      }]
    }],
  },
  //判断是否全选
  isAll: function(){
    let newStoreList = this.data.shopList.filter(item=>{
      return item.select
    })
    //如果有一个商店没有全选，则判定不是全选
    if(newStoreList.length ==  this.data.shopList.length){
      this.setData({
        isAllSelect: true
      })
    } else{
      this.setData({
        isAllSelect: false
      })
    }
  },
  //判断某家商店商品是否全选
  isStoreAll: function(index){
    let store =  this.data.shopList[index]
    let newStore = store.goods.filter(item=>{
      return item.select
    })
    console.log(newStore.length,store.goods.length)
    let setStore = "shopList["+index+"].select"
    //如果有个商品有一个没选中，则不算某家店全选
    if(newStore.length == store.goods.length){
      this.setData({
        [setStore]: true
      })
    }
    else{
      //console.log("并没有全选")
      this.setData({
        [setStore]: false
      })
    }
    //最后判断是否全部商品全选
    this.isAll()
  },
  //全选
  setAllSelect: function (data) {
    let {dataset} = data.currentTarget
    let {isAllSelect,shopList} = this.data
    console.log(dataset)
    switch (dataset.message) {
      case 'isAllSelect': //点击的是底部的全选按钮
        let newShopList = shopList.map(item=>{
          item.select = !isAllSelect
          item.goods.map(good=>{
            good.select = !isAllSelect
            return good
          })
          return item
        })
        this.setData({
          isAllSelect: !isAllSelect,
          shopList: newShopList
        })
        //console.log(isAllSelect,newShopList)
        break;
        case 'shopList': //点击的是某个商店的全选按钮
          let shopListItem = shopList[dataset.index] //获取当前的商店
          shopListItem.select = !shopListItem.select
          shopListItem.goods = shopListItem.goods.map(item=>{
            item.select = shopListItem.select
            return item
          })
          let setStore = "shopList[" + dataset.index + "]"
          this.setData({
            [setStore]: shopListItem 
          })
          this.isAll()
          break;
        case 'goods': //点击的是某个商店的全选按钮
          let good = shopList[dataset.index].goods[dataset.idx] //获取当前商品
          let setGood = `shopList[${dataset.index}].goods[${dataset.idx}].select`
          this.setData({
            [setGood]: !good.select
          })
          this.isStoreAll(dataset.index)
        break;
      default:
        break;
    }
    
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