<template>
  <view>
    <view class="users">
      <view class="user_info">
        <image src="./test.png" mode=""></image>
        <view class="name_phone">
          <text class="name">陈医生</text>
          <!-- 					<view class="weight">普通用户</view> -->
        </view>
        <text>15210622405</text>
      </view>

      <view class="inform">
        <navigator url="/pages/message/message" hover-class="navigator-hover">
          <image src="../../../static/logo.png" mode=""></image>
        </navigator>
      </view>

      <view class="module">
        <view>
          <image src="./test.png" mode=""></image>
          <text>xxxx</text>
        </view>
        <view>
          <image src="./test.png" mode=""></image>
          <text>xxxx</text>
        </view>
      </view>
    </view>
    <view class="forms">
      <view v-for="item in userOperation" :key="item.id" class="forms_item" @click="goRouter(item)">
        <view class="left">
          <image src="./test.png" mode=""></image>
          <text>{{ item.title }}</text>
        </view>
        <view class="right">
          <text v-show="item.id == 0">未认证</text>
          <image src="../../static/c5.png" mode=""></image>
        </view>
      </view>
    </view>

    <!--  联系客服 -->
    <view v-show="shearPlateShow" class="service" @click.self="shearPlateShow = false">
      <view class="card">
        <image src="./test.png" mode=""></image>
        <view class="title">联系客服</view>
        <view class="content">
          联系客服请添加客服微信
          <br />
          <view>
            客服微信号: zero112
            <text @click="shearPlate">复制</text>
          </view>
        </view>
      </view>
    </view>

    <!--  推荐人 -->
    <view v-show="callShow" class="referrer">
      <view class="card">
        <view class="title">我的推荐人</view>
        <view class="content">
          <view class="wrapper">
            <view>
              <text class="label">推荐人</text>
              <text class="text">张三</text>
            </view>
            <view>
              <text class="label">联系方式</text>
              <text class="text">1334567890</text>
            </view>
          </view>
        </view>
        <view class="footer">
          <view style="border-right: 1rpx solid #e9e9e9;">关闭</view>
          <view style="font-weight: 550; color: #3685ff;">拨打电话</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
  import {ref, reactive} from 'vue'
  const shearPlateShow = ref(false)
  const callShow = ref(false)
  const userOperation = reactive([
  	{ id: 0, title: '实名认证', isRightText: '', path: '', isRouter: false, src: '/static/a1.png' },
  	{ id: 1, title: 'xxxx', isRightText: '', path: '', isRouter: false, src: '' },
  	{ id: 2, title: 'xxxx', isRightText: '', path: '', isRouter: false, src: '' },
  	{ id: 3, title: 'xxxx', isRightText: '', path: '', isRouter: false, src: '' },
  	{ id: 4, title: 'xxxx', isRightText: '', path: '', isRouter: false, src: '' },
  	{ id: 5, title: 'xxxx', isRightText: '', path: '', isRouter: false, src: '' },
  	{ id: 6, title: 'xxxx', isRightText: '', path: '', isRouter: false, src: '' },
  	{ id: 7, title: '设置', isRightText: '', path: '/pages/setting/setting', isRouter: true, src: '' },
  ])
  const goRouter = (item) => {
  	if(item.isRouter) {
  		uni.navigateTo({
  			url: item.path
  		})
  	}
  }
</script>

<style lang="scss" scoped>
  page {
  	background-color: #FFF !important;
  }

  .users {
  	height: 448rpx;
  	background: $uni-color-primary;
  	display: flex;
  	position: relative;
  	justify-content: center;
  	align-items: center;
  	padding: 40rpx 0 0 0;
  	margin-bottom: 180rpx;

  	.user_info {
  		display: flex;
  		flex-direction: column;
  		align-items: center;

  		image {
  			width: 112rpx;
  			height: 112rpx;
  			border-radius: 50%;
  			margin-bottom: 20rpx;
  		}

  		.name_phone {
  			display: flex;
  			align-items: center;
  			justify-content: center;
  			position: relative;
  			margin-bottom: 20rpx;

  			.name {
  				font-size: 40rpx;
  				color: #FFFFFF;
  			}


  			.weight {
  				position: absolute;
  				color: #F98038;
  				background-color: #FFF;
  				right: -130rpx;
  				font-size: 10rpx;
  				padding: 3rpx 6rpx;
  				border-radius: 10rpx;
  			}

  		}

  		text {
  			font-size: 24rpx;
  			color: #FFFFFF;
  		}

  	}

  	.inform {
  		position: absolute;
  		top: 70rpx;
  		right: 32rpx;

  		image {
  			width: 48rpx;
  			height: 48rpx;
  		}
  	}

  	.module {
  		position: absolute;
  		right: 32rpx;
  		left: 32rpx;
  		top: 400rpx;
  		height: 184rpx;
  		background: #FFFFFF;
  		box-shadow: 0px 12rpx 40rpx 0px rgba(220, 120, 59, 0.06);
  		border-radius: 16rpx;
  		display: flex;

  		view {
  			flex: 1;
  			height: 100%;
  			display: flex;
  			flex-direction: column;
  			justify-content: center;
  			align-items: center;

  			image {
  				width: 72rpx;
  				height: 72rpx;
  				margin-bottom: 10rpx;
  			}

  			text {
  				font-size: 28rpx;
  				color: #333330;
  			}


  		}

  	}


  }

  .forms {
  	.forms_item {
  		padding: 0 32rpx;
  		box-sizing: border-box;
  		height: 128rpx;
  		background-color: #FFF;
  		border-bottom: 1rpx solid #e9e9e9;

  		display: flex;
  		justify-content: space-between;
  		align-items: center;

  		.left {
  			display: flex;
  			align-items: center;

  			image {
  				height: 48rpx;
  				width: 48rpx;
  				margin-right: 48rpx;
  			}

  			text {
  				font-size: 28rpx;
  				color: #333;
  			}
  		}

  		.right {
  			display: flex;
  			align-items: center;
  			font-size: 28rpx;
  			color: #adadad;

  			image {
  				height: 48rpx;
  				width: 48rpx;
  			}
  		}

  	}
  }

  .service {
  	position: fixed;
  	top: 0;
  	right: 0;
  	left: 0;
  	bottom: 0;
  	background-color: rgba(0, 0, 0, 0.4);
  	display: flex;
  	justify-content: center;
  	align-items: center;

  	.card {
  		width: 590rpx;
  		height: 292rpx;
  		background-color: #FFF;
  		border-radius: 20rpx;
  		position: relative;
  		padding: 32rpx;
  		box-sizing: border-box;

  		>image {
  			position: absolute;
  			left: 32rpx;
  			top: 32rpx;
  			width: 48rpx;
  			height: 48rpx;
  		}

  		.title {
  			margin-top: 30rpx;
  			display: flex;
  			justify-content: center;
  			font-size: 32rpx;
  			font-weight: 600;
  			color: rgba(0, 0, 0, 0.87);
  			margin-bottom: 32rpx;
  		}

  		.content {
  			font-size: 28rpx;
  			display: flex;
  			justify-content: center;
  			flex-direction: column;
  			align-items: center;
  			font-weight: 400;
  			color: rgba(0, 0, 0, 0.54);

  			view {
  				text {
  					margin-left: 10rpx;
  					color: #3685FF;
  				}
  			}

  		}
  	}

  }

  .referrer {
  	position: fixed;
  	top: 0;
  	right: 0;
  	left: 0;
  	bottom: 0;
  	background-color: rgba(0, 0, 0, 0.4);
  	display: flex;
  	justify-content: center;
  	align-items: center;

  	.card {
  		width: 590rpx;
  		height: 412rpx;
  		background-color: #FFF;
  		border-radius: 20rpx;
  		box-sizing: border-box;
  		display: flex;
  		flex-direction: column;
  		justify-content: space-between;

  		.title {
  			margin-top: 30rpx;
  			display: flex;
  			justify-content: center;
  			font-size: 32rpx;
  			font-weight: 600;
  			color: rgba(0, 0, 0, 0.87);
  		}

  		.content {
  			display: flex;
  			flex: 1;
  			flex-direction: column;
  			justify-content: center;
  			align-items: center;

  			.wrapper {
  				view {
  					display: flex;
  					font-size: 28rpx;
  					color: #000;

  					.label {
  						width: 120rpx;
  						margin-right: 30rpx;
  					}

  					.text {
  						flex: 1;
  					}
  				}
  			}

  		}

  		.footer {
  			height: 96rpx;
  			border-top: 1rpx solid #e9e9e9;
  			display: flex;

  			view {
  				flex: 1;
  				display: flex;
  				justify-content: center;
  				align-items: center;
  				font-size: 32rpx;
  				font-weight: 400;
  				color: #333330;
  			}
  		}
  	}
  }
</style>
