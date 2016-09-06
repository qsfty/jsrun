

var C = [];

var n = [];
for(var i=0;i<10;i++){
	n.push(i);
	C.push(n[i])
}

var B = [];
for(var i=97;i<123;i++){
	B.push(String.fromCharCode(i));
	C.push(B[i-97])
}

var b = [];
for(var i=65;i<91;i++){
	b.push(String.fromCharCode(i))
	C.push(b[i-65])
}

var session = require('./session')
var gm = require('gm').subClass({imageMagick:true})

module.exports = {
	generateCode : function(){
		var rst = [];
		for(var i=0;i<4;i++){
			rst.push(C[Math.floor(Math.random() * C.length)])
		}
		return rst;
	},
	bettween : function(a,b){
		return Math.floor(Math.random() * (b - a) + a);
	},
	bettweenPercent : function(a,b,l,t){
		return this.bettween(a / l * t, b / l * t)	
	},
	randomColor : function(){
		return "rgb(" + this.bettween(0,255) + "," + this.bettween(0,255) + "," + this.bettween(0,255)+")"
	},
	makePng : function(req,res,opt){
		opt = opt || {}
		var width = opt.width || 100;
		var height = opt.height || 30;
		var bg = opt.bg || "#EEE";
		var fg = opt.fg || "#000";
		var points = opt.points || 50;
		var fontSize = opt.fontSize || 20;

		var l = gm(width, height, bg);
		l = l.stroke(fg).fontSize(fontSize);
		for(var i=0;i<points;i++){
			l = l.drawPoint(Math.floor(Math.random() * width), Math.floor(Math.random() * height))
		}
		var code = this.generateCode();
		session.setCode(res, code.join(""));
		var codeLen = code.length;
		for(var i=0;i<codeLen;i++){
			var startX = i / codeLen * width;
			var endX = (i+1) / codeLen * width - 10;
			l = l.stroke(this.randomColor(),2).fill("#f00")
			l = l.drawText(this.bettween(startX, endX), this.bettween(0.2*height + 10,0.8 * height),code[i]) 
		}

		l.toBuffer('PNG',function(err,buf){
			if(err){
				console.log(err);
				return;
			}
			res.type("png");
			res.send(buf);
		});




	}

}