$(function () {
    let layer = layui.layer
    let form = layui.form
    // 调用函数,初始化文章类别列表
    initArtCateList()

    let indexAdd = null
    // 点击'添加类别'按钮
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        })
    })
    // 监听'添加文章分类'表单的提交事件---->(事件委托)
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()
        $.ajax({
            type: 'post',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) return layer.msg(res.message)
                layer.msg(res.message)
                initArtCateList()
                // 根据layer.open方法返回的索引值关闭弹出框
                layer.close(indexAdd)
            }
        })
    })

    // 点击"编辑"按钮
    let indexEdit = null
    $('tbody').on('click', '.btn-edit', function () {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        })
        // 通过自定义属性获取当前数据对应的id值
        const id = $(this).data('id')
        $.ajax({
            url: '/my/article/cates/' + id,
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) return layer.msg(res.message)
                // 为弹出框表单赋值(提前在弹出框结构中添加隐藏域用以保存后续请求所需的Id值)
                form.val('form-edit', res.data)
            }
        })
    })
    // 监听'修改文章分类'的表单提交事件
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()
        $.ajax({
            type: 'post',
            url: '/my/article/updatecate',
            data: $('#form-edit').serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                layer.close(indexEdit)
                initArtCateList()
            }
        })
    })

    // 点击'删除'按钮
    $('body').on('click', '.btn-delete', function () {
        const id = $(this).data('id')
        layer.confirm('你真的确定要删除吗?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg(res.message)
                    layer.close(index)
                    initArtCateList()
                }
            })
        }, function () {
            layer.msg('点了删除又不删,在想啥')
        })
    })


    // 封装函数-初始化文章分类列表
    function initArtCateList() {
        $.ajax({
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 利用模板 引擎动态渲染页面
                $('tbody').html(template('artCate_Temp', res))
            }
        })
    }

})



