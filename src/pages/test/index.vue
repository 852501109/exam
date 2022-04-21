<template>
  <view class="content">
    ‘
    <view>
      <h3>示例1</h3>
      <button @click="clickHandle">pinia</button>
      <view class="title">pinia触发dispatch{{ store.a }}</view>
    </view>
    <view>
      <h3>示例2</h3>
      <child :name="state.name" />
    </view>
    <view>
      <h3>示例3</h3>
      <childTwo v-model="stateTwo.name" v-model:age="stateTwo.age" @updateName="updateName" />
    </view>
    <view>
      <h3>示例4</h3>
      <button>nextTick演示</button>
      <childThree ref="childRef" />
    </view>
    <view>
      <h3>示例5</h3>
      <h2>当前求和:{{ sum }}</h2>
      <button @click="changeNum">点我加一</button>
      <hr />
      <h2 @click="savePonint">当前鼠标点击坐标为:x:{{ point.x }},y:{{ point.y }}</h2>
    </view>
    <view>
      <h3>示例6:测试provide和inject方式传参</h3>
      <childFour />
    </view>
    <view>
      <h3>示例7:uni-ui图标</h3>
      <uni-icons type="contact" size="30"></uni-icons>
    </view>
    <view>
      <h3>示例8:蓝牙设备</h3>
      <c-bluetooth />
    </view>
    <view>
      <h3>示例9:sqlite</h3>
      <button @click="initSqlite">sqlite</button>
    </view>
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
    const updateName = () => {
      state.name = state.name === 'chenwenquan' ? 'zhangsan' : 'chenwenquan'
    }
    const changeNum = () => {
     sum.value++
    }
    const initSqlite = () => {
     $mySqlite.insertMsg("ruiming",'插入数据',res => {
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
      background: $uni-color-primary;;
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
