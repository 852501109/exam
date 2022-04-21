export default {
	formData:{
		name:'',
		cardId:'',
		orgId:'', 
		orgName:'',
		ehrId:'',
		idCard:'',
		// 页面绑定数据
		// 新增照片base64
		folUrl1Base64:'',
		folUrl2Base64:'',
		juminNameUrl2Base64:'',
		// 基本信息
		followUpStyle:2,
		followUpDate:'',
		folUrl1:'',
		folUrl2:'',
		wpzyy:'',
		lostCause:'',
		// 死亡原因
		dieDate:'',
		dieReason:'',
		dieCause:[],
		
		//危险性
		dangerLevel:'',
		// 目前症状
		symptom:[],
		symptomOther:'',
		// 自知力
		inSight:'',
		//睡眠
		sleepQuality:'',
		// 饮食
		dietaryStatus:'',
		// 社会功能情况
		lifeCare:'',
		houseword:'',
		productiveLaborWork:'',
		learningAbility:'',
		communication:'',
		// 危险行为
		dangerousBehavior:{
			mildDisturbances:'',
			causeThings:'',
			causeTrouble:'',
			otherHarmfulBehaviors:'',
			selfHarm:'',
			suicideAttempts:''
		},
		// 关锁情况
		captivityCase:'',
		// 随访住院情况
		inHospitalCase:'',
		lastOutHospitalDate:'',
		// 一般检查
		highPressure:'',
		lowPressure:'',
		weight:'',
		glu:'',
		leftVision:'',
		leftCva:'',
		rightVision:'',
		rightCva:'',
		hearing:'',
		athleticAbility:'',
		// 实验室检查
		//laboratoryExamination:'',
		// 目前用药情况
		medication: [
			{
			  medicineUnit: "片",
			  medicineCount: "",
			  eatCount: "",
			  medicineName: "",
			  timeUnit: "日",
			  yybz:'',
		    }
		],
		// 服药依从性
		medicationCompliance:'',
		// 药物不良反应
		adverceReactionCode:'',
		adverceReactionDetail:'',
		// 治疗效果
		therapeuticEffect:'',
		// 康复措施
		rehabilitationMeasures:[],
		rehabilitationMeasuresOther:'',
		// 此次随访分类
		classifyFollowUp:'',
		//转诊
		transferOrg:'',
		contractName:'',
		contractImpression:'',
		transferReason:'',
		contractJws:'',
		contractCure:'',
		// 随访信息
		nextDate:'',
		doctorName:'',
        accurate: '',
		juminName:'',
		juminNameUrl:'',
		remarke: '',
		location: '',  //随访定位
		latitude: null, //纬度
		longitude: null //经度
	}
}