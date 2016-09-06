
//编辑器操作
define(["jquery","ace/ace"],function($,ace){
    var editor = null;
    var obj = {
        init : function(id){
            editor = ace.edit(id);
            editor.insert('\n    ')
            editor.getSession().setTabSize(4);
            editor.getSession().setMode('ace/mode/sql');
            // editor.getSession().setUseSoftTabs(true);
            // editor.session.setOption("useWorker", false);
            // editor.setOption("enableEmmet",true);
            // this.setMode("behaviour");
            // this.setReadOnly(true);
            // editor.setOption("vScrollBarAlwaysVisible",true);
            // editor.setOption("scrollPastEnd",false);
            editor.setOption("showGutter",false);
            // editor.getSession().setUseWrapMode(true);
            editor.setShowPrintMargin(false);
            // setUseWrapMode
        },
        setFontSize : function(fontsize){
            $("#editor").css("font-size",fontsize);
        },
        setTheme : function(theme,isSync){
            editor.setTheme("ace/theme/"+theme);
        },
        setMode : function(mode){
            editor.session.setMode("ace/mode/"+mode);
            // editor.session.setOption("spellcheck",false);
        },
        getValue : function(){
            return editor.getValue();
        },
        setValue : function(content){
            console.log(content)
            editor.setValue(content);
        },
        clear : function(){
            this.setValue("");
        },
        setReadOnly : function(flag){
            editor.setReadOnly(flag);
        },
        isReadOnly : function(){
            return editor.getOption("readOnly");
        },
        blur : function(){
            editor.gotoLine(1);
        },
        reinit : function(){
            editor.setValue("\n    ");
        }
    }
    return obj;
});