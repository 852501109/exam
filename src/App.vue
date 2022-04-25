<script>
  import {
  	downApk
  } from '@/common/upData.js'
  import {
  	onLineUpgrate,
  	getIOSVersions,
  	tokenVerify
  } from '@/utils/request/updata.js'
  export default {
  	onLaunch: function() {
  		// plus.screen.lockOrientation("portrait-primary")
  		// 在这里打开数据库全局打开一次即可
  		// try {
  		// 	openComDB('mbsf', '_doc/nfcList.db', res => {
  		// 		console.log(res)
  		// 	})
  		// } catch(e) {
  		// 	//TODO handle the exception
  		// 	//console.log('打开数据库异常',e)
  		// }
  		//检验当前版本是不是最新
  		// 热更新
  		plus.runtime.getProperty(plus.runtime.appid, function(widgetInfo) {
  			uni.request({
  				url: 'http://www.example.com/update/',
  				data: {
  					version: widgetInfo.version,
  					name: widgetInfo.name
  				},
  				success: (result) => {
  					const data = result.data
  					if (data.update && data.wgtUrl) {
  						uni.downloadFile({
  							url: data.wgtUrl,
  							success: (downloadResult) => {
  								if (downloadResult.statusCode === 200) {
  									plus.runtime.install(downloadResult
  										.tempFilePath, {
  											force: false
  										},
  										function() {
  											console.log('install success...')
  											plus.runtime.restart()
  										},
  										function(e) {
  											console.error('install fail...')
  										})
  								}
  							}
  						})
  					}
  				}
  			})
  		})
  		// 以下是整包更新
  		// const appId = plus.runtime.appid
  		// const version = plus.runtime.version
  		// const platform = uni.getSystemInfoSync().platform
  		// if (platform === "android") {
  		// 	onLineUpgrate({
  		// 		appId: appId,
  		// 		versionsId: version
  		// 	}).then((res) => {
  		// 		if (res.ret && res.data.status) {
  		// 			const dowloadUrl = res.data.url
  		// 			console.log(res)
  		// 			let updateMessage = ''
  		// 			res.data.log.forEach(function(item, value) {
  		// 				updateMessage += item + "\n"
  		// 			})
  		// 			uni.showModal({
  		// 				content: '检测到有新版本，是否立即进行安装？新版本更新内容' + updateMessage,
  		// 				success: function(res) {
  		// 					if (res.confirm) {
  		// 						downApk(dowloadUrl)
  		// 					} else if (res.cancel) {
  		// 						plus.runtime.quit()
  		// 					}
  		// 				}
  		// 			})
  		// 		}
  		// 	}, (err) => {
  		// 		//异常处理；
  		// 		console.log(err)
  		// 		uni.reLaunch({
  		// 			url: '/pages/login/index'
  		// 		})
  		// 		//网络有问题或者系统维护中，跳转到登录页面
  		// 	})
  		// } else if (platform === "ios") {
  		// 	const req = {}
  		// 	req.versionsId = plus.runtime.version
  		// 	getIOSVersions(req).then((res) => {
  		// 		console.log('ios版本更新状态', res)
  		// 		if (res.ret) {
  		// 			if (!res.data.status) {
  		// 				let updateMessage = ''
  		// 				res.data.log.forEach(function(item, value) {
  		// 					updateMessage += item + "\n"
  		// 				})
  		// 				uni.showModal({
  		// 					content: '检测到版本改变，是否前往app store?新版本更新内容' + updateMessage,
  		// 					success: (res) => {
  		// 						if (res.confirm) {
  		// 							const appleId = '1592224072'
  		// 							plus.runtime.launchApplication({
  		// 								action: `itms-apps://itunes.apple.com/cn/app/id${appleId}?mt=8`
  		// 							}, function(e) {
  		// 								console.log(
  		// 									'Open system default browser failed: ' +
  		// 									e.message)
  		// 							})
  		// 						} else if (res.cancel) {
  		// 							console.log('取消')
  		// 						}
  		// 					}
  		// 				})
  		// 			}
  		// 		}
  		// 	})
  		// }
  		// // 验证token是否失效
  		// if (uni.getStorageSync('token')) {
  		// 	tokenVerify().then(res => {
  		// 		console.log('验证账号是否删除', res)
  		// 		if (res.ret) {
  		// 			setTimeout(() => {
  		// 				// #ifdef APP-PLUS
  		// 				plus.navigator.closeSplashscreen()
  		// 				// #endif
  		// 			}, 2000)
  		// 			uni.switchTab({
  		// 				url: '/pages/home/index'
  		// 			})
  		// 		} else {
  		// 			uni.removeStorageSync('token')
  		// 			setTimeout(() => {
  		// 				// #ifdef APP-PLUS
  		// 				plus.navigator.closeSplashscreen()
  		// 				// #endif
  		// 			}, 2000)
  		// 			uni.reLaunch({
  		// 				url: '/pages/login/index'
  		// 			})
  		// 		}
  		// 	})
  		// } else {
  		// 	setTimeout(() => {
  		// 		// #ifdef APP-PLUS
  		// 		plus.navigator.closeSplashscreen()
  		// 		// #endif
  		// 	}, 2000)
  		// 	uni.reLaunch({
  		// 		url: '/pages/login/index'
  		// 	})
  		// }
  	},
  	onShow: function() {
  		//console.log('App Show');
  	},
  	methods: {},
  	onHide: function() {
  		console.log('App Hide')
  	}
  }
</script>

<style lang="scss">
  @import "./assets/scss/mixin.scss";
  @import "./uni.scss";
  /*每个页面公共css */
</style>
