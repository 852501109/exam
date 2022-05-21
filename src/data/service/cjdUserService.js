import myEnum from '@/data/utils/enum.js'
import myEntity from '@/data/utils/entity.js'
import $cjdUserDao from '@/data/dao/base/cjdUserDao.js'
import { reactive } from 'vue'
import $request from '@/utils/request/index'
const Download = function (url) {
  const dtask = plus.downloader.createDownload(
    url,
    {
      //本地路径开头使用file://，跟上手机文件本地目录storage/emulated/0，就是用户文件管理器能看到的了，之后我创建微垠作为文件夹，后缀是用于文件命名和格式修改，大家可以使用变量。
      filename: '_doc/custom/cutom.db', //利用保存路径，实现下载文件的重命名
    },
    function (d, status) {
      //d为下载的文件对象
      if (status == 200) {
        console.log(d.filename)
        //下载成功,d.filename是文件在保存在本地的相对路径，使用下面的API可转为平台绝对路径
        const fileSaveUrl = plus.io.convertLocalFileSystemURL(d.filename)
        // plus.runtime.openFile(d.filename) //选择软件打开文件
      } else {
        //下载失败
        console.log('下载失败')
        plus.downloader.clear() //清除下载任务
      }
    }
  )
  dtask.start()
}

/**
 * 初始化采集端用户
 * @param {*} callback
 */
function initCjdUserinfo(callback) {
  Download(
    'https://kunyuhealth.oss-cn-shanghai.aliyuncs.com/CLIENT/un/undefi/undefine/Question/202205131420/peis_history.db'
  )
  // uni.downloadFile({
  // url: 'https://kunyuhealth.oss-cn-shanghai.aliyuncs.com/CLIENT/un/undefi/undefine/Question/202205131420/peis_history.db', //仅为示例，并非真实的资源
  // success: (res) => {
  // 	if (res.statusCode === 200) {
  // 		console.log('下载成功');
  // 	}
  // 	let that = this;
  // 	uni.saveFile({
  // 		tempFilePath: res.tempFilePath,
  // 			success: function(red) {
  // 				that.luj = red.savedFilePath
  // 				console.log(red)
  // 			}
  // 		});
  // 	}
  // });
  //1.建表
  $cjdUserDao.createCjdUserinfo(res => {
    console.log(res)
  })
  //2.拉数据
  // todo:待封装
  const bean = reactive({
    username: 'zhangsan',
    password: '123',
    name: '张三',
    gender: '1',
    title: '主任医师',
    phone: '13212321231',
    qm_url: '不校验',
    user_permissions: '管理员',
  })

  $request.get('cjdUserinfo/getAll').then(res => {
    console.log(res)
  })

  //3.存数据
  $cjdUserDao.insertBean(bean, res => {
    console.log(res)
  })
}

/**
 * 采集端用户登陆
 * @param {用户对象} user
 * @param {返回值} callback
 */
function login(user, callback) {
  $cjdUserDao.getCjdUser(user, callback)
}
export default {
  initCjdUserinfo,
  login,
}
