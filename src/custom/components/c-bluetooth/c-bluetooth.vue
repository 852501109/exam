<template>
  <view>
    <button type="primary" :disabled="allStatus[0]" @click="openBluetoothAdapter">
      初始化蓝牙模块
    </button>
    <button
      type="primary"
      :loading="searchLoad.value"
      :disabled="allStatus[1]"
      @click="startBluetoothDevicesDiscovery"
    >
      开始搜索蓝牙设备
    </button>
    <button type="primary" @click="stopBluetoothDevicesDiscovery(false)">停止搜索蓝牙设备</button>
    <button
      type="primary"
      :loading="newDeviceLoad.value"
      :disabled="allStatus[3]"
      @click="queryDevices"
    >
      选择设备
    </button>
    <button type="primary" :disabled="allStatus[4]" @click="createBLEConnection">
      连接蓝牙设备
    </button>
    <button type="primary" :disabled="allStatus[5]" @click="getBLEDeviceServices">
      选择设备服务
    </button>
    <view v-if="servicesData.length > 0">已选服务uuid：{{ servicesData[0].uuid }}</view>
    <button type="primary" :disabled="allStatus[6]" @click="getBLEDeviceCharacteristics">
      获取服务的特征值
    </button>
    <view v-if="characteristicsData.length > 0">
      <view class="uni-list_name">uuid:{{ characteristicsData[0].uuid }}</view>
      <view class="uni-list_item">
        是否支持 read 操作:{{ characteristicsData[0].properties.read }}
      </view>
      <view class="uni-list_item">
        是否支持 write 操作:{{ characteristicsData[0].properties.write }}
      </view>
      <view class="uni-list_item">
        是否支持 notify 操作:{{ characteristicsData[0].properties.notify }}
      </view>
      <view class="uni-list_item">
        是否支持 indicate 操作:{{ characteristicsData[0].properties.indicate }}
      </view>
      <button type="primary" :disabled="allStatus[9]" @click="closeBLEConnection">
        断开蓝牙设备
      </button>
      <button type="primary" :disabled="allStatus[10]" @click="closeBluetoothAdapter">
        关闭蓝牙模块
      </button>
    </view>
    <view v-if="equipment.length > 0">
      {{
		(connected.value ? '已连接设备' : '已选择设备') +
			' : ' +
			equipment[0].name +
			' (' +
			equipment[0].deviceId +
			')'
      }}
    </view>
    <view
      v-if="maskShow.value"
      class="uni-mask"
      @touchmove.stop.prevent="moveHandle"
      @click="maskclose"
    >
      <scroll-view
        class="uni-scroll_box"
        scroll-y
        @touchmove.stop.prevent="moveHandle"
        @click.stop="moveHandle"
      >
        <view class="uni-title">
          已经发现{{ list.length }}{{ showMaskType === 'device' ? '台设备' : '个服务' }}:
        </view>
        <view
          v-for="(item, index) in list"
          :key="index"
          class="uni-list-box"
          @click="tapQuery(item)"
        >
          <view v-if="showMaskType === 'device'">
            <view class="uni-list_name">{{ item.name || item.localName }}</view>
            <view class="uni-list_item">信号强度:{{ item.RSSI }}dBm</view>
            <view class="uni-list_item">UUID:{{ item.deviceId }}</view>
            <!-- <view class="list-item" v-if="showMaskType === 'device'">
								Service数量:{{ item.advertisServiceUUIDs.length }}
							</view> -->
          </view>
          <view v-if="showMaskType === 'service'">
            <view class="uni-list_item" style="line-height:2.2;">
              UUID: {{ item.uuid }}
              <text v-if="showMaskType === 'service'">
                {{ item.isPrimary ? '（主服务）' : '' }}
              </text>
            </view>
          </view>
          <view v-if="showMaskType === 'characteristics'">
            <view class="uni-list_name">uuid:{{ item.uuid }}</view>
            <view class="uni-list_item">是否支持 read 操作:{{ item.properties.read }}</view>
            <view class="uni-list_item">是否支持 write 操作:{{ item.properties.write }}</view>
            <view class="uni-list_item">是否支持 notify 操作:{{ item.properties.notify }}</view>
            <view class="uni-list_item">是否支持 indicate 操作:{{ item.properties.indicate }}</view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup>
  import { onBeforeMount, onMounted, nextTick, ref, reactive } from 'vue'
  import bluetooth from "@/hook/bluetooth"
  const {
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
  } = bluetooth()
</script>

<style lang="scss" scoped>
  .uni-title {
  	/* width: 100%; */
  	/* height: 80rpx; */
  	text-align: center;
  }

  .uni-mask {
  	position: fixed;
  	top: 0;
  	left: 0;
  	bottom: 0;
  	display: flex;
  	align-items: center;
  	width: 100%;
  	background: rgba(0, 0, 0, 0.6);
  	padding: 0 30rpx;
  	box-sizing: border-box;
  }

  .uni-scroll_box {
  	height: 70%;
  	background: #fff;
  	border-radius: 20rpx;
  }
  .uni-list-box {
  	margin: 0 20rpx;
  	padding: 15rpx 0;
  	border-bottom: 1px #f5f5f5 solid;
  	box-sizing: border-box;
  }
  .uni-list:last-child {
  	border: none;
  }
  .uni-list_name {
  	font-size: 30rpx;
  	color: #333;
  }
  .uni-list_item {
  	font-size: 24rpx;
  	color: #555;
  	line-height: 1.5;
  }

  .uni-success_box {
  	position: absolute;
  	left: 0;
  	bottom: 0;
  	min-height: 100rpx;
  	width: 100%;
  	background: #fff;
  	box-sizing: border-box;
  	border-top: 1px #eee solid;
  }
  .uni-success_sub {
  	/* width: 100%%; */
  	height: 100rpx;
  	display: flex;
  	justify-content: space-between;
  	align-items: center;
  	padding: 0 30rpx;
  }
  .uni-close_button {
  	padding: 0 20rpx;
  	height: 60rpx;
  	line-height: 60rpx;
  	background: #ce3c39;
  	color: #ffffff;
  	border-radius: 10rpx;
  }
  .uni-success_content {
  	height: 600rpx;
  	margin: 30rpx;
  	margin-top: 0;
  	border: 1px #eee solid;
  	padding: 30rpx;
  }
  .uni-content_list {
  	padding-bottom: 10rpx;
  	border-bottom: 1px #f5f5f5 solid;
  }
  .uni-tips {
  	text-align: center;
  	font-size: 24rpx;
  	color: #666;
  }
</style>
