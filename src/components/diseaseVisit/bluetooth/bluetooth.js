import { enableBAdapter } from './native-bluetooth.js'
import kyble from './ble-proxy.js'
import { ab2hex } from '@/common/tool.js'

const platform = uni.getSystemInfoSync().platform

let holder = {}
if (platform === 'ios') {
  holder = uni
} else {
  holder = kyble
}

//搜索蓝牙设备30秒后提示失败
const DEVICE_SEARCH_TIMEOUT = 30 * 1000
//获取蓝牙Service列表10秒后提示失败
const GET_SERVICE_TIMEOUT = 10 * 1000
//蓝牙写入信息10秒后提示失败
const WRITE_BLE_TIMEOUT = 10 * 1000
//获取开启蓝牙发现服务10秒后提示失败
const DEVICE_DISCOVERY_TIMEOUT = 10 * 1000
export default {
  mounted() {
    this.closeBluetoothAdapter()
  },
  beforeDestroy() {
    console.log('Leaving')
    a.insert('', '')
    this.handleLeavePage()
  },
  methods: {
    //向蓝牙设备发送命令的通用函数
    makeOrderToDevice(order) {
      console.log('order:' + order)
      if (!this.isBluetoothNotified) {
        console.log('not isBluetoothNotified')
        this.notifyBLECharacteristicValue().then(() => {
          return this.writeBLECharacteristicValue(order)
        })
      } else {
        return this.writeBLECharacteristicValue(order)
      }
    },
    //开启蓝牙适配器
    openBluetoothAdapter() {
      return new Promise((resolve, reject) => {
        if (this.isBluetoothAdpatorOn) {
        }
        holder.openBluetoothAdapter({
          success: res => {
            console.log('初始化蓝牙成功')
            this.isBluetoothAdpatorOn = true
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
    },
    startBluetoothDeviceDiscovery(cb) {
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
          options.services = [this.primaryUUID]
        }
        holder.startBluetoothDevicesDiscovery(options)
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
    },
    /**
     * 停止搜索蓝牙设备
     */
    stopBluetoothDevicesDiscovery() {
      console.log('开始停止寻找蓝牙设备')
      return new Promise((resolve, reject) => {
        holder.stopBluetoothDevicesDiscovery({
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
    },
    /**
     * 发现外围设备
     */
    onBluetoothDeviceFound() {
      console.log('监听寻找新设备')
      return new Promise((resolve, reject) => {
        const device_timeout = setTimeout(() => {
          reject({
            err_msg: '30秒内无法找到指定设备',
            err_obj: null,
          })
        }, DEVICE_SEARCH_TIMEOUT)
        holder.onBluetoothDeviceFound(res => {
          let find = false,
            deviceNameBegin = []
          const device_name = res.devices[0].localName || res.devices[0].name
          if (typeof this.deviceNameBegin === 'string') {
            deviceNameBegin = [this.deviceNameBegin]
          } else {
            deviceNameBegin = this.deviceNameBegin
          }
          deviceNameBegin.forEach(device => {
            if (device_name.toLowerCase().startsWith(device.toLowerCase())) {
              find = true
            }
          })
          if (find) {
            this.deviceId = res.devices[0].deviceId
            console.log('查找到了蓝牙设备：设备deviceId：' + this.deviceId + ' name:' + device_name)
            //在这准备连接设备
            clearTimeout(device_timeout)
            resolve(res)
          }
        })
      })
    },
    /**
     * 连接设备
     */
    createBLEConnection() {
      //设备deviceId
      const deviceId = this.deviceId
      return new Promise((resolve, reject) => {
        holder.createBLEConnection({
          // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
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
    },
    /**
     * 获取设备的服务ID
     */
    getBLEDeviceServices() {
      const deviceId = this.deviceId
      let serviceList = []
      //延迟1.5s获取设备的services
      return new Promise((resolve, reject) => {
        console.log('获取设备的services')
        const actualGetDevice = cb => {
          return holder.getBLEDeviceServices({
            // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
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
                if (service.uuid.indexOf(this.primaryUUID) > -1) {
                  this.serviceId = service.uuid
                  console.log('设备的serviceId： ' + this.serviceId)
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
    },
    /**
     * 获取指定服务的特征值
     */
    getBLEDeviceCharacteristics() {
      const deviceId = this.deviceId
      const serviceId = this.serviceId
      let characteristicsList = []
      return new Promise((resolve, reject) => {
        holder.getBLEDeviceCharacteristics({
          // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
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
              if (characteristic.uuid.indexOf(this.BLECharValue.write) != -1) {
                this.characteristicId.writeId = characteristic.uuid
                console.log('设备的特征值写入ID： ' + this.characteristicId.writeId)
              }
              if (characteristic.uuid.indexOf(this.BLECharValue.notify) != -1) {
                this.characteristicId.notifyId = characteristic.uuid
                if (characteristic.properties.notify) {
                  this.characteristicId.notify = true
                }
                if (characteristic.properties.indicate) {
                  this.characteristicId.indicate = true
                }
                console.log('设备的特征值notifyID： ' + this.characteristicId.notifyId)
                console.log(
                  '设备的特征值监听方式：notify【' +
                    this.characteristicId.notify +
                    '】indicate【' +
                    this.characteristicId.indicate +
                    '】'
                )
              }
              if (this.characteristicId.writeId != '' && this.characteristicId.notifyId != '') {
                resolve(res)
              }
            }
            if (!this.characteristicId.notifyId || !this.characteristicId.writeId) {
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
    },
    onBLECharacteristicValueChange(cb) {
      if (platform === 'ios') {
        return holder.onBLECharacteristicValueChange(res => {
          const data = res
          data.value = ab2hex(res.value)
          cb(data)
        })
      }
      return holder.onBLECharacteristicValueChange(cb)
    },
    /**
     * 开启订阅特征值
     */
    notifyBLECharacteristicValue(param) {
      const self = this
      const deviceId = this.deviceId
      const serviceId = this.serviceId
      const characteristicId = this.characteristicId.notifyId
      let protocol
      if (param && param.protocl) {
        protocol = param.protocl
      } else if (this.characteristicId.notify) {
        protocol = 'notify'
      } else if (this.characteristicId.indicate) {
        protocol = 'indicate'
      }
      return new Promise((resolve, reject) => {
        holder.notifyBLECharacteristicValueChange({
          protocol: protocol,
          // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
          deviceId,
          // 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
          serviceId,
          // 这里的 characteristicId 需要在 getBLEDeviceCharacteristics 接口中获取
          characteristicId,
          state: true,
          success(res) {
            console.log('notifyBLECharacteristicValueChange success:' + JSON.stringify(res))
            self.isBluetoothNotified = true
            resolve(res)
          },
          fail(res) {
            console.log('notifyBLECharacteristicValueChange failed:' + res.errMsg)
            that.isBluetoothNotified = false
            reject({
              err_msg: '开启蓝牙连接监听失败',
              err_obj: res,
            })
          },
        })
      })
    },
    /**
     * 写入控制命令
     * writeCode 写入的控制命令
     */
    writeBLECharacteristicValue(writeCode) {
      const deviceId = this.deviceId
      const serviceId = this.serviceId
      const characteristicId = this.characteristicId.writeId
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

      const writeData = platform === 'ios' ? buffer : writeCode

      const realWriteBLE = cb => {
        holder.writeBLECharacteristicValue({
          // 这里的 deviceId 需要在 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
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
    },
    /**
     * 监听低功耗蓝牙连接状态的改变事件。包括开发者主动连接或断开连接，设备丢失，连接异常断开等等
     */
    onBLEConnectionStateChange(cb) {
      holder.onBLEConnectionStateChange(res => {
        console.log(`蓝牙连接状态 -------------------------->` + JSON.stringify(res))
        if (!res.connected) {
          console.log('状态监听：蓝牙连接已断开')
          if (cb) {
            cb(res)
          }
        }
      })
    },
    /**
     * 关闭蓝牙适配器
     */
    closeBluetoothAdapter() {
      return new Promise((resolve, reject) => {
        holder.closeBluetoothAdapter({
          success: res => {
            this.isBluetoothAdpatorOn = false
            console.log('关闭蓝牙适配器成功')
            resolve(res)
          },
          fail: res => {
            console.log('关闭蓝牙适配器失败')
            reject(res)
          },
        })
      })
    },
    /**
     * 断开蓝牙连接
     */
    closeBLEConnection() {
      return new Promise((resolve, reject) => {
        holder.closeBLEConnection({
          deviceId: this.deviceId,
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
    },
    /**
     * 设备是否已经连接
     */
    isDeviceConnected() {
      return new Promise((resolve, reject) => {
        holder.getConnectedBluetoothDevices({
          success: res => {
            console.log('getConnectedBluetoothDevices: ' + res)
            const connectListLength = res.devices.length
            let found = -1
            if (connectListLength > 0) {
              for (let i = 0; i < connectListLength; i++) {
                if (res.devices[i].deviceId === this.deviceId) {
                  found = i
                  break
                }
              }
              if (found !== -1) {
                resolve(found)
              } else {
                this.closeBluetoothAdapter().then(res => {
                  this.openBluetoothAdapter().then(res => {
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
    },
    /**
     * 设备启动连接的基本流程
     * cb1: 设备保持链接状态时执行
     * cb2：重新链接上设备时执行
     */
    startProcess(cb1, cb2) {
      enableBAdapter().then(() => {
        this.openBluetoothAdapter()
          .then(() => {
            this.onBLEConnectionStateChange(res => this.handleBLEConnectionClose(res))
            this.isDeviceConnected()
              .then(() => {
                console.log('found')
                if (this.deviceState && this.DEVICE_STATE) {
                  this.deviceState = this.DEVICE_STATE.CONNECTED
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
    },
  },
}
