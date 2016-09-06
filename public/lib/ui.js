define(['jquery'],function($){
	return {
		getMousePosition : function(event){
			return {
				x : event.pageX,
				y : event.pageY
			}
		},
		getElementPosition : function(ele,outer){
			outer = outer || true;
			var offset = $(ele).offset(),
				w = outer ? $(ele).outerWidth(true) : $(ele).width(),
				h = outer ? $(ele).outerHeight(true) : $(ele).height();
			
			return {
				x : offset.left,
				y : offset.top,
				w : w,
				h : h,
				r : offset.left + w,
				b : offset.top + h
			}
		},
		setElementPosition : function(ele, point){
			$(ele).css({
				"left" : point.x,
				"top" : point.y
			})
		}
	}
});