// 软件配置库业务
import myEnum from '@/data/utils/enum.js'
import myEntity from '@/data/utils/entity.js'
import $sqliteUtils from '@/data/utils/sqliteUtils.js'
import $appDeviceDao from '@/data/dao/config/appDeviceDao.js'
import $appUpgradeDao from '@/data/dao/config/appUpgradeDao.js'
import $appVersionDao from '@/data/dao/config/appVersionDao.js'
import $cjdModuleDao from '@/data/dao/config/cjdModuleDao.js'
import $moduleConfigDao from '@/data/dao/config/moduleConfigDao.js'
import $padConfigDao from '@/data/dao/config/padConfigDao.js'
import padConfigDao from '@/data/dao/config/padConfigDao.js'
import appUpgradeDao from '@/data/dao/config/appUpgradeDao.js'
import appVersionDao from '@/data/dao/config/appVersionDao.js'
import $ws from '@/data/utils/ws.js'
function initPeisConfig(callback) {
  // 1.打开软件配置库
  $sqliteUtils.openDB('peis_config', res => {
    console.log(res)
  })
  // 2.查询所有表
  $sqliteUtils.getAllTable('peis_config', res => {
    console.log(res.data)
    // 3.没有表则建表
    if (res.data == '') {
      // 建以下表
      // 1.全部采集模块(+数据)
      $cjdModuleDao.createTable()
      // 2.选择采集模块
      $cjdModuleDao.createTable2()
      // 3.模块配置范围(+数据)
      $moduleConfigDao.createTable()
      // 4.pad配置表
      $padConfigDao.createTable()
      // 5.app连接硬件信息表
      $appDeviceDao.createTable()
      // 6.app配置升级记录
      $appUpgradeDao.createTable()
      // 7.app版本信息
      $appVersionDao.createTable()
    }
  })
}

export default {
  initPeisConfig, //初始化配置库
}
