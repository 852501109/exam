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
<script>
  import pressure from '../home/diseaseVisit/bluetooth/pressure'
    export default {
   components: {pressure},
   data () {
   	return {
   	}
   },
    	computed: {},
    	mounted() {},
    	methods: {}
    }
</script>
<style scoped lang="scss">
  view {
  	margin-top: 100rpx;
  }
</style>
