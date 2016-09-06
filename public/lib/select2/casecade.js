//JavaScript Document
//李敏强  js级联下拉

define(['jquery','mselect2'],function($,mselect2){
    var CasecadeSelect = {
        init : function(opts){
            var settings = $.extend({
                length : 2,
                ids : [],
                urls : [],
                defaultMsgs : ['','',''],
                checked : [],
                triggerDepth : 2,
                cb : null
            },opts||{});
            var isInit = false;
            var len = settings.length;
            var default1 = $(settings.ids[0]).data('default');
            if(default1){
                settings.checked[0] = default1;
                settings.checked[1] = $(settings.ids[1]).data('default');
                if(len==3){
                    settings.checked[2] = $(settings.ids[2]).data('default');
                }
            }
            var checkedLen = settings.checked.length;
            //初始化1
            this.post(settings.urls[0],null,function(data){
                mselect2.renderDataAndBind(settings.ids[0],data,function(val){
                    if(val<=0){
                        mselect2.clear(settings.ids[1]);
                        return;
                    }
                    CasecadeSelect.post(settings.urls[1],{'val' : val},function(data){
                        var msg = settings.defaultMsgs[1];
                        if(msg !== ''){
                            data = mselect2.getDefault(msg,data);
                        }
                        mselect2.renderData(settings.ids[1], data)

                        if(!isInit && checkedLen > 0){
                            mselect2.val(settings.ids[1], settings.checked[1]);
                            if(len == 2){
                                isInit = true
                            }
                        }
                        //mselect2.triggerChange(settings.ids[1]);
                    });
                });

                if(checkedLen>0){
                    mselect2.val(settings.ids[0], settings.checked[0]);
                    // mselect2.triggerChange(settings.ids[0]);
                    console.log("trigger 1")
                }
            });

            //初始化2
            mselect2.renderAndBind(settings.ids[1],function(val){
                console.log("trigger 2")
                if(len == 2){
                    mcb();
                }
                else{
                    if(val<=0){
                        mselect2.clear(settings.ids[2]);
                        return;
                    }
                    CasecadeSelect.post(settings.urls[2],{'val':val}, function(data){
                        var msg = settings.defaultMsgs[2];
                        if(msg !== ''){
                            data = mselect2.getDefault(msg,data);
                        }
                        mselect2.renderData(settings.ids[2],data);
                        if(!isInit && checkedLen > 0){
                            mselect2.val(settings.ids[2], settings.checked[2]);
                            if(len == 3){
                                isInit = true
                            }
                        }
                        //mselect2.triggerChange(settings.ids[2]);
                    });
                }
            });

            //初始化3
            if(len >= 3){
                mselect2.renderAndBind(settings.ids[2], function(){
                    if(len == 3){
                        mcb();
                    }
                    console.log("trigger 3")
                });
            }

            function mcb(){
                var triggerDepth = settings.triggerDepth;
                if(triggerDepth == 'all' || triggerDepth == 0){
                    settings.cb && settings.cb(settings.ids);
                }
                else{
                    var val = $(settings.ids[settings.length-1]).val();
                    console.log(val);
                    if(val != '' && val != null){
                        settings.cb && settings.cb(val);
                    }
                }
            }
        },
        post : function(url,data,cb){
            $.ajax({
                'url' : url,
                'type' : 'post',
                'data' : data,
                'success' : function(e){
                    cb && cb(e.data);
                }
            })
        }
    }
    return CasecadeSelect;
});
