$(function () {
    const PUBLISHSTATE = '已发布'
    const DRAFTSTATE = '草稿'
    let form = layui.form
    let layer = layui.layer
    // 调用函数初始化类别下拉选择框
    initCate()
    // 初始化富文本编辑器
    initEditor()

    // 1. 初始化图片裁剪器
    var $image = $('#image')
    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    // 3. 初始化裁剪区域
    $image.cropper(options)
    // 点击'选择封面'
    $('#chooseImg').on('click', function () {
        $('#choose_file').click()
    })
    $('#choose_file').on('change', function (e) {
        let filelist = e.target.files
        if (filelist.length === 0) {
            return
        }
        let imgUrl = URL.createObjectURL(filelist[0])
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', imgUrl)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    let state = PUBLISHSTATE // 设置文章默认状态为'已发布'
    $('#btn-draft').on('click', function () {
        state = DRAFTSTATE
    })

    // 点击'发布'
    $('#form-pub').on('submit', function (e) {
        e.preventDefault()
        let fd = new FormData($(this)[0])
        fd.append('state', state)
        // fd.forEach((value, key) => {
        //     console.log(key, value);
        // })
        // 将封面裁剪过后的图片，输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)
                // 发起 ajax 数据请求
                publishArticle(fd)
            })
    })

    // 封装函数-发表文章
    function publishArticle(fd) {
        $.ajax({
            type: 'POST',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                setTimeout(function () {
                    location.href = '/article/art_list.html'
                }, 500)
            }
        })
    }

    // 封装函数-初始化类别下拉选择框
    function initCate() {
        $.ajax({
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                $('#cateSelect').html(template('cateTemp', res))
                form.render()
            }
        })
    }


})