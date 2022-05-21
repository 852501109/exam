<template>
  <view class="container">
	<uni-nav-bar leftWidth="220rpx" :fixed="fixed" :left-icon="leftIcon" rightWidth="90rpx" >
		<template #left>
			<view class="left" @tap="back">
				<view><uni-icons type="back" size="33"></uni-icons></view>
				<view >{{leftText}}</view>
			</view>
		</template>
	  <template #right>
	    <button v-if="rightType" type="primary" size="mini">{{right}}</button>
	  </template>
	</uni-nav-bar>
  </view>
</template>
<script setup>
	import {ref, reactive, computed} from 'vue'
	const props = defineProps({
	  leftText: {
	    type: String,
	    default: ''
	  },
	  leftIcon: {
		  type: String,
		  default: ''
	  },
	  right: {
	    type: String,
	    default: ''
	  },
	  rightType: {
	    type: String,
	    default: ''
	  },
	  fixed: {
	    type: Boolean,
	    default: true
	  },
	})
	const back = () => {
		uni.navigateBack()
	}
</script>
<style scoped lang="scss">
	.container {
		box-shadow: inset 0px -1px 0px #B9B9B9;
		background: #FFFFFF;
		.left {
			@include flex(row, flex-start, flex-start, wrap);
			margin-left: 6.4rpx;
			font-size: $normal-font;
		}
	}
	
</style>
