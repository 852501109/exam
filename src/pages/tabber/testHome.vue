<!--
* @description
* @fileName bluetooth.vue
* @author chenwenquan
* @date 2022/04/18 12:09:00
!-->
<template>
  <view>
    <view>&nbsp;&nbsp;&nbsp;设备示例</view>
    <uni-collapse v-model="accordionVal" accordion @change="change">
      <uni-collapse-item title="脉搏波">
        <c-maibobo />
      </uni-collapse-item>
      <uni-collapse-item title="欧姆龙">
        <c-omron />
      </uni-collapse-item>
      <uni-collapse-item title="websocket">
        <c-websocket />
      </uni-collapse-item>
      <uni-collapse-item title="拍照">
        <c-photo />
      </uni-collapse-item>
      <!-- <uni-collapse-item title="身份证识别">
        <c-orc />
      </uni-collapse-item> -->
      <uni-collapse-item title="设置界面">
        <view></view>
      </uni-collapse-item>
    </uni-collapse>
    <c-orc />
  </view>
</template>
<script setup></script>
<style scoped lang="scss"></style>
