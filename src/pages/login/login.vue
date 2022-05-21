<template>
  <view class="page_wrapper">
    <view class="title">账号密码登录</view>
    <view class="login_form">
      <view class="form_item">
        <view class="input_wrapper">
          <uni-easyinput
            v-model="form.cell"
            :input-border="false"
            :placeholder-style="holder.cell.color"
            :placeholder="holder.cell.text"
            class="custom_easyinput"
            type="text"
          />
          <view v-if="holder.cell.empty" class="detail_toast">账号不存在</view>
        </view>
      </view>
      <view class="form_item">
        <view class="input_wrapper">
          <uni-easyinput
            v-model="form.pwd"
            :input-border="false"
            :placeholder-style="holder.pwd.color"
            :placeholder="holder.pwd.text"
            class="custom_easyinput"
            type="password"
          />
          <view v-if="holder.pwd.empty" class="detail_toast">密码错误</view>
        </view>
      </view>
      <view class="form_item">
        <view class="save_pwd">
          <checkbox-group @change="remenber">
            <checkbox value="cb" :checked="isRemenber" style="transform:scale(0.85)" />
            记住密码
          </checkbox-group>
        </view>
        <c-link></c-link>
      </view>
      <view
        class="submit_btn"
        :class="{'disable_btn': isDisabled, 'success_btn': !isDisabled}"
        @click="login"
      >
        登录
      </view>
      <view class="version">{{store.version}}</view>
    </view>
  </view>
</template>

<script setup>
  import { userStore } from '@/store/modules/user'
   import {
   	onBeforeMount,
   	onMounted,
   	nextTick,
   	ref,
    watch ,
   	reactive,
   	computed
   } from 'vue'
   import cjdUserService from '@/data/service/cjdUserService.js'
   // 记住密码
   const store = userStore()
   const isRemenber = ref(false)
   onMounted(() => {
   	uni.hideTabBar()
   	form.cell = store.userInfo ? store.userInfo.username : ''
    form.pwd = store.isRemenber ? store.userInfo.password : ''
       isRemenber.value = store.isRemenber ? store.isRemenber : 1
   })
   const holder = reactive({
   	cell: {
   		color: '',
   		text: '请输入您的账号',
   		isRequire: '请输入账号',
   		normal: '请输入您的账号',
  empty: false
   	},
   	pwd: {
   		color: '',
   		text: '请输入您的密码',
   		isRequire: '请输入密码',
   		normal: '请输入您的密码',
  empty: false
   	}
   })
   const form = reactive({
   	cell: '',
   	pwd: ''
   })
   const isDisabled = computed(() => {
   	let is = false
   	Object.keys(form).forEach(key => {
   		if (holder[key].color || !form[key]) {
   			is = true
   		}
   	})
   	return is
   })
   /* 监听校验 */
   watch (form, (newValue, oldValue) => {
     checkEmpty() && checkLogin()
   })
   const remenber = e => {
      console.log(e.detail.value.length)
      isRemenber.value = e.detail.value.length > 0
   }
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
   	if (!form.cell) {
   		return false
   	}
   	return true
   }


   // 跳转到ip设置界面
   const toipSetting = () => {
    uni.navigateTo({
    	url: '/pages/ipsetting/ipsetting'
    })
   }
   const login = () => {
   	if (checkEmpty() && checkLogin()) {
        store.setRemenber(isRemenber.value)
        uni.setStorageSync("isRemenber", isRemenber.value)
   		const param = {
   			username: form.cell,
   			password: form.pwd,
   		}
        cjdUserService.login(param, function(res) {
           if(res.code === 200) {
  	   if(res.data.length === 0) {
  		   // 账号不存在
  		   holder.cell.empty = true
  		   holder.pwd.empty = false
  	   } else {
  		   // 密码错误
  		  if(form.pwd !== res.data[0].password) {
  			holder.cell.empty = false
  			holder.pwd.empty = true
  		  } else {
  			// 密码正确
  			// 添加全局缓存, 并且加入到全局数据管理里面
  			  uni.setStorageSync('userInfo', JSON.stringify(res.data[0]))
  			  store.setUserInfo(res.data[0])
  			  uni.switchTab({
  			  	url: '/pages/tabber/tabberHome'
  			  })
  		  }
  	   }
     }
        })
      }
   }
</script>

<style lang="scss" scoped>
  .login_form {
     margin-top: 56.3rpx;
     .save_pwd {
     	font-size: 19.2rpx;
     }
  }
</style>
