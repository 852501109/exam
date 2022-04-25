<template>
	<view>
		<button @click="start">开启蓝牙</button>
		<button @click="init">初始化蓝牙</button>
		<button @click="startBTSearch">启动蓝牙搜索</button>
		<button @click="stopBTSearch">停止蓝牙搜索</button>
		<button>搜索设备（根据设备号/蓝牙名称）</button>
		<!-- <button>找到设备，开启链接监听</button> -->
		<button>连接（依据设备号进行连接）</button>
		<button>获取设备服务值（连接成功后）</button>
		<button>查询特征值（依据返回的服务值）</button>
		<button>开启服务订阅</button>
		<!-- 	<button>开启监听服务（检测数据返回值）</button> -->
		<button>发送具体操作命令</button>
	</view>
</template>
<script setup>
	import {ref, reactive} from 'vue'
	const KY_UNI = uni.requireNativePlugin('KunYuBluetooth')
	/* 开启蓝牙 */
	const start = () => {
		KY_UNI.openBluetoothAdapter = ( (res) => {
			console.log(`成功:${res.code}--${res.message}`)
		}, (res) => {
			console.log(`失败:${res.code}--${res.message}`)
		})
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
</script>

<style>
</style>
