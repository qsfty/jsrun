
var Filter = require('./filter/filter');
var Api = require('./filter/api');
var Log = require('../modules/log');
var Index = require('./control/index');
var File = require('./control/file');
var User = require('./control/user');
var mjax = require('mjax')

var verify = require('../modules/verify_code')
var gm = require('gm').subClass({ imageMagick : true });
module.exports = function(app){

    app.use(Filter.renderFilter);
    app.use(Filter.logFilter);
    // app.use(Filter.loginFilter);

    app.get('/im', function(req,res){
  //   	// creating an image
		// gm(100, 30, "#ddfff3")
		// .fontSize(30)
		// .drawText(10, 10, "A6S2")
		// .write("public/img/s1/demo.jpg", function (err) {
		// 	console.log(err);
		// });

		verify.makePng(req,res);
		// 
		// gm('public/img/s2/b1.jpg')
		// .resize(240, 240,'!')
		// .write('public/img/s2/b1-1.jpg', function (err) {
		//   if (!err) console.log('done');
		//   if(err) console.log(err)
		// });
		// mjax.success(res,"ok")
    })

    app.post('/fork', File.fork);
    app.post('/download', File.download);
    app.post('/login', User.login);
    app.post('/regist', User.regist);
    app.post('/exit', User.exit);
    app.get('/show/:id', File.show);


  //   app.get('/admin/*',Index.auto);

    app.all('/data/:model/:operation', Api.data);

    //错误页面
    app.get('/404', Index.page404);
    app.get('/500', Index.page500);
    app.get('/code/:id', Index.tocode);
    app.get('/code', Index.code);
  	app.get('/*',Index.auto);

}