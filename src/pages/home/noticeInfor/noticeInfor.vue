<template>
	<view class="noticeInfor">
		<view class="status_bar">
		<!-- 这里是状态栏 -->
		</view>
		<uni-nav-bar fixed="true" :isBack="true" title="通告信息" height="40rpx" background-color="#35A8FF" color="#FFFFFF"></uni-nav-bar>
		<view class="top-warp">
			<me-tabs :tab-width="380"  v-model="tabIndex" :tabs="tabList" @change="tabChange" ></me-tabs>
		</view>
		<view class="notice-content">
			<!-- body -->
			<notice-item 
			v-for="(item,i) in tabList"
			:key="i"
			:post="post"
			ref="mescrollItem" :i="i" :index="tabIndex" :tabs="tabList">
			</notice-item>
		</view>
	</view>
</template>

<script>
	import MescrollMoreMixin from "@/components/mescroll-uni/mixins/mescroll-more.js";
	import Metabs from '@/components/me-tabs/me-tabs.vue';
	import NoticeItem from "./notice-item.vue";
	export default {
		components: { Metabs,NoticeItem },
		mixins: [MescrollMoreMixin], // 使用mixin
		onShow() {
			this.$nextTick(()=>{	
				this.post.startRow = 0
				this.post.size = 10
			    console.log('触发更新',this.$refs.mescrollItem)
				this.$refs.mescrollItem[this.tabIndex].init()
			})

			//this.upCallback()
		},
		data() {
			return {
				tabList:[
					{ name: '上传',num:0,type:'GXY'}, { name: '审核',num:0,type:'TNB'}
				],
				tabIndex:0,
				noticeList:[],
				upOption: {
					page: {
						size: 5 // 每页数据的数量,默认10
					},
					noMoreSize: 5, // 配置列表的总数量要大于等于5条才显示'-- END --'的提示
					empty: {
						tip: ''
					}
				},
				post:{
					startRow:0,
					size:10,
				},
			};
		},
		filters:{
			getIcon(type){
				if( type==='daNotice' ){
					return 'icon-dangan'
				} else if (type==='glkNotice'){
					return 'icon-renyuandangan'
				} else {
					return 'icon-qianyue'
				}
			},
		},
		methods:{
			tabChange(i){
				//this.post.type = this.tabList[i].type
				let mescroll = this.getMescroll(i);
				if(mescroll){
					// 延时(比$nextTick靠谱一些),确保元素已渲染
					setTimeout(()=>{
						mescroll.scrollTo(mescroll.getScrollTop(),0)
					},30)
				}
				console.log('tabchange',mescroll)
			}
		}
	}
</script>

<style lang="scss">
	/*占位导航栏样式*/
	.top-warp{
		z-index: 999;
		position: fixed;
		top: 88rpx; /* css变量 */
		left: 0;
		width: 100%;
		height: 60upx;
		background-color: white;
	}
	.top-warp .tip{
		font-size: 28upx;
		height: 60upx;
		line-height: 60upx;
		text-align: center;
	}
	.status_bar {
	      height: var(--status-bar-height);
	      width: 100%;
		  background-color: rgb(53, 168, 255);
	 }
	 .notice-content{
		 padding: 20rpx;
		 .content-item{
			 position: relative;
			 margin-bottom: 40upx;
			.notice-card{
				margin-top: 10upx;
				width: 100%;
				background:rgba(255,255,255,1);
				border-radius:10upx;	
				height: 320upx;
				display: flex;
				flex-direction: column;
				.card-nav{
					font-size:30upx;
					font-weight:500;
					color:rgba(51,51,51,1);
					height: 95upx;
					line-height: 95upx;
					text-align: center;
					border-bottom: 1upx solid #EDEDED;
				}
				.card-content{
					flex: 1;
					display: flex;
					.imgArea{
						width: 154upx;
						image{
							width: 120upx;
							height: 120upx;
							margin:12upx 0 0 34upx;
							border-radius: 50%;
						}
					}
					.base-infor{
						box-sizing: border-box;
						margin-left: 80rpx;
						flex: 1;
						font-size:24upx;
						.iconfont{
							margin-right: 10upx;
						}
						.name{
							font-size:30upx;
							font-weight:400;
							color:rgba(51,51,51,1);
							margin-top: 12upx;
							span{
								margin-right: 30upx;
							}
						}
						.phone{
							margin-top: 15upx;
							.icon-Id{
								color: #35A7FF;
							}
						}
						.org{
							margin-top: 12upx;
							.icon-yiyuan{
								color: #23BF00;
							}
						}
						.ry_type{
							display: flex;
							.ry-item{
								margin-top: 12upx;
								width:auto;
								padding: 5rpx 10rpx;
								border-radius: 10rpx;
								line-height: 40upx;
								height:40upx;
								text-align: center;
								margin-right: 8upx;
							}
							.tnb{
								color: #FF7100;
								background-color: #ffe3cc;
							}
							.gxy{
								color: #35A7FF;
								background-color: #d7eeff;
							}
						}
					}
				}
				.card-bottom{
					border-top:1upx solid #EDEDED ;
					text-align: center;
					line-height: 86upx;
					height: 86upx;
					font-size:30upx;
					font-weight:bold;
					color:rgba(53,167,255,1);
				}
			}
		 }
	 }
</style>
