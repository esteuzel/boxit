$(document).ready(function(){
	RotatorsInit();
	setInterval(Rotate, 6000);
	function RotatorsInit(){
		$(".Rotator").each(function(indexRotator){
			if($(this).attr("autoplay")){
				$(this).children("div:nth-child(1)").css("display","block");
				$(this).children(".BannerSelecters").children(".Banner").each(function(index){
					if(index == 0){
						$(this).addClass("Selected");
					}else{
						$(this).removeClass("Selected");
					}
				});
			}
		});
	}
	function Rotate(){
		$(".Rotator").each(function(indexRotator){
			if($(this).attr("autoplay")){
				var NumbersOfBanners = Number($(this).children("div").length) - 1;
				var $Object = $(this);
				var NextIndex = 0;
				$(this).children("div").each(function(index){
					if(!$(this).hasClass("BannerSelecters")){
						var Display = $(this).css("display");
						if(Display == "block"){
							if(index >= (NumbersOfBanners - 1)){
								NextIndex = 0;
							}else{
								NextIndex = index + 1
							}
						}else{

						}
					}
				});
				$(this).children("div").css("display","none");
				$(this).children(".BannerSelecters").css("display","block");
				$(this).children(".BannerSelecters").children(".Banner").removeClass("Selected");
				$(this).children(".BannerSelecters").children(".Banner:nth-child("+ Number(NextIndex + 1) +")").addClass("Selected");
				$(this).children("div:nth-child("+ Number(NextIndex + 1) +")").css("display","block");
			}
		});
	}
	function RotateNext(object,NextBack){
		var NumbersOfBanners = Number($(object).children("div").length) - 1;
		var $Object = $(object);
		var NextIndex = null;
		$(object).children("div").each(function(index){
			if(!$(this).hasClass("BannerSelecters")){
				var Display = $(this).css("display");
				$()
				if(Display == "block"){
					if(index >= (NumbersOfBanners - 1)){
						switch(NextBack){
							case "Next":
							break;
							case "Back":
								NextIndex = index - 1;
							break;
						}

					}else{
						switch(NextBack){
							case "Next":
								NextIndex = index + 1;
							break;
							case "Back":
								if(index > 0){
									NextIndex = index - 1;
								}
							break;
						}
					}
				}else{

				}
			}
		});
		if(NextIndex != null){
			$(object).children("div").css("display","none");
			$(object).children(".BannerSelecters").css("display","block");
			$(object).children(".BannerSelecters").children(".Banner").removeClass("Selected");
			$(object).children(".BannerSelecters").children(".Banner:nth-child("+ Number(NextIndex + 2) +")").addClass("Selected");
			$(object).children("div:nth-child("+ Number(NextIndex + 1) +")").css("display","block");
		}
	}
	function RotateClick(object, index){
		var indexDiv = index;
		if(Number($(object).find(".NextBack").length)){
			indexDiv = index - 1;
		}
		object.children("div").css("display","none");
		object.children(".BannerSelecters").css("display","block");
		object.children(".BannerSelecters").children(".Banner").removeClass("Selected");
		object.children(".BannerSelecters").children(".Banner:nth-child("+ Number(index + 1) +")").addClass("Selected");
		object.children("div:nth-child("+ Number(indexDiv + 1) +")").css("display","block");
	}
	$("body").on("click",".BannerSelecters .Banner",function(){
		var $Object = $(this).closest(".BannerSelecters").closest(".Rotator");
		var index = $(this).index();
		RotateClick($Object,index);
	});
	$("body").on("click",".BannerSelecters .NextBack",function(){
		var $Object = $(this).closest(".BannerSelecters").closest(".Rotator");
		var Next = $(this).hasClass("Next");
		var Back = $(this).hasClass("Back");
		var NextBack = "";
		if(Next){
			NextBack = "Next";
		}else{
			if(Back){
				NextBack = "Back";
			}
		}
		RotateNext($Object,NextBack);
	});
});