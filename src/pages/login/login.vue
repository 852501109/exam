<template>
  <view class="page_wrapper">
    <view class="title">
      您好,
      <br />
      欢迎使用体检采集端
    </view>
    <view class="login_form">
      <view class="form_item">
        <text>手机号</text>
        <view class="input_wrapper">
          <input
            v-model="form.cell"
            :placeholderStyle="holder.cell.color"
            :placeholder="holder.cell.text"
            type="text"
          />
        </view>
      </view>
      <view class="form_item">
        <text>密码</text>
        <view class="input_wrapper">
          <input
            v-model="form.pwd"
            :placeholderStyle="holder.pwd.color"
            type="password"
            :placeholder="holder.pwd.text"
          />
        </view>
      </view>
      <view class="forget" @click="goForgetPassword">忘记密码?</view>
      <view class="login_btn operation_btn" @click="login">登录</view>
      <view class="register_btn operation_btn" @click="goRegister">注册</view>
    </view>
  </view>
</template>

<script setup>
  import { GlobalStore } from '@/store/modules/global'
  import { onBeforeMount, onMounted, nextTick, ref, reactive } from 'vue'
  const holder = reactive({
  	cell: {
  	  color: '',
  	  text:'请输入您的手机号',
  	  isRequire:'手机号不能为空',
  	  normal: '请输入您的手机号'
  	},
  	pwd: {
  	  color: '',
  	  text: '请输入您的密码',
  	  isRequire:'密码不能为空',
  	  normal: '请输入您的密码'
  	}
  })
  const form = reactive({
  	cell: '',
  	pwd: ''
  })
  const goForgetPassword = () => {
  	uni.navigateTo({
  		url: './forgetPassword'
  	})

  }
  const checkEmpty = () => {
          let isEmpty = true
          Object.keys(form).forEach(key => {
            if(!form[key]) {
              holder[key].text = holder[key].isRequire
              holder[key].color = 'color:#f00;'
              isEmpty = false
            } else {
              holder[key].text = holder[key].normal
              holder[key].color = ''
            }
          })
          return isEmpty
        }
  // 提示消息框
  const toast = (text) => {
    uni.showToast({
      title: text,
      icon: 'none',
      duration: 2000
    })
  }
  			// 登录校验  return Boolean
  			const checkLogin = () => {
  				// 手机号正则
  				const myreg = /^[0-9]{11}$/
  				// 手机号正则校验
  				if (!myreg.test(form.cell)) {
  					toast('手机号输入不正确')
  						return false
  					}
  				return true
  			}
  			const goRegister = () => {
  				uni.navigateTo({
  					url: './register'
  				})
  			}
  			// const isLogin = () => {
  			// 	const info = userInfo
  			// 	if (info && info.token) {
  			// 		if (info.auth) {
  			// 			uni.switchTab({
  			// 				url: '/pages/tabber/tabberHome'
  			// 			})
  			// 		} else {

  			// 			uni.navigateTo({
  			// 				url: '/pages/tabber/tabberHome'
  			// 			}, true)
  			// 		}
  			// 	}
  			// }
  			//
  			const login = () => {
  				if (checkEmpty() && checkLogin()) {
  					const param = {
  						mobile: form.cell,
  						password: form.pwd,
  					}
  					uni.switchTab({
  						url: '/pages/tabber/tabberHome'
  					})
  				}
  	}
</script>

<style lang="scss" scoped>
  .page_wrapper {
  	background: $uni-color-primary;
  	.title {
  		height: 498rpx;
  		padding: 0 94rpx;
  		box-sizing: border-box;
  		display: flex;
  		align-items: center;
  		font-size: 48rpx;
  		color: #FFF;
  	}
  	.login_form {
  		padding:92rpx 94rpx;
  		box-sizing: border-box;
  		background: #fff;
  		border-radius: 72rpx 72rpx 0rpx 0rpx;
  		.form_item {
  			display: flex;
  			flex-direction: column;
  			justify-content: space-between;
  			padding: 26rpx 0;
  			box-sizing: border-box;
  			height: 162rpx;
  			border-bottom: 1rpx solid #E9E9E9;
  			margin-bottom: 20rpx;

  			text {
  				font-size: 36rpx;
  				color: #333;
  				font-weight: bold;
  			}

  			.input_wrapper {
  				display: flex;
  				justify-content: space-between;
  				font-size: 28rpx;
  				color: #dadada;

  				image {
  					width: 48rpx;
  					height: 48rpx;
  				}

  			}

  		}

  		.forget {
  			font-size: 24rpx;
  			color: #adadad;
  			margin-bottom: 100rpx;
  		}

  		.operation_btn {
  			height: 116rpx;
  			display: flex;
  			justify-content: center;
  			align-items: center;
  			font-size: 32rpx;
  			margin-bottom: 40rpx;
  			border-radius: 50px;
  			font-weight: 550;
  		}

  		.login_btn {
  			background: $uni-color-primary;
  			color: #FFF;
  		}

  		.register_btn {
  			background: #F5F6FA;
  			color: #333;
  		}

  	}

  }
</style>
