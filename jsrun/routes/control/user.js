var md5 = require('../../modules/md5')
var mjax = require('mjax')
var session = require("../../modules/session")
exports.login = function(req,res){

	//密码加密
	md5.resetRequestPassword(req);
	req.models.user.login(req.body).then(function(data){
		if(data == null){
			return mjax.failure(res, "用户名或密码错误");
		}
		if(typeof data == "object"){
			//set cookie
			session.setCookie(res, data);
			return mjax.success(res, data);
		}
	},function(e){
		mjax.failure(res, e);
	});

}


exports.regist = function(req,res){

	if(req.body.username == '' || req.body.password == ''){
		return mjax.failure(res, "用户名和密码均不能为空");
	}

	//检验验证码是否有效
	var checkCode = req.body.check_code;
	var code = session.getCode(req);

	if(code == null){
		return mjax.failure(res, "验证码失效，请重新获取")
	}
	if(checkCode.toLowerCase() != code.toLowerCase()){
		return mjax.failure(res, "验证码错误");
	}

	md5.resetRequestPassword(req);
	req.models.user.regist(req.body).then(function(userId){
		//初始化一些内容
		req.models.catalog.insert({'name':'未分类','user_id':userId},function(e,uuid){
			req.models.file.insert({
				'js' : md5.encode('console.log("hello wolrd")'),
				'html' : md5.encode('hello world'),
				'css' : 'Ym9keXsKCWNvbG9yOiNlZWUKfQ==',
				'catalog_id' : uuid,
				'status' : '1.1.1.1',
				'name' : 'hello'
			})
		})

		mjax.success(res,userId)
	},function(e){
		mjax.failure(res, e);
	});

}

exports.exit = function(req,res){

	session.remove(req);
	mjax.success(res,"退出成功")

}

exports.user = function(req,res){
	var loginUser =	session.loginUser(req);
	if(loginUser){
		mjax.success(res, loginUser);
	}
	else{
		mjax.success(res, "请登录");
	}
}