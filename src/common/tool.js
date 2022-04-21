/*
 *  @ getNowTime  获取当前指定格式时间
 *  @ StringToArr 字符串转数组
 *  @ delArrIndex 数组删去某值
 *  @ idToInfor 身份证读取信息
 *
 */
function GetNowTime(fmt) {
  const timestamp = Date.parse(new Date())
  const date = new Date(timestamp)
  //获取年份
  const Y = date.getFullYear()
  //获取月份
  const M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
  //获取当日日期?
  const D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
  const todayDate = Y + fmt + M + fmt + D
  return todayDate
}

export function encodeQueryData(data) {
  const encode = false
  const ret = []
  for (const d in data) {
    if (encode) {
      ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]))
    } else {
      ret.push(d + '=' + data[d])
    }
  }
  return ret.join('&')
}

export function escapeUrl(source) {
  if (!source) {
    return null
  }
  const regex = /(\\)/gm
  const subst = `/`
  return source.replace(regex, subst)
}

export function formatDate(date) {
  if (!date) {
    return null
  }
  const d = new Date(date)
  let month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear()

  if (month.length < 2) {
    month = '0' + month
  }
  if (day.length < 2) {
    day = '0' + day
  }
  return year + '年' + month + '月' + day + '日'
}

export function getTabList(option, all) {
  const list = []
  if (option.hasGxy === 'true' || option.hasGxy === true) {
    list.push({
      id: 'GXY',
      title: '高血压',
    })
  }
  if (option.hasTnb === 'true' || option.hasGxy === true) {
    list.push({
      id: 'TNB',
      title: '糖尿病',
    })
  }
  if (option.hasGxz === 'true' || option.hasGxy === true) {
    list.push({
      id: 'GXZ',
      title: '血脂异常',
    })
  }
  if (all && list.length > 1) {
    list.unshift({
      id: 'ALL',
      title: '全部',
    })
  }
  return list
}

function StringToArr(string, mark) {
  const arr = []
  if (string && mark) {
    return string.split(mark)
  }
  return null
}

function delArrIndex(array, value) {
  if (Array.isArray(array)) {
    array.forEach((item, index) => {
      if (item == value) {
        array.splice(index, 1)
      }
    })
  }
}

function idToInfor(idCard) {
  const post = {}
  const date = new Date()
  const yearfull = date.getFullYear()
  if (idCard && idCard.length === 18) {
    const birth =
      idCard.substring(6, 10) + '-' + idCard.substring(10, 12) + '-' + idCard.substring(12, 14)
    // 获取出生日期
    post.birth = birth
    // 获取性别
    if (idCard.substr(16, 1) % 2 === 1) {
      post.gender = '男'
    } else {
      post.gender = '女'
    }
    // 获取年龄
    const myDate = new Date()
    const month = myDate.getMonth() + 1
    const day = myDate.getDate()
    let age = myDate.getFullYear() - idCard.substring(6, 10)
    if (
      idCard.substring(10, 12) < month ||
      (idCard.substring(10, 12) === month && idCard.substring(12, 14) <= day)
    ) {
      age++
    }
    post.age = age
  }
  if (idCard && idCard.length === 15) {
    // 获取年龄
    let birthDay = ''
    birthDay = idCard.substring(6, 12)
    birthDay = '19' + birthDay
    birthDay = birthDay.substring(0, 4) // + "-" + birthDay.substring(4, 6) + "-" + birthDay.substring(6)
    post.age = (yearfull - birthDay).toString() // 年龄
    // 获取出生日期
    post.birth = birthDay + '-' + idCard.substring(8, 10) + '-' + idCard.substring(10, 12)
    // 获取性别
    if (idCard.substr(15, 1) % 2 === 1) {
      post.gender = '男'
    } else {
      post.gender = '女'
    }
  }
  return post
}
// 验证电话号码
function telText(mobile) {
  const strTemp = /^1[3|4|5|6|7|8|9][0-9]{9}$/
  if (strTemp.test(mobile)) {
    return true
  }
  return false
}
// 孕产妇随访分发路由
function switchRouter(id, folId, idCard, name, cardId) {
  const qureyData = JSON.parse(JSON.stringify({}))
  qureyData.type = id
  qureyData.idCard = idCard
  qureyData.name = name
  qureyData.cardId = cardId
  qureyData.id = folId
  console.log('qureyData', qureyData)
  switch (id) {
    case 1:
      uni.redirectTo({
        url:
          '/pages/home/ycfVisit/newYcf13Visit/newYcf13Visit' +
          '?data=' +
          encodeURIComponent(JSON.stringify(qureyData)),
      })
      break
    case 2:
      uni.redirectTo({
        url:
          '/pages/home/ycfVisit/newYcf16Visit/newYcf16Visit' +
          '?data=' +
          encodeURIComponent(JSON.stringify(qureyData)),
      })
      break
    case 3:
      uni.redirectTo({
        url:
          '/pages/home/ycfVisit/newYcf16Visit/newYcf16Visit' +
          '?data=' +
          encodeURIComponent(JSON.stringify(qureyData)),
      })
      break
    case 4:
      uni.redirectTo({
        url:
          '/pages/home/ycfVisit/newYcf16Visit/newYcf16Visit' +
          '?data=' +
          encodeURIComponent(JSON.stringify(qureyData)),
      })
      break
    case 5:
      uni.redirectTo({
        url:
          '/pages/home/ycfVisit/newYcf16Visit/newYcf16Visit' +
          '?data=' +
          encodeURIComponent(JSON.stringify(qureyData)),
      })
      break
    case 6:
      uni.redirectTo({
        url:
          '/pages/home/ycfVisit/newYcf7Visit/newYcf7Visit' +
          '?data=' +
          encodeURIComponent(JSON.stringify(qureyData)),
      })
      break
    case 7:
      uni.redirectTo({
        url:
          '/pages/home/ycfVisit/newYcf7Visit/newYcf7Visit' +
          '?data=' +
          encodeURIComponent(JSON.stringify(qureyData)),
      })
      break
    default:
  }
}
// 儿童随访分发路由
function switchRouterEt(id, folId, idCard, name, cardId) {
  const qureyData = JSON.parse(JSON.stringify({}))
  qureyData.type = id
  qureyData.idCard = idCard
  qureyData.name = name
  qureyData.cardId = cardId
  qureyData.id = folId
  console.log('qureyData', qureyData)
  switch (id) {
    case 1:
      uni.navigateTo({
        url:
          '/pages/home/childrenVisit/newChildren1Visit/newChildren1Visit' +
          '?data=' +
          encodeURIComponent(JSON.stringify(qureyData)),
      })
      break
    case 2:
      uni.navigateTo({
        url:
          '/pages/home/childrenVisit/newChildren2Visit/newChildren2Visit' +
          '?data=' +
          encodeURIComponent(JSON.stringify(qureyData)),
      })
      break
    case 3:
      uni.navigateTo({
        url:
          '/pages/home/childrenVisit/newChildren2Visit/newChildren2Visit' +
          '?data=' +
          encodeURIComponent(JSON.stringify(qureyData)),
      })
      break
    case 4:
      uni.navigateTo({
        url:
          '/pages/home/childrenVisit/newChildren2Visit/newChildren2Visit' +
          '?data=' +
          encodeURIComponent(JSON.stringify(qureyData)),
      })
      break
    case 5:
      uni.navigateTo({
        url:
          '/pages/home/childrenVisit/newChildren2Visit/newChildren2Visit' +
          '?data=' +
          encodeURIComponent(JSON.stringify(qureyData)),
      })
      break
    case 6:
      uni.navigateTo({
        url:
          '/pages/home/childrenVisit/newChildren3Visit/newChildren3Visit' +
          '?data=' +
          encodeURIComponent(JSON.stringify(qureyData)),
      })
      break
    case 7:
      uni.navigateTo({
        url:
          '/pages/home/childrenVisit/newChildren3Visit/newChildren3Visit' +
          '?data=' +
          encodeURIComponent(JSON.stringify(qureyData)),
      })
      break
    case 8:
      uni.navigateTo({
        url:
          '/pages/home/childrenVisit/newChildren3Visit/newChildren3Visit' +
          '?data=' +
          encodeURIComponent(JSON.stringify(qureyData)),
      })
      break
    case 9:
      uni.navigateTo({
        url:
          '/pages/home/childrenVisit/newChildren3Visit/newChildren3Visit' +
          '?data=' +
          encodeURIComponent(JSON.stringify(qureyData)),
      })
      break
    case 10:
      uni.navigateTo({
        url:
          '/pages/home/childrenVisit/newChild4Visit/newChild4Visit' +
          '?data=' +
          encodeURIComponent(JSON.stringify(qureyData)),
      })
      break
    case 11:
      uni.navigateTo({
        url:
          '/pages/home/childrenVisit/newChild4Visit/newChild4Visit' +
          '?data=' +
          encodeURIComponent(JSON.stringify(qureyData)),
      })
      break
    case 12:
      uni.navigateTo({
        url:
          '/pages/home/childrenVisit/newChild4Visit/newChild4Visit' +
          '?data=' +
          encodeURIComponent(JSON.stringify(qureyData)),
      })
      break
    case 13:
      uni.navigateTo({
        url:
          '/pages/home/childrenVisit/newChild4Visit/newChild4Visit' +
          '?data=' +
          encodeURIComponent(JSON.stringify(qureyData)),
      })
      break
    default:
  }
}
//
function getName(type, arr) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].id == type) {
      return arr[i].name
    }
  }
}

// ArrayBuffer转16进度字符串示例
function ab2hex(buffer) {
  const hexArr = Array.prototype.map.call(new Uint8Array(buffer), function (bit) {
    return ('00' + bit.toString(16)).slice(-2)
  })
  return hexArr.join('')
}

// 解析NAIBOBO公司血压计蓝牙回传的日期数据
function parseDate(year, month, day, hour, minute, second) {
  return new Date(
    parseInt(year, 16) + 2000,
    parseInt(month, 16) - 1,
    parseInt(day, 16),
    parseInt(hour, 16),
    parseInt(minute, 16),
    parseInt(second, 16)
  )
}

// API的Promise化
function promisify(callback) {
  return (object = {}) => {
    return new Promise((resolve, reject) => {
      object.success = (...args) => {
        resolve(...args)
      }
      object.fail = (...args) => {
        reject(...args)
      }
      object.complete = () => {}
      callback(object)
    })
  }
}
//将URL使用backslash转码
function backslash(text) {
  return text
}

// 网络路径转base64
function toBase64(url) {
  return new Promise((resolve, reject) => {
    uni.request({
      url: url,
      method: 'GET',
      dataType: 'arraybuffer',
      responseType: 'arraybuffer', // 一定要设置为二进制的模式
      success: res => {
        const arrayBuffer = new Uint8Array(res.data)
        // const base64 = "data:image/png;base64," + uni.arrayBufferToBase64(arrayBuffer)
        const base64 = uni.arrayBufferToBase64(arrayBuffer)
        resolve(base64)
      },
    })
  })
}

function getArray(input) {
  if (typeof input === 'string') {
    if (input[0] === '[') {
      const arr = JSON.parse(input)
      if (arr[0] === '') {
        return []
      }
      return arr
    }
    return [parseInt(input)]
  } else if (typeof input === 'number') {
    return [input]
  } else if (input === null) {
    return []
  }
}

const throttle = (func, limit) => {
  let inThrottle
  return function () {
    const args = arguments
    const context = this
    if (!inThrottle) {
      func.apply(context, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

export {
  GetNowTime,
  StringToArr,
  idToInfor,
  telText,
  switchRouter,
  getName,
  switchRouterEt,
  ab2hex,
  parseDate,
  promisify,
  backslash,
  getArray,
  throttle,
  toBase64,
}
