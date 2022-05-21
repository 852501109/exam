import myEnum from '@/data/utils/enum.js'
import myEntity from '@/data/utils/entity.js'
import $sqliteUtils from '@/data/utils/sqliteUtils.js'

// 库名字
const dbName = 'peis_config'
// 表名字
const tableName1 = 'cjd_all_moudle'
const tableName2 = 'cjd_select_moudle'
/**
 * 建表语句
 * @param {*} callback
 */
function createTable(callback) {
  plus.sqlite.executeSql({
    name: dbName,
    //表格创建或者打开，后面为表格结构
    sql:
      'create table if not exists ' +
      tableName1 +
      '(' +
      '"id" INTEGER PRIMARY KEY AUTOINCREMENT,' +
      '"parent_id" TEXT,' +
      '"mod_name" TEXT,' +
      '"title" TEXT,' +
      '"region" TEXT,' +
      '"mark" TEXT)',
    success(e) {
      callback(
        myEntity.sqlRes(
          tableName1 + ' 创建表成功',
          myEnum.status.SUCCESS,
          myEnum.sqliteException.SUCCESS,
          e
        )
      )
      initCjdAllModuleData()
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
 * 初始化cjd_all_module 原始数据
 * @param {*} callback
 */
function initCjdAllModuleData(callback) {
  console.log('建allmodule数据')
}
/**
 * 建表语句
 * @param {*} callback
 */
function createTable2(callback) {
  plus.sqlite.executeSql({
    name: dbName,
    //表格创建或者打开，后面为表格结构
    sql:
      'create table if not exists ' +
      tableName2 +
      '(' +
      '"id" INTEGER PRIMARY KEY AUTOINCREMENT,' +
      '"parent_id" TEXT,' +
      '"mod_name" TEXT,' +
      '"title" TEXT,' +
      '"region" TEXT)',
    success(e) {
      callback(
        myEntity.sqlRes(
          tableName2 + ' 创建表成功',
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
  createTable2, //建表
}

// INSERT INTO "main"."cjd_all_moudle" ("id", "parent_id", "mod_name", "title", "region", "mark") VALUES (1, '0', NULL, '基本信息', NULL, NULL);
// INSERT INTO "main"."cjd_all_moudle" ("id", "parent_id", "mod_name", "title", "region", "mark") VALUES (2, '0', NULL, '自理能力', NULL, NULL);
// INSERT INTO "main"."cjd_all_moudle" ("id", "parent_id", "mod_name", "title", "region", "mark") VALUES (3, '0', NULL, '中医体质辨识', NULL, NULL);
// INSERT INTO "main"."cjd_all_moudle" ("id", "parent_id", "mod_name", "title", "region", "mark") VALUES (4, '0', NULL, '体检类', NULL, NULL);
// INSERT INTO "main"."cjd_all_moudle" ("id", "parent_id", "mod_name", "title", "region", "mark") VALUES (5, '0', NULL, '其他类', NULL, NULL);
// INSERT INTO "main"."cjd_all_moudle" ("id", "parent_id", "mod_name", "title", "region", "mark") VALUES (6, '0', NULL, '个性化类', NULL, NULL);
// INSERT INTO "main"."cjd_all_moudle" ("id", "parent_id", "mod_name", "title", "region", "mark") VALUES (7, '4', 'ZhengZhuangView', '症状', NULL, NULL);
// INSERT INTO "main"."cjd_all_moudle" ("id", "parent_id", "mod_name", "title", "region", "mark") VALUES (8, '4', 'ShenGaoTiZhongView', '身高体重', NULL, NULL);
// INSERT INTO "main"."cjd_all_moudle" ("id", "parent_id", "mod_name", "title", "region", "mark") VALUES (9, '4', 'XueYaView', '血压', NULL, '444');
// INSERT INTO "main"."cjd_all_moudle" ("id", "parent_id", "mod_name", "title", "region", "mark") VALUES (10, '4', 'ShengHuoFangShiView', '生活方式', NULL, NULL);
// INSERT INTO "main"."cjd_all_moudle" ("id", "parent_id", "mod_name", "title", "region", "mark") VALUES (11, '4', 'ZangQiGongNengKouQiangView', '脏器功能口腔', NULL, NULL);
// INSERT INTO "main"."cjd_all_moudle" ("id", "parent_id", "mod_name", "title", "region", "mark") VALUES (12, '4', 'ZangQiGongNengShiLiView', '脏器功能视力', NULL, NULL);
// INSERT INTO "main"."cjd_all_moudle" ("id", "parent_id", "mod_name", "title", "region", "mark") VALUES (13, '4', 'ZangQiGongNengTingLiYunDongGongNengView', '脏器功能听力', NULL, '333');
// INSERT INTO "main"."cjd_all_moudle" ("id", "parent_id", "mod_name", "title", "region", "mark") VALUES (14, '4', 'ZangQiGongNengTingLiYunDongGongNengView_ShuangCe', '脏器功能听力双侧', '泸州市泸县,泸州市江阳区,泸州市纳溪区,泸州市龙马潭区', '333');
// INSERT INTO "main"."cjd_all_moudle" ("id", "parent_id", "mod_name", "title", "region", "mark") VALUES (15, '4', 'ChaTiNeiKeView', '查体内科', NULL, NULL);
// INSERT INTO "main"."cjd_all_moudle" ("id", "parent_id", "mod_name", "title", "region", "mark") VALUES (16, '4', 'ChaTiWaiKeView', '查体外科', NULL, NULL);
// INSERT INTO "main"."cjd_all_moudle" ("id", "parent_id", "mod_name", "title", "region", "mark") VALUES (17, '4', 'ChaTiFuKeView', '查体妇科', NULL, NULL);
// INSERT INTO "main"."cjd_all_moudle" ("id", "parent_id", "mod_name", "title", "region", "mark") VALUES (18, '4', 'ChaTiQiTaView', '查体其他', NULL, NULL);
// INSERT INTO "main"."cjd_all_moudle" ("id", "parent_id", "mod_name", "title", "region", "mark") VALUES (19, '4', 'XianCunWenTiView3', '现存问题全国版', '泸州市泸县,泸州市江阳区,泸州市纳溪区,泸州市龙马潭区,全国版', '111');
// INSERT INTO "main"."cjd_all_moudle" ("id", "parent_id", "mod_name", "title", "region", "mark") VALUES (20, '4', 'XianCunWenTiView', '现存问题山东版', '山东版', '111');
// INSERT INTO "main"."cjd_all_moudle" ("id", "parent_id", "mod_name", "title", "region", "mark") VALUES (21, '4', 'XianCunWenTiView2', '现存问题东营版', '东营版', '111');
// INSERT INTO "main"."cjd_all_moudle" ("id", "parent_id", "mod_name", "title", "region", "mark") VALUES (22, '4', 'ZiLiNengLiView', '自理能力', NULL, NULL);
// INSERT INTO "main"."cjd_all_moudle" ("id", "parent_id", "mod_name", "title", "region", "mark") VALUES (23, '4', 'ZhongYiTiZhiView2', '中医体质按体质', NULL, '222');
// INSERT INTO "main"."cjd_all_moudle" ("id", "parent_id", "mod_name", "title", "region", "mark") VALUES (24, '4', 'ZhongYiTiZhiView1', '中医体质按问题', NULL, '222');
// INSERT INTO "main"."cjd_all_moudle" ("id", "parent_id", "mod_name", "title", "region", "mark") VALUES (25, '4', 'ZhuYuanYongYaoView', '用药情况和住院治疗情况', NULL, NULL);
// INSERT INTO "main"."cjd_all_moudle" ("id", "parent_id", "mod_name", "title", "region", "mark") VALUES (26, '4', 'BChaoView4', 'B超', NULL, NULL);
// INSERT INTO "main"."cjd_all_moudle" ("id", "parent_id", "mod_name", "title", "region", "mark") VALUES (27, '4', 'ECGMAC', '心电图', NULL, NULL);
// INSERT INTO "main"."cjd_all_moudle" ("id", "parent_id", "mod_name", "title", "region", "mark") VALUES (28, '4', 'JiaTingShanShiView', '家庭膳食', NULL, NULL);
// INSERT INTO "main"."cjd_all_moudle" ("id", "parent_id", "mod_name", "title", "region", "mark") VALUES (29, '6', 'FeiJieHeShaiChaView4LuXian', '肺结核筛查泸州泸县', '泸州市泸县', '0');
// INSERT INTO "main"."cjd_all_moudle" ("id", "parent_id", "mod_name", "title", "region", "mark") VALUES (30, '6', 'FeiJieHeShaiChaView4JiangYang', '肺结核筛查泸州江阳', '泸州市江阳区', '0');
// INSERT INTO "main"."cjd_all_moudle" ("id", "parent_id", "mod_name", "title", "region", "mark") VALUES (31, '6', 'FeiJieHeShaiChaView4NaXi', '肺结核筛查泸州纳溪', '泸州市纳溪区', '0');
// INSERT INTO "main"."cjd_all_moudle" ("id", "parent_id", "mod_name", "title", "region", "mark") VALUES (32, '6', 'FeiJieHeShaiChaView4LongMaTan', '肺结核筛查泸州龙马潭', '泸州市龙马潭区', '0');
// INSERT INTO "main"."cjd_all_moudle" ("id", "parent_id", "mod_name", "title", "region", "mark") VALUES (33, '4', 'XueXingView', '血型', NULL, NULL);
// INSERT INTO "main"."cjd_all_moudle" ("id", "parent_id", "mod_name", "title", "region", "mark") VALUES (34, '4', 'XueTangView', '血糖', NULL, NULL);
// INSERT INTO "main"."cjd_all_moudle" ("id", "parent_id", "mod_name", "title", "region", "mark") VALUES (35, '4', 'HbA1cView', '糖化血红蛋白', NULL, NULL);
// INSERT INTO "main"."cjd_all_moudle" ("id", "parent_id", "mod_name", "title", "region", "mark") VALUES (36, '4', 'XueJianTiaoMaView', '血检条码录入', NULL, NULL);
// INSERT INTO "main"."cjd_all_moudle" ("id", "parent_id", "mod_name", "title", "region", "mark") VALUES (37, '4', 'XueYaShuangCeView', '血压双血压计模式', NULL, '444');
// INSERT INTO "main"."cjd_all_moudle" ("id", "parent_id", "mod_name", "title", "region", "mark") VALUES (38, '4', 'GeRenjiBenXinXiView', '个人基本信息', NULL, NULL);
// INSERT INTO "main"."cjd_all_moudle" ("id", "parent_id", "mod_name", "title", "region", "mark") VALUES (39, '4', 'PaiZhaoQianZiZhiWenView', '签字', NULL, NULL);
// INSERT INTO "main"."cjd_all_moudle" ("id", "parent_id", "mod_name", "title", "region", "mark") VALUES (40, '4', 'DRView', 'DR', NULL, NULL);
// INSERT INTO "main"."cjd_all_moudle" ("id", "parent_id", "mod_name", "title", "region", "mark") VALUES (41, '4', 'LianXiFangShiView', '联系方式', NULL, NULL);
// INSERT INTO "main"."cjd_all_moudle" ("id", "parent_id", "mod_name", "title", "region", "mark") VALUES (42, '6', 'ZhongYiTiZhiPaiZhaoView', '中医拍照', '重庆巴南区', NULL);
// INSERT INTO "main"."cjd_all_moudle" ("id", "parent_id", "mod_name", "title", "region", "mark") VALUES (43, '4', 'DiZhiLuRuView', '户籍地址和现居地址', NULL, NULL);
// INSERT INTO "main"."cjd_all_moudle" ("id", "parent_id", "mod_name", "title", "region", "mark") VALUES (44, '6', 'KuoZhanXinXiView', '扩展信息', '重庆巴南区', NULL);
// INSERT INTO "main"."cjd_all_moudle" ("id", "parent_id", "mod_name", "title", "region", "mark") VALUES (45, '6', 'ZhongYiManXingBingErXueYaDouView4TuQiao', '慢性病耳穴压豆土桥', '成都金堂县土桥', NULL);
// INSERT INTO "main"."cjd_all_moudle" ("id", "parent_id", "mod_name", "title", "region", "mark") VALUES (46, '6', 'ZhongYiManXingBingShouZhiDianXueView4TuQiao', '慢性病手指点穴土桥', '成都金堂县土桥', NULL);
// INSERT INTO "main"."cjd_all_moudle" ("id", "parent_id", "mod_name", "title", "region", "mark") VALUES (47, '6', 'ZhongYiJianKangGuanLiSuiFangBiaoView4JinTang', '金堂县老年人中医健康管理随访表', '成都金堂县土桥', NULL);
// INSERT INTO "main"."cjd_all_moudle" ("id", "parent_id", "mod_name", "title", "region", "mark") VALUES (48, '6', 'ZhongYiManXingBingHuanZheJianKanGuanLiZhongYiGanYuJiLuBiaoView4TuQiao', '慢性病患者健康管理中医干预记录表土桥', '成都金堂县土桥', NULL);
// INSERT INTO "main"."cjd_all_moudle" ("id", "parent_id", "mod_name", "title", "region", "mark") VALUES (49, '4', 'ZongPaiZhaoView', '拍照', NULL, NULL);
