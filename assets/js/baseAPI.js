// ajaxPrefilter函数:预先处理ajax请求的选项参数
$.ajaxPrefilter(function (options) {
    // 发起ajax请求前,统一拼接请求的基地址(/根路径)
    options.url = 'http://ajax.frontend.itheima.net' + options.url
    // 统一为有权限的接口请求设置Authorization
    if (options.url.includes('/my')) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    // 全局挂载complete函数(请求成功或失败均会调用)
    options.complete = function (res) {
        const { status, message } = res.responseJSON
        if (status === 1 && message === '身份认证失败！') {
            localStorage.removeItem('token')
            location.href = './login.html'
        }
    }

}) 