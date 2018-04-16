/*
item.ItemId
        item.ImageUrl
        item.Title
        item.FormattedPrice
        */
angular
    .module('boxit')
            .controller('rusia2018Controller', ['$scope', '$stateParams', 'userData', '$uibModal', '$q' , '$window','$http', '$state',
            function ($scope, $stateParams, userData, $uibModal, $q, $window, $http, $state) {
            //localStorage.removeItem('myWishList');
            $scope.showCar = true;
            $scope.showCarItems = false;
            $scope.carNumber = "";
            $scope.UserName = "Invitado";
            var userObj =  userData.getData();
            var id;
            if (userObj != undefined) {
                $scope.UserName = userObj.UserName;
            } else {
                $scope.UserName = "Invitado";
            }
            if (userObj != undefined) {
                id = userObj.IdCliente;
            } else {
                id = 0;
            }

            

            var getItemsRusia2018 = function (item) {
                oldItems = [];
                var newItem = {
                    'ItemId': "rusia201801",
                    'ImageUrl': "img/rusia2018/mundial-rusia-2018-new-balance-roja-camiseta-hombre-local.jpg",
                    'Title': "CAMISETA HOMBRE LOCAL",
                    'SubTitle': "Talles S L XL 2XL",
                    'FormattedPrice': "$89.95"
                };
                oldItems.push(newItem); 
                var newItem = {
                    'ItemId': "rusia201802",
                    'ImageUrl': "img/rusia2018/mundial-rusia-2018-new-balance-blanca-camiseta-hombre-visitante.jpg",
                    'Title': "CAMISETA HOMBRE VISITANTE",
                    'SubTitle': "Talles S L XL 2XL",
                    'FormattedPrice': "$89.95"
                };
                oldItems.push(newItem);   
                var newItem = {
                    'ItemId': "rusia201803",
                    'ImageUrl': "img/rusia2018/mundial-rusia-2018-camiseta-roja-new-balance-mujer.jpg",
                    'Title': "CAMISETA DAMA VISITANTE",
                    'SubTitle': "Talles S M L XL 2XL",
                    'FormattedPrice': "$89.95"
                };   
                oldItems.push(newItem); 
                var newItem = {
                    'ItemId': "rusia201804",
                    'ImageUrl': "img/rusia2018/mundial-rusia-2018-camiseta-roja-new-balance-ninos.png",
                    'Title': "CAMISETA NIÑO ROJA",
                    'SubTitle': "Talles 18-24M 2/3Y 4/5Y 6/7Y",
                    'FormattedPrice': "$59.95"
                };   
                oldItems.push(newItem);
                var newItem = {
                    'ItemId': "rusia201805",
                    'ImageUrl': "img/rusia2018/mundial-rusia-2018-camiseta-roja-new-balance-ninos-bebes.png",
                    'Title': "CAMISETA BEBES ROJA",
                    'SubTitle': "Talles 12-18M 6-12M",
                    'FormattedPrice': "$59.95"
                };   
                oldItems.push(newItem);
                var newItem = {
                    'ItemId': "rusia201806",
                    'ImageUrl': "img/rusia2018/mundial-rusia-2018-balon-oficial-adidas.jpg",
                    'Title': "Balón Oficial Rusia 2018",
                    'SubTitle': "White/Black/Silver - Size 5",
                    'FormattedPrice': "$29.95"
                };   
                oldItems.push(newItem);
                console.log('oldItems',oldItems);
                return oldItems;
                /*
                console.log('myWishList'+userObj.IdCliente);
                if(localStorage.getItem('myWishList'+userObj.IdCliente)){                     
                    var oldItems = JSON.parse(localStorage.getItem('myWishList'+userObj.IdCliente)) || [];  
                    $scope.Items = oldItems;
                    //localStorage.setItem('myWishList', JSON.stringify(oldItems));                
                    console.log('oldItems',oldItems);
                    $scope.showCar = true;
                    $scope.showCarMessage = false;
                    $scope.showCarItems = true;
                    return oldItems;
                }   */  
            };
            $scope.Items = getItemsRusia2018();
            console.log('$scope.Items',$scope.Items);

            var getCar = function () {
               
                userData.getShoppingCar(id).then(function success(result) {
                    console.log(result);
                    refreshCar(result);
                    return result;
                }, function error(result) {
                    console.log(result);
                });
            };

            getCar();

            $scope.showShoppingCar = function () {
                console.log('shoppingCarController showShoppingCar');
            $state.go('modalRusia');
            };
            $scope.goBack = function () {
                history.back();
            };
            $scope.closeModal = function () {
                $localStorage.modalIns.close();
            };
            
            $scope.wpurl = 'https://api.whatsapp.com/send?phone=50763494559&text=Quiero%20informacion%20de:%20';

            $scope.goToWhatsapp = function (url,title){
                console.log('goToWhatsapp');
                $window.open(url+title);
            }
            $scope.pedirPorWhatsapp = function(item){
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'views/pedirPorWhatsapp.html',
                    //controller: 'modalLoginController',
                    size: 'md',
                    resolve: {
                        mensaje: function () {
                            var mensaje = {};
                            mensaje.titulo = "Inicio de sesion";
                            mensaje.texto = "respuesta";
                            mensaje.estilo = "alerta";
                            return mensaje;
                        }
                    }

                }); 
            }
            $scope.addToCar = function (id,cat) {

                if (userObj != undefined) {
                    moveToCart(id,cat);
                    var args = {};
                    args["IdCliente"] = userData.getData().IdCliente;
                    args["ItemId"] = id;
                    args["Quantity"] = "1";
                    userData.addItemToCar(args).then(function success(result) {
                        refreshCar(result);
                        console.log(result);
                    }, function error(error) {
                        console.log(error);
                    });
                } else {
                    var modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: 'views/modalLoginNew.html',
                        controller: 'modalLoginController',
                        size: 'md',
                        resolve: {
                            mensaje: function () {
                                var mensaje = {};
                                mensaje.titulo = "Inicio de sesion";
                                mensaje.texto = "respuesta";
                                mensaje.estilo = "alerta";
                                return mensaje;
                            }
                        }

                    });    
                }
            };
            var refreshCar = function (result) {
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
                        $scope.showEmptyMessage
                    }
                } else {
                    $scope.subTotal = 0;
                    $scope.carNumber = 0;
                    angular.element(document.getElementById('cartNumber')).scope().carNumber = $scope.carNumber;
                    $scope.showCarItems = false;
                    if (userObj == undefined) {
                        $scope.showLoginMessage = true;
                    }
                }
            };
            $scope.clearShoppingCar = function () {
                clearCar(userObj.IdCliente).then(function success(result) {
                    var obj = {};
                    obj["data"] = result;
                    refreshCar(obj);
                    angular.element(document.getElementById('cartNumber')).scope().carNumber = 0;
                    $scope.closeModal();
                });
            };
           
            function calcularTotal(carItems) {
                var totalAcumulado = 0;
                for (var i = 0; i < carItems.length; i++) {
                    var item = carItems[i];
                    totalAcumulado = totalAcumulado + parseInt(item.Quantity);
                }
                return totalAcumulado;
            }
            var refreshMyWishList = function (item) {
                console.log('item',item.ItemId);
            }
            function goToTopBody(){
                $('html,body').animate({
                    scrollTop: (1)
                }, 1000);
            }
            $scope.addToWishList = function (item) {
                if (userObj != undefined) {
                    console.log('myWishList'+userObj.IdCliente);
                    if(localStorage.getItem('myWishList'+userObj.IdCliente)=== null){
                        oldItems = [];                                       
                    }else{
                        console.log('oldItems',oldItems);
                        var oldItems = JSON.parse(localStorage.getItem('myWishList'+userObj.IdCliente)) || []; 
                    }
                    var newItem = {
                        'ItemId': item.ItemId,
                        'ImageUrl': item.ImageUrl,
                        'Title': item.Title,
                        'FormattedPrice': item.FormattedPrice
                    };
                    let duplicados = false;
                    for (let index = 0; index < oldItems.length; index++) {
                        let element = oldItems[index];
                        if(element.ItemId===item.ItemId){                        
                            $state.go('misFavoritos');
                            setTimeout(goToTopBody, 200);
                            duplicados = true;
                        }
                        console.log('element',element);
                    }
                    if(!duplicados){
                        oldItems.push(newItem);                
                        localStorage.setItem('myWishList'+userObj.IdCliente, JSON.stringify(oldItems));
                        refreshMyWishList(item);
                        console.log('oldItems',oldItems);
                        var element = document.getElementsByClassName("add_to_wish_list-"+item.ItemId);
                        $(element).html("<strong>En Favoritos</strong>");
                    }

				} else {
					var modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: 'views/modalLoginNew.html',
                        controller: 'modalLoginController',
                        size: 'md',
                        resolve: {
                            mensaje: function () {
                                var mensaje = {};
                                mensaje.titulo = "Inicio de sesion";
                                mensaje.texto = "respuesta";
                                mensaje.estilo = "alerta";
                                return mensaje;
                            }
                        }

                    });                  
                }                
            };

            function moveToCart(id,cat){
                let boxitBartop = angular.element(document.getElementById('boxitBar-top'));
                let productaddtocartitemidcat = "product-addtocart-"+id+"-"+cat;
                let datagoimageContainer = angular.element(document.getElementById(productaddtocartitemidcat));                
                var body = $("html, body");
                body.stop().animate({scrollTop:0}, 700, 'swing', function() {});
                var itemImg = datagoimageContainer.attr('data-goimage');
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
