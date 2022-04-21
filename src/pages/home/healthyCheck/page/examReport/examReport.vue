<template>
	<view class="examReport">
		<view class="status_bar"></view>
		<uni-nav-bar :isBack="true" title="体检报告" height="40rpx" background-color="#35A8FF" color="#FFFFFF">
			<view slot="right" @click="goPg()">健康评估</view>
		</uni-nav-bar>
		<view class="nav">
			<view class="nav-head">
				<image class="head" src="../../../../../static/image/head.jpg" mode=""></image>
				<view class="personInfor">
					<view class="name">乔布斯</view>
					<view class="timeBox">
						<i class="iconfont icon-Iconmaterial-date-range"></i>
						<text class="num">2019/06/12</text>
					</view>
				</view>	
			</view>
			<view class="nav-create">
				<view class="callBox" @tap="call">
					<text class="num">生成随访记录</text>
					<i class="iconfont icon-to"></i>
				</view>
			</view>
		</view>
		<view class="swipeMenu">
			<view class="handle">
				<view class="swipBox">
					<view class="swipItem" :class="curr==index?'active':''" v-for="(item,index) in tabList" :key="index" @click="changeCur(index)">
						{{item}}
						<template v-if="index==1">
							<text class="dot">2</text>
						</template>
					</view>
				</view>
			</view>
			<view class="icon">
				<view class="sanjiaoBox" v-for="(item,index) in tabList" :key="index" :class="curr==index?'active':''">
					<view class="sanjiao"></view>
				</view>
			</view>
		</view>
		<view class="content">
			<!-- 全部指标 -->
			<view class="all" v-show="curr==0">
				<selfFoldCard
				iconfont="icon-yibanjiancha1"
				title="一般检查"
				>
					<view slot="fold">
						<view class="jbxx-card">
							<view class="card-item">
								<view class="left">身高：cm</view>
								<view class="right">172</view>
							</view>
							<view class="card-item">
								<view class="left">体重：kg</view>
								<view class="right">82</view>
							</view>
							<view class="bmi">BMI:kg/cm</view>
							<self-slide-range
							:range = "range"
							:value = "value"
							>	
							</self-slide-range>
						</view>
						<view class="jbxx-card">
							<view class="bmi">收缩压:mmhg</view>
							<self-slide-range
							:range = "ssyRange"
							:value = "ssyValue"
							>	
							</self-slide-range>
							<view class="bmi">舒张压:mmhg</view>
							<self-slide-range
							:range = "szyRange"
							:value = "szyValue"
							>	
							</self-slide-range>
						</view>
						<view class="jbxx-card">
							<view class="doctor-item">
								<view class="doctor">主检医生</view>
							</view>	
						</view>					
					</view>				
				</selfFoldCard>
				<!-- 血常规 -->
				<selfFoldCard
				iconfont="icon-xiechanggui"
				title="血常规"
				:show="true"
				>
					<view slot="fold">
						<view class="xcg">
							<view class="xcg_item">
								<view class="doctor">尿糖:{{user.nt}}</view>
								<view class="doctorName">参考范围</view>
							</view>
							<view class="xcg_item">
								<view class="doctor">尿胆红素:{{user.bil}}</view>
								<view class="doctorName">参考范围</view>
							</view>
							<view class="xcg_item">
								<view class="doctor">尿胆原:{{user.uro}}</view>
								<view class="doctorName">参考范围</view>
							</view>
							<view class="xcg_item">
								<view class="doctor">尿潜血:{{user.nqx}}</view>
								<view class="doctorName">参考范围</view>
							</view>
							<view class="xcg_item">
								<view class="doctor">尿酮体:{{user.ntt}}</view>
								<view class="doctorName">参考范围</view>
							</view>
							<view class="xcg_item">
								<view class="doctor">亚硝酸盐:{{user.nit}}</view>
								<view class="doctorName">参考范围</view>
							</view>
							<view class="xcg_item">
								<view class="doctor">尿白细胞:{{user.leu}}</view>
								<view class="doctorName">参考范围</view>
							</view>
							<view class="xcg_item">
								<view class="doctor">抗坏血酸:{{user.khxs}}</view>
								<view class="doctorName">参考范围</view>
							</view>
							<view class="xcg_item">
								<view class="doctor">尿比重:{{user.nbz}}</view>
								<view class="doctorName">参考范围</view>
							</view>
							<view class="xcg_item">
								<view class="doctor">尿酸碱值:{{user.ua}}</view>
								<view class="doctorName">参考范围</view>
							</view>
						</view>
					</view>
				</selfFoldCard>
				<!-- 生化检查 -->
				<selfFoldCard
				iconfont="icon-xieshenghuajiancha"
				title="生化检查"
				>
				<view slot="fold">
					<view class="xcg">
						<view class="xcg_item">
							<view class="doctor">血清谷丙转氨酶：{{user.alt}}</view>
							<view class="doctorName">参考范围：{{user.altFw}}</view>
						</view>
						<view class="xcg_item">
							<view class="doctor">血清谷草转氨酶：{{user.ast}} <i class="iconfont icon-up2 upArrow"></i></view>
							<view class="doctorName">参考范围：{{user.astFw}}</view>
						</view>
						<view class="xcg_item">
							<view class="doctor">总胆红素：{{user.tbil}} <i class="iconfont icon-up upArrow"></i> </view>
							<view class="doctorName">参考范围：{{user.tbilFw}}</view>
						</view>
						<view class="xcg_item">
							<view class="doctor">血尿素氮：{{user.urea}} <i class="iconfont icon-up upArrow"></i> </view>
							<view class="doctorName">参考范围：{{user.ureaFw}}</view>
						</view>
						<view class="xcg_item">
							<view class="doctor">血清肌酐：{{user.crea}} <i class="iconfont icon-up upArrow"></i> </view>
							<view class="doctorName">参考范围：{{user.creaFw}}</view>
						</view>
						<view class="xcg_item">
							<view class="doctor">空腹血糖：{{user.glu}}</view>
							<view class="doctorName">参考范围：{{user.gluFw}}</view>
						</view>
						<view class="xcg_item">
							<view class="doctor">甘油三酯：{{user.tg}}</view>
							<view class="doctorName">参考范围：{{user.tgFw}}</view>
						</view>
						<view class="xcg_item">
							<view class="doctor">总胆固醇：{{user.chol}}</view>
							<view class="doctorName">参考范围：{{user.cholFw}}</view>
						</view>
						<view class="xcg_item">
							<view class="doctor">高密度脂蛋白：{{user.hdlC}}</view>
							<view class="doctorName">参考范围：{{user.hdlCFw}}</view>
						</view>
						<view class="xcg_item">
							<view class="doctor">低密度脂蛋白：{{user.ldlC}}</view>
							<view class="doctorName">参考范围：{{user.ldlCFw}}</view>
						</view>
					</view>
				</view>
				</selfFoldCard>
				<!-- 尿常规 -->
				<selfFoldCard
				iconfont="icon-dingqiniaojian"
				title="尿常规"
				>
					<view slot="fold">
						<view class="xcg">
							<view class="xcg_item">
								<view class="doctor">尿糖:{{user.nt}}</view>
								<view class="doctorName">参考范围</view>
							</view>
							<view class="xcg_item">
								<view class="doctor">尿胆红素:{{user.bil}}</view>
								<view class="doctorName">参考范围</view>
							</view>
							<view class="xcg_item">
								<view class="doctor">尿胆原:{{user.uro}}</view>
								<view class="doctorName">参考范围</view>
							</view>
							<view class="xcg_item">
								<view class="doctor">尿潜血:{{user.nqx}}</view>
								<view class="doctorName">参考范围</view>
							</view>
							<view class="xcg_item">
								<view class="doctor">尿酮体:{{user.ntt}}</view>
								<view class="doctorName">参考范围</view>
							</view>
							<view class="xcg_item">
								<view class="doctor">亚硝酸盐:{{user.nit}}</view>
								<view class="doctorName">参考范围</view>
							</view>
							<view class="xcg_item">
								<view class="doctor">尿白细胞:{{user.leu}}</view>
								<view class="doctorName">参考范围</view>
							</view>
							<view class="xcg_item">
								<view class="doctor">抗坏血酸:{{user.khxs}}</view>
								<view class="doctorName">参考范围</view>
							</view>
							<view class="xcg_item">
								<view class="doctor">尿比重:{{user.nbz}}</view>
								<view class="doctorName">参考范围</view>
							</view>
							<view class="xcg_item">
								<view class="doctor">尿酸碱值:{{user.ua}}</view>
								<view class="doctorName">参考范围</view>
							</view>
						</view>
					</view>
				</selfFoldCard>
				<!-- 心电图 -->
				<selfFoldCard
				iconfont="icon-health-ecg"
				title="心电图"
				>
					<view slot="fold">
						<view class="xdt">
							<view class="xdtImg">
								<image></image>
							</view>
							<view class="xdt_title">心电图结论：</view>
							<view class="xdt_item">
								<view class="xd_content">{{user.xdtjl}}</view>
							</view>
						</view>
						
					</view>
				</selfFoldCard>
				<!-- B超 -->
				<selfFoldCard
				iconfont="icon-Bchao"
				title="B超"
				>
					<view slot="fold">
						<view class="bc_img">
							
						</view>
						<view class="bc_jl">
							<view class="title">B超所见:</view>
							<view class="sj_text">
								
							</view>
							<view class="title">B超结论:</view>
							<view class="sj_text">
								
							</view>
						</view>
					</view>
				</selfFoldCard>
			</view>
			<view class="unusual" v-show="curr==1">
				<view class="card">
					<view class="card-title">
						<text class="iconfont icon-jinggao"></text><text class="reasonTitle">BMI偏高</text>
					</view>
					<view class="reason">
						1.体检结果显示您的体重指数偏高，建议逐步减重，维持标准
						体重。
					</view>
				</view>
			</view>
			<!-- 异常指标 -->
		</view>
		
	</view>
</template>

<script>
	import selfFoldCard from '@/components/self-fold-card/self-fold-card.vue'
	import selfSlideRange from '@/components/self-slide-range/self-slide-range.vue'
	export default {
		components:{ selfFoldCard, selfSlideRange },
		data() {
			return {
				tabList:['全部指标','异常指标'],
				curr:0,
				range:[10,30],
				value:25.35,
				ssyRange:[90,140],
				ssyValue:108,
				szyRange:[60,90],
				szyValue:66,
				user:{
					id: "",
					name: "",
					tjrq: "",
					xczUrl: "",
					zzys: "",
					exceptionNum: 7,
					ybjcExceptionNum: 2,
					xcgExceptionNum: 2,
					shjcExceptionNum: 1,
					ncgExceptionNum: 0,
					xdtExceptionNum: 1,
					bcExceptionNum: 1,
					sg: '',
					tz: 55.5,
					bmi: 25.68,
					bmiStatus: true,
					yxyg: 174,
					yxyd: 80,
					xyStatus: true,
					sgys: "齐李想",
					wbc: 6.85,
					wbcJl: "0",
					wbcFw: "3.5-9.5 10^9/L",
					rbc: 4.05,
					rbcJl: "0",
					rbcFw: "3.8-5.1 10^12/L",
					hgb: 112,
					hgbJl: "-1",
					hgbFw: "115-150 g/L",
					hct: 0.368,
					hctJl: "0",
					hctFw: "0.35-0.45 ",
					mcv: 86.36,
					mcvJl: "0",
					mcvFw: "82-100 fL",
					mch: 27.7,
					mchJl: "0",
					mchFw: "27-34 pg",
					mchc: 304,
					mchcJl: "-1",
					mchcFw: "316-354 g/L",
					rdwSd: 53.2,
					rdwSdJl: "0",
					rdwSdFw: "35-56 fL",
					rdwCv: 16,
					rdwCvJl: "0",
					rdwCvFw: "11-16 %",
					plt: 279,
					pltJl: "0",
					pltFw: "125-350 10^9/L",
					pdw: 10.1,
					pdwJl: "0",
					pdwFw: "9-17 fL",
					mpv: 9.5,
					mpvJl: "0",
					mpvFw: "9-13 fL",
					pct: 0.23,
					pctJl: "0",
					pctFw: "0.12-0.3 %",
					alt: 21,
					altJl: "0",
					altFw: "7-40 u/l",
					ast: 24,
					astJl: "0",
					astFw: "13-35 u/l",
					tbil: 5.2,
					tbilJl: "0",
					tbilFw: "5.1-28 umol/L",
					urea: 6.54,
					ureaJl: "0",
					ureaFw: "2.9-8.2 mmol/L",
					crea: 77,
					creaJl: "0",
					creaFw: "20-90 umol/L",
					glu: 5.2,
					gluJl: "0",
					gluFw: "3.89-6.1 mmol/L",
					tg: 1.82,
					tgJl: "1",
					tgFw: "0.0-1.71 mmol/L",
					chol: 4.72,
					cholJl: "0",
					cholFw: "3.35-6.2 mmol/L",
					hdlC: 1.31,
					hdlCJl: "0",
					hdlCFw: "0.83-1.96 mmol/L",
					ldlC: 2.62,
					ldlCJl: "0",
					ldlCFw: "<3.30 mmol/L",
					nt: "-",
					bil: "-",
					uro: "-",
					nqx: "-",
					ntt: "-",
					nit: "+",
					leu: "-",
					khxs: "0",
					nbz: "1.01",
					ua: null,
					uaJl: null,
					uaFw: null,
					xdtUrl: "D:/Photo/37/371326/37132601/2020/XDT/20200619/2010200619003.jpg",
					xdtyc: "交界性心律T波异常 ",
					xdtjl: "",
					bcurl1: "D:/Photo/37/371326/37132601/2020/BC/20200619/2010200619003_1.jpg",
					bcurl2: "D:/Photo/37/371326/37132601/2020/BC/20200619/2010200619003_2.jpg",
					bchaosj: "腹部：  肝脏体积尚可，被膜光滑，实质回声细密增强，分布尚均匀，后场回声衰减，肝内血管纹理尚清晰，门脉系统及肝内胆管未扩张。  胆囊大小、形态尚可，壁不厚，胆囊腔内透声好。  胰腺大小、形态、实质回声未见异常，主胰管无扩张。  脾脏厚可，回声均匀。",
					bchaoyc: "腹部：脂肪肝;胆囊未见异常;胰腺未见异常;脾脏未见异常;",
					alb: null,
					albJl: null,
					albFw: null,
					k: null,
					kJl: null,
					kFw: null,
					na: null,
					naJl: null,
					naFw: null
				},				
			};
		},
		methods:{
			back() {
				uni.navigateBack({
					delta:1
				})
			},
			changeCur(val){
				this.curr = val;
			},
			goPg(){
				uni.navigateTo({
					url:'../jktjJkpg/jktjJkpg'
				})
			}
		}
	}
</script>

<style lang="scss">
	/*占位导航栏样式*/
	page{
		background-color: #F5F9FF;
	}
	.status_bar {
	      height: var(--status-bar-height);
	      width: 100%;
		  background-color: rgb(53, 168, 255);
	 }
	.examReport{
		.nav{
			background-color: rgb(53, 168, 255);
			width: 100%;
			height: 140upx;
			display: flex;
			padding-top: 30upx;
			box-sizing: border-box;
			.nav-head{
				flex: 1;
				display: flex;
				.head{
					width: 80upx;
					height: 80upx;
					border-radius: 50%;
					margin-left: 50upx;	
				}
				.personInfor{
					width: 205upx;
					margin-left: 30upx;
					.name{
						margin-bottom: 6upx;
						font-size:30upx;
						line-height: 36upx;
						font-weight:bold;
						line-height:42upx;
						color:rgba(255,255,255,1);
					}
					.timeBox{
						.iconfont{
							font-size: 22rpx;
							margin-right: 12rpx;
						}
						font-size: 22rpx;
						color: #FFFFFF;
					}	
				}	
			}
			.nav-create{
				width:221rpx;
				height:60rpx;
				padding: 0 24rpx;
				box-sizing: border-box;
				background:rgba(255,255,255,1);
				border-radius:45rpx;
				margin-right: 32rpx;
				font-size:24rpx;
				line-height:60rpx;
				color:rgba(53,168,255,1);
				.iconfont{
					margin-right: 2rpx;
					font-size:24rpx;
				}
			}
		}
	}
	.swipeMenu{
		width: 100%;
		height: 173upx;
		display: flex;
		flex-direction: column;
		.handle{
			flex: 1;
			background-color: #35A8FF;
			display: flex;
			justify-content: center;
			align-items: center;
			.swipBox{	
				width:686upx;
				height:88upx;
				background:rgba(22,133,217,1);
				border-radius:4554px;
				display: flex;
				box-sizing: border-box;
				.swipItem{
					width: 50%;
					text-align: center;
					font-size:24upx;				
					font-weight:400;
					line-height:88upx;
					color:rgba(255,255,255,1);
					.dot{
						margin-left: 18rpx;
						background-color: #FF7200;
						font-size: 20rpx;
						color: #fff;
						padding: 3rpx 8rpx;
						box-sizing: border-box;
						border-radius: 50%;
					}
				}
				.active{
					width:50%;
					height:72upx;
					background:rgba(255,255,255,1);
					box-shadow:0px 3px 6px rgba(53,168,255,0.16);
					border-radius:45upx;
					font-size:30upx;
					font-weight:bold;
					line-height:72upx;
					color:rgba(53,168,255,1);
					margin: 8upx;
				}
			}
		}
		.icon{
			height: 15upx;
			background-color: #F5F9FF;
			display: flex;
			.sanjiaoBox{
				width:50%;
			}
			.active{
				margin: 0 auto;
				width: 0;
				height: 0;
				border-left: 15upx solid transparent;
				border-right: 15upx solid transparent;
				border-top: 15upx solid #35A8FF;
			}
		}
	}
	.content{
		padding: 15rpx 32rpx;
		.jbxx-card{
			background-color: #fff;
			border-radius: 10rpx;
			padding: 20rpx;
			margin-bottom: 20rpx;
			.card-item{
				display: flex;
				justify-content: space-between;
				margin-bottom: 20rpx;
				.left{
					font-size:26rpx;
					color:#000234;		
				}
				.right{
					font-size:30rpx;
					font-weight:bold;
					color:rgba(53,168,255,1);
				}
			}
			.doctor-item{
				.doctor{
					font-size:26rpx;
					color:rgba(0,2,52,1);
				}
			}
			.bmi{
				font-size:26rpx;
				font-weight:400;
				color:rgba(0,2,52,1);
				margin-bottom: 54rpx;
			}	
		}
		.all{
			.xcg{
				.xcg_item{
					border-radius:10upx;
					margin-top: 20upx;
					padding: 18upx;
					background-color: White;
					display: flex;
					font-size:26upx;
					justify-content: space-between;
					color:rgba(0,2,52,1);
				}
			}
			.xdt{
				.xdtImg{
					width: 100%;
					height: 500rpx;
					background-color: #fff;
					border-radius: 10rpx;
				}
				.xdt_title{
					margin: 20rpx 0;
					font-size: 30rpx;
					font-weight: 600;
					color: #000234;
				}
				.xdt_item{
					width: 100%;
					min-height: 100rpx;
					background-color: #fff;
					border-radius: 10rpx;
				}
			}
			.bc_img{
				width: 100%;
				height: 500rpx;
				background-color: #fff;
				border-radius: 10rpx;
			}
			.bc_jl{
				padding: 20rpx;
				box-sizing: border-box;
				margin-top: 20rpx;
				width: 100%;
				background-color: #fff;
				border-radius: 10rpx;
				min-height: 500rpx;
				.title{
					font-size: 30rpx;
					font-weight: 600;
					color: #000234;
				}
				.sj_text{
					min-height: 100rpx;
					text-indent: 20rpx;
					margin-top: 20rpx;
					font-size: 26rpx;
					color: #000234;
					font-weight: 400;
				}
			}
		}
		.unusual{
			.card{
				width:100%;
				height:193rpx;
				background:rgba(255,255,255,1);
				border-radius:10rpx;
				box-sizing: border-box;
				padding: 30rpx;
				.card-title{
					.iconfont{
						color: #FF7200;
					}
					.reasonTitle{
						margin-left: 20rpx;
						font-size:30rpx;
						font-weight:bold;
						color:rgba(255,114,0,1);
					}	
				}
				.reason{
					margin-top: 20rpx;
					font-size:24rpx;
					line-height:36rpx;
					color:rgba(0,2,52,1);
				}
			}
		}
	}
</style>
