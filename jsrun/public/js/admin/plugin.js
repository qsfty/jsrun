require(['dialog','frame','message']);
define('Plugin',['baseadmin','jquery','util','comjax','mtemplate','mselect2','casecade','pager'],function(common,$,util,comjax,mtemplate,mselect2,casecade){
    var Plugin = {
        config : {
            model : 'plugin',
            url : {
                add : '/data/plugin/insert',
                update : '/data/plugin/update',
                delete : '/data/plugin/delete'
            },
            search : {
                page : 1,
                pageSize : 10
            }
        },
        init : function(){
            this.initSelect();
            this.initPager();
            common.bindA(this);
            common.bindS(this);
            common.search(this);
        },
        initPager : function(){
            window.pager = new Pager("#mypage",{
                fnJump : function(page){
                    common.search(Plugin, page);
                }
            });
        },
        initSelect : function(){
            mselect2.render("#type");
            Plugin.initPidSelect();
            // mselect2.render("#pid");
        },
        initPidSelect : function(){
            mselect2.ajaxRenderData('getPluginCatalog', "#catalog");
        },
        search : function(){
            common.search(Plugin);
        },
        afterAdd : function(){
            Plugin.initPidSelect();
        },
        afterUpdate :function(){
            Plugin.initPidSelect();
        },
        afterDelete : function(){
            Plugin.initPidSelect();
        }

    }
    return Plugin;
});
require(['Plugin'],function(Plugin){
    Plugin.init();
});