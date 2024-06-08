// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'lkj-7guox3sve2f77bd6'
})

// 云函数入口函数
//通过传入的参数获取相应数据库的数据
exports.main = async (event, context) => {
  return cloud.database().collection(event.name).get()
}