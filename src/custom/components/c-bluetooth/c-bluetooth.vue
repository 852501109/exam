<template>
	<view>
		<view>蓝牙流程统计</view>
		<button @click="start">开启蓝牙</button>
		<button @click="init">初始化蓝牙</button>
		<button @click="openConectWatch">开启连接监听</button>
		<button @click="startBTSearch">启动蓝牙搜索</button>
		<button @click="initSearchWatch">开启搜索监听</button>
		<button @click="stopBTSearch">停止蓝牙搜索</button>
		<button @click="conectBT">开启连接蓝牙</button>
		<button @click="getServiceVal">获取设备服务值（连接成功后）</button>
		<button @click="getCharacter">获取服务特征值</button>
		<button @click="setProto">设置服务协议</button>
		<button @click="openProtoWatch">开启服务协议通讯监听</button>
		<button @click="writeData">写数据</button>
		<button @click="closeBT">关闭蓝牙适配器</button>
	</view>
</template>
<script setup>
	import {ref, reactive} from 'vue'
	const KY_UNI = uni.requireNativePlugin('KunYuBluetooth')
	const deviceId = ref('')
	const serviceId = ref('')
	const protocol = ref('')
	const deviceNameBegin = ref('BP06D2')
	const primaryUUID = ref('FFF0')
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
	const characteristicId = reactive({
		//支持写入操作的特征值
		writeId: '',
		//支持notify操作的特征值
		notifyId: '',
		notify: false,
		indicate: false
	})
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
	/* 开启蓝牙 */
	const start = () => {
		KY_UNI.openBluetoothAdapter = ( (res) => {
			console.log(`成功:${res.code}--${res.message}`)
		}, (res) => {
			console.log(`失败:${res.code}--${res.message}`)
		})
	}
	/* 开启连接监听 */
	const openConectWatch = () => {
		KY_UNI.onBLEConnectionStateChange(
		   (res) => {
			   console.log(`连接状态---:${res.connected}--${res.deviceId}`)
		   }
		)
	}
	/* 初始化蓝牙 */
	const init = () => {
		KY_UNI.openBluetoothAdapter( (res) => {
			console.log(`成功:${res.code}--${res.message}`)
		},
		(res) => {
			console.log(`失败:${res.code}--${res.message}`)
		})
	}
	/* 启动蓝牙搜索*/
	const startBTSearch = () => {
		KY_UNI.startBluetoothDevicesDiscovery(
			{
				services:[],
				allowDuplicatesKey:false,
				interval:"0"
			},
			(res) => {
				console.log(`开启搜索成功:${res.code}--${res.message}`)
				console.log(`----准备监听----`)
			},
			(res) => {
				console.log(`开启搜索失败:${res.code}--${res.message}`)
				console.log(`----重新扫描----`)
			}
		)
	}
	/* 停止蓝牙搜索*/
	const stopBTSearch = () => {
		KY_UNI.closeBluetoothAdapter(
			{
				services:[],
				allowDuplicatesKey:false,
				interval:"0"
			},
			(res) => {
				console.log(`关闭成功:${res.code}--${res.message}`)
			},
			(res) => {
				console.log(`关闭失败:${res.code}--${res.message}`)
			}
		)
	}
	/* 开启搜索监听 */
	const initSearchWatch = () => {
		KY_UNI.onBluetoothDeviceFound(
		   (res) => {
			   const a = res
			   const tempResult = res.devices
			   if(tempResult.length > 0){
				// console.log(`---${tempResult[0].name}--${tempResult[0].deviceId}--${tempResult[0].name}`)
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
				  deviceId.value = res.devices[0].deviceId
				  console.log('查找到了蓝牙设备：设备deviceId：' + deviceId.value + ' name:' + device_name)
				  //在这准备连接设备
				}
			   } else {
				  console.log(`Device Not Find`)
			   }
		   }
		)
	}
	/* 开启连接蓝牙 */
	const conectBT = () => {
		console.log(deviceId.value)
		KY_UNI.createBLEConnection(
			{
				deviceId: deviceId.value,
				timeout:"0"
			},
			(res) => {
				console.log(`等待连接成功:${res.code}--${res.message}`)
			},
			(res) => {
				console.log(`等待连接失败:${res.code}--${res.message}`)
			}
		)
	}
	/* 获取设备服务值 */
	const getServiceVal = () => {
		KY_UNI.getBLEDeviceServices(
			{
				deviceId: deviceId.value
			},
			(res)=> {
				console.log(`成功服务值---:${JSON.stringify(res)}`)
				const serviceList = res.services.slice()
				for (let i = 0; i < serviceList.length; i++) {
				  const service = serviceList[i]
				  console.log(JSON.stringify(service) + '----serviceID：' + service.uuid)
				  if (service.uuid.indexOf(primaryUUID.value) > -1) {
				    serviceId.value = service.uuid
				    console.log('设备的serviceId： ' + serviceId.value)
				    //开始获取指定服务的特征值
				  }
				}
			},
			(res)=> {
				console.log(`失败服务值---:${JSON.stringify(res)}`)
			}
		)
	}
	/* 获取服务特征值 */
	const getCharacter = () => {
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
			},
			(res)=> {
				console.log(`失败服务值---:${JSON.stringify(res)}`)
			}
		)
	}
	/* 设置服务协议 */
	const setProto = () => {
		KY_UNI.notifyBLECharacteristicValueChange(
			{
				deviceId: deviceId.value,
				serviceId: AServiceId.value,
				characteristicId: BCharactorsId.value,
				protocol: protocol.value
			},
			(res) => {
				console.log(`设置协议成功---:${JSON.stringify(res)}`)
			},
			(res) => {
				console.log(`设置协议失败---:${JSON.stringify(res)}`)
			}
		)
	}
	/* 开启服务协议通讯监听 */
	const openProtoWatch = () => {
		KY_UNI.onBLECharacteristicValueChange(
		   (res) => {
			   console.log(`监听数值---:${JSON.stringify(res.value)}`)

		   }
		)
	}
	/* 写数据 */
	const writeData = () => {
		const writeCode = BLE_ORDER.START_MEASURE
		//因为协议文档中，一个字节两个字符的控制命令，codeLength为命令字节数
		const codeLength = writeCode.length / 2
		const buffer = new ArrayBuffer(codeLength)
		const dataView = new DataView(buffer)
		//在这里解析将要写入的值
		for (let i = 0; i < codeLength; i++) {
		  dataView.setUint8(i, '0X' + writeCode.substring(i * 2, i * 2 + 2))
		  // console.log("位数：" + i + "-----" + writeCode.substring(2 * i, 2 * i + 2));
		}
		
		console.log('写入数据中deviceId：' + deviceId)
		console.log('写入数据中serviceId:' + serviceId)
		console.log('写入数据中characteristicId:' + characteristicId)
		console.log('分割线************************************')
		
		const writeData = uni.getSystemInfoSync().platform === 'ios' ? buffer : writeCode
		console.log(writeData, writeCode)
		KY_UNI.writeBLECharacteristicValue(
			{
				deviceId: deviceId.value,
				serviceId: serviceId.value,
				characteristicId: characteristicId.writeId,
				value: writeData
			},
			(res) => {
				console.log(`写入数据成功---:${JSON.stringify(res)}`)
			},
			(res) => {
				console.log(`写入数据失败---:${JSON.stringify(res)}`)
			}
		)
	}
	/* 关闭蓝牙设备器 */
	const closeBT = () => {
		KY_UNI.closeBluetoothAdapter(
		(res) => {
			console.log(`关闭成功:${res.code}--${res.message}`)
		},
		(res) => {
			console.log(`关闭失败:${res.code}--${res.message}`)
		})
	}
</script>

<style>
</style>
