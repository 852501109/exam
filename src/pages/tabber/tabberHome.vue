<!--
* @description
* @fileName bluetooth.vue
* @author chenwenquan
* @date 2022/04/18 12:09:00
!-->
<template>
  <view>
    <view>vue3兼容部分vue2</view>
    <pressure @setPressure="setPressure"></pressure>
  </view>
</template>
<script setup>
  import pressure from '@/components/diseaseVisit/bluetooth/pressure'
  const setPressure = res => {
    console.log(res)
  }
</script>
<style scoped lang="scss">
  view {
  	margin-top: 100rpx;
  }
</style>
