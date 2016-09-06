
var print = require('mprint');

exports.index = function(req,res){
    res.renderPage("index")
}

exports.page404 = function(req,res){
    res.render('error',{"message":"找不到页面了"});
}

exports.page500  = function(req,res){
    res.render('error',{"message":"My God,服务器出错了"});
}


exports.auto = function(req,res){
    res.renderPage(req.originalUrl);
}

exports.code = function(req,res){
	res.renderPage('code')
}

exports.tocode = function(req,res){
	res.renderPage('code',{codeId:req.params.id});
}