//本用户一个数据库,切换用户换数据库，这个数据库名位用户id+message
//需要用到数据库异常枚举：sqliteException
import myEnum from './myEnum.js'
//需要用到固定的数据库返回格式：sqlRes
import myEntity from './myEntity.js'

let databaseName = ""
//数据库存储地址
let databasePath = "";
console.log(databaseName)

function setDataBaseName(userId) {
	databaseName = userId + "_message";
	databasePath = "_doc/" + databaseName + ".db";
}
/**
 * 
 * @param {Object} str
 */
function strIsExist(str) {
	if (str == "" || str == null || str == undefined) {
		return false;
	}
	return true;
}

function hasDataBaseName() {
	if (!strIsExist(databaseName) || !strIsExist(databasePath)) {
		console.log("数据库不存在，请重新设置数据库名，并连接数据库")
		console.log(myEnum.sqliteException.UN_CONNECT)
		return true;
	}
	return false;
}

function openComDB(userId, callback) {
	setDataBaseName(userId)
	plus.sqlite.openDatabase({
		name: databaseName,
		path: databasePath,
		success: function(e) {
		
			callback(myEntity.sqlRes(databaseName + "数据库 openComDB", myEnum.status.SUCCESS, myEnum
				.sqliteException.SUCCESS, e));
		},
		fail: function(e) {
			callback(myEntity.sqlRes("打开数据库 "+databaseName+" 失败", myEnum.status.ERROR, myEnum.sqliteException.ERROR,
				e));
		}
	})
}
//创建表，一个对应用户一张表
//表名为 m聊天对象id
function createChat(tableName, callback) {
	// if(hasDataBaseName()){
	// 	callback("createChat：数据库不存在，请重新设置数据库名，并连接数据库")
	// 	return;
	// }
	plus.sqlite.executeSql({
		name: databaseName,
		//表格创建或者打开，后面为表格结构
		sql: 'create table if not exists ' + tableName + '(' +
			'"id" INTEGER PRIMARY KEY AUTOINCREMENT,' +
			'"content" TEXT,' +
			'"type" TEXT,' +
			'"time" TEXT,' +
			'"isMe" TEXT)',
		success(e) {
			callback(myEntity.sqlRes(tableName + " 创建表成功", myEnum.status.SUCCESS, myEnum.sqliteException
				.SUCCESS, e));
		},
		fail(e) {
			console.log("创建表失败:" + JSON.stringify(e));
			callback(myEntity.sqlRes("创建表 createChat", myEnum.status.ERROR, myEnum.sqliteException.ERROR, e));
		}
	})
}
//删除表
function deleteTable(tableName, callback) {
	// if(hasDataBaseName()){
	// 	callback("deleteTable：数据库不存在，请重新设置数据库名，并连接数据库")
	// 	return;
	// }
	plus.sqlite.executeSql({
		name: databaseName,
		//表格创建或者打开，后面为表格结构
		sql: 'DROP TABLE ' + tableName,
		success(e) {
			callback(myEntity.sqlRes(tableName + " 删除表成功", myEnum.status.SUCCESS, myEnum.sqliteException
				.SUCCESS, e));
		},
		fail(e) {
			callback(myEntity.sqlRes("删除表 createChat", myEnum.status.ERROR, myEnum.sqliteException.ERROR, e));
		}
	})
}
//执行查询数据库的操作
function selectSql(sql, callback) {
	// if(hasDataBaseName()){
	// 	callback("selectSql：数据库不存在，请重新设置数据库名，并连接数据库")
	// 	return;
	// }
	plus.sqlite.selectSql({
		name: databaseName,
		sql: sql,
		success: function(e) {
			callback(myEntity.sqlRes("selectSql ", myEnum.status.SUCCESS, myEnum.sqliteException.SUCCESS,
				e));
			//如果没有更多消息了，就返回一个warning
			//数据为空返回warning
		},
		fail: function(e) {
			callback(myEntity.sqlRes("查询数据库 selectSql", myEnum.status.ERROR, myEnum.sqliteException.ERROR,
				e));
		}
	})
}
//得到全部表
function getAllTable(callback) {
	// if(hasDataBaseName()){
	// 	callback("getAllTable：数据库不存在，请重新设置数据库名，并连接数据库")
	// 	return;
	// }
	plus.sqlite.selectSql({
		name: databaseName,
		// sql: "select type, name, tbl_name from sqlite_master order by type",
		sql: "select name from sqlite_master where name <> 'android_metadata' and name <> 'sqlite_sequence' order by type",
		success: function(e) {
			callback(myEntity.sqlRes("得到全部表 getAllTable ", myEnum.status.SUCCESS, myEnum.sqliteException
				.SUCCESS, e));
		},
		fail: function(e) {
			callback(myEntity.sqlRes("得到全部表 getAllTable", myEnum.status.ERROR, myEnum.sqliteException.ERROR,
				e));
		}
	})
}
//保存一条消息
function insertMsg(tableName, msg, callback) {
	// if(hasDataBaseName()){
	// 	callback("insertMsg：数据库不存在，请重新设置数据库名，并连接数据库")
	// 	return;
	// }

	var sql = 'INSERT INTO ' + tableName + ' (content,type,time,isMe)' +
		'VALUES ("' + msg.content + '","' + msg.type + '","' + msg.time + '",' + msg.isMe + ')'
	plus.sqlite.executeSql({
		name: databaseName,
		sql: sql,
		success: function(e) {
			console.log(sql)
			callback(myEntity.sqlRes("保存一条消息 insertMsg ", myEnum.status.SUCCESS, myEnum.sqliteException
				.SUCCESS, e));
		},
		fail: function(e) {
			callback(myEntity.sqlRes("保存一条消息 insertMsg", myEnum.status.ERROR, myEnum.sqliteException.ERROR,
				e));
		}
	})
}
//批量插入数据
function insertManyMsg(tableName, msgs, callback) {
	// if(hasDataBaseName()){
	// 	callback("insertManyMsg：数据库不存在，请重新设置数据库名，并连接数据库")
	// 	return;
	// }

	if (msgs.length == 0 || msgs[0] == null || msgs[0] == undefined) {
		return;
	}
	var sql = 'INSERT INTO ' + tableName + ' (content,type,time,isMe) VALUES ';
	sql = sql + '("' + msg[0].content + '","' + msg[0].type + '","' + msg[0].time + '",' + msg.isMe[0] + ')';

	for (var i = 1; i < msgs.length; i++) {
		sql = sql + ',("' + msg[i].content + '","' + msg[i].type + '","' + msg[i].time + '",' + msg.isMe[i] + ')';
	}
	plus.sqlite.executeSql({
		name: databaseName,
		sql: sql,
		success: function(e) {
			console.log(sql)
			callback(myEntity.sqlRes("批量插入数据 insertManyMsg ", myEnum.status.SUCCESS, myEnum.sqliteException
				.SUCCESS, e));
		},
		fail: function(e) {
			callback(myEntity.sqlRes("批量插入数据 insertManyMsg", myEnum.status.ERROR, myEnum.sqliteException
				.ERROR, e));
		}
	})
}

//得到历史数据
/**
 * @param {Object} tableName table名
 * @param {Object} nowMsgNum 当前显示的数量
 * @param {Object} pageNum 这次想得到的数量
 * @param {Object} callback 回调函数
 */
function getOldMsg(tableName, nowMsgId, pageNum, callback) {
	// if(hasDataBaseName()){
	// 	callback("getOldMsg：数据库不存在，请重新设置数据库名，并连接数据库")
	// 	return;
	// }

	var sql = "SELECT count(1) FROM " + tableName 
	// + " where id < " + nowMsgId + " order by time desc limit " + pageNum;
	console.log(sql)
	plus.sqlite.selectSql({
		name: databaseName,
		sql: sql,
		success: function(e) {
			//如果无历史记录了，则返回一个空数组，在前端判断，如果为空数组，则后面无数据了
			//如果没有更多消息了，就返回一个warning
			//数据为空返回warning
			console.log(e)
			if (e.length == 0) {
				callback(myEntity.sqlRes("得到历史数据 getOldMsg ", myEnum.status.WARNING, myEnum.sqliteException
					.SUCCESS, e));
			} else {
				callback(myEntity.sqlRes("得到历史数据 getOldMsg ", myEnum.status.SUCCESS, myEnum.sqliteException
					.SUCCESS, e));
			}
		},
		fail: function(e) {
			callback(myEntity.sqlRes("得到历史数据 getOldMsg", myEnum.status.ERROR, myEnum.sqliteException.ERROR,
				e));
		}
	})
}

export default {
	// setDataBaseName,//设置数据库名
	openComDB, //打开或创建一个数据库
	createChat, //创建一个通话
	deleteTable, //删除一个表
	selectSql, //执行一条sql查询语句
	getAllTable, //得到全部的表
	insertMsg, //插入一条消息
	insertManyMsg, //插入多条消息
	getOldMsg, //得到历史数据
}

/**
 * sql语句：
 * 得到一张表的全部字段：'PRAGMA  table_info([' + this.tableName + '])'
 * 删除一个数据库表
				// deleteTable(this.tableName,res => {
				// 	console.log(res)
				// })
 * 
 * 
 * 查询语句：
 * SELECT * FROM m1171702529
 */
