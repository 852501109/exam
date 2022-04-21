import {
	required,
	requiredIf,
	minLength,
	between
} from 'vuelidate/lib/validators'

const sportInput = (value) => {
	const regex1 = /\d+/gm;
	const regex2 = /\d+-\d+/gm;
	return (regex1.exec(value) !== null || regex2.exec(value) !== null)
}


export default {
	validations: {
		formData: {
			// 基本信息
			followUpDate: {
				required
			},
			followUpStyle: {
				required
			},
			// folUrl1:{required},
			// folUrl2:{required},
			// 症状
			//symptom:{required},
			symptom_other: {
				required: requiredIf(function() {
					return this.formData.symptom.includes('10') && !this.formData.symptomOther
				})
			},
			// 体征
			highPressure: {
				required,
				between: between(30, 300)
			},
			lowPressure: {
				required,
				between: between(30, 300)
			},
			height: {
				required,
				between: between(30, 220)
			},
			weight: {
				required,
				between: between(20, 150)
			},
			weightExp: {
				required,
				between: between(20, 150)
			},
			footPulstates: {
				required
			},
			footPilstatesWhere: {
				required: requiredIf(function() {
					return this.formData.footPulstates != 1
				})
			},
			//生活指导
			countCigarette: {
				required
			},
			countCigaretteExp: {
				required
			},
			countWine: {
				required
			},
			countWineExp: {
				required
			},
			exercise: {
				required,
				sportInput
			},
			exerciseExp: {
				required,
				sportInput
			},
			frequency: {
				required,
				sportInput
			},
			frequencyExp: {
				required,
				sportInput
			},
			stapleFood: {
				required
			},
			stableFoodExp: {
				required
			},
			psyRecovery: {
				required
			},
			treatmentCompliance: {
				required
			},
			// 血糖检查
			glu: {
				required: requiredIf(function() {
					if (this.gluRequired) {
						return true
					}
				}),
				between: between(1, 40)
			},
			// 目前用药情况
			// 此次随访分类
			classifyFollowUp: {
				required
			},
			degreeOfAcceptance: {
				required
			},
			// 药物不良反应
			adverceReactionDetail: {
				required: requiredIf(function() {
					return this.formData.adverceReactionCode == '2'
				})
			},
			//转诊
			transferOrg: {
				required: requiredIf(function() {
					return this.formData.managementNextStep > 2
				})
			},
			transferReason: {
				required: requiredIf(function() {
					return this.formData.managementNextStep > 2
				})
			},
			medicationExp: {
				required: requiredIf(function() {
					return this.formData.managementNextStep === 2
				})
			},
			//下次随访时间必填
			nextDate: {
				required
			}
		}
	},
	computed: {
		bmi_computed() {
			// 身高体重存在，并且体重 > 20kg 身高 > 50cm的情况开始计算
			if (this.formData.weight && this.formData.height && this.formData.weight > 20 && this.formData.height >
				50) {
				const bmi = (this.formData.weight / (this.formData.height * this.formData.height) * 10000).toFixed(2)
				this.formData.bmi = bmi
				return bmi
			} else {
				return 0.0
			}
		},
		bmiExp_computed() {
			if (this.formData.weightExp && this.formData.height && this.formData.weightExp > 20 && this.formData
				.height > 50) {
				const bmiExp = (this.formData.weightExp / (this.formData.height * this.formData.height) * 10000)
					.toFixed(2)
				this.formData.bmiExp = bmiExp
				return bmiExp
			} else {
				return 0.00
			}
		},
		isSymptomEmpty() {
			return this.formData.symptom.length > 0 ? false : true
		},
		// 症状判断非空
		zzIsEmpty() {
			return !this.$v.formData.symptomOther.required || this.isSymptomEmpty
		},
		// 基本信息判断缺项
		jbxxIsEmpty() {
			return !this.$v.formData.followUpDate.required || !this.$v.formData.followUpStyle.required
		},
		// 症状判断非空
		zzIsEmpty() {
			return !this.$v.formData.symptom_other.required
		},
		// 体征判断
		tzIsEmpty() {
			return this.$v.formData.highPressure.$error ||
				this.$v.formData.lowPressure.$error ||
				this.$v.formData.height.$error ||
				this.$v.formData.weight.$error ||
				this.$v.formData.footPulstates.$error ||
				this.$v.formData.footPilstatesWhere.$error ||
				this.$v.formData.weightExp.$error
		},
		// 舒张压大于收缩压
		bigHigh() {
			if (Number(this.formData.lowPressure) > Number(this.formData.highPressure)) {
				return true
			} else {
				return false
			}
		},
		// 生活指导判断
		shzdIsEmpty() {
			return !this.$v.formData.countCigarette.required ||
				!this.$v.formData.countCigaretteExp.required ||
				!this.$v.formData.countWine.required ||
				!this.$v.formData.countWineExp.required ||
				!this.$v.formData.exercise.required ||
				!this.$v.formData.exerciseExp.required ||
				this.$v.formData.frequency.$error || this.$v.formData.frequencyExp.$error ||
				!this.$v.formData.stapleFood.required ||
				!this.$v.formData.stableFoodExp.required ||
				!this.$v.formData.psyRecovery.required ||
				!this.$v.formData.treatmentCompliance.required
		},
		//辅助检查判断
		fzjcIsEmpty() {
			return !this.$v.formData.glu.required
		},
		// 用药判断
		yyIsEmpty() {
			if (this.formData.medicationCompliance == 3) {
				return false
			} else {
				if (this.formData.medication[0]['medicineName'] || this.formData.insulinVariety[0]['name']) {
					return false
				} else {
					return true
				}
			}
		},
		// 用药调整判断
		yytzIsEmpty() {
			let result = false
			if ((this.formData.classifyFollowUp == '2' || this.formData.adverceReactionCode == "2") || (this.formData
					.managementNextStep == 2)) {
				result = !this.formData.medicationExp[0]['medicineName'] || !this.formData.medicationExp[0][
						'medicineUnit'
					] ||
					!this.formData.medicationExp[0]['medicineCount'] || !this.formData.medicationExp[0]['eatCount'] || !
					this.formData.medicationExp[0]['timeUnit'];
			}
			return result
		},
		// 服药依从性  规律简短必填用药 不服药 必填用药意见
		// 药物不良判断
		ywblfyIsEmpty() {
			return !this.$v.formData.adverceReactionDetail.required
		},
		// 转诊 根据值>2 必填
		// 随访信息 其他 下次随访可改
		// 健康指导
		// 转诊判断
		zzJudge() {
			let result = false
			if (this.formData.managementNextStep > 2) {
				result = true
			}
			if (result) {
				result = !this.$v.formData.transferReason.required || !this.$v.formData.transferOrg.required
			}
			return result
		},
		ydsIsEmpty() {
			return false
		},
		ydstzIsEmpty() {
			return false
		}
	}
}
