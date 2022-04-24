<template>
  <view>
    <!-- 	<uni-nav-bar title-color="#333" :back-text-style="{fontSize:'32rpx'}" back-text="修改密码" :is-back="true" :is-fixed="true" :border-bottom="false">
    	</uni-nav-bar> -->
    <view class="forms">
      <view class="items">
        <view class="items_left">
          <text>手机号</text>
        </view>
        <view class="items_content">
          <uni-easyinput
            v-model="form.cell"
            :input-border="false"
            :placeholder-style="holder.cell.color"
            :placeholder="holder.cell.text"
            type="text"
          />
        </view>
      </view>
      <view class="items">
        <view class="items_left">
          <text>验证码</text>
        </view>
        <view class="items_content">
          <uni-easyinput
            v-model="form.vertifacode"
            :input-border="false"
            :placeholder-style="holder.vertifacode.color"
            :placeholder="holder.vertifacode.text"
            type="text"
          />
        </view>
        <view class="items_right">
          <!-- <c-timer-btn style="top: -30rpx;" @run="uptet" ref="timer"></c-timer-btn> -->
        </view>
      </view>

      <view class="items">
        <view class="items_left">
          <text>密码</text>
        </view>
        <view class="items_content">
          <uni-easyinput
            v-model="form.pwd"
            :input-border="false"
            :placeholder-style="holder.pwd.color"
            :placeholder="holder.pwd.text"
            type="password"
          />
        </view>
      </view>

      <view class="items">
        <view class="items_left">
          <text>确认密码</text>
        </view>
        <view class="items_content">
          <uni-easyinput
            v-model="form.checkpwd"
            :input-border="false"
            :placeholder-style="holder.checkpwd.color"
            :placeholder="holder.checkpwd.text"
            type="password"
          />
        </view>
      </view>

      <view class="save_btn" @click="save">保存</view>
    </view>
  </view>
</template>

<script setup>
  import { GlobalStore } from '@/store/modules/global'
  import { onBeforeMount, onMounted, nextTick, ref, reactive } from 'vue'
  const holder = reactive({
    cell: {
  	color: '',
  	text: '请输入您的手机号',
  	isRequire: '手机号不能为空',
  	normal: '请输入您的手机号'
    },
    pwd: {
  	color: '',
  	text: '请输入密码（8-16位字母或数字)',
  	isRequire: '密码不能为空',
  	normal: '请输入密码（8-16位字母或数字)'
    },
    checkpwd: {
  	color: '',
  	text: '请输入确认密码',
  	isRequire: '确认密码不能为空',
  	normal: '请输入确认密码'
    },
    vertifacode: {
  	color: '',
  	text: '请输入您的验证码',
  	isRequire: '验证码不能为空',
  	normal: '请输入您的验证码'
    }
  })
  const gray = ref('#bbb')
  const form = reactive({
  	cell: '',
  	vertifacode: '',
  	pwd: '',
  	checkpwd: ''
  })
  const placeholderStyle = reactive({
  	cell: '',
  	vertifacode: '',
  	pwd: '',
  	checkpwd: ''
  })

     const checkEmpty = () => {
         let isEmpty = true
         Object.keys(form).forEach(key => {
           if (!form[key]) {
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
  	// 发送验证码
  	const uptet = () => {
  		// this.$refs['timer'].start()
  		const obj = {
  		mobile: this.form.cell,
  		event: 2
  	}
  	}

  		const toast = (text) => {
  			uni.showToast({
  				title: text,
  				icon: 'none',
  				duration: 2000
  			})
  		}
  		// 保存
  		const save = () => {
                 setTimeout(() => {
  			 uni.showToast({

  			 })
                   uni.navigateTo({
                     url: '/pages/login/login'
                   })
                 }, 1500)
  		}
  		// 注册校验  return Boolean
  		const checkRegister = () => {
  			// 手机号正则
  			const myreg = /^[0-9]{11}$/
  			// 手机号正则校验
  			if (!myreg.test(form.cell)) {
  				toast('请输入正确的手机号', 2000)
  				return false
  			}
  			// 密码校验
  			if (form.pwd.length < 8 || form.pwd.length > 10) {
  				toast('请输入8-10位长度的密码', 2000)
  				return false
  			}
  			// 两次密码是否一致校验
  			if (form.checkpwd !== form.pwd) {
  				toast('两次密码输入不一致', 2000)
  				return false
  			}
  			return true
  		}
</script>

<style lang="scss" scoped>
  page {
  	background-color: #FFF !important;
  }

  .status_bar {
  	height: var(--status-bar-height);
  	width: 100%;
  }

  .forms {
  	padding: 40rpx 32rpx 0 32rpx;

  	.items {
  		height: 128rpx;
  		border-bottom: 1rpx solid #e9e9e9;
  		display: flex;
  		align-items: center;
  		justify-content: space-between;
  		.items_left {
  			width: 180rpx;
  			font-size: 28rpx;
  			color: #333333;

  			image {
  				width: 100%;
  				height: 100%;
  			}
  		}

  		.items_content {
  			flex: 1;

  			input {

  				font-size: 24rpx;
  			}
  		}

  		.items_right {
  			position: relative;
  			display: flex;
  			justify-content: flex-end;
  			align-items: center;

  			image {
  				height: 48rpx;
  				width: 48rpx;
  			}

  			text {
  				padding: 10rpx 14rpx;
  				font-size: 20rpx;
  				border-radius: 4rpx;
  				border: 1rpx solid #333330;
  			}

  		}

  	}


  	.save_btn {
       width: 686rpx;
       margin: 0 auto;
  		margin-top: 122rpx;
  		height: 96rpx;
  		background: $uni-color-primary;
  		border-radius: 8rpx;
  		display: flex;
  		justify-content: center;
  		align-items: center;
  		color: #FFF;
  		font-size: 28rpx;
  	}

  }
</style>
