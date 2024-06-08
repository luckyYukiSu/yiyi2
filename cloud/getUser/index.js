// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'lkj-7guox3sve2f77bd6'
})
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    db.collection('user').where({
      //下面为筛选条件
      name: 'userinfo',
      openid: event.openid
    }).get().then(res => {
      console.log('查询getUser成功', res)
      //查询，如果数据库中没有数据则插入，如果有则更新数据
      if (res.data.length == 0) {
        db.collection("user").add({
          data: {
            openid:event.openid,
            name:'userinfo',
            essage: event.message,
            postData: event.postData,
            label: event.label
          }
        }).then(res=>{
          console.log("插入数据成功",res)
        }).catch(res=>{
          console.log("插入数据失败",res)
        })
      }else{
        db.collection("user").doc(res.data[0]._id).update({
          data: {
            openid:event.openid,
            name: 'userinfo',
            message: event.message,
            postData: event.postData,
            label: event.label
          }
        }).then(res=>{
          console.log("更新成功",res)
        }).catch(res=>{
          console.log("更新失败",res)
        })
      }
    }).catch(res => {
      console.log("查询getUser失败", res)
    })
  } catch (e) {
    console.error(e);
  }
}