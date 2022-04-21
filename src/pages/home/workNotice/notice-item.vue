<template>
	<!-- 不能用v-if (i: 每个tab页的专属下标;  index: 当前tab的下标; 申明在 MescrollMoreItemMixin )-->
	<view v-show="i === index" class="page">
		<view class="totalNum">查询得到{{totalNum}}条</view>
		<!-- top="120"下拉布局往下偏移,防止被悬浮菜单遮住 -->
		<!-- ref动态生成: 字节跳动小程序编辑器不支持一个页面存在相同的ref (如不考虑字节跳动小程序可固定值为 ref="mescrollRef") -->
		<mescroll-body :ref="'mescrollRef'+i" @init="mescrollInit" top="0" :down="{use:false}" @down="downCallback"
			:up="upOption" @up="upCallback" @emptyclick="emptyClick">
			<!-- 数据列表 -->
			<view class="workNotice">
				<view class="content">
					<view class="noNotice" v-show="noticeList.length==0">暂无提醒</view>
					<mescroll-body ref="mescrollRef" @up="upCallback" :down="{use:false}" :up="upOption">
						<uni-swipe-action :threshold="200" v-for="(item,index) in noticeList" :key='index'
							class="swiper-item">
							<uni-swipe-action-item :right-options="options" @click="onClick(item.id)">
								<view class="card"
									@tap="linkTo(item.ehrId,item.imgurl,item.idCard,item.orgId,item.orgName,item.diabetesCardId,item.hypertensionCardId,item.type,item.cardId,item.id, item.name)">
									<view class="left">
										<view class="imgBox">
											<img class="img" v-show="item.image" :src="$IMGURL+item.image" />
										</view>
									</view>
									<view class="infor">
										<view class="name">
											<text>{{item.name}}</text><text>{{item.gender}}</text><text>{{item.age}}岁</text>
											<view v-show="item.status" :class="item.status=='已逾期'?'yq':'soonYq'"
												class="status">{{item.status}}</view>
										</view>
										<view class="phone">
											<text class="iconfont icon-shouji"></text><span>{{item.tel}}</span>
										</view>
										<view class="org">
											<text
												class="iconfont icon-yiliaojigou"></text><span>{{item.orgName}}&nbsp;{{item.group}}</span>
										</view>
										<view class="time">
											<text>计划随访时间:</text><span>{{item.planDate}}</span><span
												class="doctorName">{{item.doctorName}}</span>
										</view>
									</view>
								</view>
							</uni-swipe-action-item>
						</uni-swipe-action>
					</mescroll-body>
				</view>
			</view>
		</mescroll-body>
	</view>
</template>

<script>
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import MescrollMoreItemMixin from "@/components/mescroll-uni/mixins/mescroll-more-item.js";
	//import {apiSearch} from "@/api/mock.js"
	import {
		getMbPlanList
	} from '@/request/notice.js'

	export default {
		mixins: [MescrollMixin, MescrollMoreItemMixin], // 注意此处还需使用MescrollMoreItemMixin (必须写在MescrollMixin后面)
		props: {
			i: Number, // 每个tab页的专属下标 (除了支付宝小程序必须在这里定义, 其他平台都可不用写, 因为已在MescrollMoreItemMixin定义)
			index: { // 当前tab的下标 (除了支付宝小程序必须在这里定义, 其他平台都可不用写, 因为已在MescrollMoreItemMixin定义)
				type: Number,
				default () {
					return 0
				}
			},
			post: {
				type: Object,
				default () {
					return {}
				}
			},
			tabs: { // 为了请求数据,演示用,可根据自己的项目判断是否要传
				type: Array,
				default () {
					return []
				}
			}
		},
		data() {
			return {
				totalNum: '0',
				downOption: {
					auto: false // 不自动加载 (mixin已处理第一个tab触发downCallback)
				},
				options: [{
					text: '延期提醒',
					style: {
						backgroundColor: '#FE9C01',
						fontSize: '34rpx'
					}
				}],
				upOption: {
					auto: false, // 不自动加载
					// page: {
					//     num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
					//     size: 10 // 每页数据的数量
					// },
					noMoreSize: 4, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
					empty: {
						tip: '~ 空空如也 ~', // 提示
						btnText: '去看看'
					}
				},
				noticeList: [] //列表数据
			}
		},
		methods: {
			// 初始化方法
			initList(post) {
				console.log('初始化查询条件', post)
				this.noticeList.length = 0
				const that = this
				if (!Array.isArray(post.groups)) {
					post.groups = post.groups.split(',')
				}
				post.startRow = 0;
				console.log('初始化查询条件', post)
				this.$showLoading('加载中')
				getMbPlanList(post).then(res => {
					uni.hideLoading()
					console.log('工作提醒列表获取', res)
					if (res.ret) {
						that.noticeList = that.noticeList.concat(res.data.list); //追加新数据
						console.log('追加后', that.noticeList)
						this.totalNum = res.data.listCount || 0
						//this.$emit('getNum',res.data.listCount||0)
						that.mescroll.endByPage(res.data.list.length, Math.ceil(res.data.listCount / 10));
						console.log('endbypage', res.data.list.length, Math.ceil(res.data.listCount / 10))
					} else {
						that.mescroll.endErr()
					}
				}, (err) => {
					uni.hideLoading()
					console.log('请求错误原因', err)
					this.mescroll.endErr()
				})
			},
			// 延期
			onClick(id) {
				this.$emit('tabLate', id)
			},
			linkTo(ehrId, url, idCard, orgId, orgName, diabetesId, hypertensionId, type, cardId, id, name) {
				if (type == '高血压' || type == '糖尿病') {
					var gourl = '/pages/home/diseaseVisit/sfRecord/sfRecord'
					var diabetesId = diabetesId
					var hypertensionId = hypertensionId
					uni.navigateTo({
						url: gourl + '?ehrId=' + ehrId + '&url=' + url + '&idCard=' + idCard + '&orgId=' + orgId +
							'&orgName=' + orgName + '&diabetesId=' + diabetesId + '&hypertensionId=' +
							hypertensionId + '&type=' + type + '&name=' + name
					})
				}
				if (type == '精神病') {
					var gourl = '/pages/home/jsbVisit/jsbRecord/jsbRecord'
					uni.navigateTo({
						url: gourl + '?ehrId=' + ehrId + '&url=' + url + '&idCard=' + idCard + '&orgId=' + orgId +
							'&orgName=' + orgName + '&diabetesId=' + diabetesId + '&psychopathId=' + id +
							'&type=' + type + '&name=' + name
					})
				}
				if (type == '孕产妇') {
					var gourl = '/pages/home/ycfVisit/ycfRecord/ycfRecord'
					uni.navigateTo({
						url: gourl + '?idCard=' + idCard + '&cardId=' + id + '&ehrId=' + ehrId + '&name=' + name
					})
				}
				if (type == '儿童') {
					var gourl = '/pages/home/childrenVisit/childrenRecord/childrenRecord'
					uni.navigateTo({
						url: gourl + '?cardId=' + id + '&name=' + name
					})
				}
			},
			/*上拉加载的回调: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10 */
			upCallback(page) {
				// this.i: 每个tab页的专属下标
				// this.index: 当前tab的下标
				//let word = this.tabs[this.i].name
				this.getMbPlanList()
			},
			//点击空布局按钮的回调
			getMbPlanList(page) {
				const that = this
				var post = Object.assign({}, this.post)
				post = JSON.parse(JSON.stringify(that.post))
				if (!Array.isArray(post.groups)) {
					post.groups = post.groups.replace(new RegExp("，", "gm"), ",")
					post.groups = post.groups.split(',')
				}
				post.startRow = that.noticeList.length;
				console.log('查询条件', post)
				this.$showLoading('加载中')
				getMbPlanList(post).then(res => {
					uni.hideLoading()
					if (res.ret) {
						console.log('工作提醒列表获取', res.data.listCount)
						//this.$emit('getNum',res.data.listCount)
						this.totalNum = res.data.listCount
						if (page && page.num == 1) that.noticeList = []; //如果是第一页需手动置空列表
						console.log('追加', that.noticeList)
						that.noticeList = that.noticeList.concat(res.data.list); //追加新数据
						console.log('追加后', that.noticeList)
						that.mescroll.endByPage(res.data.list.length, Math.ceil(res.data.listCount / 10));
						console.log('endbypage', res.data.list.length, Math.ceil(res.data.listCount / 10))
					} else {
						that.mescroll.endErr()
					}
				}, (err) => {
					uni.hideLoading()
					console.log('请求错误原因', err)
					this.mescroll.endErr()
				})
			},
			emptyClick() {
				uni.showToast({
					title: '点击了按钮,具体逻辑自行实现'
				})
			},

		}

	}
</script>
<style lang="scss">
	.page {
		position: relative;

		.totalNum {
			position: fixed;
			z-index: 999;
			top: 176rpx;
			width: 100%;
			height: 46upx;
			line-height: 46upx;
			font-size: 24upx;
			font-weight: 500;
			color: rgba(102, 102, 102, 1);
			text-align: center;
			background: #cfe6f8;
		}
	}

	.workNotice {
		.content {
			height: 100%;
			margin-top: 130rpx;
			padding: 20rpx;

			.noNotice {
				position: absolute;
				margin-left: -60rpx;
				top: 60px;
				left: 50%;
				font-size: 30rpx;
				line-height: 120rpx;
			}

			.swiper-item {
				margin-bottom: 20rpx;
			}
		}

		.card {
			width: 100%;
			background-color: #fff;
			border-radius: 10rpx;
			display: flex;
			box-sizing: border-box;

			.left {
				width: 240rpx;
				height: 227rpx;
				padding: 20rpx;

				.imgBox {
					background-image: url('/static/image/err.png');
					background-size: cover;
					background-repeat: no-repeat;
					width: 240rpx;
					height: 227rpx;
					border-radius: 10rpx;

					img {
						width: 240rpx;
						height: 227rpx;
						border-radius: 10rpx;
					}
				}
			}

			.infor {
				flex: 1;
				padding: 20rpx 0;
				margin-left: 10rpx;
				font-size: 24rpx;
				font-weight: 400;
				color: rgba(51, 51, 51, 1);
				position: relative;

				.name {
					font-size: 30rpx;
					font-weight: 500;
					color: #333333;
					line-height: 30rpx;
					margin-bottom: 30rpx;

					text {
						margin-right: 30rpx;
					}

					.status {
						position: absolute;
						top: 18rpx;
						right: 20rpx;
						text-align: center;
						line-height: 40rpx;
						width: 100rpx;
						height: 40rpx;
						font-size: 20rpx;
						color: #fff;
						border-radius: 20rpx;
					}

					.yq {
						background: rgba(255, 0, 0, 1);
					}

					.soonYq {
						background-color: #FF9600;
					}
				}

				.phone {
					margin-bottom: 18rpx;
					font-size: 26rpx;
					line-height: 20rpx;

					.iconfont {
						margin-right: 10rpx;
						font-size: 24rpx;
						color: #35A8FF;
					}
				}

				.type {
					.type-item {
						margin-bottom: 16rpx;
						margin-right: 20rpx;
						border-radius: 4rpx;
						color: #fff;
						width: 95rpx;
						height: 40rpx;
						text-align: center;
						line-height: 40rpx;

						&.gxy {
							background-color: #35A8FF;
						}

						&.tnb {
							background-color: #ffaa7f;
						}
					}
				}

				.org {
					margin-bottom: 16rpx;
					line-height: 20rpx;
					font-size: 20rpx;
					font-size: 26rpx;

					.iconfont {
						margin-right: 10rpx;
						font-size: 24rpx;
						color: #24BF00;
					}
				}

				.doctorName {
					margin-left: 20rpx;
				}
			}
		}
	}
</style>
