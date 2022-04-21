import { required,requiredIf, minLength, between } from 'vuelidate/lib/validators'

export default {
	validations: {
	  formData: {
		// 基本信息
		// followUpStyle: { required},
		followUpDate:{required},
		edc:{required},
		lmp:{required},
		// 孕周
		createWeek:{required},
		createDay:{required},
		//下次随访时间必填
		nextDate:{ required },
		//随访医生签名
		doctorName: {required},
	  }
	},
	computed: {
		// 自动获得BMI
		bmi_computed() {
		  // 身高体重存在，并且体重 > 20kg 身高 > 50cm的情况开始计算
		  if (this.formData.weight && this.formData.height && this.formData.weight > 20 && this.formData.height > 50) {
			this.formData.bmi = (this.formData.weight / (this.formData.height * this.formData.height) * 10000).toFixed(1)
			return (this.formData.weight / (this.formData.height * this.formData.height) * 10000).toFixed(2)
		  } else {
		    return 0.0
		  }
		},
		bmiExp_computed(){
			if (this.formData.weightExp && this.formData.height && this.formData.weightExp > 20 && this.formData.height > 50) {
			  this.formData.bmiExp = (this.formData.weightExp / (this.formData.height * this.formData.height) * 10000).toFixed(1)
			  return (this.formData.weightExp / (this.formData.height * this.formData.height) * 10000).toFixed(2)
			} else {
			  return 0.0
			}
		},
		// isSymptomEmpty(){
		// 	return this.formData.symptom.length>0?false : true
		// },
		// // 基本信息判断缺项
		// jbxxIsEmpty(){
		// 	return !this.$v.formData.followUpStyle.required || !this.$v.formData.followUpDate.required 
		// },
		// // 症状判断非空
		// zzIsEmpty(){
		// 	return !this.$v.formData.symptomOther.required || this.isSymptomEmpty
		// },
		// 体征判断
		tzIsEmpty(){
			return this.$v.formData.highPressure.$error
            || this.$v.formData.lowPressure.$error
            || this.$v.formData.height.$error
            || this.$v.formData.heartRate.$error
			|| this.$v.formData.weight.$error
			|| this.$v.formData.weightExp.$error
		},
		// 舒张压大于收缩压
		bigHigh(){
			if(Number(this.formData.lowPressure) > Number(this.formData.highPressure)){
				return true
			} else {
				return false
			}
		},
		// 生活指导判断
		shzdIsEmpty(){
			return !this.$v.formData.countCigarette.required || !this.$v.formData.countCigaretteExp.required
			|| !this.$v.formData.countWine.required || !this.$v.formData.countWineExp.required
			|| !this.$v.formData.exercise.required || !this.$v.formData.exerciseExp.required
			|| this.$v.formData.frequency.$error || this.$v.formData.frequencyExp.$error
			|| !this.$v.formData.psyRecovery.required || !this.$v.formData.treatmentCompliance.required
			|| !this.$v.formData.saltSituation.required || !this.$v.formData.saltSituationExp.required
		},
		// 调整用药判断
		// yyIsEmpty(){
		// 	if(this.formData.medicationCompliance==3){
		// 		return false
		// 	} else {
		// 		return !this.formData.medication[0]['medicineName'] || !this.formData.medication[0]['medicineUnit']|| !this.formData.medication[0]['medicineCount'] || !this.formData.medication[0]['eatCount'] || !this.formData.medication[0]['timeUnit'];
		// 	}
		// },
		// 用药调整判断
		// yytzIsEmpty(){
		//   return !this.formData.medicationExp[0]['name'] || !this.formData.medicationExp[0]['time_unit']|| !this.formData.medicationExp[0]['time'] || !this.formData.medicationExp[0]['amount'] || !this.formData.medicationExp[0]['amount_unit'];
		// },
		// 服药依从性  规律简短必填用药 不服药 必填用药意见
		// 药物不良判断
		// ywblfyIsEmpty(){
		// 	return !this.$v.formData.adverceReactionDetail.required
		// },
		// 转诊 根据值>2 必填
		// zzJudge(){
		// 	// !this.$v.formData.transferOrg.required
		// 	return !this.$v.formData.transferReason.required || !this.$v.formData.transferOrg.required
		// }
		// 随访信息 其他 下次随访可改
		// 健康指导
	},
	methods:{
		back(){
			uni.navigateBack({
				delta: 1
			})
			return true
			// uni.navigateTo({
			// 	url:'/pages/home/ycfVisit/ycfRecord/ycfRecord'+ '?cardId=' +this.cardId +'&idCard=' +this.idCard
			// })
		},
	}
}