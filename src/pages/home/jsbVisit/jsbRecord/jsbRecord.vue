<template>
	<view class="sfRecord">
		<view class="status_bar">
			<!-- 这里是状态栏 -->
		</view>
		<uni-nav-bar :title="person.name + '的重精随访记录'" :isBack="true" height="40rpx" background-color="#35A8FF" color="#FFFFFF"></uni-nav-bar>
		<view class="nav">
			<view class="nav-head">
				<view class="personInfor">
					<view class="phoneBox" @tap="changePho">
						<text class="num">{{person.tel}}</text>
						<i class="iconfont icon-weiqianzi"></i>
					</view>
				</view>
			</view>
			<view class="nav-call">
				<view class="callBox" @tap="call">
					<i class="iconfont icon-dianhua"></i>
				</view>
			</view>
		</view>
		<view class="swipeMenu">
			<view class="handle">
				<view class="swipBox" :class="{oneTab: tabList.length === 1}">
					<view class="swipItem" :class="curr==item?'active':''" v-for="(item,index) in tabList" :key="item+'a'" @click="curr=item">{{item}}</view>
				</view>
			</view>
			<view class="icon">
				<view class="sanjiaoBox" v-for="(item,index) in tabList" :key="index" :class="curr==item?'active':''">
					<view class="sanjiao"></view>
				</view>
			</view>
		</view>
		<view class="content">
			<self-year-choose @yearChange="yearChange" :currTeam="currTeam" :yearList="teamList"></self-year-choose>
			<view class="card-box">
				<view>
					<view class="notice" v-show="zjSf.length==0">暂无记录！</view>
					<view class="card" v-for="(item,index) in zjSf" :key="index" @tap="gxySfHandle(item.id)">
						<view class="imgArea">
							<img class="img" v-show="item.imgUrl" :src="$IMGURL + item.imgUrl" alt="" />
						</view>
						<view class="other">
							<view class="data">
								<text class="dw">随访结论:{{item.conclusion}}</text>
							</view>
							<view class="status">
								<view class="shStatus">
									<text class="iconfont" :class="getStatus(item.upStatus)">
										<text class="text" >上传</text>
									</text>
									<text class="iconfont" :class="getStatus(item.shStatus)">
										<text class="text" >审核</text>
									</text>
								</view>
								<view class="time">{{item.date}}</view>
							</view>
						</view>
						
					</view>
				</view>
			</view>
			<view class="card-box">
			</view>
			<!-- 新增随访 -->
			<text @click="addSf()" class="iconfont icon-add-fill"></text>
		</view>
	</view>
</template>

<script>
	import {
		getZjMbInfo
	} from '@/request/jmsf.js'
	import {
		GetNowTime
	} from '@/common/tool.js'
	import {
		dial
	} from '@/h5PlusApi/plus.js'
	import selfYearChoose from '@/components/self-year-choose/index.vue'
	export default {
		components: {
			selfYearChoose
		},
		onShow() {
			this.getZjMbInfo()
		},
		data() {
			return {
				tabList: ['重精'],
				curr: '',
				person: {
					// 编辑的标识
					ehrId: '',
					name: '',
					tel: '',
					idCard: '',
					url: '',
					orgId: '',
					//糖尿病管理卡id
					diabetesId: '',
					//高血压管理卡id
					psychopathId: '',
				},
				teamList: [

				],
				currTeam: {
					name: '',
					id: null
				},
				zjSf: [],
			};
		},
		created() {
			// 年份处理
			var nowYear = GetNowTime('.').substr(0, 4).toString();
			var yearlist = [nowYear - 2, nowYear - 1, nowYear]
			this.currTeam.name = nowYear;
			this.currTeam.id = nowYear;
			yearlist.forEach((item, index) => {
				item = item.toString()
				this.teamList.push({
					name: item,
					id: item
				})
			})
		},
		onLoad: function(option) {
			console.log('随访列表传参传参', option)
			this.person.ehrId = option.ehrId
			this.person.url = option.url
			this.person.idCard = option.idCard
			this.person.orgId = option.orgId
			this.person.orgName = option.orgName
			this.person.psychopathId = option.psychopathId
			this.curr = this.tabList[0]
			this.getZjMbInfo()
		},
		methods: {
			// 高血压随访查看
			gxySfHandle(id) {
				var url
				var qureyData = JSON.parse(JSON.stringify(this.person));
				qureyData.id = id		
				url = '../newJsbVisit/newJsbVisit' + '?data=' + encodeURIComponent(JSON.stringify(qureyData))
				uni.navigateTo({
					url: url
				})
			},
			addSf() {
				var url
				var qureyData = JSON.parse(JSON.stringify(this.person));
				url = '../newJsbVisit/newJsbVisit' + '?data=' + encodeURIComponent(JSON.stringify(qureyData))
				uni.navigateTo({
					url: url
				})
			},
			changePho() {
				uni.navigateTo({
					url: '/pages/home/diseaseVisit/changePhone/changePhone' + '?ehrId=' + this.person.ehrId + '&tel=' + this.person.tel
				})
			},
			// 年份改变
			yearChange() {
				this.getZjMbInfo();
			},
			// 获取随访记录
			getZjMbInfo() {
				getZjMbInfo({
					ehrId: this.person.ehrId,
					year: this.currTeam.id
				}).then(res => {
					console.log('精神记录获取的信息', res)
					if (res.ret) {
						this.person.ehrId = res.data.ehrId
						this.person.name = res.data.name
						this.person.tel = res.data.tel
						this.zjSf = res.data.zjSf
						console.log('精神记录获取的信息', this.zjSf)
					}
				}, err => {})
			},
			call() {
				dial(this.person.tel, true)
			}
		}
	}
</script>

<style lang="scss">
	/*占位导航栏样式*/
	.status_bar {
		height: var(--status-bar-height);
		width: 100%;
		background-color: rgb(53, 168, 255);
	}

	page {
		background-color: #f6f6f6;

		.sfRecord {
			.nav {
				background-color: rgb(53, 168, 255);
				width: 100%;
				display: flex;
				padding-top: 30upx;
				box-sizing: border-box;
				align-items: center;

				.nav-head {
					flex: 1;
					display: flex;

					.head {
						width: 80upx;
						height: 80upx;
						border-radius: 50%;
						margin-left: 50upx;
					}

					.personInfor {
						width: 205upx;
						margin-left: 30upx;

						.name {
							margin-bottom: 6upx;
							font-size: 30upx;
							line-height: 36upx;
							font-weight: bold;
							line-height: 42upx;
							color: rgba(255, 255, 255, 1);
						}

						.phoneBox {
							box-sizing: border-box;
							padding: 0 8upx;
							width: 260upx;
							background: rgba(22, 133, 217, 1);
							opacity: 1;
							border-radius: 333px;
							font-size: 30upx;
							font-weight: 400;
							line-height: 48upx;
							color: rgba(245, 249, 255, 1);
							margin-top: 20rpx;

							.num {
								padding-right: 8upx;
								border-right: 1px solid #35A8FF;
							}

							.iconfont {
								margin-left: 13upx;
								font-size: 28upx;
							}
						}
					}
				}

				.nav-call {
					.callBox {
						margin-top: 10upx;
						margin-right: 32upx;
						width: 60upx;
						height: 60upx;
						border-radius: 50%;
						text-align: center;
						line-height: 60upx;
						color: #35A8FF;
						background-color: #fff;
					}
				}
			}

			.swipeMenu {
				width: 100%;
				height: 173upx;
				display: flex;
				flex-direction: column;

				.handle {
					flex: 1;
					background-color: #35A8FF;
					display: flex;
					justify-content: center;
					align-items: center;

					.swipBox {
						width: 80%;
						height: 88upx;
						background: rgba(22, 133, 217, 1);
						border-radius: 66px;
						display: flex;
						box-sizing: border-box;

						.swipItem {
							width: 50%;
							text-align: center;
							font-size: 24upx;
							font-weight: 400;
							line-height: 88upx;
							color: rgba(255, 255, 255, 1);
						}

						&.oneTab {
							width: 40%;

							.swipItem {
								width: 100%;
							}
						}

						.active {
							width: 50%;
							height: 72upx;
							background: rgba(255, 255, 255, 1);
							box-shadow: 0px 3px 6px rgba(53, 168, 255, 0.16);
							border-radius: 45upx;
							font-size: 30upx;
							font-weight: bold;
							line-height: 72upx;
							color: rgba(53, 168, 255, 1);
							margin: 8upx;
						}
					}
				}

				.icon {
					height: 15upx;
					background-color: #F5F9FF;
					display: flex;

					.sanjiaoBox {
						width: 50%;
					}

					.active {
						margin: 0 auto;
						width: 0;
						height: 0;
						border-left: 15upx solid transparent;
						border-right: 15upx solid transparent;
						border-top: 15upx solid #35A8FF;
					}
				}
			}

			.content {
				padding: 45upx 32upx;

				.card-box {
					.card {
						position: relative;
						box-sizing: border-box;
						margin-top: 30upx;
						background-color: #fff;
						width: 100%;
						height: 176upx;
						border-radius: 10px;
						padding: 20upx;
						display: flex;

						.imgArea {
							width: 181upx;
							height: 136upx;
							background-image: url('/static/image/err.png');
							background-size: cover;
							background-repeat: no-repeat;
							background-position: center;
							border-radius: 10upx;
							overflow: hidden;

							.img {
								width: 181upx;
								height: 136upx;
							}
						}

						.other {
							padding-left: 30upx;
							flex: 1;
							display: flex;
							flex-direction: column;

							.data {
								line-height: 56upx;
								font-size: 40upx;
								font-weight: bold;
								color: rgba(255, 114, 0, 1);

								.dw {
									line-height: 56upx;
									margin-left: 6upx;
									font-size: 24rpx;
									color: rgba(162, 164, 185, 1);
								}
							}

							.status {
								display: flex;
								justify-content: space-between;
								flex: 1;

								.shStatus {
									color: rgba(162, 164, 185, 1);

									.iconfont {
										margin-right: 20upx;
										font-size: 20upx;

										.text {
											margin-left: 5upx;
											font-size: 24rpx;
										}

										.acttext {
											color: #00D39F;
										}
									}
									.red{
										color: #FF7200;
									}
									.actIcon {
										color: #00D39F;
									}
								}

								.time {
									margin-top: 27upx;
									font-size: 24rpx;
									font-weight: 400;
									color: rgba(162, 164, 185, 1);
								}
							}
						}

						.conclusion {
							position: absolute;
							top: 0;
							right: 0;
							border-radius: 0px 10px 0px 30px;
							background-color: #FF7200;
							text-align: center;
							line-height: 30upx;
							width: 135upx;
							height: 30upx;
							font-size: 24rpx;
							color: rgba(255, 255, 255, 1);
						}

						.okCss {
							background-color: #00D39F;
						}
					}

					.notice {
						color: #C0C0C0;
						font-size: 28rpx;
						text-align: center;
					}
				}
			}

			.icon-add-fill {
				position: fixed;
				bottom: 40upx;
				left: 50%;
				margin-left: -60upx;
				font-size: 120upx;
				color: #24BF00;
			}
		}
	}
</style>
