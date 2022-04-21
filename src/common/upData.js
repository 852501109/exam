//系统自动升级
function downApk(url) {
  console.log('下周包')
  const downTask = plus.downloader.createDownload(
    url, //下载地址
    {
      method: 'GET',
      data: {},
      retry: 1,
      retryInterval: 10,
    },
    function (d, status) {
      //下载成功事件
      if (status == 200) {
        //安装应用
        installAPK(d.filename)
      }
    }
  )
  let win
  downTask.addEventListener('statechanged', function (task, status) {
    let timer = 0
    switch (task.state) {
      case 1:
        console.info('请求连接')
        break
      case 2:
        console.info('获取链接')
        win = plus.nativeUI.showWaiting('获取链接')
        break
      case 3:
        timer = parseInt((parseFloat(task.downloadedSize) / parseFloat(task.totalSize)) * 100)
        if (timer % 10 == 0) {
          win.setTitle('已下载 ' + timer + '%')
        }
        break
      case 4:
        console.info('下载完成 ')
        plus.nativeUI.closeWaiting()
        break
    }
  })
  downTask.start()
}
function installAPK(filePath) {
  plus.runtime.install(
    filePath,
    {
      force: false, //强制安装
    },
    function (app) {
      //安装成功
      plus.runtime.restart()
    },
    function (e) {
      //安装失败
      console.log('安装文件失败[' + e.code + ']：' + e.message)
    }
  )
}

export { downApk }
