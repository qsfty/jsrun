var _m = {
    parseObjToCss : function (obj) {
        var result = "";
        for (var key in obj) {
            result += key + ":" + obj[key] + ";"
        }
        return result;
    },
    showMessage: function(opts) {
        var _default = $.extend({
            "msg": "操作成功",
            "successColor": "#44B549",
            "warnColor": "#EAA000",
            "errorColor": "#F74040",
            "state": "success",
        }, opts || {});

        var cssStyle = {
            "position": "fixed",
            "bottom": "-35px",
            // "right" : "10px",
            "color": "#FFFFFF",
            "background-color": _default[_default.state + "Color"],
            "font-style": "MicroYahei",
            "font-size": "14px",
            "width": "300px",
            "height": "35px",
            "line-height": "35px",
            "text-align": "center",
            "z-index" : "1000"
        }

        var r = Math.floor(Math.random() * 100000);
        $("<div>", {
            "id": "msg_" + r,
            "style": _m.parseObjToCss(cssStyle),
            "html": _default.msg
        }).appendTo("body");

        //获取宽度
        var width = $("#msg_" + r).outerWidth();
        var winWidth = window.innerWidth;

        $("#msg_" + r).css("left", (winWidth - width) / 2);

        $("#msg_" + r).animate({
            "bottom": "0px"
        })

        setTimeout(function() {
            $("#msg_" + r).fadeOut(function() {
                $("#msg_" + r).remove();
            });
        }, 2000);
    }
   
}

$.extend({
    success: function(msg) {
        _m.showMessage({
            "msg": msg,
            "state": "success"
        });
    },
    warn: function(msg) {
        _m.showMessage({
            "msg": msg,
            "state": "warn"
        });
    },
    error: function(msg) {
        _m.showMessage({
            "msg": msg,
            "state": "error"
        })
    }
});

