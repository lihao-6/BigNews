// ajaxPrefilter函数:预先处理ajax请求的选项参数
$.ajaxPrefilter(function (options) {
    // 发起ajax请求前,统一拼接请求的基地址(/根路径)
    options.url = 'http://ajax.frontend.itheima.net' + options.url
}) 