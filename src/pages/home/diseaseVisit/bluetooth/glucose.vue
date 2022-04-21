<template>
	<view>
		<radio-group class="top" @change="radioChange" v-if="false">
			<label class="radio" v-for="item in devices" :key="item.code">
				<radio :value="item.code" :checked="item.code === current" />
				<text>{{item.chinese}}</text>
			</label>
		</radio-group>
		<Sinocare-WL1 v-if="current === 'sinocare'" :disabled="disabled" v-on:setGlucose="setGlucose"
			v-on:deviceWorking="setDeviceWorking">
		</Sinocare-WL1>
		<Glucowell-VGM04 v-if="current === 'glucowell'" :disabled="disabled" v-on:setGlucose="setGlucose"
			v-on:deviceWorking="setDeviceWorking">
		</Glucowell-VGM04>
	</view>
</template>

<script>
	import SinocareWL1 from "./SINOCARE-WL1"
	import GlucowellVGM04 from "./GLUCOWELL-VGM04"
	import {
		glucoseDevice
	} from "@/common/config.js"
	export default {
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
			};
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
