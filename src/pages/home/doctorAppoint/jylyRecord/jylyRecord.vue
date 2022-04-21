<template>
	<view class="lyRecord">
		<view class="status_bar">
			<!-- 这里是状态栏 -->
		</view>
		<uni-nav-bar fixed="true" :isBack="true" :title="name" height="40rpx" background-color="#35A8FF"
			color="#FFFFFF"></uni-nav-bar>
		<view class="content">
			<view class="card">
				<view v-show="lyJl.length==0" class="notice">暂无记录</view>
				<view class="syjl" v-for="(item,index) in lyJl">
					<view class="year">{{item.createDate}}</view>
					<selfShowCard :title="item.pack||item.conclusion" backgroundColor="#fff">
						<view slot="fold">
							<!-- 服务包 -->
							<view class="servePack">
								<view class="packItem" v-for="(ite,ind) in item.content">
									{{ite}}
								</view>
							</view>
							<!-- 服务结论 -->
							<view class="serveTitle">服务结论/服务情况</view>
							<view class="serveConclusion">
								{{item.conclusion}}
							</view>
							<view class="btnWrapper">
								<text class="del-btn" @tap="handleDeleteRecord(index)">删除次记录</text>
							</view>
						</view>
					</selfShowCard>
				</view>
			</view>
		</view>
		<view class="btn">
			<view class="lvBtn" @tap="linkTo('../zxly/zxly')">执行履约</view>
		</view>
	</view>
</template>

<script>
	import {
		getServiceList,
		deleteServiceRecord
	} from '@/request/jyqy.js'
	import selfShowCard from '@/components/self-show-card/self-show-card.vue'
	export default {
		components: {
			selfShowCard
		},
		onShow() {
			getServiceList({
				signId: this.id
			}).then(res => {
				console.log('获取履约记录', res)
				if (res.ret) {
					this.lyJl = res.data
				}
			})
		},
		methods: {
			linkTo(url) {
				uni.navigateTo({
					url: url + '?id=' + this.id
				})
			},
			handleDeleteRecord(index) {
				uni.showModal({
					content: '是否确认删除此条记录？',
					confirmColor: 'red',
					success: (res) => {
						if (res.confirm) {
							const id = this.lyJl[index].id
							deleteServiceRecord({
								id: id
							}).then(res => {
								if (res.ret) {
									this.lyJl.splice(index, 1)
									this.$showToast('删除成功')
								} else {
									this.$showToast('删除失败')
								}
							}).catch(res => {
								console.debug(JSON.stringify(res))
								this.$showToast('删除失败')
							})
						} else if (res.cancel) {
							console.debug('取消');
						}
					}
				})

			}
		},
		onLoad: function(option) { //option为object类型，会序列化上个页面传递的参数
			console.log('获取id', option)
			if (option.id) {
				this.id = option.id
				this.name = option.name + '的履约记录'
			}
		},
		data() {
			return {
				id: '0ee05622-7092-4256-9b68-1491e7cbc24d',
				name: '的履约记录',
				lyJl: [{
					pcak: '',
					content: [],
					createDate: '',
				}]
			};
		}
	}
</script>

<style lang="scss">
	page {

		/*占位导航栏样式*/
		.status_bar {
			height: var(--status-bar-height);
			width: 100%;
			background-color: rgb(53, 168, 255);
		}

		background-color: #F6F6F6;

		uni-swiper .uni-swiper-wrapper {
			height: 300px !important;
		}

		.content {
			padding: 38rpx 20rpx;

			.card {
				.notice {
					text-align: center;
					color: #9A9A9A;
				}

				.year {
					font-size: 24rpx;
					font-weight: bold;
					margin-bottom: 20rpx;
					color: rgba(153, 153, 153, 1);
				}

				.servePack {
					view:first-child {
						border-top-left-radius: 10rpx;
						border-top-right-radius: 10rpx;
					}

					.packItem {
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
						-webkit-line-clamp: 2;
						line-clamp: 2;
						text-indent: 20rpx;
						width: 100%;
						min-height: 86rpx;
						line-height: 86rpx;
						background-color: #eaf6ff;
						border-bottom: 2rpx solid #fff;
						font-size: 30rpx;
						font-weight: 400;
						color: rgba(51, 51, 51, 1);
					}

					view:last-child {
						border-bottom-left-radius: 10rpx;
						border-bottom-right-radius: 10rpx;
					}
				}
			}

			.serveTitle {
				min-height: 78rpx;
				height: 78rpx;
				font-size: 30rpx;
				font-weight: 500;
				color: rgba(153, 153, 153, 1);
			}

			.serveConclusion {
				box-sizing: border-box;
				border-radius: 10rpx;
				padding-left: 22rpx;
				padding-top: 30rpx;
				width: 100%;
				min-height: 168rpx;
				background-color: #EAF6FF;
				font-size: 30rpx;
				font-weight: 400;
				color: rgba(51, 51, 51, 1);
			}
		}

		.lvBtn {
			position: fixed;
			bottom: 0;
			width: 100%;
			height: 98upx;
			line-height: 98upx;
			text-align: center;
			font-size: 30upx;
			color: #FFFFFF;
			background: rgba(53, 168, 255, 1);
		}

		.btnWrapper {
			display: flex;
			justify-content: flex-end;
		}

		.del-btn {
			margin-top: 16upx;
			margin-left: 10upx;
			font-size: 30upx;
			padding: 5upx 10upx;
			color: white;
			box-sizing: border-box;
			border-radius: 10rpx;
			background: rgba(170, 0, 0, 1.0);
		}
	}
</style>
