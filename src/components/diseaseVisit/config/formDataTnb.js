export default {
  formData: {
    name: '',
    cardId: '',
    orgId: '',
    orgName: '',
    ehrId: '',
    idCard: '',
    // 新增照片base64
    folUrl1Base64: '',
    folUrl2Base64: '',
    juminNameUrl2Base64: '',
    // 基本信息
    followUpStyle: '',
    followUpDate: '',
    folUrl1: '',
    folUrl2: '',
    wpzyy: '',
    // 症状
    symptom: ['1'],
    symptomOther: '',
    // 体征
    highPressure: '',
    lowPressure: '',
    height: '',
    weight: '',
    weightExp: '',
    bmi: '',
    bmiExp: '',
    footPulstates: '',
    footPilstatesWhere: '',
    signOther: '',
    // 生活指导
    countCigarette: '',
    countCigaretteExp: '',
    countWine: '',
    countWineExp: '',
    exercise: '',
    exerciseExp: '',
    frequency: '',
    frequencyExp: '',
    stapleFood: '',
    stableFoodExp: '',
    psyRecovery: '',
    treatmentCompliance: '',
    // 辅助检查
    glu: '',
    GHb: '',
    chXt: '',
    sjXt: '',
    ghb: '',
    ghbDate: '',
    ghbOther: '',
    // GHbDate:'',
    otherCheck: '',
    // 目前用药情况
    medication: [
      {
        medicineUnit: '片',
        medicineCount: '',
        eatCount: '',
        medicineName: '',
        timeUnit: '日',
        yybz: '',
      },
    ],
    // 用药调整意见
    medicationExp: [
      {
        name: '',
        time_unit: '',
        time: '',
        amount: '',
        amount_unit: '',
      },
    ],
    // 胰岛素使用情况
    insulinVariety: [
      {
        amountUnit: '',
        amount: '',
        time: '',
        name: '',
        timeUnit: '日',
      },
    ],
    insulinDirections: '',
    // 胰岛素使用调整
    insulinAdjustmmentVariety: [
      {
        amountUnit: '',
        amount: '',
        time: '',
        name: '',
        timeUnit: '日',
      },
    ],
    insulinAdjustmmentDirections: '',
    // 服药依从性
    medicationCompliance: 1,
    // 药物不良反应
    adverceReactionCode: 1,
    adverceReactionDetail: '',
    // 低血糖反应
    hypoglycemiaReaction: '1',
    // 此次随访分类
    classifyFollowUp: '',
    // 下一步管理措施
    managementNextStep: '',
    // 患者接受管理度
    degreeOfAcceptance: '',
    // 转诊
    transferOrg: '',
    contractName: '',
    //初步印象
    contractImpression: '',
    transferReason: '',
    //既往史
    contractJws: '',
    //治疗经过
    contractCure: '',
    // 随访信息
    nextDate: '',
    doctorName: '',
    accurate: '',
    juminName: '',
    juminNameUrl: '',
    remarke: '',
    // 健康指导意见
    jkzd: '',
    location: '', //随访定位
    latitude: null, //纬度
    longitude: null, //经度
    contractTel: null, //转诊联系电话
    transferResult: null, //转诊到位
  },
}
