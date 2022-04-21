<template>
	<view class="workNotice">
		<view class="status_bar">
		<!-- 这里是状态栏 -->
		</view>
		<uni-nav-bar :isBack="true" fixed="true" title="工作提醒" height="40rpx" background-color="#35A8FF" color="#FFFFFF">
			<view slot="right">
				<i class="iconfont icon-fangdajing" @tap="changePop()" ></i>
			</view>
		</uni-nav-bar>
		<!-- body -->
		<view class="content">
			<view class="noNotice" v-show="noticeList.length<0">暂无提醒</view>
			<mescroll-body ref="mescrollRef" @up="upCallback" :down="{use:false}" :up="upOption" >
				<uni-swipe-action :threshold="200" v-for="(item,index) in noticeList" :key='index' class="swiper-item">
					<uni-swipe-action-item :right-options="options" @click="onClick(item.id)">
						<view class="card" @tap="linkTo(item.ehrId,item.imgurl,item.idCard,item.orgId,item.orgName,item.id,item.type)">
							<view class="left">
								<view class="imgBox">
									<img class="img"
									v-show="item.image"
									:src="$IMGURL+item.image"
									/>
								</view>
							</view>
							<view class="infor">
								<view class="name">
									<text>{{item.name}}</text><text>{{item.gender}}</text><text>{{item.age}}岁</text>
									<view v-show="item.status" :class="item.status=='已逾期'?'yq':'soonYq'" class="status">{{item.status}}</view>
								</view>
								<view class="phone">
									<text class="iconfont icon-shouji"></text><span>{{item.tel}}</span>
								</view>
								<view class="org">
									<text class="iconfont icon-yiliaojigou"></text><span>{{item.orgName}}&nbsp;{{item.group}}</span>
								</view>
								<view class="type">
									<view class="type-item" :class="item.type=='高血压'? 'gxy':'tnb'">{{item.type}}</view>
								</view>
								<view class="time">
									<text>计划随访时间:</text><span>{{item.planDate}}</span><span class="doctorName">{{item.doctorName}}</span>
								</view>
							</view>
						</view>
					</uni-swipe-action-item>	
				</uni-swipe-action>	
			</mescroll-body>	
		</view>
		<self-search-pop
		v-model="show"
		@resert="resert"
		@ok="searchHandle()"
		>
		<view slot="content">
			<self-search-input
			v-model="post.nameOrIdno"
			@cancel="cancel()"
			placeholder="输入姓名或身份证号搜索"
			@confirm="getMbPlanList()"
			></self-search-input>
			<view class="searchContent">
				<view class="searchTitle">按机构筛选</view>
				<my-picker
				:picker-key="{value: 'id', label: 'name', }"
				:picker-list="orgList"
				@confirm="chooseJg($event)">
					<view class="choose-card">				
						<view class="jgCss" v-text="post.orgId?jgText:'全部机构'"></view>
						<text class="iconfont icon-arrow-right"></text>
					</view>
				</my-picker>
				<view class="searchTitle">时间范围</view>
				<view class="yqTime">
					<view class="yqItem" @tap="post.day=item.value" :class="item.value == post.day?'active':''" v-for="(item,idnex) in yqTime">{{item.text}}</view>
				</view>
				<view class="searchTitle">是否逾期</view>
				<view class="yqbtn" @tap="yqHandle()" :class="{'active':post.status==1}">已逾期</view>
				<view class="searchTitle" >根据组筛选</view>
				<view class="groups">
					<input type="text" value="" v-model="post.groups" />
				</view>
				<view class="notice">多个组之间用【,】分割(示例：0,9,23)或一组,二组</view>
				
				<mx-date-picker 
				:showHoliday="false"
				:showTips="false"
				:showSeconds="false" 
				:show="showPicker" 
				:type="type"
				format="yyyy-mm-dd"
				:value="value" 
				:show-tips="true" 
				:show-seconds="true" 
				@confirm="onSelected" 
				@cancel="onCancel" />
			</view>
		</view>
		</self-search-pop>
		<self-sign-pop 
		title="请选择延迟时间"
		leftText="取消"
		rightText="确定"
		@rightHandle="okLaterHandle()"
		v-model="showYq">
			<view class="lateTime">
				<self-radio
				v-model="late.day"
				:list="lateList"
				></self-radio>
			</view>
		</self-sign-pop>
	</view>	
</template>

<script>
	import selfSearchInput from '@/components/self-search-input/self-search-input.vue';
	import selfSearchPop from '@/components/self-search-pop/self-search-pop.vue';
	import MxDatePicker from "@/components/mx-datepicker/mx-datepicker.vue";
	import { getMbPlanList,updatePlan } from '@/request/notice.js'
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";	
	import { getOrgList } from '@/request/user.js'
	import myPicker from '@/components/my-picker/Picker.vue'
	import selfSignPop from '@/components/self-sign-pop/self-sign-pop.vue'
	import selfRadio from '@/components/self-radio/self-radio.vue'
	export default {
		components: { selfSearchPop,selfSearchInput,myPicker,MxDatePicker,selfRadio,selfSignPop },
		mixins: [MescrollMixin], // 使用mixin
		data() {
			return {
				jgText:'',
				showPicker: false,
				type: 'range',
				value: '',
				searchInput:'',
				// 搜索页面显示
				show:false,
				TabCur: 0,
				upOption: {
					page: {
						size: 10 // 每页数据的数量,默认10
					},
					noMoreSize: 5, // 配置列表的总数量要大于等于5条才显示'-- END --'的提示
					empty: {
						tip: '暂无相关数据'
					}
				},
				options:[
					{
						text: '延期提醒',
						style: {
							backgroundColor: '#FE9C01',
                            fontSize: '34rpx'
						}
					}
				],
				yqTime:[
					{text:'一周',value:7},
					{text:'两周',value:14},
					{text:'一个月',value:30}
				],
				orgList:[
				],
				post:{
					orgId:'',
					nameOrIdno:'',
					startRow:'0',
					size:10,
					status:'',
					day:7,
					groups:'',
				},
				// 延期数据
				lateList:[
					{text:'一个周',value:'7'},
					{text:'一个月',value:'30'},
					{text:'三个月',value:'90'},
					{text:'不再提醒',value:'0'}
				],
				late:{
					day:'7',
					id:''
				},
				showYq:false,
				noticeList:[],
			};
		},
		onReady() {
			console.log('获取groudp')
			const that = this
			uni.getStorage({
				key: 'group',
			    success: function (res) {
					console.log(res.data)
					that.$set(that.post,'groups',res.data)
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
		created() {
			getOrgList().then(res=>{
				//console.log('获取机构列表',res)
				if(res.ret){
					this.orgList = res.data
				}
			})
		},
		methods:{
			linkTo(ehrId,url,idCard,orgId,orgName,id,type){
				var gourl = '/pages/home/diseaseVisit/sfRecord/sfRecord'
				var diabetesId = ''
				var hypertensionId = ''
				if(type=='糖尿病'){
					diabetesId = id 
				}
				if(type=='高血压'){
					hypertensionId = id 
				}
				uni.navigateTo({
					url:gourl + '?ehrId=' + ehrId + '&url=' + url +'&idCard=' + idCard + '&orgId=' + orgId + '&orgName=' + orgName  + '&diabetesId=' + diabetesId + '&hypertensionId=' + hypertensionId
				})
			},
			searchHandle(){
				this.noticeList=[];
				this.mescroll.resetUpScroll()
			},
			yqHandle(){
				this.post.status? this.post.status = '':this.post.status = '1'
			},
			changePop(){
				this.show = !this.show;
			},
			// 延期
			onClick(id){
				this.showYq = true
				this.late.id = id
			},
			// 确定延迟
			okLaterHandle(){
				//console.log(this.late)
				updatePlan(this.late).then(res=>{
					console.log('延期返回',res)
					if(res.ret){
						this.$showToast('延期成功')
						this.searchHandle()
					}
					this.showYq = false;
					this.getMbPlanList();
				},err=>{
					
				})
			},
			resert(){
				this.post.nameOrIdno = ''
				this.$set(this.post,'ryType',[])
				this.$set(this.post,'orgId','')
				this.$set(this.post,'groups','')
				this.jgText = '' 
				this.post.day = 7
				this.post.status = ''
			},
			upCallback(page) {
				this.getMbPlanList(page);
			},
			chooseJg(e){
				this.post.orgId = e.value;
				this.jgText = e.label
			},
			getMbPlanList(page){
				var post = {}
				post = JSON.parse(JSON.stringify(this.post))
				post.groups = post.groups.replace(new RegExp("，","gm"),",")
				post.groups = post.groups.split(',')
				post.startRow = this.noticeList.length;
				console.log('查询条件',post)
				getMbPlanList(post).then(res =>{
					console.log('居民档案列表获取',res)
					if(res.ret){
				        if(page.num == 1) this.noticeList = []; //如果是第一页需手动置空列表
				        this.noticeList = this.noticeList.concat(res.data.list); //追加新数据
				        this.mescroll.endByPage(res.data.list.length, Math.ceil(res.data.count/10));
					} else {
						this.mescroll.endErr()
					}
				},(err)=>{
					console.log('请求错误原因',err)
					this.mescroll.endErr()
				})
			},
			onShowDatePicker(type){
				this.showPicker = true;
			},
			onSelected(result){
				this.value = result['value']
				this.showPicker = false;
			},
			onCancel(){
				this.value = ''
				this.showPicker = false;
			},
			cancel(){
				this.show = false;
			},
		}
	}
</script>
<style lang="scss">
	page{
		background-color: #f1f1f1;
	}
	/*占位导航栏样式*/
	.status_bar {
		  height: var(--status-bar-height);
		  width: 100%;
		  background-color: rgb(53, 168, 255);
	}
	.workNotice{
		.content{
			height: 100%;
			padding: 20rpx;
			.noNotice{
				text-align: center;
				font-size: 30rpx;
				line-height: 120rpx;
			}
			.swiper-item{
				margin-bottom: 20rpx;
			}
		}
		.card{
			width: 100%;
			background-color: #fff;
			border-radius: 10rpx;
			display: flex;
			box-sizing: border-box;
			.left{
				width:240rpx;
				height:227rpx;
				padding: 20rpx;
				.imgBox{
					background-image: url('/static/image/err.png');
					background-size:cover;
					background-repeat:no-repeat;
					width:240rpx;
					height:227rpx;
					border-radius:10rpx;
					img{
						width:240rpx;
						height:227rpx;
						border-radius:10rpx;
					}
				}	
			}
			.infor{
				flex: 1;
				padding: 20rpx 0;
				margin-left: 10rpx;	
				font-size:24rpx;
				font-weight:400;
				color:rgba(51,51,51,1);
				position: relative;
				.name{
					font-size:30rpx;
					font-weight:500;
					color:#333333;
					line-height: 30rpx;
					margin-bottom: 30rpx;
					text{
						margin-right: 30rpx;
					}
					.status{
						position: absolute;
						top: 18rpx;
						right: 20rpx;
						text-align: center;
						line-height: 40rpx;
						width:100rpx;
						height:40rpx;
						font-size:20rpx;
						color: #fff;
						border-radius:20rpx;
					}
					.yq{
						background:rgba(255,0,0,1);
					}
					.soonYq{
						background-color: #FF9600;
					}
				}
				.phone{
					margin-bottom: 18rpx;
					font-size: 26rpx;
					line-height: 20rpx;
					.iconfont{
						margin-right: 10rpx;
						font-size: 24rpx;
						color: #35A8FF;
					}
				}
				.type{
					.type-item{
						margin-bottom: 16rpx;
						margin-right: 20rpx;
						border-radius: 4rpx;
						color: #fff;
						width:95rpx;
						height:40rpx;
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
				.org{
					margin-bottom: 16rpx;
					line-height: 20rpx;font-size: 20rpx;
					font-size: 26rpx;
					.iconfont{
						margin-right: 10rpx;
						font-size: 24rpx;
						color: #24BF00;
					}
				}
				.doctorName{
					margin-left: 20rpx;
				}
			}
		}
		.searchContent{
			padding: 10rpx 20rpx;
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
			.yqbtn{
				border-radius: 10rpx;
				font-weight: 400;
				font-size: 30rpx;
				line-height: 60rpx;
				text-align: center;
				color: #707084;
				background: #f5f9ff;
				width: 120rpx;
				height: 60rpx;
			}
			.active{
				background-color: #35A8FF;
				color: #fff;
			}
			.yqTime{
				display: flex;
				.yqItem{
					margin-right: 32rpx;
					border-radius: 10rpx;
					font-weight: 400;
					font-size: 30rpx;
					line-height: 60rpx;
					text-align: center;
					color: #707084;
					background: #f5f9ff;
					width: 120rpx;
					height: 60rpx;
				}
				.active{
					background-color: #35A8FF;
					color: #fff;
				}
			}
			.searchTitle{
				line-height: 88rpx;
				height: 88rpx;
				font-size:30rpx;
				font-weight:500;
				color:rgba(153,153,153,1);
			}
			.choose-card{
				width: 100%;
				height:88rpx;
				background:rgba(246,246,246,1);
				border-radius:4rpx;
				display: flex;
				align-items: center;
				padding: 0 30rpx;
				box-sizing: border-box;
				justify-content: space-between;
				.jgCss{
					font-size:30rpx;
					font-weight:400;
					color:rgba(51,51,51,1);
				}
				.chose-val{
					font-size:30rpx;
					font-weight:400;
					color:rgba(51,51,51,1);
					line-height: 88rpx;
					height:88rpx;
				}
				.icon-arrow-right{
					font-size: 28rpx;
					color: #999999;
				}
			}
		}
		.lateTime{
			padding:0 20rpx;
		}
	}
</style>
