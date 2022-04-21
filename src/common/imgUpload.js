/**
 * @description
 * @param {Object} options
 */
const ImageTool = (function (mui) {
  const options = {
    uploadUrl: '', //图片上传地址
    autoUpload: false, //默认不上传
    isZoom: true, //默认通过native.js压缩
    ZoomBox: 576, //缩放宽高，默认800px,横图缩放宽度，高度根据比例计算，同理竖图
    ZoomQuality: 100, //压缩图片的质量
    offsetDays: undefined, //照片拍摄的日期跟今日的差值
    success: function () {},
    error: function () {},
  }

  // 构造函数初始赋值
  const _init = function (opt) {
    for (const o in opt) {
      if (options.hasOwnProperty(o)) {
        options[o] = opt[o]
      }
    }
  }

  // 本地选择图片
  const galleryImgs = function () {
    plus.gallery.pick(
      function (p) {
        plus.io.resolveLocalFileSystemURL(p, function (DirectoryEntry) {
          //console.dir(DirectoryEntry)
          const infor = DirectoryEntry.getMetadata(
            function (metadata) {
              const subtractDays = Math.floor(
                (new Date().getTime() - new Date(metadata.modificationTime).getTime()) /
                  (1000 * 3600 * 24)
              )
              //console.log(subtractDays)
              if (typeof options.offsetDays !== undefined && subtractDays > options.offsetDays) {
                mui.toast('选取的照片拍摄日期过长，请重新选择。')
                return false
              }
              rotateImg(p)
            },
            function (err) {
              console.log('读取照片失败', err)
            },
            true
          )
        })
      },
      function (error) {
        sys_permission(error)
        options.error(error)
      },
      {
        filter: 'image',
        system: false,
      }
    )
  }

  /**
   * @description 手机拍照并压缩(上传)
   * @param {Object} cb(err,files)
   * @param {Object} err
   */
  function camera() {
    plus.camera.getCamera().captureImage(
      function (p) {
        rotateImg(p)
      },
      function (err) {
        //未测拍照权限 err.code
        console.log('失败：' + err.message)
        options.error(err)
      },
      {}
    )
  }

  /**
   * @description 压缩并上传图片单独拎出来，拍照也可用到
   * @param {Object} pic
   * @param {Object} next
   **/
  function rotateImg(path) {
    console.log(path)
    if (path.indexOf('http') < 0) {
      plus.nativeUI.showWaiting('图片处理中，请耐心等待...')
      //不覆盖原图：兼容部分机型，如oppo vivo
      const newPath = '_downloads/' + +new Date() + path.substr(path.lastIndexOf('.'))
      // console.log(newPath)
      plus.zip.compressImage(
        {
          src: path,
          dst: newPath,
          quality: options.ZoomQuality,
          overwrite: true,
          rotate: 0, // 不管有没有被旋转，统一旋转0度
        },
        function (e) {
          if (mui.os.ios) {
            // 此处IOS需做路径转换处理，在转换时利用文件对象再去转base64，而安卓则直接可以用路径去加载文件
            plus.io.resolveLocalFileSystemURL(e.target, function (entry) {
              entry.file(function (path) {
                console.log('P__' + JSON.stringify(e.target))
                //如果立即上传则开始上传，否则返回base64
                if (options.autoUpload) {
                  imgUploadCom(e.target)
                } else {
                  getBase64(path, e.target)
                }
              })
            })
          } else {
            //如果立即上传则开始上传，否则返回base64
            if (options.autoUpload) {
              imgUploadCom(e.target)
            } else {
              getBase64(e.target, e.target)
            }
          }
        },
        function (error) {
          options.error(error)
          console.log('图片旋转时发生错误!')
        }
      )
    } else {
      options.success(p)
    }
  }

  function getBase64(path, url) {
    // 获取Base64
    const reader = new plus.io.FileReader() // 构建文件对象
    reader.readAsDataURL(path) // 添加文件（此处安卓可以直接添加文件路径，而IOS则需要文件对象）
    reader.onloadend = function (event) {
      // 文件加载 完成后的事件回调
      //console.log(url + "::" + event.target.result);
      options.success(url, event.target.result) // 执行成功函数，统一把路径及base64传过去
      plus.nativeUI.closeWaiting()
    }
  }

  /**
   * @description 打开相册失败，请求系统权限
   * @param {Error} e
   */
  function sys_permission(e) {
    if (mui.os.ios) {
      if (e.code == 8) {
        mui.alert('您的相册权限未打开，请在当前应用设置-隐私-相册来开打次权限', function () {
          plus.runtime.openURL('prefs:root=Privacy')
        })
      }
    } else if (e.code != 12) {
      mui.alert('您的相册权限未打开，请在应用列表中找到您的程序，将您的权限打开', function () {
        const android = plus.android.importClass('com.android.settings')
        const main = plus.android.runtimeMainActivity()
        const Intent = plus.android.importClass('android.content.Intent')
        const mIntent = new Intent('android.settings.APPLICATION_SETTINGS')
        main.startActivity(mIntent)
      })
    }
  }

  /**
   * @description 上传图片带参数
   * @param {Object} path
   * @param {Object} cb
   */
  function imgUploadCom(path) {
    const uploadUrl = options.uploadUrl
    const task = plus.uploader.createUpload(
      uploadUrl,
      {
        method: 'POST',
        timeout: 10, //超时时间 10s
      },
      function (t, status) {
        if (status == 200) {
          //上传成功后后台返回的数据格式规范为{ret:true,url:'网络链接'}
          const res = JSON.parse(t.responseText)
          // console.log(JSON.stringify(res));
          if (res.ret) {
            options.success(res.data)
          } else {
            options.error(res.msg)
          }
        } else {
          options.error('网络连接失败！')
        }
        plus.nativeUI.closeWaiting()
      }
    )
    task.addFile(path, { key: 'file' })
    task.addData('client', 'app')
    task.setRequestHeader('Token', getState().Token)
    task.start()
  }

  const ImgToolFunc = function (options) {
    _init(options)
  }
  ImgToolFunc.prototype.galleryImgs = galleryImgs
  ImgToolFunc.prototype.camera = camera
  return ImgToolFunc
})(mui)
