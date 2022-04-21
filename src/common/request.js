const platform = uni.getSystemInfoSync().platform

let base_url
if (platform === 'ios') {
  base_url = 'https://www.kunyuhealth.com:7880/zhineng'
} else {
  // base_url = 'http://192.168.1.29:60994'
  base_url = 'http://106.14.65.251:60994'
}

export default {
  config: {
    baseUrl: base_url,
    headers: {
      'content-type': 'application/json',
      Authorization: '',
      //"content-type": "multipart/form-data",
    },
    dataType: 'json',
    responseType: 'text',
  },
  interceptor: {
    request: function (_config) {},
    response: null,
  },
  request(options) {
    // uni.showLoading({
    // 	title: "加载中",
    // 	mask: true,
    // });
    return new Promise((resolve, reject) => {
      let _config = null
      options.url = this.config.baseUrl + options.url
      if (uni.getStorageSync('token')) {
        // options.data["Authorization"] = uni.getStorageSync('token')
        options.header.token = uni.getStorageSync('token') || ''
      } else {
        console.log('token为空')
        if (!getCurrentPages().route == 'pages/login/index') {
          uni.reLaunch({
            url: '/pages/login/index',
          })
        }
      }
      //console.log(options.header)
      options.header = Object.assign(this.config.headers, options.header)
      options.fail = response => {
        uni.showToast({
          icon: 'none',
          title: '网络连接失败,请检查网络',
        })
        reject(response)
      }
      options.complete = response => {
        response.config = _config
        if (response.statusCode === 200 || response.statusCode === 201) {
          //成功
          resolve(response.data)
        } else {
          if (response.statusCode === 404) {
            uni.showToast({
              icon: 'none',
              title: '接口不存在',
            })
          }
          if (response.statusCode === 500) {
            console.log(response)
            uni.showToast({
              icon: 'none',
              title: '服务器错误',
            })
          }
          reject(response)
        }
      }
      _config = Object.assign({}, this.config, options)
      _config.requestId = new Date().getTime()

      if (this.interceptor.request) {
        this.interceptor.request(_config)
      }

      uni.request(_config)
    })
  },
  get(url, data, showtips, options) {
    data = data ? data : {}
    if (!options) {
      options = {}
    }
    options.url = url
    options.data = data
    options.header = {}
    options.method = 'GET'
    options.showtips = showtips
    return this.request(options)
  },
  post(url, data, showtips, options) {
    data = data ? data : {}
    if (!options) {
      options = {}
    }
    options.url = url
    options.data = data
    options.header = {}
    options.method = 'POST'
    options.showtips = showtips
    return this.request(options)
  },
  put(url, data, showtips, options) {
    if (!options) {
      options = {}
    }
    options.url = url
    options.data = data
    options.method = 'PUT'
    options.showtips = showtips
    return this.request(options)
  },
  del(url, data, showtips, options) {
    if (!options) {
      options = {}
    }
    options.url = url
    options.data = data
    options.showtips = showtips
    options.method = 'DELETE'
    return this.request(options)
  },
}
