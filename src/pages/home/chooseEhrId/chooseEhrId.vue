<template>
	<view class="page">
		<view class="status_bar"></view>
		<uni-nav-bar fixed="true" :isBack="true" title="选择建档人员" @clickLeft="newBuild()"  height="40rpx" background-color="#35A8FF" color="#FFFFFF">
			<view slot="right">
				<i class="iconfont icon-fangdajing" @tap="changePop()" ></i>
			</view>
		</uni-nav-bar>
		<view class="contet">
			<mescroll-body ref="mescrollRef" @up="upCallback" :down="{use:false}" :up="upOption" >
				<view class="infor-list">
					<view class="infor-list-item"
					v-for="(item,index) in jmList"
					:key="index"
					@tap="openDetail(item)"
					>
						<view class="flex-img">
							<view class="img-box">
								<img v-show="item.imgurl" 
								:src="$IMGURL+item.imgurl" alt="">
							</view>
						</view>
						<view class="flex-baseInfor">								 
							<view class="base-box">									
								<view class="name">
									<span>{{item.name}}</span>
									<span>{{item.gender}}</span>
									<span>{{idToInfor(item.idCard)}}岁</span>
									<view class="out" v-show="item.emigrationFlag==1">迁出</view>
								</view>
								<view class="phone">
									<i class="iconfont icon-Id"></i>
									<span>{{item.idCard|IdcardEncry}}</span>									
								</view>
								 <view class="ryType">
									<i class="iconfont icon-biaoqian1"></i>
									<view class="span">{{item.ryType}}</view>	
								 </view>
								 <view class="orgName">
									<i class="iconfont icon-yiliaojigou"></i>
									<span>{{item.orgName}}&nbsp;{{item.group}}</span>	
								 </view>
								 <view class="status-flag">
									 <view class="ry_type">
									 	<view class="ry_item" :class="{org:ite=='糖尿病'}" v-for="(ite, inde) in item.gtType" :key="inde">
									 		{{ite.substr(0, 1)}}
									 	</view>
									 </view>
									 <view class="is-qy" v-show="item.qu" v-text="item.qu?'已签约':''">已签约</view>
								 </view>
							 </view>
						 </view>
					</view>
				</view>
			</mescroll-body>
		</view>
		<jm-search 
		@changePop="changePop" 
		@search="search"
		:orgList="orgList"
		v-model="jgIndex" 
		:show="show"
		></jm-search>
	</view>	
</template>
<script>
import { idToInfor } from '@/common/tool.js'
import { getOrgList } from '@/request/user.js'
import { getComEhrList } from '@/request/jmda.js'
import MxDatePicker from "@/components/mx-datepicker/mx-datepicker.vue";
import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
import JmSearch from '@/pages/jm/components/jmSearch.vue'
export default {
	components:{ JmSearch },
	mixins: [MescrollMixin], // 使用mixin
	data() {
		return {
			total:'',
			upOption: {
				page: {
					size: 10 // 每页数据的数量,默认10
				},
				noMoreSize: 5, // 配置列表的总数量要大于等于5条才显示'-- END --'的提示
				empty: {
					tip: '暂无相关数据'
				}
			},
			// 查询机构列表
			orgList:[],
			// 查询条件
			post:{
				emigrationFlag:'',
				ryType:['全部'],
				orgId:'',
				isSign:'',
				nameOrIdno:'',
				startRow:'',
				size: 10,
				groups:''
			},
			jmList: [],
			imgurl:'',
			show: false,
			jgIndex: {
				checked: 0
			}
		};
	},
	onLoad: function () {
		uni.$on('JMLIST_RELOAD', res => {
		    console.log('JMLIST_RELOAD')
			this.search()
		})
	},
    onUnload: function () {
        uni.$off('JMLIST_RELOAD')
    },
	onReady() {
		const that = this
		uni.getStorage({
			key: 'group',
		    success: function (res) {
				console.log(res.data)
				that.$set(that.post,'groups',res.data)
				that.post.groups = that.post.groups.replace(new RegExp("，","gm"),",")
			},
			fail:()=>{
				
			}
		});
	},
	onBackPress(event){
		if(this.show) {
            this.changePop()
            return true
        }
	},
    mounted() {
        // 添加监听
        this.search()
    },
	onShow() {
		getOrgList().then(res=>{
			if(res.ret){
				this.orgList = res.data
			}
		})	
	},
    filters: {
      IdcardEncry: function(val) {
        return val && val.substr(0, 6) + '********' + val.substr(val.length-4, 4)
      }
    },
	methods: {
		upCallback(page) {
            this.getComEhrList(page);
		},
		chooseJg(e){
			console.log(e)
			this.post.orgId = e.value;
			this.jgText = e.label
		},
		search(post){
			this.jmList=[];
			this.post = Object.assign(this.post,post)
			this.mescroll.resetUpScroll()
		},
		idToInfor(str){
			return idToInfor(str).age
		},
		// 获取居民档案列表
		getComEhrList(page){
			this.post.startRow = this.jmList.length;
			//console.log('居民档案列表获取条件',this.post)
			getComEhrList(this.post).then(res =>{
				console.log('居民档案列表获取',res)
				if(res.ret){
					this.total = res.size
                    if(page.num == 1) this.jmList = []; //如果是第一页需手动置空列表
                    this.jmList = this.jmList.concat(res.data.ehrList); //追加新数据
                    this.mescroll.endByPage(res.data.ehrList.length, Math.ceil(res.size/10));
				} else {
					this.mescroll.endErr()
				}
			},(err)=>{
				console.log('请求错误原因',err)
				this.mescroll.endErr()
			})
		},
		changePop () {
            if (this.show) {
                uni.showTabBar({animation:true})
            }
            else {
                uni.hideTabBar({animation:true})
            }
			this.show = !this.show
		},
		newBuild () {
			uni.navigateTo({
				url: './newBuild/newBuild'
			});
		},
		// 打开详情页面
		openDetail (item){
			var url = '/pages/jm/fileDetail/fileDetail?' + 'id=' + item.id + '&' + 'name=' + item.name;			
			uni.navigateTo({
				url: url
			})
		}
	}
};
</script>

<style lang="scss">
	/*占位导航栏样式*/
	.status_bar {
	      height: var(--status-bar-height);
	      width: 100%;
		  background-color: rgb(53, 168, 255);
	 }
	.contet{
		margin-top: 40rpx;
		.infor-list{
			padding: 20rpx;
			.infor-list-item{
				border-radius: 10rpx;
				list-style: none;
				background-color: #fff;
				height: 269upx;
				margin-bottom: 20rpx;
				display: flex;
				.flex-img{
					width: 320upx;
					overflow: hidden;
					.img-box{
						background-image: url('/static/image/err.png');
						background-size:cover;
						background-repeat:no-repeat;
						width:240upx;
						height:227upx;
						border-radius:10upx;
						margin: 22upx 40upx;
						overflow: hidden;
						img{
							width: 240upx;
							height: 227upx;
							border-radius: 10upx;			
						}
					}
				}				
				.flex-baseInfor{
					padding-right: 20rpx;
					flex: 1;
					margin-top: 20upx;
					overflow: hidden;
					font-size:32rpx;
					font-weight:500;
					color:rgba(51,51,51,1);
					.name{
						position: relative;
						span{
							margin-right: 30upx;
						}
						.out{
							width: 50rpx;
							height: 50rpx;
							border-radius: 50%;
							text-align: center;
							line-height: 50rpx;
							background-color: #d7eeff;
							color: #0091FE;
							font-size:20rpx;
							position: absolute;
							right: 0;
						}
					}
					.phone{
						margin-top: 12upx;
						font-size:26upx;
						font-weight:400;
						color:rgba(51,51,51,1);
						.iconfont{
							margin-right: 10px;
							color: rgba(255, 114, 0, 1);
						}
					}
					.ryType{
						margin-top: 12upx;
						font-size:26upx;
						font-weight:400;
						color:rgba(51,51,51,1);
						display: flex;
						.span{
							white-space: nowrap;
							text-overflow: ellipsis;
							overflow: hidden;
							word-break: break-all;
						}
						.iconfont{
							margin-right: 10px;
							color: rgba(53, 168, 255, 1);
						}
					}
					.orgName{
						margin-top: 12upx;
						font-size:26upx;
						font-weight:400;
						color:rgba(51,51,51,1);
						.iconfont{
							margin-right: 10px;
							color: rgba(36, 191, 0, 1)  ;
						}
					}
					.status-flag{
						width: 100%;
						display: flex;
						margin-top: 12upx;
						justify-content: space-between;
						.ry_type{
							display: flex;
							.ry_item{
								margin-right: 16rpx;
								text-align: center;
								width:40upx;
								height:40upx;
								font-size: 22upx;
								line-height: 40upx;
								background-color: #d7eeff;
								border-radius:20rpx;
								color: #0091FE;
							}
							.org{
								background-color: #ffe3cc;
								color: #FF7200;
							}
						}
						.is-qy{
							font-size: 22upx;
							line-height: 40upx;
							width:120upx;
							height:40upx;
							text-align: center;
							color: #62d190;
							background:#d0f8e2;
							border-radius:20upx;
						}
					}
				}
			}
		}
	}
</style>
