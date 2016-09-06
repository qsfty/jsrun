var md5 = require('./md5');
var cache = require('memory-cache');
var print = require('mprint');
var dateutil = require('mdate');
module.exports = {
    setCookie : function(res,user){
        var maxAge = 24 * 60 * 60 * 1000;
        var effectTime = dateutil.gapTime('now',maxAge,'ms');
        var opts = {
            maxAge : maxAge / 1000,
            HttpOnly : true,
            path : "/"
        }
        var key = String.random(12);
        cache.put(key,user,maxAge);
        res.setHeader('Set-Cookie',this.makeCookie(this.getEncodeCookieName(),key,opts));
        //并保存到mysql
        var db = require('natis').db();
        db.models.session.insert({
            'mkey' : key,
            'user_id' : user.uuid,
            'username' : user.name || user.username,
            'gmt_effect' : effectTime,
            'info' : JSON.stringify(user,null,4)
        });
    },
    setCode : function(res, code){
        this.set(res, 'check_code', code);
    },
    getCode : function(req){
        var key = this.getCookieValue(req, this.encode('check_code'));
        if(key){
            return cache.get(key);;
        }
        return '';
    },
    set : function(res, key, val){
        var maxAge = 24 * 60 * 60 * 1000;
        var effectTime = dateutil.gapTime('now',maxAge,'ms');
        var opts = {
            maxAge : maxAge / 1000,
            HttpOnly : true,
            path : "/"
        }
        var rkey = String.random(8);
        cache.put(rkey,val,maxAge);
        res.setHeader('Set-Cookie',this.makeCookie(this.encode(key),rkey,opts));
    },
    remove : function(req){
        var key = this.getCookieValue(req,this.getEncodeCookieName());
        cache.del(key);
        req.models.session.delete({'mkey':key});
    },
    parseCookie : function(cookie){
        var cookies = {};
        if(!cookie){
            return cookies;
        }
        var list = cookie.split(';');
        for(var i in list){
            var kx = list[i].lastIndexOf("=");
            cookies[list[i].slice(0,kx).trim()] = list[i].slice(kx+1).trim();
        }
        return cookies;
    },
    getCookieValue : function(req,name){
        return this.parseCookie(req.headers.cookie)[name] || null;
    },
    loginUser : function(req){
        var key = this.getCookieValue(req,this.getEncodeCookieName());
        if(key){
            return cache.get(key);
        }
        return false;
    },
    getUserId : function(req){
        var key = this.getCookieValue(req,this.getEncodeCookieName());
        if(key){
            var user = cache.get(key);
            if(user == null){
                return '000';
            }
            return user.uuid;
        }
        return '000';
    },
    role : function(req){
        var user = this.loginPage(req);
        if(user){
            return user.role;
        }
        return null;
    },
    makeCookie : function(name,val,opt){
        var pairs = [name + '=' + val];
        opt = opt || {};
        if(opt.maxAge){
            pairs.push('Max-Age=' + opt.maxAge);
        }
        if(opt.domin){
            pairs.push('Domin=' + opt.domin);
        }
        if(opt.path){
            pairs.push('Path=' + opt.path);
        }
        if(opt.expires){
            pairs.push('Expires=' + opt.expires.toUTCString());
        }
        if(opt.httpOnly){
            pairs.push('HttpOnly');
        }
        if(opt.secure){
            pairs.push('Secure');
        }
        return pairs.join(';');
    },
    getEncodeCookieName : function(){
        return this.encode("cookie-username");
    },
    init : function(db){
        db.models.session.all().then(this.setCache);
    },
    setCache : function(cookies){
        for(var i in cookies){
            var item = cookies[i];
            var effectTime = dateutil.bettweenTime('now',item.gmt_effect);
            if(effectTime<0){
                continue;
            }
            cache.put(item.mkey,JSON.parse(item.info),effectTime);
        }
    },
    encode : function(data){
        var s = new Buffer(data).toString('base64');
        return s.replace(/=/g,'');
    },
    decode : function(data){
        return new Buffer(data, 'base64').toString();
    }
}