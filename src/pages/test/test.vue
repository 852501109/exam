<template>
  <view class="content">
    <uni-collapse accordion @change="change">
      <uni-collapse-item title="父子组件通信示例1">
        <child :name="state.name" @updateName="updateName" />
      </uni-collapse-item>
      <uni-collapse-item title="父子组件通信示例2">
        <childTwo v-model="stateTwo.name" v-model:age="stateTwo.age" @updateName="updateName" />
      </uni-collapse-item>
      <uni-collapse-item title="父子组件通信示例3">
        <childTwo v-model="stateTwo.name" v-model:age="stateTwo.age" @updateName="updateName" />
      </uni-collapse-item>
      <uni-collapse-item title="nextTick演示">
        <childThree ref="childRef" />
      </uni-collapse-item>
      <uni-collapse-item title="当前求和">
        <h2>当前求和:{{ sum }}</h2>
        <button @click="changeNum">点我加一</button>
      </uni-collapse-item>
      <uni-collapse-item title="hook使用示例">
        <h2 @click="savePonint">当前鼠标点击坐标为:x:{{ point.x }},y:{{ point.y }}</h2>
      </uni-collapse-item>
      <uni-collapse-item title="测试provide和inject方式传参">
        <childFour />
      </uni-collapse-item>
      <uni-collapse-item title="uni-ui图标">
        <uni-icons type="contact" size="30"></uni-icons>
      </uni-collapse-item>
      <uni-collapse-item title="sqlite">
        <!-- 初始化: 1.本地建空表(如果有表就删除重建);2.调借口拿到数据;3.数据插入表中  -->
        <button @click="initAll">初始化</button>
        <button @click="deleteAll">删除全部db(需要重新初始化)</button>
        <!-- <button @click="openDB">打开4个数据库</button> -->
        <button @click="getAllTable">得到全部表</button>
        <!-- <button @click="initCjdModule">初始化-采集端模块</button> -->

        <button @click="openWs">连接websocket</button>
        <button @click="closeWs">断连ws</button>
        <button @click="sendToWs">发送消息到websocket</button>
      </uni-collapse-item>
      <uni-collapse-item title="todo">
        <button @click="customClickHandle({id:1})">todo</button>
      </uni-collapse-item>
    </uni-collapse>
  </view>
</template>

<script setup lang="ts">
  import {
  	GlobalStore
  } from '@/store/modules/global'
  import {
  	onBeforeMount,
  	onMounted,
  	nextTick,
  	ref,
  	reactive
  } from 'vue'
  import child from '@/components/childTest.vue'
  import childTwo from '@/components/childTwoTest.vue'
  import childThree from '@/components/childThreeTest.vue'
  import childFour from '@/components/childFourTest.vue'
  import usePoint from "@/hook/usePoint"
  import $request from '@/utils/request/index'
  import {
  	provide
  } from "vue"
  import $mySqlite from '@/utils/sqlit/mySqlite.js'
  // 数据接口 lzp
  import $initService from '@/data/service/initService.js'
  import $cjdUserService from '@/data/service/cjdUserService.js'
  import $sqliteUtils from '@/data/utils/sqliteUtils.js'
  import $ws from '@/data/utils/ws.js'
  provide("provideName", "陈文权")
  onBeforeMount(() => {
  	console.log('onBeforeMount生命周期')
  })
  // onMounted(() => {
  // 	console.log('onMounted生命周期')
  // 	console.log($request)
  // 	$mySqlite.openComDB('chenwenquan', res => {
  // 		console.log(res)
  // 	})
  // 	//删除通信表
  // 	$mySqlite.deleteTable("ruiming", res => {
  // 		console.log(res)
  // 	})
  // 	//创建通信表
  // 	$mySqlite.createChat("ruiming", res => {
  // 		console.log(res)
  // 	})
  // 	//获取所有表
  // 	$mySqlite.getAllTable(res => {
  // 		console.log(res)
  // 	})
  // })
  const sum = ref(0)
  const point = usePoint()
  const state = reactive({
  	name: 'zhangsan'
  })
  const stateTwo = reactive({
  	name: 'Jerry',
  	age: 20
  })
  const store = GlobalStore()
  const childRef = ref < InstanceType < typeof childThree >> ()
  const clickHandle = () => {
  	store.setXXX(store.a + 1)
  }
  // todo看这 这里是数据交互:存储
  const customClickHandle = val => {
  	store.setSqlite(val)
  }
  const updateName = val => {
  	state.name = state.name === 'zhangsan' ? 'chenwenquan' : 'zhangsan'
  }
  const changeNum = () => {
  	sum.value++
  }
  const msg = reactive({
  	content: '__ruiming__',
  	type: '1',
  	time: '1',
  	isMe: '1'
  })
  const initSqlite = () => {
  	// uni.getSavedFileList({
  	//   success: function (res) {
  	//     console.log(res.fileList)
  	//   }
  	// })
  	$mySqlite.insertMsg("ruiming", msg, res => {
  		console.log(res)
  	})
  }
  const initAll = () => {
  	$initService.initAll(res => {
  		console.log(res)
  	})
  }
  // 删除全部表(重新初始化)
  const deleteAll = () => {
  	$initService.deleteAll(res => {
  		console.log(res)
  	})
  }
  // 打开4数据库
  const openDB = () => {
  	/**
  	 * 创建4个数据库
  	 * peis_config
  	 * peis_base
  	 * peis_data
  	 * peis_history
  	 */
  	$sqliteUtils.openDB("peis_base", res => {
  		console.log(res)
  	})
  	$sqliteUtils.openDB("peis_data", res => {
  		console.log(res)
  	})
  	$sqliteUtils.openDB("peis_config", res => {
  		console.log(res)
  	})
  	$sqliteUtils.openDB("peis_history", res => {
  		console.log(res)
  	})
  }

  // 根据库名字得到表
  const getAllTable = () => {
  	$sqliteUtils.getAllTable("peis_base", res => {
  		console.log(res)
  	})
  	$sqliteUtils.getAllTable("peis_data", res => {
  		console.log(res)
  	})
  	$sqliteUtils.getAllTable("peis_config", res => {
  		console.log(res)
  	})
  	$sqliteUtils.getAllTable("peis_history", res => {
  		console.log(res)
  	})
  }

  // 初始化-采集端用户
  const initCjdUserinfo = () => {
  	$cjdUserService.initCjdUserinfo(res => {
  		console.log(res)
  	})

  }

  // 连接websocket
  const openWs = () => {
  	$ws.openWs(res => {
  		console.log(res)
  	})
  }
  // 关闭websocket
  const closeWs = () => {
  	$ws.closeWs(res => {
  		console.log(res)
  	})
  }

  // 发送数据到websocket
  const sendToWs = () => {
  	$ws.sendToWs('{"username":"lzp","msg":"app发送的数据"}',res => {
  		console.log(res)
  	})
  }

  // nextTick
  nextTick(() => {
  	// 获取子组件name
  	// 执行子组件方法
  	childRef.value.changeName()
  })
</script>

<style lang="scss"></style>
