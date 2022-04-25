<!--  -->
<template>
  <view>
    <radio-group v-if="false" class="top" @change="radioChange">
      <label v-for="item in devices" :key="item.code" class="radio">
        <radio :value="item.code" :checked="item.code === current" />
        <text>{{item.chinese}}</text>
      </label>
    </radio-group>
    <!-- <Omron-U32K
      v-if="current === 'omron'"
      @setPressure="setPressure"
      @deviceWorking="setDeviceWorking"
    ></Omron-U32K> -->
    <Maibobo-RBP9804
      v-if="current === 'maibobo'"
      @setPressure="setPressure"
      @deviceWorking="setDeviceWorking"
    ></Maibobo-RBP9804>
  </view>
</template>

<script setup>
  import { getCurrentInstance,reactive,ref,toRefs,onBeforeMount,onMounted} from 'vue'
  import OmronU32K from "./OMRON-U32K"
  import MaiboboRBP9804 from "./MAIBOBO-RBP9804"
  import { pressureDevice } from '@/common/config.js'
  const devices = reactive([])
  const current = ref("maibobo")
  const deviceConfig = ref(uni.getStorageSync('device'))
  onBeforeMount(() => {
  	if (!deviceConfig.value) {
  		uni.showModal({
  			title: "错误",
  			content: "请在【我的-->智能设备】页面中配置设备型号",
  			showCancel: false
  		})
  	} else {
  		current.value = deviceConfig.value.pressure
  	}
  })
  const radioChange = res => {
    current.value = res.target.value
  }
  const emit = defineEmits(['setPressure', 'deviceWorking'])
  const setPressure = res => {
    emit("setPressure", res)
  }
  const setDeviceWorking = res => {
    emit("deviceWorking", res)
  }
</script>
<style scoped lang="scss">
  .top {
    	margin-bottom: 20rpx;
    }

    .radio {
    	margin-right: 20rpx;
    }
</style>
