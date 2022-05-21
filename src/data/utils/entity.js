// 构造方法  对象
/**
 * @param {Object} content
 * @param {Object} type  this.$myEnum.type.IMAGE / this.$myEnum.type.TEXT
 * @param {Object} time
 */
function Msg(content, type, time) {
  const thisMsg = {
    content: content, //动作类型
    type: type, //聊天消息类型
    time: time == null ? Date.parse(new Date()) : time, //时间戳
    isMe: true, //是否本人
  }
  return thisMsg
}
// 构造方法  websocket发送的消息对象
function MsgContent(action, senderId, receiverId, msg, extend) {
  const thisMsgContent = {
    action: action, //动作类型
    senderId: senderId, //发送者id，在最上面已经获取了当前登录用户，nowUser
    receiverId: receiverId, //接收者id
    msg: msg, //聊天消息内容
    extend: extend, //扩展字段
  }
  return thisMsgContent
}
// 数据库返回消息格式
function sqlRes(method, status, code, data) {
  const thisSqlRes = {
    method: method,
    status: status, //SUCCESS、WARNING、ERROR
    code: code, //状态码
    data: data, //值
  }
  return thisSqlRes
}
export default {
  Msg, //构造一个聊天消息对象
  MsgContent, //构造一个服务器接收的消息对象
  sqlRes, //数据库返回格式
}
