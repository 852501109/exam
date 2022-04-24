<template>
    <button class="sendSmsBtn" :class="disabled?'dissendSmsBtn':''" type="button" v-on:click="run" :disabled="disabled || time > 0">{{ text }}</button>
</template>


<script setup>
	import {ref, computed, toRefs} from 'vue'
	const props = defineProps({
	  second: {
	      type: Number,
	      default: 60
	  },
	  cellPhone: {
	      type: null,
	      default: ''
	  },
	  smsType: {
	      type: null,
	      default: ''
	  }
	})
	const time = ref(0)
	const disabled = ref(false)
	const emit = defineEmits(['run'])
	const run = () => {
		emit('run')
	}
	const setDisabled = val => {
		disabled.value = val
	}
	const getCode = () => {
		time.value = props.second
		timer()
	}
	const timer = () => {
		if(time.value > 0) {
			time.value --
			setTimeout(timer, 1000)
		} else {
			disabled.value = false
		}
	}
	const text = computed(() => {
		return time.value > 0 ? time.value + `s 后重获取` : `发送验证码`
	})
	defineExpose({
	  // 声明方法
	  start () {
	    getCode()
	  }
	})
</script>

<style lang="scss" scoped>
    .sendSmsBtn{
        position: absolute;
        top: -15rpx;
        right: 7rpx;
        height: 60rpx;
        line-height: 60rpx;
        border-radius: 6rpx;
		font-size: 13rpx;
        border: 1rpx solid #000000;
        padding: 0 6rpx;
        color: #444;
        display: inline-block;
        width: 198rpx;
        background: #fff;
    }
   
</style>