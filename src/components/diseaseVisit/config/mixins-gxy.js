import { required, requiredIf, minLength, between } from 'vuelidate/lib/validators'

const sportInput = value => {
  const regex1 = /\d+/gm
  const regex2 = /\d+-\d+/gm
  return regex1.exec(value) !== null || regex2.exec(value) !== null
}

export default {
  validations: {
    formData: {
      // 基本信息
      followUpStyle: {
        required,
      },
      followUpDate: {
        required,
      },
      symptomOther: {
        required: requiredIf(function () {
          return this.formData.symptom.includes('10') && !this.formData.symptom_other
        }),
      },
      // 体征
      highPressure: {
        required,
        between: between(30, 300),
      },
      lowPressure: {
        required,
        between: between(30, 300),
      },
      heartRate: {
        required,
        between: between(30, 200),
      },
      height: {
        required,
        between: between(50, 220),
      },
      weight: {
        required,
        between: between(20, 150),
      },
      weightExp: {
        required,
        between: between(20, 150),
      },
      //生活指导
      countCigarette: {
        required,
      },
      countCigaretteExp: {
        required,
      },
      countWine: {
        required,
      },
      countWineExp: {
        required,
      },
      exercise: {
        required,
        sportInput,
      },
      exerciseExp: {
        required,
        sportInput,
      },
      frequency: {
        required,
        sportInput,
      },
      frequencyExp: {
        required,
        sportInput,
      },
      saltSituation: {
        required,
      },
      saltSituationExp: {
        required,
      },
      psyRecovery: {
        required,
      },
      treatmentCompliance: {
        required,
      },
      // 辅助检查
      // 目前用药情况
      // 药物不良反应
      adverceReactionDetail: {
        required: requiredIf(function () {
          return this.formData.adverceReactionCode == '2'
        }),
      },
      // 此次随访分类
      classifyFollowUp: {
        required,
      },
      //转诊
      transferOrg: {
        required: requiredIf(function () {
          return this.formData.managementNextStep > 2
        }),
      },
      transferReason: {
        required: requiredIf(function () {
          return this.formData.managementNextStep > 2
        }),
      },
      medicationExp: {
        required: requiredIf(function () {
          return this.formData.managementNextStep === 2
        }),
      },
      //下次随访时间必填
      nextDate: {
        required,
      },
    },
  },
  computed: {
    // 自动获得BMI
    bmi_computed() {
      // 身高体重存在，并且体重 > 20kg 身高 > 50cm的情况开始计算
      if (
        this.formData.weight &&
        this.formData.height &&
        this.formData.weight > 20 &&
        this.formData.height > 50
      ) {
        const bmi = (
          (this.formData.weight / (this.formData.height * this.formData.height)) *
          10000
        ).toFixed(2)
        this.formData.bmi = bmi
        return bmi
      }
      return 0.0
    },
    bmiExp_computed() {
      if (
        this.formData.weightExp &&
        this.formData.height &&
        this.formData.weightExp > 20 &&
        this.formData.height > 50
      ) {
        const bmiExp = (
          (this.formData.weightExp / (this.formData.height * this.formData.height)) *
          10000
        ).toFixed(2)
        this.formData.bmiExp = bmiExp
        return bmiExp
      }
      return 0.0
    },
    isSymptomEmpty() {
      return this.formData.symptom.length > 0 ? false : true
    },
    // 基本信息判断缺项
    jbxxIsEmpty() {
      return !this.$v.formData.followUpStyle.required || !this.$v.formData.followUpDate.required
    },
    // 症状判断非空
    zzIsEmpty() {
      return !this.$v.formData.symptomOther.required || this.isSymptomEmpty
    },
    // 体征判断
    tzIsEmpty() {
      return (
        this.$v.formData.highPressure.$error ||
        this.$v.formData.lowPressure.$error ||
        this.$v.formData.height.$error ||
        this.$v.formData.heartRate.$error ||
        this.$v.formData.weight.$error ||
        this.$v.formData.weightExp.$error
      )
    },
    // 舒张压大于收缩压
    bigHigh() {
      if (Number(this.formData.lowPressure) > Number(this.formData.highPressure)) {
        return true
      }
      return false
    },
    // 生活指导判断
    shzdIsEmpty() {
      return (
        !this.$v.formData.countCigarette.required ||
        !this.$v.formData.countCigaretteExp.required ||
        !this.$v.formData.countWine.required ||
        !this.$v.formData.countWineExp.required ||
        !this.$v.formData.exercise.required ||
        !this.$v.formData.exerciseExp.required ||
        this.$v.formData.frequency.$error ||
        this.$v.formData.frequencyExp.$error ||
        !this.$v.formData.psyRecovery.required ||
        !this.$v.formData.treatmentCompliance.required ||
        !this.$v.formData.saltSituation.required ||
        !this.$v.formData.saltSituationExp.required
      )
    },
    // 目前用药判断
    yyIsEmpty() {
      if (this.formData.medicationCompliance == 3) {
        return false
      }
      return (
        !this.formData.medication[0].medicineName ||
        !this.formData.medication[0].medicineUnit ||
        !this.formData.medication[0].medicineCount ||
        !this.formData.medication[0].eatCount ||
        !this.formData.medication[0].timeUnit
      )
    },
    // 用药调整判断
    yytzIsEmpty() {
      let result = false
      if (
        this.formData.classifyFollowUp == '2' ||
        this.formData.adverceReactionCode == '2' ||
        this.formData.managementNextStep == 2
      ) {
        result =
          !this.formData.medicationExp[0].medicineName ||
          !this.formData.medicationExp[0].medicineUnit ||
          !this.formData.medicationExp[0].medicineCount ||
          !this.formData.medicationExp[0].eatCount ||
          !this.formData.medicationExp[0].timeUnit
      }
      return result
    },
    // 服药依从性  规律简短必填用药 不服药 必填用药意见
    // 药物不良判断
    ywblfyIsEmpty() {
      return !this.$v.formData.adverceReactionDetail.required
    },
    // 转诊 根据值>2 必填
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
    // 随访信息 其他 下次随访可改
    // 健康指导
  },
}
