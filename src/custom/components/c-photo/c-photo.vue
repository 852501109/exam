<!--
* @description
* @fileName bluetooth.vue
* @author chenwenquan
* @date 2022/04/18 12:09:00
!-->
<template>
  <view>
	<button @click="upload">上传图片</button>
  </view>
</template>
<script setup>
	import {ref, reactive, computed} from 'vue'
	const upload = () => {
		uni.chooseImage({
			count: 6, //默认9
			sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
			sourceType: ['album'], //从相册选择
			success: function (res) {
				console.log(JSON.stringify(res.tempFilePaths))
			}
		})
	}
</script>
<style scoped lang="scss">
</style>
