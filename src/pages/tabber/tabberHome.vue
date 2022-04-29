<!--
* @description
* @fileName bluetooth.vue
* @author chenwenquan
* @date 2022/04/18 12:09:00
!-->
<template>
  <view>
    <view>&nbsp;&nbsp;&nbsp;设备示例</view>
    <uni-section title="组件说明" type="line">
      <uni-collapse v-model="accordionVal" accordion @change="change">
        <uni-collapse-item title="脉搏波">
          <view class="content">
            <c-maibobo />
          </view>
        </uni-collapse-item>
        <uni-collapse-item title="欧姆龙">
          <view class="content">
            <c-omron />
          </view>
        </uni-collapse-item>
        <uni-collapse-item title="websocket">
          <view class="content">
            <c-websocket />
          </view>
        </uni-collapse-item>
      </uni-collapse>
    </uni-section>
  </view>
</template>
<script setup></script>
<style scoped lang="scss">
  view {
  	margin-top: 100rpx;
  }
</style>
