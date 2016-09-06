var fs = require('fs')
var mdate = require('mdate')
var fd,
	mlevel = 'DEBUG',
	count = 0,
	bufsize = 20480,
	writsize = 1,
	buf = new Buffer(bufsize),
	pos = 0;

function getString(data){
	if(data instanceof(Error)){
		data = data.message;
	}
	if(typeof data == "object"){
		try{
			data = JSON.stringify(data);
		}
		catch (e){
			data = e.message || '无法格式化输出对象';
		}
	}
	if(typeof data == "number"){
		data += "";
	}
	return data;
}

function getNumbermlevel(type){
	var ms = ["DEBUG","INFO","WARN","ERROR"];
	return ms.indexOf(type);
}

function getPos() {
	try {
		throw new Error();
	} catch(e) {
		var msg = e.stack.split('\n')[4];
		if(msg.indexOf("(") >= 0 && msg.indexOf(")") >= 0){
			msg = msg.split("(")[1].split(')')[0].split(':');
		}		
		else{
			msg = msg.split(':');
		}	
		return msg[0].split('/').slice(-1) + ':' + msg[1];
	}
}


function printlog(data, type){
	var level = getNumbermlevel(mlevel);
	var loglevel = getNumbermlevel(type);
	
	var now = mdate.now('datetime');
	//deal data
	data = getString(data);

	var finalLog = now + " " + type + " " + getPos() + " " + data + "\n";
	console.log(finalLog);
	if(loglevel < level || !fd){
		return;
	}
	pos += buf.write(finalLog, pos);
	if(pos >= writsize){
		fs.writeSync(fd, buf, 0, pos);
		pos = 0;
	}
}

module.exports = {
	init : function(conf){
		fd = fs.openSync(conf.logfile, 'a');
		mlevel = conf.level || 'DEBUG';
		writsize = conf.writsize || 1;
	},
	debug : function(data){
		printlog(data, 'DEBUG')
	},
	error : function(data){
		printlog(data, 'ERROR');
	},
	warn : function(data){
		printlog(data, 'WARN');
	},
	info : function(data){
		printlog(data, 'INFO');
	}
}
