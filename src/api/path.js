const path = {
  /**
   * 检测升级
   */
  upgrade: '/app/update',
  /**
   * 测试接口
   */
  testAPi: '/app/testApi',

  /**
   * 注册
   */
  register: '/user/register',

  /**
   * 登录相关接口
   */
  // 登录
  login: '/user/login',
  loginByAccount: '/login/web',
  /**
   * 用户相关API
   */
  // 根据Token获取用户信息
  getUserInfo: '/user/get_info',
  // 根据Token获取用户微信和手机号
  getUserTelAndWechatid: '/user/otherinfo',
  // 修改用户信息
  modifyUserInfo: '/user/modify',
  // 修改账户
  modifyAccount: '/user/account',
  // 修改账户密码
  modifyPwd: '/user/pwd',
  // 获取Account
  getAccount: '/user/account',
}

export default path
