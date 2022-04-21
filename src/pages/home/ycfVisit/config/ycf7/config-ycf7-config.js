export default {
	// 显示隐藏参数
	listShow:{
		jbxx:true,
		ybjkqk:false,
		ybxlqk:false,
		ybjc:false,
		stzk:false,
		fl:false,
		zhuanzhen:false,
		sfxx:false,
		zz:false,
	},
	unusualConfig:[
		{value: 1,text: '未见异常'},
		{value: 2,text: '异常'},
	],
	unusualConfig1:[
		{value: 1,text: '已恢复'},
		{value: 2,text: '已未恢复'},
	],
	sfReason:['外出打工','迁居他处','走失','连续3次未到访','其他'],
	// 基本信息
	array: ['门诊', '家庭', '电话'],
	
	// 指导
	zdList:[
		{ text:'个人卫生', value:'1' },
		{ text:'心理', value:'2'},
		{ text:'营养', value:'4'},
		{ text:'母乳喂养', value:'8'},
		{ text:'新生儿护理...', value:'16'},
		{ text:'其他',value:'32'}
	],
	zdList1:[
		{ text:'心理保健', value:'1' },
		{ text:'性保健与避孕', value:'2'},
		{ text:'婴儿喂养', value:'4'},
		{ text:'妇产营养', value:'8'},
		{ text:'其他',value:'16'}
	],
	// 体征
	zbdmbdList:[['触及正常','减弱','消失'],['双侧','左侧','右侧']],
	
	// 生活指导
	syArray:['轻','中','重'],
	syAimArray:['轻','中'],
	xlArray:['良好','一般','差'],
	
	
	fyycxList: [{value: '1',text: '规律'},
		{value: '2',text: '间断'},
		{value: '3',text: '不服药'}
	],
	radioCss:{
		display: 'flex',
		flexWrap:'wrap',
	},
	// 药物不良反应
	// 下一步管理措施
	xybsfcsList:[
		{text:'常规随访',value:'1'},
		{text:'第1次控制不满意2周随访',value:'2'},
		{text:'两次控制不满意转诊随访',value:'3'},
		{text:'紧急转诊',value:'4'}
	],
	// 转诊
	zhzList:[
		{value: '1',text: '到位'},
		{value: '2',text: '不到位'},
	]
}