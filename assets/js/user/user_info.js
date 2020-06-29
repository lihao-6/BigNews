$(function () {
    let form = layui.form
    let layer = layui.layer
    form.verify({
        // 昵称的验证规则
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度必须在1~6个字符之间'
            }
        }
    })

    initUserInfo()
    // 定义初始化用户基本信息的函数
    function initUserInfo() {
        $.ajax({
            url: '/my/userinfo',
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 给表单元素赋值
                form.val('formUserInfo', res.data)
            }
        })
    }
    // 点击"重置"按钮
    $('#btnReset').on('click', function (e) {
        e.preventDefault()
        initUserInfo()
    })
    // 监听表单提交事件
    $('.layui-form').on('submit', function (e) {
        e.preventDefault()
        let data = form.val('formUserInfo')
        delete data.username // 删除username属性
        $.ajax({
            type: 'POST',
            url: '/my/userinfo',
            data: form.val('formUserInfo'),
            success: function (res) {
                if (res.status !== 0) return layer.msg(res.message)
                layer.msg(res.message)
                window.parent.getUserInfo()
            }

        })
    })


})