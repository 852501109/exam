export default {
  install(Vue, options) {
    // 弹窗公用方法
    Vue.prototype.$showToast = function (title) {
      uni.showToast({
        icon: 'none',
        duration: 3000,
        title: title,
      })
    }
    // 全局loading
    Vue.prototype.$showLoading = function (title) {
      uni.showLoading({
        title: title,
        mask: true,
      })
    }
    // 全局返回上一级
    Vue.prototype.$backIndex = function () {
      setTimeout(function () {
        uni.navigateBack({
          delta: 1,
        })
      }, 1000)
    }
    // 节流公用方法
    /**
     * 节流函数
     * @param method 事件触发的操作
     * @param mustRunDelay 间隔多少毫秒需要触发一次事件
     */
    Vue.prototype.$throttle = function throttle(method, mustRunDelay) {
      let timer,
        args = arguments,
        start
      return function loop() {
        const self = this
        const now = Date.now()
        !start && (start = now)
        timer && clearTimeout(timer)

        if (now - start >= mustRunDelay) {
          method.apply(self, args) // 大于800ms - 执行滚动触发的console方法
          start = now
        } else {
          //  递归调用 - 更新最新事件的延时器
          timer = setTimeout(function () {
            loop.apply(self, args) //  50ms - 调用自身方法，获取最新事件戳
          }, 50) //  太小影响性能，太大响应缓慢
        }
      }
    }
    // 图片地址
    // 阿里云
    const platform = uni.getSystemInfoSync().platform
    if (platform === 'ios') {
      Vue.prototype.$IMGURL = 'https://photo.mljde.com/'
    } else {
      Vue.prototype.$IMGURL = 'http://photo.mljde.com/'
    }
  },
}
