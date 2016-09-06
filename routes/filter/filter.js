//过滤器
require('mstr');
var cache = require('memory-cache');
var session = require('../../modules/session');
var print = require('mprint');
var template = require('art-template');
var fs = require('fs');
var querystring = require('querystring');
var mjax = require('mjax')
exports.logFilter = function(req,res,next){
    print.info('请求连接:' + req.originalUrl);
    print.info('请求query参数:');
    print.error(req.query);
    print.info('请求body参数:');
    print.error(req.body);

    next();
}

exports.filterAdmin = function(req,res,next){

    var url = req.originalUrl;
    if(url.startsWith("/admin","admin")){
        //判断是否登录
        var loginUser = session.loginUser(req);
        if(!loginUser){
            return res.redirect("/login");
        }
        else{
            if(loginUser.superadmin && loginUser.superadmin == 1){
                return next();
            }
            else{
                return res.redirect("/index");
            }
        }
    }
    next();
}

exports.loginFilter = function(req,res,next){
    if(isWhiteListUrl(req)){
        return next();
    }
    //判断是否已经登陆过
    var loginUser =  session.loginUser(req);
    print.ps(loginUser);

    if(req.method == "get"){
        return res.redirect("/login");
    }
    else{

    }
    if(!loginUser){
        if(req.method == "post"){
            mjax.failure(res, "请先登录");
        }else{
            res.redirect("/login");
        }
    }
    else{
        next();
    }
}


//页面中间件
exports.renderFilter = function(req,res,next){
    print.warn('请求链接:' + req.originalUrl);
    if(req.method != 'GET'){
        return next();
    }
    var originalUrl = req.originalUrl;
    var layout = "";
    if(originalUrl.startsWith("/admin")){
        layout = "admin";
    }
    else{
        layout = "home";
    }
    res.renderPage = function(screenPage,screeData,extraDataOrLayout,selfLayout){
        var data = screeData || {};
        var extra = extraDataOrLayout || {};
        if(typeof extraDataOrLayout == 'string'){
            layout = extraDataOrLayout;
            extra = {};
        }
        else if(selfLayout){
            layout = selfLayout;
        }
        var basedir = 'views/screen';
        var page = screenPage.slicePrefix("/admin/","/admin",'/');

        var index = page.indexOf("?");
        if(index>=0){
            //请求参数
            data = querystring.parse(page.slice(index + 1));
            //跳转url
            page = page.slice(0,index);
        }
        var checkfile = basedir + '/' + layout + '/' + page;
        print.ps(checkfile)
        var file =  checkfile + ".html";
        fs.stat(file,function(err){
            if(err){
                print.ps("找不到" + file);
                return res.redirect("/404");
            }
            var loginUser = session.loginUser(req);
            data.session = loginUser || {};
            var contents = template(checkfile,data);
            if(contents.startsWith("{Template Error}")){
                return res.redirect("/500");
            }
            var layoutRenderData = {
                contents : contents,
                extra : extra,
                session : loginUser || {},
                page : page
            }
            if(page.contain('frame')){
                layout = 'content'
            }
            return res.render(layout,layoutRenderData);
        });
    }
    next();
}


//所有白名单
function isWhiteListUrl(req){
    var url = req.originalUrl;
    return url.startsWith("/signin","/signup","/login","/data","/404","/500");
}

