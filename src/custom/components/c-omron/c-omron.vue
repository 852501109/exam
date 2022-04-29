<template>
	<view>
		<view>蓝牙流程统计</view>
		<text class="tips">【欧姆龙】完成血压测量后，点击按钮</text>
		<button @tap="init">初始化蓝牙</button>
		<button @tap="openConectWatch">开启连接监听</button>
		<button @tap="startBTSearch">启动蓝牙搜索</button>
		<button @tap="initSearchWatch">开启搜索监听</button>
		<button @tap="stopBTSearch">停止蓝牙搜索</button>
		<button @tap="conectBT">开启连接蓝牙</button>
		<button @tap="getServiceVal">获取设备服务值（连接成功后）</button>
		<button @tap="getCharacter">获取服务特征值</button>
		<button @tap="setProto">设置服务协议</button>
		<button @tap="openProtoWatch">开启服务协议通讯监听</button>
		<button @tap="writeData">写数据</button>
		<button @tap="closeBT">关闭蓝牙适配器</button>
		<text  class="tips">总体流程</text>
		<button @tap="onece" :disabled="startButtonDisable">连接血压计</button>
		<view class="">
		  <text>收缩压: {{deviceResult.sys_value}}</text>
		</view>
		<view class="">
		  <text>舒张压: {{deviceResult.dia_value}}</text>
		</view>
		<view class="">
		  <text>脉搏: {{deviceResult.pul_value}}</text>
		</view>
	</view>
</template>
<script setup>
	import omronHook from "./omronHook"
	const {
		// 按钮禁用状态
		stopButtonDisable,
		startButtonDisable,
		// 是否显示结果
		showFinalResult,
		// 血压结果
		deviceResult, 
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
		// 重置禁用值
		resetPageState,
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
	} = omronHook()
</script>

<style>
</style>
