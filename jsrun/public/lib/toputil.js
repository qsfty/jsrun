define(['jquery'],function($){

	var TopUtil = {
		totop : function(top, cb){
			var top = $(window).scrollTop() > top ? top : $(window).scrollTop();
			$(window).scrollTop(top);
			step = 10;
			runs();
			function runs(){
				j = $(window).scrollTop();
				if(j > 0){
					setTimeout(function(){
						if(j < 100){
							step = 3;
						}
						j -= step;
						$(window).scrollTop(j);
						runs();
					},10);
				}
				else{
					cb && cb();
				}
			}
		},
		tosome : function(step, last, lastTop, cb){
			lastTop = lastTop || 0;
			run();
			function run(){
				top = $(window).scrollTop();
				gap = top - lastTop;
				if(gap > 0){
					setTimeout(function(){
						if(gap < 300){
							step = last;
						}
						top -= step;
						$(window).scrollTop(top);
						run();
					}, 10);
				}
				else{
					cb && cb();
				}
			}
		},
		pageTop : function(item){
			$(item).click(function(){
				TopUtil.totop(200, 10, function(){
					$(item).fadeOut();
				});
			});
			$(window).scroll(function(){
			    if($(window).scrollTop()>0){
			        $(item).fadeIn();
			    }
			    else{
			        $(item).fadeOut();
			    }
			});
		},
		top : function(){
			$(window).scrollTop(0);
		}
	}
	return TopUtil;
});