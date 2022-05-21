import myEnum from '@/data/utils/enum.js'
import myEntity from '@/data/utils/entity.js'

//执行查询数据库的操作
function selectSql(databaseName, sql, callback) {
  // if(hasDataBaseName()){
  // 	callback("selectSql：数据库不存在，请重新设置数据库名，并连接数据库")
  // 	return;
  // }
  console.log('查询操作')
  plus.sqlite.selectSql({
    name: databaseName,
    sql: sql,
    success: function (e) {
      callback(
        myEntity.sqlRes('selectSql ', myEnum.status.SUCCESS, myEnum.sqliteException.SUCCESS, e)
      )
      //如果没有更多消息了，就返回一个warning
      //数据为空返回warning
    },
    fail: function (e) {
      callback(
        myEntity.sqlRes(
          '查询数据库 selectSql',
          myEnum.status.ERROR,
          myEnum.sqliteException.ERROR,
          e
        )
      )
    },
  })
}

/**
 * 打开单一数据库
 * @param {*} dbName
 * @param {*} callback
 */
function openDB(dbName, callback) {
  plus.sqlite.openDatabase({
    name: dbName,
    path: '_doc/' + dbName + '.db',
    success: function (e) {
      callback(
        myEntity.sqlRes(
          dbName + '数据库 openComDB',
          myEnum.status.SUCCESS,
          myEnum.sqliteException.SUCCESS,
          e
        )
      )
    },
    fail: function (e) {
      callback(
        myEntity.sqlRes(
          '打开数据库 ' + dbName + ' 失败',
          myEnum.status.ERROR,
          myEnum.sqliteException.ERROR,
          e
        )
      )
    },
  })
}

/**
 * 根据库名字得到全部表
 * @param {Object} dbName
 * @param {Object} callback
 */
function getAllTable(dbName, callback) {
  // if(hasDataBaseName()){
  // 	callback("getAllTable：数据库不存在，请重新设置数据库名，并连接数据库")
  // 	return;
  // }
  plus.sqlite.selectSql({
    name: dbName,
    // sql: "select type, name, tbl_name from sqlite_master order by type",
    sql: "select name from sqlite_master where name <> 'android_metadata' and name <> 'sqlite_sequence' order by type",
    success: function (e) {
      callback(
        myEntity.sqlRes(
          '得到全部表 getAllTable ',
          myEnum.status.SUCCESS,
          myEnum.sqliteException.SUCCESS,
          e
        )
      )
    },
    fail: function (e) {
      callback(
        myEntity.sqlRes(
          '得到全部表 getAllTable',
          myEnum.status.ERROR,
          myEnum.sqliteException.ERROR,
          e
        )
      )
    },
  })
}

export default {
  openDB, //打开或创建一个数据库
  getAllTable, //获得全部表
  selectSql, // 执行查询
}
