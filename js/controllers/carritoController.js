angular
    .module('boxit')
        .controller('carritoController', ['$scope', '$stateParams', '$http', '$q', '$anchorScroll', 'userData', '$uibModal', '$localStorage', '$window', '$location', '$interval', '$state',
            function ($scope, $stateParams, $http, $q, $anchorScroll, userData, $uibModal, $localStorage, $window, $location, $interval, $state) {             
                var products = [];
                var links = [];
            //localStorage.removeItem('myWishList');
                $scope.CartEmpty = false;
                $scope.carNumber = 0;
                $scope.checkout = false;
                $scope.loggin = false;
                $scope.shopping = true;
                $scope.showPagination = false;
                $scope.showImage = true;
                $scope.showCar = false;
                $scope.showCarMessage = false;
                $scope.showCarItems = true;
                $scope.showLoginMessage = false;
                $scope.loading = true;
                $scope.totalItems = 50;
                $scope.currentPage = 1;
                $scope.showTerms = false;
                $scope.acceptTerms = true;
                $scope.carCommission = 0;
                $scope.carTotal = 0;
                $scope.mostrarDisclaimerPesoCero = false;
                var userObj = userData.getData();
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
                $scope.mostrarBoxitShoppingCart = false;

            console.log('controller carritoController');        

            var getCar = function () {
                userData.getShoppingCar(id).then(function success(result) {
                    console.log('getShoppingCar',result);
                    refreshCar(result);                    
                    return result;
                }, function error(result) {
                    console.log(result);
                });
            };

           /* var getItemsDetail = function (cartItems) {                
                let newItems = [];
                angular.forEach(cartItems, function(value, key) {
                    //console.log('value',value);
                    let ItemCartId = value.ItemId;                
                    userData.getItemDetails(ItemCartId).then(function success(item) {
                        //console.log('item',item);
                        if (item != undefined) {
                            //return item;
                            if(item.Item.Attributes.PackageDimensions != null){
                                value.Weight = Math.ceil(item.Item.Attributes.PackageDimensions.Weight / 100);
                            }else{
                                value.Weight = 0;
                                $scope.mostrarDisclaimerPesoCero = true;
                            }
                            value.Image = [];
                            value.Image.ImageUrl = item.Item.Image.ImageUrl;
                            value.itemPrice = item.Item.Offers.Offer == null ? 0 : item.Item.Offers.Offer.OfferListing.Price.FormattedPrice;
                            console.log('newItem',value);
                            newItems.push(value);
                        }
                    });                    
                });
                return newItems;
            };*/
            var getItemDetail = function (cartItem) {
                console.log('getItemDetail',getItemDetail);
                newItem = cartItem;
                if(newItem.Weight==0){
                     $scope.mostrarDisclaimerPesoCero = true;
                }
                newItem.TotalPrice = newItem.Price*newItem.Quantity;
                newItem.TotalPrice = Math.round(newItem.TotalPrice * 100) / 100;
                return newItem;                
            };
            
            $scope.goBack = function () {
                history.back();
            };
            
            var refreshCar = function (result) {
                    $scope.showCarItems = false;
                    $scope.showLoginMessage = false;
                    $scope.loading = true;
                    $scope.mostrarBoxitShoppingCart = false;
/*
<Data>
	<Cart>
		<CartId>183-3577401-4578411</CartId>
		<CartItems>
			<CartItem></CartItem>
			<CartItem></CartItem>
			<CartItem>
				<CartItemId/>
				<ItemId>B01DFKC2SO</ItemId>
				<Price>5.00</Price> item.Price.FormattedPrice   item.ItemTotal.FormattedPrice
				<Quantity>2</Quantity>
				<Weight>1.00</Weight>
				<UrlImage>https://www.myboxit.com/itemDetail/B00QHK8T82</UrlImage>
				<Title>dveroijPOHiihiIOIIIIvv</Title>
			</CartItem>
		</CartItems>
	</Cart>
</Data>
*/
                    
                    if (result.data.Data.Cart != undefined) {
                        let carritoDatos = result.data.Data.Cart;
                        //console.log('carritoDatos CartId',carritoDatos.CartId);
                        if (carritoDatos.CartItems != undefined || carritoDatos.CartItems != null) {
                            carritoItems = carritoDatos.CartItems.CartItem;
                            console.log('carritoItems',carritoItems);
                            if ($.isArray(carritoItems)) {
                                //let itemsWithDetail = getItemsDetail(carritoItems);
                                let itemsWithDetail = [];
                                angular.forEach(carritoItems, function(value, key) {
                                    let itemWithDetail = getItemDetail(value);
                                    itemsWithDetail.push(itemWithDetail);
                                });
                                $scope.carItems = itemsWithDetail;
                            } else {
                                var Items = [];
                                let itemWithDetail = getItemDetail(carritoItems);
                                Items.push(itemWithDetail);
                                $scope.carItems = Items;                                    
                            }
                            itemsSubTotal = 0;
                            angular.forEach($scope.carItems, function(value, key) {
                                itemsSubTotal = itemsSubTotal + value.TotalPrice;
                            });
                            itemsSubTotal = Math.round((itemsSubTotal) * 100) / 100;
                            $scope.subTotal = itemsSubTotal;
                                $scope.subtotalAmount = itemsSubTotal;
                                getCommission();                                
                                $scope.loading = false;
                                $scope.showCarItems = true;
                                $scope.mostrarBoxitShoppingCart = true;
                                $scope.CartEmpty = false;

                        } else {
                            $scope.carNumber = 0;
                            $scope.CartEmpty = true;
                            $scope.subTotal = 0;
                            $scope.showEmptyMessage = true;
                            $scope.loading = false;
                            $scope.showCarItems = false;
                        }                        
                    } else {
                        console.log("NO Data.Cart");
                        $scope.subTotal = 0;
                        $scope.carNumber = 0;
                        $scope.CartEmpty = true;
                        //angular.element(document.getElementById('cartNumber')).scope().carNumber = $scope.carNumber;
                        $scope.showCarItems = false;
                        if (userObj == undefined) {
                            // $scope.showLoginMessage = true;
                            $scope.loading = false;
                            $scope.loggin = true;
                            $scope.shopping = false;
                            $state.go("modalLogin");

                        }
                    }
/*
                    if (result.data.Data.Cart != undefined) {
                        if (result.data.Data.Cart.CartItems != undefined || result.data.Data.Cart.CartItems != null) {
                            if (null !== result.data.Data.Cart.CartItems) {
                                if ($.isArray(result.data.Data.Cart.CartItems.CartItem)) {
                                    let itemsWithDetail = getItemsDetail(result.data.Data.Cart.CartItems.CartItem);
                                    $scope.carItems = itemsWithDetail;
                                } else {
                                    var Items = [];
                                    let itemWithDetail = getItemDetail(result.data.Data.Cart.CartItems.CartItem);
                                    Items.push(itemWithDetail);
                                    $scope.carItems = Items;                                    
                                }
                                
                                $scope.subTotal = result.data.Data.Cart.CartItems.SubTotal.FormattedPrice;
                                $scope.subtotalAmount = result.data.Data.Cart.CartItems.SubTotal.Amount;
                                $scope.amazonLink = result.data.Data.Cart.PurchaseURL;
                                getCommission();                                
                                $scope.loading = false;
                                $scope.showCarItems = true;
                                $scope.mostrarBoxitShoppingCart = true;
                                $scope.CartEmpty = false;
                                //angular.element(document.getElementById('cartNumber')).scope().carNumber = $scope.carNumber;
                            } else {
                                getCar();
                            }
                        } else {
                            $scope.carNumber = 0;
                            $scope.CartEmpty = true;
                            //angular.element(document.getElementById('cartNumber')).scope().carNumber = $scope.carNumber;
                            $scope.subTotal = 0;
                            $scope.showEmptyMessage = true;
                            $scope.loading = false;
                            $scope.showCarItems = false;
                        }
                    } else {
                        console.log("NO Data.Cart");
                        $scope.subTotal = 0;
                        $scope.carNumber = 0;
                        $scope.CartEmpty = true;
                        //angular.element(document.getElementById('cartNumber')).scope().carNumber = $scope.carNumber;
                        $scope.showCarItems = false;
                        if (userObj == undefined) {
                            // $scope.showLoginMessage = true;
                            $scope.loading = false;
                            $scope.loggin = true;
                            $scope.shopping = false;
                            $state.go("modalLogin");

                        }
                    }
                    */
                    //console.log('carItems',$scope.carItems);
                };
            $scope.modifyCar = function (op, item) {
                $scope.loading = true;
                itemId = item.ItemId;
                carItemId = item.CartItemId
                cantidad = item.Quantity;
                    var args = {};
                    args["IdCliente"] = userData.getData().IdCliente;
                    args["CartItemId"] = carItemId;
                    args["ItemId"] = itemId;
                    if (op == 0) {
                        args["Quantity"] = (parseInt(cantidad) - 1).toString();
                    } else {
                        args["Quantity"] = (parseInt(cantidad) + 1).toString();
                    }
                    if (op == 2) {
                        args["Quantity"] = "0";
                    }
                    $http({
                        method: "POST",
                       // url: userData.getHost() + "/amazon/amazonmodifycart",
                        url: userData.getHost() + "/amazon/AmazonModifyCart2",
                        data: args,
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).then(function success(result) {
                        //$scope.$parent.subTotal = result.data.Data.Cart.CartItems.SubTotal.FormattedPrice;
                        refreshCar(result);
                        $scope.loading = false;
                    }, function error(result) {
                        console.log(result);
                        $scope.loading = false;
                    });
                };

                $scope.clearShoppingCar = function () {
                    $scope.mostrarBoxitShoppingCart = false;
                    $scope.loading = true;
                    clearCar(userObj.IdCliente).then(function success(result) {
                        var obj = {};
                        obj["data"] = result;
                        refreshCar(obj);
                        $state.go('boxitStore');
                        //angular.element(document.getElementById('cartNumber')).scope().carNumber = 0;
                     });
                };

                var clearCar = function (IdCliente) {
                    var defered = $q.defer();
                    var promise = defered.promise;
                    var params = {};
                    params["IdCliente"] = IdCliente;
                    console.log('limpiando carrito 2');
                    $http({
                        method: "POST",                        
                        //url: userData.getHost() + "/amazon/amazonclearcart",
                        url: userData.getHost() + "/amazon/AmazonClearCart2",
                        data: params,
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).then(function success(result) {
                        defered.resolve(result.data);
                        console.log('carrito vaciado 2');
                    }, function error(result) {
                        defered.reject(result.data);
                    });
                    return promise;    
                };
                $scope.continueBuying = function () {
                    $state.go('boxitStore');
                }
           
                getCar();
                
                function getCommission() {
                    userData.getCommission(id).then(function success(value) {
                        
                        console.log('getCommission getCommission',value);  

                        if (value != undefined) {
                            $scope.carCommission = value.data.Data.Rows.attributes.Commission;
                            let commissionAmount = parseInt(value.data.Data.Rows.attributes.Commission);
                            console.log('getCommission commissionAmount',commissionAmount);        
                            let subtotalAmount = $scope.subtotalAmount;/*parseInt($scope.subtotalAmount);*/
                            console.log('getCommission subtotalAmount',subtotalAmount);
                            let car_total = Math.round((commissionAmount + subtotalAmount) * 100) / 100;
                            $scope.carTotal = (car_total);
                            console.log('getCommission $scope.carTotal',$scope.carTotal); 
                            return value.data.Data.Rows.attributes.Commission;
                        }                                   
                    }, function error(result) 
                    {
                        console.log(result);
                    });
                }

                function calcularTotal(carItems) {
                    var totalAcumulado = 0;
                    for (var i = 0; i < carItems.length; i++) {
                        var item = carItems[i];
                        totalAcumulado = totalAcumulado + parseInt(item.Quantity);
                    }
                    return totalAcumulado;
                }

               
                var getItemLink = function (id) {
                    var defered = $q.defer();
                    var promise = defered.promise;
                    userData.getItemDetails(id).then(function success(result) {
                        defered.resolve(result.Item);
                    }, function error(result) {
                        defered.reject(result);
                    });
                    return promise;
                };
                var itemLinks = function () {

                    //var promise = defered.promise;
                    var promises = [];
                    for (var i = 0; i < $scope.carItems.length; i++) {
                        var defered = $q.defer();
                        var items = $scope.carItems[i];
                        defered.resolve(getItemLink(items.ItemId).then(function success(result) {
                            links[result.ItemId] = result.PageUrl;

                        }, function error(result) {
                            console.log(result);
                            // defered.resolve('success');
                        }));
                        promises.push(defered.promise);
                    }
                    return $q.all(promises);
                };                

                var validate = function () {

                    var valid = true;
                    var texto = "";

                    if ($scope.carItems === undefined) {

                        texto = "El carro de compra se encuentra vacio";
                        valid = false;
                    }



                    if (!$scope.acceptTerms && $scope.showTerms)
                    {

                        texto = "Debe aceptar los terminos y condiciones";
                        valid = false;
                    }




                    if (!valid) {
                        $uibModal.open({
                            animation: true,
                            templateUrl: 'views/modalCambioClave.html',
                            controller: 'modalCambioClaveController',
                            size: 'sm',
                            resolve: {
                                mensaje: function () {
                                    var mensaje = {};
                                    mensaje.titulo = "Shopping Car";
                                    mensaje.texto = texto;
                                    mensaje.estilo = "advertencia";
                                    return mensaje;
                                }
                            }

                        });

                    }
/*
                    if (!$scope.showTerms && valid) {
                        $scope.showTerms = true;
                        valid = false;
                        console.log("!$scope.showTerms && valid");
                    }
*/


                    return valid;

                };

                $scope.purchase = function () {
                    $scope.mostrarBoxitShoppingCart = false;
                    console.log($scope.carItems);
                    if (!validate()) {
                        return "";
                        $scope.mostrarBoxitShoppingCart = true;
                    }
                    console.log("validate");
                    //$scope.showTerms = false;
                    $scope.showCarItems = false;
                    $scope.showLoginMessage = false;
                    $scope.loading = true;
                    var details = [];
                    links = [];
                    var IdCliente = userData.getData().IdCliente;
                    itemLinks().then(function success(result) {

                        for (var i = 0; i < $scope.carItems.length; i++) {

                            var item = $scope.carItems[i];
                            var args = {};
                            var detail = {};

                            args["IdCliente"] = IdCliente;
                            //descripcion del producto
                            args["Package"] = item.Title;
                            //link al producto en amazon
                            args["Link"] =links[item.ItemId];
                            //cantidad de unidades
                            args["Quantity"] = item.Quantity;
                            //precio de la unidad
                            args["Amount"] = item.Price.FormattedPrice;
                            // id del producto
                            args["ItemId"] = item.ItemId;
                            console.log(args);
                            detail["PurchaseOrderDetail"] = args;
                            details.push("detail", detail);
                        }

                        console.log(details);
                        getIdCompra().then(function success(result) {
                            var args = {};

                            //console.log("metodos nuevos");
                            args["IdOrdenCompra"] = result;
                            args["ListPurchaseOrderDetail"] = details;
                            //  console.log(args["ListPurchaseOrderDetail"]);
                            newCheckout(args).then(function success(result) {
                                var answer = result;
console.log('answer',answer);
                                if (answer === "The Purchase Order Detail Has Been Created") {
                                    
                                    clearCar(IdCliente);
                                    $scope.checkout = true;
                                    $scope.shopping = false;
                                    //$state.go("checkoutmessage");

                                    $uibModal.open({
                                        animation: true,
                                        templateUrl: 'views/checkoutmessage.html',
                                        controller: 'carritoController',
                                        size: 'checkoutmessage',
                                        resolve: {
                                            mensaje: function () {
                                                var mensaje = {};
                                                mensaje.titulo = "Shopping Car";
                                                mensaje.texto = answer;
                                                mensaje.estilo = "alerta";
                                                return mensaje;
                                            }
                                        }

                                    });

                                } else {

                                    $uibModal.open({
                                        animation: true,
                                        templateUrl: 'views/modalCambioClave.html',
                                        controller: 'modalCambioClaveController',
                                        size: 'sm',
                                        resolve: {
                                            mensaje: function () {
                                                var mensaje = {};
                                                mensaje.titulo = "Shopping Car";
                                                mensaje.texto = answer;
                                                mensaje.estilo = "alerta";
                                                return mensaje;
                                            }
                                        }

                                    });
                                }

                            });
                        });

                    });


                    //clearCar(IdCliente);
                    // $scope.checkout = true;
                    // $scope.shopping = false;
                    //$window.location = '/BoxitStore.html#/checkoutmessage';
                    // $state.go("checkoutmessage");
                    // return $q.all(promises);
                };
                var newCheckout = function (params) {
                    var defered = $q.defer();
                    var promise = defered.promise;
                    console.log(params);
                    $http({
                        method: "POST",
                        url: userData.getHost() + "/amazon/insertpurchaseorderdetail",
                        data: params,
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).then(function success(result) {
                        //console.log(result);
                        defered.resolve(result.data.Data.Rows.attributes.Message);
                    }, function error(result) {
                        console.log(result);
                        defered.reject(result.data.Rows.attributes.Message);
                    });

                    return promise;

                };

                var getIdCompra = function () {
                    var defered = $q.defer();
                    var promise = defered.promise;

                    $http({
                        method: "POST",
                        url: userData.getHost() + "/amazon/insertpurchaseorderenc",
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).then(function success(result) {
                        console.log(result);
                        defered.resolve(result.data.Data.Rows.attributes.IdOrdenCompra);
                    }, function error(result) {
                        console.log(result.data.Rows.attributes.Message);
                        defered.reject(result.data.Rows.attributes.Message);
                    });

                    return promise;

                };



                var itemCheckOut = function (params) {

                    var defered = $q.defer();
                    var promise = defered.promise;

                    $http({
                        method: "POST",
                        url: userData.getHost() + "/users/insertpurchaseorder",
                        data: params,
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).then(function success(result) {
                        defered.resolve(result.data.Rows.attributes.Message);
                    }, function error(result) {
                        console.log(result.data.Rows.attributes.Message);
                        defered.reject(result.data.Rows.attributes.Message);
                    });

                    return promise;
                };


                $scope.cerrarModalThankyou = function () {
                    console.log("cerrarModalThankyou");                    
                    $state.go('boxitStore').then(function(){
                        $window.location.reload();
                    });
                };
                $scope.$on("$destroy", function handler() {
                    $('.navbar').removeClass('white');
                });            
                $('.navbar').addClass('white');                
                
        }]);
