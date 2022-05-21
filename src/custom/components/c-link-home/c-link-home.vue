<template>
  <view>
	<view v-if="store.linkStatus === 1" class="link_status_home error_home" @tap="toipSetting">
	 <uni-icons color="#FBDEB7" type="chat-filled" size="15"></uni-icons>
	  未连接主机
	</view>
	<view v-if="store.linkStatus === 2" class="link_status_home success_home" @tap="toipSetting">
	  <uni-icons color="#FFFFFF" type="chat-filled" size="15"></uni-icons>
	  已连接主机
	</view>
  </view>
</template>
<script setup>
	import { userStore } from '@/store/modules/user'
   // 跳转到ip设置界面
   const store = userStore()
   const toipSetting = () => {
    uni.navigateTo({
    	url: '/pages/ipsetting/ipsetting'
    })
   }
</script>
<style scoped lang="scss">
</style>
