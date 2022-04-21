export default {
	// 显示隐藏参数
	listShow: {
		jbxx: true,
		ybjc: false,
		tgjc: false,
		fzjc: false,
		fl: false,
		zd: false,
		ybjkqk: false,
		sfxx: false,
		zhuanzhen: false,
		remarks: false
	},
	yzList: [],
	defaultProps1: {
		label: "name",
		value: "id",
		children: "child"
	},
	linkageVisible: false,
	tsConfig: [{
			value: 1,
			text: '单胎'
		},
		{
			value: 2,
			text: '双胎'
		},
		{
			value: 4,
			text: '三胎及以上'
		},
	],
	unusualConfig: [{
			value: 1,
			text: '未见异常'
		},
		{
			value: 2,
			text: '异常'
		},
	],
	twConfig: ['左枕前（LOA）', '右枕前（ROA）',
		'左枕后（LOP）', '右枕后（ROP）',
		'左枕横（LOT）', '右枕横（ROT）',
		'左颏前（LMA）', '右颏前（RMA）',
		'左颏后（LMP）', '右颏后（RMP）',
		'左颏横（LMT）', '右颏横（RMT）',
		'左骶前（LSA）', '右骶前（LSP）',
		'左骶后（LSP）', '右骶后（RSP）',
		'左骶横（LST）', '右骶横（RST）',
		'左肩前（LScA）', '右肩前（RScA）',
		'左肩后（LScP）', '右肩后（RScP）', '不清'
	],
	sfReason: ['外出打工', '迁居他处', '走失', '连续3次未到访', '其他'],
	// 基本信息
	array: ['门诊', '家庭', '电话'],

	// 指导
	zdList0: [{
			text: '生活方式',
			value: '1'
		},
		{
			text: '营养',
			value: '2'
		},
		{
			text: '心理',
			value: '4'
		},
		{
			text: '运动',
			value: '8'
		},
		{
			text: '其他',
			value: '16'
		}
	],
	zdList1: [{
			text: '生活方式',
			value: '1'
		},
		{
			text: '营养',
			value: '2'
		},
		{
			text: '心理',
			value: '4'
		},
		{
			text: '运动',
			value: '8'
		},
		{
			text: '自我监护',
			value: '32'
		},
		{
			text: '母乳喂养',
			value: '64'
		},
		{
			text: '其他',
			value: '128'
		}
	],
	zdList2: [{
			text: '生活方式',
			value: '1'
		},
		{
			text: '营养',
			value: '2'
		},
		{
			text: '心理',
			value: '4'
		},
		{
			text: '运动',
			value: '8'
		},
		{
			text: '自我监护',
			value: '16'
		},
		{
			text: '分娩准备',
			value: '32'
		},
		{
			text: '母乳喂养',
			value: '64'
		},
		{
			text: '其他',
			value: '128'
		}
	],
	// 体征
	zbdmbdList: [
		['触及正常', '减弱', '消失'],
		['双侧', '左侧', '右侧']
	],

	// 生活指导
	syArray: ['轻', '中', '重'],
	syAimArray: ['轻', '中'],
	xlArray: ['良好', '一般', '差'],
	fyycxList: [{
			value: '1',
			text: '规律'
		},
		{
			value: '2',
			text: '间断'
		},
		{
			value: '3',
			text: '不服药'
		}
	],
	radioCss: {
		display: 'flex',
		flexWrap: 'wrap',
	},
	// 药物不良反应
	// 下一步管理措施
	xybsfcsList: [{
			text: '常规随访',
			value: '1'
		},
		{
			text: '第1次控制不满意2周随访',
			value: '2'
		},
		{
			text: '两次控制不满意转诊随访',
			value: '3'
		},
		{
			text: '紧急转诊',
			value: '4'
		}
	],
	// 转诊
	zhzList: [{
			value: '1',
			text: '到位'
		},
		{
			value: '2',
			text: '不到位'
		},
	]
}
