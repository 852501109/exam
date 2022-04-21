// 查询app版本更新
import request from '@/common/request.js'
// 版本是否更新
export function onLineUpgrate(param) {
  return request.get('/fds/user/getVersions', param)
}
export function getIOSVersions(param) {
  return request.get('/fds/user/getIOSVersions', param)
}

// 验证token是否被删除
export function tokenVerify(param) {
  return request.get('/fds/user/tokenVerify', param)
}

// 判断找账号是否为初始密码
export function getUserPassword(param) {
  return request.get('/fds/user/getUserPassword', param)
}
