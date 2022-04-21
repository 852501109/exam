<template>
	<view class="sfRecord">
		<view class="status_bar">
			<!-- 这里是状态栏 -->
		</view>
		<uni-nav-bar :title="person.name + '的孕产随访记录'"  height="40rpx" background-color="#35A8FF" color="#FFFFFF">
			<view slot="left" @tap="back()">
				<uni-icons color="color" type="back" size="24"/>	
			</view>
			<view slot="right">
				<i class="iconfont icon-shezhi2" style="font-size: 48rpx;" @tap="checkDetail()" ></i>
			</view>
		</uni-nav-bar>
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
		<view class="content">
			<view class="card-box" >
				<view class="card-title">产前13周</view>
				<view>
					<view class="notice" v-show="ycfFrontSf.length==0">暂无记录！</view>
					<view class="card"  v-for="(item,index) in ycfFrontSf" :key="index" @tap="gxySfHandle(item.id,'front',item.type,person.idCard,person.cardId)">
						<view class="imgArea">
							<img class="img" v-show="item.imgUrl" :src="$IMGURL + item.imgUrl" alt="" />
						</view>
						<view class="other">
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
							<view class="conclusion okCss">{{item.title}}</view>
						</view>
					</view>
				</view>
			</view>
			<view class="card-box" >
				<view class="card-title">16周到40周</view>
				<view>
					<view class="notice" v-show="ycfMiddleSf.length==0">暂无记录！</view>
					<view class="card"  v-for="(item,index) in ycfMiddleSf" :key="index" @tap="gxySfHandle(item.id,'middle',item.type,person.idCard,person.cardId)">
						<view class="imgArea">
							<img class="img" v-show="item.imgUrl" :src="$IMGURL + item.imgUrl" alt="" />
						</view>
						<view class="other">
							<!-- <view class="data">
								<text>{{item.data}}</text><text class="dw">mmHg</text>
							</view> -->
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
							<view class="conclusion okCss">{{item.title}}</view>
						</view>
					</view>
				</view>
			</view>
			<view class="card-box" >
				<view class="card-title">产后7天内</view>
				<view>
					<view class="notice" v-show="ycfLaterSf.length==0">暂无记录！</view>
					<view class="card"  v-for="(item,index) in ycfLaterSf" :key="index" @tap="gxySfHandle(item.id,'later',item.type,person.idCard,person.cardId)">
						<view class="imgArea">
							<img class="img" v-show="item.imgUrl" :src="$IMGURL + item.imgUrl" alt="" />
						</view>
						<view class="other">
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
							<view class="conclusion okCss">{{item.title}}</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 新增随访 -->
			<text @click="addSf()" class="iconfont icon-add-fill"></text>
			<self-bottom-popcard
				v-show="showSet"
				v-model="showSet"
			    :btnText="btnGroup"
				@topClick="linkTo('../ycfCard/ycfCard')"
			>
			</self-bottom-popcard>
		</view>
	</view>
</template>

<script>
	import selfBottomPopcard from '@/components/self-bottom-popcard/index.vue'
	import {
		getYcfInfo
	} from '@/request/ycfSf.js'
	import { GetNowTime } from '@/common/tool.js'
	import {
		dial
	} from '@/h5PlusApi/plus.js'
	export default {
		components:{ selfBottomPopcard },
		onShow() {
			this.getYcfInfo()
		},
		data() {
			return {
				btnGroup: ['修改档案信息'],
				showSet:false,
				curr: '',
				person: {
					// 编辑的标识
					ycfId: '',
					name: '',
					tel: '',
					idCard: '',
					url: '',
					orgId: '',
					pregnantId:'',
					cardId:'',
				},
				maxType:'',
				ycfFrontSf : [],
				ycfMiddleSf : [],
				ycfLaterSf : [],
				
			};
		},
		created() {
		},
		onLoad: function(option) {
			console.log('孕产妇随访传参', option)
			this.person.ehrId = option.ehrId
			this.person.idCard = option.idCard
			this.person.cardId= option.cardId
			if(option.statusEnd==''){
				this.person.statusEnd = null
			} else{
				this.person.statusEnd = option.statusEnd
			}
			this.getYcfInfo()
		},
		methods: {
			//获取状态
			getStatus(val){
				var status = ''
				if(val=='0'){
					status = 'icon-guanbi'
				} else if (val=='1'){
					status = 'icon-zhengque actIcon'
				} else {
					status = 'icon-guanbi red'
				}
				return status;
			},
			//返回上个页面
			back(){
				uni.navigateTo({
					url:'/pages/home/ycfVisit/ycfVisit'
				})
			},
			//修改档案
			checkDetail(){
				this.showSet = true;
			},
			// 孕产妇随访查看
			gxySfHandle(id,lx,type,idCard,cardId,) {
				console.log("身份证信息:",idCard)
				var url
				var qureyData = JSON.parse(JSON.stringify({}));
				qureyData.id = id
				qureyData.type = type
				qureyData.idCard = idCard
				qureyData.cardId = cardId
				if(lx=='front'){
					url = '../newYcf13Visit/newYcf13Visit' + '?data=' + encodeURIComponent(JSON.stringify(qureyData)) 
				}else if(lx=='middle'){
					url = '../newYcf16Visit/newYcf16Visit' + '?data=' + encodeURIComponent(JSON.stringify(qureyData))
				}else if(lx=='later'){
					url = '../newYcf7Visit/newYcf7Visit' + '?data=' + encodeURIComponent(JSON.stringify(qureyData))
				}
				uni.navigateTo({
					url: url
				})
			},
			//路由跳转
			linkTo(url){
				console.log(this.person.cardId)
				if(url == '../ycfCard/ycfCard'){
					uni.navigateTo({
						url:url += '?cardId='+this.person.cardId
					})
				}
			},
			addSf() {
				var id=''
				var url
				var qureyData = JSON.parse(JSON.stringify({}));
				qureyData.id = id
				qureyData.idCard = this.person.idCard
				qureyData.cardId = this.person.cardId
				console.log(qureyData.type)
				qureyData.type = parseInt(this.maxType)
				console.log(qureyData)			
				if(qureyData.type!=7 ){
					if(qureyData.type == 0){
						qureyData.type=++qureyData.type
						url = '../newYcf13Visit/newYcf13Visit' + '?data=' + encodeURIComponent(JSON.stringify(qureyData))
					}else{
						if(qureyData.type < 5 && qureyData.type>=1){
							qureyData.type=++qureyData.type
							url = '../newYcf16Visit/newYcf16Visit' + '?data=' + encodeURIComponent(JSON.stringify(qureyData))
						}else{
							if(qureyData.type < 7 && qureyData.type>=5){
								if(qureyData.type==6){
									qureyData.type=++qureyData.type
									qureyData.statusEnd = 'end'
									url = '../newYcf7Visit/newYcf7Visit' + '?data=' + encodeURIComponent(JSON.stringify(qureyData))
								}else{
									qureyData.type=++qureyData.type
									url = '../newYcf7Visit/newYcf7Visit' + '?data=' + encodeURIComponent(JSON.stringify(qureyData))
								}
								
							}
						}
					}
					uni.navigateTo({
						url: url
					})
				}else{
					this.$showToast('随访已完成,不能新增随访')
				}
	
			},
			changePho() {
				
				uni.navigateTo({
					url: '/pages/home/diseaseVisit/changePhone/changePhone' + '?ehrId=' + this.person.ehrId + '&tel=' + this.person.tel
				})
			},
			getYcfInfo() {
				getYcfInfo({
					cardId: this.person.cardId,
					statusEnd : this.person.statusEnd
				}).then(res => {
					console.log('孕产妇记录获取的信息', res)
					if (res.ret) {
						this.maxType = res.data.type
						this.ycfFrontSf = res.data.ycfFrontSf
						this.ycfLaterSf = res.data.ycfLaterSf
						this.ycfMiddleSf = res.data.ycfMiddleSf
						this.person.name = res.data.name
						this.person.tel = res.data.tel
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
				height: 160rpx;
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
			.content {
				padding: 45upx 32upx;
				.card-box {
					.card-title{
						text-align: left;
						width: 30%;
						border-radius: 10rpx;
						height: 80upx;
						line-height: 60rpx;
						font-size: 30upx;
						font-weight: 700;
					}
					.card {
						position: relative;
						box-sizing: border-box;
						margin-top: 50upx;
						background-color: #fff;
						width: 100%;
						height: 176upx;
						border-radius: 10px;
						padding: 20upx;
						display: flex;
						margin-bottom: 30rpx;
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
									line-height: 72rpx;
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
