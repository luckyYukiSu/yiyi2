const util = require('../../utils/util.js') //引入公共函数
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {}, //用户信息
    message: {
      sex: "女",
      height: 168,
      weight: 60,
      age: 88,
      phone: "18888888888",
      e_mail: "1666888@qq.com"
    }
  },
  //保存信息
  saveMessge: function () {
    let {
      message
    } = this.data
    console.log(message)
    let number = /(^[1-9]\d*$)/
    let phone = /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
    let email = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
    //验证数据的格式是否正确，number等是正则表达式
    if (!(number.test(message.height))) {
      wx.showToast({
        title: '请输入正确的身高',
        icon: 'none'
      })
    } else if (!(number.test(message.weight))) {
      wx.showToast({
        title: '请输入正确的体重',
        icon: 'none'
      })
    } else if (!(number.test(message.age))) {
      wx.showToast({
        title: '请输入正确的年龄',
        icon: 'none'
      })
    } else if (!(phone.test(message.phone))) {
      wx.showToast({
        title: '请输入正确的手机号码',
        icon: 'none'
      })
    } else if (!(email.test(message.e_mail))) {
      wx.showToast({
        title: '请输入正确的邮箱',
        icon: 'none'
      })
    } else {
      //如果数据格式都是正确的，就对数据进行存储
      //将message数据保存下来
      wx.setStorageSync('message', message)
      let postData = wx.getStorageSync('postData')
      if (typeof postData !== 'object') {
        console.log('postData is not an object, initiallize!');
        postData = {};
      } 
      //将要作为指标分类的数据存进postData当中
      postData.sex = message.sex == '男' ? 0 : 1
      postData.age = parseInt(message.age) 
      postData.height = parseInt(message.height)
      postData.weight = parseInt(message.weight)
      wx.setStorageSync('postData', postData)
      //将数据上传到云平台
      util.insertData(null)
      //判断体质数据是否填写完整, 没有填写完整的话要去physique页面填写
      if(!wx.getStorageSync('inputData')||!wx.getStorageSync('pickerList')){
        wx.showModal({
          title: '提示',
          content: '还有其他体质数据没有填写',
          showCancel: false,
          success (res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '/pages/physique/physique',
              })
            }
          }
        })
      }else{
        wx.navigateBack({
          delta: 1,
        })
      } 
    }
  },

  // 获取头像
  bindchooseavatar : function(e) {
    /*
      首先是获取头像的链接，然后将头像上传到云存储中，同时获取返回的fileID
      将fileID存储在云数据库中，方便下次获取
    */
    const avatarUrl = e.detail.avatarUrl
    //获取文件后缀名
    const suffix = /\.[^\.]+$/.exec(avatarUrl)[0];
    // 生成文件名
    const fileName = 'avatarUrl/' + wx.getStorageSync('openid') +Date.now()+ suffix;
    //获取openid
    const openid = wx.getStorageSync('openid')
    //上传文件
    wx.cloud.uploadFile({
      cloudPath: fileName, // 上传至云端的路径
      filePath: avatarUrl, // 小程序临时文件路径
      success: res => {
        // 上传成功后，可以获取文件在云存储中的访问路径
        console.log('上传成功！文件访问路径：', res.fileID)
        const fileID = res.fileID
        this.setData({
          avatarUrl:fileID
        })
        //将fileID保存在内存中，方便其它时候访问
        wx.setStorageSync('avatarUrl', fileID)
        //将fileID保存在数据库中，方便其它页面进行访问
        //将用户昵称上传到数据库中保存
        wx.cloud.database().collection('user').where({ name: 'avatarUrl' ,_openid: wx.getStorageSync('openid')}).get()
        .then(res => {
          // 打印查询到的第一条字段的所有信息
          console.log('成功获取数据', res.data[0]);
          console.log(res.data.length); // 打印查询结果
          if (res.data.length > 0) {
            // 如果查询结果不为空，说明已经存在文件，需要先进行删除
            //删除云存储中的文件
            wx.cloud.deleteFile({
              fileList: [res.data[0].avatarUrl],
              success: res => {
                // 删除成功
                console.log('文件删除成功', res.fileList)
              },
              fail: console.error
            })
            //修改数据库中的头像链接            
            db.collection("user").where({
              name:"avatarUrl"
            }).update({
              data:{
                avatarUrl: fileID
              }
            }).then(res=>{
              console.log(res)
            })
          } else {
            // 如果查询结果为空，则说明当前用户还没有注册过
            db.collection('user').add({
              data:{
                  name:'avatarUrl',
                  avatarUrl: fileID
              },
              success: function(res) {
                  // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
                  console.log('添加成功',res)
                }
            })
          }
        })
        .catch(err => {
          console.log('获取数据失败', err);
        });
          
      }
    })

  },

  //获取昵称
  formsubmit: function(e){
    const nickName = e.detail.value.nickname
    console.log("nickName", nickName)
    //将用户昵称保存到数据库和内存中
    //将用户昵称保存到内存中，方便在其它地方显示
    wx.setStorageSync('nickName', nickName)
    this.setData({
      nickName:nickName
    })
    //将用户昵称上传到数据库中保存
    db.collection('user').where({ name: 'nickName' }).get()
  .then(res => {
    // 打印查询到的第一条字段的所有信息
    console.log('成功获取数据', res.data[0]);
    console.log(res.data.length); // 打印查询结果
    if (res.data.length > 0) {
      //如果查询结果不为空，则说明当前用户已经注册过了
      console.log('执行更新！')
      db.collection("user").where({
        name:"nickName"
      }).update({
        data:{
          nickName:nickName
        }
      }).then(res=>{
        console.log(res)
      })

    } 
    else {
      // 如果查询结果为空，则说明当前用户还没有注册过
      db.collection('user').add({
        data:{
            name:'nickName',
            nickName:nickName
        },
        success: function(res) {
            // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
            console.log('添加成功',res)
          }
      })
    }
  })
  .catch(err => {
    console.log('获取数据失败', err);
  });
    

  },

  //更改性别
  changeSex: function (e) {
    // 获取当前单选框的选中状态
  var sex = e.detail.value;
  // 更新 message 对象中的 sex 属性
  this.setData({
    'message.sex': sex
  });
  },
  //编辑信息
  editMessage: function (e) {
    let {
      sign
    } = e.target.dataset //看看是哪个输入框的的输入
    let {
      value
    } = e.detail //获取输入
    //console.log(e.detail.value,e.target.dataset.sign)
    let data = "message." + sign
    this.setData({
      [data]: value
    })
  },

  //获取头像和昵称的函数（增添函数）
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
    //从数据库中获取个人信息
    if(!wx.getStorageSync('message')){
      //从数据库中获取个人信息
      db.collection('user').where({
        //下面为筛选条件
        name: 'userinfo'
      }).get(res=>{
        //如果数据库中保存有个人信息
        if(res.data.length > 0){
          message = res.data[0].message
          this.setData({
            message:message
          })
        }
      }).then(res=>{
        console.log("成功获取userinfo",res)
      }).catch(res=>{
        console.log("获取userinfo失败",res)
      })
    }
    else{
      //从内存中获取个人数据信息
      this.setData({
        message: wx.getStorageSync('message')
      })
    }

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
    //获取头像和昵称
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