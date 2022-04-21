<template>
	<view class="content">
		<view class="card">
			<view class="ypName">
				<view class="title">药品名称</view>
				<view class="ypInput">
					<input class="input" placeholder="请填写" type="text" value="" /><i class="iconfont icon-maikefeng" @tap="voiceInputStart()"></i>
				</view>
			</view>
			<view class="ypUse">
				<view class="ypuseitem">
					<view class="yp-l">
						<view class="title">
							<span class="dot">*</span><view class="title">用法</view>
						</view>
						<view class="dwBox">
							<input type="text" value="" /><span class="dw">次</span>
						</view>
					</view>
					<view class="yp-r">
						<view class="title">
							<span class="dot">*</span><view class="title">用法周期</view>
						</view>
						<picker class="picker" @change="bindPickerChange($event,'yf')" :value="yfZqIndex" :range="Yfarray">
							<view class="dwBox">
								<view class="plac" v-html="yfZqIndex?Yfarray[yfZqIndex]:'请选择'"></view>
								<i class="iconfont icon-to"></i>
							</view>
						</picker>
					</view>
				</view>
				<view class="ypuseitem">
					<view class="yp-l">
						<view class="title">
							<span class="dot">*</span><view class="title">用量</view>
						</view>
						<view class="dwBox">
							<input type="text" value="" /><span class="dw">剂量</span>
						</view>
					</view>
					<view class="yp-r">
						<view class="title">
							<span class="dot">*</span><view class="title">用量规格</view>
						</view>
						<picker class="picker" @change="bindPickerChange($event,'yldw')" :value="ylggIndex" :range="ylggList">
							<view class="dwBox">
								<view class="plac" v-html="ylggIndex?ylggList[ylggIndex]:'请选择'"></view>
								<i class="iconfont icon-to"></i>
							</view>
						</picker>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { voiceInput } from '@/h5PlusApi/plus.js'
	export default {
		data() {
			return {
				ypm:'',
				Yfarray:['日','小时','2日','3日','周','月','季度','年'],
				yfZqIndex:null,
				ylggList:['片','粒','mg','g','袋','丸','个','包','盒','u','ml'],
				ylggIndex:null,
			};
		},
		methods:{
			voiceInputStart(){
				voiceInput(res => {
					if (res){
						this.ypm = res
					}
				})
			},
		}
	}
</script>

<style lang="scss">
	@mixin border {
		border-radius: 8rpx;
		padding: 10rpx 8rpx;
		border: 2px solid rgb(53, 168, 255);
	}
	.content{
		padding: 30rpx 32rpx;
		.card{
			box-sizing: border-box;
			width:100%;
			height:470rpx;
			background:rgba(255,255,255,1);
			border-radius:10rpx;
			padding: 30rpx;
			.ypName{
				.title{
					font-size:30rpx;
					font-weight: bold;
					line-height:30rpx;
					color:#000234;
					opacity:1;
				}
				.ypInput{
					@include border;
					margin-top: 10rpx;
					height: 62rpx;
					display: flex;
					align-items: center;
					.input{
						height: 62rpx;
						flex: 1;
					}
					.iconfont{
						color: #A2A4B9;
					}
				}
			}
			.ypUse{
				.ypuseitem{
					margin-top: 26rpx;
					display: flex;
					justify-content: space-between;
					.yp-l,.yp-r{
						width: 240rpx;
						height: 104rpx;
					}
					.title{
						display: inline-block;
						font-size:22rpx;
						font-weight:400;
						color:rgba(112,112,132,1);
						.dot{
							color: red;
						}
					}
					.dwBox{
						@include border;
						height: 62rpx;
						line-height: 62rpx;
						display: flex;
						align-items: center;
						input{
							flex: 1;
						}
						.dw{
							font-size:20rpx;
							font-weight:400;
							line-height:28rpx;
							color:rgba(162,164,185,1);
						}
						.plac{
							font-size:30rpx;
							font-weight:400;
							color:rgba(162,164,185,1);
							flex: 1;
						}
						.icon-to{
							color: #A2A4B9;
						}
						
					}
				}
			}
		}
		.gyqd{
			box-sizing: border-box;
			margin-top: 30rpx;
			padding: 0 30rpx;
			width:100%;
			height:102rpx;
			background:rgba(255,255,255,1);
			border-radius:10rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.title{
				font-size: 30rpx;
				font-weight:bold;
				line-height:102rpx;
				color:rgba(0,2,52,1);
			}
			.swiper-fun{
				width:76rpx;
				height:42rpx;
				background:rgba(216,224,238,1);
				border-radius:42rpx;
				position: relative;
				&::after{
					content: '';
					display: block;
					width:34rpx;
					height:34rpx;
					position: absolute;
					top: 50%;
					left: 2rpx;
					margin-top: -17rpx;
					border-radius: 50%;
					background:rgba(255,255,255,1);
				}
			}
			.active{
				width:76rpx;
				height:42rpx;
				background:#35A8FF;
				border-radius:42rpx;
				position: relative;
				&::after{
					content: '';
					display: block;
					width:34rpx;
					height:34rpx;
					position: absolute;
					top: 50%;
					right: 2rpx;
					margin-top: -17rpx;
					border-radius: 50%;
					background:rgba(255,255,255,1);
				}
			}
		}
	}
</style>
