<template>
	<view class="sfRecord">
		<view class="fixed-head">
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
						<view class="swipItem" :class="curr==item?'active':''" v-for="(item,index) in tabList"
							:key="item+'a'" @click="curr=item">{{item}}</view>
					</view>
				</view>
				<view class="icon">
					<view class="sanjiaoBox" v-for="(item,index) in tabList" :key="index"
						:class="curr==item?'active':''">
						<view class="sanjiao"></view>
					</view>
				</view>
			</view>
		</view>
		<view class="content">
			<self-year-choose @yearChange="getMbInfo" :currTeam="currTeam" :yearList="teamList"></self-year-choose>
			<view class="card-box">
				<view class="carditem" :class="{'active':curr=='高血压'}">
					<view class="notice" v-if="sfRecord.length==0">暂无记录！</view>
					<uni-swipe-action :threshold="200" v-for="(item,index) in sfRecord" :key="index+'a'"
						class="swiper-item">
						<uni-swipe-action-item :right-options="options" @click="delSf(item.id)">
							<view class="card" @tap="gxySfHandle(item.id,index)">
								<view class="imgArea">
									<img class="img" v-show="item.imgUrl" :src="$IMGURL + item.imgUrl" alt="" />
								</view>
								<view class="other">
									<view class="data">
										<text>{{item.data}}</text><text class="dw">mmHg</text>
									</view>
									<text class="classFlow">随访方式:{{getfolType(item.classifyFollowUp)}}</text>
									<view class="status">
										<view class="shStatus">
											<text class="iconfont" :class="getStatus(item.upStatus)">
												<text class="text">上传</text>
											</text>
											<text class="iconfont" :class="getStatus(item.shStatus)">
												<text class="text">审核</text>
											</text>
										</view>
										<view class="time">{{item.date}}</view>
									</view>
								</view>
								<view class="conclusion" :class="item.conclusion=='满意'?'okCss': ''">{{item.conclusion}}
								</view>
							</view>
						</uni-swipe-action-item>
					</uni-swipe-action>
				</view>
				<view class="carditem" :class="{'active':curr=='糖尿病'}">
					<view class="notice" v-if="tnbList.length==0">暂无记录！</view>
					<uni-swipe-action :threshold="200" v-for="(item,index) in tnbList" :key="index" class="swiper-item">
						<uni-swipe-action-item :right-options="options" @click="delSf(item.id)">
							<view class="card" @tap="gxySfHandle(item.id,index)">
								<view class="imgArea">
									<img class="img" v-show="item.imgUrl" :src="$IMGURL + item.imgUrl" mode="" />
								</view>
								<view class="other">
									<view class="data">
										<text>{{item.data}}</text><text class="dw">mmol/L</text>
									</view>
									<text class="classFlow">随访方式:{{getfolType(item.classifyFollowUp)}}</text>
									<view class="status">
										<view class="shStatus">
											<text class="iconfont" :class="getStatus(item.upStatus)">
												<text class="text">上传</text>
											</text>
											<text class="iconfont" :class="getStatus(item.shStatus)">
												<text class="text">审核</text>
											</text>
										</view>
										<view class="time">{{item.date}}</view>
									</view>
								</view>
								<view class="conclusion" :class="item.conclusion=='满意'?'okCss': ''">{{item.conclusion}}
								</view>
							</view>
						</uni-swipe-action-item>
					</uni-swipe-action>
				</view>
			</view>
			<!-- 新增随访 -->
			<text @click="addSf()" class="iconfont icon-add-fill"></text>
		</view>
		<self-sign-pop title="提示" leftText="取消" rightText="确定" @rightHandle="okLaterHandle()" v-model="toast">
			<view class="lateTime">
				<text>该人{{sfTitle}}随访已经逾期或者即将逾期，是否进行随访？</text>
			</view>
		</self-sign-pop>
		<self-sign-pop title="提示" leftText="取消" rightText="确定" @rightHandle="okGoSign()" v-model="isSign">
			<view class="lateTime">
				<text>该人未签约，是否进行签约？</text>
			</view>
		</self-sign-pop>
	</view>
</template>

<script>
	import {
		getMbInfo,
		delHypertension,
		delDiabetes
	} from '@/request/jmsf.js'
	import {
		GetNowTime
	} from '@/common/tool.js'
	import {
		dial
	} from '@/h5PlusApi/plus.js'
	import selfYearChoose from '@/components/self-year-choose/index.vue'
	import selfSignPop from '@/components/self-sign-pop/self-sign-pop.vue'
	import recordItem from './record-item.vue'
	import startProcess from "../baiduface/baiduface-pure.js"
	export default {
		components: {
			selfYearChoose,
			selfSignPop,
		},
		onShow() {
			this.getMbInfo()
			uni.$off('SFTS')
			uni.$once("SFTS", res => {
				this.toast = true
				res.type == 'TNB' ? this.sfTitle = '糖尿病' : this.sfTitle = '高血压'
				uni.setNavigationBarTitle({
					title: res.name + '的随访记录'
				});
			})
			uni.$off('SHOWSIGN')
			uni.$once("SHOWSIGN", res => {
				console.log('触发去签约提示', res)
				this.isSign = true
				this.goSignData.type = res.type
				this.goSignData.sfId = res.sfId
			})
		},
		data() {
			return {
				alwaysTrue: true,
				delShow: true,
				delId: '',
				options: [{
					text: '删除',
					style: {
						backgroundColor: '#FE9C01',
						fontSize: '34rpx'
					}
				}],
				toast: false,
				isSign: false,
				tabList: [],
				curr: '',
				sfTitle: '',
				goSignData: {
					idCard: '',
					name: '',
					address: '',
					signId: '',
					sfId: '',
				},
				avatarURL: null,
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
					hypertensionId: '',
				},
				teamList: [

				],
				currTeam: {
					name: '',
					id: null
				},
				sfRecord: [],
				tnbList: [],
				existFace: false
			};
		},
		created() {
			// 年份处理
			var nowYear = GetNowTime('.').substr(0, 4).toString();
			var yearlist = [nowYear - 2, nowYear - 1, nowYear]

			yearlist.forEach((item, index) => {
				item = item.toString()
				this.teamList.push({
					name: item,
					id: item
				})
			})
			this.teamList.unshift({
				name: '全部',
				id: ''
			})
			this.currTeam.name = '全部';
			this.currTeam.id = '';
			const config = JSON.parse(uni.getStorageSync('config'));
			if (config.existFace === "是") {
				this.existFace = true
			} else {
				this.existFace = false
			}
		},
		onLoad: function(option) {
			uni.setNavigationBarTitle({
				title: option.name + '的随访记录'
			});
			console.log('页面传参', option)
			this.person.ehrId = option.ehrId
			this.person.url = option.url
			this.person.idCard = option.idCard
			this.person.orgId = option.orgId
			this.person.orgName = option.orgName
			// 根据卡号动态展示卡片  diabetesId   hypertensionId
			if (option.hypertensionId && option.hypertensionId != 'null') {
				this.tabList.push('高血压')
				this.person.hypertensionId = option.hypertensionId
			}
			if (option.diabetesId && option.diabetesId != 'null') {
				this.tabList.push('糖尿病')
				this.person.diabetesId = option.diabetesId
			}
			if (option.type == "糖尿病" && this.tabList.length > 1) {
				this.curr = '糖尿病'
			} else {
				this.curr = this.tabList[0]
			}
			this.getMbInfo()
		},
		methods: {
			delSfOk() {
				this.$showLoading('删除中')
				if (this.curr == '高血压') {
					delHypertension({
						id: this.delId
					}).then((res) => {
						if (res.ret) {
							this.$showToast('删除成功')
							this.getMbInfo()
						}
						uni.hideLoading()
					}, () => {
						uni.hideLoading()
					})
				} else {
					delDiabetes({
						id: this.delId
					}).then((res) => {
						if (res.ret) {
							this.$showToast('删除成功')
							this.getMbInfo()
						}
						uni.hideLoading()
					}, () => {
						uni.hideLoading()
					})
				}
			},
			// 删除高血压随访
			delSf(id) {
				plus.nativeUI.actionSheet({
					title: "提示",
					cancel: "取消",
					buttons: [{
						title: "删除该条随访"
					}]
				}, (e) => {
					if (e.index == 1) {
						this.delId = id
						this.delSfOk()
					}
				})
			},
			//获取状态
			getStatus(val) {
				var status = ''
				if (val == '0') {
					status = 'icon-guanbi'
				} else if (val == '1') {
					status = 'icon-zhengque actIcon'
				} else {
					status = 'icon-guanbi red'
				}
				return status;
			},
			getfolType(val) {
				var type = ''
				if (val == '1') {
					type = '门诊'
				} else if (val == '2') {
					type = '家庭'
				} else {
					type = '电话'
				}
				return type
			},
			okLaterHandle() {
				console.log(this.sfTitle)
				if (this.sfTitle == '高血压') {
					this.curr = '高血压'
					this.addSf()
				}
				if (this.sfTitle == '糖尿病') {
					this.curr = '糖尿病'
					this.addSf()
				}
			},
			okGoSign() {
				var url = '/pages/home/doctorSign/doctorSign'
				var post = this.goSignData
				post.idCard = this.person.idCard
				post.name = this.person.name
				post.sfSign = true
				// 家医签约
				uni.navigateTo({
					url: url += '?useInfor=' + encodeURIComponent(JSON.stringify(post))
				})
			},
			// 高血压随访查看
			gxySfHandle(id, index) {
				var url
				var qureyData = JSON.parse(JSON.stringify(this.person));
				qureyData.id = id
				qureyData.index = index
				if (this.curr == '高血压') {
					url = '../newGxyvisit/newGxyvisit' + '?data=' + encodeURIComponent(JSON.stringify(qureyData))
				}
				if (this.curr == '糖尿病') {
					url = '../newTnbVisit/newTnbVisit' + '?data=' + encodeURIComponent(JSON.stringify(qureyData))
				}
				uni.navigateTo({
					url: url
				})
			},
			addSf() {
				const redirect = () => {
					var url
					var qureyData = JSON.parse(JSON.stringify(this.person));
					console.log('新增', this.curr)
					if (this.curr == '高血压') {
						url = '../newGxyvisit/newGxyvisit' + '?data=' + encodeURIComponent(JSON.stringify(this.person))
					}
					if (this.curr == '糖尿病') {
						url = '../newTnbVisit/newTnbVisit' + '?data=' + encodeURIComponent(JSON.stringify(this.person))
					}
					uni.navigateTo({
						url: url
					})
				}
				const avatarURL = this.avatarURL
				if ((this.existFace) && avatarURL) {
					uni.showModal({
						content: '是否进行人脸识别',
						confirmColor: 'red',
						success: (res) => {
							if (res.confirm) {
								startProcess(avatarURL, (res) => {
									redirect()
								}, (err) => {
									this.$showToast(err.msg)
								})
							} else if (res.cancel) {
								console.log('取消');
								redirect()
							}
						}
					})
				} else {
					redirect()
				}
			},
			changePho() {
				uni.navigateTo({
					url: '/pages/home/diseaseVisit/changePhone/changePhone' + '?ehrId=' + this.person.ehrId +
						'&tel=' + this.person.tel
				})
			},
			// 获取随访记录
			getMbInfo() {
				getMbInfo({
					ehrId: this.person.ehrId,
					year: this.currTeam.id
				}).then(res => {
					console.log('随访记录获取的信息', res)
					if (res.ret) {
						this.person.ehrId = res.data.ehrId
						this.person.name = res.data.name
						this.person.tel = res.data.tel
						this.sfRecord = res.data.gxySf
						this.tnbList = res.data.tnbSf
						this.avatarURL = res.data.url
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

	.lateTime {
		box-sizing: border-box;
		padding: 20rpx;

		text {
			font-size: 30rpx;
		}
	}

	page {
		background-color: #f6f6f6;

		.sfRecord {
			.fixed-head {
				position: fixed;
				top: 0;
				left: 0;
				right: 0;
				z-index: 999;
			}

			.nav {
				background-color: rgb(53, 168, 255);
				width: 100%;
				display: flex;
				box-sizing: border-box;
				align-items: center;

				.nav-head {
					flex: 1;
					display: flex;

					.head {
						width: 80rpx;
						height: 80rpx;
						border-radius: 50%;
						margin-left: 50rpx;
					}

					.personInfor {
						width: 205rpx;
						margin-left: 30rpx;

						.name {
							margin-bottom: 6rpx;
							font-size: 30rpx;
							line-height: 36rpx;
							font-weight: bold;
							line-height: 42rpx;
							color: rgba(255, 255, 255, 1);
						}

						.phoneBox {
							box-sizing: border-box;
							padding: 0 8rpx;
							width: 260rpx;
							background: rgba(22, 133, 217, 1);
							opacity: 1;
							border-radius: 333px;
							font-size: 30rpx;
							font-weight: 400;
							line-height: 48rpx;
							color: rgba(245, 249, 255, 1);
							margin-top: 20rpx;

							.num {
								padding-right: 8rpx;
								border-right: 1px solid #35A8FF;
							}

							.iconfont {
								margin-left: 13rpx;
								font-size: 28rpx;
							}
						}
					}
				}

				.nav-call {
					.callBox {
						margin-top: 10rpx;
						margin-right: 32rpx;
						width: 60rpx;
						height: 60rpx;
						border-radius: 50%;
						text-align: center;
						line-height: 60rpx;
						color: #35A8FF;
						background-color: #fff;
					}
				}
			}

			.swipeMenu {
				width: 100%;
				height: 173rpx;
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
						height: 88rpx;
						background: rgba(22, 133, 217, 1);
						border-radius: 66px;
						display: flex;
						box-sizing: border-box;

						.swipItem {
							width: 50%;
							text-align: center;
							font-size: 24rpx;
							font-weight: 400;
							line-height: 88rpx;
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
							height: 72rpx;
							background: rgba(255, 255, 255, 1);
							box-shadow: 0px 3px 6px rgba(53, 168, 255, 0.16);
							border-radius: 45rpx;
							font-size: 30rpx;
							font-weight: bold;
							line-height: 72rpx;
							color: rgba(53, 168, 255, 1);
							margin: 8rpx;
						}
					}
				}

				.icon {
					height: 15rpx;
					background-color: #F5F9FF;
					display: flex;

					.sanjiaoBox {
						width: 50%;
					}

					.active {
						margin: 0 auto;
						width: 0;
						height: 0;
						border-left: 15rpx solid transparent;
						border-right: 15rpx solid transparent;
						border-top: 15rpx solid #35A8FF;
					}
				}
			}

			.content {
				margin-top: 230rpx;
				padding: 45rpx 32rpx;

				.card-box {
					position: relative;

					.carditem {
						width: 100%;
						position: absolute;
						top: 0;
						left: -600px;
					}

					.active {
						top: 0;
						left: 0;
					}

					.swiper-item {
						width: 100%;
						height: 186rpx;
						margin: 20rpx 0;
					}

					.card {
						position: relative;
						box-sizing: border-box;
						background-color: #fff;
						width: 100%;
						height: 186rpx;
						border-radius: 10px;
						padding: 20rpx;
						box-sizing: border-box;
						display: flex;

						.imgArea {
							width: 181rpx;
							height: 136rpx;
							background-image: url('/static/image/err.png');
							background-size: cover;
							background-repeat: no-repeat;
							background-position: center;
							border-radius: 10rpx;
							overflow: hidden;

							.img {
								width: 181rpx;
								height: 136rpx;
							}
						}

						.other {
							padding-left: 30rpx;
							flex: 1;
							display: flex;
							flex-direction: column;

							.classFlow {
								line-height: 40rpx;
								margin-left: 6rpx;
								font-size: 24rpx;
								color: rgba(162, 164, 185, 1);
							}

							.data {
								line-height: 56rpx;
								font-size: 40rpx;
								font-weight: bold;
								color: rgba(255, 114, 0, 1);

								.dw {
									line-height: 56rpx;
									margin-left: 6rpx;
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
										margin-right: 20rpx;
										font-size: 20rpx;

										.text {
											margin-left: 5rpx;
											font-size: 24rpx;
										}

										.acttext {
											color: #00D39F;
										}
									}

									.red {
										color: #FF7200;
									}

									.actIcon {
										color: #00D39F;
									}
								}

								.time {
									margin-top: 27rpx;
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
							line-height: 30rpx;
							width: 135rpx;
							height: 30rpx;
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
				bottom: 40rpx;
				left: 50%;
				margin-left: -60rpx;
				font-size: 120rpx;
				color: #24BF00;
			}
		}
	}
</style>
