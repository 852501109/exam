export default {
	// 显示隐藏参数
	listShow:{
		jbxx:true,
		swyy:false,
		wxx:false,
		zz:false,
		zzl:false,
		ys:false,
		sm:false,
		shgnqk:false,
		wxxw:false,
		gs:false,
		zyqk:false,
		ybjc:false,
		mqyyqk:false,
		mqyyqkzd:false,
		fyycx:false,
		ywblfy:false,
		zlxg:false,
		kfcs:false,
		ccsffl:false,
		zhuanz:false,
		sfxx:false
	},
	// 基本信息
	array: ['门诊', '家庭', '电话'],
	// 失访原因
	sfReason:['外出打工','迁居他处','走失','连续3次未到访','其他'],
	//sfReason:[{text:'外出打工',value:'1'},{text:'迁居他处',value:'2'},{text:'走丢',value:'4'},{text:'连续3次未到访',value:'8'},{text:'其他',value:'16'}],
	// 死亡原因
	deathReasonList:['躯体疾病','自杀','他杀','意外','精神疾病相关并发症','其他'],
	qtjbList:[
		{ text:'传染病和寄生虫病', value:'1'},
		{ text:'肿瘤', value:'2'},
		{ text:'心脏病', value:'4'},
		{ text:'脑血管病', value:'8'},
		{ text:'呼吸系统疾病', value:'16'},
		{ text:'消化系统疾病',value:'32'},
		{ text:'不详', value:'64'}
	],
	deathCss:{
		fontSize:'22rpx'
	},
	// 危险性
	wxlList:[
		{value: '1',text: '（0级）'},
		{value: '2',text: '（1级）'},
		{value: '4',text: '（2级）'},
		{value: '8',text: '（3级）'},
		{value: '16',text: '（4级）'},
		{value: '32',text: '（5级）'},
	],
	// 症状
	zzList:[
		{ text:'幻觉', value:'1' },
		{ text:'交流困难', value:'2'},
		{ text:'猜疑', value:'4'},
		{ text:'喜怒无常', value:'8'},
		{ text:'行为怪异', value:'16'},
		{ text:'兴奋话多',value:'32'},
		{ text:'伤人毁物', value:'64'},
		{ text:'悲观厌世', value:'128'},
		{ text:'无故外走', value:'256'},
		{ text:'自语自笑', value:'512'},
		{ text:'孤僻懒散', value:'1024'},
		{ text:'其他', value:'2048'}
	],
	
    // 自知力	
	zzlList: [{value: '1',text: '完全'},
		{value: '2',text: '不全'},
		{value: '4',text: '缺失'}
	],
	// 睡眠
	smList: [{value: '1',text: '良好'},
		{value: '2',text: '一般'},
		{value: '4',text: '差'}
	],
	// 生产劳动及工作
	scldList: [{value: '1',text: '良好'},
		{value: '2',text: '一般'},
		{value: '4',text: '差'},
		{value: '8',text: '此项不适用'}
	],
	// 关锁
	gsList:[
		{value: '1',text: '无关锁'},
		{value: '2',text: '关锁'},
		{value: '4',text: '关锁已解除'}
	],
	// 一般检查
	tlConfig:['听见','听不清或无法听见'],
	exerciseConfig:['可顺利完成','无法独立完成任何一个动作'],
	// 实验室检查
	sysList:[
		{value: '1',text: '无'},
		{value: '2',text: '有'},
	],
	// 住院
	zyList:[
		{value: '1',text: '从未住院'},
		{value: '2',text: '正在住院'},
		{value: '4',text: '曾住院、现未住院'}
	],
	// 服药依从性
	fyycxList: [{value: '1',text: '规律'},
		{value: '2',text: '间断'},
		{value: '4',text: '不服药'},
		{value: '8',text: '勿需服药'}
	],
	// 药物不良反应
	fwblfyList:[
		{value: '1',text: '无'},
		{value: '2',text: '有'},
		{value: '4',text: '此项不适应'},
	],
	// 治疗效果
	zlxgList:[
		{value: '1',text: '痊愈'},
		{value: '2',text: '好转'},
		{value: '4',text: '无变化'},
		{value: '8',text: '加重'},
		{value: '16',text: '此项不适应'},
	],
	// 康复措施
	kfcsList:[
		{ text:'生活能力好转', value:'1'},
		{ text:'职业训练', value:'2'},
		{ text:'学习能力', value:'4'},
		{ text:'社会交往', value:'8'},
		{ text:'其他', value:'16'}
	],
	// 此次随访分类
	sfflList:[
		{value: '1',text: '不稳定'},
		{value: '2',text: '基本稳定'},
		{value: '4',text: '稳定'},
	],
	radioCss:{
		display: 'flex',
		flexWrap:'wrap',
	},
	// 下一步管理措施
	xybsfcsList:[
		{text:'常规随访',value:'1'},
		{text:'第1次控制不满意2周随访',value:'2'},
		{text:'两次控制不满意转诊随访',value:'4'},
		{text:'紧急转诊',value:'8'}
	],
	// 转诊
	zhzList:[
		{value: '1',text: '到位'},
		{value: '2',text: '不到位'},
	]
}