module.exports = {
    user : {
        delete:'该用户已经被关联',
        unique:'该用户名已经存在'
    },
    template : {
        'catalog_id' : {
            required : {val:true,message:'模板类别不能为空'}
        },
        'content' : {
            required : {val:true,message:'模板内容不能为空'}
        },
        'description' : {
            required : {val:true,message:'描述不能为空'}
        },
        'lang' : {
            required : {val : true,message:'模板语言不能为空'}
        },
        'compress' : {
            required : {val : false,message:'是否去掉空行必须选择'}
        }
    }
}