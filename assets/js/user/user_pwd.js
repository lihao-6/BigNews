$(function () {
    let form = layui.form
    let layer = layui.layer
    // 定义表单验证规则
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须是6-12位,且不能出现空格'],
        samePwd: function (value) {
            if (value === $('[name="oldPwd"]').val()) {
                return '新密码不能和旧密码一致'
            }
        },
        rePwd: function (value) {
            if (value !== $('[name="newPwd"]').val()) {
                return '两次新密码输入不一致'
            }
        }
    })
    // 监听表单提交事件
    $('.layui-form').on('submit', function (e) {
        e.preventDefault()
        const inputParams = form.val('formPwd')
        delete inputParams.rePwd
        $.ajax({
            type: 'POST',
            url: '/my/updatepwd',
            data: inputParams,
            success: function (res) {
                if (res.status !== 0) return layer.msg(res.message)
                layer.msg(res.message)
                // 重置(/清空)表单---原生dom方法
                $('.layui-form')[0].reset()
            }
        })
    })

})