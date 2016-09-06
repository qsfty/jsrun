var crypto = require('crypto');
var global_salt = "demo";
var secret = "demo_secret";
module.exports =  {
    md5 : function(content){
        var md5 = crypto.createHash('md5');
        md5.update(content);
        return md5.digest('hex');
    },
    encrypt : function(username,password,salt){
        return this.md5(username + '' + password + '' + salt);
    },
    getPassword : function(username,password) {
        return this.encrypt(username, password, global_salt);
    },
    getPasswordFromRequest : function(request){
        return this.getPassword(request.body.username || '',request.body.password || '');
    },
    resetRequestPassword : function(req){
        req.body.password = this.getPasswordFromRequest(req);
    },
    encode : function(data){
        return new Buffer(data).toString('base64');
    },
    decode : function(data){
        return new Buffer(data, 'base64').toString();
    }
}