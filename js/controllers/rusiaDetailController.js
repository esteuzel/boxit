angular
    .module('boxit')
    .controller('rusiaDetailController', ['$scope', '$stateParams', 'userData', '$uibModal', '$q' , '$window','$http', '$state',
        function ($scope, $stateParams, userData, $uibModal, $q, $window, $http, $state) {

            var item = $stateParams.itemId;
            var currentIdItem = $stateParams.itemId;
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
            } else {
                userId = 0;
            }
            $scope.showEmptyMessage = false;            
            
            var getItemsDetailsRusia2018 = function () {
                oldItems = [];
                var newItem = {
                    'ItemId': "rusia201801",
                    'ImageUrl': "img/rusia2018/mundial-rusia-2018-new-balance-roja-camiseta-hombre-local.jpg",
                    'Title': "CAMISETA HOMBRE LOCAL",
                    'SubTitle': "Talles S L XL 2XL",
                    'FormattedPrice': "$89.95",
                    'AmountPrice': 8995,
                    'peso': 1
                };
                oldItems.push(newItem); 
                var newItem = {
                    'ItemId': "rusia201806-S",
                    'ImageUrl': "img/rusia2018/mundial-rusia-2018-new-balance-roja-camiseta-hombre-local.jpg",
                    'Title': "CAMISETA HOMBRE LOCAL",
                    'SubTitle': "Talles S L XL 2XL",
                    'FormattedPrice': "$67.96",
                    'AmountPrice': 8995,
                    'peso': 1
                };
                oldItems.push(newItem);
                var newItem = {
                    'ItemId': "rusia201802",
                    'ImageUrl': "img/rusia2018/mundial-rusia-2018-new-balance-blanca-camiseta-hombre-visitante.jpg",
                    'Title': "CAMISETA HOMBRE VISITANTE",
                    'SubTitle': "Talles S L XL 2XL",
                    'FormattedPrice': "$67.96",
                    'AmountPrice': 8995,
                    'peso': 1
                };
                oldItems.push(newItem);   
                var newItem = {
                    'ItemId': "rusia201803",
                    'ImageUrl': "img/rusia2018/mundial-rusia-2018-camiseta-roja-new-balance-mujer.jpg",
                    'Title': "CAMISETA DAMA VISITANTE",
                    'SubTitle': "Talles S M L XL 2XL",
                    'FormattedPrice': "$67.96",
                    'AmountPrice': 8995,
                    'peso': 1
                };   
                oldItems.push(newItem); 
                var newItem = {
                    'ItemId': "rusia201804",
                    'ImageUrl': "img/rusia2018/mundial-rusia-2018-camiseta-roja-new-balance-ninos.png",
                    'Title': "CAMISETA NIÑO ROJA",
                    'SubTitle': "Talles 18-24M 2/3Y 4/5Y 6/7Y",
                    'FormattedPrice': "$59.95",
                    'AmountPrice': 5995,
                    'peso': 1
                };   
                oldItems.push(newItem);
                var newItem = {
                    'ItemId': "rusia201805",
                    'ImageUrl': "img/rusia2018/mundial-rusia-2018-camiseta-roja-new-balance-ninos-bebes.png",
                    'Title': "CAMISETA BEBES ROJA",
                    'SubTitle': "Talles 12-18M 6-12M",
                    'FormattedPrice': "$59.95",
                    'AmountPrice': 5995,
                    'peso': 1
                };   
                oldItems.push(newItem);
                let attributes = {"Size":5,"Color":"White"};
                //attributes["Size"] = 5;
                //attributes["Color"] = "White";
                var newItem = {
                    'ItemId': "rusia201806",
                    'ImageUrl': "img/rusia2018/mundial-rusia-2018-balon-oficial-adidas.jpg",
                    'Title': "Balón Oficial Rusia 2018",
                    'SubTitle': "White/Black/Silver - Size 5",
                    'FormattedPrice': "$29.95",
                    'AmountPrice': 2995,
                    'peso': 1,
                    'Attributes': attributes
                };   
                oldItems.push(newItem);
                console.log('oldItems',oldItems);
                return oldItems;                
            };

            function getRusiaItemDetails(){
                items = getItemsDetailsRusia2018();
                var keepGoing = true;
                angular.forEach(items, function(value, key) {
                    if(keepGoing) {
                        //console.log('value',value);
                        let ItemCartId = value.ItemId;
                        if(ItemCartId==$stateParams.itemId){
                            keepGoing = false;
                            console.log('return',value);
                            $scope.itemSelected = value.ItemId;
                            $scope.titulo = value.Title;
                            $scope.texto = value.SubTitle;
                            $scope.imgUrl = value.ImageUrl;
                            $scope.itemPrice = value.FormattedPrice;
                            $scope.amount = value.AmountPrice;
                            $scope.peso = value.peso;
                            $scope.cantidad = 1;
                            console.log('$scope',$scope);
                            setRusiaItemData(value);
                            setRusiaItemVariation(value);
                            return value;                        
                        }
                    }
                });   
            }

            var getRusiaCar = function () {               
                userData.getShoppingCar(userId).then(function success(result) {
                    console.log('getCar',result);
                    refreshCarNumber(result);
                    return result;
                }, function error(result) {
                    console.log('getCar',result);
                });
            };


            getRusiaItemDetails();
            
            function goToTopBody(){
                $('html,body').animate({
                    scrollTop: (1)
                }, 1000);
            }
            setTimeout(goToTopBody, 200);

            function setRusiaItemData(item) {
                currentIdItem = item.ItemId;
                $scope.itemCode = currentIdItem;
                $scope.userNotLogged = usrObj === undefined;
                $scope.titulo = item.Title;
                $scope.texto = item.SubTitle;
                $scope.imgUrl = item.ImageUrl;
                $scope.itemPrice = item.FormattedPrice;
                $scope.cantidad = 1;
                var amount = item.AmountPrice;
                console.log('userNotLogged',$scope.userNotLogged);
                console.log(amount == 0);
                console.log($scope.itemPrice == 0);
                console.log(($scope.itemPrice == 0 || amount == 0 || $scope.userNotLogged));
                $scope.disabledAdd = ($scope.itemPrice == 0 || amount == 0 || $scope.userNotLogged);
                if($scope.disabledAdd){
                    $scope.tooltip = "Por favor iniciar sesion para añadir articulos"
                }else{
                    $scope.tooltip="";
                }
                $scope.total = numeral(( amount * $scope.cantidad) / 100).format('$0,0.00');
                $scope.showMain = true;
                $scope.loadMain = false;
                $scope.peso = item.peso;
                console.log('setRusiaItemData',$scope);
                getRusiaCar();
            }

            function getRusiaItemVariation(item) {
                    let defered = $q.defer();
                    let promise = defered.promise;
                    let id = item.ItemId;
                    if(item.ItemIdParent){
                        //id = item.ItemIdParent;
                    }
                    console.log("url",'variations/'+id+'.json');                    
                    let request = {
                        method: 'get',
                        url: 'variations/'+id+'.json',
                        dataType: 'json',
                        contentType: "application/json"
                    };
                    $http(request).then(function success(result) {                        
                        defered.resolve(result.data);
                        console.log("result.data",result.data);
                    },function error(result) {
                      defered.reject(result);
                    });
                    return promise;                
            }

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

            function setItemData(item) {
                console.log('setItemData ',item);
                currentIdItem = item.Item.ItemId;
                console.log('setItemData',$scope);
                $scope.itemCode = currentIdItem;
                $scope.userNotLogged = usrObj === undefined;
                $scope.titulo = item.Item.Attributes.Title;
                $scope.texto = getDescription(item).trim();
                
                $scope.imgUrl = item.Item.Image.ImageUrl;
                $scope.itemPrice = item.Item.Offers.Offer == null ? 0 : item.Item.Offers.Offer.OfferListing.Price.FormattedPrice;
                $scope.cantidad = 1;
                var amount = item.Item.Offers.Offer == null ? 0 : item.Item.Offers.Offer.OfferListing.Price.Amount;
                console.log('userNotLogged',$scope.userNotLogged);
                console.log(amount == 0);
                console.log($scope.itemPrice == 0);
                console.log(($scope.itemPrice == 0 || amount == 0 || $scope.userNotLogged));
                $scope.disabledAdd = ($scope.itemPrice == 0 || amount == 0 || $scope.userNotLogged);
                if($scope.disabledAdd){
                    $scope.tooltip = "Por favor iniciar sesion para añadir articulos"
                }else{
                    $scope.tooltip="";
                }
                $scope.total = numeral(( amount * $scope.cantidad) / 100).format('$0,0.00');
                $scope.showMain = true;
                $scope.loadMain = false;
                $scope.peso = Math.ceil(item.Item.Attributes.PackageDimensions.Weight / 100);
                console.log('setItemData',$scope);
                getCar();
            }

                        

            function getRusiaChildItem(ItemId) {
                let defered = $q.defer();
                let promise = defered.promise;
                let id = ItemId;
                console.log("url",'childsitems/'+id+'.json');
                let request = {
                    method: 'get',
                    url: 'childsitems/'+id+'.json',
                    dataType: 'json',
                    contentType: "application/json"
                };
                $http(request).then(function success(result) {                    
                    defered.resolve(result);
                    console.log("result.data",result);
                },function error(result) {
                  defered.reject(result);
                });
                return promise;                
        }

            function setRusiaItemVariation(item) {
                var colorExist = false;
                var sizeExist = false;
                console.log("setRusiaItemVariation????");
                getRusiaItemVariation(item).then(function success(result) {
                    console.log("getRusiaItemVariation????");
                    if (result == null) {
                        console.log("item.Attributes.Size",item.Attributes.Size);
                        console.log("item",item);

                        if (item.Attributes.Size != null) {
                            $scope.showZise = true;
                            $scope.size = item.Attributes.Size;
                            sizeExist = true;
                        }
                        if (item.Attributes.Color != null) {
                            $scope.ShowColor = true;
                            $scope.color = item.Attributes.Color;
                            colorExist = true;
                        }
                        if (sizeExist && colorExist) {
                            $scope.showCombination = true;
                        }
                    }else {
                        console.log("variationExist????");
                        variationExist(result);
                    }
                },function error(result) {
                    console.log("error",result);
                    console.log("variation Attributes");
                    console.log("item",item);
                    console.log("item.Attributes",item.Attributes);
                    if (item.Item.Attributes.Size != null) {
                        console.log("variation Attributes");
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


                });                
            }
            function variationExist(result) {
                if ($scope.variations == null || $scope.variations == undefined) {
                    $scope.variations = result.Item;
                }
                console.log($scope.variations);
                if ($scope.variations[0].VariationAttributes.VariationAttribute instanceof Array) {
                    $scope.showVariationsArray = true;
                }else{
                    $scope.showVariationsObject = true;
                    console.log($scope.variations);
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
                //console.log("refreshItem");
                if ($scope.variation != null && $scope.variation != undefined) { 
                    //console.log("$scope.variation",$scope.variation);                   
                    getRusiaChildItem($scope.variation.ItemId).then(function success(result) {
                        //console.log("resultresultresultresultresultresult",result);
                        setItemData(result.data);
                        //console.log("result.data",result.data);
                        setRusiaItemVariation(result.data);
                        $scope.loadMain = false;
                        //console.log("resultresultresultresultresultresult",result.data);
                    }, function error(result) {
                        //console.log("error",result);
                        $scope.loadMain = false;
                    });
                }
            };

            
            var getCar = function () {               
                userData.getShoppingCar(userId).then(function success(result) {
                    console.log('getCar',result);
                    refreshCarNumber(result);
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
                    args["ItemId"] = itemadded.ItemId;
                    args["OfferListingId"] = "";
                    args["Price"] = itemadded.AmountPrice;
                    // PackageDimensions 
                    args["Height"] = itemadded.Height == null ? 0 : itemadded.Height;
                    args["Length"] = itemadded.Length == null ? 0 : itemadded.Length;
                    args["Weight"] = itemadded.Weight == null ? 0 : itemadded.Weight;
                    args["Width"] = itemadded.Width == null ? 0 : itemadded.Width;               
                    // Image
                    args["UrlImage"] = itemadded.ImageUrl;
                    console.log("args",args);

                if ($scope.cantidad == 0 || $scope.cantidad === undefined) {
                    args["Quantity"] = "0";
                } else {
                    args["Quantity"] = $scope.cantidad;
                }
                userData.addItemToCar(args).then(function success(result) {
                    refreshCarNumber(result);
                    //$uibModalInstance.close();
                    console.log('addItemToCar', result);
                }, function error(result) {
                    console.log(result);
                });
            };

            var refreshCarNumber = function (result) {
                $scope.showCarItems = false;
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
            };
            function calcularTotal(carItems) {
                var totalAcumulado = 0;
                for (var i = 0; i < carItems.length; i++) {
                    var item = carItems[i];
                    totalAcumulado = totalAcumulado + parseInt(item.Quantity);
                }
                return totalAcumulado;
            }

            $scope.refreshTotal = function () {
                $scope.total = numeral((item.Item.Offers.Offer.OfferListing.Price.Amount * $scope.cantidad) / 100).format('$0,0.00');
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
        }]);
