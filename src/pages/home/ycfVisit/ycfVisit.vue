<template>
	<view class="doctor_appoint">
		<view class="status_bar">
		<!-- 这里是状态栏 -->
		</view>
		<uni-nav-bar  fixed="true" title="孕产妇随访" height="40rpx" background-color="#35A8FF" color="#FFFFFF">
			<view slot="left" @tap="back()">
				<uni-icons color="color" type="back" size="24"/>	
			</view>
			<view slot="right" @click="newBuild()" style="margin-right: 12rpx;">新建</view>
			<view slot="right">
				<i class="iconfont icon-fangdajing" @tap="popShow=true"></i>
			</view>
		</uni-nav-bar>
		<view class="nav_title">
			查询到{{total}}人
		</view>
		<view class="content">
			<mescroll-body ref="mescrollRef" @up="upCallback" :down="{use:false}" :up="upOption" >
				<view class="content_item" 
				@tap="linkTo(item.idCard,item.cardId,item.id)" v-for="(item, index) in list" :key="index">
					<view class="item_left">
						<img 
						v-show="item.imgUrl"
						:src="$IMGURL + item.imgUrl"
						alt="">
					</view>
					<view class="item_right">
						<view class="baseInfor">
							<span>{{item.name}}</span>
							<span>{{item.age}}岁</span>
							<view class="out" v-show="item.emigrationFlag==3">已完成</view>
						</view>
						<view class="id_card">
							<i class="iconfont icon-Id"></i>
							<text class="inforCon">{{item.idCard|IdcardEncry}}</text>
						</view>
						<view class="yl_org">
							<i class="iconfont icon-yiliaojigou"></i>
							<span>{{item.orgName}}&nbsp;{{item.group}}</span>	
						</view>
						<view class="yl_org">
							<span>上次随访：{{item.lastSfDate}}</span>	
						</view>
					</view>
					<view class="production">{{getYcfTitle(item.type)}}</view>
				</view>
			</mescroll-body>
		</view>
		<!-- search-pop -->
		<selfSearchPop
			v-model="popShow"
			@resert="resert"
			@ok="search"
		 >
			<view slot="content">
				<selfSearchInput
				  v-model="post.nameOrIdno"
				  @cancel="popShow=false"
				  @confirm="search"
				  placeholder="输入姓名或身份证号搜索"
				></selfSearchInput>
				<view class="pop-content">
					<view class="search-title">状态</view>
					<view class="chose_rytype">
						<self-radio-checkbox
						:list="statusList"
						v-model="post.status"
						></self-radio-checkbox>
					</view>
				</view>
			</view>
		</selfSearchPop>
	</view>
</template>

<script>
	import { idToInfor } from '@/common/tool.js'
	import { getYcfSfList } from '@/request/ycfSf.js'
	import { getOrgList } from '@/request/user.js'
	import MxDatePicker from "@/components/mx-datepicker/mx-datepicker.vue";	
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";	
	import selfSearchPop from '@/components/self-search-pop/self-search-pop.vue'
	import selfSearchInput from '@/components/self-search-input/self-search-input.vue'
	import selfRyCheckbox from '@/components/self-ry-checkbox/self-ry-checkbox.vue'
	import myPicker from '@/components/my-picker/Picker.vue'
	import selfRadioCheckbox from '@/components/self-radio-checkbox/index.vue'
	export default {
		mixins: [MescrollMixin], // 使用mixin
		components:{ MxDatePicker, myPicker,selfRadioCheckbox,selfSearchPop, selfSearchInput,selfRyCheckbox },
		data() {
			return {
				// 时间间隔选择器
				showPicker:false,
				total:'',
				jgText:'全部机构',
				upOption: {
					page: {
						size: 10 // 每页数据的数量,默认10
					},
					noMoreSize: 5, // 配置列表的总数量要大于等于5条才显示'-- END --'的提示
					empty: {
						tip: '暂无相关数据'
					}
				},
				// 查询条件
				post:{
					orgId:'',
					nameOrIdno:'',
					startRow:'',
					size: 10,
					status:'1',
				},
				statusList:[
					{value:'1',name:'未完成'},
					{value:'',name:'全部'},
					{value:'3',name:'已完成'}
				],
				// 查询机构列表
				orgList:[],
				popShow:false,
				searchValue:'',
				signConfig:[
					{className:'continuSign'},
					{className:'overdue'}		
				],			
				list:[
					// {
						//idCard点击新增传 //点击卡片传id
					// 	imgurl:'static/image/head.jpg',
					// 	name:'布罗斯李',
					// 	gender:'男',
					// 	age:20,
					// 	idCard:'',
					//  orgId:'',
					// 	orgName:'某某卫生室',
					// 	ryType:['高血压','糖尿病'],
					// 	lastSf:'2012-12-25'
					//  糖尿病管理卡id
					//  diabetesId:'',
					//  高血压管理卡id
					//  hypertensionId:'',
					// }
				]
			}
		},
        filters: {
          IdcardEncry: function(val) {
            return val && val.substr(0, 6) + '********' + val.substr(val.length-4, 4)
          }
        },
		created() {
			getOrgList().then(res=>{
				console.log('获取机构列表',res)
				if(res.ret){
					this.orgList = res.data
				}
			})
		},
		onBackPress(event){
			if(this.popShow) {
			    this.changePop()
			    return true
			} else {
				uni.switchTab({
				    url: '/pages/home/index'
				});
				return true
			}
			
		},
		onLoad: function(){
			uni.$on('YCFLIST_RELOAD', res => {
			    console.log('YCFLIST_RELOAD')
				this.search()
			})
		},
		onUnload: function () {
		    uni.$off('YCFLIST_RELOAD')
		},
		onReady() {
			const that = this
		},
		computed:{	
		},
		methods: {
			getYcfTitle(aim){
				aim = Number(aim)
				var title = ''
				switch(aim) {
				     case 1:
					 title = '13周前'
					 return title;
					   break;
				     case 2:
					 title = '16-20周'
					 return title;
				        break;
					case 3:
					 title = '21-24周'
					 return title;
					   break;
					case 4:
					title = '28-36周'
					return title;
					   break;
					case 5:
					title = '37-40周'
					return title;
					   break;
					case 6:
					title = '产后7天内'
					return title;
					   break;
					case 7:
					title = '产后42天'
					return title;
					    break;	
				    default:
				     return; 
				}   
			},
			//返回主页
			back(){
				uni.switchTab({
				    url: '/pages/home/index'
				});
			},
			//新建档案
			newBuild () {
				uni.navigateTo({	
					url: './ycfCard/ycfCard'
				});
			},
			changePop () {
			    if (this.popShow) {
			        uni.showTabBar({animation:true})
			    }
			    else {
			        uni.hideTabBar({animation:true})
			    }
				this.popShow = !this.popShow
			},
			idToInfor(str){
				return idToInfor(str).age
			},
			// 选择机构
			chooseJg(e){
				this.post.orgId = e.value;
				this.jgText = e.label
			},
			// 重置
			resert(){
				this.post.nameOrIdno = ''
				this.$set(this.post,'orgId','')
				this.jgText = '全部机构'
			},
			search(post){
				this.list=[];
				this.mescroll.resetUpScroll()
			},
			// 获取孕产妇随访列表
			getYcfSfList(page){
				var post = {}
				post = JSON.parse(JSON.stringify(this.post))
				post.startRow = this.list.length;
				console.log('查询条件',post)
				getYcfSfList(post).then(res =>{
					console.log('孕产妇随访列表获取',res)
					if(res.ret){
						this.total = res.size
				        if(page.num == 1) this.list = []; //如果是第一页需手动置空列表
				        this.list = this.list.concat(res.data.ycfSfList); //追加新数据
						console.log('list里面的数据',this.list)
				        this.mescroll.endByPage(res.data.ycfSfList.length, Math.ceil(res.size/10));
					} else {
						this.mescroll.endErr()
					}
				},(err)=>{
					console.log('请求错误原因',err)
					this.mescroll.endErr()
				})
			},
			upCallback(page) {
			    this.getYcfSfList(page);
			},
			linkTo(idCard,cardId,ehrId){
				var gourl = '/pages/home/ycfVisit/ycfRecord/ycfRecord'
				uni.navigateTo({
					url:gourl + '?idCard=' + idCard + '&cardId=' + cardId + '&ehrId=' + ehrId
				})
			},
			classJudge(val){
				return this.signConfig[val-1].className
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
	.doctor_appoint{
		.nav_title{
			z-index: 20;
			position:fixed;
			top: 60rpx;
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
			margin-top: 40rpx;
			padding: 20upx;
			.content_item{
				position: relative;
				background-color: #FFFFFF;
				display: flex;
				border-radius: 10upx;
				margin-bottom: 20upx;
				padding: 20upx;
				height: 240rpx;
				overflow: hidden;
				border-bottom: 1upx solid rgba(238,238,238,1);
				.item_left{
					width: 240upx;
					height: 250rpx;
					border-radius:10px;
					overflow: hidden;
					background-image: url('/static/image/err.png');
					background-size:cover;
					background-repeat:no-repeat;
					img{
						width:240upx;
						border-radius:10px;
					}
				}
				.item_right{
					margin-left: 30upx;
					flex-grow: 1;
					font-size:24upx;
					.baseInfor{
						position: relative;
						line-height: 100upx;
						font-size:30upx;
						font-weight:500;
						color:rgba(51,51,51,1);
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
						display: flex;
						.ry_item{
							margin: 10upx 8upx 10upx 0;
							text-align: center;
							width:95upx;
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
					.lastSf{
						font-size:24upx;
						font-weight:400;
						color:rgba(51,51,51,1);
						line-height:36upx;
					}
				}
				.production{
					position: absolute;
					right: 0;
					top: 0;
					color: #fff;
					border-radius: 0px 10px 0px 30px;
					text-align: center;
					line-height: 40upx;
					width: 160upx;
					height: 40upx;
					font-size: 26rpx;
					color: rgba(255, 255, 255, 1);
					background-color: #35A8FF;
				}
			}
		}
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
			.groups{
				font-size: 28rpx;
				background-color: #f6f6f6;
				height: 80rpx;
				line-height: 80rpx;
				border-radius: 8rpx;
				margin-top: 20rpx;
				input{
					margin-left: 30rpx;
					height: 80rpx;
					line-height: 80rpx;
				}
			}
			.notice{
				color:#999999;
				margin-top: 15rpx;
				font-size: 26rpx;
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
	}
</style>