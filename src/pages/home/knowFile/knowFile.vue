<template>
	<view class="content">
		<div class="title">{{name}}</div>
		<div v-html="content"></div>
	</view>
</template>

<script>
	import { getArticleById } from '@/request/user.js'
	export default {
		data() {
			return {
				name:'',
				content:''
			};
		},
		onLoad: function(option) {
			getArticleById({id:option.id}).then(res=>{
				console.log('file',res)
				console.log('file1',res.data.article)
				if(res.ret){
					this.name = res.data.article.name
					this.content = res.data.article.content
					//console.log('file',res.data)
				}
			})
		},
	}
</script>

<style lang="scss">
	.content{
		padding: 20rpx;
		line-height: 46rpx;
		h2{
			margin: 20rpx 0;
		}
		p{
			margin-bottom: 10rpx;
		}
		img{
			margin: 70rpx 0;
			border-radius: 14rpx;
			width: 100%;
			height: auto;
		}
		.title{
			font-size: 32rpx;
			font-weight: 600;
		}
	}
</style>
