<template>
	<view class="doctor_sign">
		<view class="status_bar">
			<!-- 这里是状态栏 -->
		</view>
		<uni-nav-bar fixed="true" title="家医签约" :isBack="true" height="40rpx" background-color="#35A8FF" color="#FFFFFF">
			<view slot="right" @tap="Scan()" v-if="false">
				<text class="iconfont icon-saoma"></text>
			</view>
		</uni-nav-bar>
		<view class="content" :style=" (okPop || submitFinishPop) ? 'height: 100vh' : ''">
			<!-- -->
			<view class="list_box">
				<view class="list_item">
					<view class="list_left">
						<text>身份证号:</text>
					</view>
					<view class="list_right">
						<input :disabled="signId" @blur="finshId" class="id_input" type="text" placeholder="请输入身份证号"
							v-model="personInfor.idno" value="" />
						<text class="iconfont icon-saoma" @tap="IDCardScan()"></text>
					</view>
				</view>
				<view class="list_item">
					<view class="list_left">
						<text>姓名:</text>
					</view>
					<view class="list_right">
						<input type="text" class="name_input" placeholder="请输入姓名" v-model="personInfor.name" value="" />
						<i class="iconfont icon-maikefeng" @tap="startRecognize()"></i>
					</view>
				</view>
				<view class="list_item">
					<view class="list_left">
						<text>性别:</text>
					</view>
					<view class="list_right">
						<evan-radio v-model="personInfor.sex" label="男">男</evan-radio>
						<evan-radio style="margin-left: 40rpx;" v-model="personInfor.sex" label="女">女</evan-radio>
					</view>
				</view>
				<view class="list_item">
					<view class="list_left">
						<text>联系电话:</text>
					</view>
					<view class="list_right">
						<input class="id_input" type="number" placeholder="请输入联系电话" v-model="personInfor.tel"
							value="" />
					</view>
				</view>
				<view class="list_item">
					<view class="list_left">
						<text>住址:</text>
					</view>
					<view class="list_right">
						<input type="text" class="id_input" placeholder="请输入家庭住址" v-model="personInfor.address"
							value="" />
						<text class="iconfont icon-dizhi" @tap="openMap()"></text>
					</view>
				</view>
				<view class="list_item">
					<view class="list_left">
						<text>家庭代表人:</text>
					</view>
					<view class="list_right">
						<input type="text" class="id_input" placeholder="请输入家庭代表人"
							v-model="personInfor.homeRepresentative" value="" />
					</view>
				</view>
			</view>
			<view class="list_box qyBox">
				<view class="list_item">
					<view class="list_left">
						<text>签约日期:</text>
					</view>
					<view class="list_right">
						<view class="list_right" @click="onShowDatePicker('range')">
							<text class="orgname">{{personInfor.startDate}}</text>
							<text class="iconfont icon-riqi"></text>
						</view>
					</view>
				</view>
				<my-picker :picker-key="{value: 'id', label: 'teamName'}" :picker-list="teamList"
					@confirm="confirmTeam($event)">
					<view class="sel">
						<view class="list_item" style="border: none;">
							<view class="list_left">
								<text>签约团队:</text>
							</view>
							<view class="list_right">
								<text class="orgname">{{personInfor.teamName}}</text>
								<text class="iconfont icon-arrow-right"></text>
							</view>
						</view>
					</view>
				</my-picker>
				<my-picker :picker-key="{value: 'id', label: 'name'}" :picker-list="orgList" @confirm="confirm($event)">
					<view class="sel">
						<view class="list_item" style="border: none;">
							<view class="list_left">
								<text>签约卫生室:</text>
							</view>
							<view class="list_right">
								<text class="orgname">{{personInfor.orgName}}</text>
								<text class="iconfont icon-arrow-right"></text>
							</view>
						</view>
					</view>
				</my-picker>
				<view class="list_item">
					<view class="list_left">
						<text>签约方式:</text>
					</view>
					<picker :range="styleList" @change="bindPickerChangeqyfs($event,'qyfs')">
						<view class="list_right">
							<text class="orgname">{{personInfor.field}}</text>
							<text class="iconfont icon-arrow-right"></text>
						</view>
					</picker>
				</view>
				<view class="list_item">
					<view class="list_left">
						<text>签约医生:</text>
					</view>
					<my-picker :search="true" :picker-list="doctorList" :picker-key="{value: 'value', label: 'name', }"
						@confirm="doctorChange($event)" :range="doctorList">
						<view class="list_right">
							<text class="orgname">{{personInfor.docName}}</text>
							<text class="iconfont icon-arrow-right"></text>
						</view>
					</my-picker>
					<!-- <picker
					:range="doctorList"
					@change="bindPickerChangeqyfs($event,'qyys')">
						
					</picker> -->
				</view>
			</view>
			<view class="serve_pack">
				<p class="title">选择人员类型</p>
				<view class="content">
					<view class="content_item">
						<self-sign-checkbox :list="showdetailList" v-model="personChecked"
							@checkboxChange="checkboxChange">
						</self-sign-checkbox>
					</view>
				</view>
				<view class="fold" @tap="foldHandle()"><span>{{fold?'收起':'展开'}}</span><i class="iconfont"
						:class="!fold?'icon-down2':'icon-arrow-down'"></i></view>
			</view>
			<view class="serve_pack">
				<p class="title">选择家庭成员</p>
				<view class="list_box">
					<view class="list_item" style="border: none;" v-for="(item,index) in personInfor.jySignHomeList"
						:key="index">
						<view class="list_left" @tap="linkTo('./familyAdd/familyAdd?index='+index)">
							<input @tap="popShow=true" class="id_input" type="text" placeholder="填写姓名"
								v-model="item.name" value="" />
						</view>
						<view class="list_right">
							<picker :range="relationList" @change="bindPickerChange($event,item,index)">
								<text class="relative">与户主关系:</text>
								<input class="pt_input" type="text" placeholder="请输入" value=""
									v-model="personInfor.jySignHomeList[index].relation" />
								<text class="iconfont icon-arrow-right"></text>
							</picker>
						</view>
					</view>
					<view class="list_item">
						<view class="list_left">
							<view class="create" @tap="createList()">
								<text class="iconfont icon-xinzeng"></text><text>新增一条</text>
							</view>
						</view>
						<view class="list_right" @tap="deleteList()">
							<view class="delete">
								<text class="iconfont icon-shanchu" style="color: #000000;"></text><text>删除一条</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="serve_pack">
				<p class="title">选择服务包 <view class="dot" @tap="openServePack()">?</view>
				</p>
				<view class="content">
					<view class="content_item">
						<self-sign-checkbox :list="servePackConfig" v-model="packChecked" @checkboxChange="packHandle">
						</self-sign-checkbox>
					</view>
				</view>
			</view>
			<!-- 签约照片 -->
			<view class="serve_pack">
				<p class="title">签约照片</p>
				<view class="content">
					<view class="img_box" @tap="takePho()">
						<img align="center" v-show="personInfor.xyzUrl.length>400" class="pic"
							:src="'data:image/png;base64,'+personInfor.xyzUrl" alt="" />
						<img align="center" v-show="watchUrl" class="pic" :src="watchUrl" alt="" />
						<view class="takeImg" v-show="!personInfor.xyzUrl">
							<text class="iconfont icon-paizhaozhaopian"></text>
							<p>拍照或上传</p>
						</view>
					</view>
				</view>
			</view>
			<!-- 手写签名-->
			<view class="serve_pack bottom">
				<p class="title">手写签名</p>
				<view class="content" @tap="handSign()">
					<view class="sign_box">
						<img :src="'data:image/png;base64,' + personInfor.jmQmzUrl" alt="">
						<img align="center" v-show="qyUrl" class="pic" :src="qyUrl" alt="" />
						<view class="singIcon" v-show="!personInfor.jmQmzUrl">
							<view class="iconfont icon-qianming"></view>
							<view class="sign-title">点击开始签名</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 总计 -->
			<view class="total">
				<view class="money">
					总计:￥{{total}}
				</view>
				<view class="submit" @tap="submit">支付并提交</view>
			</view>
			<!-- 支付确认 -->
			<self-sign-pop v-model="okPop">
				<view class="payTotal">
					<view class="money">￥20</view>
					<view class="serveList">
						<view class="serveItem">
							<view class="servName">初级服务包</view>
							<view class="servPrice">免费</view>
						</view>
						<view class="serveItem">
							<view class="servName">中级服务包</view>
							<view class="servPrice">￥20</view>
						</view>
					</view>
				</view>
			</self-sign-pop>

			<self-sign-pop v-model="submitFinishPop" rightText="继续签约" leftText="查看签约协议" title="提示"
				@leftHandle="goToProtol" @rightHandle="nextSign">
				<view style="text-align: center;">
					{{popText}}
				</view>
			</self-sign-pop>
		</view>
		<!-- 时间间隔选择 -->
		<mx-date-picker :showHoliday="false" :showTips="false" :showSeconds="false" :show="showPicker" type="date"
			format="yyyy-mm-dd" :value="value" :show-tips="true" :show-seconds="true" @confirm="onSelected"
			@cancel="showPicker = false" />
	</view>
</template>

<script>
	import { getUserInfo } from '@/request/user.js'
	import selfSignCheckbox from '@/components/self-sign-checbox/seft-sign-checkbox.vue'
	import {
		idToInfor,
		GetNowTime,
		toBase64
	} from '@/common/tool.js'
	import ImageTool from '@/h5PlusApi/imgUpload.js'
	import {
		required
	} from 'vuelidate/lib/validators'
	import MxDatePicker from "@/components/mx-datepicker/mx-datepicker.vue";
	import {
		Jysign,
		getType,
		getPack,
		getSignDetail,
		updateSign
	} from '@/request/jyqy.js'
	import startProcess from '@/common/baidu-idcard.js'
	import {
		getOrgList,
		getTeamList
	} from '@/request/user.js'
	import {
		voiceInput
	} from '@/h5PlusApi/plus.js'
	import myPicker from '@/components/my-picker/Picker.vue'
	import selfSignPop from '@/components/self-sign-pop/self-sign-pop.vue'
	import {
		addSfService,
		getDocUserList
	} from '@/request/jmsf.js'
	export default {
		components: {
			MxDatePicker,
			myPicker,
			selfSignPop,
			selfSignCheckbox
		},
		onShow() {
			uni.$on("signPost", res => {
					//console.log('签名完成得到base' ,res.data);
					if (res.data) {
						this.personInfor.jmQmzUrl = res.data.replace(/^data:image\/\w+;base64,/, "");
						this.qyUrl = ''
					}
				}),
				uni.$once("NAMEBACK", res => {
					console.log('签名完成得到base', res);
					this.personInfor.jySignHomeList[res.index].name = res.name
					console.log(this.personInfor.jySignHomeList)
					uni.$off('NAMEBACK')
				})

		},
		onLoad(option) {
			var useInfor = ''
			// 获取机构
			if (option.useInfor) {
				useInfor = JSON.parse(decodeURIComponent(option.useInfor));
				console.log('页面传参', useInfor)
				getOrgList().then(res => {
					console.log('获取机构列表', res.data[0])
					if (res.ret) {
						this.orgList = res.data
						this.personInfor.orgName = useInfor.orgName
						for (let item of this.orgList) { //for of 推荐用在遍历数组
							if (item.name == useInfor.orgName) {
								this.personInfor.orgId = item.id
								return;
							}
						}
					}
				})
			}
			// 添加判断是否是随访记录签约
			if (useInfor.sfSign && useInfor.sfSign != 'undefined') {
				this.sfSign = useInfor.sfSign
				this.goSignData.type = useInfor.type
				this.goSignData.signId = useInfor.signId
				this.goSignData.sfId = useInfor.sfId
			}
			if (useInfor) {
				this.personInfor.idno = useInfor.idCard
				this.personInfor.name = useInfor.name
				this.personInfor.signId = useInfor.signId
				this.personInfor.sex = useInfor.gender
				this.personInfor.tel = useInfor.phone
				this.personInfor.address = useInfor.address
				this.personInfor.xyzUrl = useInfor.imgurl || ''
				this.personInfor.qyzUrl = useInfor.qyQmzUrl || ''
			}
			this.watchUrl = this.$IMGURL + this.personInfor.xyzUrl
			this.qyUrl = this.$IMGURL + this.personInfor.qyzUrl
			console.log(this.qyUrl, '手写照')
			console.log(this.watchUrl, '签约照')
			if (useInfor.signId) {
				// // 请求签约详情
				this.signId = useInfor.signId
				let req = {
					signId: useInfor.signId
				};
				console.log(req, '请求详情')
				getSignDetail(req).then((res) => {
					console.log(res)
					if (res.ret) {
						this.personInfor = res.data
						this.signId = res.data.id
						if(this.signId == null){
							this.personInfor.startDate = ""
						}
						console.log(this.personInfor,this.signId)
						// 处理服务包·人员类型
						this.personChecked = res.data.qyTypeId.split(',')
						// this.packChecked = res.data.qyPackId.split(',')
						this.personGetPack();
						var {
							gender
						} = idToInfor(this.personInfor.idno)
						if (gender) {
							this.personInfor.sex = gender
						}
					}
				})
			}
		},
		data() {
			return {
				watchUrl: '',
				qyUrl: '',
				// 生成履约记录需要的参数
				goSignData: {
					type: '',
					signId: '',
					sfId: '',
				},
				//表明是否是随访记录签约
				sfSign: false,
				popText: '签约成功，是否继续签约？',
				diabled: false,
				signId: null,
				// 展开收起标识
				fold: false,
				personInfor: {
					ehrId: "",
					idno: "",
					name: "",
					sex: '',
					tel: "",
					address: "",
					qyTypeId: "",
					qyPackId: "",
					qyTypeName: '',
					qyPackName: '',
					orgId: "",
					qyYear: "",
					xyzUrl: '',
					quzUrl: '',
					jmQmzUrl: "",
					startDate: "",
					endDate: "",
					field: "门诊",
					homeRepresentative: '',
					jySignHomeList: [{
						name: '',
						relation: ''
					}, {
						name: '',
						relation: ''
					}],
					docId: '',
					docName: '',
					orgName: '',
					teamId: '',
					teamName: ''
				},
				// 搜索相关参数
				showPicker: false,
				value: '',
				// 签约机构
				personChecked: [],
				packChecked: [],
				orgList: [],
				teamList: [],
				ryTypeConfig: [],
				servePackConfig: [],
				total: 0,
				okPop: false,
				submitFinishPop: false,
				saveDisable: false,
				relationList: ['户主', '儿子', '女儿', '孙子', '孙女', '父亲', '母亲', '配偶', '兄弟姐妹', '祖父母', '爷爷', '婆婆', '外孙子', '外孙女',
					'其他'
				],
				styleList: ['门诊', '体检', '入户', '电话'],
				popShow: false,
				myName: '',
				doctorList: []
			}
		},
		validations: {
			personInfor: {
				idno: {
					required
				},
				name: {
					required
				},
				tel: {
					required
				},
				qyTypeId: {
					required
				},
				qyPackId: {
					required
				},
				// jmQmzUrl: {
				// 	required
				// },
				// xyzUrl: {
				// 	required
				// },
				orgId: {
					required
				},
				teamId: {
					required
				}
			}
		},
		created() {
			//获取医生
			getDocUserList().then(res => {
				console.log(res)
				if (res.ret) {
					this.doctorList = res.data
					if(this.personInfor.docName == ""){
						this.personInfor.docId = res.data[0].value
						this.personInfor.docName = res.data[0].name
					}
					if(!this.signId) {
						this.getUserInfo()
					}
					
				}
			}, err => {})
			
			getType().then(res => {
				//console.log('签约获取的人员类型配置',res)
				if (res.ret) {
					this.ryTypeConfig = res.data
				}
			})
			//获取机构
			getOrgList().then(res => {
				//console.log('获取机构列表',res.data[0])
				if (res.ret) {
					this.orgList = res.data
					if(this.personInfor.orgName == ""){
						this.personInfor.orgId = res.data[0].id
						this.personInfor.orgName = res.data[0].name
					}
				}
			})
			getTeamList().then(res => {
				console.log("getTeamList：" + JSON.stringify(res.data))
				if (res.ret) {
					this.teamList = res.data
					if(this.personInfor.teamName == ""){
						this.personInfor.teamId = res.data[0].id
						this.personInfor.teamName = res.data[0].teamName
					}
				}
			})
			// 默认初始化时间
			this.personInfor.startDate = GetNowTime('-');
			//this.personInfor.endDate = this.personInfor.startDate.slice(0,4) + '-12-31' 
			this.personInfor.qyYear = GetNowTime('-').substring(0, 4).toString()
		},
		methods: {
			//获取用户信息
			getUserInfo() {
				getUserInfo().then((res) => {
					console.log('获取的个人信息', res);
					if (res.ret) {
						var docNameList = this.doctorList.map(item=>{
							return item.name
						})
						if(docNameList.indexOf(res.data.name) !== -1) {
							var docIndex = docNameList.indexOf(res.data.name)
							this.personInfor.docName = res.data.name
							this.personInfor.docId = this.doctorList[docIndex].value
						}
					}
				})
			},
			IDCardScan() {
				startProcess((result) => {
					console.log(result)
					this.personInfor.name = result.data.name
					this.personInfor.idno = result.data.idNumber
					this.personInfor.address = result.data.address
					// this.nationIndex = this.nationList.indexOf(result.data.ethnic + "族")
					if (result.idNumber === "") {
						this.$showToast('身份证识别失败')
					}
				}, (result) => {
					this.$showToast('身份证识别失败')
				})
			},
			linkTo(url) {
				uni.navigateTo({
					url: url
				})
			},
			//增加一行
			createList() {
				var status = true
				this.personInfor.jySignHomeList.forEach(item => {
					if (!item.name) {
						status = false
						return this.$showToast('请确家庭成员信息完整姓名后才可添加')
					} else {
						status = true
					}

				});
				if (this.personInfor.jySignHomeList.length < 7 && status) {
					this.personInfor.jySignHomeList.push({
						name: '',
						relation: ''
					})
				}

			},
			//选择医生
			doctorChange(e) {
				console.log(e.label)
				this.personInfor.docName = e.label
				this.personInfor.docId = e.value
			},
			//删除一行
			deleteList() {
				this.personInfor.jySignHomeList.pop()
			},
			//签约方式
			bindPickerChangeqyfs(event, type) {
				let {
					value
				} = event.detail
				if (type == 'qyfs') {
					this.personInfor.field = this.styleList[value]
				}
			},
			//与户主关系选择
			bindPickerChange(event, item, index) {
				let {
					value
				} = event.detail
				this.personInfor.jySignHomeList[index].relation = this.relationList[value]
				console.log(this.personInfor.jySignHomeList[index].relation)
			},
			// 时间间隔选择器
			onShowDatePicker(type) {
				this.showPicker = true;
			},
			confirm(e) {
				this.personInfor.orgId = e.value
				this.personInfor.orgName = e.label
			},
			confirmTeam(e) {
				this.personInfor.teamId = e.value
				this.personInfor.teamName = e.label
			},
			// 拍照或选取
			takePho() {
				const that = this
				if (this.signId) {
					let arr = []
					arr[0] = this.watchUrl
					arr[0] = arr[0].replace("\\", "\/")
					uni.previewImage({
						urls: arr,
						current: 0,
					});
				} else {
					var imgTool_upload = new ImageTool({
						ZoomQuality: 30, //压缩图片的质量
						autoUpload: false,
						success: function(url, base64) {
							console.log('拍照的结果',url,base64);
							//that.personInfor.xyzUrl = base64;
							that.personInfor.xyzUrl = base64.replace(/^data:image\/\w+;base64,/, "");
							console.log('base转码', that.personInfor.xyzUrl);
						},
						error: function(err) {
							console.log(err);
						}
					});
					var config = uni.getStorageSync('config');
					config = JSON.parse(config)
					var buttonss = []
					if (config.existKcphoto == '是') {
						buttonss = [{
							title: "打开摄像头拍照"
						}, ]
					} else {
						buttonss = [{
							title: "打开摄像头拍照"
						}, {
							title: "选取现有照片"
						}]
					}
					plus.nativeUI.actionSheet({
						title: "选择照片",
						cancel: "取消",
						buttons: [{
							title: "打开摄像头拍照"
						}, {
							title: "选取现有照片"
						}]
					}, (e) => {
						if (e.index == 1) {
							//拍照
							imgTool_upload.camera();
						} else if (e.index == 2) {
							// 选取照片
							imgTool_upload.galleryImgs();
						} else {
							return;
						}
					})
				}
			},
			onSelected(result) {
				this.value = result['value']
				this.showPicker = false;
				this.personInfor.startDate = this.value
				//this.personInfor.endDate = this.value[1]
			},
			// 身份证输完成
			finshId() {
				var {
					gender
				} = idToInfor(this.personInfor.idno)
				if (gender) {
					this.personInfor.sex = gender
				}
			},
			openServePack() {
				uni.navigateTo({
					url: '../servePackDetail/servePackDetail'
				})
			},
			Scan() {
				// 允许从相机和相册扫码
				uni.scanCode({
					success: function(res) {
						console.log('条码类型：' + res.scanType);
						console.log('条码内容：' + res.result);
					}
				});
			},
			// IDCardScan() {
			// 	startProcess((result) => {
			// 		this.personInfor.name = result.name
			// 		this.personInfor.sex = result.gender
			// 		this.personInfor.idno = result.idNumber
			// 		this.personInfor.address = result.address
			// 		if (result.idNumber === "") {
			// 			this.$showToast('身份证识别失败')
			// 		}
			// 	}, (result) => {
			// 		this.$showToast('身份证识别失败')
			// 	})
			// },
			// 语音识别姓名
			startRecognize() {
				voiceInput(res => {
					if (res) {
						console.log(res)
						this.personInfor.name = res;
					}
				})
			},
			// 地图选点
			openMap() {
				const that = this;
				uni.getLocation({
					type: 'gcj02', //返回可以用于uni.openLocation的经纬度
					success: function(res) {
						console.log(res)
						const latitude = res.latitude;
						const longitude = res.longitude;
						uni.chooseLocation({
							success: function(res) {
								that.personInfor.address = res.address
							}
						});
					},
					fail: function(err) {
						console.log(err)
					}
				})
			},
			// 人员类型选择
			checkboxChange() {
				// 请求服务包配置赋值人员类型
				var personArr = [];
				this.ryTypeConfig.forEach((item, index) => {
					this.personChecked.forEach((ite, ind) => {
						if (item.value == ite) {
							personArr.push(item.name)
						}
					})
				})
				this.personInfor.qyTypeId = this.personChecked.join(',')
				this.personInfor.qyTypeName = personArr.join(',')
				//console.log('签约人员类型传参',this.personInfor.qyPackName,this.personInfor.qyPackId)
				this.personGetPack();
				// 处理服务包汉字传参
			},
			// 服务包选择
			packHandle() {
				// 处理服务包汉字传参
				var serveNameArr = []
				this.servePackConfig.forEach((item, index) => {
					this.packChecked.forEach((ite, ind) => {
						if (item.value == ite) {
							serveNameArr.push(item.name)
						}
					})
				})
				this.personInfor.qyPackId = this.packChecked.join(',')
				this.personInfor.qyPackName = serveNameArr.join(',')
				//console.log('人员类型选中',this.personInfor.qyTypeName,this.personInfor.qyTypeId)
			},
			personGetPack() {
				this.servePackConfig = [];
				var typeStr = this.personChecked.join(',')
				if (typeStr) {
					var req = {};
					req.typeIds = typeStr
					console.log('获取服务包配置传参', req)
					getPack(req).then(res => {
						console.log('获取的服务包配置', res)
						if (res.ret && res.data.length) {
							this.servePackConfig = res.data
							// 自动选中免费包
							let serveNameArr = []
							this.servePackConfig.forEach((item, index) => {
								if (item.name == '基础服务包' && !this.packChecked.includes(item.value)) {
									this.packChecked.push(item.value)
									serveNameArr.push(item.name)
								}
							})
							this.personInfor.qyPackId = this.packChecked.join(',')
							this.personInfor.qyPackName = serveNameArr.join(',')
						}
					})
				}
			},
			// 收起展开
			foldHandle() {
				this.fold = !this.fold
			},
			// 书写签名打开
			handSign() {
				if (this.signId) {
					this.$showToast('修改签约不能修改签名照')
				} else {
					uni.navigateTo({
						url: '/pages/my/handWriter/index' + '?model=sign'
					})
				}
			},
			//继续签约，清空表单
			nextSign() {
				this.personInfor = Object.assign({}, this.personInfor, {
					ehrId: '',
					idno: '',
					name: '',
					sex: '',
					tel: '',
					address: '',
					qyTypeId: '',
					qyPackId: '',
					qyTypeName: '',
					qyPackName: '',
					xyzUrl: '',
					jmQmzUrl: ''
				})
			},
			//查看签约协议
			goToProtol() {
				var url = '/pages/jm/agreementBook/agreementBook'
				//todo调整签约协议页面
				console.log(url)
				uni.navigateTo({
					url: url += '?signId=' + this.signId + '&from=sign'
				})
			},
			// 提交
			async submit() {
				console.log('提交')
				var config = uni.getStorageSync('config');
				config = JSON.parse(config)
				this.personInfor.jySignHomeList = this.personInfor.jySignHomeList.filter(item => item.name !== '' || item
					.relation !== '')
				this.$showLoading('加载中')
				this.personInfor.jySignHomeList = this.personInfor.jySignHomeList.filter(item => item.name !== '' || item
					.relation !== '')
				if (this.signId) {
					console.log('修改签约传参', this.personInfor)
					updateSign(this.personInfor).then(res => {
						//console.log('修改签约结果',res)
						uni.hideLoading()
						if (res.ret) {
							this.popText = '修改签约成功，是否继续签约？'
							this.submitFinishPop = true
							this.signId = res.data
							uni.$emit("DETAIL_RELOAD")
						} else {
							this.$showToast('签约失败：' + res.mes)
						}
					})
				} else {
					console.log('新建签约传参', this.personInfor)
					this.$v.personInfor.$touch()
					if (this.$v.$invalid) {
						this.$showToast('提交失败，请检查是否填写完整')
					} else if(!this.personInfor.jmQmzUrl && config.existQyzp == '是') {
						this.$showToast('提交失败，请检查是否填写完整')
					}else if (!this.personInfor.xyzUrl && config.existQyzp == '是') {
						this.$showToast('提交失败，请检查是否填写完整')
					} else if (!this.personInfor.startDate) {
						this.$showToast('提交失败，请检查是否填写完整')
					} else {
						console.log('新建签约')
						if(this.personInfor.xyzUrl.length < 400) {
							await toBase64(this.watchUrl).then(base64Url => {
								this.personInfor.xyzUrl = base64Url
							})
						}
						if(this.personInfor.jmQmzUrl.length < 400) {
							await toBase64(this.qyUrl).then(base64Url => {
								this.personInfor.jmQmzUrl = base64Url
							})
						}
						console.log(this.personInfor)
						//只允许点一次
						Jysign(this.personInfor).then(res => {
							console.log('新建签约结果', res)
							uni.hideLoading()
							if (res.ret && !this.sfSign) {
								this.popText = '签约成功，是否继续签约？'
								this.submitFinishPop = true
								this.signId = res.data
								uni.$emit("DETAIL_RELOAD")
								uni.$emit('JMLIST_RELOAD');
							} else if (this.sfSign) {
								// 随访记录签约弹出是否生成履约记录
								this.goSignData.signId = res.data
								addSfService({
									signId: this.goSignData.signId,
									sfId: this.goSignData.sfId,
									type: this.goSignData.type
								}).then(re => {
									console.log('生成下次随访记录', re)
								})
								setTimeout(function() {
									uni.navigateBack({
										delta: 1
									})
								}, 1000)
							} else {
								this.$showToast('签约失败：' + res.mes)
							}
						})
					}
				}
			},
		},
		computed: {
			showdetailList: {
				get: function() {
					// 展开
					if (!this.fold) {
						if (this.ryTypeConfig.length < 7) {
							return this.ryTypeConfig
						}
						let newArr = []
						for (var i = 0; i < 6; i++) {
							let item = this.ryTypeConfig[i]
							newArr.push(item)
						}
						return newArr
					}
					return this.ryTypeConfig
				},
				set: function(val) {
					this.showdetailList = val
				}
			}
		},
	}
</script>
<style lang="scss" scoped>
	@import "./public.scss";

	page {
		background-color: #f2f2fa;
	}

	@font-face {
		font-family: "iconfont";
		src: url(data:font/truetype;charset=utf-8;base64,d09GMgABAAAAAAMkAAsAAAAABvwAAALXAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHEIGVgCCcAqCCIF8ATYCJAMICwYABCAFhG0HLxshBhHVk3Nkf4M4bqcASIAxS9fa29HXugjJ8/6RXGhQaOwfgMA0QAIAAAAABM/XGvr+7R4EAKlAHhBsULXjcXyrKlkh6SAObnIKQBNJMCBIOJ3c0gcpZJZQ1mppYFHEBUAPFbQsRBncjpSEHDDWFBVoe5IB4ysfuOHX5noEoT6pUCO5+L1Hf9Bu3KXXJ9iAgzwfzAa2Cqv3fy6nd20PZH6gnObc1Asw3hrgXhhFVkABcMPYDSpw+DEEcCVSOqkv2vtx0CSrBJBd9dIMzsiDRltxB8ECHNTIFYJjnDUeXK6/L1/l5oCBqUiKuq9hnuqfJuHb7xKBK84EWMdAAelAg/QDI50UYpEVrhFNLPaVL/BhlTpkr38eYpHkugMQrnLuiZvzbrXKAEBz75OTYIHpMjDdA/zx07l7R++7yfm7R+4Mdc8IHb3lilu3jm4E1drjEEc2x13V+dvgpRvnt3Dn0TTWn4SqO4/cdOObN4+sjtYJ3X+aZFy16YpzN3BkNWco0692v0dJyugp1qetffbzcPX9qgeKJtxmhT0eEoz7Tc986SaCp7KIMVP+/Lhf8Mz3HgvEwkbaSrXEp/bOvv/r31C1XT6X/3emAXjFDtYqDZkNnDuyCvxZLmGHDvmJ1tA+F5gwmGTecZ0rrsC27vD1llUR8BoJwSHgZWw2ET0oHOJRjU8HEzfywcKhClxJ03TcDT8HKES7AKlOKiB4ewAGnjwFhbcXqMa/AZNA38HCOwWuDOZ3oRuJSfWOoFH0YP9QOx4o0+uuyb9h+e6MDPk15YUSaj+kUTKNX3FAEbElfMpMlYCEeyiU57DrGEbhBp1GleqYxzGB3hQ57ie7CUGj6MH+oXY8UNlbd7PP37B8d0YQbQPmF0qop4c0SgjQq2QgaruXV8KnzFQJSLiHQjFhl0YYRvC8Bp1GFUNozGOtG5FKovVl/dftYzLZTRLlbJrOmE8KhnszmQAA) format('truetype');
	}

	.iconfont {
		font-family: "iconfont" !important;
		font-size: 30rpx;
		color: rgba(53, 168, 255, 1);
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	.icon-saoma:before {
		content: "\e6bd";
		font-size: 40rpx;
	}

	/*占位导航栏样式*/
	.status_bar {
		height: var(--status-bar-height);
		width: 100%;
		background-color: rgb(53, 168, 255);
	}

	.doctor_sign {
		.content {
			padding: 20rpx;
			overflow-x: hidden;

			.qyBox {
				margin-bottom: 12rpx;

				.list_right {
					display: flex;

					.icon-arrow-right {
						color: #A6A6A6 !important;
					}

					.icon-riqi {
						font-size: 30rpx;
						position: absolute;
						top: 34rpx;
						right: 30rpx;
					}

					.orgname {
						font-size: 30rpx;
						font-weight: 400;
						color: #333333;
						margin-right: 36rpx;
					}
				}
			}

			.list_box {
				margin-bottom: 20rpx;
				width: 100%;
				background-color: #FFFFFF;
				border-radius: 10rpx;

				.list_item {
					margin-left: 32rpx;
					padding: 30rpx 32rpx 30rpx 0;
					border-bottom: 1rpx solid rgba(238, 238, 238, 1);
					position: relative;
					display: flex;
					justify-content: space-between;

					.list_left {
						font-size: 30rpx;
						font-weight: 500;
						color: rgba(51, 51, 51, 1);

						.create {
							line-height: 88rpx;
							text-align: center;
							width: 316rpx;
							height: 88rpx;
							border: 1px solid #A2A4B9;
						}
					}

					.list_right {
						display: flex;

						.relative {
							font-size: 30rpx;
						}

						.delete {
							line-height: 88rpx;
							text-align: center;
							width: 316rpx;
							height: 88rpx;
							border: 1px solid #A2A4B9;
						}

						.pt_input {
							margin-left: 13rpx;
							width: 80rpx;
							display: inline-block;
							font-size: 28rpx;
							text-align: right;
							vertical-align: top
						}

						.name_input {
							width: 200rpx;
							margin-right: 20rpx;
							text-align: right;
							font-size: 28rpx;
						}

						.id_input {
							margin-left: 26rpx;
							width: 320rpx;
							margin-right: 20rpx;
							text-align: right;
							font-size: 28rpx;
						}

						.pickCss {
							font-size: 28rpx;
						}
					}
				}
			}

			.serve_pack {
				margin-top: 12rpx;
				background-color: #FFFFFF;

				.dot {
					position: absolute;
					text-align: center;
					font-size: 20rpx;
					right: 20rpx;
					top: 40rpx;
					display: inline-block;
					width: 13px;
					height: 13px;
					line-height: 13px;
					color: #FFFFFF;
					border-radius: 50%;
					background-color: rgba(153, 153, 153, 1);
				}

				.fold {
					padding: 20rpx 0;
					text-align: center;
					font-size: 20rpx;
					color: rgba(153, 153, 153, 1);
				}

				.title {
					position: relative;
					padding: 30rpx 0 0 20rpx;
					line-height: 30rpx;
					font-size: 30rpx;
					font-weight: bold;
					color: rgba(51, 51, 51, 1);
				}

				.title:after {
					margin-top: 20rpx;
					margin-right: 20rpx;
					display: block;
					background: rgba(237, 237, 237, 1);
					content: '';
					height: 1px;
				}

				.content {
					width: 100%;
					display: flex;
					justify-content: space-between;
					flex-wrap: wrap;

					// 签约照
					.img_box {
						width: 670rpx;
						height: 380rpx;
						background: rgba(245, 245, 245, 1);
						border-radius: 10rpx;
						position: relative;
						overflow: hidden;
						text-align: center;

						.pic {
							width: 100%;
						}

						.takeImg {
							width: 300rpx;
							height: 200rpx;
							position: absolute;
							top: 50%;
							left: 50%;
							margin-top: -100rpx;
							margin-left: -150rpx;
							text-align: center;
							color: #999999;
							font-size: 24rpx;

							.iconfont {
								font-size: 100rpx;
							}
						}
					}

					// 手写签名
					.sign_box {
						width: 672rpx;
						height: 196rpx;
						background: rgba(245, 245, 245, 1);
						border-radius: 4rpx;
						color: #999999;
						position: relative;

						img {
							position: absolute;
							top: 50%;
							left: 50%;
							margin-top: -150rpx;
							margin-left: -100rpx;
							transform: rotate(-90deg);
							width: 180rpx;
						}

						.singIcon {
							text-align: center;
							position: relative;
							top: 50%;
							left: 50%;
							margin-top: -60rpx;
							width: 200rpx;
							height: 120rpx;
							margin-left: -80rpx;

							.iconfont {
								font-size: 60rpx;
							}
						}

						.sign-title {
							margin-top: 28rpx;
							font-size: 24rpx;
							font-weight: 500;
						}
					}

					.jktj-item {
						height: 88rpx;
						overflow: hidden;
						width: 210rpx;
						display: inline-block;
						text-align: center;
						font-size: 22rpx;
						font-weight: 500;
						color: #333333;
						margin-right: 23rpx;
						margin-top: 20rpx;
						background: #f6f6f6;
						border-radius: 4rpx;

						p {
							padding: 34rpx 0;
							word-wrap: break-word;
							word-break: break-all;
						}
					}

					.checked {
						background: rgba(53, 167, 255, 1);
						border-radius: 4px;
						color: #FFFFFF;

						p {
							width: 100%;
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
						}
					}
				}
			}

			.family {}

			.bottom {
				margin-bottom: 220rpx;
			}

			.total {
				position: fixed;
				bottom: 0;
				left: 0;
				width: 100%;
				height: 98rpx;
				display: flex;

				.money {
					width: 50%;
					line-height: 98rpx;
					background-color: #FFFFFF;
					font-size: 30rpx;
					font-weight: bold;
					color: rgba(51, 51, 51, 1);
					text-align: center;
				}

				.submit {
					width: 50%;
					line-height: 98rpx;
					background-color: #FF7100;
					font-size: 30rpx;
					font-weight: bold;
					color: #FFFFFF;
					text-align: center;
				}
			}

			.payTotal {
				.money {
					text-align: center;
					font-size: 68rpx;
					font-weight: bold;
					color: rgba(51, 51, 51, 1);
				}

				.serveList {
					margin-top: 40rpx;
					padding: 0 60rpx;

					view:last-child {
						border: none;
					}

					.serveItem {
						display: flex;
						justify-content: space-between;
						height: 66rpx;
						line-height: 66rpx;
						font-size: 24rpx;
						font-weight: 500;
						color: rgba(51, 51, 51, 1);
						border-bottom: 1rpx solid #EEEEEE;

						.servName {}

						.servPrice {}
					}
				}
			}
		}
	}
</style>
