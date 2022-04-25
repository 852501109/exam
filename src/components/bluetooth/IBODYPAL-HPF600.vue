<template>
  <view>
    <view class="tips-container">
      <text class="tips">【爱博派】先站在体重秤上，再点击按钮</text>
    </view>
    <view class="ble-content">
      <view class="buttons">
        <button class="main-button" :disabled="startButtonDisable" @tap="onClickStart">
          连接体重秤
        </button>
      </view>
      <view class="info">
        <text class="text-info" :class="infoClass">{{infoText}}</text>
      </view>
      <view v-if="resultShow">
        <view class="">
          <text>体重: {{weight}}</text>
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
     import Bluetooth from "./bluetooth"
    const BLE_ORDER = {
     	INFO_ORDER: "AA0E30010000000101003EB21A003D55",
     	RECEIVE_ORDER: "AA053002015155",
     	UNRECEIVE_ORDER: "AA053002005055"
     }
     const BLE_SIG = {
     	DEVICE_S11: "5303",
     	DEVICE_S12: "5301",
     	DEVICE_S2: "5302"
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
     		text: "正在搜索体脂秤",
     		type: "normal"
     	},
     	"CONNECTED": {
     		text: "已经连接体脂秤",
     		type: "normal"
     	},
     	"STARTED": {
     		text: "正在测量体重",
     		type: "normal"
     	},
     	"FINISHED": {
     		text: "完成体重测量",
     		type: "normal"
     	},
     	"ERROR": {
     		text: "体脂秤出错",
     		type: "error"
     	},
     	"BLEOFF": {
     		text: "未连接体脂秤",
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
    			weight: null
    		}
    	},
    	computed: {
    		startButtonDisable() {
    			return this.disabled || this.isWorking
    		},
    		isWorking() {
    			return !([DEVICE_STATE.FINISHED, DEVICE_STATE.ERROR, DEVICE_STATE.OFF, DEVICE_STATE.BLEOFF].indexOf(this
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
  	this.deviceNameBegin = "IBPF-"
  	this.primaryUUID = "FF12"
  	this.BLECharValue = {
  		write: "FF01",
  		notify: "FF02"
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
     				glucose_value: null,
     				temp_value: null
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
     		handleBLEConnectionClose(res) {
     			this.resetConnection()
     			this.$showToast('体脂秤已断开')
     			this.deviceState = DEVICE_STATE.BLEOFF
     		},
     		onClickStart() {
     			this.startProcess(() => {
     				this.deviceState = this.DEVICE_STATE.CONNECTED
     				return this.makeInfoOrder().catch((error) => {
     					console.log(JSON.stringify(error.err_obj))
     					this.$showToast(error.err_msg)
     				})
     			}, () => {
     				this.deviceState = this.DEVICE_STATE.CONNECTED
     				return this.makeInfoOrder()
     			})
     		},
     		makeInfoOrder() {
     			console.log("SEND INFO_ORDER")
     			this.makeOrderToDevice(BLE_ORDER.INFO_ORDER)
     		},
     		makeReceiveOrder() {
     			console.log("SEND RECEIVE_ORDER")
     			this.makeOrderToDevice(BLE_ORDER.RECEIVE_ORDER)
     		},
     		makeUnreveivedOrder() {
     			console.log("SEND UNRECEIVE_ORDER")
     			this.makeOrderToDevice(BLE_ORDER.UNRECEIVE_ORDER)
     		},
     		/**
     		 * 设置蓝牙返回值的监听和处理函数
     		 */
     		setBLEResponseParser() {
     			this.onBLECharacteristicValueChange((res) => {
     				const parse_result = this.parseImmediateResponse(res)
     				if (!parse_result) {
  return false
  }
     				switch (parse_result.err_code) {
     					case "s11_ok":
     						if (!this.weight) {
     							this.deviceState = DEVICE_STATE.STARTED
     							if (parse_result.err_obj.received) {
     								this.makeReceiveOrder()
     							} else {
     								this.makeUnreveivedOrder()
     							}
     						}
     						break
     					case "s12_ok":
     						if (!this.weight) {
     							this.deviceState = DEVICE_STATE.STARTED
     						}
     						break
     					case "s2_ok":
     						this.deviceState = DEVICE_STATE.FINISHED
     						this.weight = parse_result.err_obj.weight
     						this.$emit('setWeight', {
     							"weight": parse_result.err_obj.weight
     						})
     						break
     				}
     			})
     		},
     		parseImmediateResponse(res) {
     			console.log("开始解析蓝牙返回数据:" + JSON.stringify(res))
    			const value = res.value
    			let result
     			// console.log(`characteristic ${res.characteristicId} has changed, now is ${value}`)
     			const res_type = value.slice(4, 8)
     			console.log(res_type)
     			if (res_type === BLE_SIG.DEVICE_S11) {
     				console.log("S1-1")
     				res = this.parseS11Data(value.slice(8, 10))
     				result = {
     					err_code: "s11_ok",
     					err_msg: "收到S1-1消息",
     					err_obj: res
     				}
     			} else if (res_type === BLE_SIG.DEVICE_S12) {
     				console.log("S1-2")
     				const res = this.parseS12Data(value.slice(8, 24))
     				result = {
     					err_code: "s12_ok",
     					err_msg: "收到S1-2消息",
     					err_obj: res
     				}
     			} else if (res_type === BLE_SIG.DEVICE_S2) {
     				console.log("S2")
     				const res = this.parseS2Data(value.slice(8, 40))
     				result = {
     					err_code: "s2_ok",
     					err_msg: "收到S2消息",
     					err_obj: res
     				}
     			}
     			return result
     		},
     		parseS11Data(message) {
    			if (message === "01") {
    				return {
    					received: true
    				}
    			} else if (message === "00") {
    				return {
    					received: false
    				}
    			}
    				return {
    					received: false
    				}

    		},
     		parseS12Data(message) {
     			const softwareVersion = message[0, 4]
     			const hardwareVersion = message[4, 8]
     			const deviceVersion = message[8, 16]
     			return {
     				softwareVersion: softwareVersion,
     				hardwareVersion: hardwareVersion,
     				deviceVersion: deviceVersion
     			}
     		},
     		parseS2Data(message) {
     			const userId = message.slice(0, 8)
     			const userCode = message.slice(8, 10)
     			const unit = message.slice(10, 12)
     			const dataStatus = message.slice(10, 14)
     			const batteryStatus = message.slice(14, 16)
     			const weight = parseInt(message.slice(16, 20), 16) / 10
     			const impedance = message.slice(20, 24)
     			const BMI = message.slice(24, 28)
     			const bodyFatRate = message.slice(28, 32)
     			return {
     				weight: weight
     			}
     		},
     	}
     }
</script>

<style>
  @import './bluetooth.css';
</style>
