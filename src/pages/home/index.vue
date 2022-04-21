<template>
	<view class="page">
		<view class="navBar">
			<self-team-picker @teamChange="teamChange" :teamList="teamList" :currTeam="currTeam"></self-team-picker>
			<text style="font-size: 44rpx;position: relative;" class="iconfont icon-xinxi"
				@click="linkTo('./noticeInfor/noticeInfor')">
				<view class="dot"></view>
			</text>

		</view>
		<!-- swiper -->
		<view class="uni-padding-box">
			<view class="swiper-con">
				<swiper :circular="true" :indicator-dots=true autoplay :interval="interval" :duration="500">
					<swiper-item v-for="(item, index) in swiperinfo" :key="index" :acceleration="true"
						class="swiperItem">
						<image :src="item.img_url" mode="" class="swImg" />
					</swiper-item>
				</swiper>
			</view>
		</view>
		<!-- workNotice -->
		<view class="noticeBox">
			<view class="notice" @tap="linkTo('./workNotice/workNotice')">
				<view class="left">
					<text class="iconfont icon-xiaoxi"></text>
					<view class="workNotice">工作提醒<text class="dot">{{total}}</text></view>
					<view class="noticeContent">高糖随访工作提醒</view>
				</view>
				<view class="right">
					<text class="iconfont icon-xiangyou"></text>
				</view>
			</view>
		</view>
		<!-- funArea -->
		<view class="funArea">
			<view class="flex-container">
				<span v-for="(item,index) in funList" :key="index" @tap="linkTo(item.url)">
					<template v-if="item.show">
						<view class="flex-item">
							<view class="iconBox" :style="{backgroundColor:item.bac}">
								<i :class="item.icon"></i>
							</view>
							<p v-text="item.text"></p>
						</view>
					</template>
				</span>
				<!-- <view class="flex-item" @tap="linkTo('./otherServer/otherServer')">
					<view class="iconBox" style="backgroundColor:#C0C0C0">
						<i class="iconfont icon-qita"></i>
					</view>
					<p>其他服务</p>
				</view> -->
			</view>
		</view>
		<!-- Card -->
		<view class="cardBox" v-if="showNews">
			<view class="card">
				<view class="card-top">
					<image src="../../static/image/card.png" mode=""></image>
				</view>
				<view class="card-bottom">
					<view class="card-item">
						<view class="iconBox">
							<text style="color: #00e8af;" class="iconfont icon-health-ecg"></text>
						</view>
						<view class="title">慢性病频道</view>
					</view>
					<view class="card-item">
						<view class="iconBox">
							<text style="color: #fd7575;" class="iconfont icon-shehuiguanai"></text>
						</view>
						<view class="title">两癌频道</view>
					</view>
					<view class="card-item">
						<view class="iconBox">
							<text style="color: #8179ff;" class="iconfont icon-chengshi"></text>
						</view>
						<view class="title">医保/城居合</view>
					</view>
				</view>
			</view>
		</view>
		<!-- Knowledge expansion -->
		<template v-if="showNews">
			<view class="knowExpantitle">公卫知识</view>
			<view class="knowExpan" v-for="(item,index) in knowExpanList" @tap="openFile(item.id)" :key="index">
				<view class="item">
					<view class="item-l">
						<view class="card-t">{{item.name}}</view>
						<view class="time">{{item.updateTime}}</view>
					</view>
					<view class="item-r">
						<img :src="$IMGURL+item.coverPictureUrl" mode="" />
					</view>
				</view>
			</view>
		</template>
	</view>
</template>
<script>
	import selfTeamPicker from '../../components/self-team-picker/index.vue'
	import {
		isOpenComDB,
		selectSQL,
		executeSQL
	} from '../../sqlite/sqlite.js'
	import uCharts from '@/components/u-charts/u-charts.js';
	// import { switchTeam } from '../../request/user.js';
	import {
		switchTeam,
		getArticleList,
		getUserConfig
	} from '@/request/user.js'
	import {
		getMbPlanList
	} from '@/request/notice.js'
	import {
		getUserPassword
	} from '@/request/updata.js'

	var _self;
	var canvaArcbar1;
	var canvaRing = null;
	export default {
		components: {
			selfTeamPicker
		},
		data() {
			return {
				// 团队信息
				teamList: [{
					name: '',
					teamId: null
				}],
				total: '',
				post: {
					orgId: '',
					nameOrIdno: '',
					startRow: '0',
					size: '5',
					groups: [],
					type: ''
				},
				teamId: '',
				// 选中的团队
				currTeam: {
					name: '',
					teamId: null
				},
				interval: 3000,
				swiperinfo: [{
						img_url: '../../static/image/home_slider1.png',
					},
					{
						img_url: '../../static/image/home_slider2.png',
					},
					{
						img_url: '../../static/image/home_slider3.png',
					},
				],
				workNotice: 6,
				funList: [{
						show: true,
						id: 20,
						used: 1,
						icon: 'iconfont icon-iconxt',
						bac: '#FFCC2F',
						url: './diseaseVisit/diseaseVisit',
						text: '高糖管理'
					},
					{
						show: true,
						id: 10,
						used: 1,
						icon: 'iconfont icon-qianyue',
						bac: '#35A8FF',
						url: './doctorSign/doctorSign',
						text: '家医签约'
					},
					{
						show: true,
						id: 11,
						used: 1,
						icon: 'iconfont icon-xingxing',
						bac: '#14DB6D',
						url: './doctorAppoint/doctorAppoint',
						text: '家医履约'
					},
					{
						show: true,
						id: 21,
						used: 0,
						icon: 'iconfont icon-shenjingneike',
						bac: '#8691FF',
						url: './jsbVisit/jsbVisit',
						text: '严重精神障碍'
					},
					{
						show: true,
						id: 21,
						used: 0,
						icon: 'iconfont icon-yunfu',
						bac: '#FF4BA5',
						url: './ycfVisit/ycfVisit',
						text: '孕产妇'
					},
					{
						show: true,
						id: 21,
						used: 0,
						icon: 'iconfont icon-ertong',
						bac: '#FF9600',
						url: './childrenVisit/childrenVisit',
						text: '0-6儿童'
					},
					{
						show: true,
						id: 21,
						used: 0,
						icon: 'iconfont icon-xingxing',
						bac: '#FF9600',
						url: '../mb/index',
						text: '慢病研究'
					},
					// {id:30,used:0,icon:'iconfont icon-tijianliucheng', bac:'#35DFA1', url:'./healthyCheck/healthyCheck', text:'健康体检'}	
				],
				modelArr: [],
				knowExpanList: [],
			};
		},
		created() {
			getArticleList().then(res => {
				if (res.ret) {
					this.knowExpanList = res.data.articleList;
				}
			})

		},
		onLoad() {
			this.getUserPassword()
			this.getConfig()
		},
		onShow: function() {
			const that = this
			// 获取团队配置和选中的团队
			this.teamList = uni.getStorageSync('treamList');
			uni.getStorage({
				key: 'teamId',
				success: function(res) {
					//console.log(res.data)
					that.teamId = res.data
					that.treamForm();
				},
				fail: () => {

				}
			});
			getMbPlanList(this.post).then(res => {
				if (res.ret) {
					this.total = res.data.countAll
					plus.runtime.setBadgeNumber(res.data.countAll);
				} else {
					console.log(res)
					this.errorLogout() //发生错误退出到登录页
				}
			}, err => {
				console.log(err)
				this.errorLogout() //发生错误退出到登录页
			})
		},
		methods: {
			getUserPassword() {
				getUserPassword().then(res=> {
					console.log('判断找账号是否为初始密码',res)
					if(res.ret) {
						if(res.data.status) {
							uni.showToast({
							    title: '请修改密码',
							    duration: 2000,
								icon: 'error'
							});
							setTimeout(()=>{
								uni.reLaunch({
									url: '/pages/my/passChange/index'
								})
							},1000)
						} else if(!res.data.status) {
							return
						}
					} else {
						uni.removeStorageSync('token')
						setTimeout(()=>{
							uni.reLaunch({
							    url: '/pages/login/index'
							});
						},2000)
					}
				})
			},
			openFile(id) {
				uni.navigateTo({
					url: './knowFile/knowFile?' + 'id=' + id
				})
			},
			getConfig() {
				getUserConfig().then(res => {
					console.log('配置', res.data.config)
					var config = res.data.config
					config.existJsb == '是' ? this.funList[3].show = true : this.funList[3].show = false
					config.existYcf == '是' ? this.funList[4].show = true : this.funList[4].show = false
					config.existEt == '是' ? this.funList[5].show = true : this.funList[5].show = false
					config.existSdxm == '是' ? this.funList[6].show = true : this.funList[6].show = false
					config = JSON.stringify(res.data.config)
					uni.setStorage({
						key: 'config',
						data: config,
						success: function() {
							console.log('配置已保存', config)
						},
					}, )
				}, err => {

				})
			},
			// 根据团队号获得团队name
			treamForm() {
				//console.log('团队id',this.teamId)
				this.teamList.forEach((item, index) => {
					if (item.teamId == this.teamId) {
						this.currTeam.name = item.name;
						this.currTeam.teamId = this.teamId;
						//console.log(this.currTeam.name)
					}
				})
			},
			// 切换团队
			teamChange(value) {
				this.teamId = value;
				let req = {};
				req.teamId = this.teamId;
				switchTeam(req).then((res) => {
					if (res.ret) {
						//console.log('切换成功',this.teamId)
						uni.setStorage({
							key: 'teamId',
							data: this.teamId
						})
						// 调用配置
						this.getConfig()
					}
				})
			},
			// 路由跳转
			linkTo(url) {
				if (url == './healthyCheck/healthyCheck') {
					this.$showToast('该模块未开放')
				} else {
					console.log(url)
					uni.navigateTo({
						url: url
					});
				}
			},
			errorLogout() {
				uni.removeStorageSync('token');
				// 跳登录页
				uni.reLaunch({
					url: '/pages/login/index'
				})
			}
		},
		computed: {
			showNews() {
				const platform = uni.getSystemInfoSync().platform
				return platform === "android" || false
			}
		}
	};
</script>
<style lang="scss">
	$padding:20rpx;

	@mixin flex () {
		display: flex;
		justify-content: space-between;
	}

	swiper {
		width: 100%;
		height: 220upx;
	}

	.uni-padding-box {
		margin-top: 100rpx;
		padding: $padding;
		height: 220rpx;

		.swiper-con {
			/deep/.uni-swiper-wrapper {
				border-radius: 10rpx;
			}

			.swImg {
				width: 100%;
				height: 220rpx;
			}
		}
	}

	.navBar {
		z-index: 22;
		width: 100%;
		position: fixed;
		top: 0;
		left: 0;
		@include flex;
		height: 90upx;
		align-items: center;
		background-color: #35a8ff;

		.dot {
			position: absolute;
			border-radius: 50%;
			width: 18rpx;
			height: 18rpx;
			right: -4rpx;
			top: -4rpx;
			background-color: red;
		}

		.icon-sanjiao {
			position: absolute;
		}

		.icon-xinxi {
			font-size: 30rpx;
			margin-right: 22rpx;
			color: #fff;
		}
	}

	.noticeBox {
		padding: 10upx $padding;

		.notice {
			@include flex;
			font-size: 12px;
			align-items: center;
			box-sizing: border-box;
			padding: 0 20rpx;
			width: 100%;
			height: 120rpx;
			background: rgba(255, 255, 255, 1);
			box-shadow: 0px 3px 20px 0px rgba(53, 168, 255, 0.2);
			border-radius: 10rpx;

			.left {
				display: flex;
				color: #35A8FF;

				.iconfont {
					color: #35A8FF;
					font-size: 38rpx;
				}

				.workNotice {
					margin-left: 20rpx;
					font-weight: 600;
					font-size: 32rpx;

					.dot {
						display: inline-block;
						width: auto;
						padding: 0 4rpx;
						height: auto;
						text-align: center;
						line-height: 38rpx;
						margin-left: 12rpx;
						font-size: 18rpx;
						background-color: red;
						border-radius: 50%;
						color: #fff;
						vertical-align: 4rpx;
					}
				}

				.noticeContent {
					margin-left: 45rpx;
					font-size: 26rpx;
					color: rgba(153, 153, 153, 1);
				}
			}

			.right {
				.dot {
					width: 10rpx;
					height: 10rpx;
				}

				.iconfont {
					color: #35A8FF;
				}
			}
		}
	}

	.funArea {
		margin-top: 10rpx;

		.flex-container {
			padding: 0px 10px;
			display: flex;
			align-content: flex-start;
			flex-wrap: wrap;

			.iconBox {
				width: 60px;
				height: 60px;
				background-color: #fff;
				border-radius: 20px;
				margin-bottom: 7px;
				vertical-align: middle;

				.iconfont {
					position: relative;
					top: 17%;
					left: 50%;
					margin-left: -19px;
					font-size: 38px;
					color: rgba(255, 255, 255, 1);
				}
			}

			p {
				font-size: 11px;
				color: #333333;
				font-weight: 500;
				text-align: center;
			}

			.flex-item {
				box-sizing: border-box;
				padding: 10upx 25upx;
				width: 100%;
				height: 90px;

			}
		}
	}

	// 卡片
	.cardBox {
		padding: $padding;

		.card {
			border-radius: 10rpx;
			background-color: #fff;

			.card-top {
				image {
					height: 130rpx;
					width: 100%;
				}
			}

			.card-bottom {
				box-sizing: border-box;
				margin-top: 20rpx;
				width: 100%;
				height: 167rpx;
				@include flex;

				.card-item {
					margin-top: 10rpx;
					width: 30%;

					.iconBox {
						text-align: center;
					}

					.iconfont {
						font-size: 50rpx;
					}

					.title {
						margin-top: 20rpx;
						text-align: center;
						font-size: 24rpx;
						color: rgba(0, 0, 0, 1);
					}
				}
			}
		}
	}

	.knowExpantitle {
		margin-left: 20rpx;
		margin-top: 20rpx;
		margin-bottom: 30rpx;
		font-size: 30rpx;
		font-weight: bold;
		color: rgba(0, 0, 0, 1);
	}

	.knowExpan {
		padding: $padding;

		.item {
			width: 100%;
			height: 190rpx;
			@include flex;
			background-color: #fff;
			border-radius: 10rpx;
			margin-bottom: 20rpx;

			.item-l {
				box-sizing: border-box;
				padding: 30rpx;

				.card-t {
					// text-indent: 54rpx;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
					width: 356rpx;
					line-height: 34rpx;
					font-size: 30rpx;
					font-weight: 400;
					color: rgba(0, 0, 0, 1);
				}

				.time {
					margin-top: 38rpx;
					font-size: 24rpx;
					line-height: 24rpx;
					font-weight: 400;
					color: rgba(153, 153, 153, 1);
				}
			}

			.item-r {
				box-sizing: border-box;
				padding: 30rpx;

				img {
					border-radius: 8rpx;
					width: 200rpx;
					height: 130rpx;
				}
			}
		}
	}
</style>
