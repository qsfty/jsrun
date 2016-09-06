// Tell RequireJS where ace is located
require.config({
    // urlArgs: "version=" + new Date().getTime(),
    baseUrl: '/',
    packages: [{
        name: "codemirror",
        location: "/lib/codemirror-5.17.0",
        main: "lib/codemirror"
    }],
    paths: {
        'jquery': '/lib/jquery',
        'template': '/lib/art_template',
        'tool': '/lib/plugin/frame/tool',
        'dialog': '/lib/plugin/frame/dialog',
        'smartmenu': '/lib/plugin/menu/smartmenu',
        'frame': '/lib/plugin/frame/frame',
        'select2': '/lib/select2/select2.min',
        'parser': '/lib/epiceditor/js/parser',
        'util': '/lib/util',
        'ui' : '/lib/ui',
        'editor': '/lib/editor',
        'pager': '/lib/pagination/pager',
        'comjax': '/lib/comjax',
        'message': '/lib/message',
        'mtemplate': '/lib/mtemplate',
        'dbtemplate': '/lib/dbtemplate',
        'mselect2': '/lib/mselect2',
        'radio': '/lib/radio',
        'echarts': '/lib/echarts.min',
        'casecade': '/lib/select2/casecade',
        'ace': '/lib/ace',
        'editor': '/lib/editor',
        'prism': '/lib/prism/prism',
        'clip': '/lib/clipboard.min',
        'mclip': '/lib/mclip',
        'base64':'/lib/base64',
        'key' : '/lib/key',
        'storage' : '/lib/storage',
        'datautil': '/lib/datautil',
        'toputil': '/lib/toputil',
        'nicescroll':'/lib/jquery.nicescroll.min',
        'tether': '/lib/tether/main/js/tether.min',
        'tether-drop': '/lib/tether/drop/js/drop.min',
        'tether-tooltip': '/lib/tether/tooltip/js/tooltip.min',
        'baseadmin' : '/js/admin/common',
        'validate':'/lib/validate'
    },
    shim: {
        'message': {
            deps: ['jquery']
        },
        'validate' : {
            deps:['jquery']
        },
        'bmob': {
            exports: 'bmob'
        },
        'smartmenu': {
            deps: ['jquery'],
        },
        'select2': {
            deps: ['jquery']
        },
        'pager': {
            deps: ['jquery']
        },
        'base64' : {
            exports : 'Base64'
        }
    }

});
