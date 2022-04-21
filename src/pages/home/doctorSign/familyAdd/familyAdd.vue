<template>
	<view>
		<view class="nav" >
			<view class="backBtn">
				<view class="iconfont icon-fanhui" @tap="back"></view>
			</view>
			<view class="inputBox">
				<i class="iconfont icon-sousuo"></i>
				<input type="text" @input="search()" v-model="post.nameOrIdno"> 
				
					<view class="select">
						<my-picker
						:picker-key="{value: 'id', label: 'name', }"
						:picker-list="orgList"
						@confirm="chooseJg($event)">
						<view class="orgname">{{jgText}}</view>
						</my-picker>
					</view>	
				
				<span class="iconfont icon-quxiao" @tap="deleteSelect"></span>
			</view>
			<view class="finshBtn" @tap="ok">完成</view>
		</view>
		
		<view class="content">
			<mescroll-body ref="mescrollRef" @up="upCallback" :down="{use:false}" :up="upOption" >
				<view class="personName">
					<view class="personDetail" v-for="(item,index) in list" @tap="checkedItem(index,item)" :class="{selected:flag==index}" :key="index">
						<view class="iconBox">
							<view class="iconfont icon-layout-yonghuxinxi" ></view>
						</view>
						<view class="nameBox">{{item.name}}</view>
						<view class="sexBox">{{item.gender}}</view>
						<view class="ageBox">{{idToInfor(item.idCard)}}岁</view>
						<view class="idcardBox">{{item.idCard|IdcardEncry}}</view>
					</view>
					<view class="tipMessage" v-show="">
						<view>没有查到此人，您可点击"完成"</view>
					</view>
				</view>
			</mescroll-body>
		</view>
	</view>
</template>

<script>
	import { idToInfor } from '@/common/tool.js'
	import { getComEhrList } from '@/request/jmda.js'
	import { getOrgList} from '@/request/user.js'
	import myPicker from '@/components/my-picker/Picker.vue'
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	export default {
		mixins: [MescrollMixin], // 使用mixin
		components:{myPicker},
		data() {
			return {
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
				post:{
					isSign:'',
					groups:'',
					nameOrIdno : '',
					orgId:'',
					startRow:'',
					size: 10,
					status:'1',
				},
				flag : -1,
				list:[],
				orgList:[],
				num:'',
			};
		},
		onLoad: function(option) {
			this.num = option.index
		},
		created() {
			//获取机构
			getOrgList().then(res=>{
				console.log('获取机构列表',res)
				if(res.ret){
					this.orgList = res.data
					this.orgList.unshift({id:'',name:'全部机构'})
					console.log(this.orgList)
				}
			})
		},
		methods:{
			//删除输入框内容
			deleteSelect(){
				this.post.nameOrIdno=''
				
			},
			//获取年龄
			idToInfor(str){
				return idToInfor(str).age
			},
			//调用搜索
			search(){
				this.list=[];
				this.mescroll.resetUpScroll()
			},
			// 选择机构
			chooseJg(e){
				this.post.orgId = e.value;
				this.jgText = e.label
				this.list=[];
				this.mescroll.resetUpScroll()	
			},
			//回退
			back(){
				uni.navigateBack({
						delta: 1
				})
				// uni.navigateTo({
				// 	url: '/pages/home/doctorSign/doctorSign'
				// });
			},
			//确定按钮
			ok(){
				uni.$emit("NAMEBACK",{name:this.post.nameOrIdno,index:this.num});
				uni.navigateBack({
						delta: 1
				})
				// uni.navigateTo({
				// 	url: '/pages/home/doctorSign/doctorSign'
				// });
			},
			//搜索内容
			getComEhrList(page){
				var post = {}
				post = JSON.parse(JSON.stringify(this.post))
				post.startRow = this.list.length;
				console.log('查询条件',post)
				getComEhrList(post).then(res =>{
					console.log('人员查询列表获取',res)
					if(res.ret){
						this.total = res.size
				        if(page.num == 1) this.list = []; //如果是第一页需手动置空列表
				        this.list = this.list.concat(res.data.ehrList); //追加新数据
						console.log('list里面的数据',this.list)
				        this.mescroll.endByPage(res.data.ehrList.length, Math.ceil(res.size/10));
					} else {
						this.mescroll.endErr()
					}
				},(err)=>{
					console.log('请求错误原因',err)
					this.mescroll.endErr()
				})
			},
			upCallback(page) {
			    this.getComEhrList(page);
			},
			//选中某一条
			checkedItem(index,item){
				this.flag = index;
				uni.$emit("NAMEBACK",{name:item.name,index:this.num});
				uni.navigateBack({
						delta: 1
				})
			}
		},
		filters: {
		  IdcardEncry: function(val) {
		    return val && val.substr(0, 6) + '********' + val.substr(val.length-4, 4)
		  }
		},
	}
</script>

<style lang="scss">
	@mixin flexCss($direction) {
	  @if $direction == row  { 
	    display: flex;
		align-items: center;
	  	justify-content: space-between;	
	  } @else if $direction == column{
		display: flex;
		flex-direction: column;
	  }
	}
	page{
		background-color: #E5E5E5;
		.nav{
			background-color: #fff;
			padding: 23rpx;
			box-sizing: border-box;
			@include flexCss(row);
			.backBtn{
				display: inline-block;
				width: 88rpx;
				height: 88rpx;
				.iconfont{
					line-height: 88rpx;
				}
			}
			.inputBox{
				height: 60rpx;
				@include flexCss(row);
				background: #F2F2FA;
				border-radius: 10rpx;
				flex: 1;
				font-size: 30rpx;
				.icon-sousuo{
					margin-left: 20rpx;
					font-size: 24rpx;
					
				}
				.icon-quxiao{
					color: #999999;
					margin-right: 20rpx;
				}
				.select{
					padding-right: 30rpx;
				}
				input{
					flex: 1;
					margin-left: 22rpx;
					line-height: 60rpx;
				}
			}
			.finshBtn{
				display: inline-block;
				font-weight: bold;
				width: 88rpx;
				height: 88rpx;
				margin-left: 24rpx;
				line-height: 88rpx;
				color: #35A8FF;
			}
		}
		.content{
			//搜索框的内容
			.personName{
				background-color: #FFFFFF;
				.personDetail{
					display: flex;
					justify-content: space-around;
					font-size: 30rpx;
					line-height: 42rpx;
					height: 42rpx;
					font-family: PingFang SC;
					border-bottom: 1rpx solid rgba(238, 238, 238, 1);
					padding-top:25rpx;
					padding-bottom: 25rpx;
					.nameBox{
						margin-left: -24rpx;
					}
					.sexBox{
						margin-left: -34rpx;
					}
					.ageBox{
						margin-left: -34rpx;
					}
				}
				.selected {
					// color: white;
					background-color: #E5E5E5;
				}
			}
			.tipMessage{
				display: flex;
				justify-content: space-around;
				padding-top: 25rpx;
				padding-bottom: 25rpx;
			}
		}
	}
</style>
