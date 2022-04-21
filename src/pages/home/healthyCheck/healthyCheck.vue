<template>
	<view class="healthy_chexk">
		<view class="status_bar">
		<!-- 这里是状态栏 -->
		</view>
		<uni-nav-bar fixed="true" :isBack="true" title="健康体检" height="40rpx" background-color="#35A8FF" color="#FFFFFF">
			<view slot="right">
				<i class="iconfont icon-fangdajing" @tap="popShow=true"></i>
			</view>
		</uni-nav-bar>
		<mescroll-body ref="mescrollRef" @init="mescrollInit" @up="upCallback" :down="{use:false}" :up="upOption" >
			<view class="content_item" v-for="(item, index) in dataList" :key="index" :class="{line:dataList.length-1>index}" @tap="openExamRecord()">
				<view class="left">
					<image :src="item.imgUrl" mode=""></image>
				</view>
				<view class="right">
					 <view class="base-box">									
						 <view class="name">
							<span>{{item.name}}</span>
							<span>{{item.gender}}</span>
							<span>{{item.age}}岁</span>
						 </view>
						 <view class="phone">
							<i class="iconfont icon-Id"></i>
							<span>{{item.idNum}}</span>									
						 </view>
						 <view class="ryType">
							<i class="iconfont icon-yiliaojigou"></i>
							<span>{{item.orgName}}</span>	
						 </view>
						 <view class="orgName">
							<i class="iconfont icon-yuyue"></i>
							<span>{{item.csrq}}</span>	
						 </view>
						  <view class="gttype">
							  <view v-for="(ite,ind) in item.gtgl" :key="ind"  class="gtItem" :class="ite=='高血压'?'gxy':'tnb'">{{ite}}</view>
						  </view>
						 <view class="status-flag" v-text="item.ismbsf?'已生成慢病随访':'未生成慢病随访'" :class="item.ismbsf?'green':'red'" ></view>
					 </view>
				</view>
			</view>
		</mescroll-body>
		
		<self-search-pop
		v-model="popShow"
		>
			<view slot="content">
				<self-search-input
				v-model="searchInput"
				@cancel="cancel()"
				placeholder="输入姓名或身份证号搜索"
				></self-search-input>
				<view class="searchContent">
					<view class="searchTitle">选择机构</view>
					<view class="choose-card">
						<view class="chose-val">全部机构</view>
						<text class="iconfont icon-arrow-right"></text>
					</view>
					<view class="searchTitle">按时间筛选</view>
					<view class="choose-card" @click="onShowDatePicker('range')">
						<view class="chose-val" v-html="value?value[0] + '——' + value[1]:'所有时间'">所有时间</view>
						<text class="iconfont icon-arrow-right"></text>
					</view>
					<view class="searchTitle">人员类型</view>
					<self-checkbox
						:list="ryList"
						v-model="ryChecked"
						col="4"
					></self-checkbox>
					<view class="searchTitle">是否已生成慢病随访</view>
					<view class="isCreate">
						<view class="createItem" @tap="isCreate = '已生成'" :class="isCreate== '已生成'?'active':''">已生成</view>
						<view class="createItem" @tap="isCreate = '未生成'" :class="isCreate== '未生成'?'active':''" >未生成</view>
					</view>
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
		
	</view>
</template>

<script>
	import selfSearchInput from '@/components/self-search-input/self-search-input.vue';
	import selfSearchPop from '@/components/self-search-pop/self-search-pop.vue';
	import MxDatePicker from "@/components/mx-datepicker/mx-datepicker.vue";
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import selfCheckbox from '@/components/self-checkbox/self-checkbox.vue'
	export default {
		mixins: [MescrollMixin], // 使用mixin
		components:{ selfSearchPop,selfSearchInput,MxDatePicker,selfCheckbox},
		data() {
			return {
				popShow:false,
				// 上拉加载的配置(可选)
				upOption: {
					page: {
						size: 10 // 每页数据的数量,默认10
					},
					noMoreSize: 5, // 配置列表的总数量要大于等于5条才显示'-- END --'的提示
					empty: {
						tip: '暂无相关数据'
					}
				},
				// 列表数据
				dataList: [
					{name:'布罗斯李',age:22,gender:'男',imgUrl:'../../../static/image/head.jpg',idNum:'3711***234',orgName:'某某卫生室',csrq:'2019.12.12',ismbsf:true,gtgl:['高血压']},
					{name:'布罗斯张',age:20,gender:'男',imgUrl:'../../../static/image/head.jpg',idNum:'3711***234',orgName:'某某卫生室',csrq:'2019.12.12',ismbsf:false,gtgl:['糖尿病','高血压']},
					{name:'布罗斯孙',age:66,gender:'女',imgUrl:'../../../static/image/head.jpg',idNum:'3711***234',orgName:'某某卫生室',csrq:'2019.12.12',ismbsf:true,gtgl:['糖尿病']},
					{name:'布罗斯孙',age:66,gender:'女',imgUrl:'../../../static/image/head.jpg',idNum:'3711***234',orgName:'某某卫生室',csrq:'2019.12.12',ismbsf:true,gtgl:['糖尿病']}
				],
				
				// 搜索相关参数
				showPicker:false,
				type: 'range',
				value: '',
				searchInput:'',
				ryList:[
					{ text:'全部', value:'全部' },
					{ text:'高血压', value:'高血压'},
					{ text:'糖尿病', value:'糖尿病'},
					{ text:'重精', value:'重精'},
					{ text:'计生特殊', value:'计生特殊'}
				],
				ryChecked:['计生特殊'],
				isCreate:'',
			};
		},
		methods:{
			/*上拉加载的回调*/
			upCallback(page) {
				console.log('上拉加载',page)
				let pageSize = page.size; // 页长, 默认每页10条 //每次请求几条
				// uni.request({
				// 	url: 'xxxx?pageNum='+pageNum+'&pageSize='+pageSize,
				// 	success: (data) => {
				// 		// 如果数据较复杂,可等到渲染完成之后再隐藏下拉加载状态: 如
				// 		this.$nextTick(()=>{
				// 			this.mescroll.endSuccess(curPageLen)
				// 		})												
				// 	},
				// 	fail: () => {
				// 		//  请求失败,隐藏加载状态
				// 		this.mescroll.endErr()
				// 	}
				// })
				setTimeout(()=>{
					this.dataList.push({name:'布罗斯李',age:22,gender:'男',imgUrl:'../../static/image/head.jpg',idNum:'3711***234',orgName:'某某卫生室',csrq:'2019.12.12'})
					this.mescroll.endErr()
				},2000)
			},
			openExamRecord(){
				var url = 'page/examRecord/examRecord'
				uni.navigateTo({
					url:url
				})
			},
			onShowDatePicker(type){
				this.showPicker = true;
				console.log(this[type])
			},
			onSelected(result){
				this.value = result['value']
				this.showPicker = false;
			},
			onCancel(){
				this.value = ''
				this.showPicker = false;
			},
			changePop(){
				this.popShow = true;
			},
			cancel(){
				this.popShow = false;
			}
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
	.healthy_chexk{
		.content_item{
			background-color: #fff;
			margin: 20rpx;
			box-sizing: border-box;
			background-color: #FFFFFF;
			height: 290upx;
			border-radius: 10rpx;
			display: flex;
			padding: 22upx 0 0 40upx;
			.left{
				image{
					width:240upx;
					height:227upx;
					border-radius:10upx;
					margin-right:30upx;
				}
			}
			.right{
				overflow: hidden;
				font-size:28upx;
				font-weight:500;
				color:rgba(51,51,51,1);
				.green{
					font-size:24upx;
					font-weight:400;
					color:rgba(36,191,0,1);
				}
				.red{
					font-size:24upx;
					font-weight:400;
					color:rgba(255,0,0,1);
				}
				.name{
					span{
						margin-right: 30upx;
					}
				}
				.phone{
					margin-top: 12upx;
					font-size:23upx;
					font-weight:400;
					color:rgba(51,51,51,1);
					.iconfont{
						margin-right: 10px;
						font-size:20upx;
						color: rgba(53, 168, 255, 1);
					}
				}
				.ryType{
					font-size:23upx;
					font-weight:400;
					color:rgba(51,51,51,1);
					.iconfont{
						margin-right: 10px;
						font-size:20upx;
						color: rgba(36, 191, 0, 1);
					}
				}
				.orgName{
					margin-top: 16upx;
					font-size:23upx;
					font-weight:400;
					color:rgba(51,51,51,1);
					.iconfont{
						margin-right: 10px;
						font-size:20upx;
						color: rgba(255, 120, 0, 1);
					}
				}
				.gttype{
					margin-top: 16upx;
					display: flex;
					.gtItem{
						width:95rpx;
						height:40rpx;
						line-height: 40rpx;
						font-size: 22rpx;
						text-align: center;
						margin-right: 8rpx;
						border-radius:4rpx;
					}
					.gxy{
						background:#d7eeff;
						color: #52b4ff;
					}
					.tnb{
						background:#ffe3cc;
						color: #ffb585;
					}
				}
				.status-flag{
					margin-top: 12rpx;
				}
			}
		}
		.line {
			border-bottom: 2upx solid #e5e5e5;
		}
		.searchContent{
			padding: 10rpx 20rpx;
			.searchTitle{
				line-height: 88rpx;
				height: 88rpx;
				font-size:30rpx;
				font-weight:500;
				color:rgba(153,153,153,1);
			}
			.isCreate{
				display: flex;
				.createItem{
					background-color: #f5f9ff;
					width: 160rpx;
					height: 60rpx;
					font-weight: 400;
					font-size: 22rpx;
					line-height: 60rpx;
					text-align: center;
					color: #707084;
					margin-right: 23rpx;
					border-radius: 4rpx;
				}
				.active{
					background-color: #35A8FF;
					color: #fff;
				}
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
		
	}

</style>
