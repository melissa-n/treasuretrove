// JavaScript Document




$(".tc").click(function(){
	$("#gray").show();
	$("#popup").show();
	tc_center();
});
//click close window button
$("a.guanbi").click(function(){
	$("#gray").hide();
	$("#popup").hide();//查找ID为popup的DIV hide()隐藏
})

//window's location center
$(window).resize(function(){
	tc_center();
});

function tc_center(){
	var _top=($(window).height()-$(".popup").height())/2;
	var _center=($(window).width()-$(".popup").width())/2;
	
	$(".popup").css({top:_top,center:_center});
}	




$(".ac").click(function(){
	$("#gy").show();
	$("#popfoot").show();
	tc_center();
});
//click close window button
$("a.close").click(function(){
	$("#gy").hide();
	$("#popfoot").hide();//查找ID为popup的DIV hide()隐藏
})

//window's location center
$(window).resize(function(){
	ac_acenter();
});

function ac_acenter(){
	var _ftop=($(window).height()-$(".popfoot").height())/2;
	var _acenter=($(window).width()-$(".popfoot").width())/2;
	
	$(".popfoot").css({ftop:_ftop,acenter:_acenter});
}
