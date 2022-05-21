import store from '@/store'
import { userStore } from '@/store/modules/user'
function openWs(callback) {
  closeWs()
  callback('连接websocket,实时接收消息...')
  connect()
  uni.onSocketError(function (res) {
    /* 断开连接5秒之后重新连接 */
    // setTimeout(() => {
    //   connect()
    //    }, 5000)
    console.log('WebSocket连接打开失败，请检查！')
    // 断连后到此处,5s一次自动尝试连接
  })
  uni.onSocketMessage(function (res) {
    userStore().setLinkStatus(2)
    console.log('收到服务器内容：' + res.data)
  })
}
function connect() {
  uni.connectSocket({
    url: `ws://${userStore().ipAddress}/chat01?lzp`,
  })
}
function closeWs(callback) {
  userStore().setLinkStatus(1)
  console.log('WebSocket连接已打开！')
  uni.closeSocket()

  uni.onSocketClose(function (res) {
    console.log('WebSocket 已关闭！')
  })
}

function sendToWs(msg, callback) {
  callback('发送数据到websocket...')

  uni.sendSocketMessage({
    data: msg,
  })
}

export default {
  openWs,
  sendToWs,
  closeWs,
}
