$(function () {
    let form = layui.form
    let layer = layui.layer
    let laypage = layui.laypage
    // 定义查询参数对象(根据后台接口)
    let q = {
        pagenum: 1, // 当前页码值
        pagesize: 3, // 每页显示的数量
        cate_id: '',  // 类别id
        state: ''  // '已发布/草稿'
    }
    // 初始化文章列表
    initArtList()
    // 通过 template.defaults.imports 定义过滤器,美化时间格式
    template.defaults.imports.dateFormat = function (date) {
        const dt = new Date(date)
        let y = dt.getFullYear()
        let m = padZero(dt.getMonth() + 1)
        let d = padZero(dt.getDate())
        let hh = padZero(dt.getHours())
        let mm = padZero(dt.getMinutes())
        let ss = padZero(dt.getSeconds())
        return '' + y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss + ''
    }

    // 初始化'所有分类'下拉选择框
    $.ajax({
        url: '/my/article/cates',
        success: function (res) {
            if (res.status === 0) {
                const htmlStr = template('cateSelect', res)
                // console.log(htmlStr);
                $('#cate-select').html(htmlStr)
                form.render() // 因为layui的加载机制原因,必须加这句代码才能渲染
            } else {
                layer.msg(res.message)
            }
        }
    })

    // 监听筛选表单的提交事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        let cate_id = $('#cate-select').val()
        let state = $('[name="state"]').val()
        q.cate_id = cate_id
        q.state = state
        // console.log(q);
        initArtList()
    })

    // 删除文章
    $('tbody').on('click', '.btn-delete', function () {
        let id = $(this).data('id')
        let btnDel_length = $('.btn-delete').length
        layer.confirm('你确定要删除吗?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return res.msg(res.message)
                    }
                    layer.msg(res.message)
                    if (btnDel_length === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initArtList()
                    layer.close(index)
                }
            })
        }, function () {
            layer.msg('咋犹豫了?')
        })
    })



    // 补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    // 封装函数-初始化文章列表
    function initArtList() {
        $.ajax({
            url: '/my/article/list',
            data: q,
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 模板引擎渲染文章列表数据
                $('tbody').html(template('artlist', res))
                // 调用渲染分页的函数
                renderPage(res.total)
            }
        })
    }

    //封装函数-渲染分页结构
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox', // 指向存放分页的容器
            count: total,  // 总条数
            limit: q.pagesize, // 每页显示的条数
            curr: q.pagenum, // 默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 4, 5, 6],
            theme: '#ff3040',
            jump: function (obj, first) {
                // console.log(first); // 是否首次(布尔值)，如果是首次则不调用初始化文章列表的函数
                // console.log('当前页码: ' + obj.curr);
                // console.log('当前每页显示条数: ' + obj.limit);
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                if (!first) {
                    initArtList()
                }
            }
        });
    }

})