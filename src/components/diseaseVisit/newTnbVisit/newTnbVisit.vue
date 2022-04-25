<template>
	<view class="self-index">
		<view class="content">
			<!-- 基本信息 -->
			<self-fold-card
id="jbxx" :dot-show="jbxxIsEmpty" :show="listShow.jbxx" background-color="#fff"
				title="基本信息" @closeOther="closeOther">
				<view slot="fold">
					<view class="jbxxBox">
						<view class="rytype">
							人员类型提示：{{rqtype}}
						</view>
						<view class="sfxx">
							<view class="sfrq">
								<view class="title">随访日期</view>
								<picker
:value="formData.followUpDate" :disabled="!update" :start="limitStart"
									:end="limitDate" mode=date @change="bindPickerChange($event,'sfrq')">
									<view class="sfrqChoose" :class="{'redColor':!$v.formData.followUpDate.required}">
										<text
class="time" :style="{color:(formData.followUpDate?'':'#acacac')}"
											v-text="formData.followUpDate?formData.followUpDate:'选择时间'"></text>
										<text class="iconfont icon-Iconmaterial-date-range"></text>
									</view>
								</picker>
							</view>
							<view class="sffs">
								<view class="title">随访方式</view>
								<view
class="sffsChoose" :style="{color:(formData.followUpStyle?'':'#acacac')}"
									:class="{'redColor':!$v.formData.followUpStyle.required}">
									<picker :range="array" @change="bindPickerChange($event,'sffs')">
										<view
class="uni-input"
											v-text="formData.followUpStyle?array[formData.followUpStyle-1]:'选择方式'">
										</view>
									</picker>
									<text class="iconfont icon-to"></text>
								</view>
							</view>
						</view>
						<view class="sfImg">
							<view class="title">随访照片</view>
							<view class="imgBox">
								<!-- :class="{'redBorder':!$v.formData.folUrl1.required}" -->
								<view class="img" style="margin-right: 5px;" @tap="takePho(1)" @longpress="watchImg(1)">
									<img :src="folUrl1" alt="">
									<text class="iconfont icon-paizhaozhaopian"></text>
								</view>
								<view class="img" style="margin-left: 5px;" @tap="takePho(2)" @longpress="watchImg(2)">
									<img :src="folUrl2" alt="">
									<text class="iconfont icon-paizhaozhaopian"></text>
								</view>
							</view>
							<view class="imgReason">
								<view class="title">未拍照原因</view>
								<view class="cardVal">
									<input v-model="formData.wpzyy" type="text" class="inp" value="" />
								</view>
							</view>
						</view>
					</view>
				</view>
			</self-fold-card>
			<!-- 症状 -->
			<self-fold-card
id="zz" :dot-show="zzIsEmpty" :show="listShow.zz" background-color="#fff"
				title="症状" @closeOther="closeOther">
				<view slot="fold">
					<view class="zzBox">
						<view class="other">
							<self-checkbox v-model="formData.symptom" :huchi="true" :list="zzList" :item-css="itemCss">
							</self-checkbox>
							<view class="title" :class="{'fontColor':!$v.formData.symptom_other.required}">其他</view>
							<input
v-model="formData.symptomOther" type="text"
								:class="{'redColor':!$v.formData.symptom_other.required}" :disabled="!formData.symptom.includes('10')" class="inp"
								value="" />
						</view>
					</view>
				</view>
			</self-fold-card>
			<!-- 体征 -->
			<self-fold-card
id="tz" :dot-show="tzIsEmpty" :show="listShow.tz" background-color="#fff"
				title="体征" @closeOther="closeOther">
				<view slot="fold">
					<view class="ttBox">
						<pressure
v-if="showBLEDevice" :disabled="isDeviceWorking"
							@setPressure="setPressure" @deviceWorking="setDeviceWorking"></pressure>
						<view class="card">
							<view class="card-item">
								<view class="title">收缩压</view>
								<view
class="cardVal"
									:class="{'redColor':!$v.formData.highPressure.required, 'disabled': !update}">
									<input
v-model="formData.highPressure" type="number" :disabled="!update"
										placeholder="请填写" class="inp" />
									<view class="dw">mmHg</view>
								</view>
							</view>
							<view class="card-item">
								<view class="title">舒张压</view>
								<view
class="cardVal"
									:class="{'redColor':!$v.formData.lowPressure.required, 'disabled': !update}">
									<input
v-model="formData.lowPressure" :disabled="!update" type="number"
										placeholder="请填写" class="inp" />
									<view class="dw">mmHg</view>
									<view v-show="bigHigh" class="notice">舒张压大于收缩压！</view>
								</view>
							</view>
						</view>
						<view class="card">
							<view class="card-item">
								<view class="title">身高</view>
								<view
class="cardVal"
									:class="{'redColor':!$v.formData.height.between || !$v.formData.height.required}">
									<input
v-model="formData.height" type="digit" placeholder="请填写" class="inp"
										value="" />
									<view class="dw">cm</view>
								</view>
							</view>
						</view>
						<view class="card">
							<view class="card-item">
								<view class="title">足背部动脉搏动</view>
								<picker
mode=selector range-key="text" :range="zbdmbdList"
									@change="bindPickerZbdm($event)">
									<view class="cardVal zb" :class="{'redColor':!$v.formData.footPulstates.required}">
										<view class="uni-input">
											<text
style="color:#A2A4B9;font-size:28rpx;"
												v-text="!formData.footPulstates&&!formData.footPilstatesWhere?'请先选择':''"></text>
											<text
style="color:#050746;font-size:28rpx;"
												v-text="formData.footPulstates?zbdmbdList[formData.footPulstates-1].text:''"></text>
										</view>
										<text class="iconfont icon-to"></text>
									</view>
								</picker>
							</view>
							<view class="card-item">
								<view class="title">位置</view>
								<picker range-key="text" :range="zbdm_mo" @change="bindPickerZbdmNo($event)">
									<view
class="cardVal sy"
										:class="{'redColor':!$v.formData.footPilstatesWhere.required}">
										<view class="uni-input">
											<text
style="color:#050746;font-size:28rpx;"
												v-text="zbdm_mo[formData.footPilstatesWhere-1] ? zbdm_mo[formData.footPilstatesWhere-1].text: ''"></text>
										</view>
										<text class="iconfont icon-to"></text>
									</view>
								</picker>
							</view>
						</view>
						<Scale
v-if="showBLEDevice" :disabled="isDeviceWorking" @setWeight="setWeight"
							@deviceWorking="setDeviceWorking"></Scale>
						<view class="card">
							<view class="card-item">
								<view class="title">体重</view>
								<view
class="cardVal"
									:class="{'redColor':!$v.formData.weight.between || !$v.formData.weight.required}">
									<input
v-model="formData.weight" type="digit" placeholder="请填写" class="inp"
										value="" />
									<view class="dw">kg</view>
								</view>
								<view v-show="lastWeight" class="lastSf">上次随访{{lastWeight}}kg</view>
							</view>
							<view class="card-item">
								<view class="title">体重调整目标</view>
								<view
class="cardVal"
									:class="{'redColor':!$v.formData.weightExp.between || !$v.formData.weightExp.required}">
									<input
v-model="formData.weightExp" type="digit" placeholder="请填写" class="inp"
										value="" />
									<view class="dw">kg</view>
								</view>
							</view>
						</view>
						<view class="card">
							<view class="card-item">
								<view class="title">BMI</view>
								<view class="cardVal disabled">
									<input
v-model="bmi_computed" type="digit" placeholder="请填写" disabled="true"
										class="inp" value="" />
									<view class="dw min">kg/m²</view>
								</view>
							</view>
							<view class="card-item">
								<view class="title">BMI调整目标</view>
								<view class="cardVal disabled">
									<input
v-model="bmiExp_computed" type="digit" placeholder="请填写" disabled="true"
										class="inp" value="" />
									<view class="dw">kg/m²</view>
								</view>
							</view>
						</view>
						<view class="other">
							<view class="title">其他</view>
							<view class="cardVal">
								<input
v-model="formData.signOther" type="text" placeholder="请填写其他体征" class="inp"
									value="" />
							</view>
						</view>
					</view>
				</view>
			</self-fold-card>
			<!-- 生活指导 -->
			<self-fold-card
id="shzd" :dot-show="shzdIsEmpty" :show="listShow.shzd" background-color="#fff"
				title="生活指导" @closeOther="closeOther">
				<view slot="fold">
					<view class="shzdBox">
						<view class="card">
							<view class="card-item">
								<view class="title">日吸烟量</view>
								<view class="cardVal" :class="{'redColor':!$v.formData.countCigarette.required}">
									<input
v-model="formData.countCigarette" type="digit" placeholder="请填写" class="inp"
										value="" @input="sfjjCompited" />
									<view class="dw min">支</view>
								</view>
							</view>
							<view class="card-item">
								<view class="title">日吸烟量调整目标</view>
								<view class="cardVal" :class="{'redColor':!$v.formData.countCigaretteExp.required}">
									<input
v-model="formData.countCigaretteExp" type="digit" placeholder="请填写"
										class="inp" value="" />
									<view class="dw">支</view>
								</view>
							</view>
						</view>
						<view class="card">
							<view class="card-item">
								<view class="title">日饮酒量</view>
								<view class="cardVal" :class="{'redColor':!$v.formData.countWine.required}">
									<input
v-model="formData.countWine" type="digit" placeholder="请填写" class="inp"
										value="" @input="sfjjCompited" />
									<view class="dw min">两</view>
								</view>
							</view>
							<view class="card-item">
								<view class="title">日饮酒量调整目标</view>
								<view class="cardVal" :class="{'redColor':!$v.formData.countWineExp.required}">
									<input
v-model="formData.countWineExp" type="digit" placeholder="请填写" class="inp"
										value="" />
									<view class="dw">两</view>
								</view>
							</view>
						</view>
						<view class="card">
							<view class="card-item">
								<view class="title">运动次数</view>
								<view class="cardVal" :class="{'redColor':$v.formData.frequency.$error}">
									<input
v-model="formData.frequency" type="text" placeholder="请填写" class="inp"
										value="" @input="sfjjCompited" />
									<view class="dw min">次/周</view>
								</view>
							</view>
							<view class="card-item">
								<view class="title">运动次数调整目标</view>
								<view class="cardVal" :class="{'redColor':$v.formData.frequencyExp.$error}">
									<input
v-model="formData.frequencyExp" type="text" placeholder="请填写" class="inp"
										value="" />
									<view class="dw ci">次/周</view>
								</view>
							</view>
						</view>
						<view class="card">
							<view class="card-item">
								<view class="title">运动时长</view>
								<view class="cardVal" :class="{'redColor':$v.formData.exercise.$error}">
									<input
v-model="formData.exercise" type="text" placeholder="请填写" class="inp"
										value="" />
									<view class="dw min">分钟/次</view>
								</view>
							</view>
							<view class="card-item">
								<view class="title">运动时长调整目标</view>
								<view class="cardVal" :class="{'redColor':$v.formData.exerciseExp.$error}">
									<input
v-model="formData.exerciseExp" type="text" placeholder="请填写" class="inp"
										value="" />
									<view class="dw ci">分钟/次</view>
								</view>
							</view>
						</view>
						<view class="card">
							<view class="card-item">
								<view class="title">主食</view>
								<view class="cardVal" :class="{'redColor':!$v.formData.stapleFood.required}">
									<input
v-model="formData.stapleFood" type="digit" placeholder="请填写" class="inp"
										value="" />
									<view class="dw ci">克/天</view>
								</view>
							</view>
							<view class="card-item">
								<view class="title">主食调整目标</view>
								<view class="cardVal" :class="{'redColor':!$v.formData.stableFoodExp.required}">
									<input
v-model="formData.stableFoodExp" type="digit" placeholder="请填写" class="inp"
										value="" />
									<view class="dw ci">克/天</view>
								</view>
							</view>
						</view>
						<!--  -->
						<view class="card">
							<view class="card-item">
								<view class="title">心理调整</view>
								<view class="cardVal zb" :class="{'redColor':!$v.formData.psyRecovery.required}">
									<picker :range="xlArray" @change="bindPickerChange($event,'xltz')">
										<view
class="uni-input"
											v-text="formData.psyRecovery?xlArray[formData.psyRecovery-1]:'请选择'"></view>
									</picker>
									<text class="iconfont icon-to"></text>
								</view>
							</view>
							<view class="card-item">
								<view class="title">遵医行为</view>
								<view
class="cardVal zb"
									:class="{'redColor':!$v.formData.treatmentCompliance.required}">
									<picker :range="xlArray" @change="bindPickerChange($event,'zyxw')">
										<view
class="uni-input"
											v-text="formData.treatmentCompliance?xlArray[formData.treatmentCompliance-1]:'请选择'">
										</view>
									</picker>
									<text class="iconfont icon-to"></text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</self-fold-card>
			<!-- 辅助检查 -->
			<self-fold-card
id="fzjc" :dot-show="fzjcIsEmpty" background-color="#fff" :show="listShow.fzjc"
				title="血糖检查" @closeOther="closeOther">
				<view slot="fold">
					<view class="fzjcBox">
						<view v-if="showBLEDevice">
							<Glucose
:disabled="isDeviceWorking" @setGlucose="setGlucose"
								@deviceWorking="setDeviceWorking"></Glucose>
							<radio-group class="card radio-card" @change="glucoseInputRadioChange">
								<label>
									<radio value="kongfu" checked="" />空腹血糖
								</label>
								<label>
									<radio value="suiji" />随机血糖
								</label>
							</radio-group>
						</view>
						<view class="card">
							<view class="card-item">
								<view class="title">空腹血糖值</view>
								<view
class="cardVal"
									:class="{'redColor':!$v.formData.glu.required, 'disabled':!update}">
									<input
v-model="formData.glu" :disabled="!update" type='digit'
										placeholder="请填写" class="inp" @blur="tnbGetManageInfo(1)" />
									<view class="dw ci">mmol/L</view>
								</view>
							</view>
							<view class="card-item">
								<view class="title">随机血糖值</view>
								<view class="cardVal" :class="{'disabled': !update}">
									<input
v-model="formData.sjXt" type="digit" :disabled="!update"
										placeholder="请填写" class="inp" @blur="tnbGetManageInfo(1)" />
									<view class="dw ci">mmol/L</view>
								</view>
							</view>
						</view>
						<view class="card">
							<view class="card-item">
								<view class="title">餐后血糖值</view>
								<view class="cardVal">
									<input v-model="formData.chXt" type="digit" placeholder="请填写" class="inp" />
									<view class="dw ci">mmol/L</view>
								</view>
							</view>
							<view class="card-item">
								<view class="title">糖化血糖蛋白</view>
								<view class="cardVal">
									<input v-model="formData.ghb" type="digit" placeholder="请填写" class="inp" />
									<view class="dw ci">mmol/L</view>
								</view>
							</view>

						</view>
						<view class="card">
							<view class="card-item">
								<view class="title">糖化血糖蛋白检查时间</view>
								<picker mode=date @change="bindPickerChange($event,'thxtdbjcrq')">
									<view class="cardVal">
										<text
class="time" :style="{color:(formData.ghbDate?'':'#acacac')}"
											v-text="formData.ghbDate?formData.ghbDate:'请选择'"></text>
									</view>
								</picker>
							</view>
						</view>
						<view class="other">
							<view class="title">糖化血红蛋白备注</view>
							<input
v-model="formData.ghbOther" type="text" placeholder="请填写糖化血红蛋白备注" class="inp"
								value="" />
						</view>
						<view class="other">
							<view class="title">其他检查</view>
							<input
v-model="formData.otherCheck" type="text" placeholder="请填写其他检查" class="inp"
								value="" />
						</view>
					</view>
				</view>
			</self-fold-card>
			<!-- 服药依从性 -->
			<self-fold-card
id="fyycx" background-color="#fff" :show="listShow.fyycx" title="服药依从性"
				@closeOther="closeOther">
				<view slot="fold">
					<view class="fyycxBox">
						<self-radio
v-model="formData.medicationCompliance" :list="fyycxList" :inline="true"
							:item-css="radioCss"></self-radio>
					</view>
				</view>
			</self-fold-card>
			<!-- 药物不良反应 -->
			<self-fold-card
id="ywblfy" :dot-show="ywblfyIsEmpty" :show="listShow.ywblfy" background-color="#fff"
				title="药物不良反应" @closeOther="closeOther">
				<view slot="fold">
					<view class="ywblfyBox">
						<view class="ywblfyChoose">
							<view
class="c-item" :class="formData.adverceReactionCode=='1'?'active':''"
								@click="ywblfyHandle('1')">无</view>
							<view
class="c-item" :class="formData.adverceReactionCode=='2'?'active':''"
								@click="ywblfyHandle('2')">有</view>
						</view>
						<view class="other">
							<view class="title" :class="{'fontColor':!$v.formData.adverceReactionDetail.required}">
								请填写药物不良反应</view>
							<input
v-model="formData.adverceReactionDetail" :disabled="!update" :class="update?'':'disabled'" type="text"
								placeholder="请输入" class="inp" value="" />
						</view>
					</view>
				</view>
			</self-fold-card>
			<!-- 目前用药情况 -->
			<self-fold-card
id="mqyyqk" :dot-show="yyIsEmpty" background-color="#fff" :show="listShow.mqyyqk"
				title="目前用药情况" @closeOther="closeOther">
				<view slot="fold">
					<view class="mqyyqkBox">
						<view class="card">
							<view
v-for="(item,index) in formData.medication" v-show="item.medicineName"
								:key="index" class="card-item">
								<view class="yyTitle" @tap="modifyMedic(index,item, 'mqyy')">
									{{item.yybz}}
									{{item.medicineName}}
									{{item.timeUnit === "日" ? "每日": item.timeUnit}}{{item.eatCount}}次
									每次{{item.medicineCount}}
									{{item.medicineUnit}}
								</view>
								<text class="iconfont icon-shanchu" @tap="delmedic(index, 'mqyy')"></text>
							</view>
							<view class="add">
								<view class="addIcon" @tap="linkTo('../components/mqyyqk/mqyyqk', 'mqyy')">
									<text class="iconfont icon-xinzeng"></text><text>新增一条</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</self-fold-card>
			<!-- 用药调整意见 -->
			<self-fold-card
v-if="tzyyShow" :dot-show="yytzIsEmpty" background-color="#fff"
				:show="listShow.mqyyqk" title="用药调整意见" @closeOther="closeOther">
				<view slot="fold">
					<view class="mqyyqkBox">
						<view class="card">
							<view
v-for="(item,index) in formData.medicationExp" v-show="item.medicineName"
								:key="index" class="card-item">
								<view class="yyTitle" @tap="modifyMedic(index,item, 'yytz')">
									{{item.yybz}}
									{{item.medicineName}}
									{{item.timeUnit === "日" ? "每日": item.timeUnit}}{{item.eatCount}}次
									每次{{item.medicineCount}}{{item.medicineUnit}}
								</view>
								<text class="iconfont icon-shanchu" @tap="delmedic(index, 'yytz')"></text>
							</view>
							<view class="add">
								<view class="addIcon" @tap="linkTo('../components/mqyyqk/mqyyqk', 'yytz')">
									<text class="iconfont icon-xinzeng"></text><text>新增一条</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</self-fold-card>
			<!-- 胰岛素使用情况 -->
			<self-fold-card
:dot-show="ydsIsEmpty" :show="listShow.ydssyqk" background-color="#fff"
				title="胰岛素使用情况" @closeOther="closeOther">
				<view slot="fold">
					<view class="mqyyqkBox">
						<view class="card">
							<view
v-for="(item,index) in formData.insulinVariety" v-show="item.name" :key="index"
								class="card-item">
								<view class="yyTitle" @tap="ydsXGg(index,item,'new')">
									{{item.name}}
									每{{item.timeUnit}}{{item.time}}次
									每次{{item.amount}}{{item.amountUnit}}
									{{item.yybz}}
								</view>
								<text class="iconfont icon-shanchu" @tap="delYDS(index, 'new')"></text>
							</view>
							<view class="add">
								<view class="addIcon" @tap="ydsXz('new')">
									<text class="iconfont icon-xinzeng"></text><text>新增一条</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</self-fold-card>
			<!-- 胰岛素使用调整意见 -->
			<self-fold-card
:dot-show="ydstzIsEmpty" :show="listShow.ydssyqk" background-color="#fff"
				title="胰岛素使用调整意见" @closeOther="closeOther">
				<view slot="fold">
					<view class="mqyyqkBox">
						<view class="card">
							<view
v-for="(item,index) in formData.insulinAdjustmmentVariety" v-show="item.name"
								:key="index" class="card-item">
								<view class="yyTitle" @tap="ydsXGg(index,item, 'change')">
									{{item.name}}
									每{{item.timeUnit}}{{item.time}}次
									每次{{item.amount}}{{item.amountUnit}}
									{{item.yybz}}
								</view>
								<text class="iconfont icon-shanchu" @tap="delYDS(index, 'change')"></text>
							</view>
							<view class="add">
								<view class="addIcon" @tap="ydsXz('change')">
									<text class="iconfont icon-xinzeng"></text><text>新增一条</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</self-fold-card>
			<!-- 低血糖反应 -->
			<self-fold-card
id="dxtfay" :show="listShow.dxtfay" background-color="#fff" title="低血糖反应"
				@closeOther="closeOther">
				<view slot="fold">
					<view class="ywblfyBox">
						<view class="ywblfyChoose">
							<view
class="c-item" :class="formData.hypoglycemiaReaction=='1'?'active':''"
								@click="formData.hypoglycemiaReaction='1'">无</view>
							<view
class="c-item" :class="formData.hypoglycemiaReaction=='2'?'active':''"
								@click="formData.hypoglycemiaReaction='2'">偶尔</view>
							<view
class="c-item" :class="formData.hypoglycemiaReaction=='3'?'active':''"
								@click="formData.hypoglycemiaReaction='3'">频繁</view>
						</view>
					</view>
				</view>
			</self-fold-card>
			<!-- 此次随访分类 -->
			<self-fold-card
id="ccsffl" :dot-show="$v.formData.classifyFollowUp.$error" :show="listShow.ccsffl"
				background-color="#fff" title="此次随访分类" @closeOther="closeOther">
				<view slot="fold">
					<view class="ccsfflBox">
						<view class="sfjlBox">
							<view class="sfjlChoose">
								<view
class="c-item" :class="formData.classifyFollowUp=='1'?'active':''"
									@click="checkManageNext('1')">控制满意</view>
								<view
class="c-item" :class="formData.classifyFollowUp=='2'?'active':''"
									@click="checkManageNext('2')">控制不满意</view>
								<view
class="c-item" :class="formData.classifyFollowUp=='3'?'active':''"
									@click="checkManageNext('3')">不良反应</view>
								<view
class="c-item" :class="formData.classifyFollowUp=='4'?'active':''"
									@click="checkManageNext('4')">并发症</view>
							</view>
						</view>
					</view>
				</view>
			</self-fold-card>
			<!-- 患者接受管理度 -->
			<self-fold-card
v-if="mydShow" id="xybglcs" :show="listShow.hzjsgld" :dot-show="$v.formData.degreeOfAcceptance
			.$error" background-color="#fff"
				title="患者接受管理度" @closeOther="closeOther">
				<view slot="fold">
					<self-radio v-model="formData.degreeOfAcceptance" :list="hzjsgldList"></self-radio>
				</view>
			</self-fold-card>
			<!-- 下一步管理措施 -->
			<self-fold-card
id="xybglcs" :show="listShow.xybglcs" background-color="#fff" title="下一步管理措施"
				@closeOther="closeOther">
				<view slot="fold">
					<self-radio v-model="formData.managementNextStep" :list="xybsfcsList"></self-radio>
				</view>
			</self-fold-card>
			<!-- 转诊 -->
			<self-fold-card
id="zhuanzhen" :dot-show="zzJudge" :show="listShow.zhuanzhen" background-color="#fff"
				title="转诊" @closeOther="closeOther">
				<view slot="fold">
					<view class="mqyyqkBox zhuanzhen">
						<view class="card">
							<view class="title">转诊原因</view>
							<view class="card-item disabled" :class="{'redColor':!$v.formData.transferReason.required}">
								<input
v-model="formData.transferReason" disabled="true" type="text" placeholder="请输入"
									class="inp" value="" />
							</view>
							<view class="title">机构及科室</view>
							<view class="card-item disabled" :class="{'redColor':!$v.formData.transferOrg.required}">
								<input
v-model="formData.transferOrg" disabled="true" type="text" placeholder="请输入"
									class="inp" value="" />
							</view>
							<view class="add zzhenBox">
								<view class="addIcon">
									<view class="btn resert" @tap="clearZzhen()">
										</text><text>清空转诊单</text>
									</view>
									<view class="btn" @tap="linkTo('../components/Referral/Referral')">
										<text class="iconfont icon-xinzeng"></text><text>填写转诊单</text>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</self-fold-card>
			<!-- 随访信息 -->
			<self-fold-card
id="sfxx" :show="listShow.sfxx" background-color="#fff"
				:dot-show="$v.formData.nextDate.$error" title="随访信息" @closeOther="closeOther">
				<view slot="fold">
					<view class="sfxxBox">
						<view class="title">下次随访日期</view>
						<picker
:disabled="!update" :value="formData.nextDate" :class="update?'':'disabled'"
							mode=date @change="bindPickerChange($event,'xcsf')">
							<view class="card">
								<view class="sfTime" v-text="formData.nextDate?formData.nextDate:'请选择'"></view>
								<text class="iconfont icon-Iconmaterial-date-range"></text>
							</view>
						</picker>
						<view class="title">随访医生签名</view>
						<view class="card">
							<my-picker
:search="true" :picker-list="doctorList"
								:picker-key="{value: 'value', label: 'name', }" :range="doctorList"
								@confirm="doctorChange($event)">
								<input v-model="formData.doctorName" type="text" value="" placeholder="请填写" />
							</my-picker>
						</view>
						<view class="title">居民签名</view>
						<view class="card">
							<input
v-model="formData.juminName" type="text" disabled="true" value=""
								placeholder="请填写" />
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
							<textarea id="editor" v-model="formData.remarks" placeholder="请输入" @ready="onEditorReady">
							</textarea>
						</view>
					</view>
				</view>
			</self-fold-card>
			<!-- 健康指导意见 -->
			<self-fold-card
id="jkzdyj" :show="listShow.jkzdyj" background-color="#fff" title="健康指导意见"
				@closeOther="closeOther">
				<view slot="fold">
					<view class="jkzdyjBox">
						<view class="card">
							<textarea id="editor" v-model="formData.jkzd" placeholder="请输入" @ready="onEditorReady">
							</textarea>
						</view>
					</view>
				</view>
			</self-fold-card>
		</view>
	</view>
</template>

<script>
	import {
		GetNowTime
	} from '@/common/tool.js'
	import ImageTool from '@/h5PlusApi/imgUpload.js'
	import config from '../config/config-tnb.js'
	import formData from '../config/formDataTnb.js'
	import {
		required,
		minLength,
		between
	} from 'vuelidate/lib/validators'
	import mixin from '../config/mixins-tnb.js'
	import selfFoldCard from '@/components/self-fold-card/self-fold-card.vue'
	import selfCheckbox from '@/components/self-checkbox/self-checkbox.vue'
	import selfRadio from '@/components/self-radio/self-radio.vue'
	import {
		getSaveTnbSfInfo,
		tnbAddOrUpdateFollowUp,
		tnbGetManageInfo,
		getDocUserList,
		getNextSf,
		addSfService
	} from '@/request/jmsf.js'
	import {
		sendBugReport
	} from "@/request/log.js"
	import myPicker from '@/components/my-picker/Picker.vue'
	import Glucose from '../bluetooth/glucose.vue'
	import Pressure from '../bluetooth/pressure.vue'
	import Scale from '../bluetooth/scale.vue'
	import {
		getFollowUpSurveyConclusion
	} from '../utils.js'

	export default {
		components: {
			selfFoldCard,
			selfCheckbox,
			selfRadio,
			myPicker,
			Pressure,
			Glucose,
			Scale
		},
		mixins: [mixin],
		data() {
			return {
				...config,
				...formData,
				tzyyShow:true,
				mydShow: false,
				limitStart: '',
				limitDate: '',
				// 人员类型提示
				rqtype: '',
				isAdd: true,
				lastWeight: '',
				// 该字段判定可不可更新
				update: true,
				//转诊是否必填项
				zzIsNeed: false,
				signImg: '',
				existSfphoto: '',
				//随访照片
				folUrl1: '',
				folUrl2: '',
				// 签名照片
				qmUrl: '',
				doctorList: [],
				itemCss: {
					width: '24%'
				},
				zhzCss: {
					display: 'flex',
					flexWrap: 'wrap',
				},
				saveDisable: false,
				// 血糖必填动态判断 gluRequired true 空腹血糖必填
				gluRequired: false,
				existSfjj: "",
				id: "",
				managementNextStep: "",
				glucoseInput: "kongfu",
				// 输入的血糖类型：空腹/随机
				isDeviceWorking: false,
				// 是否有设备（血压计、血糖仪在工作）,
				existBluetooth: false
			}
		},
		computed: {
			showBLEDevice() {
				return this.existBluetooth && this.isAdd
			}
		},
		onNavigationBarButtonTap(e) {
			this.finsh()
		},
		onShow() {
			const that = this
			uni.$off('tnbhandleFinsh')
			uni.$once("tnbhandleFinsh", res => {
				//console.log('签名完成得到base' ,res.data);
				if (res.data) {
					this.qmUrl = res.data
					this.formData.juminNameUrl2Base64 = res.data.split(',')[1]
				}
			})
			// 监听用药情况输入
			uni.$off('TNBYPMC')
			uni.$once("TNBYPMC", res => {
				//console.log('用药新增得到' ,res);
				if (res.data) {
					const from = res.from
					let keyword = ""
					if (from === "mqyy") {
						keyword = "medication"
					} else if (from === "yytz") {
						keyword = "medicationExp"
					}
					if (this.formData[keyword].length == 1 && !this.formData[keyword][0].medicineName) {
						this.$set(this.formData[keyword][0], 'medicineName', res.data.medicineName)
						this.$set(this.formData[keyword][0], 'timeUnit', res.data.timeUnit)
						this.$set(this.formData[keyword][0], 'eatCount', res.data.eatCount)
						this.$set(this.formData[keyword][0], 'medicineCount', res.data.medicineCount)
						this.$set(this.formData[keyword][0], 'medicineUnit', res.data.medicineUnit)
						this.$set(this.formData[keyword][0], 'yybz', res.data.yybz)
					} else {
						this.formData[keyword].push(res.data)
					}
				}
			})
			// 监听药品修改
			uni.$off('TNBYWXG')
			uni.$once("TNBYWXG", res => {
				console.log('监听药物修改', res)
				const index = res.index
				if (res.data) {
					const from = res.from
					let keyword = ""
					if (from === "mqyy") {
						keyword = "medication"
					} else if (from === "yytz") {
						keyword = "medicationExp"
					}
					this.$set(this.formData[keyword][index], 'medicineName', res.data.medicineName)
					this.$set(this.formData[keyword][index], 'timeUnit', res.data.timeUnit)
					this.$set(this.formData[keyword][index], 'eatCount', res.data.eatCount)
					this.$set(this.formData[keyword][index], 'medicineCount', res.data.medicineCount)
					this.$set(this.formData[keyword][index], 'medicineUnit', res.data.medicineUnit)
					this.$set(this.formData[keyword][index], 'yybz', res.data.yybz)
				}
			})
			// 监听胰岛素UDS
			uni.$off('UDS')
			uni.$once("UDS", res => {
				console.log('胰岛素新增得到', res)
				if (res.data) {
					const from = res.from
					let keyword = ""
					if (from === "new") {
						keyword = "insulinVariety"
					} else if (from === "change") {
						keyword = "insulinAdjustmmentVariety"
					}
					if (this.formData[keyword].length == 1 && !this.formData[keyword][0].name) {
						this.$set(this.formData[keyword][0], 'name', res.data.name)
						this.$set(this.formData[keyword][0], 'timeUnit', res.data.timeUnit)
						this.$set(this.formData[keyword][0], 'time', res.data.time)
						this.$set(this.formData[keyword][0], 'amount', res.data.amount)
						this.$set(this.formData[keyword][0], 'amountUnit', res.data.amountUnit)
						this.$set(this.formData[keyword][0], 'yybz', res.data.yybz)
					} else {
						this.formData[keyword].push(res.data)
					}
				}
			})
			// 监听胰岛素修改
			uni.$off('YDSXG')
			uni.$once("YDSXG", res => {
				console.log('监听胰岛素修改', res)
				console.log(res)
				const index = res.index
				if (res.data) {
					const from = res.from
					let keyword = ""
					if (from === "new") {
						keyword = "insulinVariety"
					} else if (from === "change") {
						keyword = "insulinAdjustmmentVariety"
					}
					this.$set(this.formData[keyword][index], 'name', res.data.name)
					this.$set(this.formData[keyword][index], 'timeUnit', res.data.timeUnit)
					this.$set(this.formData[keyword][index], 'time', res.data.time)
					this.$set(this.formData[keyword][index], 'amount', res.data.amount)
					this.$set(this.formData[keyword][index], 'amountUnit', res.data.amountUnit)
					this.$set(this.formData[keyword][index], 'yybz', res.data.yybz)
				}
			})
			// 监听转诊
			uni.$off('TNBZZ')
			uni.$once("TNBZZ", res => {
				console.log('转诊得到', res)
				if (res.data) {
					this.formData.transferOrg = res.data.transferOrg
					this.formData.contractName = res.data.contractName
					this.formData.transferReason = res.data.transferReason
					this.formData.transferResult = res.data.transferResult
					this.formData.contractTel = res.data.contractTel
				}
			})
		},
		onLoad: function(option) {
			var config = uni.getStorageSync('config')
			config = JSON.parse(config)
			if(config.existTzyy == "否") {
				this.tzyyShow = false
			} else {
				this.tzyyShow = true
			}
			if (config.existHzmyd == '是') {
				this.mydShow = true
			} else {
				this.mydShow = false
			}
			for (const key in this.listShow) {
				this.$set(this.listShow, key, true)
			}
			this.name = option.name

			console.log('随访记录传参至糖尿病', JSON.parse(decodeURIComponent(option.data)))
			option = JSON.parse(decodeURIComponent(option.data))
			uni.setNavigationBarTitle({
				title: option.name + '的糖尿病随访记录'
			})
			this.id = option.id
			if (option.id) {
				this.isAdd = false
			}
			this.$showLoading('加载中')
			getSaveTnbSfInfo({
				idCard: option.idCard,
				id: option.id
			}).then(res => {
				console.log('糖尿病随访新增回显', res)
				uni.hideLoading()
				const that = this
				if (res.ret && res.data.data) {
					// 第一条不走后端赋值update
					if (option.index != '0') {

						this.update = res.data.update
						console.log("其他" + this.update)
					} else if (res.data.updateOne) {
							this.update = true
						} else {
							this.update = false
						}
					//根据update来判断是否可以保存
					// this.update = res.data.update
					const passValue = res.data.data

					if (this.isAdd) {
						passValue.managementNextStep = 0
						delete passValue.adverceReactionDetail
						delete passValue.adverceReactionCode
						passValue.adverceReactionDetail = ""
						passValue.adverceReactionCode = 1
					}

					this.formData = passValue
					this.gender = res.data.sex === "女" ? "F" : "M"
					this.formData.symptom = JSON.parse(this.formData.symptom)
					// console.log(this.formData)
					// 处理用药
					if (this.formData.medication && this.formData.medication.length > 10) {
						//console.log('用药初始化')
						this.formData.medication = JSON.parse(this.formData.medication)
						const medicationNew = this.formData.medication.map(item => {
							item.medicineCount = this.dislodgeLetter(item.medicineCount)
							return {
								yybz: item.yybz,
								eatCount: item.eatCount,
								timeUnit: item.timeUnit,
								medicineName: item.medicineName,
								medicineUnit: item.medicineUnit,
								medicineCount: item.medicineCount
							}
						})
						this.formData.medication = medicationNew
						console.log('目前用药列表',medicationNew)
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

					if (this.formData.medicationExp && this.formData.medicationExp.length > 10) {
						//console.log('用药初始化')
						this.formData.medicationExp = JSON.parse(this.formData.medicationExp)
						const medicationExpNew = this.formData.medicationExp.map(item => {
							item.medicineCount = this.dislodgeLetter(item.medicineCount)
							return {
								eatCount: item.eatCount,
								timeUnit: item.timeUnit,
								medicineName: item.medicineName,
								medicineUnit: item.medicineUnit,
								medicineCount: item.medicineCount
							}
						})
						this.formData.medicationExp = medicationExpNew
						console.log('用药调整列表',this.formData.medicationExp)
						if (this.formData.medicationExp.length === 0) {
							this.formData.medicationExp = [{
								medicineUnit: "片",
								medicineCount: "",
								eatCount: "",
								medicineName: "",
								timeUnit: "日",
							}]
						}
					} else {
						this.formData.medicationExp = [{
							medicineUnit: "片",
							medicineCount: "",
							eatCount: "",
							medicineName: "",
							timeUnit: "日",
						}]
					}
					// 处理胰岛素
					if (this.formData.insulinVariety && this.formData.insulinVariety.length > 10) {
						this.formData.insulinVariety = JSON.parse(this.formData.insulinVariety)
						const insulinVarietyNew = this.formData.insulinVariety.map(item => {
							item.amount = this.dislodgeLetter(item.amount)
							return {
								amountUnit: item.amountUnit,
								amount: item.amount,
								time: item.time,
								name: item.name,
								timeUnit: item.timeUnit
							}
						})
						this.formData.insulinVariety = insulinVarietyNew
						console.log('胰岛素列表',this.formData.insulinVariety)
					} else {
						this.formData.insulinVariety = [{
							amountUnit: "",
							amount: "",
							time: "",
							name: "",
							timeUnit: "日",
						}]
					}

					if (this.formData.insulinAdjustmmentVariety && this.formData.insulinAdjustmmentVariety
						.length > 10) {
						this.formData.insulinAdjustmmentVariety = JSON.parse(this.formData.insulinAdjustmmentVariety)
						const insulinAdjustmmentVarietyNew = this.formData.insulinAdjustmmentVariety.map(item => {
							item.amount = this.dislodgeLetter(item.amount)
							return {
								amountUnit: item.amountUnit,
								amount: item.amount,
								time: item.time,
								name: item.name,
								timeUnit: item.timeUnit
							}
						})
						this.formData.insulinAdjustmmentVariety = insulinAdjustmmentVarietyNew
						console.log('胰岛素调整列表',this.formData.insulinAdjustmmentVariety)
					} else {
						this.formData.insulinAdjustmmentVariety = [{
							amountUnit: "",
							amount: "",
							time: "",
							name: "",
							timeUnit: "日",
						}]
					}
					// 页面传参赋值

					this.formData.cardId = option.diabetesId
					this.formData.name = option.name
					this.formData.orgId = option.orgId
					this.formData.orgName = option.orgName
					this.formData.ehrId = option.ehrId ? option.ehrId : passValue.ehrId
					this.formData.idCard = option.idCard

					// 人员提示类型
					this.rqtype = res.data.rqtype
					console.log(this.rqtype)
					// 照片处理
					this.folUrl1 = this.formData.folUrl1 ? this.$IMGURL + this.formData.folUrl1 : ''
					this.folUrl2 = this.formData.folUrl2 ? this.$IMGURL + this.formData.folUrl2 : ''
					this.qmUrl = this.formData.juminNameUrl ? this.$IMGURL + this.formData.juminNameUrl : ''

					// 根据update参数判断走不走接口console.log(this.update)
					if (this.update && !option.id) {
						this.tnbGetManageInfo()
					}
					this.lastWeight = this.formData.weight
					//处理定位
					plus.geolocation.getCurrentPosition(function(p) {
						// console.log(JSON.stringify(p))
						that.formData.location = p.addresses
						that.formData.latitude = p.coords.latitude
						that.formData.longitude = p.coords.longitude
					}, function(e) {
						alert('定位服务未开启，请在设置中打开GPS定位服务,并重新进入本页面。')
					})
				} else if (res.mes) {
						this.$showToast(res.mes)
					} else {
						this.$showToast('程序出了点小问题,请联系管理员')
					}
			}, err => {
				uni.hideLoading()
			})
			var config = uni.getStorageSync('config')
			console.log("config:" + config)
			config = JSON.parse(config)
			const now = GetNowTime('-')
			let year = now.substring(0, 4)
			year = Number(year) + 2
			const lastYear = Number(year) - 4
			const nextYear = year + '-01-01'
			//limitStart
			if (config.existSfrq == '限') {
				this.limitStart = now
			} else {
				this.limitStart = lastYear + '-01-01'
				config.existSfrq == '否' ? this.limitDate = nextYear : this.limitDate = now
			}
			if (config.existBluetooth == "是") {
				this.existBluetooth = true
			} else {
				this.existBluetooth = false
			}
			// 控制拍照必填不必填
			this.existSfphoto = config.existSfphoto
			//个性需求，判断随访结局是否自动生成
			this.existSfjj = config.existSfjj
			config.existGlu == '否' ? this.gluRequired = true : this.gluRequired = false
			console.log('输出glu', this.gluRequired)
		},
		watch: {
			bmi_computed: {
				handler(val, oldVal) {
					this.sfjjCompited()
				}
			},
			'formData.symptom': {
				handler(val, oldVal) {
					if (val[0] == "1") {
						this.formData.symptomOther = ""
					}
				}
			},
			'formData.classifyFollowUp': {
				handler(val, oldVal) {
					this.sfjjCompited()
				}
			},
			'formData.countCigarette': {
				handler(val, oldVal) {
					this.treatmentComplianceComputed()
				}
			},
			'formData.countWine': {
				handler(val, oldVal) {
					this.treatmentComplianceComputed()
				}
			},
			'formData.exercise': {
				handler(val, oldVal) {
					this.treatmentComplianceComputed()
				}
			},
			'formData.frequency': {
				handler(val, oldVal) {
					this.treatmentComplianceComputed()
				}
			},
			'formData.stapleFood': {
				handler(val, oldVal) {
					this.treatmentComplianceComputed()
				}
			}
		},
		mounted() {
			this.$v.$touch()
			getDocUserList().then(res => {
				console.log('获取的医生列表', res)
				if (res.ret) {
					this.doctorList = res.data
					this.treatmentComplianceComputed()
				}
			}, err => {})
			this.sfjjCompited()
		},
		methods: {
			setDeviceWorking(res) {
				this.isDeviceWorking = res
			},
			//血糖仪输入的radio按钮
			glucoseInputRadioChange(res) {
				this.glucoseInput = res.target.value
			},
			setWeight(res) {
				this.formData.weight = res.weight
			},
			//从蓝牙设备设置血压结果
			setPressure(res) {
				this.formData.highPressure = res.SYS
				this.formData.lowPressure = res.DIA
				this.formData.heartRate = res.PUL
			},
			//从蓝牙设备设置血糖结果
			setGlucose(res) {
				if (this.glucoseInput === "kongfu") {
					this.formData.glu = res.glucose
				} else if (this.glucoseInput === "suiji") {
					this.formData.sjXt = res.glucose
				}
				this.tnbGetManageInfo(1)
			},
			//改变下一步管理措施
			checkManageNext(index) {
				this.formData.classifyFollowUp = index
				if (index == 2) {
					this.formData.managementNextStep = this.formData.managementNextStep
				} else if (index == 1) {
					this.formData.managementNextStep = index
				} else if (index == 3) {
					this.formData.adverceReactionCode = 2
					this.tnbGetManageInfo(1)
				}
			},
			//判断随访结局
			sfjjCompited() {
				if (this.existSfjj == "是" && this.id == null) {
					const formData = Object.assign({}, this.formData, {
						bmi: this.bmi_computed
					})
					const zzjudge = this.zzJudge
					this.formData.remarks = getFollowUpSurveyConclusion(formData, "tnb", this.gender, zzjudge)
				}
			},
			//计算遵医行为
			treatmentComplianceComputed() {
				return
				let bad = false
				if (this.formData.countCigarette && parseInt(this.formData.countCigarette) > 0) {
					bad = true
				} else if (this.formData.countWine && parseInt(this.formData.countWine) > 0) {
					bad = true
				} else if ((this.formData.frequency && parseInt(this.formData.frequency) == 0) || (this.formData
						.exercise &&
						parseInt(this.formData.exercise) == 0)) {
					bad = true
				} else if (this.formData.stapleFood && parseInt(this.formData.stapleFood) > 250) {
					bad = true
				}
				if (bad) {
					this.formData.treatmentCompliance = 3
				}
			},
			watchImg(num) {
				const arr = []
				num == 1 ? arr.push(this.folUrl1) : arr.push(this.folUrl2)
				arr[0] = arr[0].replace("\\", "\/")
				if (arr[0]) {
					uni.previewImage({
						urls: arr,
						current: 0,
					})
				}
			},
			clearZzhen() {
				this.formData.transferOrg = ''
				this.formData.contractName = ''
				this.formData.contractImpression = ''
				this.formData.transferReason = ''
				this.formData.contractJws = ''
				this.formData.contractCure = ''
				this.tnbGetManageInfo()
			},
			onEditorReady() {
				uni.createSelectorQuery().select('#editor').context((res) => {
					this.editorCtx = res.context
				})
.exec()
			},
			doctorChange(e) {
				this.formData.doctorName = e.label
				this.formData.doctorId = e.value
			},
			dislodgeLetter(str) {
				let result
				const reg = /[a-zA-Z]+/ //[a-zA-Z]表示匹配字母，g表示全局匹配
				const reg1 = /[\u4e00-\u9fa5]/
				while (result = str.match(reg)) { //判断str.match(reg)是否没有字母了
					str = str.replace(result[0], '') //替换掉字母  result[0] 是 str.match(reg)匹配到的字母
				}
				while (result = str.match(reg1)) { //判断str.match(reg1)是否没有汉字了
					str = str.replace(result[0], '') //替换掉汉字  result[0] 是 str.match(reg1)匹配到的汉字
				}
				console.log(str)
				return str
			},
			// 完成
			finsh(event) {
				let config = uni.getStorageSync('config')
				config = JSON.parse(config)
				if (this.rqtype.indexOf('糖尿病') == -1) {
					this.$showToast('此居民人员类型不是糖尿病')
					return
				}
				this.$v.formData.$touch()
				if (this.$v.formData.followUpDate.$error) {
					this.$showToast('随访日期必填')
				} else if (this.$v.formData.followUpStyle.$error) {
					this.$showToast('随访方式必填')
				} else if (this.existSfphoto == '是' && this.formData.followUpStyle != 3 && !this.formData.folUrl1Base64 &&
					!this.formData.folUrl1) {
					this.$showToast('随访照片必拍')
				} else if (this.$v.formData.symptom_other.$error) {
					this.$showToast('症状其他需要填写')
				} else if (this.$v.formData.highPressure.$error) {
					this.$showToast('收缩压必填或填写错误')
				} else if (this.$v.formData.lowPressure.$error) {
					this.$showToast('舒张压必填或填写错误')
				} else if (this.$v.formData.height.$error) {
					this.$showToast('身高必填或填写错误')
				} else if (this.$v.formData.weight.$error) {
					this.$showToast('体重必填或填写错误')
				} else if (this.$v.formData.weightExp.$error) {
					this.$showToast('体重调整目标必填或填写错误')
				} else if (this.$v.formData.countCigarette.$error) {
					this.$showToast('日吸烟量必填')
				} else if (this.$v.formData.countCigaretteExp.$error) {
					this.$showToast('日吸烟量调整目标必填')
				} else if (this.$v.formData.countWine.$error) {
					this.$showToast('日饮酒量次数')
				} else if (this.$v.formData.countWineExp.$error) {
					this.$showToast('日饮酒量调整次数')
				} else if (this.$v.formData.exercise.$error) {
					this.$showToast('运动时长必填或填写错误')
				} else if (this.$v.formData.exerciseExp.$error) {
					this.$showToast('运动时长调整必填或填写错误')
				} else if (this.$v.formData.frequency.$error) {
					this.$showToast('运动次数必填或填写错误')
				} else if (this.$v.formData.frequencyExp.$error) {
					this.$showToast('运动次数调整必填或填写错误')
				} else if (this.$v.formData.footPulstates.$error) {
					this.$showToast('足背动脉搏动必填')
				} else if (this.$v.formData.footPilstatesWhere.$error) {
					this.$showToast('足背动脉搏动位置必填')
				} else if (this.$v.formData.psyRecovery.$error) {
					this.$showToast('心理调整必填')
				} else if (this.$v.formData.treatmentCompliance.$error) {
					this.$showToast('遵医行为必填')
				} else if (this.$v.formData.stapleFood.$error) {
					this.$showToast('主食必填')
				} else if (this.$v.formData.stableFoodExp.$error) {
					this.$showToast('主食调整目标必填')
				} else if (this.yyIsEmpty) {
					this.$showToast('用药未填写')
				} else if (this.yytzIsEmpty) {
					this.$showToast('用药调整未填写' && config.existTzyy == "是")
				} else if (this.$v.formData.adverceReactionDetail.$error) {
					this.$showToast('药物不良反应需要填')
				} else if (this.$v.formData.classifyFollowUp.$error) {
					this.$showToast('此次随访分类必填')
				} else if (this.$v.formData.degreeOfAcceptance.$error && this.mydShow) {
					this.$showToast('患者接受管理度必填')
				} else if (this.zzJudge) {
					this.$showToast('转诊必填')
				} else if (this.bigHigh) {
					this.$showToast('舒张压大于收缩压')
				} else if (!this.$v.formData.nextDate.required) {
					this.$showToast('下次随访时间必填')
				} else if (this.gluRequired && !this.formData.glu) {
					this.$showToast('空腹血糖必填')
				} else if (!this.formData.glu && !this.formData.sjXt && !this.formData.chXt) {
					this.$showToast('血糖必须填一个')
				} else if (parseInt(this.formData.glu) > 40 || parseInt(this.formData.sjXt) > 40 || parseInt(this.formData.chXt) > 40) {
					this.$showToast('血糖最高值为40')
				} else {
					//只允许点一次
					if (this.saveDisable) {
						return
					}
					this.saveDisable = true
					// 验证通过
					const req = Object.assign({}, this.formData)
					req.symptom = JSON.stringify(req.symptom)
					req.medication = JSON.stringify(req.medication)
					req.medicationExp = JSON.stringify(req.medicationExp)
					req.insulinVariety = JSON.stringify(req.insulinVariety)
					req.insulinAdjustmmentVariety = JSON.stringify(req.insulinAdjustmmentVariety)
					// console.log('糖尿病保存传参', req)
					this.$showLoading('加载中')
					tnbAddOrUpdateFollowUp(req).then(res => {
						uni.hideLoading()
						if (res.ret) {
							this.$showToast('保存成功')
							if (!req.id) {
								const post = {}
								post.idCard = req.idCard
								post.type = 'TNB'
								getNextSf(post).then(sfRes => {
									if (sfRes.ret && sfRes.data) {
										// 触发提示
										uni.$emit("SFTS", {
											type: 'GXY',
											name: this.name
										})
									}
								})
							}
							// 判断签约提示
							if (res.data.isSign == 'y' && this.isAdd && res.data.sfId) {
								// 调用生成履约记录signId sfId type 
								addSfService({
									signId: res.data.signId,
									sfId: res.data.sfId,
									type: 'TNB'
								}).then(re => {
									console.log('生成下次随访记录', re)
								})
							} else if (res.data.isSign == 'n' && this.isAdd && res.data.sfId) {
								uni.$emit("SHOWSIGN", {
									sfId: res.data.sfId,
									type: 'TNB'
								})
							}
							setTimeout(function() {
								uni.navigateBack({
									delta: 1
								})
							}, 1000)
						} else {
							uni.hideLoading()
							this.$showToast(res.mes)
							this.$showToast('保存失败')
							const log = {
								URL: "/fds/follow/tnb/addOrUpdateFollowUp",
								PARAMS: req,
								CONFIG: this.config,
								VUE_DATA: this.$data,
								TOKEN: uni.getStorageSync('token'),
								ERR: res
							}
							sendBugReport({
								content: JSON.stringify(log)
							}).then(res => {
								console.log("bug is sent")
							})
						}
					}, err => {
						uni.hideLoading()
						this.$showToast('服务器错误' + err)
						const log = {
							URL: "/fds/follow/tnb/addOrUpdateFollowUp",
							PARAMS: req,
							CONFIG: this.config,
							VUE_DATA: this.$data,
							TOKEN: uni.getStorageSync('token'),
							ERR: err
						}
						console.log(log)
						sendBugReport({
							content: JSON.stringify(log)
						}).then(res => {
							console.log("bug is sent")
						})
					})
				}
				//console.log(this.$v.formData.height.between)
			},
			// 删除用药
			delmedic(index, from) {
				if (from === "mqyy") {
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
					console.log('删除目前用药', this.formData.medication)
				} else if (from === "yytz") {
					if (this.formData.medicationExp.length > 1) {
						this.formData.medicationExp.splice(index, 1)
					} else {
						this.$set(this.formData.medicationExp[0], 'medicineUnit', '')
						this.$set(this.formData.medicationExp[0], 'medicineCount', '')
						this.$set(this.formData.medicationExp[0], 'eatCount', '')
						this.$set(this.formData.medicationExp[0], 'medicineName', '')
						this.$set(this.formData.medicationExp[0], 'timeUnit', '')
					}
					console.log('删除用药调整', this.formData.medicationExp)
				}
			},
			// 删除胰岛素
			delYDS(index, from) {
				let keyword = ""
				if (from === "new") {
					keyword = "insulinVariety"
				} else if (from === "change") {
					keyword = "insulinAdjustmmentVariety"
				}
				if (this.formData[keyword].length > 1) {
					this.formData[keyword].splice(index, 1)
				} else {
					this.$set(this.formData[keyword][0], 'amountUnit', '')
					this.$set(this.formData[keyword][0], 'amount', '')
					this.$set(this.formData[keyword][0], 'time', '')
					this.$set(this.formData[keyword][0], 'name', '')
					this.$set(this.formData[keyword][0], 'timeUnit', '')
					this.$set(this.formData[keyword][0], 'yybz', '')
				}
			},
			// 拍照
			takePho(num) {
				const that = this
				if (this.update) {
					const imgTool_upload = new ImageTool({
						ZoomQuality: 30, //压缩图片的质量
						autoUpload: false,
						success: function(url, base64) {
							//console.log('拍照的结果',url,base64);
							if (num == 1) {
								that.folUrl1 = base64
								that.formData.folUrl1Base64 = base64.split(',')[1]
							} else {
								that.folUrl2 = base64
								that.formData.folUrl2Base64 = base64.split(',')[1]
							}
						},
						error: function(err) {
							console.log(err)
						}
					})
					let config = uni.getStorageSync('config')
					config = JSON.parse(config)
					let buttonss = []
					if (config.existKcphoto == '是') {
						buttonss = [{
							title: "打开摄像头拍照"
						}, {
							title: "查看当前照片"
						}, {
							title: "删除当前照片"
						}]
					} else {
						buttonss = [{
							title: "打开摄像头拍照"
						}, {
							title: "选取现有照片"
						}, {
							title: "查看当前照片"
						}, {
							title: "删除当前照片"
						}]
					}
					plus.nativeUI.actionSheet({
						title: "选择照片",
						cancel: "取消",
						buttons: buttonss
					}, (e) => {
						if (config.existKcphoto == '是') {
							if (e.index == 1) {
								//拍照
								imgTool_upload.camera()
							} else if (e.index == 2) {
								this.watchImg(num)
							} else if (e.index == 3) {
								if (num == 1) {
									that.folUrl1 = 1
									that.formData.folUrl1 = ''
									that.formData.folUrl1Base64 = ''
								} else {
									that.folUrl2 = 1
									that.formData.folUrl2 = ''
									that.formData.folUrl2Base64 = ''
								}
							} else {
								
							}
						} else if (e.index == 1) {
								//拍照
								imgTool_upload.camera()
							} else if (e.index == 2) {
								// 选取照片
								imgTool_upload.galleryImgs()
							} else if (e.index == 3) {
								this.watchImg(num)
							} else if (e.index == 4) {
								if (num == 1) {
									that.folUrl1 = 1
									that.formData.folUrl1 = ''
									that.formData.folUrl1Base64 = ''
								} else {
									that.folUrl2 = 1
									that.formData.folUrl2 = ''
									that.formData.folUrl2Base64 = ''
								}
							} else {
								
							}
					})
				} else {
					const arr = []
					num == 1 ? arr.push(that.folUrl1) : arr.push(that.folUrl2)
					arr[0] = arr[0].replace("\\", "\/")
					uni.previewImage({
						urls: arr,
						current: 0,
					})
				}
			},
			// 弹窗picker数据处理
			bindPickerChange(event, type) {
				const {
					value
				} = event.detail
				if (type == 'sffs') {
					this.formData.followUpStyle = value + 1
				} else if (type == 'sfrq') {
					this.formData.followUpDate = value
					this.tnbGetManageInfo(1)
				} else if (type == 'zbdm') {
					this.formData.footPulstates = this.zbdmbdList[0][value[0]]
					this.formData.footPilstatesWhere = this.zbdmbdList[1][value[1]]
				} else if (type == 'xltz') {
					this.formData.psyRecovery = value + 1
					this.sfjjCompited()
				} else if (type == 'zyxw') {
					this.formData.treatmentCompliance = value + 1
					this.sfjjCompited()
				} else if (type == 'jcrq') {
					this.formData.GHbDate = value
				} else if (type == 'xcsf') {
					this.formData.nextDate = value
				} else if (type == 'thxtdbjcrq') {
					this.formData.ghbDate = value
				}
			},
			// 足背动脉
			bindPickerZbdm(event) {
				const {
					value
				} = event.detail
				if (value == 0) {
					this.formData.footPulstates = '1'
					this.formData.footPilstatesWhere = ''
				} else {
					this.formData.footPulstates = value + 1
				}
				console.log(this.formData.footPulstates)
			},
			// 足背动脉位置
			bindPickerZbdmNo(event) {
				console.log(event.detail.value)
				this.formData.footPilstatesWhere = event.detail.value + 1
				//console.log(this.zbdm_mo[this.formData.footPilstatesWhere].text)
			},
			// 关闭非当前的card
			closeOther(id) {
				for (const key in this.listShow) {
					this.$set(this.listShow, key, false)
				}
				this.$set(this.listShow, id, true)
			},
			// 修改当前用药
			modifyMedic(index, item, from) {
				const post = {
					type: 'TNB',
					index: index,
					item: item,
					from
				}
				const url = '../components/mqyyqk/mqyyqk?post= ' + encodeURIComponent(JSON.stringify(post))
				uni.navigateTo({
					url: url
				})
			},
			// 目前用药情况等连接
			linkTo(url, from) {
				const post = {
					type: 'TNB',
					from: from
				}
				if (url == '../components/mqyyqk/mqyyqk') {
					url += '?post=' + encodeURIComponent(JSON.stringify(post))
				}
				if (url == '../components/Referral/Referral') {
					url += '?type=TNB' + '&transferOrg=' + this.formData.transferOrg + '&transferReason=' + this.formData
						.transferReason +
						'&contractTel=' + this.formData.contractTel + '&contractName=' + this.formData
						.contractName +
						'&transferResult=' + this.formData.transferResult +
						'&highPressure=' +
						this.formData.highPressure + '&lowPressure=' + this.formData.lowPressure
				}
				uni.navigateTo({
					url: url
				})
			},
			//胰岛素新增
			ydsXz(from) {
				const post = {
					from
				}
				const url = '../components/ydssyqk/ydssyqk?post= ' + encodeURIComponent(JSON.stringify(post))
				uni.navigateTo({
					url: url
				})
			},
			// 胰岛素修改
			ydsXGg(index, item, from) {
				const post = {
					index: index,
					item: item,
					from: from
				}
				const url = '../components/ydssyqk/ydssyqk?post= ' + encodeURIComponent(JSON.stringify(post))
				uni.navigateTo({
					url: url
				})
			},
			ywblfyHandle(val) {
				if (this.update) {
					this.formData.adverceReactionCode = val
					this.tnbGetManageInfo(1)
				} else {
					this.$showToast('不可修改药物不良反应')
				}
			},
			// 签名
			goQm() {
				console.log('去签名')
				uni.navigateTo({
					url: '/pages/my/handWriter/index' + '?model=tnbsf'
				})
			},
			tnbGetManageInfo(type) {
				console.log('准备执行逻辑判断', this.formData.glu, this.formData.sjXt)
				if (this.formData.glu || this.formData.sjXt) {
					const req = {
						sfId: this.formData.id,
						cardId: this.formData.cardId,
						glu: this.formData.glu,
						sjXt: this.formData.sjXt,
						blfy: this.formData.adverceReactionCode == "2" || false,
						followUpDate: this.formData.followUpDate
					}
					if (type) {
						req.type = 1
					}
					tnbGetManageInfo(req).then(res => {
						console.log('随访逻辑', res)
						if (res.ret) {
							this.formData.classifyFollowUp = parseInt(res.data.classifyFollowUp)
							this.formData.managementNextStep = parseInt(res.data.managementNextStep)
							this.managementNextStep = parseInt(res.data.managementNextStep)
							this.formData.nextDate = res.data.nextDate
							this.formData.accurate = res.data.accurate
						}
					}, err => {})
				}
			},
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
				height: 40rpx;
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
					color: #313131;
					margin: 16rpx 0 10rpx 0;
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
							margin-top: 40rpx;
							width: 240rpx;

							.sfrqChoose {
								@include flexCss(row);
								margin-top: 10rpx;
								height: 46rpx;
								padding: 10rpx;
								border-radius: 8rpx;
								border: 2px solid #35a8ff;
								background-color: #deeefb;

								.time {
									font-size: 30rpx;
									color: rgba(0, 2, 52, 1);
									margin-bottom: 10rpx;
								}
							}
						}

						.sffs {
							margin-top: 40rpx;
							width: 240rpx;

							.sffsChoose {
								@include flexCss(row);
								border-radius: 8rpx;
								padding: 10rpx;
								border: 2px solid #35a8ff;
								font-size: 30rpx;
								margin-top: 10rpx;
								height: 46rpx;
								background-color: #deeefb;

								.uni-input {
									width: 180rpx;
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
							.title {
								margin-top: 10rpx;
							}

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
							margin: 10rpx 0;
						}

						.inp {
							@include border;
							@include input;
						}
					}
				}

				// 体征
				.ttBox {
					.card {
						@include flexCss(row);

						.card-item {
							position: relative;

							.lastSf {
								color: green;
								font-size: 26rpx;
								position: absolute;
								top: 10px;
								left: 60rpx;
							}

							.notice {
								font-size: 24rpx;
								color: red;
								position: absolute;
								bottom: -30rpx;
							}

							.cardVal {
								width: 240rpx;
								@include border;
								@include flexCss(row);
								background-color: #deeefb;

								.inp {
									@include input;
									color: #000234;
									flex: 1;
								}

								.dw {
									text-align: right;
									font-size: 24rpx;
									color: #999999;
									line-height: 2;
								}

								.icon-to {
									line-height: 1.65;
								}
							}
						}

						.all {
							width: 100%;
							@include border;

							.cardVal {
								@include flexCss(row);
								background-color: #deeefb;

								.uni-input {
									font-size: 30rpx;
									color: #313131;
								}
							}
						}
					}

					.other {
						.cardVal {
							width: 96%;
							@include border;
							@include flexCss(row);
							background-color: #deeefb;

							.title {
								margin: 40rpx 0 10rpx 0;
							}

							.inp {
								@include input;
								background-color: #deeefb;
							}
						}
					}
				}

				// 生活指导
				.shzdBox {
					.card {
						@include flexCss(row);

						.card-item {
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

							.zb {
								padding: 14rpx 8rpx !important;
							}

						}

						.all {
							width: 100%;

							.cardVal {
								@include border;
								@include flexCss(row);
								background-color: #deeefb;

								.uni-input {
									width: 500rpx;
									font-size: 30rpx;
									color: #313131;
								}
							}

							.zb {
								padding: 14rpx 8rpx !important;
							}
						}
					}
				}

				// 辅助检查
				.fzjcBox {
					.card {
						@include flexCss(row);

						.card-item {
							.cardVal {
								@include border;
								width: 240rpx;
								@include flexCss(row);
								background-color: #deeefb;

								.inp {
									@include input;
									color: #000234;
								}

								.dw {
									text-align: right;
									font-size: 20rpx;
									font-weight: 400;
									color: #999999;
								}

								.ci {
									width: 146rpx;
									text-align: right;
									line-height: 2;
								}

								.uni-input {
									font-size: 30rpx;
									color: #313131;
								}
							}
						}

						.sfrq {
							margin-top: 12rpx;
							width: 240rpx;

							.sfrqChoose {
								@include flexCss(row);
								margin-top: 10rpx;
								height: 46rpx;
								color: #666666;
								border-bottom: 1px solid rgba(242, 242, 250, 1);
								background-color: #deeefb;

								.time {
									font-size: 30rpx;
									color: rgba(0, 2, 52, 1);
									margin-bottom: 10rpx;
								}
							}
						}
					}

					.other {
						.title {
							margin: 40rpx 0 10rpx 0;
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

				}

				// 用药调整意见
				.yytzyjBox {
					.card {
						@include border;
					}
				}

				// 药物不良反应
				.ywblfyBox {
					.ywblfyChoose {
						display: flex;

						.c-item {
							width: 160rpx;
							height: 60rpx;
							background: rgba(245, 249, 255, 1);
							border-radius: 4rpx;
							margin-right: 72rpx;
							text-align: center;
							line-height: 60rpx;
							color: #707084;
							font-size: 30rpx;
						}

						.active {
							background-color: #35A8FF;
							color: #fff;
						}
					}

					.other {
						.title {
							margin: 40rpx 0 10rpx 0;
						}

						.inp {
							@include border;
							@include input;
						}

					}
				}

				// 此次随访分类
				.ccsfflBox {
					.sfjlChoose {
						display: flex;

						.c-item {
							width: 180rpx;
							height: 60rpx;
							background: rgba(245, 249, 255, 1);
							border-radius: 4rpx;
							margin-right: 32rpx;
							text-align: center;
							line-height: 60rpx;
							color: #707084;
							font-size: 24rpx;
						}

						.active {
							background-color: #35A8FF;
							color: #fff;
						}
					}
				}

				// 下一步管理措施

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

				// 健康指导意见
				.jkzdyjBox {
					.card {
						@include border;

						#editor {
							height: 30vh;
							width: 100%;
							overflow-y: hidden;
						}
					}
				}
			}
		}

		.fixed-bottom {
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
		}

		.bottom-button {
			height: 60rpx;
			background-color: rgb(53, 168, 255);
			font-size: 24rpx;
			text-align: center;
			line-height: 60rpx;
			color: white;
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

	.radio {
		font-size: 28rpx;
	}

	.radio-card {
		margin: 4rpx auto;
		width: 400rpx;
		font-size: 28rpx;
	}
</style>
