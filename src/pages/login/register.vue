<template>
  <view class="">
    <view class="headline">
      您好,
      <br />
      欢迎使用体检采集端
    </view>
    <view class="forms">
      <view class="forms_items">
        <view class="items">
          <view class="items_left">
            <!--  <image :src="icons.PHONE" mode=""></image> -->
          </view>
          <view class="items_content">
            <input
              v-model="form.cell"
              :placeholderStyle="holder.cell.color"
              :placeholder="holder.cell.text"
              type="text"
            />
          </view>
        </view>
        <view class="items">
          <view class="items_left">
            <!-- <image :src="icons.VER_ICONS" mode=""></image> -->
          </view>
          <view class="items_content">
            <input
              v-model="form.vertifacode"
              :placeholderStyle="holder.vertifacode.color"
              :placeholder="holder.vertifacode.text"
              type="text"
            />
          </view>
          <view class="items_right">
            <c-timer-btn
              ref="timer"
              style="width: 150rpx;height: 50rpx;line-height: 50rpx;margin-top: -10rpx; font-size: 22rpx;"
              @run="uptet"
            ></c-timer-btn>
          </view>
        </view>
        <view class="items">
          <view class="items_left">
            <!-- <image :src="icons.PASSWORD" mode=""></image> -->
          </view>
          <view class="items_content">
            <input
              v-model="form.pwd"
              :placeholderStyle="holder.pwd.color"
              :placeholder="holder.pwd.text"
              :passwordIcon="false"
              type="password"
            />
          </view>
        </view>
        <view class="items">
          <view class="items_left">
            <!-- <image :src="icons.INVITER" mode=""></image> -->
          </view>
          <view class="items_content">
            <input
              v-model="form.invitationCell"
              :placeholderStyle="holder.invitationCell.color"
              :placeholder="holder.invitationCell.text"
              type="text"
            />
          </view>
        </view>
        <view class="deal">
          <view class="items_content">
            <view>
              <checkbox :checked="isChecked" @click="readMakeSure"></checkbox>
              我已阅读并同意
              <text @tap="toSee">《用户协议》</text>
            </view>
          </view>
        </view>
        <view class="register_btn" @click="register()">注册</view>
      </view>
      <view class="footer">
        已有账号?
        <text>
          <navigator url="./login">密码登录</navigator>
        </text>
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
  import { GlobalStore } from '@/store/modules/global'
  import { onBeforeMount, onMounted, nextTick, ref, reactive } from 'vue'
        const formcell = ref('')
        const isChecked = ref(false) // 协议阅读状态
        const icons = reactive({
          PASSWORD: '',
          PHONE: '',
          INVITER: '',
          VER_ICONS: ''
        })
        const form = reactive({
          cell: '',
          vertifacode: '',
          pwd: '',
          invitationCell: ''
        })
  const holder = reactive({
          cell: {
            color: '',
            text: '请输入您的手机号',
            isRequire: '手机号不能为空',
            normal: '请输入您的手机号'
          },
          pwd: {
            color: '',
            text: '请输入您的密码',
            isRequire: '密码不能为空',
            normal: '请输入您的密码'
          },
          vertifacode: {
            color: '',
            text: '请输入您的验证码',
            isRequire: '验证码不能为空',
            normal: '请输入您的验证码'
          },
          invitationCell: {
            color: '',
            text: '邀请人手机号',
            isRequire: '邀请人手机号不能为空',
            normal: '邀请人手机号'
          }
        })
        const background = reactive({
          background: '#F98038'
        })
  const color = reactive({
          color: "#FFF"
        })
  const timer = ref<InstanceType<typeof cTimerBtn>>()

  const uptet = () => {
  	timer.value.start()
  const obj = {
    mobile: form.cell,
    event: 1
  }
    }
      // 阅读协议勾选
      const readMakeSure = () => {
        isChecked.value = !isChecked.value
      }

      // 提示消息框
      const toast = (text) => {
        uni.showToast({
          title: text,
          icon: 'none',
          duration: 2000
        })
      }
      // 非空校验
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
      // 注册校验  return Boolean 返回最终是否通过校验 obj：placeholder样式
      const checkRegister = () => {
        // 手机号正则
        const myreg = /^[0-9]{11}$/
        // 手机号校验
        if (!myreg.test(form.cell)) {
          toast('请输入正确的手机号')
          return false
        }
        // 密码校验
        if (form.pwd.length < 8 || form.pwd.length > 10) {
          toast('请输入8-10位的密码')
          return false
        }
        // 邀请人手机号校验
        if (!myreg.test(form.invitationCell)) {
          toast('请输入正确的邀请人手机号')
          return false
        }
        // 协议校验
        if (!isChecked.value) {
          toast('请阅读并且勾选协议')
          return false
        }
        return true
      }
      // 注册
      const register = () => {
        if (checkEmpty() && checkRegister()) {
          const param = {
            mobile: form.cell,
            password: form.pwd,
            inviter_mobile: form.invitationCell,
            sms_code: form.vertifacode,
          }
          setTimeout(() => {
            uni.navigateTo({
              url: '/pages/login/login'
            })
          }, 1500)
        }
      }
      const toSee = () => {
        uni.navigateTo({
          url: '/pages/login/userAgreement'
        })
     }
</script>

<style lang="scss" scoped>
  .headline {
    height: 500rpx;
    background: $uni-color-primary;
    padding: 100rpx 40rpx 0 40rpx;
    font-size: 48rpx;
    font-weight: 600;
    color: #FFFFFF;
    box-sizing: border-box;
  }

  .forms {
    position: fixed;
    top: 440rpx;
    background-color: #FFF;
    bottom: 0;
    left: 0;
    right: 0;
    border-radius: 72rpx 72rpx 0rpx 0rpx;
    padding: 0 96rpx;
    display: flex;
    justify-content: center;
    align-items: center;

    .forms_items {
      width: 100%;

      .items {
  position:relative;
        width: 100%;
        height: 112rpx;
        border-bottom: 1rpx solid #e9e9e9;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 40rpx;

        .items_left {
          width: 48rpx;
          height: 48rpx;
          margin-right: 26rpx;

          image {
            width: 100%;
            height: 100%;
          }
        }

        .items_content {
          flex: 1;
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

      .deal {
        display: flex;
        align-items: center;
        font-size: 24rpx;
        .checkbox {
          width: 48rpx;
          height: 48rpx;
        }
        .items_left {
          width: 48rpx;
          height: 48rpx;
          margin-right: 26rpx;

          image {
            width: 100%;
            height: 100%;
          }
        }

        .items_content {
          flex: 1;
          font-size: 24rpx;
          color: #adadad;

          text {
            color: #007AFF !important;
          }
        }
      }

      .register_btn {
        margin-top: 60rpx;
        width: 560rpx;
        height: 116rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 32rpx;
        margin-bottom: 40rpx;
        border-radius: 50px;
        font-weight: 550;
  background:  $uni-color-primary;
  color: #fff;
      }

    }

    .footer {
      position: absolute;
      bottom: 35rpx;
      left: 0;
      right: 0;
      display: flex;
      justify-content: center;
      font-size: 28rpx;
      color: #ADADAD;

      text {
        color: #3685FF !important;
      }
    }

  }
</style>
