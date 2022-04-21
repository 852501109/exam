<template>
	<view>
		<view class="tips-container">
			<text class="tips">【好糖】先启动血糖仪，再点击按钮</text>
		</view>
		<view class="ble-content">
			<view class="buttons">
				<button class="main-button" @tap="onClickStart" :disabled="startButtonDisable">连接血糖仪</button>
			</view>
			<view class="info">
				<text class="text-info" :class="infoClass">{{infoText}}</text>
			</view>
			<view v-if="resultShow">
				<view class="">
					<text>血糖值: {{device_result.glucose_value}}</text>
				</view>
			</view>
			<view class="connect-info" v-if="showConnectInfo">
				<view v-if="deviceId.length > 0">
					<view>
						<text class="label" v-once>deviceID: </text>
						<text class="device-info">{{deviceId}}</text>
					</view>
					<view>
						<text class="label" v-once>serviceID: </text>
						<text class="device-info">{{serviceId}}</text>
					</view>
					<view>
						<text class="label" v-once>characteristic ID: </text>
						<text class="device-info">{{characteristicId.writeId}} | {{characteristicId.notifyId}}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	const {
		parseDate,

	} = require('../../../../common/tool.js');

	import Bluetooth from "./bluetooth";
	const BLE_ORDER = {
		GET_SN_ORDER: "7B0110012077550000010B0B047D",
		GET_UNIT_ORDER: "7B01100120AA55000002010D087D",
		GET_HISTORY_ORDER: "7B01100120DD550000030A060C7D",
		GET_TIME_ORDER: "7B011001204455000001040F007D",
		GET_SOFTWARE_VERSION_ORDER: "7B0110012066550000010E08087D",
		SET_TIME_ORDER: "7B011001204466000610070B0F322A070403087D"

	}
	const BLE_SIG = {
		DEVICE_GET_SN: "77AA",
		DEVICE_GET_UNIT: "AAAA",
		DEVICE_BLE_OFF: "D266",
		DEVICE_GET_HISTORY: "DDAA",
		DEVICE_GET_HISTORY_FINISH: "D166",
		DEVICE_GET_TIME: "44AA",
		DEVICE_GET_SOFTWARE_VERSION: "66AA",
		DEVICE_SET_TIME_FINISH: "4499",
		DEVICE_GET_REALTIME: "1266",
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
		created() {
			this.DEVICE_STATE = DEVICE_STATE
			this.deviceNameBegin = ["BLE-Glucowell", "BLE_GLUCOWELL"]
			this.primaryUUID = "CDD0"
			this.BLECharValue = {
				write: "CDD2",
				notify: "CDD1"
			}
		},
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
					glucose_unit: null,
					glucose_type: null
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
		onLoad() {},
		watch: {
			isWorking: function(res) {
				this.$emit("deviceWorking", res)
			}
		},
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
					glucose_unit: null,
					glucose_type: null
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
			getUnitOrder() {
				this.makeOrderToDevice(BLE_ORDER.GET_UNIT_ORDER)
			},
			setTimeOrder() {
				this.makeOrderToDevice(BLE_ORDER.SET_TIME_ORDER)
			},
			handleBLEConnectionClose() {
				this.resetConnection()
				this.$showToast('血糖仪已断开')
				this.deviceState = DEVICE_STATE.BLEOFF
			},
			onClickStart() {
				this.startProcess(() => {
					this.deviceState = this.DEVICE_STATE.CONNECTED
					return this.getUnitOrder()
				}, () => {
					this.deviceState = this.DEVICE_STATE.CONNECTED
					return this.getUnitOrder()
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
						case "unit_ok":
							this.deviceState = DEVICE_STATE.CONNECTED
							this.setTimeOrder()
							console.log(parse_result.err_obj)
							break
						case "rt_error":
							this.deviceState = DEVICE_STATE.ERROR
							this.$showToast(parse_result.err_obj.deviceError)
							this.resetAll()
							break
						case "rt_waiting_sample":
							this.deviceState = DEVICE_STATE.WAITING
							break
						case "rt_measure_ok":
							this.deviceState = DEVICE_STATE.FINISHED
							this.$emit("setGlucose", parse_result.err_obj)
							break
						case "rt_test_ok":
							this.deviceState = DEVICE_STATE.STARTED
							break
						case "ble_off":
							this.deviceState = DEVICE_STATE.BLEOFF
							this.$showToast('血糖仪关机')
							this.resetAll()
							break
					}
				})
			},
			parseBLEResponse(res) {
				console.log("开始解析蓝牙返回数据:" + JSON.stringify(res));
				const res_value = res.value
				const res_type = res_value.slice(10, 14)
				let result = {}
				switch (res_type.toUpperCase()) {
					case BLE_SIG.DEVICE_GET_SN:
						console.log("返回SN")
						result = {
							err_code: "sn_ok",
							err_msg: "返回SN",
							err_obj: res_value.slice(18, 30)
						}
						break
					case BLE_SIG.DEVICE_GET_UNIT:
						console.log("仪器测量单位读取")
						result = {
							err_code: "unit_ok",
							err_msg: "仪器测量单位读取",
							err_obj: res_value.slice(18, 20) === "22" ? "mmol/L" : "mg/dL"
						}
						break
					case BLE_SIG.DEVICE_BLE_OFF:
						console.log("关闭蓝牙")
						result = {
							err_code: "ble_off",
							err_msg: "关闭蓝牙",
							err_obj: res_value
						}
						break
					case BLE_SIG.DEVICE_GET_HISTORY:
						console.log("读取历史记录")
						result = {
							err_code: "history_ok",
							err_msg: "血糖仪关机",
							err_obj: res_value
						}
						break
					case BLE_SIG.DEVICE_GET_HISTORY_FINISH:
						console.log("读取历史记录完毕")
						result = {
							err_code: "history_all_ok",
							err_msg: "读取历史记录完毕",
							err_obj: res_value
						}
						break
					case BLE_SIG.DEVICE_GET_TIME:
						console.log("读取设备时间")
						result = {
							err_code: "time_ok",
							err_msg: "读取设备时间",
							err_obj: res_value.slice(18, 30)
						}
						break
					case BLE_SIG.DEVICE_GET_SOFTWARE_VERSION:
						console.log("读取设备软件版本")
						result = {
							err_code: "version_ok",
							err_msg: "读取设备软件版本",
							err_obj: res_value.slice(18, 50)
						}
						break
					case BLE_SIG.DEVICE_SET_TIME_FINISH:
						console.log("设置时间完成")
						result = {
							err_code: "set_time_ok",
							err_msg: "设置时间完成",
							err_obj: res_value
						}
						break
					case BLE_SIG.DEVICE_GET_REALTIME:
						console.log("解析事实数据")
						const status = res_value.slice(18, 20)
						let err_code = "",
							err_msg = "",
							err_obj = null
						if (status === "10") {
							console.log("血糖仪已插入试纸提示")
							err_code = "rt_test_ok"
							err_msg = "血糖仪已插入试纸"
							err_obj = this.parseGlucoseResult(res_value)
						} else if (status === "11") {
							console.log("血糖仪已插入试纸提示")
							err_code = "rt_test_ok"
							err_msg = "血糖仪已插入试纸"
						} else if (status === "22") {
							console.log("血糖等待加血提示")
							err_code = "rt_waiting_sample"
							err_msg = "血糖等待加血"
						} else if (status == "33") {
							console.log("血糖完成加血提示")
							err_code = "rt_sample_ok"
							err_msg = "血糖完成加血"
						} else if (status == "44") {
							console.log("测试完成并提供结果")
							err_code = "rt_measure_ok"
							err_msg = "测试完成并提供结果"
							err_obj = this.parseGlucoseResult(res_value)
							console.log(err_obj)
						} else if (status === "66") {
							console.log("血酮已插入试纸")
						} else if (status === "77") {
							console.log("血酮等待加血提示")
						} else if (status === "88") {
							console.log("血酮完成加血")
						} else if (status === "55") {
							console.log("测量异常报警提示")
							err_code = "rt_error"
							err_msg = "测试出错"
							err_obj = this.parseError(res_value)
						}
						return {
							err_code, err_msg, err_obj
						}
				}
				return result
			},
			parseGlucoseResult(res) {
				const lastResult = parseInt(res.slice(20, 24), 16) / 10
				const lastSample = res.slice(24, 26) === "11" ? "BLOOD" : "CTRL"
				const lastAlert = res.slice(26, 28)
				return {
					glucose: lastResult,
					sample: lastSample,
					alert: lastAlert
				}
			},
			parseError(res) {
				const errorCode = res.slice(26, 28)
				let deviceError
				if (errorCode == "01") { // 请在滴血符号出现后加样
					deviceError = "请在滴血符号出现后加样"
				} else if (errorCode == "02") { // 使用过或者被污染的血糖试纸
					deviceError = "使用过或者被污染的血糖试纸"
				} else if (errorCode == "03") { // 使用损坏或不匹配的血糖试纸
					deviceError = "使用损坏或不匹配的血糖试纸"
				} else if (errorCode == "04") { // 样本异常（只有人体血液和配套的质控液可用于测试）
					deviceError = "样本异常（只有人体血液和配套的质控液可用于测试）"
				} else if (errorCode == "05") { // 温度超出测试范围
					deviceError = "温度超出测试范围"
				} else if (errorCode == "06") { // 存在硬件或软件问题
					deviceError = "存在硬件或软件问题"
				} else if (errorCode == "07") { // 存在硬件或软件问题
					deviceError = "存在硬件或软件问题"
				} else if (errorCode == "08") { // 充电时插入试纸条
					deviceError = "充电时插入试纸条"
				} else if (errorCode == "10") { // 测试标本量不足
					deviceError = "测试标本量不足"
				} else {
					deviceError = "未知错误"
				}
				return {
					deviceError
				}
			},
		}
	}
</script>

<style>
	@import './bluetooth.css';
</style>
