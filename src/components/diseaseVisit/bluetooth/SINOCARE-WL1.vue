<template>
  <view>
    <view class="tips-container">
      <text class="tips">【三诺】先启动血糖仪，再点击按钮</text>
    </view>
    <view class="ble-content">
      <view class="buttons">
        <button class="main-button" :disabled="startButtonDisable" @tap="onClickStart">
          连接血糖仪
        </button>
      </view>
      <view class="info">
        <text class="text-info" :class="infoClass">{{infoText}}</text>
      </view>
      <view v-if="resultShow">
        <view class="">
          <text>血糖值: {{device_result.glucose_value}}</text>
        </view>
        <view class="">
          <text>温度值: {{device_result.temp_value}}</text>
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
   const {
   	parseDate,
   	ab2hex
   } = require('@/common/tool.js')

  import Bluetooth from "./bluetooth"
  const BLE_ORDER = {
   	TEST_ORDER: "534e0800040153494e4f46",
   	TEST_COMFRIRM: "534e080004014341524528",
   	FLASH_SIG: "534E06000403000512"
   }
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
   		text: "正在搜索血糖仪",
   		type: "normal"
   	},
   	"CONNECTED": {
   		text: "已经连接血糖仪",
   		type: "normal"
   	},
   	"WAITING": {
   		text: "等待滴入样本",
   		type: "normal"
   	},
   	"STARTED": {
   		text: "正在测量",
   		type: "normal"
   	},
   	"FINISHED": {
   		text: "完成测量",
   		type: "normal"
   	},
   	"ERROR": {
   		text: "血糖仪出错",
   		type: "error"
   	},
   	"OFF": {
   		text: "血糖仪已关机",
   		type: "error"
   	},
   	"BLEOFF": {
   		text: "未连接血糖仪",
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
  				glucose_value: null,
  				temp_value: null
  			}
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
  	this.deviceNameBegin = "Sinocare"
  	this.primaryUUID = "FFE0"
  	this.BLECharValue = {
  		write: "FFE2",
  		notify: "FFE1"
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
   		handleBLEConnectionClose() {

  		},
   		onClickStart() {
   			this.startProcess(() => {
   				this.deviceState = this.DEVICE_STATE.CONNECTED
   				return this.makeConnectOrder().catch((error) => {
   					console.log(JSON.stringify(error.err_obj))
   					this.$showToast(error.err_msg)
   				})
   			}, () => {
   				return this.makeConnectOrder()
   			})
   		},
   		//向血糖仪发送测试连接
   		makeConnectOrder() {
   			this.makeOrderToDevice(BLE_ORDER.TEST_ORDER)
   		},
   		getGlucose() {
   			this.makeOrderToDevice(BLE_ORDER.TEST_ORDER)
   		},
   		/**
   		 * 设置蓝牙返回值的监听和处理函数
   		 */
   		setBLEResponseParser() {
   			this.onBLECharacteristicValueChange((res) => {
   				const parse_result = this.parseBLEResponse(res)
   				switch (parse_result.err_code) {
   					case "01_ok":
   						this.deviceState = DEVICE_STATE.CONNECTED
   						break
   					case "02_ok":
   						this.deviceState = DEVICE_STATE.ERROR
   						this.resetAll()
   						break
   					case "03_ok":
   						this.deviceState = DEVICE_STATE.WAITING
   						break
   					case "04_ok":
   						this.deviceState = DEVICE_STATE.FINISHED
   						this.$emit("setGlucose", parse_result.err_obj)
   						break
   					case "0a_ok":
   						this.deviceState = DEVICE_STATE.STARTED
   						break
   					case "0b_ok":
   						this.closeBLEConnection()
   						this.deviceState = DEVICE_STATE.OFF
   						this.$showToast('血糖仪关机')
   						this.resetAll()
   						break
   					case "0c_ok":
   						this.deviceState = DEVICE_STATE.BLEOFF
   						this.resetAll()
   						break
   				}
   			})
   		},
   		parseBLEResponse(res) {
   			// console.log("开始解析蓝牙返回数据:" + JSON.stringify(res));
   			// const res_value = ab2hex(res.value);
   			const res_value = res.value
   			const res_type = res_value.slice(10, 12)
   			// console.log("返回命令码：" + res_type)
   			let result
   			switch (res_type.toUpperCase()) {
   				case BLE_SIG.DEVICE_TEST_RES:
   					console.log("收到连接测试确认")
   					result = {
   						err_code: "01_ok",
   						err_msg: "收到连接测试确认",
   						err_obj: res
   					}
   					break
   				case BLE_SIG.DEVICE_B_FLASH:
   					console.log("血糖仪等待样本")
   					result = {
   						err_code: "03_ok",
   						err_msg: "血糖仪等待样本",
   						err_obj: res
   					}
   					break
   				case BLE_SIG.DEVICE_ERROR:
   					console.log("血糖仪错误")
   					result = {
   						err_code: "02_ok",
   						err_msg: "血糖仪错误",
   						err_obj: res
   					}
   					break
   				case BLE_SIG.DEVICE_PWR_OFF:
   					console.log("血糖仪关机")
   					result = {
   						err_code: "0b_ok",
   						err_msg: "血糖仪关机",
   						err_obj: res
   					}
   					break
   				case BLE_SIG.DEVICE_BLE_OFF:
   					console.log("血糖仪蓝牙关闭")
   					result = {
   						err_code: "0c_ok",
   						err_msg: "血糖仪蓝牙关闭",
   						err_obj: res
   					}
   					break
   				case BLE_SIG.DEVICE_BGN_MEASURE:
   					console.log("血糖仪开始测量")
   					result = {
   						err_code: "0a_ok",
   						err_msg: "血糖仪开始测量",
   						err_obj: res
   					}
   					break
   				case BLE_SIG.DEVICE_READ_CURRENT:
   					console.log("血糖结果已出")
   					const glucose_value = parseInt(res_value.slice(22, 24) + res_value.slice(
   						24, 26), 16) / 10
   					console.log("血糖：" + glucose_value)
   					this.device_result.glucose_value = glucose_value
   					const temp_value = parseInt(res_value.slice(28, 30) + res_value.slice(30,
   						32), 16) / 10
   					console.log("温度：" + temp_value)
   					this.device_result.temp_value = temp_value
   					result = {
   						err_code: "04_ok",
   						err_msg: "血糖结果已出",
   						err_obj: {
   							glucose: glucose_value,
   							temperature: temp_value
   						}
   					}
   					break
   			}
   			return result
   		}
   	}
   }
</script>

<style>
  @import './bluetooth.css';
</style>
