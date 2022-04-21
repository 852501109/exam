<template>
	<view>
		<IbodyPal-HPF600 v-if="current === 'ibodypal'" :disabled="disabled" v-on:setWeight="setWeight"
			v-on:deviceWorking="setDeviceWorking">
		</IbodyPal-HPF600>
		<Ihomon-C2 v-if="current === 'ihomon'" :disabled="disabled" v-on:setWeight="setWeight"
			v-on:deviceWorking="setDeviceWorking">
		</Ihomon-C2>
	</view>
</template>

<script>
	import IbodyPalHPF600 from "./IBODYPAL-HPF600"
	import IhomonC2 from "./IHOMON-C2"
	import {
		scaleDevice
	} from '@/common/config.js'
	export default {
		created() {
			this.devices = scaleDevice
			const deviceConfig = uni.getStorageSync('device')
			if (!deviceConfig) {
				uni.showModal({
					title: "错误",
					content: "请在【我的-->智能设备】页面中配置设备型号",
					showCancel: false
				})
			} else {
				this.current = deviceConfig.scale
			}
		},
		components: {
			IbodyPalHPF600,
			IhomonC2
		},
		props: {
			disabled: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				current: "ibodypal"
			};
		},
		methods: {
			setWeight(res) {
				this.$emit("setWeight", res)
			},
			setDeviceWorking(res) {
				this.$emit("deviceWorking", res)
			}
		}
	}
</script>

<style lang="scss">

</style>
