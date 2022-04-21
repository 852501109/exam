export default {
	// 显示隐藏参数
	listShow:{
		jbxx:true,
		jws:false,
		jzs:false,
		grs:false,
		fkshs:false,
		ycs:false,
		ybjc:false,
		tz:false,
		fkjc:false,
		ztpg:false,
		bjzd:false,
		zhuanzhen:false,
		sfxx:false
	},
	yzList:[],
	 defaultProps1:{
	  label:"name",
	  value:"id",
	  children:"child"
	 },
	 linkageVisible:false,
	jwsList:[{value: '1',text: '无'},
		{value: '2',text: '心脏病'},
		{value: '4',text: '肾脏疾病'},
		{value: '8',text: '肝脏疾病'},
		{value: '16',text: '高血压'},
		{value: '32',text: '贫血'},
		{value: '64',text: '糖尿病'},
		{value: '128',text: '其他'},
	],
	fkshs:[
		{value: 1,text: '无'},
		{value: 2,text: '有'},
	],
	jzsList:[
		{value: 1,text: '遗传性...'},
		{value: 2,text: '精神病史'},
		{value: 4,text: '其他'},
	],
	grsList:[{value:64,text: '无特殊'},
		{value: 1,text: '吸烟'},
		{value: 2,text: '饮酒'},
		{value: 4,text: '服用药物'},
		{value: 8,text: '接触有毒...'},
		{value: 16,text: '接触放射线'},
		{value: 32,text: '其他'}
	],
	unusualConfig:[
		{value: 1,text: '未见异常'},
		{value: 2,text: '异常'},
	],
	
	// 保健指导
	bjzdList:[
		{ text:'生活方式', value:'1' },
		{ text:'心理', value:'2'},
		{ text:'营养健康', value:'4'},
		{ text:'避免致畸...', value:'8'},
		{ text:'产前筛查...', value:'16'},
		{ text:'其他', value:'32'},
	]
}