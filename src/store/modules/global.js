// store.js
import { defineStore } from 'pinia'

// defineStore 调用后返回一个函数，调用该函数获得 Store 实体
export const GlobalStore = defineStore({
  // id: 必须的，在所有 Store 中唯一
  id: 'myGlobalState',
  // state: 返回对象的函数
  state: () => ({
    a: 1,
    globalSqlite: {},
  }),
  getters: {},
  actions: {
    setXXX(number) {
      this.a = number
    },
    setSqlite(obj) {
      this.globalSqlite = obj
    },
  },
})
