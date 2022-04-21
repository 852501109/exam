import { required,requiredIf, minLength, between } from 'vuelidate/lib/validators'

export default {
	validations: {
	  formData: {
		// 基本信息
		followUpDate:{required},
		weight:{required},
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
		
		// 转诊 根据值>2 必填
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