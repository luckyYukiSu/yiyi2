// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'lkj-7guox3sve2f77bd6'
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  return {
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}