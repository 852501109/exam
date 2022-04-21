<template>
	<view class="new_build">
		<uni-nav-bar fixed="true" :title="navTitle" :isBack="true" height="40rpx" background-color="#35A8FF" color="#FFFFFF">
			
		</uni-nav-bar>
		<view class="content">
			<view class="list_box">
				<view class="card_title">建册信息</view><span class="warn">(请先输入孕妇身份证！)</span>
				<view class="list_item">
					<view class="list_left">
						<text>建册医生:</text>					
					</view>
					<view class="list_right">
						<my-picker
						:picker-list="doctorList"
						:picker-key="{value: 'value', label: 'name', }"
						@confirm="doctorChange($event)" :range="doctorList">
							<input type="text"
							class="name_input"
							v-model="personInfor.doctorName"
							value="" placeholder="请选择" />
						</my-picker>
					</view>
				</view>
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
						<text>建册时间:</text>					
					</view>
					<view class="list_right">
						<picker
						@change="bindPickerChange($event,'jcsj')" mode = date>
							<view class="timeChoose" >
								<text class="time" v-text="personInfor.recDate"></text>
								<text class="iconfont icon-Iconmaterial-date-range"></text>
							</view>
						</picker>
					</view>
				</view>
				<view class="list_item">
					<view class="list_left">
						<text>建册孕周:</text>					
					</view>
					<view class="list_right">
						<input class="id_input" type="text" placeholder="请输入" v-model="personInfor.createWeek" value="" />
					</view>
				</view>
			</view>
			<view class="list_box">
				<view class="card_title">孕产妇基本信息</view>
				<view class="list_item">
					<view class="list_left">
						<text class="dot">*</text><text>孕产妇姓名:</text>					
					</view>
					<view class="list_right">
						<input type="text" class="name_input" placeholder="请输入用户名" v-model="personInfor.name" value="" />
					</view>
				</view>
				<view class="list_item">
					<view class="list_left">
						<text class="dot">*</text><text>身份证号:</text>					
					</view>
					<view class="list_right">
						<input class="id_input" @blur="onBlurIdcard()" type="text" placeholder="请输入身份证号码" v-model="personInfor.idCard" value="" />
					</view>
				</view>
				<view class="list_item">
					<view class="list_left">
						<text>年龄:</text>					
					</view>
					<view class="list_right">
						<input class="id_input" type="text" placeholder="请输入" v-model="personInfor.age" value="" />
					</view>
				</view>	
				<view class="list_item">
					<view class="list_left">
						<text>出生日期:</text>					
					</view>
					<view class="list_right">
						<picker
						@change="bindPickerChange($event,'csrq')" mode = date>
							<view class="timeChoose" >
								<text class="time" v-text="personInfor.birthdayDate"></text>
								<text class="iconfont icon-Iconmaterial-date-range"></text>
							</view>
						</picker>
					</view>
				</view>
				<picker mode="selector" :range="nationList" @change="bindPickerChange($event,'mz')" :value="nationIndex" class="pickCss">
					<view class="list_item">				
						<view class="list_left">
							<text>民族:</text>					
						</view>
						<view class="list_right">
							<view class="nationText" v-text="personInfor.nation?nationList[personInfor.nation.toString(2).length-1]:''">{{personInfor.nation}}</view>
							<i class="iconfont icon-to"></i>
						</view>
					</view>
				</picker>
				<view class="list_item">
					<view class="list_left">
						<text>家庭住址:</text>					
					</view>
					<view class="list_right">
						<input type="text" class="id_input" placeholder="请输入家庭住址" v-model="personInfor.address" value="" />
					</view>
				</view>
				<view class="list_item">
					<view class="list_left">
						<text>户籍地址:</text>					
					</view>
					<view class="list_right">
						<input type="text" class="id_input" placeholder="请输入户籍住址" v-model="personInfor.domicilePlace" value="" />
					</view>
				</view>
				<view class="list_item">
					<view class="list_left">
						<text>联系电话:</text>					
					</view>
					<view class="list_right">
						<input class="id_input" type="number" placeholder="请输入用户手机号" v-model="personInfor.phone" value="" />
					</view>
				</view>
				<view class="list_item">
					<view class="list_left">
						<text>邮编:</text>					
					</view>
					<view class="list_right">
						<input class="id_input" type="number" placeholder="请输入邮编" v-model="personInfor.postcode" value="" />
					</view>
				</view>
				<picker
				range-key="text"
				:range="whcdConfig"
				@change="bindPickerChange($event,'whcd')">
					<view class="sel">
						<view class="list_item">
							<view class="list_left">
								<text>文化程度:</text>					
							</view>
							<view class="list_right">
								<view class="nationText" v-text="personInfor.education?whcdGetText(personInfor.education):''"></view>	
								<i class="iconfont icon-to"></i>
							</view>
						</view>
					</view>
				</picker>
				<picker
				:range="joblist"
				@change="bindPickerChange($event,'zy')">
					<view class="sel">
						<view class="list_item">
							<view class="list_left">
								<text>职业:</text>					
							</view>
							<view class="list_right">
								<view class="nationText" v-text="personInfor.occupation?joblist[personInfor.occupation.toString(2).length-1]:''"></view>	
								<i class="iconfont icon-to"></i>
							</view>
						</view>
					</view>
				</picker>
				<view class="list_item">
					<view class="list_left">
						<text>工作单位:</text>					
					</view>
					<view class="list_right">
						<input type="text" class="id_input" placeholder="请输入" v-model="personInfor.workUnit" value="" />
					</view>
				</view>
			</view>
			<view class="list_box">
				<view class="card_title">孕产妇家属联系人</view>
				<view class="list_item">
					<view class="list_left">
						<text>联系人姓名:</text>					
					</view>
					<view class="list_right">
						<input class="id_input" type="text" placeholder="请输入" v-model="personInfor.person.PENAME" value="" />
					</view>
				</view>
				<picker
				:range="relationList"
				@change="bindPickerChange($event,'yyfgx')">
					<view class="sel">
						<view class="list_item">
							<view class="list_left">
								<text>与孕妇关系:</text>					
							</view>
							<view class="list_right">
								<view class="nationText" v-text="personInfor.person.RELATIVE?relationList[personInfor.person.RELATIVE.toString(2).length-1]:''"></view>	
								<i class="iconfont icon-to"></i>
							</view>
						</view>
					</view>
				</picker>
				<view class="list_item">
					<view class="list_left">
						<text>身份证号:</text>					
					</view>
					<view class="list_right">
						<input class="id_input" type="text" placeholder="请输入身份证号码" v-model="personInfor.person.CARDID" value="" />
					</view>
				</view>
				<picker mode="selector" :range="nationList" @change="bindPickerChange($event,'mz2')" :value="nationIndex" class="pickCss">
					<view class="list_item">				
						<view class="list_left">
							<text>民族:</text>					
						</view>
						<view class="list_right">
							<view class="nationText" v-text="personInfor.person.NATION?nationList[personInfor.person.NATION.toString(2).length-1]:''">{{personInfor.person.NATION}}</view>
							<i class="iconfont icon-to"></i>
						</view>
					</view>
				</picker>
				<view class="list_item">
					<view class="list_left">
						<text>联系电话:</text>					
					</view>
					<view class="list_right">
						<input class="id_input" type="number" placeholder="请输入" v-model="personInfor.person.XMLTEL" value="" />
					</view>
				</view>
				<picker
				:range="whcdConfig"
				range-key="text"
				@change="bindPickerChange($event,'whcd2')">
					<view class="sel">
						<view class="list_item">
							<view class="list_left">
								<text>文化程度:</text>					
							</view>
							<view class="list_right">
								<view class="nationText" v-text="personInfor.person.CULTURE?whcdGetText(personInfor.person.CULTURE):''"></view>
									<i class="iconfont icon-to"></i>
							</view>
						</view>
					</view>
				</picker>
				<picker
				:range="joblist"
				@change="bindPickerChange($event,'zy2')">
					<view class="sel">
						<view class="list_item">
							<view class="list_left">
								<text>职业:</text>					
							</view>
							<view class="list_right">
								<view class="nationText" v-text="personInfor.person.OCCUPATION?joblist[personInfor.person.OCCUPATION.toString(2).length-1]:''"></view>
									<i class="iconfont icon-to"></i>
							</view>
						</view>
					</view>
				</picker>
				<view class="list_item">
					<view class="list_left">
						<text>工作单位:</text>					
					</view>
					<view class="list_right">
						<input type="text" class="id_input" placeholder="请输入" v-model="personInfor.person.WORKORGNAME" value="" />
					</view>
				</view>
			</view>
			<view class="list_box">
				<view class="card_title">月经史</view>
				<view class="list_item">
					<view class="list_left">
						<text>初潮年龄:</text>					
					</view>
					<view class="list_right">
						<input class="id_input" type="number" placeholder="请输入" v-model="personInfor.examMenstrual.MenarcheAge" value="" />
					</view>
				</view>
				<view class="list_item">
					<view class="list_left">
						<text>经期/周期:</text>					
					</view>
					<view class="list_right jingqi">
						<input class="jqitem" type="number" placeholder="请输入" v-model="personInfor.examMenstrual.Period" value="" />
						/<input class="jqitem" type="number" placeholder="请输入" v-model="personInfor.examMenstrual.MenstrualCycle" value="" />
					</view>
				</view>
				<view class="list_item">
					<view class="list_left">
						<text>月经量:</text>					
					</view>
					<view class="list_right">
						<view class="radioBox">
							<self-radio
							:list="levelList"
							:itemCss="radioCss"
							:inline="true"
							v-model="personInfor.examMenstrual.MenstrualQuantity"
							></self-radio>
						</view>
					</view>
				</view>
				<view class="list_item">
					<view class="list_left">
						<text>痛经:</text>					
					</view>
					<view class="list_right">
						<view class="radioBox">
							<self-radio
							:list="levelList"
							:itemCss="radioCss"
							:inline="true"
							v-model="personInfor.examMenstrual.Dysmenorrhea"
							></self-radio>
						</view>
					</view>
				</view>
			</view>
			<view class="list_box">
				<view class="card_title">孕产史</view>
				<view class="list_item">
					<view class="list_left">
						<text>孕次:</text>					
					</view>
					<view class="list_right">
						<input class="id_input" type="number" placeholder="请输入" v-model="personInfor.gravidity" value="" />
					</view>
				</view>
				<view class="list_item">
					<view class="list_left">
						<text>产次:</text>					
					</view>
					<view class="list_right">
						<input class="id_input" type="number" placeholder="请输入" v-model="personInfor.parity" value="" />
					</view>
				</view>
				<view class="list_item">
					<view class="list_left">
						<text>人工流产:</text>					
					</view>
					<view class="list_right">
						<input class="id_input" type="number" placeholder="请输入" v-model="personInfor.terminations" value="" />
					</view>
				</view>
				<view class="list_item">
					<view class="list_left">
						<text>自然流产:</text>					
					</view>
					<view class="list_right">
						<input class="id_input" type="number" placeholder="请输入" v-model="personInfor.spontaneousAbortion" value="" />
					</view>
				</view>
				<view class="list_item">
					<view class="list_left">
						<text>中期引产次数:</text>					
					</view>
					<view class="list_right">
						<input class="id_input" type="number" placeholder="请输入" v-model="personInfor.midtermGestation" value="" />
					</view>
				</view>
				<view class="list_item">
					<view class="list_left">
						<text>早产次数:</text>					
					</view>
					<view class="list_right">
						<input class="id_input" type="number" placeholder="请输入" v-model="personInfor.prematureDelivery" value="" />
					</view>
				</view>
				<view class="list_item">
					<view class="list_left">
						<text>难产次数:</text>					
					</view>
					<view class="list_right">
						<input class="id_input" type="number" placeholder="请输入" v-model="personInfor.dystocia" value="" />
					</view>
				</view>
				<view class="list_item">
					<view class="list_left">
						<text>手术产次数:</text>					
					</view>
					<view class="list_right">
						<input class="id_input" type="number" placeholder="请输入" v-model="personInfor.embryolema" value="" />
					</view>
				</view>
				<view class="list_item">
					<view class="list_left">
						<text>死胎数:</text>					
					</view>
					<view class="list_right">
						<input class="id_input" type="number" placeholder="请输入" v-model="personInfor.fetalDeath" value="" />
					</view>
				</view>
				<view class="list_item">
					<view class="list_left">
						<text>死产数:</text>					
					</view>
					<view class="list_right">
						<input class="id_input" type="number" placeholder="请输入" v-model="personInfor.stillbirthNumber" value="" />
					</view>
				</view>
				<view class="list_item">
					<view class="list_left">
						<text>出生缺陷儿数:</text>					
					</view>
					<view class="list_right">
						<input class="id_input" type="number" placeholder="请输入" v-model="personInfor.birthDefectsNumber" value="" />
					</view>
				</view>
				<picker
				@change="bindPickerChange($event,'qcrszzrq')" mode = date>
					<view class="list_item">
						<view class="list_left">
							<text>前次妊娠终止日期:</text>					
						</view>
						<view class="list_right">
								<view class="timeChoose" >
									<view class="timeChoose" >
										<text class="time" v-text="personInfor.prePregnancyTermDate"></text>
										<text class="iconfont icon-Iconmaterial-date-range"></text>
									</view>
								</view>
						</view>
					</view>
				</picker>
				<view class="list_item">
					<view class="list_left">
						<text>前次妊娠终止方式:</text>					
					</view>
					<view class="list_right">
						<input class="id_input" type="text" placeholder="请输入" v-model="personInfor.prePregnancyTermWay" value="" />
					</view>
				</view>
				<picker
				@change="bindPickerChange($event,'qcfmrq')" mode = date>
					<view class="list_item">
						<view class="list_left">
							<text>前次分娩日期:</text>					
						</view>
						<view class="list_right">
								<view class="timeChoose" >
									<text class="time" v-text="personInfor.preDeliveryTime"></text>
									<text class="iconfont icon-Iconmaterial-date-range"></text>
								</view>
						</view>
					</view>
				</picker>
				<picker
				:range="fmList"
				@change="bindPickerChange($event,'qcfmfs')">
					<view class="list_item">
						<view class="list_left">
							<text>前次分娩方式:</text>					
						</view>
						<view class="list_right">
							
								<view class="list_right">
									<view class="nationText" v-text="personInfor.preDeliveryWay?fmList[personInfor.preDeliveryWay.toString(2).length-1]:''"></view>
										<i class="iconfont icon-to"></i>
								</view>
							
						</view>
					</view>
				</picker>
				<view class="list_item">
					<view class="list_left">
						<text>其他:</text>					
					</view>
					<view class="list_right">
						<input class="id_input" type="text" placeholder="请输入" v-model="personInfor.preDeliveryWayOther" value="" />
					</view>
				</view>
				<view class="list_item">
					<view class="list_left">
						<text>妊娠合并/并发症史:</text>					
					</view>
					<view class="list_right">
						<input class="id_input" type="text" placeholder="请输入" v-model="personInfor.pregnancyComplications" value="" />
					</view>
				</view>
				<view class="list_item">
					<view class="list_left">
						<text>其他异常孕产史:</text>					
					</view>
					<view class="list_right">
						<input class="id_input" type="text" placeholder="请输入" v-model="personInfor.otherAbnormalHistory" value="" />
					</view>
				</view>
			</view>
			<view class="list_box">
				<view class="card_title">既往史</view>
				<self-checkbox
				:huchi="true"
				style="margin-top: 30rpx;"
				:list="jwsList"
				v-model="personInfor.previousHistory"
				></self-checkbox>
				<view class="list_item">
					<view class="list_left">
						<text>其他:</text>					
					</view>
					<view class="list_right">
						<input class="id_input" type="text" placeholder="请输入" v-model="personInfor.previousHistoryOther" value="" />
					</view>
				</view>
			</view>
			<view class="list_box">
				<view class="card_title">手术史</view>
				<view class="radioBox">
					<self-radio
					style="margin-top: 30rpx;"
					:list="hasList"
					:itemCss="radioCss"
					:inline="true"
					v-model="personInfor.gynecologicalSurgeryHistory"
					></self-radio>
				</view>
				<view class="allInput">
					<input class="id_input" type="text" placeholder="请输入" v-model="personInfor.gynecologicalSurgeryHistoryInfo" value="" />
				</view>
			</view>	
			<view class="list_box">
				<view class="card_title">现病史</view>
				<view class="radioBox">
					<self-radio
					style="margin-top: 30rpx;"
					:list="hasList"
					:itemCss="radioCss"
					:inline="true"
					v-model="personInfor.presentIllnessHistory"
					></self-radio>
				</view>
				<view class="allInput">
					<input class="id_input" type="text" placeholder="请输入" v-model="personInfor.presentIllnessHistoryInfo" value="" />
				</view>
			</view>
			<view class="list_box">
				<view class="card_title">药物过敏史</view>
				<self-checkbox
				:huchi="true"
				style="margin-top: 30rpx;"
				:list="gmsList"
				v-model="personInfor.drugAllergyHistory"
				></self-checkbox>
				<view class="list_item">
					<view class="list_left">
						<text>其他:</text>					
					</view>
					<view class="list_right">
						<input class="id_input" type="text" placeholder="请输入" v-model="personInfor.drugAllergyHistoryInfo" value="" />
					</view>
				</view>
			</view>
			<view class="list_box">
				<view class="card_title">与遗传有关的家族史（本人家族）</view>
				<self-checkbox
				:huchi="true"
				style="margin-top: 30rpx;"
				:list="jzsList"
				v-model="personInfor.myheredityFamily"
				></self-checkbox>
				<view class="list_item">
					<view class="list_left">
						<text>其他:</text>					
					</view>
					<view class="list_right">
						<input class="id_input" type="text" placeholder="请输入" v-model="personInfor.myheredityFamilyOther" value="" />
					</view>
				</view>
				<picker
				:range="relationList"
				@change="bindPickerChange($event,'ybrgx')">
				<view class="list_item">
					<view class="list_left">
						<text>与本人关系:</text>					
					</view>
					<view class="list_right">
						
							<view class="timeChoose" >
								<text class="time" v-text="personInfor.myheredityRelation?relationList[personInfor.myheredityRelation.toString(2).length-1]:''"></text>
								<text class="iconfont icon-to"></text>
							</view>	
					</view>
				</view>
			</picker>
			</view>
			<view class="list_box">
				<view class="card_title">与遗传有关的家族史（配偶家族）</view>
				<self-checkbox
				:huchi="true"
				style="margin-top: 30rpx;"
				:list="jzsList"
				v-model="personInfor.husbandHeredityFamily"
				></self-checkbox>
				<view class="list_item">
					<view class="list_left">
						<text>其他:</text>					
					</view>
					<view class="list_right">
						<input class="id_input" type="text" placeholder="请输入" v-model="personInfor.husbandHeredityFamilyOther" value="" />
					</view>
				</view>
				<picker
				:range="relationList"
				@change="bindPickerChange($event,'ypogx')">
					<view class="list_item">
						<view class="list_left">
							<text>与配偶关系:</text>					
						</view>
						<view class="list_right" style="width: 200rpx;">
							<view class="timeChoose" >
								<text class="time" v-text="personInfor.husbandHeredityRelation?relationList[personInfor.husbandHeredityRelation.toString(2).length-1]:''"></text>
								<text class="iconfont icon-to"></text>
							</view>
						</view>
					</view>
				</picker>
			</view>
		</view>
		<button type="default" class="saveBtn" @tap="save()">保存</button>	
		
	</view>
</template>

<script>
	import selfRadio from '@/components/self-radio/self-radio.vue'
	import selfCheckbox from '@/components/self-checkbox/self-checkbox.vue'
	import { voiceInput } from '@/h5PlusApi/plus.js'
	import idText from '@/common/idText.js'
	import { idToInfor,GetNowTime}  from '@/common/tool.js'
	import myPicker from '@/components/my-picker/Picker.vue'
	import { addOrUpdateYcf,getPregnancyInfo} from '@/request/ycfSf.js'
	import { getDocUserList} from '@/request/jmsf.js'
	import { getOrgList,haveEhr } from '@/request/user.js'
	let that;
	export default {
		components:{ selfRadio,myPicker,selfCheckbox },
		data() {
			return {
				radioCss:{
					display: 'flex',
					flexWrap:'wrap',
				},
				navTitle:'新建孕产妇档案',
				whcdList:['研究生','大学本科','大学专科和专科学校','中等专业学校','技工学校','高中','初中','小学','文盲和半文盲','不详'],
				whcdConfig:[
					{ text:'文盲和半文盲', value:1},
					{ text:'小学', value:2 },
					{ text:'初中', value:3 },
					{ text:'高中', value:16 },
					{ text:'中等专业学校', value:14 },
					{ text:'大学专科和专科学校', value:13 },
					{ text:'大学本科', value:12 },
					{ text:'研究生', value:11 }
				],
				joblist:['国家机关、党群组织、企业、事业单位负责人','专业技术人员','办事人员和有关人员','商业、服务业人员','农、林、牧、渔、水利业生产人员','军人','不便分类的其他从业人员','无职业'],
				relationList:['父亲','母亲','配偶','兄弟姐妹','祖父母','爷爷','婆婆','其他'],
				fmList:['会阴侧切','会阴末切','产钳助产','臀位助产','胎头吸引','子宫下段横切口剖宫产','子宫体剖宫产','腹膜外剖宫产','其他'],
				levelList:[
					{ text:'多', value:'1' },
					{ text:'中', value:'2' },
					{ text:'少', value:'4' },
				],
				hasList:[
					{ text:'无', value:'1' },
					{ text:'有', value:'2' },
				],
				
				jwsList:[
					{ text:'无', value:'1' },
					{ text:'心脏病', value:'2' },
					{ text:'肾脏疾病', value:'4' },
					{ text:'肝脏病', value:'16' },
					{ text:'高血压', value:'32' },
					{ text:'贫血', value:'64' },
					{ text:'糖尿病', value:'128' },
					{ text:'肺结核', value:'256' },
					{ text:'泌尿生殖系...', value:'512' },
					{ text:'精神病', value:'1024' },
					{ text:'性病', value:'2048' },
					{ text:'麻痹', value:'4096' },
					{ text:'甲亢', value:'8192' },
					{ text:'先天患病', value:'16384'},
					{ text:'其他', value:'32768' },
				],
				gmsList:[
					{ text:'无', value:'1' },
					{ text:'青霉素', value:'2' },
					{ text:'磺胺', value:'4' },
					{ text:'链霉素', value:'16' },
					{ text:'其他', value:'32' },
				],
				jzsList:[
					{ text:'无', value:'1'},
					{ text:'盲', value:'2'},
					{ text:'聋', value:'4'},
					{ text:'哑', value:'16'},
					{ text:'精神病', value:'32'},
					{ text:'先天性智力...', value:'64'},
					{ text:'先天性心脏..', value:'128'},
					{ text:'血友病', value:'256'},
					{ text:'糖尿病', value:'512'},
					{ text:'其他', value:'1024'}
				],
				nationList: ["汉族","蒙古族","回族","藏族","维吾尔族","苗族","彝族","壮族","布依族","朝鲜族","满族","侗族","瑶族","白族","土家族","哈尼族","哈萨克族","傣族","黎族","傈僳族","佤族","畲族","高山族","拉祜族","水族","东乡族","纳西族","景颇族","柯尔克孜族","土族","达斡尔族","仫佬族","羌族","布朗族","撒拉族","毛南族","仡佬族","锡伯族","阿昌族","普米族","塔吉克族","怒族", "乌孜别克族","俄罗斯族","鄂温克族","德昂族","保安族","裕固族","京族","塔塔尔族","独龙族","鄂伦春族","赫哲族","门巴族","珞巴族","基诺族"],
				nationIndex: null,
				orgList:[
					// {name: '1xx机构', id: '1'},
				],
				doctorList:[
					{name:'',value:''},
				],
				saveDisable: false,
				personInfor:{
					cardId:"",
					//建册信息
					doctorName:"",
					doctorId:"",
					orgName: "",
					orgId:"",
					recDate: "",
					createWeek: "",
					//孕产妇基本信息
					name:"",
					idCard: "",
					age: "",
					birthdayDate:"",
					nation:"",
					address:"",
					domicilePlace:"",
					phone:"",
					postcode:"",
					education:"",
					occupation:"",
					workUnit:"",
					//孕产妇家属联系人
					person:{
						PENAME:"",
						RELATIVE:"",
						CARD_ID:"",
						NATION:"",
						XML_TEL:"",
						CULTURE:"",
						OCCUPATION:"",
						WORK_ORG_NAME:"",
					},
					//月经史
					examMenstrual:{
						MenarcheAge:"",
						Period:"",
						MenstrualCycle:"",
						MenstrualQuantity:"",
						Dysmenorrhea:"",
					},
					//孕产史
					gravidity:"",
					parity:"",
					terminations:"",
					spontaneousAbortion:"",
					midtermGestation:"",
					prematureDelivery:"",
					dystocia:"",
					embryolema:"",
					fetalDeath:"",
					stillbirthNumber:"",
					birthDefectsNumber:"",
					prePregnancyTermDate:"",
					prePregnancyTermWay:"",
					preDeliveryTime:"",
					preDeliveryWay:"",
					preDeliveryWayOther:"",
					pregnancyComplications:"",
					otherAbnormalHistory:"",
					
					//既往史
					previousHistory:[],
					previousHistoryOther:"",
					//手术史
					gynecologicalSurgeryHistory:"",
					gynecologicalSurgeryHistoryInfo:"",
					//现病史
					presentIllnessHistory:"",
					presentIllnessHistoryInfo:"",
					//药物过敏史
					drugAllergyHistory:[],
					drugAllergyHistoryInfo:"",
					//与遗传病有关的家族史(本人家族)
					myheredityFamily:[],
					myheredityFamilyOther:"",
					myheredityRelation:"",
					//与遗传病有关的家族史(配偶家族)
					husbandHeredityFamily:[],
					husbandHeredityFamilyOther:"",
					husbandHeredityRelation:"",
				},
			};
		},
		onLoad: function(option) {
			console.log('孕产妇档案修改传参', option)
			this.personInfor.cardId = option.cardId
			if(option.cardId && option.cardId!='null'){
				getPregnancyInfo({
					cardId: option.cardId
				}).then(res => {
					console.log('孕产妇档案修改传参', res)
					if (res.ret) {
						this.personInfor = res.data.Pregnancy
						this.personInfor.nation = parseInt(this.personInfor.nation)
						this.personInfor.education = parseInt(this.personInfor.education)
						this.personInfor.occupation = parseInt(this.personInfor.occupation)
						this.personInfor.preDeliveryWay = parseInt(this.personInfor.preDeliveryWay)
						// this.personInfor.person.RELATIVE = parseInt(this.personInfor.person.RELATIVE)
						// this.personInfor.person.NATION = parseInt(this.personInfor.person.NATION)
						// this.personInfor.person.CULTURE = parseInt(this.personInfor.person.CULTURE)
						// this.personInfor.person.OCCUPATION = parseInt(this.personInfor.person.OCCUPATION)
						
						this.personInfor.previousHistory = JSON.parse(this.personInfor.previousHistory)
						this.personInfor.drugAllergyHistory = JSON.parse(this.personInfor.drugAllergyHistory)
						this.personInfor.myheredityFamily = JSON.parse(this.personInfor.myheredityFamily)
						this.personInfor.husbandHeredityFamily = JSON.parse(this.personInfor.husbandHeredityFamily)
						this.personInfor.person = JSON.parse(this.personInfor.person)
						this.personInfor.examMenstrual = JSON.parse(this.personInfor.examMenstrual)
						console.log("孕产妇档案回显"+res.data.Pregnancy)
					}
				}, err => {})
			} else{
				this.personInfor.recDate = GetNowTime('-')
			}
			// console.log(this.personInfor.mbTypeId.indexOf(1) > -1)
		},
		created() {
			//获取机构名
			getOrgList().then(res=>{
				//console.log('获取机构列表',res)
				if(res.ret){
					this.orgList = res.data
				}
			})
		},
		mounted() {
			// this.$v.$touch();
			//获取医生列表
			getDocUserList().then(res=>{
				if(res.ret){
					this.doctorList = res.data
				}
			},err=>{})
		},
		methods:{
			// 查询 ehrid
			onBlurIdcard(){
				if(!idText(this.personInfor.idCard)){
					this.$showToast('请输入正确的身份证')
				} else {
					this.$showLoading('请求中')
					haveEhr({idCard:this.personInfor.idCard,type:'YCF'}).then((res)=>{
						uni.hideLoading()
						console.log(res)
						if(res.mes){
							this.$showToast(res.mes)
							this.personInfor.idCard = ''
						} else {
							if(!res.data.isEhr){
								this.$showToast('请先创建居民档案')
								this.personInfor.idCard = ''
							} else {
								var getPersonInformation = idToInfor(this.personInfor.idCard)
								var getData = res.data.comEhr
								this.personInfor.name = getData.name
								this.personInfor.age = getPersonInformation.age
								this.personInfor.ehrId = getData.id
								this.personInfor.birthdayDate = getData.birthday
								this.personInfor.orgId = getData.orgId
								this.personInfor.nation = getData.nation
								this.personInfor.phone = getData.tel
								this.personInfor.address = getData.address
								this.personInfor.orgName = getData.orgName
							}
						}
					},()=>{
						uni.hideLoading()
					})
				}
			},
			//医生列表显示
			doctorChange(e){
				this.personInfor.doctorName = e.label
				this.personInfor.doctorId = e.value
			},
			whcdGetText(key){
				var text = ''
				this.whcdConfig.forEach((item,index)=>{
					if(key == item.value){
						text = item.text	
					}
				})
				return text;
			},
			bindPickerChange(event,type){
				let { value } = event.detail
				if (type == 'csrq') {
					this.personInfor.birthdayDate = value
				} else if (type == 'mz') {
					this.personInfor.nation = Number(Math.pow(2, value))
				} else if (type == 'mz2') {
					this.personInfor.person.NATION = Number(Math.pow(2, value))
				}else if (type == 'whcd') {
					this.personInfor.education = this.whcdConfig[value].value
				}else if (type == 'whcd2') {
					this.personInfor.person.CULTURE = this.whcdConfig[value].value
				} else if (type == 'zy') {
					this.personInfor.occupation = Number(Math.pow(2, value))
				}else if (type == 'zy2') {
					this.personInfor.person.OCCUPATION = Number(Math.pow(2, value))
				}else if (type == 'mz2') {
					this.personInfor.person.NATION = Number(Math.pow(2, value))
				}else if (type == 'yyfgx') {
					this.personInfor.person.RELATIVE = Number(Math.pow(2, value))
				} else if (type == 'jcsj') {
					this.personInfor.recDate = value
				}else if (type == 'qcrszzrq') {
					this.personInfor.prePregnancyTermDate = value
				}else if (type == 'qcfmrq') {
					this.personInfor.preDeliveryTime = value
				}else if (type == 'qcfmfs') {
					this.personInfor.preDeliveryWay = Number(Math.pow(2, value))
				}else if (type == 'ybrgx') {
					this.personInfor.myheredityRelation = Number(Math.pow(2, value))
				}else if (type == 'ypogx') {
					this.personInfor.husbandHeredityRelation = Number(Math.pow(2, value))
				}
				
			},
			// changeNation (e){
			// 	this.nationIndex = e.target.value
			// 	this.personInfor.nation = this.nationList[this.nationIndex];
			// 	console.log(this.nationList[this.nationIndex])
			// },
			// startRecognize (){
			// 	voiceInput(res => {
			// 		if (res){
			// 			this.personInfor.name = res;
			// 		}
			// 	})
			// },
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
			//机构选择
			confirm(e){
				this.personInfor.orgId = e.value;
				this.personInfor.orgName = e.label;
			},
			//保存按钮
			save () {
				if(!this.personInfor.orgName){
					this.$showToast('机构未选择')
				} else if(!this.personInfor.idCard){
					this.$showToast('身份证未填')
				}  else {
					// if (this.saveDisable) {
					// 	return;
					// }
					// this.saveDisable = true;
					if(this.personInfor.person.NATION!=''){
						var indexRelativeNation =this.personInfor.person.NATION.toString(2).length - 1
						this.personInfor.person.NATION = this.nationList[indexRelativeNation] 
					}
					if(this.personInfor.nation!=''){
						var indexNation = this.personInfor.nation.toString(2).length - 1
						this.personInfor.nation = this.nationList[indexNation] 
					}
                    var req = Object.assign({},this.personInfor)
						req.previousHistory = JSON.stringify(req.previousHistory)
						req.drugAllergyHistory = JSON.stringify(req.drugAllergyHistory)
						req.myheredityFamily = JSON.stringify(req.myheredityFamily)
						req.husbandHeredityFamily = JSON.stringify(req.husbandHeredityFamily)
						req.person = JSON.stringify(req.person)
						req.examMenstrual = JSON.stringify(req.examMenstrual)
						console.log('保存孕产妇随访保存传参',req)
                    	this.$showLoading('加载中')
                    	addOrUpdateYcf(req).then(res=>{
                    		uni.hideLoading()
                    		if(res.ret){
                    				this.$showToast('保存成功')
									uni.$emit("YCFLIST_RELOAD");
									uni.$emit("DETAIL_RELOAD");
                    				setTimeout(function(){
                    				    uni.navigateBack({
                    				    	delta:1
                    				    })
                    				}, 1000)
                    			} else {
                    				this.$showToast(res.mes)
                    			}
                    		},err=>{
                    			uni.hideLoading()
                    			this.$showToast('服务器错误')
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
		.content{
			padding: 15rpx 20rpx;
			.list_box{
				background-color: #fff;		
				border-radius: 20rpx;
				padding: 26rpx;
				box-sizing: border-box;
				margin-bottom: 30rpx;
				.allInput{
					margin-top: 30rpx;
					border-bottom: 1rpx solid rgba(238, 238, 238, 1);	
				}
				.jingqi{
					display: flex;
					align-items: center;
					.jqitem{
						width: 100rpx;
					}
				}
				.warn{
					font-size: 30rpx;
					color: red;		
					font-weight: bold;
				}
				.card_title{
					font-size: 30rpx;
					color: #35A8FF;		
					font-weight: bold;
					&::before{
						margin-right: 8rpx;
						display: inline-block;
						content: '';
						width: 6rpx;
						height: 20rpx;
						background: #35A8FF;
						border-radius: 4rpx;
					}
				}
				.list_item{
					padding: 24rpx 0rpx;
					border-bottom: 1rpx solid rgba(238, 238, 238, 1);				
					position: relative;
					display: flex;
					align-items: center;
					justify-content:space-between;
					.list_left{
						font-size: 28rpx;
						color:rgba(51, 51, 51, 1);
						font-weight: bold;
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
						.radioBox{
							width:300rpx;
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
		}
		.saveBtn{
			width:664rpx;
			height:88rpx;
			color: #FFFFFF;
			margin: 30rpx auto;
			bottom: 32rpx;
			background:rgba(53,168,255,1);
			border-radius:10px;
		}
	}
</style>
