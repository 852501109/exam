<!--
* @description
* @fileName bluetooth.vue
* @author chenwenquan
* @date 2022/04/18 12:09:00
!-->
<template>
  <view>
	<button @click="upload">上传图片</button>
	<image :src="src"></image>
  </view>
</template>
<script setup>
	import {ref, reactive, computed} from 'vue'
	const src = ref('https://via.placeholder.com/150x200')
	const upload = () => {
		uni.chooseImage({
			count: 6, // 默认9
			sourceType: ['album', 'camera'], // 从相册选择
			sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
			success: function (res) {
				src.value = res.tempFilePaths[0]
				console.log(res.tempFilePaths[0])
			}
		})
	}
</script>
<style scoped lang="scss">
</style>
