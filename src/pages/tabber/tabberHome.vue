<!--
* @description
* @fileName bluetooth.vue
* @author chenwenquan
* @date 2022/04/18 12:09:00
!-->
<template>
  <view>
    <view>我就是单纯的想知道vue2的语法可以不可兼容</view>
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
