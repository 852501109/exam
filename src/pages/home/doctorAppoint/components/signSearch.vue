<template>
	<view v-show="show" id="popContainer">
		<view class="status_bar">
		    <!-- 这里是状态栏 -->
		</view>
		<view class="navBar" >
			<view class="left">
				<view class="search-box">
					<i class="iconfont icon-sousuo"></i>
					<input placeholder="" class="search-input" confirm-type="search" @confirm="search" />
					<i class="iconfont icon-maikefeng"></i>
				</view>
			</view>
			<view class="right" @tap="changePop()" >取消</view>
		</view>
		<view class="content">
			<view class="title" >按机构筛选</view>
			<view class="chose_org">
				<picker mode="selector" :range="jgList" @change="changeJg"  :key="jgIndex.checked" class="jgCss">
					<view>{{jgList[jgIndex.checked]}}</view>		
				</picker>
				<i class="iconfont icon-to"></i>
			</view>
			<view class="title" >人员类型</view>
			<view class="chose_rytype">
				<checkbox-group class="ry-group" @change="checkboxChange" style="flex-wrap:flex-wrap">
					<label class="jktj-item" v-for="(item,index) in rtType"  :key="item.value" :class="item.checked?'checked':'nochecked'">
						{{item.value}}<checkbox :value="item.value" :checked="item.checked" style="display: none;" />
					</label>
				</checkbox-group>
			</view>
			<view class="title" >是否收费</view>
			<view class="chose_tjStatus">
				<radio-group @change="radioChange">
					<label  class="radio-item" v-for="(item, index) in tjStatus" :key="item.value" :class="item.checked?'checked':'nochecked'">
						<view>
							{{item.value}}
							<radio :value="item.value" :checked="item.checked" style="display: none;"/>
						</view>
					</label>
				</radio-group>
			</view>
			<!-- <view class="title" >签约状态</view>
			<view class="chose_qyStatus">
				<radio-group @change="jyqyChange">
					<label  class="radio-item" v-for="(item, index) in qyStatus" :key="item.value" :class="item.checked?'checked':'nochecked'">
						<view>
							{{item.value}}
							<radio :value="item.value" :checked="item.checked" style="display: none;"/>
						</view>
					</label>
				</radio-group>
			</view> -->
		</view>
		<view class="btn">
			<view class="resert">重置</view>
			<view class="ok" type="primary" >确定</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'JmSearch',
		props: {
			show: {
				type: Boolean,
				default: true
			},
			rtType: {
				type: Array,
				default () {
					return [
					]
				}
			},
			tjStatus: {
				type: Array,
				default () {
					return [
					]
				}
			},
			qyStatus: {
				type: Array,
				default () {
					return [
					]
				}
			},
			jgList: {
				type: Array,
				default () {
					return [
					]
				}
			},
			jgIndex: {
				type: Object,
				default () {
					return {
						checked: 0
					}
				}
			}
		},
		data() {
			return {
				
			};
		},
		methods:{
			search () {
				
			},
			checkboxChange (e){
				var items = this.rtType,
				values = e.detail.value;
				for (var i = 0, lenI = items.length; i < lenI; ++i) {
					const item = items[i]
					if(values.includes(item.value)){
						this.$set(item,'checked',true)
					} else {
						this.$set(item,'checked',false)
					}
				}			
			},
			changePop () {
				this.$emit('changePop')
				uni.showTabBar({animation:true})
			},
			radioChange (evt){
				var items = this.tjStatus
				for (let i = 0; i < this.tjStatus.length; i++) {
					const item = items[i]
					if (this.tjStatus[i].value === evt.target.value) {
						this.$set(item,'checked',true)
					} else {
						this.$set(item,'checked',false)
					}
				}
			},
			jyqyChange (evt){
				var items = this.qyStatus
				for (let i = 0; i < this.qyStatus.length; i++) {
					const item = items[i]
					if (this.qyStatus[i].value === evt.target.value) {
						this.$set(item,'checked',true)
					} else {
						this.$set(item,'checked',false)
					}
				}
			},
			changeJg (e) {
				this.jgIndex.checked = e.target.value
				this.$emit('changeJg', e.target.value)
			}
		},
		created() {
			
		},
		watch:{
			
		}
	}
</script>

<style lang="scss" >
	/*占位导航栏样式*/
	.status_bar {
	      height: var(--status-bar-height);
	      width: 100%;
		  background-color: #FFFFFF;
	 }
	#popContainer{
		position: fixed;
		width: 100%;
		height: 100%;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: rgba(255, 255, 255, 1);
		z-index: 1111;
		.navBar{
			height:80rpx;
			background-color:#FFFFFF; 
			color:rgba(51, 51, 51, 1);
			display: flex;
			.left{
				width:80%;
				padding: 14upx 20upx;
				.search-box{
					padding-right:50upx ;
					height: 60upx;
					position: relative;
					border:1px solid rgba(238,238,238,1);
					border-radius:10upx;
					background-color: rgba(242, 242, 250, 1);
					.icon-sousuo{
						position:absolute;
						top: 50%;
						margin-top: -16upx;
						margin-left: 16upx;
					}
					.icon-maikefeng{
						position: absolute;
						top: 50%;
						right: 20upx;
						margin-top: -16upx;
						color: rgba(53, 168, 255, 1);
					}
					input{						
						margin: 12upx 0upx 12upx 64upx;						
					}
				}
			}
			.right{
				width:20%;
				margin-top: 12upx;
				text-align: center;
			}
			.right::before{				
				display: inline-block;
				content: "";
				height: 100%;
				vertical-align: middle;
			}
		}
		.content{
			padding: 10upx 20upx;
			.title{
				margin-top: 30upx;
				font-size:30upx;
				font-weight:500;
				color:rgba(153,153,153,1);
			}
			.chose_org{
				position: relative;
				width: 100%;
				margin-top: 20upx;
				height:88upx;
				background:rgba(246,246,246,1);
				border-radius:4px;
				.jgCss{
					width: 100%;
					position: absolute;
					left: 0;
					top: 50%;
					font-size: 28upx;
					margin-top: -14upx;
					margin-left: 30upx;
				}
				.icon-to{
					position: absolute;
					right: 0;
					top: 50%;
					font-size: 22upx;
					color: rgba(153, 153, 153, 1);
					margin-top: -12upx;
					margin-right: 30upx;
				}
			}
			.chose_rytype{		
				.ry-group{
					.jktj-item{
						display: inline-block;
						text-align: center;
						line-height: 60upx;
						font-size:30upx;
						font-weight:400;
						color:rgba(51,51,51,1);
						margin-right: 23upx;
						margin-top: 20upx;
						width:150upx;
						height:60upx;
						background:rgba(246,246,246,1);
						border-radius:4upx;
					}
					.checked{
						color:rgba(53, 168, 255, 1) ;
						background-color: #eaf6ff;
					}
				}			
			}
			.chose_tjStatus{
				.radio-item{
					display: inline-block;
					text-align: center;
					line-height: 60upx;
					font-size:30upx;
					font-weight:400;
					color:rgba(51,51,51,1);
					margin-right: 23upx;
					margin-top: 20upx;
					width:150upx;
					height:60upx;
					background:rgba(246,246,246,1);
					border-radius:4upx;						
				}
				.checked{
					color:rgba(53, 168, 255, 1) ;
					background-color: #eaf6ff;
				}				
			}
			.chose_qyStatus{
				.radio-item{
					display: inline-block;
					text-align: center;
					line-height: 60upx;
					font-size:30upx;
					font-weight:400;
					color:rgba(51,51,51,1);
					margin-right: 23upx;
					margin-top: 20upx;
					width:150upx;
					height:60upx;
					background:rgba(246,246,246,1);
					border-radius:4upx;						
				}
				.checked{
					color:rgba(53, 168, 255, 1) ;
					background-color: #eaf6ff;
				}				
			}
		}
		.btn{
			position: fixed;
			width: 100%;
			bottom: 0;
			display: flex;
			.resert{
				width: 50%;
				height: 88upx;
				line-height: 88upx;
				text-align: center;
				background-color: rgba(229, 229, 229, 1);
			}
			.ok{
				width: 50%;
				height: 88upx;
				line-height: 88upx;
				border: none;
				text-align: center;
				background-color: rgba(53, 168, 255, 1);
				color: #FFFFFF;
			}
		}		
	}
</style>