$(function (params) {
  var btn = $('#submit')
  var form = $('form')
  btn.click(function (check) {
    var arr = form.serializeArray()
    btn.prop( "disabled", true )
    var obj = {}
    for(var i = 0; i < arr.length; i++){
      var item = arr[i]
      if (item.name) {
        obj[item.name] = item.value
      }
    }
    if (
      !obj.title ||
      !obj.describe ||
      !obj.price ||
      !obj.auth ||
      !obj.wechat
    ) {
      alert('所有输入框均为必填')
      btn.prop( "disabled", false )
      return
    }
    $.ajax({
      method: 'post',
      url: '/rooms',
      data: obj,
      success: function (e) {
        console.log('posted')
        setTimeout(function () {
          window.location.href="/rooms"
        }, 0)
      },
      error: function(e) {
        if (e.status === 403) {
          alert('您可能没有权限,或者代号填写错误!')
        }
        if (e.status === 400) {
          alert('所有输入框均为必填')
        }
        btn.prop( "disabled", false )
      }
    })
    return false
  })
})