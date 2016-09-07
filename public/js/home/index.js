//封装

require(['frame', 'dialog', 'nicescroll','validate'])
require(['jquery', 'util', 'ui', 'mselect2', 'comjax', 'mtemplate', 'base64', 'key', 'datautil', 'storage'], function($, util, ui, mselect2, comjax, mtemplate, Base64, Key, datautil, storage) {
    var CodeMirrorObj = {
        cms: {
            htmlCm: null,
            jsCm: null,
            cssCm: null
        },
        opts: {
            jsOpt: {
                lineNumbers: true,
                mode: { name: "javascript", globalVars: true },
                theme: "monokai",
                indentUnit: 4,
                scrollbarStyle: "overlay",
                indentWithTabs: true
            },
            htmlOpt: {
                lineNumbers: true,
                mode: "text/html",
                theme: "monokai",
                indentUnit: 4,
                lineWrapping: true,
                scrollbarStyle: "overlay",
                indentWithTabs: true
            },
            cssOpt: {
                lineNumbers: true,
                mode: { name: "css" },
                theme: "monokai",
                indentUnit: 4,
                scrollbarStyle: "overlay",
                indentWithTabs: true
            }
        },
        init: function() {
            this.cms.jsCm = CodeMirror(document.getElementById("code_javascript"), CodeMirrorObj.opts.jsOpt);
            this.cms.cssCm = CodeMirror(document.getElementById("code_css"), CodeMirrorObj.opts.cssOpt);
            this.cms.htmlCm = emmetCodeMirror(CodeMirror(document.getElementById("code_html"), CodeMirrorObj.opts.htmlOpt));
            this.bindEvent();
        },
        getDocValue: function(cm) {
            return cm.getDoc().getValue();
        },
        getHtmlCode: function(encode) {
            if (encode) {
                return Base64.encode(this.getDocValue(this.cms.htmlCm));
            }
            return this.getDocValue(this.cms.htmlCm);
        },
        getCssCode: function(encode) {
            if (encode) {
                return Base64.encode(this.getDocValue(this.cms.cssCm))
            }
            return this.getDocValue(this.cms.cssCm);
        },
        getJsCode: function(encode) {
            if (encode) {
                return Base64.encode(this.getDocValue(this.cms.jsCm));
            }
            return this.getDocValue(this.cms.jsCm);
        },
        setHtmlCode: function(code, encode) {
            if (typeof encode == undefined) {
                encode = true;
            }
            if (encode) {
                CodeMirrorObj.cms.htmlCm.setValue(Base64.decode(code));
            } else {
                CodeMirrorObj.cms.htmlCm.setValue(code);
            }
        },
        setJsCode: function(code) {
            CodeMirrorObj.cms.jsCm.setValue(Base64.decode(code));
        },
        setCssCode: function(code) {
            CodeMirrorObj.cms.cssCm.setValue(Base64.decode(code));
        },
        getHtmlDoc: function() {
            return CodeMirrorObj.cms.htmlCm.getDoc();
        },
        getHeadLine: function() {
            var count = CodeMirrorObj.getHtmlDoc().lineCount();
            var head_line = {
                line: 0,
                ch: 0
            };
            for (var i = 0; i < count; i++) {
                var line = CodeMirrorObj.getHtmlDoc().getLine(i);
                if (line.trim() != "") {
                    var m = line.match(/<\/head>/ig);
                    if (m != null && m.length == 1) {
                        head_line = {
                            line: i,
                            ch: 0
                        };
                    }
                }
            }
            return head_line;
        },
        insertLib: function(lib) {
            var insertTab = CodeMirrorObj.getHeadLine();
            if (insertTab.line > 0) {
                var ss = lib.split("\n");
                ss.map(function(v, i) {
                    ss[i] = "    " + v;
                });
                lib = ss.join("\n");
            }
            CodeMirrorObj.getHtmlDoc().replaceRange(lib + "\n", CodeMirrorObj.getHeadLine());
        },
        realtime : false,
        bindEvent : function(){
            CodeMirrorObj.lst = 0;
            CodeMirrorObj.cms.htmlCm.on('change', CodeMirrorObj.realrun);
            CodeMirrorObj.cms.cssCm.on('change', CodeMirrorObj.realrun);
            CodeMirrorObj.cms.jsCm.on('change', CodeMirrorObj.realrun);
        },
        realrun : function(){
            var l = new Date().getTime();
            if(CodeMirrorObj.realtime && (l - CodeMirrorObj.lst > 3000)){
                CodeMirrorObj.lst = l
                Procode.run();
            }
        },
        oldData : null,
        saveOld : function(){
            CodeMirrorObj.oldData =  CodeMirrorObj.getNow()
        },
        getNow : function(){
            return CodeMirrorObj.getHtmlCode() + CodeMirrorObj.getJsCode() + CodeMirrorObj.getCssCode()
        },
        checkSame : function(){
            if(User.state == "unlogin"){
                return;
            }
            if(CodeMirrorObj.oldData != CodeMirrorObj.getNow()){
                Procode.save("leave");
            }
        },

    }
    function checkLeave(){
        // if(CodeMirrorObj.oldData != CodeMirrorObj.getNow()){
        //     return "数据还未保存";
        // }
        CodeMirrorObj.checkSame()
    }
    window.onbeforeunload = checkLeave;
    var Win = {
        ltp: 0.5,
        rtp: 0.5,
        lp: 0.5,
        setCell01: function(width, height) {
            if (width != null) {
                $("fieldset.left .top").css("width", width)
                $("fieldset.left").css("width", width)
                $("#bar02").css("left", width);
                CodeMirrorObj.cms.htmlCm.setSize(width, null);
            }
            if (height!= null) {
                $("fieldset.left .top").css("height", height)
                CodeMirrorObj.cms.htmlCm.setSize(null, height);
            }
            if(width == 0 || height == 0){
                $(".bage_html").hide()
            }
            else{
                $(".bage_html").show()
            }
        },
        setCell02: function(width, height) {
            if (width!= null) {
                $("fieldset.right .top").css("width", width)
                $("fieldset.right").css("width", width)
                CodeMirrorObj.cms.cssCm.setSize(width, null);

            }
            if (height!= null) {
                $("fieldset.right .top").css("height", height)
                CodeMirrorObj.cms.cssCm.setSize(null, height);
            }
            if(width == 0 || height == 0){
                $(".bage_css").hide()
            }
            else{
                $(".bage_css").show()
            }
        },
        setCell03: function(width, height) {
            if (width!= null) {
                $("fieldset.left .bottom").css("width", width)
                CodeMirrorObj.cms.jsCm.setSize(width, null);
            }
            if (height!= null) {
                $("fieldset.left .bottom").css("height", height)
                CodeMirrorObj.cms.jsCm.setSize(null, height);
            }
            if(width == 0 || height == 0){
                $(".bage_js").hide()
            }
            else{
                $(".bage_js").show()
            }
        },
        setCell04: function(width, height) {
            if (width!= null) {
                $("fieldset.right .bottom").css("width", width)
                $("#output").width(width);
            }
            if (height!= null) {
                $("fieldset.right .bottom").css("height", height)
                $("#output").height(height)
            }
            if(width == 0 || height == 0){
                $(".bage_output").hide()
            }
            else{
                $(".bage_output").show()
            }
        },
        resize: function() {
            var w = $("#box").width();
            var h = $("#box").height();
            var lw = w * Win.lp;
            var lth = h * Win.ltp;
            var lbh = h * (1 - Win.ltp);
            var rw = w * (1 - Win.lp);
            var rth = h * Win.rtp;
            var rbh = h * (1 - Win.rtp);

            Win.setCell01(lw, lth);
            Win.setCell03(lw, lbh);
            Win.setCell02(rw, rth);
            Win.setCell04(rw, rbh);
        },
        views: [1, 1, 1, 1],
        getViews: function() {
            var as = [];
            $(".win_switcher").each(function() {
                as.push($(this).hasClass("active") ? 1 : 0);
            });
            if (as.join("") != "0000") {
                Win.views = as;
                return "ok";
            }
            return "";
        },
        show: function() {
            var v = Win.views.join("");
            var ps = [];
            switch (v) {
                case "0001":
                    ps = [0,0,0];
                    break;
                case "0010":
                    ps = [1,0,0];
                    break;
                case "0011":
                    ps = [0.5,0,0];
                    break;
                case "0100":
                    ps = [0,0,1];
                    break;
                case "0101":
                    ps = [0,0,0.5];
                    break;
                case "0110":
                    ps = [0.5,1,1];
                    break;
                case "0111":
                    ps = [0.5,0,0.5];
                    break;
                case "1000":
                    ps = [1,1,0];
                    break;
                case "1001":
                    ps = [0.5,1,0];
                    break;
                case "1010":
                    ps = [1,0.5,0.5]
                    break;
                case "1011":
                    ps = [0.5,0.5,0]
                    break;
                case "1100":
                    ps = [0.5,1,1];
                    break;
                case "1101":
                    ps = [0.5,1,0.5];
                    break;
                case "1110":
                    ps = [0.5,0.5,1]
                    break;
                case "1111":
                    ps = [0.5,0.5,0.5];
                    break;
            }
            Win.lp = ps[0];
            Win.ltp = ps[1];
            Win.rtp = ps[2];
            Win.resize();
        },
        setStatus : function(status){
            Win.views = status.split('.');
            Win.show();
            Win.views.map(function(v,i){
                if(v == 1){
                    $(".win_switcher").eq(i).attr('class','win_switcher active')
                }
                else{
                    $(".win_switcher").eq(i).attr('class','win_switcher')
                }
            }); 
        }
    }

    var Movable = {
        config: {
            canBar1Move: false,
            canBar2Move: false,
            canBar3Move: false
        },
        moves: {
            //左
            move1: function(e) {
                if (Movable.config.canBar1Move) {
                    var l = Movable.getLocation(e);
                    var tH = l.y;
                    var bH = l.h - l.y;
                    if(tH < 100 || bH < 100){
                        return;
                    }
                    Win.ltp = l.y / l.h;
                    Win.resize();
                }
            },
            //中
            move2: function(e) {
                if (Movable.config.canBar2Move) {
                    var l = Movable.getLocation(e);
                    var lw = l.x;
                    var rw = l.w - l.x;
                    if(lw < 200 || rw < 200){
                        return;
                    }
                    Win.lp = l.x / l.w;
                    Win.resize();
                }
            },
            //右
            move3: function(e) {
                if (Movable.config.canBar3Move) {
                    var l = Movable.getLocation(e);
                    var tH = l.y
                    var bH = l.h - l.y
                    if(tH < 100 || bH < 100){
                        return;
                    }
                    Win.rtp = l.y / l.h;
                    Win.resize();
                }
            }
        },
        init: function() {
            $("#bar01").on("mousedown", function() {
                Movable.config.canBar1Move = true;
            });

            $("#bar02").on("mousedown", function() {
                Movable.config.canBar2Move = true;
            });

            $("#bar03").on("mousedown", function() {
                Movable.config.canBar3Move = true;
            });

            $("body").on("mouseup", function() {
                Movable.config.canBar1Move = false;
                Movable.config.canBar2Move = false;
                Movable.config.canBar3Move = false;
                //去掉遮罩层
                $("#iframe_layer").css("z-index", -2);

            }).on("mousemove", function(e) {

                //创建遮罩层把iframe遮住
                $("#iframe_layer").css("z-index", 99);
                Movable.moves.move1(e);
                Movable.moves.move2(e);
                Movable.moves.move3(e);
            });


        },
        getLocation: function(e) {
            return {
                x: e.pageX - 180,
                y: e.pageY - 60,
                w: $("#box").width(),
                h: $("#box").height()
            }
        }
    }

    var Menu = {
        url: '/data/catalog/listMenu',
        click: function(tar) {
            if (tar.parent("li").hasClass("active")) {
                Menu.close();
            } else {
                Menu.close();
                Menu.open(tar);
            }
        },
        close: function() {
            var menu = $("li.sub-menu.active");
            menu.find(".sub").slideUp(500, function() {
                menu.removeClass("active");
            });
        },
        open: function(tar) {
            tar.parent("li").addClass("active");
            tar.siblings(".sub").slideDown(500);
        },
        openParent : function(id){
            $('.menu_parent[data-id="' + id + '"]').addClass("active").siblings('.sub').slideDown(500);
        },
        initData: function(fileId,cb) {
            util.post(Menu.url, null, function(data) {
                mtemplate.renderAndAssign("temp_sidebar", { "catalogs": data }, $("#sidebar"));
                Menu.initState(fileId);
                cb && cb();
            });
        },
        setActive : function(fileId){
            var ac = $(".sub a[data-id='" + fileId + "']").addClass("active");
        },
        showActive : function(){
            Menu.click($(".sub a.active").parents(".sub").siblings('a'));
        },
        initState: function(fileId) {
            if(fileId){
                Menu.setActive(fileId);
                Menu.showActive(fileId);
            }
            Menu.bind();
        },
        bind: function() {
            $(".menu_parent").each(function() {
                $(this).click(function() {
                    if ($(this).find(".catalog_icon").hasClass("icon-list-down")) {
                        $(this).find(".catalog_icon").attr("class", "iconfont icon-list-right catalog_icon");
                    } else {
                        $(".menu_parent .icon-list-down").attr("class", "iconfont icon-list-right catalog_icon");
                        $(this).find(".catalog_icon").attr("class", "iconfont icon-list-down catalog_icon");
                    }
                    Menu.click($(this));
                });
            });


            $(".menu_parent .catalog_setting").each(function() {
                $(this).click(function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    ContextMenu.showCatalogMenu($(this).parent("a"));
                });
            });


            $(".sub li a").each(function() {
                var _this = $(this);
                $(this).click(function() {
                    var id = $(this).data('id');
                    if (Data.currentFileId == id) {
                        return;
                    }
                    // Menu.open($(this).parents(".sub").siblings(".menu_parent"));
                    $(".sub li a.active").removeClass("active");
                    $(this).addClass("active");
                    Procode.openFile(id);
                });

                // $(this).mouseenter(function(){
                //     if($("#file_menu").data('id') != $(this).data('id')){
                //         $("#file_menu").hide();
                //     }
                // });
                $(this).find(".file_setting").click(function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    ContextMenu.showFileMenu(_this);
                });
            });
        },
        renameFile: function(id, newName) {
            $(".sub li a[data-id='" + id + "'] span:eq(0)").text(newName);
        },
        renameCatalog: function(id, newName) {
            $(".menu_parent[data-id='" + id + "'] .menu_catalog_name").text(newName);
        },
        deleteFile: function() {
            $(".sub li a[data-id='" + Data.currentEditFileId + "']").remove();
        },
        deleteCatalog: function() {
            $(".menu_parent[data-id='" + Data.currentEditCatalogId + "']").parent().remove();
        }
    }

    var Data = {
        currentFileId: codeId,
        currentFileName: '',
        currentEditFileId: '',
        currentEditFileName: '',
        currentEidtFileGroup : '',
        currentEditCatalogId: '',
        currentEditCatalogName: '',
        urls: {
            rename_file: '/data/file/rename',
            delete_file: '/data/file/delete',
            redo_group : '/data/file/redogroup',
            fork : '/fork',

            rename_catalog: '/data/catalog/rename',
            delete_catalog: '/data/catalog/delete',

            plugins: '/data/plugin/all',
            plugins_data: '/data/plugin/alldata',

            login : '/login',
            regist : '/regist',
            exit : '/exit'
        },
        sourceData: ''
    }



    var Dialog = {
        showLoginDialog : function(){
            $("#win_login").dialog({
                width: 500,
                fnSure: function(d) {
                    if(!$("#form_login").valid()){
                        return;
                    }
                    var param = util.form2param("#form_login");
                    util.post(Data.urls.login, param, function(data) {
                        d.close();
                        User.state = "login";
                        User.info = data;
                        User.initState();
                        $.success("登陆成功");
                        Menu.initData();
                    });
                }
            });
        },
        showRegistDialog : function(){
            $("#win_login").dialog("hide");
            $("#win_regist").dialog({
                width: 500,
                fnSure: function(d) {
                    var flag = $("#form_regist").valid();
                    if(!flag){
                        return;
                    }
                    var param = util.form2param("#form_regist");
                    util.post(Data.urls.regist, param, function(e) {
                        d.close();
                        $.success("注册成功，去登陆吧");
                    });
                }
            });
        },
        showNewFileDialog: function() {
            if(User.state == "unlogin"){
                return $.warn("请先登录");
            }
            $("#win_add_file").dialog({
                width: 500,
                fnSure: function(d) {
                    var param = util.form2param("#form_add_file");
                    param.ordinal = util.getOridinal();
                    util.post(Procode.urls.save, param, function(uuid) {
                        d.close();
                        $.success("添加成功");
                        Menu.initData(uuid);
                        Procode.openFile(uuid);
                    });
                }
            });
        },
        showNewCatalogDialog: function() {
            if(User.state == "unlogin"){
                return $.warn("请先登录");
            }
            $("#win_add_catalog").dialog({
                width: 500,
                zIndex: 110,
                fnSure: function(d) {
                    var param = util.form2param("#form_add_catalog");
                    param.ordinal = util.getOridinal();
                    util.post(Procode.urls.catalog_save, param, function(e) {
                        d.close();
                        $.success("添加成功");
                        Menu.initData(Data.currentFileId);
                        Procode.initCatalog();

                    });
                }
            });
        },
        showRenameFileDialog: function() {
            if(User.state == "unlogin"){
                return $.warn("请先登录");
            }
            $("#file_new_name").val(Data.currentEditFileName);
            $("#win_rename_file").dialog({
                width: 500,
                clear: false,
                fnSure: function(d) {
                    var param = util.form2param("#form_rename_file");
                    param.uuid = Data.currentEditFileId;
                    util.post(Data.urls.rename_file, param, function(e) {
                        d.close();
                        $.success("操作成功");
                        Menu.renameFile(Data.currentEditFileId, param.name);
                    });
                }
            })
        },
        showDeleteFileDialog: function() {
            if(User.state == "unlogin"){
                return $.warn("请先登录");
            }
            $.showConfirm("确定要删除[" + Data.currentEditFileName + "]吗?", function() {
                util.post(Data.urls.delete_file, {
                    "uuid": Data.currentEditFileId
                }, function(e) {
                    $.success("操作成功");
                    Menu.deleteFile();
                });
            })
        },
        showRedoGroupDialog : function(){
            if(User.state == "unlogin"){
                return $.warn("请先登录");
            }
            $("#file_old_name").val(Data.currentEditFileName)
            mselect2.val('#file_new_catalog', Data.currentEidtFileGroup);
            $("#win_regroup_file").dialog({
                width: 500,
                clear: false,
                fnSure: function(d) {
                    var param = util.form2param("#form_regroup_file");
                    param.uuid = Data.currentEditFileId;
                    util.post(Data.urls.redo_group, param, function(e) {
                        d.close();
                        $.success("操作成功");
                        Menu.initData(null, function(){
                            Menu.setActive(Data.currentFileId);
                            Menu.openParent(param.catalog_id);
                        });
                        //Menu.renameCatalog(Data.currentEditCatalogId, param.name);
                    });
                }
            })
        },
        showRenameCatalogDialog: function() {
            if(User.state == "unlogin"){
                return $.warn("请先登录");
            }
            $("#catalog_new_name").val(Data.currentEditCatalogName);
            $("#win_rename_catalog").dialog({
                width: 500,
                clear: false,
                fnSure: function(d) {
                    var param = util.form2param("#form_rename_catalog");
                    param.uuid = Data.currentEditCatalogId;
                    util.post(Data.urls.rename_catalog, param, function(e) {
                        d.close();
                        $.success("操作成功");
                        Procode.initCatalog();
                        Menu.renameCatalog(Data.currentEditCatalogId, param.name);
                    });
                }
            })
        },
        showDeleteCatalogDialog: function() {
            if(User.state == "unlogin"){
                return $.warn("请先登录");
            }
            $.showConfirm("确定要删除[" + Data.currentEditCatalogName + "]吗?", function() {
                util.post(Data.urls.delete_catalog, {
                    "uuid": Data.currentEditCatalogId
                }, function(e) {
                    $.success("操作成功");
                    Menu.deleteCatalog();
                });
            })
        },
        showExitDialog : function(){
            $.showConfirm("确定要退出系统吗?", function() {
                util.post(Data.urls.exit,null, function(e) {
                    User.exit();
                    $.success("退出成功");
                    Menu.initData();
                });
            })
        },
        showForkDialog : function(forkId){
            if(User.state == "unlogin"){
                return $.warn("请先登录");
            }
             $("#win_fork_file").dialog({
                width: 500,
                fnSure: function(d) {
                    var param = util.form2param("#form_fork_file");
                    param.id = forkId;
                    util.post(Data.urls.fork, param, function(uuid) {
                        d.close();
                        $.success("操作成功");
                        Menu.initData(uuid);
                        Procode.openFile(uuid)
                    });
                }
            })
        }
    }

    var User = {
        initView : function(){
            if(user != "{}"){
                User.state = "login";
                User.info = JSON.parse(user);
            }
            else{
                User.state = "unlogin";
            }
            User.initState();
        },
        bindEvent : function(){
            util.bind('click',{
                '#login' : Dialog.showLoginDialog,
                '#regist,#for_regist' : Dialog.showRegistDialog,
                '#exit' : Dialog.showExitDialog
            });

            $('.check_code').click(function(){
                $(this).attr('src', '/im?v='+Math.floor(Math.random()* 100));
            });

            $("#form_regist").validateForm();
            $("#form_login").validateForm();
        },
        state :"unlogin",
        info : {},
        initState : function(){
            if(User.state == "unlogin"){
                var t = mtemplate.render("temp_unlogin_area",{});
                $("#user_area").html(t);
            }
            else{
                var t = mtemplate.render("temp_login_area",{"user":User.info});
                $("#user_area").html(t);
            }
            User.bindEvent();
        },
        exit : function(){
            User.state = "unlogin";
            User.info = {}
            User.initState();
        }

    }

    var ContextMenu = {
        init: function() {
            this.bindEvent();
        },
        showFileMenu: function(tar) {
            var eleRect = ui.getElementPosition(tar);
            ui.setElementPosition($("#file_menu"), { x: eleRect.r + 10, y: eleRect.y + 17 });
            $("#file_menu").show();
            $("#file_menu").data("id", tar.data('id'));
            Data.currentEditFileId = tar.data('id');
            Data.currentEditFileName = tar.text().trim();
            Data.currentEidtFileGroup = tar.data('group');
            $("#catalog_menu").hide();
        },
        showCatalogMenu: function(tar) {
            var eleRect = ui.getElementPosition(tar);
            ui.setElementPosition($("#catalog_menu"), { x: eleRect.r + 10, y: eleRect.y + 17 });
            $("#catalog_menu").show();
            $("#catalog_menu").data("id", tar.data('id'));
            Data.currentEditCatalogId = tar.data('id');
            Data.currentEditCatalogName = tar.text().trim();
            $("#file_menu").hide();
        },
        showNewMenu: function() {
            var eleRect = ui.getElementPosition($("#btn_new"));
            ui.setElementPosition($("#new_menu"), { x: eleRect.x + 10, y: eleRect.b - 5 });
            $("#new_menu").show();
        },
        showSourceMenu: function() {
            var eleRect = ui.getElementPosition($("#btn_source"));
            ui.setElementPosition($("#source_menu"), { x: eleRect.x + 10, y: eleRect.b - 5 });
            $("#source_menu").show();
        },
        initSourceMenuData: function() {
            Source.init();
        },
        bindEvent: function() {
            this.initSourceMenuData();
            $("#file_menu,#catalog_menu,#new_menu,#source_menu").hover(function() {
                $(this).show();
            }, function() {
                $(this).hide();
            });
            util.bind('click', {
                "#btn_rename_file": Dialog.showRenameFileDialog,
                "#btn_redo_group" : Dialog.showRedoGroupDialog,
                "#btn_fork_file" : function(){
                    Dialog.showForkDialog(Data.currentEditFileId);
                },
                "#btn_delete_file": Dialog.showDeleteFileDialog,
                "#btn_rename_catalog": Dialog.showRenameCatalogDialog,
                "#btn_delete_catalog": Dialog.showDeleteCatalogDialog,
                "#btn_new_file": Dialog.showNewFileDialog,
                "#btn_new_catalog": Dialog.showNewCatalogDialog
            });
        }
    }


    var Source = {
        init: function() {
            Source.setNav();
        },
        setNav : function(){
            var plugins = storage.getJson('runjs_plugins')
            if(plugins){
               Source.setNavData(plugins);
            }
            else{
                util.post(Data.urls.plugins, null, function(data) {
                    var source = datautil.pullParentFromArray(data, 'tag');
                    storage.setJson('runjs_plugins', source, 1);
                    Source.setNavData(source);
                });
            }
        },
        setNavData : function(source){
            $("#source_data").html(mtemplate.render('temp_source', { 'tags': source }))
            var pluginData = storage.getJson('runjs_plugin_data');
            if(pluginData){
                Data.sourceData = pluginData;
                Source.bindEvent();
            }
            else{
                util.post(Data.urls.plugins_data, null, function(data) {
                    var rst = {};
                    data.map(function(v, i) {
                        rst[v.name] = v.data;
                    });
                    storage.setJson('runjs_plugin_data', rst, 1);
                    Data.sourceData = rst;
                    Source.bindEvent();
                });
            }
        },
        bindEvent: function() {
            $(".oplugin").each(function() {
                $(this).click(function() {
                    var name = $(this).text().trim();
                    Source.make(Data.sourceData[name]);
                });
            });
        },
        make: function(data) {
            var s1 = mtemplate.render('temp_sourcedata', { 'plugins': data });
            var s2 = mtemplate.htmlUnEscape(s1);
            var s3 = mtemplate.removeWhitespace(s2);
            CodeMirrorObj.insertLib(s3);
        }
    }

    var UIView = {
        init: function() {
            this.initView();
            this.bindEvent();
            ContextMenu.init();
        },
        initView: function() {
            var h = window.innerHeight - 60;
            $("#box,#sidebar,#container").height(h);
            Win.resize();
        },
        bindEvent: function() {
            util.bind('click', {
                "#btn_run": Procode.run,
                "#btn_save": Procode.save,
                "#btn_fork": function(){
                    Dialog.showForkDialog(Data.currentFileId);
                },
                "#btn_source": ContextMenu.showSourceMenu
            });

            // util.bind('hover',{
            //     "#btn_new": ContextMenu.showNewMenu
            // });

            $("#btn_new").hover(function() {
                ContextMenu.showNewMenu()
            }, function() {
                $("#new_menu").hide();
            });

            $(".win_switcher").each(function(index) {
                $(this).click(function() {
                    var isActive = $(this).hasClass("active");
                    if (isActive) {
                        $(this).removeClass("active");
                    } else {
                        $(this).addClass('active');
                    }
                    if(Win.getViews() == ""){
                        $(this).addClass("active");
                        return;
                    }
                    else{
                        Win.show();
                    }
                });

                (function(i){
                    var t = 0;
                    $(".win_switcher").eq(i).on('mousedown',function(){
                        t = new Date().getTime();
                    }).on('mouseup',function(){
                        var dt = new Date().getTime();
                        if(dt - t >= 300){
                            $(".win_switcher").removeClass("active").eq(i).addClass('active');
                            Win.getViews()
                            Win.show();
                        }
                    });
                })(index)
            });

            $("#realtime").click(function(){
                var realtime = CodeMirrorObj.realtime;
                if(realtime){
                    $(this).removeClass("active");
                }
                else{
                    $(this).addClass('active');
                }
                CodeMirrorObj.realtime = realtime ? false : true;
                CodeMirrorObj.realrun();
            });

        }
    }


    var Procode = {
        urls: {
            save: '/data/file/insert',
            update: '/data/file/update',
            catalog_save: '/data/catalog/insert',
            run: '/run',
            get_file: '/data/file/get'
        },
        init : function(){
            if(codeId != ''){
                Procode.openFile(codeId);
            }
            Procode.bind();
        },
        bind: function() {
            Procode.initCatalog();
            mselect2.render("#catalog");
        },
        initCatalog: function() {
            comjax.getFirstCatalog(function(data) {
                mselect2.renderData("#catalog", data);

                mselect2.renderData("#file_new_catalog", data);

                mselect2.renderData("#fork_catalog", data);
            })
        },
        openFile: function(id) {
            CodeMirrorObj.checkSame()

            util.post(Procode.urls.get_file, { "uuid": id }, function(data) {
                CodeMirrorObj.setHtmlCode(data.html, true);
                CodeMirrorObj.setCssCode(data.css);
                CodeMirrorObj.setJsCode(data.js);

                Data.currentFileName = data.name;
                Data.currentFileId = id;

                Win.setStatus(data.status || '1.1.1.1');
                Procode.run();

                window.history.pushState({},0,'/code/'+id);
                CodeMirrorObj.saveOld()
            })
        },
        run: function() {
            var source = CodeMirrorObj.getHtmlCode();
            var css = CodeMirrorObj.getCssCode();
            var js = CodeMirrorObj.getJsCode();


            var htmlContent = '<html lang="en">';
            if (source.indexOf("<html") >= 0 && source.indexOf("</html>") >= 0) {
                if (source.indexOf("<head>") >= 0) {
                    htmlContent = source.slice(0, source.indexOf("<head>"));
                } else if (source.indexOf("<body>" >= 0)) {
                    htmlContent = source.slice(0, source.indexOf("<body>"));
                }
            }

            var headContent = Procode.getElement(source, "head");

            headContent += '<style type="text/css">body{color:#ffcc99;font-family:"Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;}</style>';
            var bodyContent = Procode.getElement(source, "body");

            if(bodyContent == ""){
                bodyContent = source;
            }
            if (css.trim() != "") {
                css = "<style type='text/css'>" + css + "</style>";
            }
            if (js.trim() != "") {
                js = "<script type='text/javascript'>" + js + "</script>"
            }

            var finalHtml = htmlContent + "<head>" + headContent + css + "</style></head>" + "<body>" + bodyContent + js + "</body></html>";


            $("#output").remove();
            var previewFrame = $("#output_wrapper").append('<iframe id="output" frameborder="0"></iframe>').find("iframe")[0]
            var preview = previewFrame.contentDocument || previewFrame.contentWindow.document;
            preview.open();
            preview.write(finalHtml);
            preview.close();


        },
        getElement: function(source, ele) {
            var nsource = source.toLowerCase();
            var l = nsource.indexOf("<" + ele + ">");
            var r = nsource.indexOf("</" + ele + ">");
            if (l >= 0 && r >= 0 && l < r) {
                return source.slice(l + 6, r);
            } else {
                return '';
            }
        },
        getElementPosition: function(source, ele) {
            return source.toLowerCase().indexOf(ele.toLowerCase());
        },
        save: function(arg) {
            var html = CodeMirrorObj.getHtmlCode(true);
            var css = CodeMirrorObj.getCssCode(true);
            var js = CodeMirrorObj.getJsCode(true);

            if (User.state == "unlogin") {
                $.warn("请先登录");
                return;
            }
            util.post(Procode.urls.update, {
                css: css,
                html: html,
                js: js,
                status : Win.views.join('.'),
                uuid: Data.currentFileId
            }, function(e) {
                if(typeof arg == "undefined"){
                    $.success("保存成功");
                }
                CodeMirrorObj.saveOld()
            });
        },
        fork: function() {

        }
    }
    
    CodeMirrorObj.init();
    Procode.init();
    Menu.initData(Data.currentFileId);
    UIView.init();
    Movable.init();
    User.initView();

    Key.bindKey('command+s,ctrl+s', function(e) {
        Procode.save()
    }, true);

    Key.bindKey('command+r,ctrl+r', function(e) {
        Procode.run()
    }, true)

    Key.bindKey('command+n,ctrl+n', function(e) {
        Dialog.showNewFileDialog()
    }, true)


    $(window).on("resize", function() {

        UIView.initView();
    });

    $("#sidebar,#source_data").niceScroll({
        cursorcolor: "#444b56",
        cursorwidth: "5px",
        cursorborder: "1px solid #444b56"
    })


});
