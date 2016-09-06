// 自定义radio和checkbox组件
// 依赖样式
// radio 单选
// checkbox 可多选,不选
define(['jquery'],function($){

    var Radio = {
        initRadio : function(opt){
            var _default = $.extend({
                item : '.mradio',
                data : [],
                isnull : true,
                cb : null
            },opt||{});

            $(_default.item).each(function(){
                //必须加上自定义的mradio
                if(!$(this).hasClass("mradio")){
                    $(this).addClass("mradio");
                }
                var isnull = _default.isnull;
                //绑定事件
                $(this).unbind('click');
                $(this).click(function(){
                    var isActive = $(this).hasClass("active");
                    if(isActive && isnull){
                        $(this).removeClass("active");
                        cb && cb( $(this).data('id') || '' );
                    }
                    else if(!isActive){
                        //让同级的其他控件失去焦点
                        $(this).parent().find(".mradio").removeClass("active");
                        $(this).addClass("active");
                        cb && cb( $(this).data('id') || '');
                    }
                });

            });
        },
        initCheckBox : function(opt){
            var _default = $.extend({
                item : '.mcheckbox',
                data : [],
                isnull : true,
                cb : null
            },opt||{});

            $(_default.item).each(function(){
                //必须加上自定义的mcheckbox
                if(!$(this).hasClass("mcheckbox")){
                    $(this).addClass("mcheckbox");
                }
                var isnull = _default.isnull;
                //绑定事件
                $(this).unbind('click');
                $(this).click(function(){
                    var isActive = $(this).hasClass("active");
                    if(isActive && isnull){
                        $(this).removeClass("active");
                        mcb();
                    }
                    else if(!isActive){
                        //让同级的其他控件失去焦点
                        $(this).addClass("active");
                        mcb();
                    }
                });
            });

            function mcb(){
                var cb = _default.cb;
                if(_default.data.length > 0){
                    return cb && cb(Radio.getCheckedValue(_default.item, _default.data));
                }
                return cb && cb(null);
            }
        },
        getCheckedValue : function(item,data){
            var result = [];
            $(item).each(function(){
                if($(this).hasClass('active')){
                    var id = $(this).data('id');
                    if(item = Radio.inArray(data, id)){
                        result.push(item);
                    }
                }
            });
            return result;
        },
        inArray : function(data,val, key){
            key = key || 'id';
            for(var i in data){
                if(data[i][key] == val){
                    return data[i];
                }
            }
            return false;
        }
    }


    return Radio;
});