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
									<view class="title">填表孕周</view>
									<view class="inputNormal" @tap="linkageVisible=true"
										:class="{'redColor':!$v.formData.createWeek.required}">
										<text class="text"
											v-text="formData.createWeek?`${formData.createWeek}周${formData.createDay}天`:'选择时间'"></text>
										<text class="iconfont icon-to"></text>
									</view>
									<w-picker :visible.sync="linkageVisible" mode="linkage" :options="yzList" :level="2"
										default-type="id" :default-props="defaultProps1"
										@confirm="yunzhouChange($event)" ref="linkage">
									</w-picker>
								</view>
							</view>
							<view class="card">
								<view class="cardItem">
									<view class="title">丈夫姓名</view>
									<view class="cardVal">
										<input type="text" v-model="formData.hubbyName" placeholder="请填写" class="inp"
											value="" />
									</view>
								</view>
								<view class="cardItem">
									<view class="title">丈夫年龄</view>
									<view class="cardVal">
										<input type="number" v-model="formData.hubbyAge" placeholder="请填写" class="inp"
											value="" />
									</view>
								</view>
							</view>
							<view class="card">
								<view class="cardItem">
									<view class="title">丈夫电话</view>
									<view class="cardVal">
										<input type="text" v-model="formData.hubbyPhone" placeholder="请填写" class="inp"
											value="" />
									</view>
								</view>
								<view class="cardItem">
									<view class="title">孕次</view>
									<view class="cardVal">
										<input type="number" v-model="formData.gravidity" placeholder="请填写" class="inp"
											value="" />
										<view class="dw">胎</view>
									</view>
								</view>
							</view>
							<view class="card">
								<view class="cardItem">
									<view class="title">阴道分娩</view>
									<view class="cardVal">
										<input type="text" v-model="formData.vaginalDeliveryTimes" placeholder="请填写"
											class="inp" value="" />
										<view class="dw">次</view>
									</view>
								</view>
								<view class="cardItem">
									<view class="title">剖宫产</view>
									<view class="cardVal">
										<input type="number" v-model="formData.cesareanSectionTimes" placeholder="请填写"
											class="inp" value="" />
										<view class="dw">次</view>
									</view>
								</view>
							</view>
							<view class="card">
								<view class="cardItem">
									<view class="title">末次月经</view>
									<picker @change="bindPickerChange($event,'mcyj')" mode=date>
										<view class="inputNormal" :class="{'redColor':!$v.formData.lmp.required}">
											<text class="time" :style="{color:(formData.lmp?'':'#acacac')}"
												v-text="formData.lmp?formData.lmp:'选择时间'"></text>
											<text class="iconfont icon-Iconmaterial-date-range"></text>
										</view>
									</picker>
								</view>
								<view class="cardItem">
									<view class="title">预产期</view>
									<picker @change="bindPickerChange($event,'ycq')" mode=date>
										<view class="inputNormal" :class="{'redColor':!$v.formData.edc.required}">
											<text class="time" v-text="formData.edc?formData.edc:'选择时间'"></text>
											<text class="iconfont icon-Iconmaterial-date-range"></text>
										</view>
									</picker>
								</view>
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
			<!-- 既往史 -->
			<self-fold-card id="jws" :show="listShow.jws" backgroundColor="#fff" @closeOther="closeOther" title="既往史">
				<view slot="fold">
					<view class="zzBox">
						<self-checkbox :huchi="true" :list="jwsList" v-model="formData.previousHistory"></self-checkbox>
						<view class="title">其他</view>
						<view class="card">
							<input type="text" class="inputBig" v-model="formData.previousHistoryOther" value="" />
						</view>
					</view>
				</view>
			</self-fold-card>
			<self-fold-card id="jzs" :show="listShow.jzs" backgroundColor="#fff" @closeOther="closeOther" title="家族史">
				<view slot="fold">
					<view class="zzBox">
						<self-radio :list="jzsList" :inline="true" :itemCss="radioCss" v-model="formData.familyHistory">
						</self-radio>
						<view class="title">其他</view>
						<view class="card">
							<input type="text" class="inputBig" v-model="formData.familyHistoryOther" value=""
								:disabled="formData.familyHistory!='4'" />
						</view>
					</view>
				</view>
			</self-fold-card>
			<self-fold-card id="grs" :show="listShow.grs" backgroundColor="#fff" @closeOther="closeOther" title="个人史">
				<view slot="fold">
					<view class="zzBox">
						<self-checkbox :huchi="true" :list="grsList" v-model="formData.personalHistory"></self-checkbox>
						<view class="title">其他</view>
						<view class="card">
							<input type="text" class="inputBig" v-model="formData.personalHistoryOther" value=""
								:disabled="!formData.personalHistory.includes(32)" />
						</view>
					</view>
				</view>
			</self-fold-card>
			<self-fold-card id="fkshs" :show="listShow.fkshs" backgroundColor="#fff" @closeOther="closeOther"
				title="妇科手术史">
				<view slot="fold">
					<view class="zzBox">
						<self-radio :list="fkshs" :inline="true" :itemCss="radioCss"
							v-model="formData.gynecologicalSurgeryHistory"></self-radio>
						<view class="card">
							<input type="text" placeholder="请填写" class="inputBig"
								v-model="formData.gynecologicalSurgeryHistoryOther" value=""
								:disabled="formData.gynecologicalSurgeryHistory=='1'" />
						</view>
					</view>
				</view>
			</self-fold-card>
			<self-fold-card id="ycs" :show="listShow.ycs" backgroundColor="#fff" @closeOther="closeOther" title="孕产史">
				<view slot="fold">
					<view class="zzBox">
						<view class="card">
							<view class="cardItem">
								<view class="title">自然流产</view>
								<view class="cardVal">
									<input type="text" v-model="formData.spontaneousAbortion" placeholder="请填写"
										class="inp" value="" />
									<view class="dw">次</view>
								</view>
							</view>
							<view class="cardItem">
								<view class="title">人工流产</view>
								<view class="cardVal">
									<input type="number" v-model="formData.midtermGestation" placeholder="请填写"
										class="inp" value="" />
									<view class="dw">次</view>
								</view>
							</view>
						</view>
						<view class="card">
							<view class="cardItem">
								<view class="title">死胎</view>
								<view class="cardVal">
									<input type="text" v-model="formData.fetalDeath" placeholder="请填写" class="inp"
										value="" />
									<view class="dw">次</view>
								</view>
							</view>
							<view class="cardItem">
								<view class="title">死产</view>
								<view class="cardVal">
									<input type="number" v-model="formData.stillbirthNumber" placeholder="请填写"
										class="inp" value="" />
									<view class="dw">次</view>
								</view>
							</view>
						</view>
						<view class="card">
							<view class="cardItem">
								<view class="title">新生儿死亡</view>
								<view class="cardVal">
									<input type="text" v-model="formData.neonatalDeaths" placeholder="请填写" class="inp"
										value="" />
									<view class="dw">次</view>
								</view>
							</view>
							<view class="cardItem">
								<view class="title">出生缺陷儿</view>
								<view class="cardVal">
									<input type="number" v-model="formData.birthDefectsNumber" placeholder="请填写"
										class="inp" value="" />
									<view class="dw">次</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</self-fold-card>
			<self-fold-card id="ybjc" :show="listShow.ybjc" backgroundColor="#fff" @closeOther="closeOther"
				title="一般检查">
				<view slot="fold">
					<view class="zzBox">
						<view class="card">
							<view class="cardItem">
								<view class="title">血压/收缩压</view>
								<view class="cardVal">
									<input type="text" v-model="formData.highPressure" placeholder="请填写" class="inp"
										value="" />
									<view class="dw">mmHg</view>
								</view>
							</view>
							<view class="cardItem">
								<view class="title">血压/舒张压</view>
								<view class="cardVal">
									<input type="number" v-model="formData.lowPressure" placeholder="请填写" class="inp"
										value="" />
									<view class="dw">mmHg</view>
								</view>
							</view>
						</view>
						<view class="card">
							<view class="cardItem">
								<view class="title">身高</view>
								<view class="cardVal">
									<input type="text" v-model="formData.height" placeholder="请填写" class="inp"
										value="" />
									<view class="dw">cm</view>
								</view>
							</view>
							<view class="cardItem">
								<view class="title">体重</view>
								<view class="cardVal">
									<input type="number" v-model="formData.weight" placeholder="请填写" class="inp"
										value="" />
									<view class="dw">kg</view>
								</view>
							</view>
						</view>
						<view class="card">
							<view class="cardItem">
								<view class="title">BMI</view>
								<view class="cardVal">
									<input type="number" v-model="bmi_computed" placeholder="请填写" class="inp"
										value="" />
									<view class="dw">kg/m²</view>
								</view>
							</view>
							<view class="cardItem" v-show="type == 1">
								<view class="title">血糖</view>
								<view class="cardVal">
									<input type="number" v-model="formData.glu" placeholder="请填写" class="inp"
										value="" />
									<view class="dw">mmol/L</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</self-fold-card>
			<self-fold-card id="tz" :show="listShow.tz" backgroundColor="#fff" @closeOther="closeOther" title="听诊">
				<view slot="fold">
					<view class="zzBox">
						<view class="title">心脏</view>
						<self-radio :list="unusualConfig" :inline="true" :itemCss="radioCss"
							v-model="formData.heartAuscultation"></self-radio>
						<view class="card">
							<input type="text" placeholder="请填写" class="inputBig"
								v-model="formData.heartAuscultationOther" value=""
								:disabled="formData.heartAuscultation=='1'" />
						</view>
						<view class="title">肺部</view>
						<self-radio :list="unusualConfig" :inline="true" :itemCss="radioCss"
							v-model="formData.lungAuscultation"></self-radio>
						<view class="card">
							<input type="text" placeholder="请填写" class="inputBig"
								v-model="formData.lungAuscultationOther" value=""
								:disabled="formData.lungAuscultation=='1'" />
						</view>
					</view>
				</view>
			</self-fold-card>
			<self-fold-card id="fkjc" :show="listShow.fkjc" backgroundColor="#fff" @closeOther="closeOther"
				title="妇科检查">
				<view slot="fold">
					<view class="zzBox">
						<view class="title">外阴</view>
						<self-radio :list="unusualConfig" :inline="true" :itemCss="radioCss" v-model="formData.vulva">
						</self-radio>
						<view class="titles">外阴异常情况</view>
						<view class="card">
							<input type="text" placeholder="请填写" class="inputBig" v-model="formData.vulvaOther" value=""
								:disabled="formData.vulva=='1'" />
						</view>
						<view class="title">阴道</view>
						<self-radio :list="unusualConfig" :inline="true" :itemCss="radioCss" v-model="formData.vaginal">
						</self-radio>
						<view class="titles">阴道异常情况</view>
						<view class="card">
							<input type="text" placeholder="请填写" class="inputBig" v-model="formData.vaginalOther"
								value="" :disabled="formData.vaginal=='1'" />
						</view>
						<view class="title">宫颈</view>
						<self-radio :list="unusualConfig" :inline="true" :itemCss="radioCss" v-model="formData.cervix">
						</self-radio>
						<view class="titles">宫颈异常情况</view>
						<view class="card">
							<input type="text" placeholder="请填写" class="inputBig" v-model="formData.cervixOther"
								value="" :disabled="formData.cervix=='1'" />
						</view>
						<view class="title">子宫</view>
						<self-radio :list="unusualConfig" :inline="true" :itemCss="radioCss" v-model="formData.palace">
						</self-radio>
						<view class="titles">子宫异常情况</view>
						<view class="card">
							<input type="text" placeholder="请填写" class="inputBig" v-model="formData.palaceOther"
								value="" :disabled="formData.palace=='1'" />
						</view>
						<view class="title">附件</view>
						<self-radio :list="unusualConfig" :inline="true" :itemCss="radioCss"
							v-model="formData.uterineAdnexa"></self-radio>
						<view class="titles">附件异常情况</view>
						<view class="card">
							<input type="text" placeholder="请填写" class="inputBig" v-model="formData.uterineAdnexaOther"
								value="" :disabled="formData.uterineAdnexa=='1'" />
						</view>
					</view>
				</view>
			</self-fold-card>
			<self-fold-card id="ztpg" :show="listShow.ztpg" backgroundColor="#fff" @closeOther="closeOther"
				title="总体评估">
				<view slot="fold">
					<view class="zzBox">
						<self-radio :list="unusualConfig" :inline="true" :itemCss="radioCss"
							v-model="formData.totalEvaluate"></self-radio>
						<view class="card">
							<input type="text" placeholder="请填写" class="inputBig" v-model="formData.totalEvaluateOther"
								value="" :disabled="formData.totalEvaluate=='1'" />
						</view>
					</view>
				</view>
			</self-fold-card>
			<self-fold-card id="bjzd" :show="listShow.bjzd" backgroundColor="#fff" @closeOther="closeOther"
				title="保健指导">
				<view slot="fold">
					<view class="zzBox">
						<self-checkbox :list="bjzdList" v-model="formData.careGuide"></self-checkbox>
						<view class="title">其他</view>
						<view class="card">
							<input type="text" :disabled="!formData.careGuide.includes('32')" class="inputBig"
								v-model="formData.careGuideOther" value="" />
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
						<!-- <view class="title">随访结局</view>
						<view class="card">
							<input type="text" v-model="formData.remark" value="" placeholder="请填写" />
						</view> -->
					</view>
				</view>
			</self-fold-card>
		</view>
	</view>
</template>

<script>
	import selfRouter from '@/components/self-router/self-router.vue'
	import ImageTool from '@/h5PlusApi/imgUpload.js'
	import {
		switchRouter,
		getName
	} from '@/common/tool.js'
	import config from '../config/ycf13/config-ycf13-config.js'
	import formData from '../config/ycf13/formDataYcf13.js'
	import {
		required,
		minLength,
		between
	} from 'vuelidate/lib/validators'
	import mixin from '../config/ycf13/mixins-ycf13.js'
	import selfFoldCard from '@/components/self-fold-card/self-fold-card.vue'
	import selfCheckbox from '@/components/self-checkbox/self-checkbox.vue'
	import selfRadio from '@/components/self-radio/self-radio.vue'
	import {
		getSaveYcfSfInfo,
		addOrUpdateFollowUp
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
				formData,
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
				radioCss: '',
				type: '',
				cardId: '',
				idCard: '',
				name: '',
			};
		},
		mixins: [mixin],
		onShow() {
			// 签名监听
			uni.$once("ycf13handleFinsh", res => {
				//console.log('签名完成得到base' ,res.data);
				if (res.data) {
					this.qmUrl = res.data
					this.formData.juminNameUrl2Base64 = res.data.split(',')[1]
				}
				uni.$off('ycf13handleFinsh')
			})

			// 转诊监听
			uni.$off('YCF13')
			uni.$once("YCF13", res => {
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
			//从上页面拿数据
			for (let key in this.listShow) {
				this.$set(this.listShow, key, true)
			}
			console.log('随访记录传参', JSON.parse(decodeURIComponent(option.data)))
			option = JSON.parse(decodeURIComponent(option.data))
			this.currTeam.name = getName(option.type, this.teamList)
			if (option.id == '' || option.id == 'null') {
				this.followId = true
			}
			this.type = option.type

			// 生成孕周配置项
			this.yzList = []
			let index_end = 0,
				index_shift = 0
			if (this.type === 1) {
				index_end = 13
				index_shift = 1
			}

			for (var i = 0; i < index_end; i++) {
				this.yzList.push({
					id: i + index_shift,
					name: i + index_shift,
					child: [{
							id: 1,
							name: 1,
						},
						{
							id: 2,
							name: 2,
						},
						{
							id: 3,
							name: 3,
						},
						{
							id: 4,
							name: 4,
						},
						{
							id: 5,
							name: 5,
						},
						{
							id: 6,
							name: 6,
						},
					]
				}, )
			}
			
			console.log(this.yzList)

			this.cardId = option.cardId
			this.idCard = option.idCard
			this.$showLoading('加载中')
			const that = this
			console.log("option.idCard", option.idCard)
			getSaveYcfSfInfo({
				cardId: option.cardId,
				folId: option.id,
				type: option.type
			}).then(res => {
				console.log('孕产妇随访编辑回显', res)
				uni.hideLoading()
				if (res.ret && res.data) {
					this.update = res.data.update
					Object.assign(this.formData, res.data.data)
					this.formData.previousHistory = JSON.parse(this.formData.previousHistory)
					this.formData.familyHistory = JSON.parse(this.formData.familyHistory)
					this.formData.personalHistory = JSON.parse(this.formData.personalHistory)
					this.formData.careGuide = JSON.parse(this.formData.careGuide)



					// 人员提示类型
					this.rqtype = res.data.rqtype
					console.log('获取的人员类型', that.formData)
					this.name = res.data.data.name
					//标题
					this.title = res.data.data.name + getName(option.type, this.teamList)
					// 照片处理
					this.folUrl1 = this.formData.folUrl1 ? this.$IMGURL + this.formData.folUrl1 : '';
					this.folUrl2 = this.formData.folUrl2 ? this.$IMGURL + this.formData.folUrl2 : '';
					this.formData.juminName = this.name
					//this.qmUrl = this.formData.juminNameUrl ? this.$IMGURL + this.formData.juminNameUrl : '';

					// 页面传参赋值
					this.formData.cardId = option.cardId
					this.formData.name = option.name
					this.formData.orgId = option.orgId
					this.formData.orgName = option.orgName
					this.formData.ehrId = option.ehrId
					this.formData.idCard = option.idCard


					// this.lastWeight = this.formData.weight

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
						that.$showToast(res.mes)
					} else {
						that.$showToast('程序出了点小问题,请联系管理员')
					}
				}
			}, err => {
				console.log(err)
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
			//处理孕周
			yunzhouChange(e) {
				this.formData.createWeek = e.obj.col1.name;
				this.formData.createDay = e.obj.col2.name;
			},

			yearChange(item) {
				let {
					id
				} = item
				var folId = ""
				console.log('拿到的id', id)
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
					req.type = this.type
					console.log("this.cardid", this.cardId)
					req.cardId = this.cardId
					req.idCard = this.idCard
					req.name = this.name
					req.previousHistory = JSON.stringify(req.previousHistory)
					req.familyHistory = JSON.stringify(req.familyHistory)
					req.personalHistory = JSON.stringify(req.personalHistory)
					req.careGuide = JSON.stringify(req.careGuide)
					var json = JSON.stringify(req)
					console.log("给后台传入的json", json)

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
				} else if (type == 'mcyj') {
					this.formData.lmp = value
				} else if (type == 'ycq') {
					this.formData.edc = value
				} else if (type == 'xcsf') {
					this.formData.nextDate = value
				} else if (type == 'tbyz') {
					this.formData.createWeek = value
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

			// 孕产妇13转诊跳转
			linkTo(url) {
				var post = {
					type: 'YCF13'
				}
				if (url == '/pages/home/diseaseVisit/components/Referral/Referral') {
					url += '?type=YCF13' + '&transferOrg=' + this.formData.transferOrg + '&transferReason=' + this.formData
						.transferReason + "&from=" + 'pregant'
				}
				uni.navigateTo({
					url: url
				})
			},
			// 签名
			goQm() {
				uni.navigateTo({
					url: '/pages/my/handWriter/index' + '?model=ycfsf13'
				})
			}
		}
	}
</script>

<style lang="scss">
	@import "../public.scss";
</style>
