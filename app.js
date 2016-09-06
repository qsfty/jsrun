var express = require('express');
var path = require('path');
var app = express();


require('./modules/log').init({
  'logfile' : 'log/app.log',
  'writsize' : 2,
  'level' : 'INFO'
});

app.set('port', process.env.PORT || 3300)
app.set('views', path.join(__dirname,'views/layout'))
app.use(express.static(path.join(__dirname,'public')))


//处理请求
var bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))



//模板
var template = require('art-template')
//模板拓展
require('./modules/template_extend')(template)
template.config('extname','.html');
app.engine('.html',template.__express)
app.set('view engine','html')


var useDb = true;
if (useDb) {
    var mybatis = require('natis');
    mybatis.config("mapper","database/mapper");
    mybatis.config("settings",require('./database/config/jdbc'));
    mybatis.config("validate",require('./database/config/validate'));
    mybatis.init(function(e, db){
        require('./modules/session').init(db);
    });
    app.use(function(req,res,next){
       mybatis.use(function(err,db){
          if(err) return next(err);
           req.models = db.models;
           return next();
       });
    });
}

//路由
require('./routes/router')(app);


app.use(function(err, req, res, next) {
    console.error(err.stack);
    if(req.xhr){
        return res.stack(500).json({success:0,message:err.message});
    }
    res.redirect("/500");
});

app.listen(app.get('port'),function(){
    console.log("msql server started at " + app.get('port'))
});


exports.app = app
