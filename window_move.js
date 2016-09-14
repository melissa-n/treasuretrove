// JavaScript Document



$(document).ready(function(){ 

	$(".top_nav").mousedown(function(e){ 
		$(this).css("cursor","move");//change the cursor from 
		var offset = $(this).offset();//the location of DIV(in the page) 
		var x = e.pageX - offset.left;
		var y = e.pageY - offset.top;
		$(document).bind("mousemove",function(ev){ 
		
			$(".popup").stop();
			
			var _x = ev.pageX - x;//Get the value of the X axis direction 
			var _y = ev.pageY - y;//Get the value of the Y axis direction 
		
			$(".popup").animate({left:_x+"px",top:_y+"px"},10); 
		}); 

	}); 

	$(document).mouseup(function() { 
		$(".popup").css("cursor","default"); 
		$(this).unbind("mousemove"); 
	});
}) 



$(document).ready(function(){ 

	$(".ftop_nav").mousedown(function(e){ 
		$(this).css("cursor","move");//change the cursor from 
		var offset = $(this).offset();//the location of DIV(in the page) 
		var x = e.pageX - offset.left;
		var y = e.pageY - offset.top;
		$(document).bind("mousemove",function(ev){ 
		
			$(".popfoot").stop();
			
			var _x = ev.pageX - x;//Get the value of the X axis direction 
			var _y = ev.pageY - y;//Get the value of the Y axis direction 
		
			$(".popfoot").animate({left:_x+"px",top:_y+"px"},10); 
		}); 

	}); 

	$(document).mouseup(function() { 
		$(".popfoot").css("cursor","default"); 
		$(this).unbind("mousemove"); 
	});
}) 