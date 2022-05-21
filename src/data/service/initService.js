//初始化数据库业务
import myEnum from '@/data/utils/enum.js'
import myEntity from '@/data/utils/entity.js'
import $configService from '@/data/service/configService.js'
import $request from '@/utils/request/index'
import $init from '@/data/utils/init'
import $sqliteUtils from '@/data/utils/sqliteUtils.js'
/**
 * 整体初始化业务
 */
function initAll(callback) {
  // 1.建库 初始化软件配置库
  $configService.initPeisConfig(res => {
    console.log(res)
  })

  // 2.建库 体检数据库

  // 3.同步库 基础信息库 需要先判断是否需要覆盖(这步先不管)
  $init.download('http://192.168.1.110:8084/peis_base.db', 'peis_base.db')
  // $sqliteUtils.openDB('peis_base.db', res => {
  //   $sqliteUtils.getAllTable('peis_base.db', res => {
  //     console.log(res)
  //   })
  // })

  // websocket
  $init.initWs()
  // 4.同步库 历史数据库(todo:改为后台更新)
  // $request.get('/download/db/peis_history').then(res => {
  //   console.log(res)
  // })
}

/**
 * 删除全部表(重新初始化)
 * @param {*} callback
 */
function deleteAll(callback) {
  clearFile('_doc/peis_base.db')
  clearFile('_doc/peis_history.db')
  clearFile('_doc/peis_config.db')
  clearFile('_doc/peis_data.db')
}
/**
 * 删除db文件
 */
function clearFile(db_url) {
  plus.io.resolveLocalFileSystemURL(db_url, function (entry) {
    entry.remove()
  })
}
export default {
  initAll, //整体初始化业务
  deleteAll, // 删除全部表(重新初始化)
}
