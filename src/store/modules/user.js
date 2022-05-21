// store.js
import { defineStore } from 'pinia'

// defineStore 调用后返回一个函数，调用该函数获得 Store 实体
export const userStore = defineStore({
  // id: 必须的，在所有 Store 中唯一
  id: 'myUserState',
  // state: 返回对象的函数
  state: () => ({
    linkStatus: 1,
    ipAddress: uni.getStorageSync('ipAddress'),
    version: 'V0.100',
    isRemenber: uni.getStorageSync('isRemenber'),
    userGlobal: {},
    userInfo: uni.getStorageSync('userInfo') ? JSON.parse(uni.getStorageSync('userInfo')) : '',
  }),
  getters: {},
  actions: {
    setIpAddress(ipAddress) {
      this.ipAddress = ipAddress
    },
    setLinkStatus(number) {
      this.linkStatus = number
    },
    setUserInfo(userInfo) {
      this.userInfo = userInfo
    },
    setRemenber(isRe) {
      this.isRemenber = isRe
    },
    setUserGlobal(obj) {
      this.userGlobal = obj
    },
  },
})
