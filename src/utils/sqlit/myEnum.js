export default {
	// websocket接收的消息类型
	action: {
		CONNECT: 1, //第一次(或重连)初始化连接
		CHAT: 2, //聊天消息
		SIGNED: 3, //消息签收
		KEEPALIVE: 4, //客户端保持心跳
		PULL_FRIEND: 5 //拉取好友
	},
	// 聊天消息类型枚举
	type: {
		TEXT: 1, //文字
		IMAGE: 2 //图片
	},
	sqliteException: {
		SUCCESS: 200, //成功
		// SELECT_EMPTY: 201, //查找为空
		UN_CONNECT: 301, //未连接
		ERROR: 500 //报错
	},
	status:{
		SUCCESS:"success",
		WARNING:"warning",
		ERROR:"error"
	}
}
//this.$myEnum.type.TEXT
