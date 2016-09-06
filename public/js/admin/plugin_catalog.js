require(['dialog','frame','message']);
define('PluginCatalog',['baseadmin','jquery','util','comjax','mtemplate','mselect2','casecade','pager'],function(common,$,util,comjax,mtemplate,mselect2,casecade){
    var PluginCatalog = {
        config : {
            model : 'plugin_catalog',
            url : {
                add : '/data/plugin_catalog/insert',
                update : '/data/plugin_catalog/update',
                delete : '/data/plugin_catalog/delete'
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
                    common.search(PluginCatalog, page);
                }
            });
        },
        initSelect : function(){
            this.redoSelect();
        },
        redoSelect : function(){
            mselect2.renderData('#tag', ['工具类','组件类'])
        },
        search : function(){
            common.search(PluginCatalog);
        }
    }
    return PluginCatalog;
});
require(['PluginCatalog'],function(PluginCatalog){
    PluginCatalog.init();
});