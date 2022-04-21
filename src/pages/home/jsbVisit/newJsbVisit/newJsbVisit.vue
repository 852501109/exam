<template>
	<view class="self-index">
		<uni-nav-bar fixed="true" :title="formData.name + '的精神病随访信息'" :isBack="true" height="40rpx" background-color="#35A8FF"
		 color="#FFFFFF">
			<view slot="right">
				<view class="finsh" @tap="finsh">保存</view>
			</view>
		</uni-nav-bar>
		<view class="content">
			<!-- 基本信息 -->
			<self-fold-card id="jbxx" :dotShow="jbxxIsEmpty" :show="listShow.jbxx" backgroundColor="#fff" @closeOther="closeOther"
			 title="基本信息">
				<view slot="fold">
					<view class="jbxxBox">
						<view class="rytype">
							人员类型提示：{{rqtype}}
						</view>
						<view class="sfxx">
							<view class="sfrq">
								<view class="title">随访日期</view>
								<view class="sffsChoose" :class="{'redColor':!$v.formData.followUpDate.required}">
									<picker class="pickCss" :disabled="!update" @change="bindPickerChange($event,'sfrq')" mode=date>
										<view class="sfrqChoose">
											<text class="time" :style="{color:(formData.followUpDate?'':'#acacac')}" v-text="formData.followUpDate?formData.followUpDate:'选择时间'"></text>
										</view>
									</picker>
									<text class="iconfont icon-Iconmaterial-date-range"></text>
								</view>
							</view>
							<view class="sfrq">
								<view class="title">随访方式</view>
								<view class="sffsChoose" :class="{'redColor':!$v.formData.followUpStyle.required}">
									<picker @change="bindPickerChange($event,'sffs')" :range="array">
										<view :style="{color:(formData.followUpStyle?'':'#acacac')}" class="uni-input" v-text="formData.followUpStyle?array[formData.followUpStyle.toString(2).length-1]:'选择方式'"></view>
									</picker>
									<text class="iconfont icon-to"></text>
								</view>
							</view>
						</view>
						<view class="sfxx">
							<view class="sfrq" style="margin-top: 10rpx;">
								<view class="title">失访原因</view>
								<view class="sffsChoose">
									<picker 
									@change="bindPickerChange($event,'sfyy')" 
									:range="sfReason" range-key="text">
										<view class="uni-input" v-text="formData.lostCause?sfReason[formData.lostCause.toString(2).length-1]:'选择原因'"></view>
									</picker>
									<text class="iconfont icon-to"></text>
								</view>
							</view>
						</view>
						<view class="sfImg">
							<view class="title">随访照片</view>
							<view class="imgBox">
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
			<!--死亡原因-->
			<self-fold-card id="swyy" :show="listShow.swyy" backgroundColor="#fff" @closeOther="closeOther" title="死亡原因">
				<view slot="fold">
					<view class="swyyBox jbxxBox">
						<view class="sfxx">
							<view class="sfrq" style="margin-top: 10rpx;">
								<view class="title">死亡日期</view>
								<view class="sffsChoose">
									<picker class="pickCss" @change="bindPickerChange($event,'swrq')" mode=date>
										<view class="sfrqChoose">
											<text class="time" :style="{color:(formData.followUpDate?'':'#acacac')}" v-text="formData.dieDate?formData.dieDate:'选择时间'"></text>
										</view>
									</picker>
									<text class="iconfont icon-Iconmaterial-date-range"></text>
								</view>
							</view>
							<view class="sfrq" style="margin-top: 10rpx;">
								<view class="title">死亡原因</view>
								<view class="sffsChoose">
									<picker @change="bindPickerChange($event,'swyy')" :range="deathReasonList">
										<view class="uni-input" v-text="formData.dieReason?deathReasonList[formData.dieReason.toString(2).length-1]:'选择原因'"></view>
									</picker>
									<text class="iconfont icon-to"></text>
								</view>
							</view>
						</view>
						<view class="title" v-show="formData.dieReason==1">躯体疾病</view>
						<view v-show="formData.dieReason==1" >
							<self-checkbox :list="qtjbList" :Css="deathCss" v-model="formData.dieCause"></self-checkbox>
						</view>
					</view>
				</view>
			</self-fold-card>
			<!--危险等级-->
			<self-fold-card id="wxx" 
			:dotShow="$v.formData.dangerLevel.$error"
			:show="listShow.wxx" 
			@closeOther="closeOther" 
			backgroundColor="#fff" title="危险等级">
				<view slot="fold">
					<view class="fyycxBox">
						<self-radio :list="wxlList" :inline="true" :itemCss="radioCss" v-model="formData.dangerLevel"></self-radio>
					</view>
				</view>
			</self-fold-card>
			<!-- 症状 -->
			<self-fold-card id="zz" :dotShow="zzIsEmpty" :show="listShow.zz" backgroundColor="#fff" @closeOther="closeOther"
			 title="目前症状">
				<view slot="fold">
					<view class="zzBox">
						<view class="other">
							<self-checkbox :list="zzList" v-model="formData.symptom"></self-checkbox>
							<view class="title" :class="{'fontColor':!$v.formData.symptomOther.required}">其他</view>
							<input type="text" :class="{'redColor':!$v.formData.symptomOther.required}" :disabled="!formData.symptom.includes('2048')"
							 class="inp" v-model="formData.symptomOther" value="" />
						</view>
					</view>
				</view>
			</self-fold-card>
			<!-- 自知力 -->
			<self-fold-card id="zzl" :show="listShow.zzl" @closeOther="closeOther" backgroundColor="#fff" title="自知力">
				<view slot="fold">
					<view class="fyycxBox">
						<self-radio :list="zzlList" :inline="true" :itemCss="radioCss" v-model="formData.insight"></self-radio>
					</view>
				</view>
			</self-fold-card>
			<!-- 睡眠 -->
			<self-fold-card id="sm" :show="listShow.sm" backgroundColor="#fff" @closeOther="closeOther" title="睡眠">
				<view slot="fold">
					<view class="fyycxBox">
						<self-radio :list="smList" :inline="true" :itemCss="radioCss" v-model="formData.sleepQuality"></self-radio>
					</view>
				</view>
			</self-fold-card>
			<!-- 饮食 -->
			<self-fold-card id="ys" :show="listShow.ys" backgroundColor="#fff" @closeOther="closeOther" title="饮食">
				<view slot="fold">
					<view class="fyycxBox">
						<self-radio :list="smList" :inline="true" :itemCss="radioCss" v-model="formData.dietaryStatus"></self-radio>
					</view>
				</view>
			</self-fold-card>
			<!-- 社会功能情况 -->
			<self-fold-card id="shgnqk" :show="listShow.shgnqk" backgroundColor="#fff" @closeOther="closeOther" title="社会功能情况">
				<view slot="fold">
					<view class="fyycxBox">
						<view class="title">个人生活料理</view>
						<self-radio :list="smList" :inline="true" :itemCss="radioCss" v-model="formData.lifeCare"></self-radio>
						<view class="title">家务活动</view>
						<self-radio :list="smList" :inline="true" :itemCss="radioCss" v-model="formData.houseword"></self-radio>
						<view class="title">生产劳动及工作</view>
						<self-radio :list="scldList" :inline="true" :itemCss="radioCss" v-model="formData.productiveLaborWork"></self-radio>
						<view class="title">学习能力</view>
						<self-radio :list="smList" :inline="true" :itemCss="radioCss" v-model="formData.learningAbility"></self-radio>
						<view class="title">社会交往</view>
						<self-radio :list="smList" :inline="true" :itemCss="radioCss" v-model="formData.communication"></self-radio>
					</view>
				</view>
			</self-fold-card>
			<!-- 危险行为 -->
			<self-fold-card id="wxxw" :show="listShow.wxxw" backgroundColor="#fff" @closeOther="closeOther" title="危险行为">
				<view slot="fold">
					<view class="wxxwBox">
						<view class="card">
							<view class="card-item">
								<view class="title">轻度滋事</view>
								<view class="cardVal">
									<input type="number" v-model="formData.dangerousBehavior.mildDisturbances" placeholder="请填写" class="inp" value="" />
									<view class="dw min">次</view>
								</view>
							</view>
							<view class="card-item">
								<view class="title">肇事</view>
								<view class="cardVal">
									<input type="number" v-model="formData.dangerousBehavior.causeTrouble" placeholder="请填写" class="inp" value="" />
									<view class="dw">次</view>
								</view>
							</view>
						</view>
						<view class="card">
							<view class="card-item">
								<view class="title">肇祸</view>
								<view class="cardVal">
									<input type="number" placeholder="请填写" v-model="formData.dangerousBehavior.causeAnAccident" class="inp" value="" />
									<view class="dw min">次</view>
								</view>
							</view>
							<view class="card-item">
								<view class="title">其他危害行为</view>
								<view class="cardVal">
									<input type="number" placeholder="请填写" v-model="formData.dangerousBehavior.otherRiskyBehaviors" class="inp"
									 value="" />
									<view class="dw">次</view>
								</view>
							</view>
						</view>
						<view class="card">
							<view class="card-item">
								<view class="title">自伤</view>
								<view class="cardVal">
									<input type="number" placeholder="请填写" v-model="formData.dangerousBehavior.attemptedSuicide" class="inp" value="" />
									<view class="dw min">次</view>
								</view>
							</view>
							<view class="card-item">
								<view class="title">自杀未遂</view>
								<view class="cardVal">
									<input type="number" placeholder="请填写" v-model="formData.dangerousBehavior.suicideAttempts" class="inp" value="" />
									<view class="dw">次</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</self-fold-card>
			<!-- 俩次随访期间关锁情况 -->
			<self-fold-card id="gs" backgroundColor="#fff" :show="listShow.gs" @closeOther="closeOther" title="俩次随访期间关锁情况">
				<view slot="fold">
					<view class="fyycxBox">
						<self-radio :list="gsList" :inline="true" :itemCss="radioCss" v-model="formData.captivityCase"></self-radio>
					</view>
				</view>
			</self-fold-card>
			<!-- 俩次随访期间住院情况 -->
			<self-fold-card id="zyqk" backgroundColor="#fff" :show="listShow.zyqk" @closeOther="closeOther" title="俩次随访期间住院情况">
				<view slot="fold">
					<view class="fyycxBox jbxxBox">
						<self-radio :list="zyList" :itemCss="radioCss" v-model="formData.inHospitalCase"></self-radio>
						<view class="sfxx">
							<view class="sfrq" style="margin-top: 10rpx;">
								<view class="title">末次出院时间</view>
								<view class="sffsChoose">
									<picker class="pickCss" @change="bindPickerChange($event,'mccy')" mode=date>
										<view class="sfrqChoose" :style="{backgroundColor:update?'':'#F5F5F5'}">
											<text class="time" :style="{color:(formData.followUpDate?'':'#acacac')}" v-text="formData.lastOutHospitalDate?formData.lastOutHospitalDate:'选择时间'"></text>
										</view>
									</picker>
									<text class="iconfont icon-Iconmaterial-date-range"></text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</self-fold-card>
			<!-- 一般检查 -->
			<self-fold-card id="ybjc" :show="listShow.ybjc" backgroundColor="#fff" @closeOther="closeOther" title="一般检查">
				<view slot="fold">
					<view class="wxxwBox">
						<view class="card">
							<view class="card-item">
								<view class="title">血压/收缩压</view>
								<view class="cardVal">
									<input type="number" v-model="formData.highPressure" placeholder="请填写" class="inp" value="" />
									<view class="dw min">mmHg</view>
								</view>
							</view>
							<view class="card-item">
								<view class="title">血压/舒张压</view>
								<view class="cardVal">
									<input type="number" v-model="formData.lowPressure" placeholder="请填写" class="inp" value="" />
									<view class="dw">mmHg</view>
								</view>
							</view>
						</view>
						<view class="card">
							<view class="card-item">
								<view class="title">体重</view>
								<view class="cardVal">
									<input type="number" placeholder="请填写" v-model="formData.weight" class="inp" value="" />
									<view class="dw min">kg</view>
								</view>
							</view>
							<view class="card-item">
								<view class="title">空腹血糖</view>
								<view class="cardVal">
									<input type="number" placeholder="请填写" v-model="formData.glu" class="inp" value="" />
									<view class="dw">mmol/L</view>
								</view>
							</view>
						</view>
						<view class="card">
							<view class="card-item">
								<view class="title">左眼视力</view>
								<view class="cardVal">
									<input type="number" placeholder="请填写" v-model="formData.leftVision" class="inp" value="" />
								</view>
							</view>
							<view class="card-item">
								<view class="title">右眼视力</view>
								<view class="cardVal">
									<input type="number" placeholder="请填写" v-model="formData.rightVision" class="inp" value="" />
								</view>
							</view>
						</view>
						<view class="card">
							<view class="card-item">
								<view class="title">左眼矫正视力</view>
								<view class="cardVal">
									<input type="number" placeholder="请填写" v-model="formData.leftCva" class="inp" value="" />
								</view>
							</view>
							<view class="card-item">
								<view class="title">右眼矫正视力</view>
								<view class="cardVal">
									<input type="number" placeholder="请填写" v-model="formData.rightCva" class="inp" value="" />
								</view>
							</view>
						</view>
						<view class="card">
							<view class="card-item">
								<view class="title">听力</view>
								<view class="tlChoose">
									<picker @change="bindPickerChange($event,'tl')" :range="tlConfig">
										<view class="uni-input" v-text="formData.hearing?tlConfig[formData.hearing.toString(2).length-1]:'请选择'"></view>
									</picker>
									<text class="iconfont icon-to"></text>
								</view>
							</view>
							<view class="card-item">
								<view class="title">运动能力</view>
								<view class="tlChoose">
									<picker @change="bindPickerChange($event,'ydnl')" :range="exerciseConfig">
										<view class="uni-input" v-text="formData.athleticAbility?exerciseConfig[formData.athleticAbility.toString(2).length-1]:'请选择'"></view>
									</picker>
									<text class="iconfont icon-to"></text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</self-fold-card>
			<!-- 目前用药情况 -->
			<self-fold-card id="mqyyqk" :dotShow="yyIsEmpty" backgroundColor="#fff" :show="listShow.mqyyqk" @closeOther="closeOther"
			 title="目前用药情况">
				<view slot="fold">
					<view class="mqyyqkBox">
						<view class="card">
							<view class="card-item" v-show="item.medicineName" v-for="(item,index) in formData.medication" :key="index">
								<view class="yyTitle" @tap="modifyMedic(index,item)">
									{{item.medicineName}}
									每日{{item.eatCount}}次
									每次{{item.medicineCount}}{{item.medicineUnit}}
									{{item.yybz}}
								</view>
								<text class="iconfont icon-shanchu" @tap="delmedic(index)"></text>
							</view>
							<view class="add">
								<view class="addIcon" @tap="linkTo('/pages/home/diseaseVisit/components/mqyyqk/mqyyqk')">
									<text class="iconfont icon-xinzeng"></text><text>新增一条</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</self-fold-card>
			<!-- 用药调整意见 -->
			<self-fold-card id="mqyyqkzd" backgroundColor="#fff" :show="listShow.mqyyqkzd" @closeOther="closeOther" title="用药调整意见">
				<view slot="fold">
					<view class="mqyyqkBox">
						<view class="card">
							<view class="card-item" v-show="item.medicineName" v-for="(item,index) in formData.medicationGuidance" :key="index">
								<view class="yyTitle" @tap="modifyMedicZd(index,item)">
									{{item.medicineName}}
									每日{{item.eatCount}}次
									每次{{item.medicineCount}}{{item.medicineUnit}}
									{{item.yybz}}
								</view>
								<text class="iconfont icon-shanchu" @tap="delmedicZd(index)"></text>
							</view>
							<view class="add">
								<view class="addIcon" @tap="linkTo('/pages/home/diseaseVisit/components/mqyyqk/mqyyqk','yyzd')">
									<text class="iconfont icon-xinzeng"></text><text>新增一条</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</self-fold-card>
			<!-- 服药依从性 -->
			<self-fold-card id="fyycx" backgroundColor="#fff" :show="listShow.fyycx" @closeOther="closeOther" title="服药依从性">
				<view slot="fold">
					<view class="fyycxBox">
						<self-radio :list="fyycxList" :itemCss="radioCss" v-model="formData.medicationCompliance"></self-radio>
					</view>
				</view>
			</self-fold-card>
			<!-- 药物不良反应 -->
			<self-fold-card id="ywblfy" backgroundColor="#fff" :show="listShow.ywblfy" @closeOther="closeOther" title="药物不良反应">
				<view slot="fold">
					<view class="fyycxBox zzBox">
						<self-radio :list="fwblfyList" :itemCss="radioCss" v-model="formData.adverceReactionCode"></self-radio>
						<view class="title">其他</view>
						<view class="other">
							<input type="text" class="inp" v-model="formData.adverceReactionDetail" value="" />
						</view>
					</view>
				</view>
			</self-fold-card>
			<!-- 治疗效果 -->
			<self-fold-card id="zlxg" backgroundColor="#fff" :show="listShow.zlxg" @closeOther="closeOther" title="治疗效果">
				<view slot="fold">
					<view class="fyycxBox">
						<self-radio :list="zlxgList" :itemCss="radioCss" v-model="formData.therapeuticEffect"></self-radio>
					</view>
				</view>
			</self-fold-card>
			<!-- 康复措施 -->
			<self-fold-card id="kfcs" backgroundColor="#fff" :show="listShow.kfcs" @closeOther="closeOther" title="康复措施">
				<view slot="fold">
					<view class="zzBox">
						<view class="other">
							<self-checkbox :list="kfcsList" v-model="formData.rehabilitationMeasures"></self-checkbox>
							<view class="title">其他</view>
							<input type="text" placeholder="请填写" class="inp" v-model="formData.rehabilitationMeasuresOther" value="" />
						</view>
					</view>
				</view>
			</self-fold-card>
			<!-- 此次随访分类 -->
			<!-- :dotShow="$v.formData.classifyFollowUp.$error" -->
			<self-fold-card id="ccsffl" 
			:show="listShow.ccsffl" backgroundColor="#fff" @closeOther="closeOther" title="此次随访分类">
				<view slot="fold">
					<view class="fyycxBox">
						<self-radio :list="sfflList" :itemCss="radioCss" v-model="formData.classifyFollowUp"></self-radio>
					</view>
				</view>
			</self-fold-card>
			<!-- 转诊 -->
			<self-fold-card id="zhuanz" :show="listShow.zhuanz" backgroundColor="#fff" @closeOther="closeOther" title="转诊">
				<view slot="fold">
					<view class="mqyyqkBox zhuanzhen">
						<view class="card">
							<view class="title">机构及科室</view>
							<view class="card-item disabled" >
								<input disabled="true" type="text" v-model="formData.transferOrg" class="inp" value="" />
							</view>
							<view class="title">转诊原因</view>
							<view class="card-item disabled">
								<input type="text" disabled="true" v-model="formData.transferReason" class="inp" value="" />
							</view>
							<view class="add zzhenBox">
								<view class="addIcon">
									<view class="btn resert" @tap="clearZzhen()">
										</text><text>清空转诊单</text>
									</view>
									<view class="btn" @tap="linkTo('/pages/home/diseaseVisit/components/Referral/Referral')">
										<text class="iconfont icon-xinzeng"></text><text>填写转诊单</text>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</self-fold-card>
			<!-- 随访信息 -->
			<self-fold-card id="sfxx" :show="listShow.sfxx" backgroundColor="#fff" @closeOther="closeOther" title="随访信息">
				<view slot="fold">
					<view class="sfxxBox">
						<view class="title">下次随访日期</view>
						<picker :disabled="!update" :class="update?'':'disabled'" @change="bindPickerChange($event,'xcsf')" mode=date>
							<view class="card">
								<view class="sfTime" v-text="formData.nextDate?formData.nextDate:'请选择'"></view>
								<text class="iconfont icon-Iconmaterial-date-range"></text>
							</view>
						</picker>
						<view class="title">随访医生签名</view>
						<view class="card">
							<my-picker 
							:search="true"
							:picker-list="doctorList" :picker-key="{value: 'value', label: 'name', }" @confirm="doctorChange($event)"
							 :range="doctorList">
								<input type="text" disabled="true" v-model="formData.doctorName" value="" placeholder="请填写" />
							</my-picker>
						</view>
						<view class="title">居民签名</view>
						<view class="card">
							<input type="text" disabled="true" v-model="formData.juminName" placeholder="请填写" />
						</view>
						<view class="title">居民手写签名</view>
						<view class="card" style="border: none;">
							<view class="qmBox" @tap="goQm()">
								<img :src="qmUrl" mode="">
								<text v-show="!qmUrl" class="iconfont icon-weiqianzi"></text>
							</view>
						</view>
						<view class="title">随访结局</view>
						<view class="card">
							<input type="text" v-model="formData.followUpResult" value="" placeholder="请填写" />
						</view>
					</view>
				</view>
			</self-fold-card>
		</view>
	</view>
</template>

<script>
	import ImageTool from '@/h5PlusApi/imgUpload.js'
	import config from '../config/config-jsb.js'
	import formData from '../config/formDataJsb.js'
	import {
		required,
		minLength,
		between
	} from 'vuelidate/lib/validators'
	import mixin from '../config/mixins-jsb.js'
	import selfFoldCard from '@/components/self-fold-card/self-fold-card.vue'
	import selfCheckbox from '@/components/self-checkbox/self-checkbox.vue'
	import selfRadio from '@/components/self-radio/self-radio.vue'
	import {
		getSaveZjSfInfo,
		getDocUserList,
		addOrUpdateFollowUp
	} from '@/request/jmsf.js'
	import myPicker from '@/components/my-picker/Picker.vue'
	export default {
		components: {
			selfFoldCard,
			selfCheckbox,
			selfRadio,
			myPicker
		},
		data() {
			return {
				...config,
				...formData,
				rqtype: '',
				lastWeight: '',
				// 该字段判定可不可更新
				update: true,
				//转诊是否必填项
				zzIsNeed: false,
				//随访照片
				folUrl1: '',
				folUrl2: '',
				// 签名照片
				qmUrl: '',
				itemCss: {
					width: '24%'
				},
				doctorList: [{
					name: '',
					value: ''
				}, ],
				zhzCss: {
					display: 'flex',
					flexWrap: 'wrap',
				},
				saveDisable: false
			};
		},
		mixins: [mixin],
		onShow() {
			// 签名监听
			uni.$once("jsbhandleFinsh", res => {
				//console.log('签名完成得到base' ,res.data);
				if (res.data) {
					this.qmUrl = res.data
					this.formData.juminNameUrl2Base64 = res.data.split(',')[1]
				}
				uni.$off('jsbhandleFinsh')
			})
			// 用药监听
			uni.$off('JSBYPMC')
			uni.$once("JSBYPMC", res => {
				console.log('用药新增得到', res);
				if (res.data) {
					if (this.formData.medication.length == 1 && !this.formData.medication[0].medicineName) {
						this.$set(this.formData.medication[0], 'medicineName', res.data.medicineName)
						this.$set(this.formData.medication[0], 'timeUnit', res.data.timeUnit)
						this.$set(this.formData.medication[0], 'eatCount', res.data.eatCount)
						this.$set(this.formData.medication[0], 'medicineCount', res.data.medicineCount)
						this.$set(this.formData.medication[0], 'medicineUnit', res.data.medicineUnit)
						this.$set(this.formData.medication[0], 'yybz', res.data.yybz)
					} else {
						this.formData.medication.push(res.data)
					}
				}
			})
			// 用药指导JSBYPMCZD
			uni.$off('JSBYPMCZD')
			uni.$once("JSBYPMCZD", res => {
				console.log('用药指导新增得到', res);
				if (res.data) {
					if (this.formData.medicationGuidance.length == 1 && !this.formData.medicationGuidance[0].medicineName) {
						this.$set(this.formData.medicationGuidance[0], 'medicineName', res.data.medicineName)
						this.$set(this.formData.medicationGuidance[0], 'timeUnit', res.data.timeUnit)
						this.$set(this.formData.medicationGuidance[0], 'eatCount', res.data.eatCount)
						this.$set(this.formData.medicationGuidance[0], 'medicineCount', res.data.medicineCount)
						this.$set(this.formData.medicationGuidance[0], 'medicineUnit', res.data.medicineUnit)
						this.$set(this.formData.medicationGuidance[0], 'yybz', res.data.yybz)
					} else {
						this.formData.medicationGuidance.push(res.data)
					}
				}
			})
			uni.$off('JSBYWXG')
			uni.$once("JSBYWXG", res => {
				console.log('监听药物修改', res);
				var index = res.index
				if (res.data) {
					this.$set(this.formData.medication[index], 'medicineName', res.data.medicineName)
					this.$set(this.formData.medication[index], 'timeUnit', res.data.timeUnit)
					this.$set(this.formData.medication[index], 'eatCount', res.data.eatCount)
					this.$set(this.formData.medication[index], 'medicineCount', res.data.medicineCount)
					this.$set(this.formData.medication[index], 'medicineUnit', res.data.medicineUnit)
					this.$set(this.formData.medication[index], 'yybz', res.data.yybz)
				}
			})
			//JSBZDYWXG监听修改指导
			uni.$off('JSBZDYWXG')
			uni.$once("JSBZDYWXG", res => {
				console.log('监听药物指导修改', res);
				var index = res.index
				if (res.data) {
					this.$set(this.formData.medicationGuidance[index], 'medicineName', res.data.medicineName)
					this.$set(this.formData.medicationGuidance[index], 'timeUnit', res.data.timeUnit)
					this.$set(this.formData.medicationGuidance[index], 'eatCount', res.data.eatCount)
					this.$set(this.formData.medicationGuidance[index], 'medicineCount', res.data.medicineCount)
					this.$set(this.formData.medicationGuidance[index], 'medicineUnit', res.data.medicineUnit)
					this.$set(this.formData.medicationGuidance[index], 'yybz', res.data.yybz)
				}
			})
			// 转诊监听
			uni.$off('JSBZZ')
			uni.$once("JSBZZ", res => {
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
			this.$showLoading('加载中')
			getSaveZjSfInfo({
				id: option.id,
				idCard: option.idCard
			}).then(res => {
				console.log('精神病随访编辑回显', res)
				uni.hideLoading()
				const that = this
				if (res.ret && res.data.data) {
					this.update = res.data.update
					this.formData = res.data.data
					this.formData.symptom = JSON.parse(this.formData.symptom)
					// 初始化数组
					this.formData.rehabilitationMeasures = JSON.parse(this.formData.rehabilitationMeasures)
					this.formData.dieCause = JSON.parse(this.formData.dieCause)
					this.formData.dangerousBehavior = JSON.parse(this.formData.dangerousBehavior)
					// 药物初始化
					if (this.formData.medication.length > 10) {
						this.formData.medication = JSON.parse(this.formData.medication)
					} else {
						this.formData.medication = [{
							medicineUnit: "片",
							medicineCount: "",
							eatCount: "",
							medicineName: "",
							timeUnit: "日",
							yybz: '',
						}]
					}
					if (this.formData.medicationGuidance.length > 10) {
						this.formData.medicationGuidance = JSON.parse(this.formData.medicationGuidance)
					} else {
						this.formData.medicationGuidance = [{
							medicineUnit: "片",
							medicineCount: "",
							eatCount: "",
							medicineName: "",
							timeUnit: "日",
							yybz: '',
						}]
					}
					//console.log('药品',this.formData.medication)
					// 人员提示类型
					this.rqtype = res.data.rqtype
					console.log(this.formData)
					// 照片处理
					this.folUrl1 = this.formData.folUrl1 ? this.$IMGURL + this.formData.folUrl1 : '';
					this.folUrl2 = this.formData.folUrl2 ? this.$IMGURL + this.formData.folUrl2 : '';
					this.qmUrl = this.formData.juminNameUrl ? this.$IMGURL + this.formData.juminNameUrl : '';

					// 页面传参赋值
					this.formData.cardId = option.psychopathId
					this.formData.name = option.name
					this.formData.orgId = option.orgId
					this.formData.orgName = option.orgName
					this.formData.ehrId = option.ehrId
					this.formData.idCard = option.idCard
					this.lastWeight = this.formData.weight
					// 根据update参数判断走不走接口console.log(this.update)
					if (this.update) {
						//this.gxyGetManageInfo();
					}
					//处理定位
					plus.geolocation.getCurrentPosition(function(p) {
						//console.log(vm)
						that.formData.location = p.addresses;
						that.formData.latitude = p.coords.latitude;
						that.formData.longitude = p.coords.longitude;
						console.log('地址参数', that.formData)
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

			})
		},
		mounted() {
			console.log('获取初始化', this.formData.followUpStyle, this.formData.followUpStyle.toString(2).length - 1)
			this.$v.$touch();
			//获取医生列表
			getDocUserList().then(res => {
				//console.log('获取的医生列表',res)
				if (res.ret) {
					this.doctorList = res.data
				}
			}, err => {})
			//debouncedHandleLogic =  _.debounce(this.handleLogic, 1000);
		},
		methods: {
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
			// 删除用药
			delmedic(index) {
				if (this.formData.medication.length > 1) {
					this.formData.medication.splice(index, 1)
				} else {
					this.$set(this.formData.medication[0], 'medicineUnit', '')
					this.$set(this.formData.medication[0], 'medicineCount', '')
					this.$set(this.formData.medication[0], 'eatCount', '')
					this.$set(this.formData.medication[0], 'medicineName', '')
					this.$set(this.formData.medication[0], 'timeUnit', '')
					this.$set(this.formData.medication[0], 'yybz', '')
				}
				console.log('删除', this.formData.medication)
			},
			// 删除指导
			delmedicZd(index) {
				if (this.formData.medicationGuidance.length > 1) {
					this.formData.medicationGuidance.splice(index, 1)
				} else {
					this.$set(this.formData.medicationGuidance[0], 'medicineUnit', '')
					this.$set(this.formData.medicationGuidance[0], 'medicineCount', '')
					this.$set(this.formData.medicationGuidance[0], 'eatCount', '')
					this.$set(this.formData.medicationGuidance[0], 'medicineName', '')
					this.$set(this.formData.medicationGuidance[0], 'timeUnit', '')
					this.$set(this.formData.medicationGuidance[0], 'yybz', '')
				}
				console.log('删除', this.formData.medicationGuidance)
			},
			finsh(evenet) {
				this.$v.formData.$touch();
				if (this.$v.$invalid) {
					this.$showToast('保存失败，请确认页面无缺项后重试')
				} else if (this.yyIsEmpty) {
					this.$showToast('用药未填写')
				} else if (!this.$v.formData.dangerLevel.required) {
					this.$showToast('危险等级必填')
				} else if(!this.$v.formData.nextDate.required){
					this.$showToast('下次随访时间必填')
				} else {
					// 验证通过
					//只允许点一次
					if (this.saveDisable) {
						return;
					}
					this.saveDisable = true;
					var req = Object.assign({}, this.formData)
					req.symptom = JSON.stringify(req.symptom)
					req.dieCause = JSON.stringify(req.dieCause)
					req.rehabilitationMeasures = JSON.stringify(req.rehabilitationMeasures)
					req.medication = JSON.stringify(req.medication)
					req.medicationGuidance = JSON.stringify(req.medicationGuidance)
					req.dangerousBehavior = JSON.stringify(req.dangerousBehavior)
					console.log('精神病保存传参', req)
					this.$showLoading('加载中')
					addOrUpdateFollowUp(req).then(res => {
						//console.log('高血压保存回调',res)
						uni.hideLoading()
						if (res.ret) {
							this.$showToast('保存成功')
							setTimeout(function() {
								uni.navigateBack({
									delta: 1
								})
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
				if (type == 'sffs') {
					this.formData.followUpStyle = Number(Math.pow(2, value))
				} else if (type == 'sfrq') {
					this.formData.followUpDate = value
					// 触发下次随访逻辑判断
				} else if (type == 'sfyy') {
					this.formData.lostCause = Number(Math.pow(2, value))
				} else if (type == 'swrq') {
					this.formData.dieDate = value
				} else if (type == 'swyy') {
					this.formData.dieReason = Number(Math.pow(2, value))
				} else if (type == 'xcsf') {
					this.formData.nextDate = value
				} else if (type == 'tl') {
					this.formData.hearing = Number(Math.pow(2, value))
				} else if (type == 'ydnl') {
					this.formData.athleticAbility = Number(Math.pow(2, value))
				} else if (type == 'mccy') {
					this.formData.lastOutHospitalDate = value
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
						},{
							title: "删除当前照片"
						}]
					}, (e)=>{
						if(e.index == 1){
							//拍照
							imgTool_upload.camera();
						} else if(e.index == 2){
							// 选取照片
							imgTool_upload.galleryImgs();
						} else {
							if(num==1){
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
			// 修改当前用药
			modifyMedic(index, item) {
				var post = {
					type: 'JSB',
					index: index,
					item: item
				}
				var url = '/pages/home/diseaseVisit/components/mqyyqk/mqyyqk?post= ' + encodeURIComponent(JSON.stringify(post))
				console.log(url)
				uni.navigateTo({
					url: url
				})
			},
			// 修改当前指导药
			modifyMedicZd(index, item) {
				var post = {
					type: 'JSBZD',
					index: index,
					item: item
				}
				var url = '/pages/home/diseaseVisit/components/mqyyqk/mqyyqk?post= ' + encodeURIComponent(JSON.stringify(post))
				console.log(url)
				uni.navigateTo({
					url: url
				})
			},
			// 目前用药情况等转诊跳转
			linkTo(url, type) {
				console.log(url)
				var post = {}
				if (url == '/pages/home/diseaseVisit/components/mqyyqk/mqyyqk' && !type) {
					post = {
						type: 'JSB'
					}
					url += '?post=' + encodeURIComponent(JSON.stringify(post))
				}
				if (url == '/pages/home/diseaseVisit/components/Referral/Referral') {
					url += '?type=JSB' + '&transferOrg=' + this.formData.transferOrg + '&transferReason=' + this.formData.transferReason + '&contractImpression=' + this.formData.contractImpression + '&contractName=' + this.formData.contractName + '&contractCure=' + this.formData.contractCure + '&contractJws=' + this.formData.contractJws  
				}
				if (url == '/pages/home/diseaseVisit/components/mqyyqk/mqyyqk' && type == 'yyzd') {
					post = {
						type: 'JSBYYZD'
					}
					url += '?post=' + encodeURIComponent(JSON.stringify(post))
				}
				uni.navigateTo({
					url: url
				})
			},
			// 签名
			goQm() {
				console.log('去签名')
				uni.navigateTo({
					url: '/pages/my/handWriter/index' + '?model=jsbsf'
				})
			},
			// 药物不良反应
			ywblfyHandle(val) {
				if (this.update) {
					this.formData.adverceReactionCode = val
				} else {
					this.$showToast('不可修改药物不良反应')
				}
			}
		}
	}
</script>

<style lang="scss">
	$fff:#fff;

	@mixin center ($value) {
		text-align: center;
		line-height: $value;
	}

	@mixin boxCenter ($value) {
		position: absolute;
		top: 50%;
		left: 50%;
		margin-left: -#{$value*0.5}rpx;
		margin-top: -#{$value*0.5}rpx;
	}

	@mixin borderBox {
		box-sizing: border-box;

		&:after {
			content: "";
			margin-top: 20rpx;
		}
	}

	@mixin border {
		border-radius: 8rpx;
		padding: 10rpx 8rpx;
		border: 2px solid rgb(53, 168, 255);
	}

	@mixin input {
		font-size: 32rpx;
		line-height: 42rpx;
		color: rgba(162, 164, 185, 1);
		margin-bottom: 6rpx;
	}

	@mixin flexCss($direction) {
		@if $direction==row {
			display: flex;
			justify-content: space-between;
		}

		@else if $direction==column {
			display: flex;
			flex-direction: column;
		}
	}

	page {
		.self-index {
			.finsh {
				width: 100rpx;
				height: 60rpx;
				background: rgba(255, 255, 255, 1);
				border-radius: 10rpx;
				font-size: 30rpx;
				color: rgba(53, 168, 255, 1);
				@include center(60rpx);
			}

			.content {
				padding: 30rpx 32rpx;

				.redDot {
					color: red;
				}

				.title {
					font-size: 28rpx;
					font-weight: 600;
					color: #313131;
					margin: 10rpx 0 10rpx 0;
				}

				.icon-to {
					color: #666666 !important;
				}

				// 随访信息
				.jbxxBox {
					@include borderBox() position: relative;

					.rytype {
						position: absolute;
						top: -20rpx;
						left: -30rpx;
						width: calc(100% + 60rpx);
						background: rgba(255, 230, 0, 0.2);
						height: 68rpx;
						font-size: 24rpx;
						text-indent: 30rpx;
						line-height: 68rpx;
						color: rgba(5, 7, 70, 1);
					}

					.sfxx {
						@include flexCss(row) .sfrq {
							margin-top: 60rpx;
							width: 240rpx;

							.sffsChoose {
								@include flexCss(row);
								align-items: center;
								margin-top: 10rpx;
								height: 46rpx;
								padding: 10rpx;
								border-radius: 8rpx;
								border: 2px solid #35a8ff;
								background-color: #deeefb;
								justify-content: space-between;

								.pickCss {
									flex: 1;
								}

								.time {
									font-size: 30rpx;
									background-color: #deeefb;
									color: rgba(0, 2, 52, 1);
									margin-bottom: 10rpx;
								}
							}
						}
					}

					.sfImg {
						margin-top: 20rpx;

						.imgBox {
							margin-top: 10rpx;
							display: flex;

							.img {
								border-radius: 10rpx;
								margin-bottom: 10rpx;
								height: 240rpx;
								background: rgba(255, 255, 255, 1);
								border: 2rpx dotted rgba(162, 164, 185, 1);
								position: relative;
								overflow: hidden;
								flex: 1;

								img {
									width: 100%;
								}

								.icon-paizhaozhaopian {
									color: #666666;
									@include boxCenter(44);
									font-size: 44rpx;
								}
							}
						}

						.imgReason {
							.cardVal {
								@include border;
								background-color: #deeefb;

								.inp {
									@include input;
								}
							}

						}
					}
				}

				// 症状
				.zzBox {
					.other {
						.title {
							margin: 10rpx 0 10rpx 0;
						}

						.inp {
							@include border;
							@include input;
						}
					}
				}

				// 目前药情况
				.mqyyqkBox {
					.card {
						.card-item {
							@include flexCss(row) padding: 10rpx 0;
							margin-bottom: 10rpx;

							.yyTitle {
								@include border;
								font-size: 30upx;
								color: #313131;
								flex: 1;
								line-height: 1.6;
								background-color: #deeefb;
							}

							.icon-shanchu {
								margin-left: 20rpx;
								font-size: 40rpx;
								color: #d42525;
								line-height: 2;
							}
						}

						.add {
							margin-top: 30rpx;
							width: 100%;
							height: 102rpx;
							border: 1px dotted rgba(162, 164, 185, 1);

							.addIcon {
								color: #666666;
								@include center(102rpx);

								.icon-xinzeng {
									margin-right: 6rpx;
								}
							}
						}
					}
				}

				// 服药依从性
				.fyycxBox {
					.labelBox {
						display: flex;
						justify-content: space-around;

						.label {
							width: 33%;
							font-size: 30rpx;
							color: rgba(5, 7, 70, 1);
						}
					}

					.cysj {
						width: 240rpx;

						.sffsChoose {
							display: flex;
							align-items: center;

							.pickCss {
								flex: 1;
							}
						}
					}
				}

				// 危险行为
				.wxxwBox {
					.card {
						@include flexCss(row);

						.card-item {
							.tlChoose {
								width: 240rpx;
								height: 50rpx;

								.uni-input {
									overflow: hidden;
									text-overflow: ellipsis;
									white-space: nowrap;
									width: 200rpx;
								}

								align-items: center;
								@include border;
								@include flexCss(row);
							}

							.cardVal {
								width: 240rpx;
								@include border;
								@include flexCss(row);
								background-color: #deeefb;

								.inp {
									@include input;
									color: #313131;
									flex: 1;
								}

								.dw {
									text-align: right;
									font-size: 24rpx;
									color: #999999;
									line-height: 2;
								}

								.ci {
									text-align: right;
								}

								.uni-input {
									width: 160rpx;
									font-size: 30rpx;
									color: #313131;
								}
							}
						}
					}
				}

				// 转诊
				.zhuanzhen {
					.inp {
						width: 100%;
					}

					.zZtitle {
						font-size: 30rpx;
						font-weight: bold;
						color: #000234;
					}

					.zzhenBox {
						border-radius: 10rpx;
						border: none !important;

						.addIcon {
							display: flex;

							.btn {
								color: #FFFFFF;
								background-color: #74baef;
								width: 50%;

								.iconfont {
									color: #FFFFFF;
								}
							}
						}

						.resert {
							background-color: #969696 !important;
						}
					}

					.iconfont {
						color: #666666;
					}
				}

				// 随访信息
				.sfxxBox {
					.card {
						@include flexCss(row);
						@include border;

						.sfTime {
							font-size: 30rpx;
							color: #333333;
						}

						.icon-Iconmaterial-date-range {
							font-size: 26rpx;
							color: #666666;
						}

						.qmBox {
							border: 1px dotted rgba(162, 164, 185, 1);
							margin-bottom: 10rpx;
							width: 100%;
							text-align: center;
							height: 180rpx;
							position: relative;
							overflow: hidden;

							img {
								position: absolute;
								top: 50%;
								left: 50%;
								margin-top: -120rpx;
								margin-left: -180rpx;
								transform: rotate(-90deg);
								width: 180rpx;
							}

							.icon-weiqianzi {
								font-size: 65rpx;
								@include center(136rpx);
								color: #666666;
							}
						}
					}
				}
			}
		}
	}

	// 缺项提示
	.redBorder {
		border-color: #e49595 !important;
	}

	.redColor {
		padding: 8rpx;
		border-radius: 8rpx;
		border: 2px solid #e49595 !important;
		background-color: #f9e2e2 !important;
	}

	.fontColor {
		color: #e49595 !important;
	}

	// 禁用样式
	.disabled,
	.uni-input:disabled {
		border-radius: 8rpx;
		border: 2px solid #d2cece !important;
		background-color: #F5F5F5 !important;
	}
</style>
