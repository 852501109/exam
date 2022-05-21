import myEnum from '../utils/enum.js'
import myEntity from '../utils/entity.js'
// 库名字
const dbName = 'peis_base'
// 表名字
const tableName = 'cjd_userinfo'
/**
 * 建表语句
 * @param {*} callback
 */
function createCjdUserinfo(callback) {
  // if(hasDataBaseName()){
  // 	callback("createChat：数据库不存在，请重新设置数据库名，并连接数据库")
  // 	return;
  // }
  plus.sqlite.executeSql({
    name: dbName,
    //表格创建或者打开，后面为表格结构
    sql:
      'create table if not exists ' +
      tableName +
      '(' +
      '"id" INTEGER PRIMARY KEY AUTOINCREMENT,' +
      '"username" TEXT,' +
      '"password" TEXT,' +
      '"name" TEXT,' +
      '"gender" TEXT,' +
      '"title" TEXT,' +
      '"phone" TEXT,' +
      '"qm_url" TEXT,' +
      '"user_permissions" TEXT)',
    success(e) {
      callback(
        myEntity.sqlRes(
          tableName + ' 创建表成功',
          myEnum.status.SUCCESS,
          myEnum.sqliteException.SUCCESS,
          e
        )
      )
    },
    fail(e) {
      console.log('创建表失败:' + JSON.stringify(e))
      callback(
        myEntity.sqlRes('创建表 createChat', myEnum.status.ERROR, myEnum.sqliteException.ERROR, e)
      )
    },
  })
}

/**
 * insert
 */
function insertBean(bean, callback) {
  // if(hasDataBaseName()){
  // 	callback("insertMsg：数据库不存在，请重新设置数据库名，并连接数据库")
  // 	return;
  // }

  const sql =
    'INSERT INTO ' +
    tableName +
    ' (username,password,name,gender,title,phone,qm_url,user_permissions)' +
    'VALUES ("' +
    bean.username +
    '","' +
    bean.password +
    '","' +
    bean.name +
    '",' +
    bean.gender +
    '",' +
    bean.title +
    '",' +
    bean.phone +
    '",' +
    bean.qm_url +
    '",' +
    bean.user_permissions +
    ')'
  plus.sqlite.executeSql({
    name: dbName,
    sql: sql,
    success: function (e) {
      console.log(sql)
      callback(
        myEntity.sqlRes(
          '保存一条消息 insertBean ',
          myEnum.status.SUCCESS,
          myEnum.sqliteException.SUCCESS,
          e
        )
      )
    },
    fail: function (e) {
      callback(
        myEntity.sqlRes(
          '保存一条消息 insertBean',
          myEnum.status.ERROR,
          myEnum.sqliteException.ERROR,
          e
        )
      )
    },
  })
}

export default {
  createCjdUserinfo,
  insertBean,
}
