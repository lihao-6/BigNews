$(function () {
    // 点击"去注册账号"链接
    $('#link_reg').on('click', function () {
        $('.login-box').hide()
        $('.reg-box').show()
    })
    // 点击"去登录"链接
    $('#link_login').on('click', function () {
        $('.login-box').show()
        $('.reg-box').hide()
    })
    // 得到layUI的form对象
    let form = layui.form
    let layer = layui.layer
    form.verify({
        // 定义密码框验证规则
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        // 定义确认密码的规则
        repwd: function (value) {
            let pwd = $('.reg-box [name="password"]').val()
            if (pwd !== value) return '两次输入密码不一致'
        }
    })

    // 监听注册表单提交
    $('#reg_form').on('submit', function (e) {
        e.preventDefault()
        const inputParams = {
            username: $('#reg_form [name="username"]').val(),
            password: $('#reg_form [name = "password"]').val()
        }
        $.post('/api/reguser', inputParams, function (res) {
            if (res.status !== 0) {
                return layer.alert('注册失败: ' + res.message);
            }
            layer.alert('注册成功,请登录');
            $('#link_login').click()
        })
    })

    // 监听登录表单提交
    $('#login_form').submit(function (e) {
        e.preventDefault()
        $.ajax({
            type: 'POST',
            url: '/api/login',
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.alert(res.message)
                }
                layer.alert('登录成功')
                // 将登录成功得到的token字符串存储到本地
                localStorage.setItem('token', res.token)
                // 跳转到后台首页
                location.href = './index.html'
            }
        })
    })

})