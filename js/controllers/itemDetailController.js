angular
    .module('boxit')
    .controller('itemDetailController', ['$scope', '$stateParams', 'userData', '$uibModal', '$q' , '$window','$http', '$state',
        function ($scope, $stateParams, userData, $uibModal, $q, $window, $http, $state) {

            var item = $stateParams.itemId;
            var currentIdItem = $stateParams.itemId;
            var currentItemObject = null;
            $scope.showZise = false;
            $scope.ShowColor = false;
            $scope.showCombination = false;
            $scope.showVariationsArray = false;
            $scope.showVariationsObject = false;
            $scope.showFeature = false;
            $scope.disabledAdd = false;
            $scope.loadMain = true;
            $scope.showMain = false;
            var usrObj = userData.getData();
            if (usrObj != undefined) {
                userId = usrObj.IdCliente;
                $scope.UserName = usrObj.UserName;
            } else {
                userId = 0;
            }
            $scope.showEmptyMessage = false;
            $scope.cantidad = 0;

            userData.getItemDetails($stateParams.itemId).then(function success(item) {
            console.log('item',item);
               if (item != undefined) {
                $scope.itemSelected = item.Item;
                   $scope.titulo = item.Item.Attributes.Title;
                   $scope.texto = getDescription(item).trim();
                   $scope.imgUrl = item.Item.Image.ImageUrl;
                   //$scope.itemPrice = item.Item.Offers.Offer.OfferListing.Price.FormattedPrice;
                   //amount = item.Item.Offers.Offer.OfferListing.Price.Amount;
                   $scope.itemPrice = getItemPrice(item.Item);//item.Item.OfferSummary.ListPrice.FormattedPrice;
                   console.log($scope.itemPrice);
                   amount = item.Item.OfferSummary.ListPrice.Amount;
                   $scope.itemDiscount = getItemDiscount(item.Item);
                   console.log('itemDiscount',$scope.itemDiscount);
                   if(item.Item.Attributes.PackageDimensions != null){
                    $scope.peso = item.Item.Attributes.PackageDimensions.Weight == null ? 0 : Math.ceil(item.Item.Attributes.PackageDimensions.Weight / 100);
                   }else{
                    $scope.peso = 0;
                   }
                   
                   setItemData(item);
                   setItemVariation(item);
               }
            });
            function getItemDiscount(value){
                let discount = {'haveDiscount':'','PercentageSaved':'','AmountSaved':'','priceOld':'','priceToShow':'',};
                if(value.Offers!=null){                                                      
                    if(value.Offers.Offer!=null){
                        if(value.Offers.Offer.OfferListing!=null){
                            if(value.Offers.Offer.OfferListing.PercentageSaved!=null){
                            /*console.log("value",value);
                            console.log("Offers.Offer.OfferListing.PercentageSaved",value.Offers.Offer.OfferListing.PercentageSaved);
                            console.log("Offers.Offer.AmountSaved.FormattedPrice",value.Offers.Offer.OfferListing.AmountSaved.FormattedPrice);
                            console.log("Offers.Offer.OfferListing.Price.FormattedPrice",value.Offers.Offer.OfferListing.Price.FormattedPrice);*/
                            discount.PercentageSaved=value.Offers.Offer.OfferListing.PercentageSaved;
                            discount.AmountSaved=value.Offers.Offer.OfferListing.AmountSaved.FormattedPrice;
                            discount.priceOld=value.Offers.Offer.OfferListing.Price.FormattedPrice;

                            discount.priceOld = (parseFloat(value.Offers.Offer.OfferListing.AmountSaved.Amount) + parseFloat(value.Offers.Offer.OfferListing.Price.Amount)) / 100;
                            discount.priceOld = "$" + parseFloat(Math.round(discount.priceOld * 100) / 100).toFixed(2);


                            discount.haveDiscount = false;
                            value.PercentageSaved=value.Offers.Offer.OfferListing.PercentageSaved;
                            value.AmountSaved=value.Offers.Offer.OfferListing.AmountSaved.FormattedPrice;
                            //value.priceToShow=value.Offers.Offer.OfferListing.Price.FormattedPrice;
                                value.priceOld=value.Offers.Offer.OfferListing.Price.FormattedPrice;
                                value.haveDiscount = false;
                                if(value.Offers.Offer.OfferListing.PercentageSaved!=null 
                                    && value.Offers.Offer.OfferListing.AmountSaved!=null 
                                    && value.Offers.Offer.OfferListing.AmountSaved.FormattedPrice!= null){
                                        value.haveDiscount = true;
                                        //value.priceToShow=value.OfferSummary.ListPrice.FormattedPrice;
                                        value.priceToShow=value.Offers.Offer.OfferListing.Price.FormattedPrice;
                                        discount.haveDiscount = true;
                                        //discount.priceToShow=value.OfferSummary.ListPrice.FormattedPrice;
                                        discount.priceToShow=value.Offers.Offer.OfferListing.Price.FormattedPrice;
                                }                            
                            }
                        }
                    }
                }
                     console.log('discount',discount);
                     return discount;
            }
            
            function goToTopBody(){
                $('html,body').animate({
                    scrollTop: (1)
                }, 1000);
            }
            setTimeout(goToTopBody, 200);

            function setItemData(item) {
                currentIdItem = item.Item.ItemId;
                currentItemObject = item;
                //console.log('setItemData currentItemObject',currentItemObject);
                $scope.itemCode = currentIdItem;
                $scope.userNotLogged = usrObj === undefined;
                $scope.titulo = item.Item.Attributes.Title;
                $scope.texto = getDescription(item).trim();
                $scope.imgUrl = item.Item.Image.ImageUrl;                
                $scope.cantidad = 1;
                //$scope.itemPrice = item.Item.OfferSummary.ListPrice == null ? 0 : item.Item.OfferSummary.ListPrice.FormattedPrice;
                $scope.itemPrice = getItemPrice(item.Item);
                //$scope.itemPrice = item.Item.Offers.Offer == null ? 0 : item.Item.Offers.Offer.OfferListing.Price.FormattedPrice;
                var amount = getItemAmount(item.Item);//item.Item.OfferSummary.ListPrice == null ? 0 : item.Item.OfferSummary.ListPrice.Amount;
                //var amount = item.Item.Offers.Offer == null ? 0 : item.Item.Offers.Offer.OfferListing.Price.Amount;
                
                $scope.amount = amount;
                //console.log('userNotLogged',$scope.userNotLogged);
                //console.log(amount == 0);
                //console.log($scope.itemPrice == 0);
                //console.log(($scope.itemPrice == 0 || amount == 0 || $scope.userNotLogged));
                $scope.disabledAdd = ($scope.itemPrice == 0 || amount == 0 || $scope.userNotLogged);
                if($scope.disabledAdd){
                    $scope.tooltip = "Por favor iniciar sesion para añadir articulos"
                }else{
                    $scope.tooltip="";
                }
                $scope.total = numeral(( amount * $scope.cantidad) / 100).format('$0,0.00');
                $scope.showMain = true;
                $scope.loadMain = false;
                
                if(item.Item.Attributes.PackageDimensions != null){
                    $scope.peso = item.Item.Attributes.PackageDimensions.Weight == null ? 0 : Math.ceil(item.Item.Attributes.PackageDimensions.Weight / 100);
                   }else{
                    $scope.peso = 0;
                   }
                getCar();
            }

            function getItemVariation(item) {
                var defered = $q.defer();
                var promise = defered.promise;
                var id = item.Item.ItemIdParent != null && item.Item.ItemIdParent != undefined ? item.Item.ItemIdParent : item.Item.ItemId;
                $http({
                    method: "POST",
                    url: userData.getHost() + "/amazon/amazongetitemidvariations",
                    data: {
                        "ItemId": id
                    },
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(function success(result) {
                    if(result.data.Item.Variations != null && result.data.Item.Variations != undefined){
                        defered.resolve(result.data.Item.Variations);
                    }
                },function error(result) {
                  defered.reject(result);
                });
                return promise;
            }

            function setItemVariation(item) {
                var colorExist = false;
                var sizeExist = false;
                getItemVariation(item).then(function success(result) {
                    if (result == null) {
                        if (item.Item.Attributes.Size != null) {
                            $scope.showZise = true;
                            $scope.size = item.Item.Attributes.Size;
                            sizeExist = true;
                        }
                        if (item.Item.Attributes.Color != null) {
                            $scope.ShowColor = true;
                            $scope.color = item.Item.Attributes.Color;
                            colorExist = true;
                        }
                        if (sizeExist && colorExist) {
                            $scope.showCombination = true;
                        }
                    }else {
                        variationExist(result);
                    }
                },function error(result) {
                    console.log(result);
                });
            }

            function variationExist(result) {
                if ($scope.variations == null || $scope.variations == undefined) {
                    $scope.variations = result.Item;
                }
                console.log('$scope.variations',$scope.variations);
                if ($scope.variations instanceof Array) {
                    if ($scope.variations[0].VariationAttributes.VariationAttribute instanceof Array) {
                        $scope.showVariationsArray = true;
                    }else{
                        $scope.showVariationsObject = true;
                        console.log($scope.variations);
                    }
                }
                if ($scope.variation != null && $scope.variation != undefined) {
                    if ($scope.variation.VariationAttributes.VariationAttribute instanceof Array) {
                        if ($scope.variation.VariationAttributes.VariationAttribute[0].Value != null) {
                            $scope.showZise = true;
                            $scope.size = $scope.variation.VariationAttributes.VariationAttribute[0].Value;
                        }
                        if ($scope.variation.VariationAttributes.VariationAttribute[1].Value != null) {
                            $scope.ShowColor = true;
                            $scope.color = $scope.variation.VariationAttributes.VariationAttribute[1].Value;
                        }
                    } else {
                        $scope.showFeature = true;
                        console.log($scope.variation.VariationAttributes.VariationAttribute);
                        $scope.featureName = $scope.variation.VariationAttributes.VariationAttribute.Name;
                        $scope.featureValue = $scope.variation.VariationAttributes.VariationAttribute.Value;
                    }
                }
            }

            $scope.refreshItem = function () {
                $scope.loadMain = true;
                if ($scope.variation != null && $scope.variation != undefined) {
                    userData.getItemDetails($scope.variation.ItemId).then(function success(result) {
                        setItemData(result);
                        setItemVariation(result);
                        $scope.loadMain = false;
                    }, function error(result) {
                        console.log(result);
                        $scope.loadMain = false;
                    });
                }
            };

            function getDescription(item) {
                var description = "";
                if (item.Item.Attributes.Feature != undefined) {
                    if (item.Item.Attributes.Feature.length != null && typeof item.Item.Attributes.Feature === "string") {
                        description = item.Item.Attributes.Feature;
                    } else {
                        if (item.Item.Attributes.Feature.length != null) {
                            for (var i = 0; i < item.Item.Attributes.Feature.length; i++) {
                                description = description.concat(" ", item.Item.Attributes.Feature[i]);
                            }
                        }
                    }
                } else {
                    description = "Descripcion no Disponible"
                }
                return description;
            }

            var getCar = function () {               
                userData.getShoppingCar(userId).then(function success(result) {
                    console.log('getCar',result);
                    //refreshCarNumber(result);
                    calcularTotal(result);
                    return result;
                }, function error(result) {
                    console.log('getCar',result);
                });
            };

            $scope.addToCar = function () {
                moveToCart();
                itemadded = $scope.itemSelected;
                console.log('addToCar itemadded',itemadded);
                var args = {};
                    args["IdCliente"] = userData.getData().IdCliente;                    
                    args["ItemId"] = currentItemObject.Item.ItemId;
                    args["OfferListingId"] = "";
                    //args["Price"] = currentItemObject.Item.Offers.Offer.OfferListing.Price.Amount / 100;
                    //args["Price"] = currentItemObject.Item.OfferSummary.ListPrice.Amount / 100;
                    let itemAmount = getItemAmount(currentItemObject.Item);
                    args["Price"] = itemAmount / 100;
                    
                    // PackageDimensions 
                    if(currentItemObject.Item.Attributes.PackageDimensions != null){
                    args["Height"] = currentItemObject.Item.Attributes.PackageDimensions.Height == null ? 0 : currentItemObject.Item.Attributes.PackageDimensions.Height;
                    args["Length"] = currentItemObject.Item.Attributes.PackageDimensions.Length == null ? 0 : currentItemObject.Item.Attributes.PackageDimensions.Length;
                    args["Width"] = currentItemObject.Item.Attributes.PackageDimensions.Width == null ? 0 : currentItemObject.Item.Attributes.PackageDimensions.Width;
                    args["Weight"] = currentItemObject.Item.Attributes.PackageDimensions.Weight == null ? 0 : currentItemObject.Item.Attributes.PackageDimensions.Weight;
                    }else{
                        args["Height"] = 0;
                        args["Length"] = 0;
                        args["Width"] = 0;
                        args["Weight"] = 0;
                    }              
                    // Image
                    args["UrlImage"] = currentItemObject.Item.Image.ImageUrl;
                    args["Title"] = currentItemObject.Item.Attributes.Title;
                    

                if ($scope.cantidad == 0 || $scope.cantidad === undefined) {
                    args["Quantity"] = "0";
                } else {
                    args["Quantity"] = $scope.cantidad;
                }
                console.log('args', args);
                
                userData.addItemToCar(args).then(function success(result) {
                    //refreshCarNumber(result);
                    calcularTotal(result);
                    //$uibModalInstance.close();
                    console.log('addItemToCar', result);
                }, function error(result) {
                    console.log(result);
                });
            };

             /*var refreshCarNumber = function (result) {
                /* $scope.showCarItems = false;
                $scope.showLoginMessage = false;
                $scope.loading = true;
                
                if (result.data.Data.Cart != undefined) {
                    if (result.data.Data.Cart.CartItems != undefined || result.data.Data.Cart.CartItems != null) {
                        if (null !== result.data.Data.Cart.CartItems) {
                            if ($.isArray(result.data.Data.Cart.CartItems.CartItem)) {
                                $scope.carItems = result.data.Data.Cart.CartItems.CartItem;
                            } else {
                                var Items = [];
                                Items.push(result.data.Data.Cart.CartItems.CartItem);
                                $scope.carItems = Items;
                            }
                            $scope.subTotal = result.data.Data.Cart.CartItems.SubTotal.FormattedPrice;
                            $scope.amazonLink = result.data.Data.Cart.PurchaseURL;
                            $scope.carNumber = calcularTotal($scope.carItems);
                            console.log('$scope.carNumber',$scope.carNumber);   
                            angular.element(document.getElementById('cartNumber')).scope().carNumber = $scope.carNumber;
                        } else {
                            getCar();
                        }
                    } else {
                        $scope.carNumber = 0;
                        angular.element(document.getElementById('cartNumber')).scope().carNumber = $scope.carNumber;
                        $scope.subTotal = 0;
                        $scope.showEmptyMessage = true;
                    }
                } else {
                    $scope.subTotal = 0;
                    $scope.carNumber = 0;
                    angular.element(document.getElementById('cartNumber')).scope().carNumber = $scope.carNumber;
                    $scope.showCarItems = false;
                    if (usrObj == undefined) {
                        $scope.showLoginMessage = true;
                    }
                }
                
            }; */
            function calcularTotal(carItems) {
                userData.getAmazonCountItemCart(userId).then(function success(result) {       
                    console.log(result);               
                    $scope.carNumber = result.data.Data.Cart.Quantity;
                    return result.data.Data.Cart.Quantity;
                }, function error(result) {
                    console.log(result);
                });               
            }

            $scope.refreshTotal = function () {
                console.log("refreshTotal");                
                $scope.total = numeral(($scope.amount * $scope.cantidad) / 100).format('$0,0.00');
                console.log("total",$scope.total);
            };

            $scope.sumTotal = function () {
                var result = document.getElementById('qty'); 
                var qty = result.value; 
                if( !isNaN( qty )) {
                    result.value++; 
                    qty++;
                    $scope.cantidad = qty;
                    $scope.refreshTotal();
                }
            };

            $scope.restTotal = function () {
                var result = document.getElementById('qty'); 
                var qty = result.value; 
                if(qty > 1) {
                    result.value--; 
                    qty--;
                    $scope.cantidad = qty;
                    $scope.refreshTotal();
                }
            };
            
            $scope.showShoppingCar = function () {
                $state.go('modal');
            };

            function moveToCart(id,cat){
                let boxitBartop = angular.element(document.getElementById('store-itemdetail-top'));             
                var body = $("html, body");
                body.stop().animate({scrollTop:0}, 700, 'swing', function() {});
                var itemImg = "item-image";
                console.log('move');
                flyToElement(itemImg, '.cart_anchor');
            }

            function flyToElement(flyer, flyingTo) { 
                //var $func = $(this);
                let flyer_var = angular.element(document.getElementById(flyer));
                var divider = 3;
                var flyerClone = flyer_var.clone();
                $(flyerClone).css({position: 'absolute', top: flyer_var.offset().top + "px", left: flyer_var.offset().left + "px", opacity: 1, 'z-index': 1000});
                $(flyerClone).addClass("moveme");
                $('body').append($(flyerClone));                
                var gotoX = $(flyingTo).offset().left + ($(flyingTo).width() / 2) - (flyer_var.width()/divider)/2;
                var gotoY = $(flyingTo).offset().top + ($(flyingTo).height() / 2) - (flyer_var.height()/divider)/2;                
                $(flyerClone).animate({
                    opacity: 0.4,
                    left: gotoX,
                    top: gotoY,
                    width: flyer_var.width()/divider,
                    height: flyer_var.height()/divider
                }, 700,
                function () {
                    $(flyingTo).fadeOut('fast', function () {
                        $(flyingTo).fadeIn('fast', function () {
                            $(flyerClone).fadeOut('fast', function () {
                                //$(flyerClone).remove();
                            });
                        });
                    });
                });
            }
            $scope.$on("$destroy", function handler() {
                $('.navbar').removeClass('white');
            });            
            $('.navbar').addClass('white');

            $scope.doTheBack = function() {
                window.history.back();
              };//ng-click="doTheBack()"
            
            function getItemPrice(value){
                if(value.OfferSummary!=null){
                    if(value.OfferSummary.ListPrice!=null){
                        if(value.OfferSummary.ListPrice.FormattedPrice!=null){
                            value.priceToShow=value.OfferSummary.ListPrice.FormattedPrice;
                        }
                    }
                }
                if(value.Offers.Offer!=null){
                    if(value.Offers.Offer.OfferListing!=null){
                        if(value.Offers.Offer.OfferListing.Price!=null){
                            if(value.Offers.Offer.OfferListing.Price.FormattedPrice!=null){
                                value.priceToShow=value.Offers.Offer.OfferListing.Price.FormattedPrice;
                            }
                        }
                    }
                }
                if(value.priceToShow=="Too low to display"){
                    //console.log("value.priceToShow",value.Price_FormattedPrice);
                    value.priceToShow=value.Attributes.ListPrice.FormattedPrice;
                }                
                
                return value.priceToShow;
            }

            function getItemAmount(value){
                if(value.OfferSummary.ListPrice != null){
                    if(value.OfferSummary.ListPrice.Amount != null){
                        if(value.OfferSummary.ListPrice.Amount!="Too low to display"){
                            return value.OfferSummary.ListPrice.Amount;
                        }
                    }
                }

                if(value.Offers.Offer!=null){
                    if(value.Offers.Offer.OfferListing!=null){
                        if(value.Offers.Offer.OfferListing.Price!=null){
                            if(value.Offers.Offer.OfferListing.Price.Amount!=null){
                                if(value.OfferSummary.ListPrice.Amount!="Too low to display"){
                                    return value.Offers.Offer.OfferListing.Price.Amount;
                                }
                            }
                        }
                    }
                }

                if(value.Attributes != null){
                    if(value.Attributes.ListPrice != null){
                        if(value.Attributes.ListPrice.Amount != null){
                            if(value.Attributes.ListPrice.Amount!="Too low to display"){
                                return value.Attributes.ListPrice.Amount;
                            }
                        }                        
                    }
                }
            }

            showSimilaritiesProducts();

            function showSimilaritiesProducts(){
                
                $scope.similaritiesProducts=[];
                getAmazonGetSimilarities($stateParams.itemId).then(function success(result) {                      
                        console.log('getAmazonGetSimilarities',result);
                        angular.forEach(result.data.Item, function(value, key) {
                            //console.log("value" , value );
                            value = getSimilaritiesNewValue(value);
                            if(value!=null && value.priceToShow!=''){
                                $scope.similaritiesProducts.push(value);
                            }else{
                                //value.priceToShow='';
                            }
                            //$scope.similaritiesProducts.push(value);
                        });
                        if ($scope.similaritiesProducts.length != null && $scope.similaritiesProducts.length > 0) {
                            $scope.mostrarSimilaritiesProducts = true;
                            
                            $scope.similaritiesProductsUno= {};
                            $scope.similaritiesProductsDos= {};
                            $scope.similaritiesProductsTres= {};
                            $x=0;
                            angular.forEach($scope.similaritiesProducts, function(value, key) {
                                if($x<4){
                                    $scope.similaritiesProductsUno[$x] = value;
                                    $scope.similaritiesProductsUnoShowing = true;
                                }else if($x<8){
                                    $scope.similaritiesProductsDos[$x] = value;
                                    $scope.similaritiesProductsDosShowing = true;
                                }else if($x<12){
                                    $scope.similaritiesProductsTres[$x] = value;
                                    $scope.similaritiesProductsTresShowing = true;
                                    console.log('$scope.similaritiesProductsTresShowing',$scope.similaritiesProductsTresShowing);
                                }
                                $x++;
                            }); 
                        }

                        //$scope.Items = $scope.subcategoryProducts;
                        console.log('$scope.similaritiesProducts',$scope.similaritiesProducts);
                        
                }, function error(result) {
                        console.log(result);
                });                 
            }

            function getAmazonGetSimilarities(ItemId) {
                var defered = $q.defer();
                var promise = defered.promise;
                $http({
                    method: "POST",
                    url: userData.getHost() + "/amazon/amazongetsimilarities",
                    data: {
                        "ItemId": ItemId
                    },
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(function success(result) {
                    defered.resolve(result);
                }, function error(result) {
                    defered.reject(result);
                });
                return promise;
            }

            function getSimilaritiesNewValue(value){
                value.priceToShow = 0;
                if(!value.ItemId || value.ItemId==null){ return null; }
                if(!value.Image || value.Image==null){ return null; }  
                
                if(value.Offers!=null){                                                           
                    if(value.Offers.Offer!=null){
                        if(value.Offers.Offer.OfferListing!=null){
                            if(value.Offers.Offer.OfferListing.Price!=null){
                                value.priceToShow=value.Offers.Offer.OfferListing.Price.FormattedPrice;                                
                                
                            }
                        }
                    }
                }

                if(value.priceToShow==""){
                    if(value.Attributes!=null){  
                        if(value.Attributes.ListPrice!=null){
                            if(value.Attributes.ListPrice.FormattedPrice!=null){
                                value.priceToShow=value.Attributes.ListPrice.FormattedPrice;
                            }
                        }
                    }
                }

                if(value.priceToShow==""){
                    if(value.OfferSummary!=null){
                        if(value.OfferSummary.ListPrice!=null){
                            value.priceToShow=value.OfferSummary.ListPrice.FormattedPrice;
                        }
                    }
                }
                
                if(value.priceToShow=="Too low to display"){
                    value.priceToShow="";
                }           

                if(value.Offers!=null){                                                           
                    if(value.Offers.Offer!=null){
                        if(value.Offers.Offer.OfferListing!=null){
                            if(value.Offers.Offer.OfferListing.PercentageSaved!=null){
                            console.log("value",value);
                            value.PercentageSaved=value.Offers.Offer.OfferListing.PercentageSaved;
                            value.AmountSaved=value.Offers.Offer.OfferListing.AmountSaved.FormattedPrice;
                                value.priceOld=value.Offers.Offer.OfferListing.Price.FormattedPrice;
                                value.haveDiscount = false;
                                value.priceOld = (parseFloat(value.Offers.Offer.OfferListing.AmountSaved.Amount) + parseFloat(value.Offers.Offer.OfferListing.Price.Amount)) / 100;
                                value.priceOld = "$" + parseFloat(Math.round(value.priceOld * 100) / 100).toFixed(2);

                                if(value.Offers.Offer.OfferListing.PercentageSaved!=null 
                                    && value.Offers.Offer.OfferListing.AmountSaved!=null 
                                    && value.Offers.Offer.OfferListing.AmountSaved.FormattedPrice!= null){
                                        value.haveDiscount = true;
                                        //value.priceToShow=value.OfferSummary.ListPrice.FormattedPrice;

                                        value.priceToShow=value.Offers.Offer.OfferListing.Price.FormattedPrice;                                        
                                }
                            
                            }
                        }
                    }
                }
                return value;
            }


        }]);

/* reglas de precios */

/*
1. TOMAR EL PRIMERA INSTANCIA EL PRECIO DE LA SIGUIENTE VARIABLE:

Precio Actual:  Offers.Offer.OfferListing.Price.FormattedPrice

HAY QUE VALIDAR SI ESE PRECIO TIENE VALOR Y  SI TRAE INFORMACION DE PORCENTAJE DE DESCUENTO PARA COLOCAR LA INFORMACION DE DESCUENTO:

Porcentaje Descuento  =  Offers.Offer.OfferListing.PercentageSaved;
Precio Viejo= (Offers.Offer.OfferListing.AmountSaved.Amount) + parseFloat(value.Offers.Offer.OfferListing.Price.Amount)) / 100;

2. SI LO ANTERIOR VIENE VACIO BUSCAR EL PRECIO EN LISTPRICE  

Precio Actual:  Attributes.ListPrice.FormattedPrice
NO COLOCAR INFORMACION DE DESCUENTO

3. SI LO ANTERIOR VIENE VACIO BUSCAR EL PRECIO EN OFFERSUMMARY

OfferSummary.ListPrice.FormattedPrice
NO COLOCAR INFORMACION DE DESCUENTO

4. SI NINGUNO TIENE VALOR, NO MOSTRAR PRODUCTO
*/