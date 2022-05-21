import {ref, reactive, computed} from 'vue'
import { parseDate } from '@/common/tool.js'
export default function () {
	const KY_UNI = uni.requireNativePlugin('KunYuBluetooth')
	const deviceId = ref('')
	const serviceId = ref('')
	const protocol = ref('')
	const deviceNameBegin = ref('BP06D2')
	const showFinalResult = ref(false)
	const primaryUUID = ref('FFF0')
	const isBluetoothNotified = ref(false)
	const stopButtonDisable = ref(true)
	const startButtonDisable = ref(false)
	const BLE_ORDER = reactive({
		CONNECT_ORDER: 'cc80020301010001',
		POWER_ORDER: 'cc80020304040001',
		START_MEASURE: 'cc80020301020002',
		STOP_ORDER: 'cc80020301030003',
	})
	const BLECharValue = reactive({
  		write: 'FFF2',
  		notify: 'FFF1'
  	})
	const INFO_TEXT = reactive({
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
			text: '测量中',
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
	})
	const status = reactive({
	  10000: '未初始化蓝牙适配器',
	  10001: '未检测到蓝牙，请打开蓝牙重试！',
	  10002: '没有找到指定设备',
	  10003: '连接失败',
	  10004: '没有找到指定服务',
	  10005: '没有找到指定特征值',
	  10006: '当前连接已断开',
	  10007: '当前特征值不支持此操作',
	  10008: '其余所有系统上报的异常',
	  10009: 'Android 系统特有，系统版本低于 4.3 不支持 BLE',
	  10010: '已连接',
	  10011: '配对设备需要配对码',
	  10012: '连接超时',
	  10013: '连接 deviceId 为空或者是格式不正确',
	})
	const characteristicId = reactive({
		//支持写入操作的特征值
		writeId: '',
		//支持notify操作的特征值
		notifyId: '',
		notify: false,
		indicate: false
	})
	const measureResult = reactive({
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
	})
	const infoText = computed(() => {
		return INFO_TEXT[deviceState.value].text
	}) 
	const DEVICE_STATE = reactive({
		BLEOFF: 'BLEOFF',
		SEARCHING: 'SEARCHING',
		CONNECTED: 'CONNECTED',
		STARTED: 'STARTED',
		STOPPED: 'STOPPED',
		RECEIVED: 'RECEIVED',
		FINISHED: 'FINISHED',
		ERROR: 'ERROR'
	})
	const resetPageState = () => {
		deviceState.value = DEVICE_STATE.BLEOFF
	}
	const deviceState = ref(DEVICE_STATE.BLEOFF)
	/* 测一次 */
	const onece = async () => {
		resetPageState()
		// 开启连接监听
		openConectWatch()
		//初始化蓝牙
		await init()
		//开启蓝牙搜索
		await startBTSearch()
		// 开启搜索监听及查找对一个设备
		await initSearchWatch()
		// 连接已经搜索到的脉搏波设备
		await conectBT()
		// 生成设备服务值
		await getServiceVal()
		// 生成设备特征值
		await getCharacter()
		// 生成写入命令
		await writeOrder(BLE_ORDER.START_MEASURE)
		stopButtonDisable.value = false
	}
	const onClickStop = () => {
		writeData(BLE_ORDER.STOP_ORDER)
		startButtonDisable.value = false
		stopButtonDisable.value = true
		resetAll()
	}
	/* 重置所有值 */
	const resetAll = async () => {
		stopBTSearch()
		closeBT()
		resetConnection()
	}
	const resetConnection = () => {
		deviceId.value = ''
		serviceId.value = ''
		characteristicId.writeId = ''
		characteristicId.notifyId = ''
		characteristicId.notify = false
		characteristicId.indicate = false
		isBluetoothNotified.value = false
	}
	const resetResult = () => {
		measureResult.PRS = ''
		measureResult.SYS = ''
		measureResult.DIA = ''
		measureResult.PUL = ''
		measureResult.USR = ''
		measureResult.TME = ''
	}
	// const resetPageState = () => {
	// 	stopButtonDisable.value = false
	// }
	/* 初始化蓝牙 */ 
	const init = () => {
		return new Promise((resolve, reject) => {
			KY_UNI.openBluetoothAdapter( (res) => {
				resolve(res)
				console.log(`成功:${res.code}--${res.message}`)
			},
			(res) => {
				reject(res)
				uni.showToast({
					title: '请打开蓝牙设备，并且重新操作',
					icon: 'error'
				})
			})
		})
	}
	/**
	 * 监听低功耗蓝牙连接状态的改变事件。包括开发者主动连接或断开连接，设备丢失，连接异常断开等等
	 */
	const openConectWatch = () => {
		KY_UNI.onBLEConnectionStateChange(
		   (res) => {
			   console.log(`连接状态---:${res.connected}--${res.deviceId}`)
		   }
		)
	}
	/* 启动蓝牙搜索*/
	const startBTSearch = () => {
		return new Promise((resolve, reject) => {
			KY_UNI.startBluetoothDevicesDiscovery(
				{
					services:[],
					allowDuplicatesKey:false,
					interval:"0"
				},
				(res) => {
					resolve(res)
					console.log(`----准备监听----`)
					setTimeout(() => {
						reject(res)
						// uni.showToast({
						// 	title: status[res.code],
						// 	icon: 'error'
						// })
					}, 3000)
				},
				(res) => {
					reject(res)
					uni.showToast({
						title: status[res.code],
						icon: 'error'
					})
				}
			)
		})
	}
	/* 停止蓝牙搜索*/
	const stopBTSearch = () => {
		return new Promise((resolve, reject) => {
			KY_UNI.closeBluetoothAdapter(
				{
					services:[],
					allowDuplicatesKey:false,
					interval:"0"
				},
				(res) => {
					resolve(res)
					console.log(`关闭成功:${res.code}--${res.message}`)
				},
				(res) => {
					reject(res)
					console.log(status[res.code])
				}
			)
		})
	}
	/* 开启搜索监听 */
	const initSearchWatch = () => {
		return new Promise((resolve, reject) => {
			const serviceTimeOut = setTimeout(() => {
				reject('超时')
				uni.showToast({
					title: '搜索设备超时',
					icon: 'error'
				})
			}, 5000)
			KY_UNI.onBluetoothDeviceFound(
			   (res) => {
				   const a = res
				   const tempResult = res.devices
				   if(tempResult.length > 0){
					let find = false
					let deviceArr = []
					const device_name = res.devices[0].localName || res.devices[0].name
					if (typeof deviceNameBegin.value === 'string') {
					  deviceArr = [deviceNameBegin.value]
					} else {
					  deviceArr = deviceNameBegin.value
					}
					deviceArr.forEach(device => {
					  if (device_name.toLowerCase().startsWith(device.toLowerCase())) {
						  console.log(device_name)
						find = true
					  }
					})
					if (find) {
					  clearTimeout(serviceTimeOut)
					  deviceId.value = res.devices[0].deviceId
					  console.log('查找到了蓝牙设备：设备deviceId：' + deviceId.value + ' name:' + device_name)
					  resolve(res)
					  //在这准备连接设备
					}
				   } else {
					  reject('Device Not Find')
					  uni.showToast({
					  	title: '没有检查到设备',
					  	icon: 'error'
					  })
				   }
			   })
		})
			
	}
	/* 开启连接蓝牙 */
	const conectBT = () => {
		return new Promise((resolve, reject) => {
			KY_UNI.createBLEConnection(
				{
					deviceId: deviceId.value,
					timeout:"0"
				},
				(res) => {
					console.log(`等待连接成功:${res.code}--${res.message}`)
					resolve(res)
				},
				(res) => {
					uni.showToast({
						title: status[res.code],
						icon: 'error'
					})
					reject(res)
				}
			)
		})
		
	}
	/**
	 * 断开蓝牙连接
	 */
	const closeBLEConnection = () => {
	  return new Promise((resolve, reject) => {
	    holder.closeBLEConnection({
	      deviceId: deviceId.value,
	      success: res => {
	        console.log('断开蓝牙连接成功')
	        resolve(res)
	      },
	      fail: res => {
	        reject(res)
			uni.showToast({
				title: status[res.code],
				icon: 'error'
			})
	      },
	    })
	  })
	}
	/* 获取设备服务值 */
	const getServiceVal = () => {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				KY_UNI.getBLEDeviceServices(
					{
						deviceId: deviceId.value
					},
					(res) => {
						console.log(deviceId.value)
						console.log(`成功服务值---:${JSON.stringify(res)}`)
						const serviceList = res.services.slice()
						console.log(serviceList)
						for (let i = 0; i < serviceList.length; i++) {
						  const service = serviceList[i]
						  console.log(JSON.stringify(service) + '----serviceID：' + service.uuid)
						  if (service.uuid.indexOf(primaryUUID.value) > -1) {
						    serviceId.value = service.uuid
						    console.log('设备的serviceId： ' + serviceId.value)
						    //开始获取指定服务的特征值
						  }
						}
						resolve(res)
					},
					(res) => {
						console.log(`失败服务值---:${JSON.stringify(res)}`)
						reject(res)
						uni.showToast({
							title: status[res.code],
							icon: 'error'
						})
					}
				)
			}, 2500)
			
		})
	}
	/* 获取服务特征值 */
	const getCharacter = () => {
		return new Promise((resolve, reject) => {
			console.log( deviceId.value, serviceId.value)
			KY_UNI.getBLEDeviceCharacteristics(
				{
					deviceId: deviceId.value,
					serviceId: serviceId.value
				},
				(res) => {
					let characteristicsList = []
					console.log(`成功服务值---:${JSON.stringify(res)}`)
					characteristicsList = res.characteristics.slice()
					for (let i = 0; i < characteristicsList.length; i++) {
					  const characteristic = characteristicsList[i]
					  if (characteristic.uuid.indexOf(BLECharValue.write) != -1) {
					    characteristicId.writeId = characteristic.uuid
					    console.log('设备的特征值写入ID： ' + characteristicId.writeId)
					  }
					  if (characteristic.uuid.indexOf(BLECharValue.notify) != -1) {
					    characteristicId.notifyId = characteristic.uuid
					    if (characteristic.properties.notify) {
					      characteristicId.notify = true
					    }
					    if (characteristic.properties.indicate) {
					      characteristicId.indicate = true
					    }
					    console.log('设备的特征值notifyID： ' + characteristicId.notifyId)
					    console.log(
					      '设备的特征值监听方式：notify【' +
					        characteristicId.notify +
					        '】indicate【' +
					        characteristicId.indicate +
					        '】'
					    )
					  }
					}
					resolve(res)
					console.log(4)
				},
				(res) => {
					reject(res)
					console.log(`失败服务值---:${JSON.stringify(res)}`)
					uni.showToast({
						title: status[res.code],
						icon: 'error'
					})
				}
			)
		})
		
	}
	/* 设置服务协议 */
	const setProto = () => {
		return new Promise((resolve, reject) => {
			openProtoWatch()
			KY_UNI.notifyBLECharacteristicValueChange(
			    {
					deviceId:  deviceId.value,
					serviceId: serviceId.value,
					characteristicId: '0000fff1-0000-1000-8000-00805f9b34fb',
					protocol: true
				},
			    res => {
					resolve(res)
					if(!isBluetoothNotified.value) {
						isBluetoothNotified.value = true
					}
			    },
			    res => {
					uni.showToast({
						title: status[res.code],
						icon: 'error'
					})
			    }
			)
		})
		
	}
	/* 开启服务协议通讯监听 */
	const openProtoWatch = () => {
		KY_UNI.onBLECharacteristicValueChange(
		   (res) => {
			  const parse_result = parseBLEResponse(res)
			  switch (parse_result.err_code) {
			  	case '01_ok':
			  		deviceState.value = DEVICE_STATE.CONNECTED
			  	case '02_ok':
			  		deviceState.value = DEVICE_STATE.STARTED
			  		return
			  	case '03_ok':
			  		deviceState.value = DEVICE_STATE.STOPPED
			  		return
			  	case '05_ok':
			  		deviceState.value = DEVICE_STATE.RECEIVED
			  		return
			  	case '06_ok':
			  		deviceState.value = DEVICE_STATE.FINISHED
			  		resetAll()
			  		return
			  	case '07_ok':
			  		deviceState.value = DEVICE_STATE.ERROR
					resetAll()
					return
			  }
		   }
		)
	}
	/* 写入命令 */
	const writeOrder = (writeCode) => {
		if (!isBluetoothNotified.value) {
		  console.log('not isBluetoothNotified')
		  setProto().then(() => {
			 setTimeout(() => { writeData(writeCode)},1000)
		  })
		} else {
		  writeData(writeCode)
		}
	}
	/* 写数据 */
	const writeData = (writeCode) => {
		return new Promise((resolve, reject) => {
			KY_UNI.writeBLECharacteristicValue(
				{
					deviceId: "8C:DE:52:D8:77:05",
					serviceId: "0000FFF0-0000-1000-8000-00805F9B34FB",
					characteristicId: "0000FFF2-0000-1000-8000-00805F9B34FB",
					value: writeCode
				},
				(res) => {
					resolve(res)
					// 写入数据成功后禁止操作按钮		
					startButtonDisable.value = true
					
					showFinalResult.value = true
					// 写入成功重置上次数据
					resetResult()
					console.log(`写入数据成功---:${JSON.stringify(res)}`)
				},
				(res) => {
					reject(res)
					console.log(`写入数据失败---:${JSON.stringify(res)}`)
					uni.showToast({
						title: status[res.code],
						icon: 'error'
					})
				}
			)
		})
		
	}
	/* 关闭蓝牙设备器 */
	const closeBT = () => {
		return new Promise( (resolve, reject) => {
		  KY_UNI.closeBluetoothAdapter(
			(res) => {
				resolve(res)
				console.log(`关闭成功:${res.code}--${res.message}`)
				startButtonDisable.value = false
			},
			(res) => {
				reject(res)
				console.log(`关闭失败:${res.code}--${res.message}`)
				startButtonDisable.value = false
			})
		})
		
	}
	/**
	 * 解析血压计返回的即时数值
	 */
	 const parseBLEResponse = (res) => {
		const value = res.value
		const res_type = value.slice(10, 12)
		if (res_type === '01') {
			return {
				err_code: '01_ok',
				err_msg: '血压计应答终端  连接指令',
				err_obj: res
			}
		} else if (res_type === '02') {
			return {
				err_code: '02_ok',
				err_msg: '血压计应答终端  启动指令',
				err_obj: res
			}
		} else if (res_type === '03') {
			setTimeout(() => {
				startButtonDisable.value = false
			}, 100)
			return {
				err_code: '03_ok',
				err_msg: '血压计应答终端  停止测量指令',
				err_obj: res
			}
		} else if (res_type === '05') {
			const result = parseInt(value.slice(14, 16) + value.slice(20, 22), 16)
			console.log("动态压力值：" + result);
			measureResult.PRS = result
			return {
				err_code: '05_ok',
				err_msg: '血压计向终端发送  实时压力',
				err_obj: res
			}
		} else if (res_type === '06') {

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
			measureResult.SYS = sys_value
			measureResult.DIA = dia_value
			measureResult.PUL = pul_value
			measureResult.USR = user_id
			measureResult.TME = measure_date
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
	}
	return {
		// 血压计测量状态
		infoText,
		// 按钮禁用状态
		startButtonDisable,
		stopButtonDisable,
		// 是否显示结果
		showFinalResult,
		// 血压结果
		measureResult, 
		// 开始测量血压
		onece,
		// 停止测量血压
		onClickStop,
		// 全部重置
		resetAll,
		// 重置参数
		resetConnection,
		// 重置血压结果
		resetResult,
		// 初始化蓝牙
		init,
		// 开启连接监听
		openConectWatch,
		// 开启连接蓝牙
		startBTSearch,
		// 停止蓝牙搜索
		stopBTSearch,
		// 开启搜索监听
		initSearchWatch,
		// 连接脉搏波设备
		conectBT,
		// 断开蓝牙连接
		closeBLEConnection,
		// 获取设备服务值
		getServiceVal,
		// 获取设备特征值
		getCharacter,
		// 设置服务协议
		setProto,
		// 开启服务协议监听：监听血压实时返回结果
		openProtoWatch,
		// 写入命令
		writeOrder,
		// 关闭蓝牙
		closeBT,
		// 解析血压计返回的即时数值
		parseBLEResponse
	}
}