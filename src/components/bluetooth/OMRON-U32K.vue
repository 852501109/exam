<template>
  <view>
    <view class="tips-container">
      <text class="tips">【欧姆龙】完成血压测量后，点击按钮</text>
    </view>
    <view class="ble-content">
      <view class="buttons">
        <button class="main-button" :disabled="startButtonDisable" @tap="onClickStart">
          连接血压计
        </button>
      </view>
      <view class="info">
        <text class="text-info" :class="infoClass">{{infoText}}</text>
      </view>
      <view v-if="resultShow">
        <view class="">
          <text>收缩压: {{device_result.sys_value}}</text>
        </view>
        <view class="">
          <text>舒张压: {{device_result.dia_value}}</text>
        </view>
        <view class="">
          <text>脉搏: {{device_result.pul_value}}</text>
        </view>
      </view>
      <view v-if="showConnectInfo" class="connect-info">
        <view v-if="deviceId.length > 0">
          <view>
            <text v-once class="label">deviceID:</text>
            <text class="device-info">{{deviceId}}</text>
          </view>
          <view>
            <text v-once class="label">serviceID:</text>
            <text class="device-info">{{serviceId}}</text>
          </view>
          <view>
            <text v-once class="label">characteristic ID:</text>
            <text class="device-info">
              {{characteristicId.writeId}} | {{characteristicId.notifyId}}
            </text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  import {
  	parseDate,
  } from '@/common/tool.js'
  import Bluetooth from "./bluetooth"
  const BLE_SIG = {
  	DEVICE_BLE_OFF: "0C",
  	DEVICE_PWR_OFF: "0B",
  	DEVICE_BGN_MEASURE: "0A",
  	DEVICE_READ_HISTORY: "05",
  	DEVICE_READ_CURRENT: "04",
  	DEVICE_B_FLASH: "03",
  	DEVICE_ERROR: "02",
  	DEVICE_TEST_RES: "01"
  }
  const DEVICE_STATE = {
  	SEARCHING: "SEARCHING",
  	CONNECTED: "CONNECTED",
  	WAITING: "WAITING",
  	STARTED: "STARTED",
  	FINISHED: "FINISHED",
  	ERROR: "ERROR",
  	OFF: "OFF",
  	BLEOFF: "BLEOFF"
  }
  const INFO_TEXT = {
  	"SEARCHING": {
  		text: "正在搜索血压计",
  		type: "normal"
  	},
  	"CONNECTED": {
  		text: "已经连接血压计",
  		type: "normal"
  	},
  	"FINISHED": {
  		text: "完成读取血压值",
  		type: "normal"
  	},
  	"ERROR": {
  		text: "血压计出错",
  		type: "error"
  	},
  	"BLEOFF": {
  		text: "未连接血压计",
  		type: "error"
  	}
  }

  export default {
  	extends: Bluetooth,
  	props: ["disabled"],
  data() {
  	return {
  		deviceState: DEVICE_STATE.BLEOFF,
  		//是否已经打开蓝牙，默认为false，当蓝牙适配器初始化成功后为true
  		isBluetoothAdpatorOn: false,
  		//设备列表
  		deviceId: "",
  		//服务Id
  		serviceId: "",
  		//特征值ID
  		characteristicId: {
  			//支持写入操作的特征值
  			writeId: "",
  			//支持notify操作的特征值
  			notifyId: "",
  			notify: false,
  			indicate: false
  		},
  		//开始监听蓝牙返回数据
  		isBluetoothNotified: false,
  		device_result: {
  			sys_value: null,
  			dia_value: null,
  			pul_value: null
  		}
  	}
  },
  	computed: {
  		startButtonDisable() {
  			return this.disabled || this.isWorking
  		},
  		isWorking() {
  			return !([DEVICE_STATE.ERROR, DEVICE_STATE.OFF, DEVICE_STATE.BLEOFF].indexOf(this
  				.deviceState) > -1)
  		},
  		resultShow() {
  			return false
  		},
  		infoText() {
  			return INFO_TEXT[this.deviceState].text
  		},
  		infoClass() {
  			return {
  				error: INFO_TEXT[this.deviceState].type === "error",
  				normal: INFO_TEXT[this.deviceState].type === "normal"
  			}
  		},
  		showConnectInfo() {
  			return false
  		}
  	},
  	watch: {
  		isWorking: function(res) {
  			this.$emit("deviceWorking", res)
  		}
  	},
  created() {
  	this.DEVICE_STATE = DEVICE_STATE
  	this.deviceNameBegin = "BLEsmart"
  	this.primaryUUID = "1810"
  	this.BLECharValue = {
  		write: "2A49",
  		notify: "2A35"
  	}
  },
  	onLoad() {},
  	methods: {
  		resetAll() {
  			this.resetResult()
  			this.resetConnection()
  			this.resetPageState()
  		},
  		resetConnection() {
  			this.isBluetoothAdpatorOn = false
  			this.deviceId = ""
  			this.serviceId = ""
  			this.characteristicId.writeId = ""
  			this.characteristicId.notifyId = ""
  			this.characteristicId.notify = false
  			this.characteristicId.indicate = false
  			this.isBluetoothNotified = false
  		},
  		resetResult() {
  			this.device_result = {
  				sys_value: null,
  				dia_value: null,
  				pul_value: null
  			}
  		},
  		resetPageState() {
  			this.deviceState = DEVICE_STATE.BLEOFF
  		},
  		handleLeavePage() {
  			if (this.isWorking) {
  				this.closeBLEConnection()
  				this.deviceState = DEVICE_STATE.STOPPED
  				this.resetConnection()
  			}
  		},
  		handleBLEConnectionClose() {
  			this.resetConnection()
  			this.$showToast('血压计已断开')
  			this.deviceState = DEVICE_STATE.BLEOFF
  		},
  		onClickStart() {
  			this.startProcess(() => {
  				this.deviceState = this.DEVICE_STATE.CONNECTED
  			}, () => {
  				this.deviceState = this.DEVICE_STATE.CONNECTED
  			})
  		},
  		/**
  		 * 设置蓝牙返回值的监听和处理函数
  		 */
  		setBLEResponseParser() {
  			this.onBLECharacteristicValueChange((res) => {
  				const parse_result = this.parseBLEResponse(res)
  				if (parse_result && parse_result.sys_value && parse_result.dia_value && parse_result
  					.pul_value) {
  					this.deviceState = DEVICE_STATE.FINISHED
  					this.$emit("setPressure", {
  						SYS: parse_result.sys_value,
  						DIA: parse_result.dia_value,
  						PUL: parse_result.pul_value
  					})
  				}
  			})
  		},
  		parseBLEResponse(res) {
  			console.log("开始解析蓝牙返回数据:" + JSON.stringify(res))
  		const value = res.value
  		const sys_value = parseInt(value.slice(2, 4), 16)
  			const dia_value = parseInt(value.slice(6, 8), 16)
  			const mean_value = parseInt(value.slice(10, 12), 16)
  			const pul_value = parseInt(value.slice(28, 30), 16)
  			const measure_date = parseDate(value.slice(16, 18), value.slice(18, 20), value.slice(20, 22), value
  				.slice(22, 24), value.slice(24, 26), value.slice(26, 28))
  			return {
  				sys_value: sys_value,
  				dia_value: dia_value,
  				pul_value: pul_value
  			}
  		}
  	}
  }
</script>

<style>
  @import './bluetooth.css';
</style>
