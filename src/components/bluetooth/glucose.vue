<template>
  <view>
    <radio-group v-if="false" class="top" @change="radioChange">
      <label v-for="item in devices" :key="item.code" class="radio">
        <radio :value="item.code" :checked="item.code === current" />
        <text>{{item.chinese}}</text>
      </label>
    </radio-group>
    <Sinocare-WL1
      v-if="current === 'sinocare'"
      :disabled="disabled"
      @setGlucose="setGlucose"
      @deviceWorking="setDeviceWorking"
    ></Sinocare-WL1>
    <Glucowell-VGM04
      v-if="current === 'glucowell'"
      :disabled="disabled"
      @setGlucose="setGlucose"
      @deviceWorking="setDeviceWorking"
    ></Glucowell-VGM04>
  </view>
</template>

<script>
  import SinocareWL1 from "./SINOCARE-WL1"
  import GlucowellVGM04 from "./GLUCOWELL-VGM04"
  import {
  	glucoseDevice
  } from "@/common/config.js"
  export default {
  components: {
  	SinocareWL1,
  	GlucowellVGM04
  },
  	props: {
  		disabled: {
  			type: Boolean,
  			default: false
  		}
  	},
  	data() {
  		return {
  			current: "sinocare"
  		}
  },
  created() {
  	this.devices = glucoseDevice
  	const deviceConfig = uni.getStorageSync('device')
  	if (!deviceConfig) {
  		uni.showModal({
  			title: "错误",
  			content: "请在【我的-->智能设备】页面中配置设备型号",
  			showCancel: false
  		})
  	} else {
  		this.current = deviceConfig.glucose
  	}
  },
  	methods: {
  		radioChange(res) {
  			this.current = res.target.value
  		},
  		setGlucose(res) {
  			this.$emit("setGlucose", res)
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
