<template>
  <view class="page_wrapper">
    <view class="users">
      <view class="user_info">
        <image src="/static/defaultphoto.png"></image>
        <view class="name_phone">坤医生</view>
        <view class="name_dddress">李沧区九水东路卫生院</view>
      </view>
      <view class="logout" @tap="logout">退出登录</view>
    </view>
    <view class="forms">
      <view v-for="item in userOperation" :key="item.id" class="forms_item" @click="goRouter(item)">
        <view class="left">
          <view>
            <image :style="{width:  item.id === 0 ? '23rpx' : '10rpx'}" :src="item.src"></image>
          </view>
          {{ item.title }}
        </view>
        <view class="right">
          <view v-show="item.id == 0">身高体重，血压</view>
          <view v-show="item.id == 1" class="update" @click="update">
            <image src="/static/update.png"></image>
            <text class="success">立即升级</text>
          </view>
          <image class="right_row" src="/static/c5.png" mode=""></image>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
  import {
  	ref,
  	reactive
  } from 'vue'
  const shearPlateShow = ref(false)
  const callShow = ref(false)
  const userOperation = reactive([{
  		id: 0,
  		title: '系统配置',
  		isRightText: '',
  		path: '/pages/modesetting/modesetting',
  		isRouter: true,
  		src: '/static/xtpz.png'
  	},
  	{
  		id: 1,
  		title: '系统版本',
  		isRightText: '',
  		path: '',
  		isRouter: false,
  		src: '/static/xtbb.png'
  	}
  	// {
  	// 	id: 2,
  	// 	title: '设置',
  	// 	isRightText: '',
  	// 	path: '/pages/setting/mineSetting',
  	// 	isRouter: true,
  	// 	src: ''
  	// },
  ])
  const goRouter = (item) => {
  	if (item.isRouter) {
  		uni.navigateTo({
  			url: item.path
  		})
  	}
  }
  const logout = () => {
   uni.showModal({
   	title: '是否确认退出登录',
   	success: function (res) {
   		if (res.confirm) {
   			uni.navigateTo({
   				url: '/pages/login/login'
   			})
   		}
   	}
   })
  }
  const update = () => {
   uni.showModal({
   	title: '已检测到最新版本V2.0.1',
   	cancelText: '暂不更新',
   	confirmText: '立即更新',
   	success: function (res) {
   		if (res.confirm) {
   			console.log('用户点击立即更新')
   	} else if (res.cancel) {
   			console.log('用户点击暂不更新')
   	}
   	}
   })
  }
</script>

<style lang="scss" scoped>
  .users {

  	@include flex(row, center, center, wrap);
  	background-image: url('/static/mybg.png');
  	background-color: $kunyu-color-primary;

  	.logout {
  		position: absolute;
  		right: 40.5rpx;
  		top: 72.5rpx;
  		font-size: 19.2rpx;
  		color: #fff;
  	}

  	.user_info {
  		@include flex(column, center, center, wrap);
  		@include w-h(768, 371.2);
  		color: #FFFFFF;

  		image {
  			width: 76.8rpx;
  			height: 76.8rpx;
  			border-radius: 50%;
  		}

  		.name_phone {
  			margin-top: 20.5rpx;
  			font-size: 30.7rpx;
  		}

  		.name_dddress {
  			margin-top: 15.4rpx;
  			font-size: 23rpx;
  		}

  		text {
  			font-size: 24rpx;
  			color: #FFFFFF;
  		}
  	}
  }

  .forms {
  	margin-top: -25.6rpx;
  	.forms_item:first-child {
  		border-radius: 25.6rpx 25.6rpx 0px 0px;
        background: #fff;
  	}
  	.forms_item {
  		padding: 0 32rpx;
  		box-sizing: border-box;
  		height: 128rpx;
  		border-bottom: 1rpx solid #e9e9e9;
  		display: flex;
  		justify-content: space-between;
  		align-items: center;
  		font-size: $normal-mine-font;

  		.left {
  			view {
  				display: inline-block;
  				width: 53rpx;
  			}

  			image {
  				height: 23rpx;
  				margin-right: 48rpx;
  			}
  		}

  		.right {
  			display: flex;
  			align-items: center;
  			color: #adadad;

  			image {
  				height: 48rpx;
  				width: 48rpx;
  			}

  			image.right_row {
  				width: 12.8rpx;
  				height: 23rpx;
  			}

  			>view {
  				margin-right: 29.4rpx;
  			}

  			.update {

  				image {
  					height: 22.4rpx;
  					width: 22.4rpx;
  				}
  			}
  		}

  	}
  }
</style>
