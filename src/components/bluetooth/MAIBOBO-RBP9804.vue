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
        <view v-if="deviceId.value.length > 0">
          <view>
            <text v-once class="label">deviceId:</text>
            <text class="device-info">{{deviceId.value}}</text>
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

<script setup>
    import {ref, reactive, computed, watch, onMounted, onBeforeDestroy} from 'vue'
    import { parseDate } from '@/common/tool.js'
   import { enableBAdapter } from './native-bluetooth.js'
   import kyble from './ble-proxy.js'
   import { ab2hex } from '@/common/tool.js'
   const platform = ref(uni.getSystemInfoSync().platform)
   const holder = ref({})
   if (platform.value === 'ios') {
   	holder.value = uni
   } else {
   	holder.value = kyble
   }
    const DEVICE_TIMEOUT = ref(10 * 1000)
    const BLE_ORDER = reactive({
    	CONNECT_ORDER: 'cc80020301010001',
    	POWER_ORDER: 'cc80020304040001',
    	START_MEASURE: 'cc80020301020002',
    	STOP_ORDER: 'cc80020301030003',
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
    })
    const INIT_DATA_RESULT = reactive({
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
    const props = defineProps({
      name: {
        disabled: String,
        default: 'disabled'
      }
    })
    import Bluetooth from './bluetooth'

   //是否已经打开蓝牙，默认为false，当蓝牙适配器初始化成功后为true
   const isBluetoothAdpatorOn = ref(false)
   //设备列表
   const deviceId = ref('')
   //服务Id
   const serviceId = ref('')
   //特征值ID
   const characteristicId = reactive({
   	//支持写入操作的特征值
   	writeId: '',
   	//支持notify操作的特征值
   	notifyId: '',
   	notify: false,
   	indicate: false
   })
   //开始监听蓝牙返回数据
   const isBluetoothNotified = ref(false)
   //测量结果
   const measureResult = ref(INIT_DATA_RESULT)
   const deviceState = ref(DEVICE_STATE.BLEOFF)
   const stopButtonDisable = (false)
   const deviceTimeout = ref(null)
   const showStartButton = computed(() => {
   	return ([DEVICE_STATE.BLEOFF, DEVICE_STATE.SEARCHING, DEVICE_STATE.CONNECTED, DEVICE_STATE.STOPPED,
   		DEVICE_STATE.ERROR,
   		DEVICE_STATE.FINISHED
   	].indexOf(
   		deviceState) > -1)
   })
  onMounted(() => {
     loseBluetoothAdapter()
   	DEVICE_STATE.value = DEVICE_STATE
   	deviceNameBegin.value = 'BP06D2'
   	primaryUUID.value = 'FFF0'
   	BLECharValue = {
   		write: 'FFF2',
   		notify: 'FFF1'
   	}
   })
  onBeforeDestroy(() => {
    console.log('Leaving')
    a.insert('', '')
    handleLeavePage()
  })
   const startButtonDisable = computed(() => {
   	return props.disabled || isWorking
   })
   const isWorking = computed(() => {
   	return ([DEVICE_STATE.SEARCHING, DEVICE_STATE.CONNECTED, DEVICE_STATE.STARTED, DEVICE_STATE.RECEIVED]
   		.indexOf(deviceState) >
   		-1)
   })
   const showImmdiateResult = computed(() => {
   	return ([DEVICE_STATE.RECEIVED].indexOf(deviceState) > -1)
   })
   const showFinalResult = computed(() => {
   	return false
   })
   const showConnectInfo = computed(() => {
   	return false
   })
   const infoText = computed(() => {
   	return INFO_TEXT[deviceState].text
   })
   const infoClass = computed(() => {
   	return {
   		error: INFO_TEXT[deviceState].type === 'error',
   		normal: INFO_TEXT[deviceState].type === 'normal'
   	}
   })
   const isConnected = computed(() => {
   	return isBluetoothAdpatorOn.value && deviceId.value.length > 0 && serviceId.value.length > 0 && this
   		.characteristicId.writeId.length > 0 && characteristicId.notifyId > 0 && isBluetoothNotified
   })
   const emit = defineEmits(['deviceWorking', 'setPressure'])
    	watch(isWorking, (newVal, oldValue) => {
   	emit('deviceWorking', newVal)
   },{
        immediate: true, // 立即执行
        deep: true // 深度监听
      })
   const onClickStart = () => {
   	startProcess(() => {
   		deviceState = DEVICE_STATE.CONNECTED
   		return makeStartOrder().catch(error => {
   			console.log(JSON.stringify(error.err_obj))
   			$showToast(error.err_msg)
   		})
   	}, () => {
   		return makeStartOrder()
   	})
   }
   const onClickStop = () => {
   	makeStopOrder()
   }

   const makeStartOrder = () => {
   	return makeOrderToDevice(BLE_ORDER.START_MEASURE).then(() => {
   		deviceTimeout = setTimeout(() => {
   			deviceState = DEVICE_STATE.BLEOFF
   			resetAll()
   		}, DEVICE_TIMEOUT.value)
   	})
   }
   const makeConnectOrder = () => {
   	return makeOrderToDevice(BLE_ORDER.CONNECT_ORDER)
   }
   const makeStopOrder = () => {
   	stopButtonDisable.value = true
   	return makeOrderToDevice(BLE_ORDER.STOP_ORDER)
   }
  //向蓝牙设备发送命令的通用函数
    const makeOrderToDevice = (order) => {
      console.log('order:' + order)
      if (!isBluetoothNotified.value) {
        console.log('not isBluetoothNotified')
        notifyBLECharacteristicValue().then(() => {
          return writeBLECharacteristicValue(order)
        })
      } else {
        return writeBLECharacteristicValue(order)
      }
    }
  //开启蓝牙适配器
    const openBluetoothAdapter = () => {
      return new Promise((resolve, reject) => {
        if (isBluetoothAdpatorOn.value) {
        }
        holder.value.openBluetoothAdapter({
          success: res => {
            console.log('初始化蓝牙成功')
            isBluetoothAdpatorOn.value = true
            resolve(res)
          },
          fail: res => {
            console.log('初始化蓝牙失败，错误码：' + (res.errCode || res.errMsg))
            reject({
              err_msg: '初始化蓝牙失败',
              err_obj: res,
            })
          },
        })
      })
    }
  const startBluetoothDeviceDiscovery = (cb) => {
      const realDeviceDiscovery = cb => {
        const options = {
          success: res => {
            return cb(res)
          },
          fail: res => {
            return realDeviceDiscovery(cb)
          },
        }
        if (uni.getSystemInfoSync().platform === 'android') {
          options.services = [primaryUUID]
        }
        holder.value.startBluetoothDevicesDiscovery(options)
      }
      return new Promise((resolve, reject) => {
        const deviceDiscoveryTimeout = setTimeout(() => {
          reject({
            err_msg: '查找蓝牙设备失败',
            err_obj: null,
          })
        }, DEVICE_DISCOVERY_TIMEOUT)
        const start_time = Date.now()
        realDeviceDiscovery(res => {
          clearTimeout(deviceDiscoveryTimeout)
          const delta = Date.now() - start_time
          console.log('DEVICE DISCOVERY RUNNING TIME:' + delta / 1000)
          resolve(res)
        })
      })
    }
  /**
     * 停止搜索蓝牙设备
     */
    const stopBluetoothDevicesDiscovery = () => {
      console.log('开始停止寻找蓝牙设备')
      return new Promise((resolve, reject) => {
        holder.value.stopBluetoothDevicesDiscovery({
          success: res => {
            console.log('停止搜索蓝牙设备')
            resolve(res)
          },
          fail: res => {
            reject({
              err_msg: '停止搜索蓝牙设备失败',
              err_obj: res,
            })
          },
        })
      })
    }
  /**
     * 发现外围设备
     */
    const onBluetoothDeviceFound = () => {
      console.log('监听寻找新设备')
      return new Promise((resolve, reject) => {
        const device_timeout = setTimeout(() => {
          reject({
            err_msg: '30秒内无法找到指定设备',
            err_obj: null,
          })
        }, DEVICE_SEARCH_TIMEOUT)
        holder.value.onBluetoothDeviceFound(res => {
          let find = false,
            deviceNameBegin = []
          const device_name = res.devices[0].localName || res.devices[0].name
          if (typeof deviceNameBegin.value === 'string') {
            deviceNameBegin = [deviceNameBegin.value]
          } else {
            deviceNameBegin = deviceNameBegin.value
          }
          deviceNameBegin.forEach(device => {
            if (device_name.toLowerCase().startsWith(device.toLowerCase())) {
              find = true
            }
          })
          if (find) {
            deviceId.value = res.devices[0].deviceId.value
            console.log('查找到了蓝牙设备：设备deviceId.value：' + deviceId.value + ' name:' + device_name)
            //在这准备连接设备
            clearTimeout(device_timeout)
            resolve(res)
          }
        })
      })
    }

  /**
     * 连接设备
     */
    const createBLEConnection = () => {
      //设备deviceId.value
      const deviceId = deviceId.value
      return new Promise((resolve, reject) => {
        holder.value.createBLEConnection({
          // 这里的 deviceId.value 需要已经通过 createBLEConnection 与对应设备建立链接
          deviceId,
          success: res => {
            console.log('设备连接成功！' + JSON.stringify(res))
            resolve(res)
          },
          fail: res => {
            reject({
              err_msg: '设备连接失败',
              err_obj: res,
            })
          },
        })
      })
    }
  /**
     * 获取设备的服务ID
     */
    const getBLEDeviceServices = () => {
      const deviceId = deviceId.value
      let serviceList = []
      //延迟1.5s获取设备的services
      return new Promise((resolve, reject) => {
        console.log('获取设备的services')
        const actualGetDevice = cb => {
          return holder.value.getBLEDeviceServices({
            // 这里的 deviceId.value 需要已经通过 createBLEConnection 与对应设备建立链接
            deviceId,
            success: res => {
              console.log('device services:', res)
              if (res.services.length === 0) {
                return actualGetDevice(cb)
              }
              serviceList = res.services.slice()
              for (let i = 0; i < serviceList.length; i++) {
                const service = serviceList[i]
                console.log(JSON.stringify(service) + '----serviceID：' + service.uuid)
                if (service.uuid.indexOf(primaryUUID) > -1) {
                  serviceId.value = service.uuid
                  console.log('设备的serviceId： ' + serviceId.value)
                  //开始获取指定服务的特征值
                  return cb(res)
                }
              }
            },
            fail: res => {
              console.log('res: ' + JSON.stringify(res))
              return actualGetDevice(cb)
            },
          })
        }
        const getServiceTimeout = setTimeout(() => {
          reject({
            err_msg: '获取蓝牙设备ServiceID超时',
            err_msg: null,
          })
        }, GET_SERVICE_TIMEOUT)

        const start_time = Date.now()
        actualGetDevice(res => {
          clearTimeout(getServiceTimeout)
          const delta = Date.now() - start_time
          console.log('GET SERVICE RUNNING TIME:' + delta / 1000)
          resolve(res)
        })
      })
    }
  /**
     * 获取指定服务的特征值
     */
    const getBLEDeviceCharacteristics = () => {
      const deviceId = deviceId.value
      const serviceId = serviceId.value
      let characteristicsList = []
      return new Promise((resolve, reject) => {
        holder.value.getBLEDeviceCharacteristics({
          // 这里的 deviceId.value 需要已经通过 createBLEConnection 与对应设备建立链接
          deviceId,
          // 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
          serviceId,
          success: res => {
            console.log(
              '获取的' + serviceId + '服务的特征值：' + JSON.stringify(res.characteristics)
            )
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
              if (characteristicId.writeId != '' && characteristicId.notifyId != '') {
                resolve(res)
              }
            }
            if (!characteristicId.notifyId || !characteristicId.writeId) {
              reject({
                err_msg: '获取设备服务ID失败',
                err_obj: res,
              })
            }
          },
          fail: res => {
            console.log('device getBLEDeviceCharacteristics failed:', JSON.stringify(res))
            reject({
              err_msg: '获取设备服务ID失败',
              err_obj: res,
            })
          },
        })
      })
    }
  const onBLECharacteristicValueChange = (cb) => {
      if (platform.value === 'ios') {
        return holder.value.onBLECharacteristicValueChange(res => {
          const data = res
          data.value = ab2hex(res.value)
          cb(data)
        })
      }
      return holder.value.onBLECharacteristicValueChange(cb)
    }
  /**
     * 开启订阅特征值
     */
    const notifyBLECharacteristicValue = (param) => {
      const deviceId = deviceId.value
      const serviceId = serviceId.value
      const characteristicId = characteristicId.notifyId
      let protocol
      if (param && param.protocl) {
        protocol = param.protocl
      } else if (characteristicId.notify) {
        protocol = 'notify'
      } else if (characteristicId.indicate) {
        protocol = 'indicate'
      }
      return new Promise((resolve, reject) => {
        holder.value.notifyBLECharacteristicValueChange({
          protocol: protocol,
          // 这里的 deviceId.value 需要已经通过 createBLEConnection 与对应设备建立链接
          deviceId,
          // 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
          serviceId,
          // 这里的 characteristicId 需要在 getBLEDeviceCharacteristics 接口中获取
          characteristicId,
          state: true,
          success(res) {
            console.log('notifyBLECharacteristicValueChange success:' + JSON.stringify(res))
            isBluetoothNotified.value = true
            resolve(res)
          },
          fail(res) {
            console.log('notifyBLECharacteristicValueChange failed:' + res.errMsg)
            isBluetoothNotified.value = false
            reject({
              err_msg: '开启蓝牙连接监听失败',
              err_obj: res,
            })
          },
        })
      })
    }
  /**
     * 写入控制命令
     * writeCode 写入的控制命令
     */
    const writeBLECharacteristicValue = (writeCode) => {
      const deviceId = deviceId.value
      const serviceId = serviceId.value
      const characteristicId = characteristicId.writeId
      //因为协议文档中，一个字节两个字符的控制命令，codeLength为命令字节数
      const codeLength = writeCode.length / 2
      const buffer = new ArrayBuffer(codeLength)
      const dataView = new DataView(buffer)
      //在这里解析将要写入的值
      for (let i = 0; i < codeLength; i++) {
        dataView.setUint8(i, '0X' + writeCode.substring(i * 2, i * 2 + 2))
        // console.log("位数：" + i + "-----" + writeCode.substring(2 * i, 2 * i + 2));
      }

      console.log('写入数据中deviceId.value：' + deviceId.value)
      console.log('写入数据中serviceId:' + serviceId)
      console.log('写入数据中characteristicId:' + characteristicId)
      console.log('分割线************************************')

      const writeData = platform.value === 'ios' ? buffer : writeCode

      const realWriteBLE = cb => {
        holder.value.writeBLECharacteristicValue({
          // 这里的 deviceId.value 需要在 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
          deviceId,
          // 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
          serviceId,
          // 这里的 characteristicId 需要在 getBLEDeviceCharacteristics 接口中获取
          characteristicId,
          // 这里的value是ArrayBuffer类型
          // value: buffer,
          value: writeData,
          success(res) {
            return cb(res)
          },
          fail(res) {
            // console.log("写入数据失败", res.errMsg)
            return realWriteBLE(cb)
          },
        })
      }

      return new Promise((resolve, reject) => {
        const writeBLETimeout = setTimeout(() => {
          reject({
            err_msg: '获取蓝牙设备ServiceID超时',
            err_msg: null,
          })
        }, WRITE_BLE_TIMEOUT)

        const start_time = Date.now()
        realWriteBLE(res => {
          console.log('writeBLECharacteristicValue success', JSON.stringify(res))
          clearTimeout(writeBLETimeout)
          const delta = Date.now() - start_time
          console.log('WRITE BLE RUNNING TIME:' + delta / 1000)
          resolve(res)
        })
      })
    }
   /**
     * 监听低功耗蓝牙连接状态的改变事件。包括开发者主动连接或断开连接，设备丢失，连接异常断开等等
     */
    const onBLEConnectionStateChange = (cb) => {
      holder.value.onBLEConnectionStateChange(res => {
        console.log(`蓝牙连接状态 -------------------------->` + JSON.stringify(res))
        if (!res.connected) {
          console.log('状态监听：蓝牙连接已断开')
          if (cb) {
            cb(res)
          }
        }
      })
    }
  /**
     * 关闭蓝牙适配器
     */
    const closeBluetoothAdapter = () => {
      return new Promise((resolve, reject) => {
        holder.value.closeBluetoothAdapter({
          success: res => {
            isBluetoothAdpatorOn.value = false
            console.log('关闭蓝牙适配器成功')
            resolve(res)
          },
          fail: res => {
            console.log('关闭蓝牙适配器失败')
            reject(res)
          },
        })
      })
    }
  /**
     * 断开蓝牙连接
     */
    const closeBLEConnection = () => {
      return new Promise((resolve, reject) => {
        holder.value.closeBLEConnection({
          deviceId: deviceId,
          success: res => {
            console.log('断开蓝牙连接成功')
            resolve(res)
          },
          fail: res => {
            console.log('断开蓝牙连接失败')
            reject(res)
          },
        })
      })
    }
   /**
     * 设备是否已经连接
     */
    const isDeviceConnected = () => {
      return new Promise((resolve, reject) => {
        holder.value.getConnectedBluetoothDevices({
          success: res => {
            console.log('getConnectedBluetoothDevices: ' + res)
            const connectListLength = res.devices.length
            let found = -1
            if (connectListLength > 0) {
              for (let i = 0; i < connectListLength; i++) {
                if (res.devices[i].deviceId.value === deviceId.value) {
                  found = i
                  break
                }
              }
              if (found !== -1) {
                resolve(found)
              } else {
                closeBluetoothAdapter().then(res => {
                  openBluetoothAdapter().then(res => {
                    reject({
                      err_code: 'not_connected',
                      err_msg: '没有已连接的蓝牙设备',
                      err_obj: res,
                    })
                  })
                })
              }
            } else {
              reject({
                err_code: 'not_connected',
                err_msg: '没有已连接的蓝牙设备',
                err_obj: res,
              })
            }
          },
          fail: res => {
            console.log(res)
            reject({
              err_code: 'not_connected',
              err_msg: '没有已连接的蓝牙设备',
              err_obj: res,
            })
          },
        })
      })
    }
  /**
     * 设备启动连接的基本流程
     * cb1: 设备保持链接状态时执行
     * cb2：重新链接上设备时执行
     */
    const startProcess = (cb1, cb2) => {
      enableBAdapter().then(() => {
        openBluetoothAdapter()
          .then(() => {
            onBLEConnectionStateChange(res => handleBLEConnectionClose(res))
            isDeviceConnected()
              .then(() => {
                if (deviceState.value && DEVICE_STATE) {
                  deviceState = DEVICE_STATE.CONNECTED
                }
                if (cb1) {
                  return cb1()
                }
              })
              .catch(err => {
                console.log('not found')
                console.log(err)
                if (err.err_code && err.err_code === 'not_connected') {
                  if (this.deviceState && this.DEVICE_STATE) {
                    this.deviceState = this.DEVICE_STATE.SEARCHING
                  }
                  return this.startBluetoothDeviceDiscovery()
                    .then(() => {
                      this.onBluetoothDeviceFound()
                        .then(() => {
                          this.stopBluetoothDevicesDiscovery()
                          return this.createBLEConnection()
                            .then(() => {
                              if (!this.serviceId) {
                                return this.getBLEDeviceServices()
                              }
                              return new Promise((resolve, reject) => {
                                reject()
                              })
                            })
                            .then(() => {
                              console.log(this.characteristicId)
                              if (
                                !this.characteristicId.writeId ||
                                !this.characteristicId.notifyId
                              ) {
                                return this.getBLEDeviceCharacteristics()
                              }
                              return new Promise((resolve, reject) => {
                                reject()
                              })
                            })
                            .then(() => {
                              this.setBLEResponseParser()
                              return this.notifyBLECharacteristicValue()
                            })
                            .then(() => {
                              if (cb2) {
                                return cb2()
                              }
                            })
                            .catch(error => {
                              console.log('Error: ' + error)
                              if (this.deviceState && this.DEVICE_STATE) {
                                this.deviceState = this.DEVICE_STATE.BLEOFF
                              }
                              if (error.err_obj) {
                                console.log(JSON.stringify(error.err_obj))
                              } else {
                                console.log(JSON.stringify(error))
                              }
                              this.$showToast(error)
                            })
                        })
                        .catch(error => {
                          this.stopBluetoothDevicesDiscovery()
                          this.$showToast(error)
                          if (this.deviceState && this.DEVICE_STATE) {
                            this.deviceState = this.DEVICE_STATE.BLEOFF
                            this.resetAll()
                          }
                        })
                    })
                    .catch(() => {
                      console.log(JSON.stringify(error.err_obj))
                      this.$showToast(error)
                    })
                }
              })
              .catch(() => {
                console.log(JSON.stringify(error.err_obj))
                this.$showToast(error)
              })
          })
          .catch(() => {
            this.$showToast('请开启本机蓝牙功能')
          })
      })
    }
   const resetAll = () => {
   	resetResult()
   	resetConnection()
   	resetPageState()
   }

    		const resetConnection = () => {
    			isBluetoothAdpatorOn.value = false
    			deviceId.value = ''
    			serviceId.value = ''
    			characteristicId.writeId = ''
    			characteristicId.notifyId = ''
    			characteristicId.notify.value = false
    			characteristicId.indicate.value = false
    			isBluetoothNotified.value = false
    			deviceTimeout.value = null
    		}
    		const resetResult = () => {
    			measureResult.value = INIT_DATA_RESULT
    		}
    		const resetPageState = () => {
    			deviceState.value = DEVICE_STATE.BLEOFF
    			stopButtonDisable.value = false
    		}
   	const handleLeavePage = () => {
    			if (isWorking.value) {
    				makeStopOrder().then(() => {
    					closeBLEConnection()
    				})
    				deviceState.value = DEVICE_STATE.STOPPED
    				resetConnection()
    			}
    		}
    		/**
    		 * 解析血压计返回的即时数值
    		 */
    		const handleBLEConnectionClose = (res) => {
    			resetConnection()
    			$showToast('血压计已断开')
    			deviceState.value = DEVICE_STATE.BLEOFF
    		}
    		/**
    		 * 设置蓝牙返回值的监听和处理函数
    		 */
    		const setBLEResponseParser = () => {
    			onBLECharacteristicValueChange(res => {
    			const parse_result = parseBLEResponse(res)
    			switch (parse_result.err_code) {
    				case '01_ok':
    					clearTimeout(deviceTimeout)
    					deviceState.value = DEVICE_STATE.CONNECTED
    					return makeStartOrder()
    				case '02_ok':
    					clearTimeout(deviceTimeout)
    					deviceState.value = DEVICE_STATE.STARTED
    					return
    				case '03_ok':
    					clearTimeout(deviceTimeout)
    					deviceState.value = DEVICE_STATE.STOPPED
    					return
    				case '05_ok':
    					clearTimeout(deviceTimeout)
    					deviceState.value = DEVICE_STATE.RECEIVED
    					return
    				case '06_ok':
    					clearTimeout(deviceTimeout)
    					deviceState.value = DEVICE_STATE.FINISHED
    					emit('setPressure', parse_result.err_obj)
    					return
    				case '07_ok':
    					clearTimeout(deviceTimeout)
    					deviceState.value = DEVICE_STATE.ERROR

    			}
    		})
    		}
    		/**
    		 * 解析血压计返回的即时数值
    		 */
    		const parseBLEResponse = (res) => {
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
    					stopButtonDisable.value = false
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
    				measureResult.value.PRS = result
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
    				measureResult.value.SYS = sys_value
    				measureResult.value.DIA = dia_value
    				measureResult.value.PUL = pul_value
    				measureResult.value.USR = user_id
    				measureResult.value.TME = measure_date
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
</script>

<style>
  @import './bluetooth.css';
</style>
s
