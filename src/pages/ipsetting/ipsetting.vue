<template>
  <view class="page_wrapper">
    <c-nav left-icon="left" left-text="主机ip" />
    <view class="title">通过主机ip同步数据</view>
    <view class="form_item">
      <view class="input_wrapper">
        <uni-easyinput
          v-model="form.ip"
          :input-border="false"
          :placeholder-style="holder.ip.color"
          :placeholder="holder.ip.text"
          class="custom_easyinput"
        />
        <view v-if="holder.ip.color" class="detail_toast">账号不能为空</view>
      </view>
      <view
        class="submit_btn"
        :class="{'disable_btn': isDisabled, 'success_btn': !isDisabled}"
        @click="save"
      >
        保存
      </view>
    </view>
  </view>
</template>

<script setup>
     import { userStore } from '@/store/modules/user'
  import $init from '@/data/utils/init'
     import {
        onMounted,
     reactive,
     computed,
        ref,
      } from 'vue'
      const store = userStore()
      const holder = reactive({
      	ip: {
      		color: '',
      		text: '请输入ip地址',
      		isRequire: '请输入ip地址',
      		normal: '请输入ip地址'
      	}
      })
   onMounted(() => {
     form.ip = store.ipAddress
   })
   const form = reactive({
   	ip: ''
   })
   const isDisabled = computed(() => {
   	let is = false
   	Object.keys(form).forEach(key => {
   		if (holder[key].color || !form[key]) {
   			is = true
   		}
   	})
   	return is
   })
   /* 保存ip */
   const save = () => {
    // 缓存ip地址，并且将id添加到全局数据管理中
    uni.setStorageSync('ipAddress', form.ip)
    store.setIpAddress(form.ip)
    $init.initWs()
    uni.navigateBack()
   }
</script>

<style lang="scss"></style>
