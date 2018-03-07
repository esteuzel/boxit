$(document).ready(function(){
     
	if(Number($(".BannerSelecters").length) >= 1){
		$(".BannerSelecters").each(function(index){
			var WidthRotator = Number($(this).closest(".Rotator").width());
			var WidthBannerSelecters = Number($(this).width());
			var Left = (WidthRotator / 2) - (WidthBannerSelecters / 2);
			$(this).css("left",Left+"px");
		});
	}
	$(window).resize(function(){
		$(".BannerSelecters").each(function(index){
			var WidthRotator = Number($(this).closest(".Rotator").width());
			var WidthBannerSelecters = Number($(this).width());
			var Left = (WidthRotator / 2) - (WidthBannerSelecters / 2);
			$(this).css("left",Left+"px");
		});
	});
        
        function banner(){
           
            $(".BannerSelecters").each(function(index){
			var WidthRotator = Number($(this).closest(".Rotator").width());
			var WidthBannerSelecters = Number($(this).width());
			var Left = (WidthRotator / 2) - (WidthBannerSelecters / 2);
			$(this).css("left",Left+"px");
		});
            
            
        };
       
	$("body").on("click",".FAQS .FAQ .Title",function(){
		$(".FAQS .FAQ").removeClass("Selected");
		$(this).closest(".FAQ").addClass("Selected");
	});
	$("body").on("click",".Mobile .Top .Menu",function(){
            
            
		$(".MobileMenu").show();
		$("body").css("overflow","hidden");
	});
//	$("body").on("click",".MobileMenu .Menu .Header .Close",function(){
//		$(".MobileMenu").hide();
//		$("body").css("overflow","auto");
//	});
//        
        $("body").on("click",".closeMmenu",function(){
		$(".MobileMenu").hide();
                $(this).closest(".Group").find(".Options").toggle();
		$("body").css("overflow","auto");
	});
        
//	$("body").on("click", ".desplegable", function(){
//          
//		$(this).closest(".Group").find(".Options").toggle();
//	});
//        
//        $("body").on("click", ".desplegableUsu", function(){
//          
//		$(this).closest(".Group").find(".Options").toggle();
//	});
	$("body").on("click",".BoxitStoreContainer .ShoppingTrends .Arrow",function(){
		var NextBack = "";
		if($(this).hasClass("Next")){
			NextBack = "Next";
		}else{
			if($(this).hasClass("Back")){
				NextBack = "Back";
			}
		}
		CalculateShoppingTrendsScroll(NextBack);
		$(".BoxitStoreContainer .ShoppingTrends .Trends").stop().animate({
			scrollLeft: Left
		}, 200)
		var leftTmp = $(".BoxitStoreContainer .ShoppingTrends .Trends").offset().left;
		if(Left <= 0){
			$(".BoxitStoreContainer .ShoppingTrends .Trends").stop().animate({
				scrollLeft: 0
			}, 200);
			Left = 0;
		}
		if(Left >= Number(widthTmp - $(".BoxitStoreContainer .ShoppingTrends .Trends").width())){
			$(".BoxitStoreContainer .ShoppingTrends .Trends").stop().animate({
				scrollLeft: Number(widthTmp - $(".BoxitStoreContainer .ShoppingTrends .Trends").width())
			}, 200);
			Left = Number(widthTmp - $(".BoxitStoreContainer .ShoppingTrends .Trends").width());
		}
	});
	var widthTmp = 0;
	$(".BoxitStoreContainer .ShoppingTrends .Trends .Product").each(function(index){
		widthTmp = widthTmp + $(this).width();
	});
	
	function CalculateShoppingTrendsScroll(NextBack){
		var leftTmp = 400;
		switch(NextBack){
			case "Next":
				if(Left < widthTmp){
					Left = Left + leftTmp;
				}
			break;
			case "Back":
				if(Left > 0){
					Left = Left - leftTmp;
				}
			break;
		}
	}
})

function validar_opcion_centeraste(){
    $("#input_otraopcion").val('');
    if($("#select_CEnteraste").val()=='4' || $("#select_CEnteraste").val()=='5'){
        $("#td_otraopcion").show();
       $("#input_otraopcion").attr("placeholder", "Ingrese Nombre y PTY");
    }else{
        if($("#select_CEnteraste").val()=='6'){
          $("#td_otraopcion").show();
          $("#input_otraopcion").attr("placeholder", "Ingrese Otra Opción");
        }else{
           if($("#select_CEnteraste").val()=='7'){
                 $("#td_otraopcion").show();
                 $("#input_otraopcion").attr("placeholder", "Ingrese Código Promo");
           }else{
            $("#td_otraopcion").hide();
            $("#input_otraopcion").attr("placeholder", " ");
           }
        }
    }
}

function mostrar_campo_otracategoria(valuecheck){
    $("#input_otracategoria").val('');
    if($("#"+valuecheck).is(':checked') && valuecheck=='9'){
        $("#tr_otracategoria").show();
    }else{
        $("#tr_otracategoria").hide();
    }
}

function info_boxit_seleccionado(){
	 $("#info_boxit_sel").val('');
	 switch ($("#select_boxit_user").val())
	 {
	 	case 'object:23':{
	 		 $("#info_boxit_sel").val('Ciudad del Saber, Calle Evelio Lara, Casa 138-B (Lunes a Viernes, 8:30AM-5:30PM)');
	 		break;
	 	}
	 	case 'object:24':{
	 		 $("#info_boxit_sel").val('La Cresta, Zaz Food Store, en la estación Delta al lado de la Entrada de Hossana. (Todos los días, 24 horas)');
	 		break;
	 	}
	 	case 'object:25':{
	 		 $("#info_boxit_sel").val('Ciudad del Saber, a un costado de la Plaza.(Todos los días, 24 horas)');
	 		break;
	 	}
	 	case 'object:26':{
	 		 $("#info_boxit_sel").val('Vía España, La Sabana, Zaz Food store, en estación Delta al lado de Consultorios América (Carrasquilla). (Todos los días, 24 horas)');
	 		break;
	 	}
	 	case 'object:27':{
	 		 $("#info_boxit_sel").val('Vía Israel, próximo a ELMEC, frente a la calle 76 (Istmo Pub). Plaza City Point, dentro del local Super Gourmet. (Todos los días, de 9AM A 10PM)');
	 		break;
	 	}
	 	default:{
	 		 $("#info_boxit_sel").val('');
	 		break;
	 	}
	 }

}