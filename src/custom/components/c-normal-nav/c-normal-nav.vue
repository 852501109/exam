<template>
  <view class="container">
	<uni-nav-bar :fixed="true" color="#fff" :backgroundColor="backgroundColor" rightWidth="300rpx">
	  <view class="center">{{title}}</view>
	  <template #right>
		  <view class="right">
		  	<!-- <view>
				<uni-icons :color="rightIconColor" type="chat-filled" size="15"></uni-icons>
			</view>
		  	<view >{{rightText}}</view> -->
			<c-link-home></c-link-home>
		  </view>
	  </template>
	</uni-nav-bar>
  </view>
</template>
<script setup>
	import {ref, reactive, computed} from 'vue'
	const props = defineProps({
	  fixed: {
	    type: Boolean,
	    default: true
	  },
	  title: {
	    type: String,
	    default: ''
	  },
	  rightIcon: {
		type: String,
		default: ''
	  },
	  rightIconColor: {
		type: String,
		default: '#fff'
	  },
	  rightText: {
		type: String,
		default: ''
	  },
	  backgroundColor: {
	    type: String,
	    default: ''
	  },
	})
</script>
<style scoped lang="scss">
	.container {
		box-shadow: inset 0px -1px 0px #B9B9B9;
		background: #FFFFFF;
		.center {
			position: absolute;
			left:50%;
			transform:translateX(-50%);
			@include w-h(768, 40.6);
			line-height: 40.6rpx;
			text-align:center;
			font-size: $title-font;
			padding-top: 10rpx;
		}
		.right {
			position:absolute;
			right:45rpx;
			@include flex(row,space-between,center);
			font-size: $nav-right-font;
			view:nth-child(1) {
				margin-right: 6.86rpx
			}
			view:nth-child(2) {
				width: 63.73rpx;
			}
		}
	}
	
</style>
