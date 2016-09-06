define(['jquery','tool'],function($,tool){
	$.extend({
		confirm : function(opts){
			this.params = $.extend({
				msg : "您确定执行该操作吗?",
				title : "温馨提示",
				dragable : true,
				width : 500, //弹出层的宽度
				height : 120, //内容的高度
				showLayer: true, //是否显示遮罩层
				fnSure : null,
				fnCancel : null
			},opts?opts:{});
			var htmlContent = "";
			var r = Math.floor(Math.random() * 100000 + 1);
			htmlContent +=  '<div class="mywindow" id="win'+r+'">' + 
								'<div class="mywindow_body confirm_body">' + 
									'<div class="confirm_window_msg">'+
										'<span class="confirm_icon">¡</span>' + 
										'<span class="confirm_info_msg">'+this.params.msg+'</span>'+
									'</div>'+
								'</div>'+
								'<div class="mywindow_foot confirm_foot">' +
									'<span class="mywindow_btn mywindow_cancel_btn">' +
										'取消' + 
									'</span>' +
									'<span class="mywindow_btn mywindow_sure_btn">' +
										'确定' +
									'</span>' + 
								'</div>' +
							'</div>';
			$(htmlContent).appendTo("body");
			var _win = $("#win"+r);
			_win.width(this.params.width);
			_win.find(".mywindow_body").height(this.params.height);
			_win.find(".confirm_window_msg").css({"height":this.params.height+"px","line-height":this.params.height+"px"});
			var w = $(window).width();
			var l = (w - this.params.width) / 2;
			_win.css("left",l);
			var b = $(window).height() - _win.outerHeight();
			_win.css("top",-_win.outerHeight());
			_win.show();
			_win.css("top", b/2);
			_win.fadeIn();
			_this = this;
			//添加遮盖层
			if (this.params.showLayer) {
    			$("<div class='cover_layer' id='layer" + r + "'></div>").appendTo("body");
			}


			tool.moveArea(_win,_win.find(".confirm_window_head"));
			_win.find(".mywindow_close_btn").click(function(){
				tool.closeWin(r);
			});
			_win.find(".mywindow_cancel_btn").click(function(){
				tool.closeWin(r,_this.params.fnCancel);
			});	
			_win.find(".mywindow_sure_btn").click(function(){
				if(typeof _this.params.fnSure == "function"){
					_this.params.fnSure();
				}
				tool.closeWin(r);
			});
		},
		showConfirm : function(msg,func,flag){
			msg = msg || '您确定执行该操作吗?';
			$.confirm({
				msg : msg,
				fnSure : func,
				"showLayer" : flag
			});
		}
	});
});
