$(function () {
    // 调用getUserInfo,获取用户基本信息
    getUserInfo()

    // 点击顶部"退出"按钮
    $('#btnLogOut').on('click', function () {
        layui.layer.confirm('您确定要退出登录吗?', { icon: 3, title: '提示' }, function (index) {
            // 清空本地存储的token
            localStorage.removeItem('token')
            // 跳转至登录页面
            location.href = './login.html'
            layer.close(index);
        })
    })

})

// 定义函数getUserInfo, 获取用户基本信息
function getUserInfo() {
    // 一进入后台主页即刻发起ajax请求获取用户基本信息
    $.ajax({
        url: '/my/userinfo',
        // headers: { Authorization: localStorage.getItem('token') || '' },
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg(res.message)
            }
            // 调用renderAvatar函数渲染用户头像
            renderAvatar(res.data)
        }
        // complete: function (res) {
        //     const { status, message } = res.responseJSON
        //     if (status === 1 && message === '身份认证失败！') {
        //         localStorage.removeItem('token')
        //         location.href = './login.html'
        //     }
        // }
    })
}

function renderAvatar(userData) {
    const name = userData.nickname || userData.username
    $('#welcome').html(`欢迎&nbsp;&nbsp;${name}`)
    if (!userData.user_pic) {
        $('.layui-nav-img').hide()
        const first = name[0].toUpperCase()
        $('.text_avatar').html(first).show()
    } else {
        $('.layui-nav-img').attr('src', userData.user_pic).show()
        $('.text_avatar').hide()
    }

}