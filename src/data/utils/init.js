import $ws from '@/data/utils/ws.js'
import $sqliteUtils from '@/data/utils/sqliteUtils.js'
/**
 * 下载db文件流程
 */
function download(url, path) {
  // 先清除原有文件
  const filePath = '_doc/peis_base.db'
  clearFile(url, filePath)
}
/**
 * ws初始化
 */
function initWs() {
  $ws.openWs(res => {
    console.log(res)
  })
}
/**
 * 删除db文件
 */
function clearFile(url, db_url) {
  plus.io.resolveLocalFileSystemURL(
    db_url,
    function (entry) {
      entry.remove()
      downloadStart(url, db_url)
    },
    function (err) {
      console.log(url, db_url)
      downloadStart(url, db_url)
    }
  )
}
/**
 * 开始下载db文件
 */
function downloadStart(url, file) {
  const dtask = plus.downloader.createDownload(
    url,
    {
      filename: file,
    },
    function (d, status) {
      if (status === 200) {
        const fileSaveUrl = plus.io.convertLocalFileSystemURL(d.filename)
        $sqliteUtils.openDB('peis_base', res => {
          $sqliteUtils.getAllTable('peis_base', res => {})
        })
      } else {
        plus.downloader.clear()
      }
    }
  )
  dtask.start()
}
export default {
  download,
  initWs,
}
