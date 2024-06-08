const util = require('../../utils/util.js') //引入公共函数
Page({

  /**
   * 页面的初始数据
   */
  data: {
    modalName: null, //用来控制模态框
    checkbox: [{
      value: 0,
      name: '高血压',
      checked: false
    }, {
      value: 2,
      name: '高血脂',
      checked: false
    },{
      value: 3,
      name: '慢性阻塞性肺疾病(COPD)',
      checked: false
    },{
      value: 4,
      name: '心血管疾病',
      checked: false
    },{
      value: 5,
      name: '膝骨关节炎',
      checked: false
    },{
      value: 6,
      name: '骨质疏松',
      checked: false
    },{
      value: 7,
      name: '糖尿病',
      checked: false
    },{
      value: 8,
      name: '阿尔茨海默病（AD）',
      checked: false
    },{
      value: 9,
      name: '老年人慢性肾脏病',
      checked: false
    },{
      value: 10,
      name: '冠心病',
      checked: false
    },{
      value: 11,
      name: '睡眠障碍',
      checked: false
    },{
      value: 12,
      name: '原发性骨质疏松',
      checked: false
    },{
      value: 12,
      name: '老年人肌少症',
      checked: false
    },{
      value: 14,
      name: '冠状动脉粥样性心脏病',
      checked: false
    },{
      value: 15,
      name: '老年慢性心力衰竭',
      checked: false
    },{
      value: 16,
      name: '周围动脉疾病( PAD)',
      checked: false
    },{
      value: 17,
      name: '其他',
      checked: false
    }], //这里是多选模态框的数据
    inputData: [{
      name: "小腿围",
      value: 41,
      placeholder: "请输入整数",
      unit: "厘米",
      key: "calfGirth"
    }, {
      name: "心率",
      value: 71,
      placeholder: "请输入心律",
      unit: "次/分",
      key: "heartRate"
    }, {
      name: "收缩压",
      value: 130,
      placeholder: "请输入收缩压",
      unit: "mmHg",
      key: "systolic"
    }, {
      name: "舒张压",
      value: 90,
      placeholder: "请输入舒张压",
      unit: "mmHg",
      key:"diastolic"
    }, ], //手动填入表达数据
    pickerList: [{
        selector: [{
          value: "无",
          sign: 0
        }, {
          value: "有",
          sign: 1
        }],
        message: "当前有无锻炼",
        idx: 0,
        key: "exerciseNow"
      },
      {
        selector: [{
          value: "无",
          sign: 0
        }, {
          value: "有",
          sign: 1
        }],
        message: "过去有无进行锻炼",
        idx: 0,
        key: "exercisePast"
      },
      {
        selector: [{
          value: "几乎每天都有",
          sign: 1
        }, {
          value: "一周大约进行一次",
          sign: 2
        }, {
          value: "每个月至少进行一次",
          sign: 3
        }, {
          value: "没有每个月都做，偶尔进行",
          sign: 4
        }, {
          value: "从来补进行",
          sign: 5
        }],
        message: "做家务的频率",
        idx: 0,
        key: "housework"
      },
      {
        selector: [{
          value: "几乎每天都有",
          sign: 1
        }, {
          value: "一周大约进行一次",
          sign: 2
        }, {
          value: "每个月至少进行一次",
          sign: 3
        }, {
          value: "没有每个月都做，偶尔进行",
          sign: 4
        }, {
          value: "从来不进行",
          sign: 5
        }],
        message: "户外活动频率",
        idx: 0,
        key: "outdoor"
      },
      {
        selector: [{
          value: "可以",
          sign: 1
        }, {
          value: "有一点点困难",
          sign: 2
        }, {
          value: "不可以",
          sign: 3
        }],
        message: "能否走一公里",
        idx: 0,
        key: "walk"
      },
      {
        selector: [{
          value: "可以",
          sign: 1
        }, {
          value: "有一点点困难",
          sign: 2
        }, {
          value: "不可以",
          sign: 3
        }],
        message: "能否提起5kg重物",
        idx: 0,
        key: "weightlifting"
      },
      {
        selector: [{
          value: "可以",
          sign: 1
        }, {
          value: "有一点点困难",
          sign: 2
        }, {
          value: "不可以",
          sign: 3
        }],
        message: "能否进行三次蹲起",
        idx: 0,
        key: "squat"
      },
      {
        selector: [{
          value: "两只手都不可以",
          sign: 0
        }, {
          value: "只有一只手可以",
          sign: 1
        }, {
          value: "两只手都可以",
          sign: 2
        }],
        message: "能否用手触摸脖子",
        idx: 0,
        key: "neck"
      },
      {
        selector: [{
          value: "两只手都不可以",
          sign: 0
        }, {
          value: "只有一只手可以",
          sign: 1
        }, {
          value: "两只手都可以",
          sign: 2
        }],
        message: "能否用手触摸后背",
        idx: 0,
        key: "back"
      },
      {
        selector: [{
          value: "两只手都不可以",
          sign: 0
        }, {
          value: "只有一只手可以",
          sign: 1
        }, {
          value: "两只手都可以",
          sign: 2
        }],
        message: "能否举起双手",
        idx: 0,
        key: "hands"
      },
      {
        selector: [{
          value: "可以不需要借助手臂站起来",
          sign: 1
        }, {
          value: "需要借助手臂站起来",
          sign: 2
        }, {
          value: "站不起来",
          sign: 3
        }],
        message: "能否从椅子坐起来",
        idx: 0,
        key: "sitUp"
      },
      {
        selector: [{
          value: "可以站着捡起来",
          sign: 1
        }, {
          value: "需要坐着捡起来",
          sign: 2
        }, {
          value: "捡不起来",
          sign: 3
        }],
        message: "能否从地上捡起物体",
        idx: 0,
        key: "pickUp"
      }
    ], //单选器列表
  },
  //显示模态框
  showModal() {
    this.setData({
      modalName: "DialogModal1"
    })
  },
  //隐藏模态框
  hideModal(e) {
    let {message} = e.currentTarget.dataset
    //console.log(e)
    this.setData({
      modalName: null
    })
    //如果有既往病史则不建议运动
    if(message=="yes"){
      this.setData({
        modalName: "ChooseModal"
      })     
    }
  },
  //多选操作
  ChooseCheckbox(e) {
    let items = this.data.checkbox;
    let values = e.currentTarget.dataset.value;
    for (let i = 0, lenI = items.length; i < lenI; ++i) {
      if (items[i].value == values) {
        items[i].checked = !items[i].checked;
        break
      }
    }
    this.setData({
      checkbox: items
    })
  },
  //编辑填入的信息
  editMessage: function (e) {
    let {
      index
    } = e.currentTarget.dataset //获取当前填入框的index
    let {
      value
    } = e.detail
    let setInput = `inputData[${index}].value`
    //console.log(index,value,setInput)
    this.setData({
      [setInput]: value
    })
  },
  //单选
  PickerChange(e) {
    let {
      index
    } = e.currentTarget.dataset //获取当前选择器的index
    let {
      value
    } = e.detail
    let setSelector = `pickerList[${index}].idx`
    this.setData({
      [setSelector]: parseInt(value)
    })
    // this.setData({
    //   idx: e.detail.value
    // })
  },
  //保存体质数据
  savePhysique: function () {
    let {inputData} = this.data
    let i = 0
    let number = /^[+-]?[0-9]+(\.[0-9]{1,4})?$/ //保证输入的数据合法
    for(;i<inputData.length;i++){
      if(!number.test(inputData[i].value)){
        wx.showToast({
          title: `请输入正确的${this.data.inputData[i].name}`,
          icon: 'none'
        })
        return
      }
    }
    if(i==inputData.length){
      let {inputData,pickerList} = this.data
      let postData = wx.getStorageSync('postData')
      //遍历,将输入的值放进postData
      inputData.forEach((item)=>{
        postData[item.key] = parseFloat(item.value) 
      })
      //遍历,将选择的值放进postData
      pickerList.forEach((item)=>{
        postData[item.key] = parseFloat(item.selector[item.idx].sign)
      })
      //console.log("postData",postData,postData2)
      //把写好的数据放进缓存
      wx.setStorageSync('inputData', inputData)
      wx.setStorageSync('pickerList', pickerList)
      wx.setStorageSync('postData', postData)
      //将数据上传到云平台
      util.insertData(null)
      //判断体质数据是否填写完整
      if(!wx.getStorageSync('message')){
        wx.showModal({
          title: '提示',
          content: '还有个人信息没有填写',
          showCancel: false,
          success (res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '/pages/editperson/editperson',
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (wx.getStorageSync('inputData') && wx.getStorageSync('pickerList')) {
      this.setData({
        inputData: wx.getStorageSync('inputData'),
        pickerList: wx.getStorageSync('pickerList')
      })
    }
    //this.showModal()
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