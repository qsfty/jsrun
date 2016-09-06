//这里将列出所有select2需要用的数据

define(['jquery','util'],function($,util){
	var comon = {
		getFirstCatalog : function(cb){
            util.post('/data/catalog/listSelect',{'pid':'0'},cb);
		},
        getSecondCatalog : function(pid,cb){
            util.post('/data/catalog/listSelect',{'pid':pid},cb);
		},
		getPluginCatalog : function(cb){
			util.post('/data/plugin_catalog/listPluginCatalog',cb);
		},

	}

    return comon;
});