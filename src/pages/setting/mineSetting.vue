<template>
  <view style="background: #fff;">
    <uni-list>
      <uni-list-item
        v-for="(i, n) in items"
        :key="n"
        style="height: 120rpx;"
        :right-text="i.rightText"
        :title="i.name"
        link
        :to="i.link"
        @click="itemsEvent(i.type)"
      ></uni-list-item>
    </uni-list>
  </view>
</template>

<script setup>
  import {ref, reactive} from 'vue'
  const storageSize = ref('') // 保存缓存
  const items = reactive([{
  		name: '修改密码',
  		link: '/pages/login/forgetPassword',
  		type: 'a',
  		rightText: ''
  	},
  	{
  		name: '更换账号',
  		link: './changeAccount',
  		type: 'b ',
  		rightText: ''
  	},
  	{
  		name: '版本更新',
  		link: '',
  		type: 'c',
  		rightText: 'v1.0.1'
  	},
  	{
  		name: '清理缓存',
  		link: '',
  		type: 'd',
  		rightText: ''
  	},
  	{
  		name: '退出登录',
  		link: '',
  		type: 'e',
  		rightText: ''
  	}
  ])
  const itemsEvent = (type) => {
  	// 保存类型
  	if (type === 'c') {
  		uni.showModal({
  			title: '已检测到最新版本V2.0.1',
  			cancelText: '暂不更新',
  			confirmText: '立即更新',
  			success: function (res) {
  				if (res.confirm) {
  					console.log('用户点击立即更新')
  			} else if (res.cancel) {
  					console.log('用户点击暂不更新')
  			}
  			}
  		})
  	}
  	if (type === 'd') {
  		clearStorage()
  	}
  	if (type === 'e') {
  		uni.showModal({
  			title: '是否确认退出登录',
  			success: function (res) {
  				if (res.confirm) {
  					uni.navigateTo({
  						url: '/pages/login/login'
  					})
  				}
  			}
  		})
  	}
  }
  // 全局对话框确认
  const confirm = () => {
  	uni.navigateTo({
  		url: '/pages/login/login'
  	})
  }
  // 全局关闭对话框
  const close = () => {
  	console.log(1)
  }
  // 计算缓存
  const getStorageSize = () => {
  	uni.getStorageInfo({
  		success(res) {
  			//console.log(res.keys);
  			//console.log(res.limitSize);
  			const size = res.currentSize
  			if (size < 1024) {
  				storageSize.value = size + ' B'
  		} else if (size / 1024 >= 1 && size / 1024 / 1024 < 1) {
  				storageSize.value = Math.floor(size / 1024 * 100) / 100 + ' KB'
  		} else if (size / 1024 / 1024 >= 1) {
  				storageSize.value = Math.floor(size / 1024 / 1024 * 100) / 100 + ' M'
  		}
  		}
  	})
  }
  // 清楚缓存
  const clearStorage = () => {
  	uni.showModal({
  		content: '确定清除缓存吗?',
  		confirmText: '立即清除',
  		success(res) {
  			if (res.confirm) {
  				uni.clearStorageSync()
  			//重新获取并显示清除后的缓存大小
  		getStorageSize()
  			uni.showToast({
  					title: '清除成功'
  				})
  			}
  		}
  	})
  }
</script>

<style lang="scss"></style>
