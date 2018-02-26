Vue.filter('year', function (value) {
    if (!value) return '';
          var data = new Date(Number(value))
          return data.getFullYear();
  })
  Vue.filter('month', function (value) {
    if (!value) return '';
          var data = new Date(Number(value))
          return data.getMonth()+1;
  })
  Vue.filter('day', function (value) {
    if (!value) return '';
          var data = new Date(Number(value))
          return data.getDate();
  })
  Vue.filter('hour', function (value) {
    if (!value) return '';
          var data = new Date(Number(value))
          return data.getHours();
  })
  Vue.filter('minutes', function (value) {
    if (!value) return '';
          var data = new Date(Number(value))
          return data.getMinutes();
  })
  Vue.filter('addzero', function (value) {
    if (!value) return '';
    var num = value<10?'0'+value:value;
    return num;
  })
