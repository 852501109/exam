<template>
	<view class="new_build">
		<uni-nav-bar fixed="true" :title="navTitle" :isBack="true" height="40rpx" background-color="#35A8FF" color="#FFFFFF">
			<view slot="right">
				<view class="finsh" >随访</view>				
			</view>
		</uni-nav-bar>
		<view class="list_box">
			<view class="list_item">
				<view class="list_left">
					<text class="dot">*</text><text>孕产妇姓名:</text>					
				</view>
				<view class="list_right">
					<input type="text" class="name_input" placeholder="请输入用户名" v-model="personInfor.name" value="" />
					<text class="iconfont icon-maikefeng" @tap="startRecognize()"></text>
				</view>
			</view>
			<view class="list_item">
				<view class="list_left">
					<text class="dot">*</text><text>身份证号:</text>					
				</view>
				<view class="list_right">
					<input class="id_input" type="text" placeholder="请输入身份证号码" v-model="personInfor.idno" value="" />
				</view>
			</view>
			<view class="list_item">
				<view class="list_left">
					<text>联系电话:</text>					
				</view>
				<view class="list_right">
					<input class="id_input" type="number" placeholder="请输入用户手机号" v-model="personInfor.tel" value="" />
				</view>
			</view>
			<picker mode="selector" :range="nationList" @change="changeNation" :value="nationIndex" class="pickCss">			
				<view class="list_item">				
					<view class="list_left">
						<text>民族:</text>					
					</view>
					<view class="list_right">
						<view class="nationText">{{nationList[nationIndex]}}</view>
						<i class="iconfont icon-to"></i>
					</view>
				</view>
			</picker>
			<my-picker
			:picker-key="{value: 'id', label: 'name', }"
			:picker-list="orgList"
			@confirm="confirm($event)">
				<view class="sel">
					<view class="list_item">
						<view class="list_left">
							<text>选择机构:</text>					
						</view>
						<view class="list_right">
							<view class="nationText">{{personInfor.orgName}}<i class="iconfont icon-to"></i></view>	
						</view>
					</view>
				</view>
			</my-picker>
			<view class="list_item">
				<view class="list_left">
					<text>家庭住址:</text>					
				</view>
				<view class="list_right">
					<input type="text" class="id_input" placeholder="请输入家庭住址" v-model="personInfor.address" value="" />
					<text class="iconfont icon-dizhi" @tap="openMap()"></text>					
				</view>
			</view>
		</view>
		<button type="default" class="saveBtn" @tap="save()">保存</button>	
	</view>
</template>

<script>
	import { getOrgList } from '@/request/user.js'
	import { voiceInput } from '@/h5PlusApi/plus.js'
	import idText from '@/common/idText.js'
	import { idToInfor }  from '@/common/tool.js'
	import myPicker from '@/components/my-picker/Picker.vue'
	import { getMbType, addEhr } from '@/request/jmda.js'
	let that;
	export default {
		components:{ myPicker },
		data() {
			return {
				navTitle:'',
				nationList: ["汉族","蒙古族","回族","藏族","维吾尔族","苗族","彝族","壮族","布依族","朝鲜族","满族","侗族","瑶族","白族","土家族","哈尼族","哈萨克族","傣族","黎族","傈僳族","佤族","畲族","高山族","拉祜族","水族","东乡族","纳西族","景颇族","柯尔克孜族","土族","达斡尔族","仫佬族","羌族","布朗族","撒拉族","毛南族","仡佬族","锡伯族","阿昌族","普米族","塔吉克族","怒族", "乌孜别克族","俄罗斯族","鄂温克族","德昂族","保安族","裕固族","京族","塔塔尔族","独龙族","鄂伦春族","赫哲族","门巴族","珞巴族","基诺族"],
				nationIndex: null,
				orgList:[
					// {name: '1xx机构', id: '1'},
					// {name: '2xx机构', id: '2'}
				],
				personInfor:{
				    id:"",
					name: "",
					idno: "",
					sex: "",
					address: "",
					tel: "",
					birthday: "",
					nation: "",
					mbTypeId: "",
					mbType: "",
				    mbSpecialTypeId:"",
				    mbSpecialType:"",
					orgId: "",
					orgName: ""
				},
				rtType: [
					// {typeName:'高血压',checked:true},
				],
				// 特殊类型
				special:[
					//{typeName:'高血压',checked:true},
				],
                saveDisable: false
			};
		},
		created() {
			// 获取新建档案慢病类型
			this.getMbTypeHandle();
			getOrgList().then(res=>{
				//console.log('获取机构列表',res)
				if(res.ret){
					this.orgList = res.data
				}
			})
		},
		mounted() {
		},
		methods:{
			// 获取慢病类型
			getMbTypeHandle(){
				getMbType().then((res)=>{
					if(res.ret){
						console.log(res)
						// 慢病
						if(res.data.mb){
							res.data.mb.forEach((item,index)=>{
								this.rtType.push({typeName:item.typeName,checked:false,id:item.id})
							})
						}
						// 特殊类型
						if(res.data.special){
							res.data.special.forEach((item,index)=>{
								this.special.push({typeName:item.name,checked:false,id:item.id})
							})
						}
					}
				},(err)=>{
					console.log('获取慢病类型错误：' ,err)
				})
			},
			changeNation (e){
				this.nationIndex = e.target.value
				this.personInfor.nation = this.nationList[this.nationIndex];
				console.log(this.personInfor)
			},
			confirm(e){
				this.personInfor.orgId = e.value;
				this.personInfor.orgName = e.label;
			},
			checkboxChange (e){
				this.personInfor.mbType = e.detail.value.join(',')
				var temArr = e.detail.value;
				var checkedArr = [];
				temArr.forEach((item,index)=>{
					this.rtType.forEach((ite,ind)=>{
						if(ite.typeName == item){
							checkedArr.push(ite.id)
						}
					})
				})
				this.personInfor.mbTypeId = checkedArr.join(',')
			},
			ChangeSpcial(e){
				this.personInfor.mbSpecialType = e.detail.value.join(',')
				var temArr = e.detail.value;
				var checkedArr = [];
				temArr.forEach((item,index)=>{
					this.special.forEach((ite,ind)=>{
						if(ite.typeName == item){
							checkedArr.push(ite.id)
						}
					})
				})
				this.personInfor.mbSpecialTypeId = checkedArr.join(',')
			},
			startRecognize (){
				voiceInput(res => {
					if (res){
						this.personInfor.name = res;
					}
				})
			},
			openMap() {
				that = this;
				uni.getLocation({
				    type: 'gcj02', //返回可以用于uni.openLocation的经纬度
				    success: function (res) {
						console.log(res)
				        const latitude = res.latitude;
				        const longitude = res.longitude;
						uni.chooseLocation({
						    success: function (res) {
								that.personInfor.address = res.address
						    }
						});
				    },
				})
			},
			// 管理人群 特殊人群格式转换
			typeForm(arr){
				let aim = [];
				arr.forEach((item)=>{
					if(item.checked){
						aim.push(item.id);
					}
				})
				console.log(arr)
				return aim.join(',');
			},
			save () {
				if(!this.personInfor.name){
					this.$showToast('用户姓名未填')
				} else if(!this.personInfor.idno){
					this.$showToast('身份证未填')
				} else if(!idText(this.personInfor.idno)){
					this.$showToast('身份证格式错误')
				} else if(!this.personInfor.orgId || !this.personInfor.orgName){
					this.$showToast('机构未选择')
				} else {
                    //只允许点一次
                    // if(this.saveDisable) {
                    //     return;
                    // }
                    // this.saveDisable = true;
                    this.$showLoading('加载中')
					const { birth,gender } = idToInfor(this.personInfor.idno)
					this.personInfor.sex = gender
					this.personInfor.birthday = birth
					addEhr(this.personInfor).then((res)=>{
                        uni.hideLoading()
						if(res.ret){
							this.$showToast('档案创建成功')
							uni.$emit("JMLIST_RELOAD");
							uni.$emit("DETAIL_RELOAD");
							setTimeout(function(){
                                uni.navigateBack({
                                	delta:1
                                })
                            }, 1000)
						} else {
							this.$showToast(res.mes)
						}
					},(err)=>{
						console.log(res)
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #FFFFFF;
	}
	.new_build{
		height: 100%;			
		.list_box{
			padding: 15rpx 30rpx 15rpx 40rpx;
			.list_item{
				padding: 30rpx 0rpx;
				border-bottom: 1rpx solid rgba(238, 238, 238, 1);				
				position: relative;
				display: flex;
				justify-content:space-between;
				.list_left{
					font-size: 28rpx;
					color:rgba(51, 51, 51, 1);
					.dot{
						color: rgba(255, 0, 0, 1);					
					}
				}
				.list_right{
					display: flex;
					.name_input{
						width: 200rpx;
						margin-right: 20rpx;
						text-align: right;
						font-size: 28rpx;
					}
					.nationText{
						margin-right: 36rpx;
						font-size:30rpx;
						font-weight:500;
						color:rgba(51,51,51,1);
					}
					.id_input{
						width: 320rpx;
						margin-right: 26rpx;
						text-align: right;
						font-size: 28rpx;
					}
					.icon-to{
						position: absolute;
						right: 0;
						top: 36rpx;
						color: rgba(153, 153, 153, 1)!important;
					}
					.iconfont{						
						color: rgba(53, 168, 255, 1);						
					}
					.pickCss{
						font-size: 28rpx;
					}
				}
			}
		}
		.managePeople{			
			.title{
				margin: 24rpx 0;
				font-size:30rpx;
				font-weight:500;
				color:rgba(51,51,51,1);
			}
			.chose_rytype{
				.ry-group{
					.jktj-item{
						display: inline-block;
						text-align: center;
						line-height: 60rpx;
						font-size:30rpx;
						font-weight:400;
						color:rgba(51,51,51,1);
						margin-right: 18rpx;
						margin-top: 20rpx;
						width:200rpx;
						height:60rpx;			
						border-radius:4rpx;
						overflow: hidden;
						text-overflow:ellipsis;
						white-space: nowrap;
					}
					.nochecked{
						background:#f6f6f6;
					}
					.checked{
						color:rgba(53, 168, 255, 1) ;
						background-color: #eaf6ff;
					}
				}			
			}
		}
		.saveBtn{
			width:664rpx;
			height:88rpx;
			color: #FFFFFF;
			position: absolute;
			bottom: 32rpx;
			background:rgba(53,168,255,1);
			border-radius:10px;
		}
	}
</style>
