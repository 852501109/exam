<template>
	<view class="health">
		<view class="status_bar">
		    <!-- 这里是状态栏 -->
		</view>
		<uni-nav-bar class="nav" title="健康评估" @clickLeft="back()"  height="40rpx" background-color="white" color="black">
			<view slot="left" style="color: #A2A4B9;font-size:26upx;font-weight:400;">
				<i class="iconfont icon-jiantou"></i>
			</view>
		</uni-nav-bar>
		<view class="content">
			<view class="top">
				<canvas style="width: 200upx; margin: 0 auto; height: 200upx;" canvas-id="canvasArcbar1" id="canvasArcbar1" class="charts3"></canvas>
				<view class="notice">
					您患心脑血管疾病的的风险为：
				</view>
				<view class="fxText">
					{{fx}}
				</view>
			</view>
			<view class="bottom">
				<view class="jy_title">指导建议：</view>
				<view class="jy_text">
					根据营养成分和内含物质对人体的不同功能，下边的建议对身体有较大的益处： 
				</view>
				<view class="ys_title">饮食</view>
				<view class="ys_text">
					１．在饮食上，尽量保持低盐低脂肪的饮食结构，尽量吃的清淡一点儿，平时饮食上要少放盐，少放油，在水果方面尽量多吃一些青菜水果，不要吸烟，不要饮酒。蔬菜中所含的酶不仅远远超过其他含酶食物，而且它还含有可防止骨质疏松的钙质和造血的铁元素以及有益于孕妇的叶酸。 
				</view>
				<view class="ys_title">生活习惯</view>
				<view class="ys_text">
					1．一定要在医生的指导下，按时服用降压药物，控制血压保持在稳定的状态内，同时要适当的运动增强体质，但是一定要避免剧烈的运动，保持充足的睡眠。
				</view>
			</view>
			<view class="btn">
				<view class="back" @tap="back()">返回</view>
			</view>			
		</view>
	</view>
</template>

<script>
	import uCharts from '@/components/u-charts/u-charts.js';
	var _self;
	var canvaArcbar1;
	var canvaRing=null;
	export default {
		data() {
			return {
				// 进度条相关
				cWidth3:'100',//圆弧进度图
				cHeight3:'100',//圆弧进度图
				arcbarWidth:'8',//圆弧进度图，进度条宽度,此设置可使各端宽度一致
				pixelRatio:1,
				fx:'中风险',
				Arcbar1:{
					series:[
						{
						 color:"#ff7200",
						 data:0.45,
						 index:0,
						 legendShape:"circle",
						 name:"",
						 pointShape:"circle",
						 show:true,
						 type:"arcbar"
						}
					]
					
				},
			};
		},
		created() {
			
		},
		methods:{
			back(){
				uni.navigateBack({
					delta:1
				})
			},
			showArcbar(canvasId,chartData){
				const _self = this
				canvaArcbar1=new uCharts({
					$this:_self,
					canvasId: canvasId,
					type: 'arcbar',
					fontSize:11,
					legend:{show:false},
					background:'#FFFFFF',
					pixelRatio:_self.pixelRatio,
					series: chartData.series,
					animation: true,
					width: _self.cWidth3*_self.pixelRatio,
					height: _self.cHeight3*_self.pixelRatio,
					dataLabel: true,
					title: {
						name: Math.round(chartData.series[0].data*100)+'分',//这里我自动计算了，您可以直接给任意字符串
						color: chartData.series[0].color,
						fontSize: 16*_self.pixelRatio
					},
					subtitle: {
						name: chartData.series[0].name,//这里您可以直接给任意字符串
						color: '#666666',
						fontSize: 14*_self.pixelRatio
					},
					extra: {
						arcbar:{
							type:'circle',//整圆类型进度条图
							width: _self.arcbarWidth*_self.pixelRatio,//圆弧的宽度
							startAngle:0.5//整圆类型只需配置起始角度即可
						}
					}
				});						
			}
		},
		onLoad() {
			this.showArcbar("canvasArcbar1",this.Arcbar1);
		},
		
	}
</script>

<style lang="scss">
	$color: #35A8FF;
	/*占位导航栏样式*/
	.status_bar {
	      height: var(--status-bar-height);
	      width: 100%;
		  background-color: rgb(53, 168, 255);
	 }
	page{
		background-color: white;
	}
	.iconfont{
		color: black;
	}
	.health{
		.top{
			margin-top: 20upx;
			.notice{
				margin-top: 30upx;
				font-size:24upx;
				font-weight:400;
				line-height:36upx;
				color:rgba(0,2,52,1);
				text-align: center;
			}
			.fxText{
				margin-top: 20upx;
				font-size:56upx;
				font-weight:400;
				line-height:78upx;
				color:#ff7200;
				text-align: center;
			}
		}
		.bottom{
			padding: 30upx 32upx;
			.jy_title{
				font-size:34upx;
				font-weight:bold;
				line-height:48upx;
				color:$color;
			}
			.jy_text{
				margin-top: 30upx;
				font-size:24upx;
				font-weight:400;
				line-height:36upx;
				color:rgba(0,2,52,1);
			}
			.ys_title{
				margin-top: 30upx;
				width:96upx;
				height:34upx;
				padding: 2upx;
				background:$color;
				border-radius:10upx;
				font-size: 22upx;
				color: white;
				text-align: center;
				line-height: 34upx;
			}
			.ys_text{
				margin-top: 30upx;
				font-size:24upx;
				font-weight:400;
				line-height:36upx;
				color:rgba(0,2,52,1);
			}
		}
		.btn{
			padding: 0 20upx;
			.back{
				font-size:30upx;
				font-weight:bold;
				line-height:88upx;
				height:88upx;
				color: white;
				text-align: center;
				background:$color;
				border-radius:10upx;
			}
		}
		
	}

</style>
