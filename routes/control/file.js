
require('mstr')
var mjax = require('mjax')
exports.fork = function(req,res){
    var id = req.body.id;

    //查询旧的
    req.models.file.get({'uuid':id}).
    then(function(data){
        if(data == null){
            return mjax.failure(res, "Fork失败,不存在此代码")
        }

        data.name = req.body.name;
        data.catalog_id = req.body.catalog_id;
        req.models.file.insert(data, function(e, uuid){
            return mjax.success(res, uuid);
        })
    })
}

exports.download = function(req,res){
    var id = req.params.id;
    req.models.file.get({'uuid':id})
        .then(function(data){
            if(data == null){
                return mjax.failure(res, "下载失败，不存在此代码");
            }
            
            res.renderPage("show", {data : getHtml(data)}, "content");
        });
}

exports.show = function(req, res) {
	var id = req.params.id;
	req.models.file.get({'uuid':id})
		.then(function(data){
			if(data == null){
				return res.redirect("/404");
			}
			console.log(getHtml(data));
			res.renderPage("show", {data : getHtml(data)}, "content");
		});
}


function decode(d){
	if(d == null || d.trim() == ""){
		return "";
	}
	var s = new Buffer(d,"base64");
	return s.toString();
}


function getHtml(data) {
    var source = decode(data.html);
    var css = decode(data.css);
    var js = decode(data.js);


    var htmlContent = '<html lang="en">';
    if (source.indexOf("<html") >= 0 && source.indexOf("</html>") >= 0) {
        if (source.indexOf("<head>") >= 0) {
            htmlContent = source.slice(0, source.indexOf("<head>"));
        } else if (source.indexOf("<body>" >= 0)) {
            htmlContent = source.slice(0, source.indexOf("<body>"));
        }
    }

    var headContent = getElement(source, "head");
    var bodyContent = getElement(source, "body");

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

    return finalHtml;

}
function getElement(source, ele) {
    var nsource = source.toLowerCase();
    var l = nsource.indexOf("<" + ele + ">");
    var r = nsource.indexOf("</" + ele + ">");
    if (l >= 0 && r >= 0 && l < r) {
        return source.slice(l + 6, r);
    } else {
        return '';
    }
}