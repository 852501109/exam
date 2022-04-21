import { required,requiredIf, minLength, between } from 'vuelidate/lib/validators'

export default {
	validations: {
	  formData: {
		// 基本信息
		followUpStyle: { required},
		followUpDate:{required},
		dangerLevel:{required},
		nextDate:{required},
		doctorName:{required},
		// 症状
		//symptom:{},
		symptomOther: {
			required:requiredIf(function(){
			return this.formData.symptom.includes('10')&&!this.formData.symptom_other})
		},
		//转诊
		// transferOrg:{
		// 	required:requiredIf(function(){
		// 	return this.formData.managementNextStep > 2 })
		// },
		// 此次随访分类
		// classifyFollowUp:{ required},
		// transferReason:{
		// 	required:requiredIf(function(){
		// 	return this.formData.managementNextStep > 2 })
		// },
	  }
	},
	computed: {
		isSymptomEmpty(){
			return this.formData.symptom.length>0?false : true
		},
		// 基本信息判断缺项
		jbxxIsEmpty(){
			return !this.$v.formData.followUpStyle.required || !this.$v.formData.followUpDate.required 
		},
		// 症状判断非空
		zzIsEmpty(){
			return !this.$v.formData.symptomOther.required || this.isSymptomEmpty
		},
		// 调整用药判断
		yyIsEmpty(){
			if(this.formData.medicationCompliance==3){
				return false
			} else {
				return !this.formData.medication[0]['medicineName'] || !this.formData.medication[0]['medicineUnit']|| !this.formData.medication[0]['medicineCount'] || !this.formData.medication[0]['eatCount'] || !this.formData.medication[0]['timeUnit'];
			}
		}
	}
}