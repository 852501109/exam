import { onBeforeMount, onMounted, nextTick, ref, reactive } from 'vue'
export default function () {
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
  })
  const allStatus = reactive([false, true, true, true, true, true, true, true, true, true, true])
  const adapterState = reactive({
    discovering: false,
    available: false,
  })
  const searchLoad = ref(false)
  const newDeviceLoad = ref(false)
  const showMaskType = ref('device')
  const maskShow = ref(false)
  const list = reactive([])
  const equipment = reactive([])
  const connected = ref(false)
  const servicesData = reactive([])
  const characteristicsData = reactive([])
  const valueChangeData = reactive({})
  const isStop = ref(true)
  // 初始化蓝牙
  const openBluetoothAdapter = () => {
    uni.openBluetoothAdapter({
      success: e => {
        console.log(e)
        allStatus[0] = true
        allStatus[1] = false
        allStatus[10] = false
        getBluetoothAdapterState()
      },
      fail: e => {
        console.log(e)
      },
    })
  }
  // 获取本机蓝牙适配器状态
  const getBluetoothAdapterState = () => {
    uni.getBluetoothAdapterState({
      success: res => {
        allStatus[1] = true
        allStatus[2] = false
        allStatus[3] = false
        onBluetoothDeviceFound()
      },
      fail: e => {
        console.log('获取本机蓝牙适配器状态失败，错误码：')
        if (e.code !== 0) {
          console.log(status[e.code])
        }
      },
    })
  }
  // 开始搜索蓝牙设备
  const startBluetoothDevicesDiscovery = () => {
    uni.startBluetoothDevicesDiscovery({
      success: e => {
        allStatus[1] = true
        allStatus[2] = false
        allStatus[3] = false
        onBluetoothDeviceFound()
      },
      fail: e => {
        console.log('搜索蓝牙设备失败，错误码：' + e.errMsg)
      },
    })
  }

  // 发现外围设备
  const onBluetoothDeviceFound = () => {
    uni.onBluetoothDeviceFound(devices => {
      console.log('开始监听寻找到新设备的事件')
      // this.$set(this.disabled, 3, false)
      getBluetoothDevices()
    })
  }
  // 停止搜索蓝牙设备
  const stopBluetoothDevicesDiscovery = types => {
    uni.stopBluetoothDevicesDiscovery({
      success: e => {
        console.log('停止搜索蓝牙设备:' + e.errMsg)
        allStatus[1] = types
        allStatus[2] = true
        searchLoad.value = false
      },
      fail: e => {
        console.log('停止搜索蓝牙设备失败，错误码：' + e.code)
        if (e.code !== 0) {
          console.log(status[e.code])
        }
      },
    })
  }
  // 获取在蓝牙模块生效期间所有已发现的蓝牙设备。包括已经和本机处于连接状态的设备。
  const getBluetoothDevices = () => {
    uni.getBluetoothDevices({
      success: res => {
        newDeviceLoad.value = false
        console.log('获取蓝牙设备成功:' + res.errMsg)
        // console.log(JSON.stringify(res))
        list = res.devices
      },
      fail: e => {
        console.log('获取蓝牙设备错误，错误码：' + e.code)
        if (e.code !== 0) {
          console.log(status[e.code])
        }
      },
    })
  }
  // 连接低功耗蓝牙
  const createBLEConnection = () => {
    // let deviceId = this.equipment[0].deviceId
    return new Promise((resolve, reject) => {
      uni.createBLEConnection({
        // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
        deviceId,
        success: res => {
          resolve(res)
          console.log('连接蓝牙成功:' + res.errMsg)
          allStatus[3] = true
          allStatus[4] = true
          allStatus[5] = false
          allStatus[9] = false
          connected.value = true
          stopBluetoothDevicesDiscovery(true)
        },
        fail: e => {
          console.log('连接低功耗蓝牙失败，错误码：' + e.code)
          if (e.errCode !== 0) {
            console.log(status[e.code])
          }
        },
      })
    })
  }
  // 断开与低功耗蓝牙设备的连接
  const closeBLEConnection = () => {
    // let deviceId = this.equipment[0].deviceId
    return new Promise((resolve, reject) => {
      uni.closeBLEConnection({
        deviceId,
        success: res => {
          resolve(res)
          console.log('断开低功耗蓝牙成功:' + res.errMsg)
        },
        fail: e => {
          console.log('断开低功耗蓝牙成功，错误码：' + e.code)
          if (e.errCode !== 0) {
            console.log(status[e.code])
          }
        },
      })
    })
  }
  const moveHandle = () => {}
  const maskclose = () => {
    maskShow.value = false
  }
  //  获取所有服务
  const getBLEDeviceServices = () => {
    const deviceId = this.equipment[0].deviceId

    uni.getBLEDeviceServices({
      // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
      deviceId,
      success: res => {
        console.log(JSON.stringify(res.services))
        console.log('获取设备服务成功:' + res.errMsg)
        allStatus[7] = true
        allStatus[8] = true
        showMaskType.value = 'service'
        list = res.services
        this.characteristicsData = []
        if (list.length <= 0) {
          return
        }
        maskShow.value = true
      },
      fail: e => {
        console.log('获取设备服务失败，错误码：' + e.code)
      },
    })
  }
  // 获取某个服务下的所有特征值
  const getBLEDeviceCharacteristics = () => {
    const deviceId = equipment[0].deviceId
    const serviceId = servicesData[0].uuid
    uni.getBLEDeviceCharacteristics({
      // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
      deviceId,
      // 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
      serviceId,
      success: res => {
        console.log(JSON.stringify(res))
        console.log('获取特征值成功:' + res.errMsg)
        allStatus[7] = true
        valueChangeData = {}
        showMaskType = 'characteristics'
        list = res.characteristics
        if (list.length <= 0) {
          toast('获取特征值失败，请重试!')
          return
        }
        maskShow.value = true
      },
      fail: e => {
        console.log('获取特征值失败，错误码：' + e.errCode)
        if (e.errCode !== 0) {
          console.log(e.errCode)
        }
      },
    })
  }
  // 选择设备
  const queryDevices = () => {
    // this.newDeviceLoad = true;
    showMaskType.value = 'device'
    maskShow.value = true
  }
  // 监听低功耗蓝牙连接状态的改变事件。包括开发者主动连接或断开连接，设备丢失，连接异常断开等等
  const onBLEConnectionStateChange = () => {
    uni.onBLEConnectionStateChange(res => {
      // 该方法回调中可以用于处理连接意外断开等异常情况
      console.log(`蓝牙连接状态 -------------------------->`)
      console.log(JSON.stringify(res))
    })
  }
  // 读取低功耗蓝牙设备的特征值的二进制数据值。注意：必须设备的特征值支持 read 才可以成功调用
  const readBLECharacteristicValue = () => {
    const deviceId = equipment[0].deviceId
    const serviceId = servicesData[0].uuid
    const characteristicId = characteristicsData[0].uuid
    uni.readBLECharacteristicValue({
      // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
      deviceId,
      // 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
      serviceId,
      // 这里的 characteristicId 需要在 getBLEDeviceCharacteristics 接口中获取
      characteristicId,
      success: res => {
        console.log('读取设备数据值成功')
        notifyBLECharacteristicValueChange()
      },
      fail(e) {
        console.log('读取设备数据值失败，错误码：' + e.code)
      },
    })
    onBLECharacteristicValueChange()
  }
  // 监听低功耗蓝牙设备的特征值变化事件。必须先启用 notifyBLECharacteristicValueChange 接口才能接收到设备推送的 notification。
  const onBLECharacteristicValueChange = () => {
    // 必须在这里的回调才能获取
    uni.onBLECharacteristicValueChange(characteristic => {
      console.log('监听低功耗蓝牙设备的特征值变化事件成功')
    })
  }

  // 订阅操作成功后需要设备主动更新特征值的 value，才会触发 uni.onBLECharacteristicValueChange 回调。

  const notifyBLECharacteristicValueChange = () => {
    const deviceId = equipment[0].deviceId
    const serviceId = servicesData[0].uuid
    const characteristicId = characteristicsData[0].uuid
    const notify = characteristicsData[0].properties.notify
    uni.notifyBLECharacteristicValueChange({
      state: true, // 启用 notify 功能
      // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
      deviceId,
      // 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
      serviceId,
      // 这里的 characteristicId 需要在 getBLEDeviceCharacteristics 接口中获取
      characteristicId,
      success(res) {
        resolve(res)
      },
    })
  }
  // 	断开蓝牙模块
  const closeBluetoothAdapter = OBJECT => {
    uni.closeBluetoothAdapter({
      success: res => {
        console.log('断开蓝牙模块成功')
        resolve(res)
        toast('断开蓝牙模块')
      },
    })
  }
  return {
    showMaskType,
    maskShow,
    searchLoad,
    list,
    equipment,
    allStatus,
    connected,
    servicesData,
    characteristicsData,
    valueChangeData,
    newDeviceLoad,
    isStop,
    moveHandle,
    maskclose,
    openBluetoothAdapter,
    getBluetoothAdapterState,
    startBluetoothDevicesDiscovery,
    onBluetoothDeviceFound,
    stopBluetoothDevicesDiscovery,
    getBluetoothDevices,
    createBLEConnection,
    closeBLEConnection,
    getBLEDeviceServices,
    getBLEDeviceCharacteristics,
    onBLEConnectionStateChange,
    readBLECharacteristicValue,
    onBLECharacteristicValueChange,
    notifyBLECharacteristicValueChange,
    closeBluetoothAdapter,
  }
}
