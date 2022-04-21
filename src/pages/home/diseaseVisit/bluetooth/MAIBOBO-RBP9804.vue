<template>
  <view>
    <view class="tips-container">
      <text class="tips">【脉搏波】先打开血压计电源，再点击按钮</text>
    </view>
    <view class="ble-content">
      <view class="buttons">
        <button
          v-if="showStartButton"
          class="main-button"
          :disabled="startButtonDisable"
          @tap="onClickStart"
        >
          开始测量血压
        </button>
        <button
          v-if="showStopButton"
          class="main-button"
          :disabled="stopButtonDisable"
          @tap="onClickStop"
        >
          中止测量血压
        </button>
      </view>
      <view class="info">
        <text class="text-info" :class="infoClass">{{infoText}}</text>
        <text v-if="showImmdiateResult" class="info-text">动态血压值：{{measureResult.PRS}}</text>
      </view>
      <view v-if="showFinalResult">
        <view class="">
          <text>用户编号: {{measureResult.USR}}</text>
        </view>
        <view class="">
          <text>测量时间: {{measureResult.TME}}</text>
        </view>
        <view class="">
          <text>收缩压值: {{measureResult.SYS}}</text>
        </view>
        <view class="">
          <text>舒张压值: {{measureResult.DIA}}</text>
        </view>
        <view class="">
          <text>脉搏值: {{measureResult.PUL}}</text>
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
  import { parseDate } from '../../../../common/tool.js'
  const DEVICE_TIMEOUT = 10 * 1000
  const BLE_ORDER = {
  	CONNECT_ORDER: 'cc80020301010001',
  	POWER_ORDER: 'cc80020304040001',
  	START_MEASURE: 'cc80020301020002',
  	STOP_ORDER: 'cc80020301030003',
  }
  const DEVICE_STATE = {
  	BLEOFF: 'BLEOFF',
  	SEARCHING: 'SEARCHING',
  	CONNECTED: 'CONNECTED',
  	STARTED: 'STARTED',
  	STOPPED: 'STOPPED',
  	RECEIVED: 'RECEIVED',
  	FINISHED: 'FINISHED',
  	ERROR: 'ERROR'
  }
  const INFO_TEXT = {
  	BLEOFF: {
  		text: '未连接血压计',
  		type: 'error'
  	},
  	SEARCHING: {
  		text: '正在搜索血压计',
  		type: 'normal'
  	},
  	CONNECTED: {
  		text: '已经连接血压计',
  		type: 'normal'
  	},
  	STARTED: {
  		text: '开始测量',
  		type: 'normal'
  	},
  	RECEIVED: {
  		text: '',
  		type: 'normal'
  	},
  	FINISHED: {
  		text: '完成测量',
  		type: 'normal'
  	},
  	STOPPED: {
  		text: '测量血压已中止',
  		type: 'error'
  	},
  	ERROR: {
  		text: '血压计测量出错',
  		type: 'error'
  	}
  }
  const INIT_DATA_RESULT = {
  	//动态压力值
  	PRS: '',
  	//收缩压
  	SYS: '',
  	//舒张压
  	DIA: '',
  	//脉搏
  	PUL: '',
  	//用户代号
  	USR: '',
  	//测量时间
  	TME: ''
  }
  import Bluetooth from './bluetooth'

  export default {
  	extends: Bluetooth,
  	props: ['disabled'],
  	data() {
  		return {
  			//是否已经打开蓝牙，默认为false，当蓝牙适配器初始化成功后为true
  			isBluetoothAdpatorOn: false,
  			//设备列表
  			deviceId: '',
  			//服务Id
  			serviceId: '',
  			//特征值ID
  			characteristicId: {
  				//支持写入操作的特征值
  				writeId: '',
  				//支持notify操作的特征值
  				notifyId: '',
  				notify: false,
  				indicate: false
  			},
  			//开始监听蓝牙返回数据
  			isBluetoothNotified: false,
  			//测量结果
  			measureResult: INIT_DATA_RESULT,
  			deviceState: DEVICE_STATE.BLEOFF,
  			stopButtonDisable: false,
  			deviceTimeout: null
  		}
  	},
  	computed: {
  		showStartButton() {
  			return ([DEVICE_STATE.BLEOFF, DEVICE_STATE.SEARCHING, DEVICE_STATE.CONNECTED, DEVICE_STATE.STOPPED,
  				DEVICE_STATE.ERROR,
  				DEVICE_STATE.FINISHED
  			].indexOf(
  				this.deviceState) > -1)
  		},

  		showStopButton() {
  			return ([DEVICE_STATE.STARTED, DEVICE_STATE.RECEIVED].indexOf(this.deviceState) > -1)
  		},
  		startButtonDisable() {
  			return this.disabled || this.isWorking
  		},
  		isWorking() {
  			return ([DEVICE_STATE.SEARCHING, DEVICE_STATE.CONNECTED, DEVICE_STATE.STARTED, DEVICE_STATE.RECEIVED]
  				.indexOf(this.deviceState) >
  				-1)
  		},
  		showImmdiateResult() {
  			return ([DEVICE_STATE.RECEIVED].indexOf(this.deviceState) > -1)
  		},
  		showFinalResult() {
  			return false
  		},
  		showConnectInfo() {
  			return false
  		},
  		infoText() {
  			return INFO_TEXT[this.deviceState].text
  		},
  		infoClass() {
  			return {
  				error: INFO_TEXT[this.deviceState].type === 'error',
  				normal: INFO_TEXT[this.deviceState].type === 'normal'
  			}
  		},
  		isConnected() {
  			return this.isBluetoothAdpatorOn && this.deviceId.length > 0 && this.serviceId.length > 0 && this
  				.characteristicId.writeId.length > 0 && this.characteristicId.notifyId > 0 && this.isBluetoothNotified
  		}
  	},
  watch: {
  	isWorking: function(res) {
  		this.$emit('deviceWorking', res)
  	}
  },
  created() {
  	this.DEVICE_STATE = DEVICE_STATE
  	this.deviceNameBegin = 'BP06D2'
  	this.primaryUUID = 'FFF0'
  	this.BLECharValue = {
  		write: 'FFF2',
  		notify: 'FFF1'
  	}
  },
  onShow() {

  },
  onHide() {

  },
  	methods: {
  		onClickStart() {
  			this.startProcess(() => {
  				this.deviceState = DEVICE_STATE.CONNECTED
  				return this.makeStartOrder().catch(error => {
  					console.log(JSON.stringify(error.err_obj))
  					this.$showToast(error.err_msg)
  				})
  			}, () => {
  				return this.makeStartOrder()
  			})
  		},
  		onClickStop() {
  			this.makeStopOrder()
  		},
  		//测量一次
  		makeStartOrder() {
  			return this.makeOrderToDevice(BLE_ORDER.START_MEASURE).then(() => {
  				this.deviceTimeout = setTimeout(() => {
  					this.deviceState = DEVICE_STATE.BLEOFF
  					this.resetAll()
  				}, DEVICE_TIMEOUT)
  			})
  		},
  		makeConnectOrder() {
  			console.log('connect')
  			return this.makeOrderToDevice(BLE_ORDER.CONNECT_ORDER)
  		},
  		makeStopOrder() {
  			this.stopButtonDisable = true
  			console.log('stop')
  			return this.makeOrderToDevice(BLE_ORDER.STOP_ORDER)
  		},
  		resetAll() {
  			this.resetResult()
  			this.resetConnection()
  			this.resetPageState()
  		},
  		resetConnection() {
  			this.isBluetoothAdpatorOn = false
  			this.deviceId = ''
  			this.serviceId = ''
  			this.characteristicId.writeId = ''
  			this.characteristicId.notifyId = ''
  			this.characteristicId.notify = false
  			this.characteristicId.indicate = false
  			this.isBluetoothNotified = false
  			this.deviceTimeout = null
  		},
  		resetResult() {
  			this.measureResult = INIT_DATA_RESULT
  		},
  		resetPageState() {
  			this.deviceState = DEVICE_STATE.BLEOFF
  			this.stopButtonDisable = false
  		},
  		handleLeavePage() {
  			if (this.isWorking) {
  				this.makeStopOrder().then(() => {
  					this.closeBLEConnection()
  				})
  				this.deviceState = DEVICE_STATE.STOPPED
  				this.resetConnection()
  			}
  		},
  		/**
  		 * 解析血压计返回的即时数值
  		 */
  		handleBLEConnectionClose(res) {
  			this.resetConnection()
  			this.$showToast('血压计已断开')
  			this.deviceState = DEVICE_STATE.BLEOFF
  		},
  		/**
  		 * 设置蓝牙返回值的监听和处理函数
  		 */
  		setBLEResponseParser() {
  			this.onBLECharacteristicValueChange(res => {
  			const parse_result = this.parseBLEResponse(res)
  			switch (parse_result.err_code) {
  				case '01_ok':
  					clearTimeout(this.deviceTimeout)
  					this.deviceState = DEVICE_STATE.CONNECTED
  					return this.makeStartOrder()
  				case '02_ok':
  					clearTimeout(this.deviceTimeout)
  					this.deviceState = DEVICE_STATE.STARTED
  					return
  				case '03_ok':
  					clearTimeout(this.deviceTimeout)
  					this.deviceState = DEVICE_STATE.STOPPED
  					return
  				case '05_ok':
  					clearTimeout(this.deviceTimeout)
  					this.deviceState = DEVICE_STATE.RECEIVED
  					return
  				case '06_ok':
  					clearTimeout(this.deviceTimeout)
  					this.deviceState = DEVICE_STATE.FINISHED
  					this.$emit('setPressure', parse_result.err_obj)
  					return
  				case '07_ok':
  					clearTimeout(this.deviceTimeout)
  					this.deviceState = DEVICE_STATE.ERROR

  			}
  		})
  		},
  		/**
  		 * 解析血压计返回的即时数值
  		 */
  		parseBLEResponse(res) {
  			// console.log("开始解析蓝牙返回数据:" + JSON.stringify(res));
  			const value = res.value
  			// console.log(`characteristic ${res.characteristicId} has changed, now is ${value}`)
  			const res_type = value.slice(10, 12)
  			if (res_type === '01') {
  				// console.log("血压计应答终端  连接指令")
  				return {
  					err_code: '01_ok',
  					err_msg: '血压计应答终端  连接指令',
  					err_obj: res
  				}
  			} else if (res_type === '02') {
  				// console.log("血压计应答终端  启动指令")
  				return {
  					err_code: '02_ok',
  					err_msg: '血压计应答终端  启动指令',
  					err_obj: res
  				}
  			} else if (res_type === '03') {
  				// console.log("血压计应答终端  停止测量指令")
  				setTimeout(() => {
  					this.stopButtonDisable = false
  				}, 100)
  				return {
  					err_code: '03_ok',
  					err_msg: '血压计应答终端  停止测量指令',
  					err_obj: res
  				}
  			} else if (res_type === '05') {
  				// console.log("血压计向终端发送  实时压力")
  				const result = parseInt(value.slice(14, 16) + value.slice(20, 22), 16)
  				// console.log("动态压力值：" + result);
  				this.measureResult.PRS = result
  				return {
  					err_code: '05_ok',
  					err_msg: '血压计向终端发送  实时压力',
  					err_obj: res
  				}
  			} else if (res_type === '06') {
  				// console.log("血压计发送 测量完成后结果")
  				const user_id = parseInt(value.slice(12, 14), 16)
  				const measure_date = parseDate(value.slice(14, 16), value.slice(16, 18), value.slice(18, 20), value
  					.slice(20, 22), value.slice(22, 24), value.slice(24, 26))
  				const sys_value = parseInt(value.slice(26, 28) + value.slice(28, 30), 16)
  				const dia_value = parseInt(value.slice(30, 32) + value.slice(32, 34), 16)
  				const pul_value = parseInt(value.slice(34, 36) + value.slice(36, 38), 16)
  				// console.log("高压值 SYS：" + sys_value);
  				// console.log("低压值 DIA：" + dia_value);
  				// console.log("脉搏值 PUL：" + pul_value);
  				// console.log("用户 ID：" + user_id);
  				// console.log("时间 PUL：" + measure_date);
  				this.measureResult.SYS = sys_value
  				this.measureResult.DIA = dia_value
  				this.measureResult.PUL = pul_value
  				this.measureResult.USR = user_id
  				this.measureResult.TME = measure_date
  				return {
  					err_code: '06_ok',
  					err_msg: '血压计发送 测量完成后结果',
  					err_obj: {
  						SYS: sys_value,
  						DIA: dia_value,
  						PUL: pul_value
  					}
  				}
  			} else if (res_type === '07') {
  				console.log('血压计发送  误代码指令')
  				return {
  					err_code: '07_ok',
  					err_msg: '血压计发送  误代码指令',
  					err_obj: res
  				}
  			}
  			console.log('----------------------------------------------')
  		}
  	}
  }
</script>

<style>
  @import './bluetooth.css';
</style>
s
