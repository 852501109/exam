const ky_ble_native = uni.requireNativePlugin('KunYuBluetooth');

const ky_ble = {}

ky_ble.openBluetoothAdapter = function(param) {
	console.log("openBluetoothAdapter")
	const pass = []
	if (param) {
		pass.push(param.success)
		pass.push(param.fail)
	}
	return ky_ble_native.openBluetoothAdapter(...pass)
}

ky_ble.startBluetoothDevicesDiscovery = function(param) {
	console.log("startBluetoothDevicesDiscovery")
	const pass = []
	if (param) {
		pass.push(param.success)
		pass.push(param.fail)
	}
	delete param.success
	delete param.fail
	delete param.complete
	if (!param.services) {
		param.services = []
	}
	if (!param.allowDuplicatesKey) {
		param.allowDuplicatesKey = false
	}
	if (!param.interval) {
		param.interval = "0"
	}
	return ky_ble_native.startBluetoothDevicesDiscovery(param, ...pass)
}

ky_ble.onBluetoothDeviceFound = function(param) {
	ky_ble_native.onBluetoothDeviceFound(param)
	return {
		"message": "ok",
		"code": 0
	}
}

ky_ble.stopBluetoothDevicesDiscovery = function(param) {
	const pass = []
	if (param) {
		pass.push(param.success)
		pass.push(param.fail)
	}
	return ky_ble_native.stopBluetoothDevicesDiscovery(...pass)
}
ky_ble.onBluetoothAdapterStateChange = function(param) {
	ky_ble_native.onBluetoothAdapterStateChange(param)
	return {
		"message": "ok",
		"code": 0
	}
}
ky_ble.getConnectedBluetoothDevices = function(param) {
	const pass = []
	if (param) {
		pass.push(param.success)
		pass.push(param.fail)
	}
	return ky_ble_native.getConnectedBluetoothDevices(...pass)
}
ky_ble.getBluetoothAdapterState = function(param) {
	const pass = []
	if (param) {
		pass.push(param.success)
		pass.push(param.fail)
	}
	return ky_ble_native.getConnectedBluetoothDevices(...pass)
}
ky_ble.closeBluetoothAdapter = function(param) {
	const pass = []
	if (param) {
		pass.push(param.success)
		pass.push(param.fail)
	}
	return ky_ble_native.closeBluetoothAdapter(...pass)
}
ky_ble.setBLEMTU = function(param) {
	const pass = []
	if (param) {
		pass.push(param.success)
		pass.push(param.fail)
	}
	delete param.success
	delete param.fail
	delete param.complete
	if (!param.deviceId) {
		return {
			message: "error",
			code: "1"
		}
	}
	if (!param.mtu) {
		return {
			message: "error",
			code: "1"
		}
	}
	return ky_ble_native.setBLEMTU(param, ...pass)
}
ky_ble.writeBLECharacteristicValue = function(param) {
	const pass = []
	if (param) {
		pass.push(param.success)
		pass.push(param.fail)
	}
	delete param.success
	delete param.fail
	delete param.complete
	if (!param.deviceId) {
		return {
			message: "error",
			code: "1"
		}
	}
	if (!param.serviceId) {
		return {
			message: "error",
			code: "1"
		}
	}
	if (!param.characteristicId) {
		return {
			message: "error",
			code: "1"
		}
	}
	if (!param.value) {
		return {
			message: "error",
			code: "1"
		}
	}
	return ky_ble_native.writeBLECharacteristicValue(param, ...pass)
}
ky_ble.readBLECharacteristicValue = function(param) {
	const pass = []
	if (param) {
		pass.push(param.success)
		pass.push(param.fail)
	}
	delete param.success
	delete param.fail
	delete param.complete
	if (!param.deviceId) {
		return {
			message: "error",
			code: "1"
		}
	}
	if (!param.serviceId) {
		return {
			message: "error",
			code: "1"
		}
	}
	if (!param.characteristicId) {
		return {
			message: "error",
			code: "1"
		}
	}
	return ky_ble_native.readBLECharacteristicValue(param, ...pass)
}
ky_ble.onBLEConnectionStateChange = function(param) {
	ky_ble_native.onBLEConnectionStateChange(param)
	return {
		"message": "ok",
		"code": 0
	}
}
ky_ble.onBLECharacteristicValueChange = function(param) {
	ky_ble_native.onBLECharacteristicValueChange(param)
	return {
		"message": "ok",
		"code": 0
	}
}
ky_ble.notifyBLECharacteristicValueChange = function(param) {
	const pass = []
	if (param) {
		pass.push(param.success)
		pass.push(param.fail)
	}
	delete param.success
	delete param.fail
	delete param.complete
	if (!param.deviceId) {
		return {
			message: "error",
			code: "1"
		}
	}
	if (!param.serviceId) {
		return {
			message: "error",
			code: "1"
		}
	}
	if (!param.characteristicId) {
		return {
			message: "error",
			code: "1"
		}
	}
	// true: notify
	// false: indicate
	if (param.state) {
		delete param.state
	}
	if (!param.protocol) {
		param.protocol = true
	} else if (param.protocol === "indicate") {
		param.protocol = false
	} else {
		param.protocol = true
	}
	return ky_ble_native.notifyBLECharacteristicValueChange(param, ...pass)
}
ky_ble.getBLEDeviceServices = function(param) {
	const pass = []
	if (param) {
		pass.push(param.success)
		pass.push(param.fail)
	}
	delete param.success
	delete param.fail
	delete param.complete
	if (!param.deviceId) {
		return {
			message: "error",
			code: "1"
		}
	}
	return ky_ble_native.getBLEDeviceServices(param, ...pass)
}
ky_ble.getBLEDeviceRSSI = function(param) {
	const pass = []
	if (param) {
		pass.push(param.success)
		pass.push(param.fail)
	}
	delete param.success
	delete param.fail
	delete param.complete
	if (!param.deviceId) {
		return {
			message: "error",
			code: "1"
		}
	}
	return ky_ble_native.getBLEDeviceRSSI(param, ...pass)
}
ky_ble.getBLEDeviceCharacteristics = function(param) {
	const pass = []
	if (param) {
		pass.push(param.success)
		pass.push(param.fail)
	}
	delete param.success
	delete param.fail
	delete param.complete
	if (!param.deviceId) {
		return {
			message: "error",
			code: "1"
		}
	}
	if (!param.serviceId) {
		return {
			message: "error",
			code: "1"
		}
	}
	return ky_ble_native.getBLEDeviceCharacteristics(param, ...pass)
}
ky_ble.createBLEConnection = function(param) {
	const pass = []
	if (param) {
		pass.push(param.success)
		pass.push(param.fail)
	}
	delete param.success
	delete param.fail
	delete param.complete
	if (!param.deviceId) {
		return {
			message: "error",
			code: "1"
		}
	}
	if (!param.timeout) {
		param.timeout = null
	}
	return ky_ble_native.createBLEConnection(param, ...pass)
}
ky_ble.closeBLEConnection = function(param) {
	const pass = []
	if (param) {
		pass.push(param.success)
		pass.push(param.fail)
	}
	delete param.success
	delete param.fail
	delete param.complete
	if (!param.deviceId) {
		return {
			message: "error",
			code: "1"
		}
	}
	return ky_ble_native.closeBLEConnection(param, ...pass)
}
export default ky_ble
