
/**
 * draggbale 拖拽元素
 * 1.0版本
 * 使用方式：
 * draggable(ele, {
 * 		x : false, //表示水平方向是否可拖拽
 * 		y : true, //表示垂直方向是否可拖拽
 * 		limit : true, //表示活动范围是否限制在定位父元素内
 * 		paddingLeft : 0,  //增加填充，即进一步缩小活动范围
		paddingRight :0,  //增加填充，即进一步缩小活动范围
		paddingTop : 0,  //增加填充，即进一步缩小活动范围
		paddingBottom  : 0,  //增加填充，即进一步缩小活动范围
		maringLeft : 0, //设置margin值，可以消除由于margin带来的拖拽误差，不填则可能会受影响
		marginRight : 0,  //设置margin值，可以消除由于margin带来的拖拽误差，不填则可能会受影响
		marginTop : 0, //设置margin值，可以消除由于margin带来的拖拽误差，不填则可能会受影响
		marginBottom : 0, //设置margin值，可以消除由于margin带来的拖拽误差，不填则可能会受影响
		callback : function(section, distance){
			回调函数，在拖拽过程中不断触发
			两个参数分别为：拖拽元素的可活动范围大小，拖拽元素在可活动范围内的坐标
			section包括，minLeft\maxLeft\minTop\maxTop
			distance包括, x\y
			绑定了this，回调函数中可以直接使用this来指向拖拽元素ele本身
		}
 * })
 * */

(function(){
	//获取元素页面绝对位置
	function offsetPage(obj) {
		var _left = obj.offsetLeft;
		var _top = obj.offsetTop;
		while(obj.offsetParent) {
			_left += obj.offsetParent.offsetLeft;
			_top += obj.offsetParent.offsetTop;
			obj = obj.offsetParent;
		}
		return {
			"left": _left,
			"top": _top
		};
	}
	
	//获取样式
	function getStyle(ele, attr){
		if(ele.currentStyle) {
			return ele.currentStyle[attr];
		} else {
			return getComputedStyle(ele)[attr];
		}
	}
	
	//函数的事件添加
	var addEvent = (function() {
		if(window.VBArray) {
			return function(obj, eventname, func) {
				obj.attachEvent("on" + eventname, func);
			}
		} else {
			return function(obj, eventname, func, isCapture) {
				obj.addEventListener(eventname, func, !!isCapture);
			}
		}
	})();
	
	window.draggable = function(ele, options) {
		//如果定位方式不是absolute，直接返回
		if(getStyle(ele,"position") != "absolute" && getStyle(ele,"position") != "fixed") return;

		if(!options) {
			//如果options不存在，自己创建，给默认值
			var options = {
				x : true,
				y : true,
				limit : true,
				paddingLeft : 0,
				paddingRight :0,
				paddingTop : 0,
				paddingBottom  : 0,
				maringLeft : 0,
				marginRight : 0,
				marginTop : 0,
				marginBottom : 0,
				callback : function(){}
			};
		} else {
			//如果options存在，对于赋值的属性，直接采用，没有赋值的给默认值
			options.x!=undefined ? "" : options.x = true;
			options.y!=undefined ? "" : options.y = true;
			options.limit!=undefined ? "" : options.limit = true;
			options.paddingLeft!=undefined ? "" : options.paddingLeft=0;
			options.paddingRight!=undefined ? "" : options.paddingRight =0;
			options.paddingTop!=undefined ? "" : options.paddingTop=0;
			options.paddingBottom!=undefined ? "" : options.paddingBottom=0;
			options.marginLeft!=undefined ? "" : options.marginLeft=0;
			options.marginRight!=undefined ? "" : options.marginRight=0;
			options.marginTop!=undefined ? "" : options.marginTop=0;
			options.marginBottom!=undefined ? "" : options.marginBottom=0;
			options.callback!=undefined ? "" : options.callback = function(){}; 
		}
		
		
		if(options.limit) { //如果用户设置了限定范围
			
			//计算元素的坐标取值范围
			var section = {
				minLeft : options.paddingLeft - options.marginLeft,
				maxLeft : ele.offsetParent.offsetWidth - ele.offsetWidth - options.paddingRight - options.marginLeft + options.marginRight,
				minTop : options.paddingTop - options.marginTop,
				maxTop : (ele.offsetParent.offsetHeight - ele.offsetHeight) - options.paddingBottom - options.marginTop + options.marginBottom
			}
		}
		
		var startPoint = {
			x: offsetPage(ele).left,
			y: offsetPage(ele).top
		}
		
		addEvent(ele, "mousedown", function(e){
			var e = e || event;
			
			//计算鼠标和要拖拽元素的相对位置
			var mouse = {
				pageX : e.clientX + document.body.scrollLeft || document.documentElement.scrollLeft,
				pageY : e.clientY + document.body.scrollTop || document.documentElement.scrollTop
			}
			mouse.offsetX = mouse.pageX - offsetPage(ele).left + options.marginLeft;
			mouse.offsetY = mouse.pageY - offsetPage(ele).top + options.marginTop;
			
			//添加移动事件
			addEvent(document, "mousemove", move);
			function move(e){
				var e = e || event;
				//计算鼠标当前的页面坐标pageX/Y
				var currentPos = {
					pageX : e.clientX + document.body.scrollLeft || document.documentElement.scrollLeft,
					pageY : e.clientY + document.body.scrollTop || document.documentElement.scrollTop
				}
				
				if(options.limit) { //如果限定范围
					if(options.x) { //如果允许水平拖动
						ele.style.left = Math.min(section.maxLeft ,Math.max(section.minLeft, currentPos.pageX - offsetPage(ele.offsetParent).left - mouse.offsetX)) + "px";
					}
					if(options.y) { //如果允许垂直拖动
						ele.style.top = Math.min(section.maxTop ,Math.max(section.minTop, currentPos.pageY - offsetPage(ele.offsetParent).top - mouse.offsetY)) + "px";
					}
				} else {
					if(options.x) {
						ele.style.left = currentPos.pageX - offsetPage(ele.offsetParent).left - mouse.offsetX + "px";
					}
					if(options.y) {
						ele.style.top = currentPos.pageY - offsetPage(ele.offsetParent).top - mouse.offsetY + "px";
					}
				}
				options.callback.call(ele, section, {x:offsetPage(ele).left - startPoint.x, y:offsetPage(ele).top - startPoint.y});
			}
			addEvent(document, "mouseup", function(e){
				//document.detach("mousemove", move);
				document.removeEventListener("mousemove", move);
			});
		});
		
	}
	
})();


