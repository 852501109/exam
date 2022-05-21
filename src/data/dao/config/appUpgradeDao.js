import myEnum from '@/data/utils/enum.js'
import myEntity from '@/data/utils/entity.js'
import $sqliteUtils from '@/data/utils/sqliteUtils.js'

// 库名字
const dbName = 'peis_config'
// 表名字
const tableName = 'app_upgrade'
/**
 * 建表语句
 * @param {*} callback
 */
function createTable(callback) {
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
      '"table_name" TEXT,' +
      '"upgrade_json" TEXT,' +
      '"status" INTEGER,' +
      '"push_time" TEXT,' +
      '"pull_time" TEXT)',
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
export default {
  createTable, //建表
}
