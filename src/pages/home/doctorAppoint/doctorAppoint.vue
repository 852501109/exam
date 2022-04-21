<template>
	<view class="doctor_appoint">
		<view class="status_bar">
		<!-- 这里是状态栏 -->
		</view>
		<uni-nav-bar fixed="true" title="签约人群" :isBack="true" height="40rpx" background-color="#35A8FF" color="#FFFFFF">
			<view slot="right">
				<i class="iconfont icon-fangdajing" @tap="popShow=true" ></i>
			</view>
		</uni-nav-bar>
		<view class="nav_title">
			已签约{{signNum}}人
		</view>
		<view class="content">
			<mescroll-body ref="mescrollRef" @up="upCallback" :down="{use:false}" :up="upOption" >
				<view class="content_item" @tap="linkTo(item.id,item.name)" v-for="(item, index) in list" :key="index">
					<view class="item_left">
						<img v-show="item.imgurl"   :src="$IMGURL+item.imgurl" alt="">
					</view>
					<view class="item_right">
						<view class="baseInfor">
							<span>{{item.name}}</span>
							<span>{{item.gender}}</span>
							<span>{{idToInfor(item.idCard)}}岁</span>
						</view>
						<view class="id_card">
							<i class="iconfont icon-Id"></i>
							<text class="inforCon">{{item.idCard|IdcardEncry}}</text>
						</view>
						<view class="yl_org">
							<i class="iconfont icon-yiliaojigou"></i>
							<span>{{item.orgName}}</span>	
						</view>
						<view class="servePock_type">
							{{item.servePack.join('、')}}
						</view>
						<view class="sign_time">
							签约日期：{{item.signTime}}
						</view>
						<view class="ry_type">
							<view class="ry_item" :class="{org:ite=='糖尿病'}" v-for="(ite, inde) in item.ryType" :key="inde">
								{{ite}}
							</view>
						</view>
					</view>
				</view>
			</mescroll-body>
		</view>
		<!-- search-pop -->
		<selfSearchPop
			v-model="popShow"
			@resert="resert"
			@ok="search()"
		 >
			<view slot="content">
				<selfSearchInput
				  v-model="post.nameOrIdno"
				  @cancel="popShow=false"
				  placeholder="输入姓名或身份证号搜索"
				  @confirm="search"
				></selfSearchInput>
				<view class="pop-content">
					<view class="search-title">按机构筛选</view>
					<my-picker
					:picker-key="{value: 'id', label: 'name', }"
					:picker-list="orgList"
					@confirm="chooseJg($event)">
						<view class="select">
							<view class="orgname">{{jgText}}</view>
							<span class="iconfont icon-to"></span>
						</view>	
					</my-picker>
					<view class="search-title">人员类型</view>
					<self-ry-checkbox
					:list="ryList"
					:huchi="true"
					v-model="post.ryType"
					col="3"
					></self-ry-checkbox>
				</view>
			</view>
		</selfSearchPop>
	</view>
</template>

<script>
	import { idToInfor } from '@/common/tool.js'	
	import { getJySignList,getType } from '@/request/jyqy.js'
	import {getOrgList } from '@/request/user.js'	
	import MxDatePicker from "@/components/mx-datepicker/mx-datepicker.vue";
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";	
	import selfSearchPop from '@/components/self-search-pop/self-search-pop.vue'
	import selfSearchInput from '@/components/self-search-input/self-search-input.vue'
	import selfRyCheckbox from '@/components/self-ry-checkbox/self-ry-checkbox.vue'
	import myPicker from '@/components/my-picker/Picker.vue'
	export default {
		components:{ myPicker,selfSearchPop, selfSearchInput,selfRyCheckbox },
		mixins: [MescrollMixin], // 使用mixin
		data() {
			return {
				jgText:'全部机构',
				popShow:false,
				upOption: {
					page: {
						size: 10 // 每页数据的数量,默认10
					},
					noMoreSize: 5, // 配置列表的总数量要大于等于5条才显示'-- END --'的提示
					empty: {
						tip: '暂无相关数据'
					}
				},
				that:this,
				signNum: null,
				// 搜索条件
				post:{
					ryType:['全部'],
					orgId:'',
					nameOrIdno:'',
					startRow:'',
					size: 10,
				},
				show: false,
				// 查询配置
				// 查询机构列表
				orgList:[],
				ryList:[],
				list:[
					// {
					// 	imgurl:'static/image/head.jpg',
					// 	name:'布罗斯李',
					// 	gender:'男',
					// 	age:20,
					// 	idCard:'371102****1019',
					// 	orgName:'某某卫生室',
					// 	ryType:['高血压','糖尿病'],
					// 	servePack:'普通包、高级服务包',
					// 	sign_time:'2019.12.12',
					// 	is_sign:1
					// }
				]
			}
		},
		filters:{
			signText(val, that){
				return that.signConfig[val-1].text
			},
            IdcardEncry: function(val) {
              return val && val.substr(0, 6) + '********' + val.substr(val.length-4, 4)
            }
		},
		onBackPress(event){
			if(this.popShow) {
			    this.changePop()
			    return true
			}
		},
		created() {
			getType().then(res=>{
				console.log('人员类型',res)
				if(res.ret){
					this.ryList = res.data
					this.ryList.unshift({id:'',name:'全部'})
				}
			})
			getOrgList().then(res=>{
				console.log('获取机构列表',res)
				if(res.ret){
					this.orgList = res.data
				}
			})
		},
		methods: {
			chooseJg(e){
				this.post.orgId = e.value;
				this.jgText = e.label
			},
			changePop () {
			    if (this.popShow) {
			        uni.showTabBar({animation:true})
			    } else {
			        uni.hideTabBar({animation:true})
			    }
				this.popShow = !this.popShow
			},
			idToInfor(str){
				return idToInfor(str).age
			},
			upCallback(page) {
				this.getJySignList(page);
			},
			resert(){
				this.post.nameOrIdno = ''
				this.$set(this.post,'ryType',['全部'])
				this.$set(this.post,'orgId','')
				this.$set(this.post,'isSign','')
				this.jgText = '全部机构'
			},
			search(){
				this.list=[];
				this.mescroll.resetUpScroll()
			},
			// 获取随访列表
			getJySignList(page){
                let pageNum = page.num; // 页码, 默认从1开始
                let pageSize = page.size; // 页长, 默认每页5条
				this.post.startRow = this.list.length;
				console.log('查询条件',this.post)
				getJySignList(this.post).then(res=>{
					console.log('签约列表获取',res)
					this.signNum = res.size;
					if(res.ret){
						if(page.num == 1) this.list = []; //如果是第一页需手动置空列表
						this.list = this.list.concat(res.data.signList); //追加新数据

						this.mescroll.endByPage(res.data.signList.length, Math.ceil(this.signNum/10));
					} else {
						console.log('res点false')
						this.mescroll.endErr()
					}
				},(err)=>{
					console.log('请求错误原因',err)
					this.mescroll.endErr()
				})
			},
			linkTo(id,name){
				uni.navigateTo({
					url:'./jylyRecord/jylyRecord' + '?id=' + id + '&name=' + name
				})
			},
			classJudge(val){
				return this.signConfig[val-1].className
			},
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
	.doctor_appoint{
		// 搜索框
		.pop-content{
			padding: 20rpx;
			.search-title{
				margin-top: 20rpx;
				margin-bottom: 30rpx;
				font-size:30rpx;
				font-weight:500;
				color:rgba(153,153,153,1);
			}
			.select{
				width:100%;
				height:88rpx;
				background:rgba(246,246,246,1);
				border-radius:4rpx;
				display: flex;
				align-items: center;
				box-sizing: border-box;
				padding: 0 30rpx;
				justify-content: space-between;
				.orgname{
					font-size:30rpx;
					font-weight:400;
					color:rgba(51,51,51,1);
				}
				.iconfont{
					color: #999999;
				}
			}
		}
		.nav_title{
			z-index: 20;
			position:fixed;
			top: 83rpx;
			width: 100%;
			height: 48upx;
			line-height: 48upx;
			font-size:24upx;
			font-weight:500;
			color:rgba(102,102,102,1);
			text-align: center;
			background:#cfe6f8;
		}
		.content{
			margin-top: 32rpx;
			padding: 20rpx;
			.content_item{
				display: flex;
				padding: 22upx 10upx;
				background-color: #fff;
				margin-bottom: 20rpx;
				border-radius: 10rpx;
				border-bottom: 1upx solid rgba(238,238,238,1);
				.item_left{				
					width: 240upx;
                    overflow: hidden;
					background-image: url('/static/image/err.png');
					background-size:cover;
					background-repeat:no-repeat;
					border-radius:10px;
					img{
						width: 240upx;
						height: 240upx;
					}
				}
				.item_right{
					margin-left: 28rpx;
					flex: 1;
					height: 304upx;
					box-sizing: border-box;
					flex: 1;
					font-size:24upx;
					position: relative;
					.baseInfor{
						position: relative;
						line-height: 50upx;
						font-size:30upx;
						font-weight:500;
						color:rgba(51,51,51,1);
						.signClass{
							color: #FFFFFF;
							font-size: 20upx;
							line-height: 40upx;
							text-align: center;
							width:100upx;
							height:40upx;
							border-radius:20px;
							position: absolute;
							right: 0upx;
							top: 10upx;
						}
						.signed{
							background-color: #24BF00;
						}
						.continuSign{
							background-color: #FF9600;
						}
						.overdue{
							background-color: #FF0000;
						}
						span{
							margin-right: 30upx;
						}
					}
					.id_card{
						line-height: 40upx;
						.iconfont{
							color: #35A8FF;
							margin-right: 11upx;
						}
					}
					.yl_org{
						line-height: 40upx;
						.iconfont{
							color: #24BF00;
							margin-right: 11upx;
						}
					}
					.ry_type{
						height: 40rpx;
						.ry_item{
							margin-right: 10rpx;
							float: left;
							text-align: center;
							padding: 0 8rpx;
							height:40upx;
							font-size: 22upx;
							line-height: 40upx;
							background-color: #d7eeff;
							border-radius:4upx;
							color: #0091FE;
						}
						.org{
							background-color: #ffe3cc;
							color: #FF7200;
						}
					}
					.servePock_type{
						line-height: 40upx;
					}
					.sign_time{
						line-height: 40upx;
					}
				}	
			}
		}
	}
</style>