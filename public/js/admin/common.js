//admin通用处理
define(['jquery', 'util', 'mtemplate', 'mselect2','toputil','dialog','message','frame'], function($, util, mtemplate,mselect2,toputil){
    var common = {
        generateSearch : function(searchParam, page){
            if(typeof page == 'number'){
                searchParam.page = page;
            }
            else{
                searchParam.page = 1
            }
            var targets = $(".search_section").find("[name]");
            var len = targets.length;
            for(var i=0;i<len;i++){
                var item = targets.eq(i);
                var tag = item.get(0).tagName.toLowerCase();
                if(tag == "select"){
                    searchParam[item.attr('name')] = mselect2.value('#'+item.attr('id'));
                }
                else if(tag == "input"){
                    searchParam[item.attr('name')] = item.val();
                }
            }
            console.log(searchParam)
            return searchParam;
        },
        bindA : function(model){
            $("#aBtn").click(function(){
                util.clearForm('#aForm');
                common.setAdd();
                model.beforeAdd && model.beforeAdd();
                common.showOperation();
            });
            $("#bClose").click(function(){
                common.showPage();
            });
            $("#keyword").on('change',function(){
                common.search(model);
            });

            $("#sSubmit").click(function(){
                common.search(model);
            });
        },
        setAdd : function(){
            $("#aSubmit").data('operation', 'add');
        },
        setUpdate : function(){
            $("#aSubmit").data('operation', 'update');
        },
        removeOperation : function(){
            $("#aSubmit").data('operation', 'none');
        },
        showPage: function(){
            $("#page_add").css("z-index",-1).hide();
            $("#page_list").css("z-index",1).show();    
        },
        showOperation: function(){
            toputil.totop(50);
            $("#page_list").css("z-index",-1).hide();
            $("#page_add").css("z-index",1).show();    
        },
        bindS : function(model){
            $("#aSubmit").click(function(){
                var operation = $("#aSubmit").data('operation');
                if(operation == "add"){
                    var param = util.form2param("#aForm");
                    util.post(model.config.url.add, param,function(){
                        $.success("添加成功");
                        common.showPage();
                        common.search(model);
                        common.removeOperation();
                        model.redoSelect && model.redoSelect();
                        model.afterAdd && model.afterAdd();
                    });
                }
                else if(operation == "update"){
                    var param = util.form2param("#aForm");
                    util.post(model.config.url.update, param,function(){
                        $.success("更新成功");
                        common.showPage();
                        common.reload(model);
                        common.removeOperation();
                        model.redoSelect && model.redoSelect();
                        model.afterUpdate && model.afterUpdate();
                    });
                }
                else{
                    $.error("非法操作");
                }
            });
            
        },
        bindU : function(model){
            $(".item_update").each(function(){
                $(this).unbind("click")
                $(this).click(function(){
                    //set form
                    var id = $(this).data('id');
                    var data = common.getById(model,id);
                    if(data == null){
                        $.error("系统错误，刷新页面试试");
                        return;
                    }
                    common.setUpdate();

                    util.assignForm('#aForm', data);

                    model.beforeUpdate && model.beforeUpdate(data);
                    //open form
                    common.showOperation();
                });
            });
        },
        bindD : function(model,cb){
            $(".item_delete").each(function(){
                $(this).unbind("click");
                $(this).click(function(){
                    var id = $(this).data('id');
                    $.showConfirm("确定要删除该记录吗?",function(){
                        util.post(model.config.url.delete,{id:id}, function(){
                            $.success("删除成功");
                            common.reload(model);
                            cb && cb();
                            model.redoSelect && model.redoSelect();
                            model.afterDelete && model.afterDelete();
                        });
                    });
                });
            });
        },
        searchPage : function(model,searchParam,renderDefault,cb){
            renderDefault = renderDefault || 1;
            //分页查询
            util.jax({
                'url' : '/data/'+model.config.model+'/pageQuery',
                'type' : 'post',
                'data' : searchParam,
                'cb' : function(data){
                    var pager = window.pager;
                    if(data.total == 0){
                        model.pageData = [];
                        if(renderDefault){
                            common.renderPage([]); //自动渲染
                        }
                        else{
                            model['renderPageData']([]); //人工渲染
                        }
                        $("#pagination").show();
                        pager.showNullMsg();
                    }
                    else{
                        var page = data.page;
                        model.pageData = data.data;
                        if(renderDefault){
                            common.renderPage(data.data,cb); //自动渲染
                        }
                        else{
                            model['renderPageData'](data.data); //人工渲染
                        }
                        pager.setTotal(data.total);
                        pager.setPageSize(data.pageSize);
                        if(pager.getTotalPage() == 1){
                            $("#pagination").hide();
                        }
                        else{
                            $("#pagination").show();
                            pager.goPage(page);
                        }
                    }
                    cb && cb();
                }
            });
        },
        reload : function(model){
            common.search(model,window.pager.getCurrentPage());
        },
        search : function(model,page){
            page = page || 1;
            var param = this.generateSearch(model.config.search,page);
            common.searchPage(model,param,true,function(){
                common.bindU(model);
                common.bindD(model);
                model.afterSearch && model.afterSearch();
            });
        },
        renderPage : function(data,cb){
            if(data == null || data.length == 0){
                $("#table_list").hide();
                return;
            }
            var html =  mtemplate.render("temp_model_list",{"models":data});
            $("#lists").html(html);
            cb && cb();
            $("#table_list").show();
        },
        getById : function(model,id){
            for(var i in model.pageData){
                var item = model.pageData[i];
                if(item.id == id){
                    return item;
                }
            }
            return null;
        },
        renderU : function(model, id){
            var item = this.getById(model, id);
            for(var key in item){
                var target = $('#aForm').find("[name='" + key + "']");
                if(target.length > 0){
                    var tag = target.get(0).tagName.toLowerCase();
                    if(tag == "input"){
                        target.val(item[key]);
                    }
                    else if(tag == "select"){
                        target.select2('val', item[key]);
                    }
                }
            }
        }
    }
    return common;
});

