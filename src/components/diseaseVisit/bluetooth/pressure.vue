<template>
  <view>
    <radio-group v-if="false" class="top" @change="radioChange">
      <label v-for="item in devices" :key="item.code" class="radio">
        <radio :value="item.code" :checked="item.code === current" />
        <text>{{item.chinese}}</text>
      </label>
    </radio-group>
    <Omron-U32K
      v-if="current === 'omron'"
      @setPressure="setPressure"
      @deviceWorking="setDeviceWorking"
    ></Omron-U32K>
    <Maibobo-RBP9804
      v-if="current === 'maibobo'"
      @setPressure="setPressure"
      @deviceWorking="setDeviceWorking"
    ></Maibobo-RBP9804>
  </view>
</template>

<script>
  import OmronU32K from "./OMRON-U32K"
  import MaiboboRBP9804 from "./MAIBOBO-RBP9804"
  import {
  	pressureDevice
  } from '@/common/config.js'
  export default {
  components: {
  	OmronU32K,
  	MaiboboRBP9804
  },

  	data() {
  		return {
  			current: "maibobo"
  		}
  },
  created() {
  	this.devices = pressureDevice
  	const deviceConfig = uni.getStorageSync('device')
  	if (!deviceConfig) {
  		uni.showModal({
  			title: "错误",
  			content: "请在【我的-->智能设备】页面中配置设备型号",
  			showCancel: false
  		})
  	} else {
  		this.current = deviceConfig.pressure
  	}
  },
  	methods: {
  		radioChange(res) {
  			this.current = res.target.value
  		},
  		setPressure(res) {
  			this.$emit("setPressure", res)
  		},
  		setDeviceWorking(res) {
  			this.$emit("deviceWorking", res)
  		}
  	}
  }
</script>

<style lang="scss">
  .top {
  	margin-bottom: 20rpx;
  }

  .radio {
  	margin-right: 20rpx;
  }
</style>
