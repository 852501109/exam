export default {
  // 显示隐藏参数
  listShow: {
    jbxx: true,
    zz: false,
    tz: false,
    shzd: false,
    fzjc: false,
    fyycx: false,
    mqyyqk: false,
    yytzyj: false,
    ydssyqk: false,
    ydssyqktz: false,
    ywblfy: false,
    dxtfay: false,
    ccsffl: false,
    xybglcs: false,
    zzhen: false,
    sfxx: false,
    jkzdyj: false,
    zhuanzhen: false,
    hzjsgld: false,
  },
  // 基本信息
  array: ['门诊', '家庭', '电话'],

  // 症状
  zzList: [
    // { text:'无症状', value:'0' },
    // { text:'头痛头晕', value:'1'},
    // { text:'恶心呕吐', value:'2'},
    // { text:'眼花耳鸣', value:'3'},
    // { text:'呼吸困难', value:'4'},
    // { text:'心悸胸闷',value:'5'},
    // { text:'鼻衄出血不止', value:'6'},
    // { text:'四肢发麻', value:'7'},
    // { text:'下肢浮肿', value:'8'},
    // { text:'其他', value:'9'}
    { text: '无症状', value: '1' },
    { text: '多饮', value: '2' },
    { text: '多食', value: '3' },
    { text: '多尿', value: '4' },
    { text: '视力模糊', value: '5' },
    { text: '感染', value: '6' },
    { text: '手脚麻木', value: '7' },
    { text: '下肢浮肿', value: '8' },
    { text: '体重明显下', value: '9' },
    { text: '其他', value: '10' },
  ],
  // 体征
  zbdmbdList: [
    { text: '触及正常', value: '1' },
    { text: '减弱', value: '2' },
    { text: '消失', value: '3' },
  ],
  zbdm_mo: [
    { text: '双侧', value: '1' },
    { text: '左侧', value: '2' },
    { text: '右侧', value: '3' },
  ],
  // 生活指导
  syArray: ['轻', '中', '重'],
  syAimArray: ['轻', '中'],
  xlArray: ['良好', '一般', '差'],

  // 辅助检查

  // 目前用药情况

  // 用药调整意见

  // 胰岛素使用情况

  // 服药依从性
  fyycxList: [
    { value: '1', text: '规律' },
    { value: '2', text: '间断' },
    { value: '3', text: '不服药' },
  ],
  radioCss: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  // 药物不良反应

  // 下一步管理措施
  xybsfcsList: [
    { text: '常规随访', value: '1' },
    { text: '第1次控制不满意2周随访', value: '2' },
    { text: '两次控制不满意转诊随访', value: '3' },
    { text: '紧急转诊', value: '4' },
  ],
  // 患者接受管理度
  hzjsgldList: [
    { text: '完全接受', value: '1' },
    { text: '勉强接受', value: '2' },
    { text: '不接受', value: '3' },
  ],
  // 转诊
  zhzList: [
    { value: '1', text: '到位' },
    { value: '2', text: '不到位' },
  ],
}
