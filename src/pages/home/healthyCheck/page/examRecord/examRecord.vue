<template>
	<view class="exam_record">
		<view class="Card" v-for="(item,index) in dataList" :key="index" @tap="openExamReport()">
			<view class="left">
				<image :src="item.imgUrl" mode=""></image>
			</view>		
			<view class="center">
				<view class="tjrq">体检日期：{{item.tjrq}}</view>
				<view class="tjjg">体检机构：{{item.tijg}}</view>
				<view class="is_create" :class="item.isSj?'green':'red'" v-text="item.isSj?'已生成慢病随访':'未生成慢病随访'"></view>
			</view>
			<view class="right">
				<view class="mark" v-show="!item.normal">异常</view>
			</view>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				dataList:[
					{imgUrl:'../../../../../static/image/head.jpg',tjrq:'2019.11.30',tijg:'李沧区卫生室',isSj:true,normal:false},
					{imgUrl:'../../../../../static/image/head.jpg',tjrq:'2019.11.30',tijg:'李沧区卫生室',isSj:true,normal:false},
					{imgUrl:'../../../../../static/image/head.jpg',tjrq:'2019.11.30',tijg:'李沧区卫生室',isSj:true,normal:true},
					{imgUrl:'../../../../../static/image/head.jpg',tjrq:'2019.11.30',tijg:'李沧区卫生室',isSj:false,normal:false}
				]
				
			}
		},
		methods: {
			openExamReport(){
				uni.navigateTo({
					url:'../examReport/examReport'
				})
			}
		}
	}
</script>
<style lang="scss">
	page{
		background-color: #f6f6f6;
		padding: 30upx 20upx;
	}
	.exam_record{
		.Card{
			background-color: #FFFFFF;
			border-radius: 10upx;
			width: 100%;
			height: 168upx;
			margin-bottom: 12upx;
			display: flex;
			.left{
				margin: 20upx;
				image{
					width:135upx;
					height:128upx;
					border-radius:10upx;
				}
			}
			.center{
				margin-top: 20upx;
				font-size:24upx;
				flex-grow:1;
				.green{
					color:rgba(36, 191, 0, 1)!important;					
				}
				.red{
					color:rgba(255, 0, 0, 1)!important;			
				}
				.tjrq{
					font-size:28upx;
					font-weight:500;
					color:rgba(51,51,51,1);
					line-height:40upx;
				}
				.tjjg{
					margin-top: 30upx;
					font-size:24upx;
					font-weight:400;
					color:rgba(153,153,153,1);
				}
				
			}
			.right{	
				.mark{
					margin-top: 50%;
					margin-right: 40upx;
					right: 60upx;
					width:72upx;
					height:40upx;
					background:rgba(255,0,0,1);
					border-radius:20upx;
					color: #FFFFFF;
					font-size:20upx;
					text-align: center;
					line-height: 40upx;
				}
				
			}
			
			
		}
	}
</style>
