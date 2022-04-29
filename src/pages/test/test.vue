<template>
  <view class="content">
    <uni-section title="组件说明" type="line">
      <uni-collapse v-model="accordionVal" accordion @change="change">
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
          <button @click="initSqlite">sqlite</button>
        </uni-collapse-item>
        <uni-collapse-item title="todo">
          <button @click="customClickHandle({id:1})">todo</button>
        </uni-collapse-item>
      </uni-collapse>
    </uni-section>
  </view>
</template>

<script setup lang="ts">
     import { GlobalStore } from '@/store/modules/global'
     import { onBeforeMount, onMounted, nextTick, ref, reactive } from 'vue'
     import child from '@/components/childTest.vue'
     import childTwo from '@/components/childTwoTest.vue'
     import childThree from '@/components/childThreeTest.vue'
     import childFour from '@/components/childFourTest.vue'
     import usePoint from "@/hook/usePoint"
     import $request from '@/utils/request/index'
     import { provide } from "vue"
     import $mySqlite from '@/utils/sqlit/mySqlite.js'
     provide("provideName", "陈文权")
     onBeforeMount(() => {
       console.log('onBeforeMount生命周期')
     })
     onMounted(() => {
       console.log('onMounted生命周期')
       console.log($request)
       $mySqlite.openComDB('chenwenquan',res => {
    	    console.log(res)
       })
    //删除通信表
       $mySqlite.deleteTable("ruiming",res => {
    	    console.log(res)
       })
   //创建通信表
      $mySqlite.createChat("ruiming",res => {
    	    console.log(res)
      })
   //获取所有表
      $mySqlite.getAllTable(res => {
    	    console.log(res)
      })
    })
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
     const childRef = ref<InstanceType<typeof childThree>>()
     const clickHandle = () => {
       store.setXXX(store.a = store.a + 1)
     }
  // todo看这 这里是数据交互:存储
  const customClickHandle = val => {
    store.setSqlite(store.globalSqlite = val)
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
      $mySqlite.insertMsg("ruiming",msg,res => {
   	  console.log(res)
      })
     }
     // nextTick
     nextTick(() => {
       // 获取子组件name
       console.log(childRef.value.name)
       // 执行子组件方法
       childRef.value.changeName()
     })
</script>

<style lang="scss">
   view {
    width: 100%;
    text-align: left;
    margin-top: 50rpx;
    font-size: 40rpx;
    color: $uni-color-primary;
     button {
      font-size: 25rpx;
      background: $uni-color-primary;
      color: #fff;
     }
  h3 {
  	font-size: 35rpx;
  }
   }
   .content {
     display: flex;
     flex-direction: column;
     align-items: center;
     justify-content: center;
   }

   .title {
     margin: 30px;
   }

   .logo {
     height: 200rpx;
     width: 200rpx;
     margin-top: 200rpx;
     margin-left: auto;
     margin-right: auto;
     margin-bottom: 50rpx;
   }

   .text-area {
     display: flex;
     justify-content: center;
   }

   .title {
     font-size: 36rpx;
     color: #8f8f94;
   }
</style>
ss
