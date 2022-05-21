<template>
  <view>
	<view v-if="store.linkStatus === 1" class="link_status error" @tap="toipSetting">
	  <image src="/static/errorlink.png" />
	  未连接主机
	</view>
	<view v-if="store.linkStatus === 2" class="link_status success" @tap="toipSetting">
	  <image src="/static/successlink.png" />
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
