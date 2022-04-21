<template>
	<view class="self-index">
		<uni-nav-bar fixed="true" :title="title" height="40rpx" background-color="#35A8FF" color="#FFFFFF">
			<view slot="left" @tap="back()">
				<uni-icons color="color" type="back" size="24" />
			</view>
			<view slot="right">
				<view class="finsh" @tap="finsh">保存</view>
			</view>
		</uni-nav-bar>
		<view class="content">
			<self-router @yearChange="yearChange" :currTeam="currTeam" :yearList="teamList" v-show="followId">
			</self-router>
			<!-- 基本信息 -->
			<self-fold-card id="jbxx" :show="listShow.jbxx" backgroundColor="#fff" @closeOther="closeOther"
				title="基本信息">
				<view slot="fold">
					<view class="jbxxBox">
						<!-- <view class="rytype">
							提示：{{rqtype}}
						</view> -->
						<view class="sfxx">
							<view class="card">
								<view class="cardItem">
									<view class="title">随访日期</view>
									<picker @change="bindPickerChange($event,'sfrq')" mode=date>
										<view class="inputNormal" :style="{backgroundColor:update?'':'#F5F5F5'}"
											:class="{'redColor':!$v.formData.followUpDate.required}">
											<text class="time" :style="{color:(formData.followUpDate?'':'#acacac')}"
												v-text="formData.followUpDate?formData.followUpDate:'选择时间'"></text>
											<text class="iconfont icon-Iconmaterial-date-range"></text>
										</view>
									</picker>
								</view>
								<view class="cardItem">
									<view class="title">分娩日期</view>
									<picker @change="bindPickerChange($event,'fmrq')" mode=date>
										<view class="inputNormal" :style="{backgroundColor:update?'':'#F5F5F5'}">
											<text class="time" :style="{color:(formData.followUpDate?'':'#acacac')}"
												v-text="formData.deliveryDate?formData.deliveryDate:'选择时间'"></text>
											<text class="iconfont icon-Iconmaterial-date-range"></text>
										</view>
									</picker>
								</view>
							</view>
							<view class="card">
								<view class="cardItem">
									<view class="title">出院日期</view>
									<picker @change="bindPickerChange($event,'cyrq')" mode=date>
										<view class="inputNormal" :style="{backgroundColor:update?'':'#F5F5F5'}">
											<text class="time" :style="{color:(formData.followUpDate?'':'#acacac')}"
												v-text="formData.outhospitalDate?formData.outhospitalDate:'选择时间'"></text>
											<text class="iconfont icon-Iconmaterial-date-range"></text>
										</view>
									</picker>
								</view>
								<!-- <view class="cardItem">
										<view class="title">失访原因</view>
										<picker 
									   @change="bindPickerChange($event,'sfyy')"
									   :range="sfReason" range-key="text">
											<view class="inputNormal" :style="{backgroundColor:update?'':'#F5F5F5'}" :class="{'redColor':!$v.formData.followUpDate.required}">
												<text class="time" :style="{color:(formData.followUpDate?'':'#acacac')}"  v-text="formData.followUpDate?formData.followUpDate:'选择时间'"></text>
												<text class="iconfont icon-to"></text>
											</view>
										</picker>
									</view>	 -->
							</view>
						</view>
						<view class="sfImg">
							<view class="title">随访照片</view>
							<view class="imgBox">
								<!-- :class="{'redBorder':!$v.formData.folUrl1.required}" -->
								<view class="img" @tap="takePho(1)" style="margin-right: 5px;">
									<img :src="folUrl1" alt="">
									<text class="iconfont icon-paizhaozhaopian"></text>
								</view>
								<view class="img" @tap="takePho(2)" style="margin-left: 5px;">
									<img :src="folUrl2" alt="">
									<text class="iconfont icon-paizhaozhaopian"></text>
								</view>
							</view>
							<view class="imgReason">
								<view class="title">未拍照原因</view>
								<view class="cardVal">
									<input type="text" v-model="formData.wpzyy" class="inp" value="" />
								</view>
							</view>
						</view>
					</view>
				</view>
			</self-fold-card>
			<!-- 一般健康情况 -->
			<self-fold-card id="ybjkqk" :show="listShow.ybjkqk" backgroundColor="#fff" @closeOther="closeOther"
				title="一般健康情况">
				<view slot="fold">
					<view class="card">
						<view class="card">
							<input type="text" placeholder="请填写" class="inputBig" v-model="formData.health" value="" />
						</view>
					</view>
				</view>
			</self-fold-card>
			<!-- 一般心理情况 -->
			<self-fold-card id="ybxlqk" :show="listShow.ybxlqk" backgroundColor="#fff" @closeOther="closeOther"
				title="一般心理情况">
				<view slot="fold">
					<view class="card">
						<view class="card">
							<input type="text" placeholder="请填写" class="inputBig" v-model="formData.psychological"
								value="" />
						</view>
					</view>
				</view>
			</self-fold-card>
			<!-- 一般检查 -->
			<self-fold-card id="ybjc" :show="listShow.ybjc" backgroundColor="#fff" @closeOther="closeOther"
				title="一般检查">
				<view slot="fold">
					<view class="card">
						<view class="card">
							<view class="cardItem">
								<view class="title">血压/收缩压</view>
								<view class="cardVal">
									<input type="number" v-model="formData.highPressure" placeholder="请填写" class="inp"
										value="" />
									<view class="dw min">mmHg</view>
								</view>
							</view>
							<view class="cardItem">
								<view class="title">血压/舒张压</view>
								<view class="cardVal">
									<input type="number" v-model="formData.lowPressure" placeholder="请填写" class="inp"
										value="" />
									<view class="dw min">mmHg</view>
								</view>
							</view>
						</view>
					</view>
					<view class="card">
						<view class="cardItem">
							<view class="title">体温</view>
							<view class="cardVal">
								<input type="number" v-model="formData.bodyTemperature" placeholder="请填写" class="inp"
									value="" />
								<view class="dw min">℃</view>
							</view>
						</view>
					</view>
				</view>
			</self-fold-card>
			<!-- 身体状况 -->
			<self-fold-card id="stzk" :show="listShow.stzk" backgroundColor="#fff" @closeOther="closeOther"
				title="身体状况">
				<view slot="fold">
					<view class="zzBox">
						<view class="title">乳房</view>
						<self-radio :list="unusualConfig" :inline="true" :itemCss="radioCss" v-model="formData.breasts">
						</self-radio>
						<view class="title">乳房情况</view>
						<view class="card">
							<input type="text" placeholder="请填写" class="inputBig" v-model="formData.breastsOther"
								value="" :disabled="formData.breasts=='1'" />
						</view>
						<view class="title">恶露</view>
						<self-radio :list="unusualConfig" :inline="true" :itemCss="radioCss" v-model="formData.lochia">
						</self-radio>
						<view class="title">恶露情况</view>
						<view class="card">
							<input type="text" placeholder="请填写" class="inputBig" v-model="formData.lochiaOther"
								value="" :disabled="formData.lochia=='1'" />
						</view>
						<view class="title">子宫</view>
						<self-radio :list="unusualConfig" :inline="true" :itemCss="radioCss" v-model="formData.womb">
						</self-radio>
						<view class="title">子宫情况</view>
						<view class="card">
							<input type="text" placeholder="请填写" class="inputBig" v-model="formData.wombOther" value=""
								:disabled="formData.womb=='1'" />
						</view>
						<view class="title">伤口</view>
						<self-radio :list="unusualConfig" :inline="true" :itemCss="radioCss" v-model="formData.wound">
						</self-radio>
						<view class="title">伤口情况</view>
						<view class="card">
							<input type="text" placeholder="请填写" class="inputBig" v-model="formData.woundOther" value=""
								:disabled="formData.wound=='1'" />
						</view>
					</view>
				</view>
			</self-fold-card>
			<!-- 分类 -->
			<self-fold-card id="fl" :show="listShow.fl" backgroundColor="#fff" @closeOther="closeOther" title="分类">
				<view slot="fold">
					<view class="zzBox">
						<self-radio :list="this.type==6?unusualConfig:unusualConfig1" :inline="true" :itemCss="radioCss"
							v-model="formData.kind"></self-radio>
						<view class="card">
							<input type="text" placeholder="请填写" class="inputBig" v-model="formData.kindOther" value=""
								:disabled="formData.kind=='1'" />
						</view>
					</view>
				</view>
			</self-fold-card>
			<!-- 指导 -->
			<self-fold-card id="zz" :show="listShow.zz" backgroundColor="#fff" @closeOther="closeOther" title="指导">
				<view slot="fold">
					<view class="zzBox">
						<self-checkbox :list="type==6?zdList:zdList1" v-model="formData.guide"></self-checkbox>
						<view class="title">其他</view>
						<view class="card">
							<input type="text" class="inputBig" v-model="formData.guideOther" value="" />
						</view>
					</view>
				</view>
			</self-fold-card>
			<!-- 转诊 -->
			<self-fold-card id="zhuanzhen" :show="listShow.zhuanzhen" backgroundColor="#fff" @closeOther="closeOther"
				title="转诊">
				<view slot="fold">
					<view class="zzhenBox">
						<view class="title">机构及科室</view>
						<view class="card">
							<input type="text" v-model="formData.transferOrg" class="inputBig" value="" />
						</view>
						<view class="title">转诊原因</view>
						<view class="card">
							<input type="text" v-model="formData.transferReason" class="inputBig" value="" />
						</view>
						<view class="card">
							<view class="addIcon">
								<view class="resert" @tap="clearZzhen()">
									</text><text>清空转诊单</text>
								</view>
								<view class="btn"
									@tap="linkTo('/pages/home/diseaseVisit/components/Referral/Referral')">
									<text class="iconfont icon-xinzeng"></text><text>填写转诊单</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</self-fold-card>
			<!--随访信息-->
			<self-fold-card id="sfxx" :show="listShow.sfxx" backgroundColor="#fff" @closeOther="closeOther"
				title="随访信息">
				<view slot="fold">
					<view class="sfxxBox">
						<view class="title">下次随访日期</view>
						<picker @change="bindPickerChange($event,'xcsf')" mode=date>
							<view class="card" :class="{'redColor':!$v.formData.nextDate.required}">
								<view class="sfTime" v-text="formData.nextDate?formData.nextDate:'请选择'"></view>
								<text class="iconfont icon-Iconmaterial-date-range"></text>
							</view>
						</picker>
						<view class="title">随访医生签名</view>
						<view class="card" :class="{'redColor':!$v.formData.doctorName.required}">
							<my-picker :picker-list="doctorList" :picker-key="{value: 'value', label: 'name', }"
								@confirm="doctorChange($event)" :range="doctorList">
								<input type="text" v-model="formData.doctorName" value="" placeholder="请填写" />
							</my-picker>
						</view>
						<view class="title">居民签名</view>
						<view class="card">
							<input type="text" v-model="formData.juminName" placeholder="请填写" />
						</view>
						<!-- <view class="title">居民手写签名</view>
						<view class="card" style="border: none;">
							<view class="qmBox" @tap="goQm()">
								<img :src="qmUrl" mode="">
								<text v-show="!qmUrl" class="iconfont icon-weiqianzi"></text>
							</view>
						</view> -->
						<view class="title" v-show="this.type==7">随访结局</view>
						<view class="card" v-show="this.type==7">
							<input type="text" v-model="formData.remarks" value="" placeholder="请填写" />
						</view>
					</view>
				</view>
			</self-fold-card>
		</view>
	</view>
</template>

<script>
	import selfRouter from '@/components/self-router/self-router.vue'
	import ImageTool from '@/h5PlusApi/imgUpload.js'
	import config from '../config/ycf7/config-ycf7-config.js'
	import formData from '../config/ycf7/formDataYcf7.js'
	import {
		switchRouter,
		getName
	} from '@/common/tool.js'
	import {
		required,
		minLength,
		between
	} from 'vuelidate/lib/validators'
	import mixin from '../config/ycf7/mixins-ycf7.js'
	import selfFoldCard from '@/components/self-fold-card/self-fold-card.vue'
	import selfCheckbox from '@/components/self-checkbox/self-checkbox.vue'
	import selfRadio from '@/components/self-radio/self-radio.vue'
	import {
		getSaveYcfSfInfo,
		addOrUpdateFollowUp
	} from '@/request/ycfSf.js'
	import {
		getSfList
	} from '@/request/ycfSf.js'
	import myPicker from '@/components/my-picker/Picker.vue'
	import {
		getDocUserList
	} from '@/request/jmsf.js'
	export default {
		components: {
			selfFoldCard,
			selfCheckbox,
			selfRadio,
			myPicker,
			selfRouter
		},
		data() {
			return {
				title: '',
				followId: false,
				currTeam: {
					name: ''
				},
				teamList: [{
						name: '孕13周前随访',
						id: 1
					},
					{
						name: '孕16-20周随访',
						id: 2
					},
					{
						name: '孕21-24周随访',
						id: 3
					},
					{
						name: '孕28-36周随访',
						id: 4
					},
					{
						name: '孕37-40周随访',
						id: 5
					},
					{
						name: '产后7天内随访',
						id: 6
					},
					{
						name: '产后42天随访',
						id: 7
					}
				],
				...config,
				...formData,
				rqtype: '',
				lastWeight: '',
				// 该字段判定可不可更新
				update: true,
				//随访照片
				folUrl1: '',
				folUrl2: '',
				// 签名照片
				qmUrl: '',
				doctorList: [{
					name: '',
					value: ''
				}, ],
				saveDisable: false,
				type: '',
				cardId: '',
				idCard: '',
				name: '',
				statusEnd: '',
			};
		},
		mixins: [mixin],
		onShow() {
			// 签名监听
			uni.$once("ycf7handleFinsh", res => {
				//console.log('签名完成得到base' ,res.data);
				if (res.data) {
					this.qmUrl = res.data
					this.formData.juminNameUrl2Base64 = res.data.split(',')[1]
				}
				uni.$off('ycf7handleFinsh')
			})

			// 转诊监听
			uni.$off('YCF7')
			uni.$once("YCF7", res => {
				console.log('转诊得到', res);
				if (res.data) {
					this.formData.transferOrg = res.data.transferOrg
					this.formData.contractName = res.data.contractName
					this.formData.contractImpression = res.data.contractImpression
					this.formData.transferReason = res.data.transferReason
					this.formData.contractJws = res.data.contractJws
					this.formData.contractCure = res.data.contractCure
				}
			})
		},
		onLoad: function(option) {
			for (let key in this.listShow) {
				this.$set(this.listShow, key, true)
			}
			console.log('随访记录传参', JSON.parse(decodeURIComponent(option.data)))
			option = JSON.parse(decodeURIComponent(option.data))
			this.currTeam.name = getName(option.type, this.teamList)
			if (option.id == '') {
				this.followId = true
			}
			this.type = option.type
			this.cardId = option.cardId
			this.idCard = option.idCard
			this.statusEnd = option.statusEnd
			this.$showLoading('加载中')
			getSaveYcfSfInfo({
				cardId: option.cardId,
				folId: option.id,
				type: option.type
			}).then(res => {
				console.log('孕产妇随访编辑回显', res)
				uni.hideLoading()
				const that = this
				if (res.ret && res.data) {
					this.update = res.data.update
					Object.assign(this.formData, res.data.data)
					this.formData.guide = JSON.parse(this.formData.guide)
					// 人员提示类型
					this.rqtype = res.data.rqtype
					console.log('获取的人员类型', this.formData)
					//标题
					this.name = res.data.data.name
					this.title = res.data.data.name + getName(option.type, this.teamList)
					// 照片处理
					this.folUrl1 = this.formData.folUrl1 ? this.$IMGURL + this.formData.folUrl1 : '';
					this.folUrl2 = this.formData.folUrl2 ? this.$IMGURL + this.formData.folUrl2 : '';
					this.formData.juminName = this.name
					//this.qmUrl = this.formData.juminNameUrl ? this.$IMGURL + this.formData.juminNameUrl : '';
					//标题
					this.title = res.data.data.name + getName(option.type, this.teamList)
					// 页面传参赋值
					this.formData.cardId = option.cardId
					this.formData.name = option.name
					this.formData.orgId = option.orgId
					this.formData.orgName = option.orgName
					this.formData.ehrId = option.ehrId
					this.formData.idCard = option.idCard
					this.lastWeight = this.formData.weight

					//处理定位
					plus.geolocation.getCurrentPosition(function(p) {
						//console.log(vm)
						that.formData.location = p.addresses;
						that.formData.latitude = p.coords.latitude;
						that.formData.longitude = p.coords.longitude;
					}, function(e) {
						alert('定位服务未开启，请在设置中打开GPS定位服务,并重新进入本页面。');
					});
				} else {
					if (res.mes) {
						this.$showToast(res.mes)
					} else {
						this.$showToast('程序出了点小问题,请联系管理员')
					}
				}
			}, err => {
				this.$showToast('程序出了点小问题或网络连接失败')
			})
		},
		mounted() {
			this.$v.$touch();
			//获取医生列表
			getDocUserList().then(res => {
				if (res.ret) {
					this.doctorList = res.data
				}
			}, err => {})
		},
		// 监听返回按键
		onBackPress(event) {
			if (event.from === 'navigateBack') {
				return false;
			}
			this.back()
			return true
		},
		methods: {
			//创建随访时间切换
			yearChange(item) {
				let {
					id
				} = item
				let folId = ""
				// console.log('拿到的id',id)
				// console.log('拿到的cardid',this.formData.cardId)
				switchRouter(id, folId, this.formData.idCard, this.formData.name, this.formData.cardId)
			},
			//清空转诊
			clearZzhen() {
				this.formData.transferOrg = ''
				this.formData.contractName = ''
				this.formData.contractImpression = ''
				this.formData.transferReason = ''
				this.formData.contractJws = ''
				this.formData.contractCure = ''
			},
			doctorChange(e) {
				this.formData.doctorName = e.label
				this.formData.doctorId = e.value
			},
			onEditorReady() {
				uni.createSelectorQuery().select('#editor').context((res) => {
					this.editorCtx = res.context
				}).exec()
			},
			finsh(evenet) {
				console.log('孕产妇随访保存传参', this.formData)
				this.$v.formData.$touch();
				if (this.$v.$invalid) {
					this.$showToast('保存失败，请确认页面无缺项后重试')
				} else if (!this.$v.formData.nextDate.required) {
					this.$showToast('下次随访时间必填')
				} else {
					// 验证通过
					//只允许点一次
					if (this.saveDisable) {
						return;
					}
					this.saveDisable = true;
					var req = Object.assign({}, this.formData)
					req.guide = JSON.stringify(req.guide)
					req.type = this.type
					req.cardId = this.cardId
					req.idCard = this.idCard
					req.name = this.name
					req.statusEnd = this.statusEnd
					var json = JSON.stringify(req)
					console.log("req", req)
					this.$showLoading('加载中')
					addOrUpdateFollowUp(json).then(res => {
						//console.log('高血压保存回调',res)
						//console.log('高血压保存传参',req)
						uni.hideLoading()
						if (res.ret) {
							this.$showToast('保存成功')
							setTimeout(() => {
								this.back()
							}, 1000)
						} else {
							this.$showToast(res.mes)
						}
					}, err => {
						uni.hideLoading()
						this.$showToast('服务器错误')
					})
				}
			},
			// 弹窗picker数据处理
			bindPickerChange(event, type) {
				let {
					value
				} = event.detail
				if (type == 'sfrq') {
					this.formData.followUpDate = value
				} else if (type == 'fmrq') {
					this.formData.deliveryDate = value
					// 触发下次随访逻辑判断
				} else if (type == 'cyrq') {
					this.formData.outhospitalDate = value
				} else if (type == 'xcsf') {
					this.formData.nextDate = value
				}
			},
			// 关闭非当前的card
			closeOther(id) {
				for (let key in this.listShow) {
					this.$set(this.listShow, key, false)
				}
				this.$set(this.listShow, id, true);
			},
			// 拍照
			takePho(num) {
				const that = this
				if (this.update) {
					var imgTool_upload = new ImageTool({
						ZoomQuality: 30, //压缩图片的质量
						autoUpload: false,
						success: function(url, base64) {
							//console.log('拍照的结果',url,base64);
							if (num == 1) {
								that.folUrl1 = base64
								that.formData.folUrl1Base64 = base64.split(',')[1];
							} else {
								that.folUrl2 = base64
								that.formData.folUrl2Base64 = base64.split(',')[1];
							}
						},
						error: function(err) {
							console.log(err);
						}
					});
					plus.nativeUI.actionSheet({
						title: "选择照片",
						cancel: "取消",
						buttons: [{
							title: "打开摄像头拍照"
						}, {
							title: "选取现有照片"
						}, {
							title: "删除当前照片"
						}]
					}, (e) => {
						if (e.index == 1) {
							//拍照
							imgTool_upload.camera();
						} else if (e.index == 2) {
							// 选取照片
							imgTool_upload.galleryImgs();
						} else {
							if (num == 1) {
								that.folUrl1 = ''
								that.formData.folUrl1Base64 = '';
							} else {
								that.folUrl2 = ''
								that.formData.folUrl2Base64 = '';
							}
						}
					})
				} else {
					this.$showToast('不可更改照片')
				}
			},

			// 转诊
			linkTo(url) {
				var post = {
					type: 'YCF7'
				}
				if (url == '/pages/home/diseaseVisit/components/Referral/Referral') {
					url += '?type=YCF7' + '&transferOrg=' + this.formData.transferOrg + '&transferReason=' + this.formData
						.transferReason + "&from=" + 'pregant'
				}
				uni.navigateTo({
					url: url
				})
			},
			// 签名
			goQm() {
				uni.navigateTo({
					url: '/pages/my/handWriter/index' + '?model=ycfsf7'
				})
			}
		}
	}
</script>

<style lang="scss">
	@import "../public.scss";
</style>
