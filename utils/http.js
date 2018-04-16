var url = 'http://192.168.31.212/Laravel-Shop/trunk/public/api/'
// var url = 'http://192.168.31.62/Laravel-Shop/trunk/public/api/'
// var url = 'http://api.weieryingoa.top/api/'
// var url = 'https://api.lara-shop.cn/api/'
// var url = 'http://api.lara-shop.cn/api/'


//封装请求
function req (api,data,then) {
  wx.request({
    url: url + api,
    method: 'POST',
    data: dataString(data),
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      return typeof then == 'function' && then(res.data)
    },
    fail:function(res){
      return typeof then == 'function' && then(res)
    }
  })
}

//封装数据
function dataString(data){
  var dataStr = '';
  for (var i in data) {
    if (typeof data[i] === 'object') { // 若为对象转化为字符串
      data[i] = JSON.stringify(data[i])
    }
    if (data[i] === undefined || data[i] === null) { // 若为undefind改为''
      data[i] = ''
    }
    dataStr += i + '=' + data[i] + '&'
  }
  dataStr = dataStr.replace(/<script>/g, '');
  return dataStr.substring(0, dataStr.length - 1)
}

function dataString(data){
  var dataStr = '';
  for (var i in data) {
    if (typeof data[i] === 'object') { // 若为对象转化为字符串
      data[i] = JSON.stringify(data[i])
    }
    if (data[i] === undefined || data[i] === null) { // 若为undefind改为''
      data[i] = ''
    }
    dataStr += i + '=' + data[i] + '&'
  }
  dataStr = dataStr.replace(/<script>/g, '');
  return dataStr.substring(0, dataStr.length - 1)
}


module.exports = {req}