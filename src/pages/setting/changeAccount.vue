<template>
  <view class="form-wrapper">
    <uni-forms ref="form" :model-value="form" validate-trigger="bind">
      <uni-forms-item name="cell" label="手机号">
        <!-- uni-easyinput 的校验时机是数据发生变化， 即触发 input 时 -->
        <uni-easyinput
          v-model="form.cell"
          style="border: 0px;"
          type="text"
          placeholder="请输入手机号"
        />
      </uni-forms-item>
      <uni-forms-item name="yzm" label="验证码">
        <uni-easyinput v-model="form.vertifacode" type="text" placeholder="请输入验证码" />
        <c-timer-btn ref="timer" style="margin-top:10px;" @run="uptet"></c-timer-btn>
      </uni-forms-item>
      <button class="submit" @click="submit">下一步</button>
    </uni-forms>
  </view>
</template>

<script setup>
  import {ref, reactive} from 'vue'
  	const form = reactive({
  		cell: '',
  		vertifacode: ''
  	})
  	const uptet = () => {
  		console.log(1)
  	}
  	const toast = (text) => {
  		uni.showToast({
  			title: text,
  			icon: 'none',
  			duration: 2000
  		})
  	}

    		const checkRegister = () => {
    			// 手机号正则
    			const myreg = /^[0-9]{11}$/
    			// 手机号非空校验
    			if (form.cell === '') {
    				toast('手机号不能为空')
    				return false
    			}
    			// 手机号正则校验
    			if (!myreg.test(form.cell)) {
    				form.cell = ''
    				toast('请输入正确的手机号')
    			    return false
    			}
    			// 验证码校验
    			if (form.vertifacode === '') {
    				form.vertifacode = ''
    				toast('验证码不能为空')
    			}
    			return true
    		}
    		const submit = () => {
    			if (checkRegister()) {
    				toast('保存成功')
    			}
    		}
</script>

<style scoped lang="scss">
  .form-wrapper {
  	position: relative;
  	top: 10rpx;
  	width: 90%;
  	margin: 0 auto;
  }
  .submit {
   background: $uni-color-primary;
   color: #fff;
  }
</style>
