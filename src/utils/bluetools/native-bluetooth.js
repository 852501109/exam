// 调用android原生方法提示用户开启蓝牙
const enableBAdapter = () => {
  return new Promise((resolve, reject) => {
    const platform = uni.getSystemInfoSync().platform
    if (platform === 'android') {
      main = plus.android.runtimeMainActivity()
      BluetoothAdapter = plus.android.importClass('android.bluetooth.BluetoothAdapter')
      BAdapter = BluetoothAdapter.getDefaultAdapter()
      if (!BAdapter.isEnabled()) {
        BAdapter.enable()
      }
      resolve()
    } else if (platform === 'ios') {
      resolve()
    }
  })
}

module.exports = {
  enableBAdapter: enableBAdapter,
}
