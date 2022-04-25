<template>
  <view>
    <view class="tips-container">
      <text class="tips">【红檬】先点击按钮，再站在体重秤上</text>
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
     	START_ORDER: "F50400000000000000000000000000",
     	UNIT_ORDER: "F50200000000000000000000000000",
     	USER_ORDER: "F5010114B400B30000000000000000C45D"
     }
     const BLE_SIG = {
     	DEVICE_RESULT: "F503",
     	DEVICE_UNIT: "F582",
     	DEVICE_USER: "F581"
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
    			return !([DEVICE_STATE.ERROR, DEVICE_STATE.OFF, DEVICE_STATE.BLEOFF].includes(this.deviceState))
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
  	this.deviceNameBegin = "HM-C2-S"
  	this.primaryUUID = "0783B03E"
  	this.BLECharValue = {
  		write: "5CBA",
  		notify: "5CB8"
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
     				this.deviceState = DEVICE_STATE.CONNECTED
     				return this.makeUserOrder().then(this.makeUnitOrder).then(this.makeStartOrder)
     			}, () => {
     				this.deviceState = DEVICE_STATE.CONNECTED
     				return this.makeUserOrder().then(this.makeUnitOrder).then(this.makeStartOrder)
     			})
     		},
     		makeStartOrder() {
     			console.log("SEND START_ORDER")
     			return this.makeOrderToDevice(BLE_ORDER.START_ORDER)
     		},
     		makeUnitOrder() {
     			console.log("SEND UNIT_ORDER")
     			return this.makeOrderToDevice(BLE_ORDER.UNIT_ORDER)
     		},
     		makeUserOrder() {
     			console.log("SEND USER_ORDER")
     			return this.makeOrderToDevice(BLE_ORDER.USER_ORDER)
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
     					case "get_unit":
     						if (!this.weight) {
     							this.deviceState = DEVICE_STATE.STARTED
     						}
     						break
     					case "get_user":
     						if (!this.weight) {
     							this.deviceState = DEVICE_STATE.STARTED
     						}
     						break
     					case "get_result":
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
     			const res_type = value.slice(0, 4)
     			if (res_type === BLE_SIG.DEVICE_RESULT) {
     				console.log("get result")
     				res = parseInt(value.slice(4, 8), 16) / 100
     				result = {
     					err_code: "get_result",
     					err_msg: "收到测量结果",
     					err_obj: {
     						weight: res
     					}
     				}
     			} else if (res_type === BLE_SIG.DEVICE_UNIT) {
     				console.log("get unit")
     				result = {
     					err_code: "get_unit",
     					err_msg: "收到单位确认",
     					err_obj: null
     				}
     			} else if (res_type === BLE_SIG.DEVICE_USER) {
     				console.log("get user")
     				result = {
     					err_code: "get_user",
     					err_msg: "收到用户确认",
     					err_obj: null
     				}
     			}
     			return result
     		}
     	}
     }
</script>

<style>
  @import './bluetooth.css';
</style>
