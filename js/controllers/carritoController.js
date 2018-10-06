angular
    .module('boxit')
        .controller('carritoController', ['$scope', '$stateParams', '$http', '$q', '$anchorScroll', 'userData', 'NequiService', '$uibModal', '$localStorage', '$window', '$location', '$interval', '$state', '$timeout',
            function ($scope, $stateParams, $http, $q, $anchorScroll, userData, NequiService, $uibModal, $localStorage, $window, $location, $interval, $state, $timeout) {             
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
                $scope.formadepago=1;
                // Added by MAB - 20180927
                $scope.phoneNumber = '';

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
                    if($scope.formadepago==null){
                        alert("Selecciona forma de pago");
                        return;
                    }else if($scope.formadepago==0){
                        //NEQUI
                        console.log('$scope.formadepago',$scope.formadepago);
                        $scope.purchaseWithNequi();
                        return;
                    }else{

                    
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
                            console.log('item',item);
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
                            args["Amount"] = item.Price;
                            // id del producto
                            args["ItemId"] = item.ItemId;
                            console.log('args',args);
                            detail["PurchaseOrderDetail"] = args;
                            details.push("detail", detail);
                        }

                        console.log(details);
                        getIdCompra().then(function success(result) {
                            var args = {};

                            console.log("getIdCompra result", result);
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

                }
                    //clearCar(IdCliente);
                    // $scope.checkout = true;
                    // $scope.shopping = false;
                    //$window.location = '/BoxitStore.html#/checkoutmessage';
                    // $state.go("checkoutmessage");
                    // return $q.all(promises);
                };
                // Add by MAB 20180927
                /**
                 * Inicia el proceso de pago mediante Nequi
                 * @description Abre un modal para procesar el pago mediante Nequi permitiendo seleccionrar 
                 *              la modalidad de pago: código QR o mensaje Push. Obliga la carga de un teléfono 
                 *              el cual no es validado contra Nequi y tiene caracter de informativo (salvo el 
                 *              pago mediante mensaje Push)
                 */
                $scope.purchaseWithNequi = function () {

                    $scope.enableButtons = true;
                    $scope.CompraNequiMessage = '';
                    /**
                     * Mantiene el tipo de operación de pago seleccionado
                     * @type {string}
                     * @description pago Qr = "QR", pago push = "PUSH"
                     */
                    $scope.tipoCompraNequi = '';
                    /**
                     * CodeString
                     * @type {string}
                     * @description mantiene el código que identifica a cada transacción de pago
                     * @todo reemplazar por la propiedad "codeQr" del objeto "lastTransax"
                     */
                    $scope.CodeString = '';
                    /**
                     * lastTransax
                     * @type {object}
                     * @description mantiene una copia de la respuesta de las transacciones de pago (QR y Push),
                     *              para ser empleado en los procesos de alidación de pago y reversa
                     */
                    $scope.lastTransax = null;
                    /**
                     * countDown
                     * @type {object}
                     * @description mantiene el timer activo. Siempre debe iniciar como undefined
                     */
                    $scope.countDown = undefined;

                    $scope.nequiModal = $uibModal.open({
                        animation: true,
                        backdrop: 'static',
                        templateUrl: 'views/nequicheckoutmessage.html',
                        controller: 'carritoController',
                        controllerAs: '$ctrl',
                        size: 'nequicheckoutmessage',
                        scope: $scope,
                    });

                };

                // Added by MAB 20180929
                $scope.startCountDown = function () {
                    // Don't start if we are already in a countdown
                    if (angular.isDefined($scope.countDown)) return;

                    $scope.time = 30 * 60;   // Minutos * Segundos
                    $scope.minutes = 30;
                    $scope.seconds =  0;
                    $scope.countDown = $interval(function () {
                        if ($scope.time > 0) {
                            $scope.time -= 1;
                            $scope.minutes = Math.floor($scope.time / 60);
                            $scope.seconds = Math.floor($scope.time % 60);
                        } else {
                            $scope.stopCountDown();
                        }
                    }, 1000);
                };

                // Added by MAB 20180929
                $scope.stopCountDown = function () {
                    if (angular.isDefined($scope.countDown)) {
                        $interval.cancel($scope.countDown);
                        $scope.countDown = undefined;
                        $scope.time      = undefined;
                        $scope.minutes   = undefined;
                        $scope.seconds   = undefined;
                    }
                };

                // Added by MAB 20190927
                $scope.$on('$destroy', function () {
                    // Make sure that the interval is destroyed too
                    $scope.stopCountDown();
                });

                // Added by MAB 20190927
                $scope.purchaseWithNequiQR = function() {
                    /**
                     * amount
                     * @type {number}
                     * @description Monto a se bonado mediante Nequi. 
                     * @todo Se debe obtener este valor del servicio correspondiente
                     */
                    var amount =$scope.carTotal * 1;

                    NequiService
                        .payWithQR ( $scope.phoneNumber, amount)
                        .then(function (transax) {
                            $scope.CodeString   = transax.codeQR;
                            // Se prepar´el string con el que se generará la imágen de código QR
                            $scope.qrCodeString = "bancadigital-" + transax.codeQR;
                            $scope.lastTransax = transax;
                            $scope.tipoCompraNequi = 'QR';
                            $scope.enableButtons = false;

                            $scope.startCountDown();

                        })
                        .catch(function (error) {
                            $scope.tipoCompraNequi = '';
                            $scope.lastTransax = null;
                            $scope.enableButtons = true;
                        })
                };
                // Added by MAB 20190927
                $scope.purchaseWithNequiPush = function() {
                    var amount =$scope.carTotal * 1;

                    NequiService
                        .payWithPush($scope.phoneNumber, amount)
                        .then(function (transax) {
                            $scope.CodeString = transax.codeQR;
                            $scope.lastTransax = transax;
                            $scope.tipoCompraNequi = 'PUSH';
                            $scope.enableButtons = false;

                            $scope.startCountDown();

                        })
                        .catch(function (error) {
                            console.log(error);
                            $scope.tipoCompraNequi = '';
                            $scope.lastTransax = null;
                            $scope.enableButtons = true;
                            $scope.CompraNequiMessage = 'Error al enviar notificación';
                                $timeout(function () {
                                    $scope.CompraNequiMessage = '';
                                }, 3500);
                        })
                };
                // Add by MAB 20180916
                $scope.cancelModal = function () {
                    // Si existe una transacción
                    // if ($scope.lastTransax) {

                    //     $scope.stopCountDown();

                    //     var messageId;
                    //     // Dependiendo del tipo de forma de pago Nequi seteamos el parametro "messageID"
                    //     if ($scope.tipoCompraNequi === 'QR') {
                    //         messageId = $scope.lastTransax.codeQR;
                    //     } else if ($scope.tipoCompraNequi === 'PUSH') {
                    //         messageId = $scope.lastTransax.messageId;
                    //     } else {
                    //         /** @todo Ver que hacer cuando no existe un "tipoCompraNequi" valido */
                    //     }

                    //     // Ejecutar la reversa antes de salir
                    //     NequiService
                    //         .reverseTransaction(
                    //             $scope.lastTransax.phoneNumber,
                    //             $scope.lastTransax.amount,
                    //             messageId,
                    //         ).then(function (success) {
                    //             console.log('La transacción se reverso correctamente!');
                    //             $scope.nequiModal.dismiss('cancel');
                    //         })
                    //         .catch(function (error) {
                    //             // Ante un error en la reversa, mostrar error y salir
                    //             console.log(error);
                    //             $scope.CompraNequiMessage = 'ERROR al anular...';
                    //             $timeout(function () {
                    //                 $scope.CompraNequiMessage = '';
                    //                 $scope.nequiModal.dismiss('cancel');
                    //             }, 3000);
                    //         });
                    // } else {
                    //     // sino solo salir
                    //     $scope.nequiModal.dismiss('cancel');
                    // }
                    $scope.nequiModalCancel = $uibModal.open({
                        animation: true,
                        backdrop: 'static',
                        templateUrl: 'views/nequicancelconfirmation.html',
                        controller: 'carritoController',
                        controllerAs: '$ctrl',
                        size: 'nequicheckoutmessage',
                        scope: $scope,
                    });
                    //$scope.nequiModal.dismiss('cancel');
                };

                $scope.nequiCancelConfirmation = function(confirmation) {
                    if(confirmation==1){
                        console.log('cancelar pago');
                        $scope.nequiModalCancel.dismiss('cancel');
                        $scope.nequiModal.dismiss('cancel');
                    }else{
                        $scope.nequiModalCancel.dismiss('cancel');
                    }
                }

                // Added by MAB 20180927
                $scope.aceptarModal = function () {
                    NequiService
                        .paymentStatus($scope.phoneNumber, $scope.CodeString)
                        .then(function (result) {
                            if (result.status === '35') {
                                // Cerrar Modal y confirmar el pago
                                $scope.CompraNequiMessage = 'Pago aprobado...';
                                console.log('paymentStatus',result);
                                pagoNequiAprobado();
                                $timeout(function () {
                                    $scope.CompraNequiMessage = '';
                                    $scope.nequiModal.dismiss('cancel');
                                }, 3500);
                            } else {    // result.status === '33'
                                // Pago pendiente. Notificar
                                $scope.CompraNequiMessage = 'Pago pendiente...';
                                $timeout(function () {
                                    $scope.CompraNequiMessage = '';
                                }, 3500);
                            }
                        })
                        .catch(function (error) {
                            console.log(error);
                            $scope.CompraNequiMessage = 'Pago Cancelado';
                                $timeout(function () {
                                    $scope.CompraNequiMessage = '';
                                }, 3500);
                        })
                };

                function pagoNequiAprobado(){
                    console.log('pagoNequiAprobado',pagoNequiAprobado);
                    console.log('pagoNequiAprobado $scope.formadepago',$scope.formadepago);
                    $scope.formadepago = 0;
                    $scope.mostrarBoxitShoppingCart = false;
                    $scope.showCarItems = false;
                    $scope.showLoginMessage = false;
                    $scope.loading = true;
                    var details = [];
                    links = [];
                    var IdCliente = userData.getData().IdCliente;
                    var paypurchaseorderParams = {};

                    itemLinks().then(function success(result) {
                        console.log('itemLinks',result);

                        for (var i = 0; i < $scope.carItems.length; i++) {
                            var item = $scope.carItems[i];
                            var args = {};
                            var detail = {};
                            args["IdCliente"] = IdCliente;
                            args["Package"] = item.Title;
                            args["Link"] =links[item.ItemId];
                            args["Quantity"] = item.Quantity;
                            args["Amount"] = item.Price;
                            args["ItemId"] = item.ItemId;
                            detail["PurchaseOrderDetail"] = args;
                            details.push("detail", detail);
                        }

                        getIdCompra().then(function success(result) {
                            console.log('getIdCompra',result);
                            paypurchaseorderParams["IdOrdenCompra"] = result;
                            paypurchaseorderParams["IdFormaPago"] = 8;
                            paypurchaseorderParams["Amount"] = $scope.carTotal;
                            paypurchaseorderParams["Numero"] = $scope.phoneNumber;
                            var args = {};
                            args["IdOrdenCompra"] = result;
                            args["ListPurchaseOrderDetail"] = details;

                            newCheckout(args).then(function success(result) {
                                console.log('getIdCompra',result);

                                var answer = result;
                                if (answer === "The Purchase Order Detail Has Been Created") {
                                    clearCar(IdCliente);
                                    $scope.checkout = true;
                                    $scope.shopping = false;
                                    console.log('paypurchaseorderParams',paypurchaseorderParams);

                                    $http({
                                        method: "POST",
                                        url: userData.getHost() + "/amazon/paypurchaseorder",
                                        data: paypurchaseorderParams,
                                        headers: {
                                            'Content-Type': 'application/json'
                                        }
                                    }).then(function success(result) {
                                        console.log('paypurchaseorder success',result);
                                        
                                        var answer = result;
                                        console.log('answer',answer);
                                        $uibModal.open({
                                            animation: true,
                                            templateUrl: 'views/nequipaidmessage.html',
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

                                    }, function error(result) {
                                        console.log('paypurchaseorder error',result);
                                    });

                                }

                            });

                        });

                    });

                    console.log('$scope.phoneNumber',$scope.phoneNumber);                   	                    

                }

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
                    var args = {};
                    console.log('$scope.formadepago',$scope.formadepago);
                    args["NotificacionNuevaOrden"] = $scope.formadepago;
                    $http({
                        method: "POST",
                        url: userData.getHost() + "/amazon/insertpurchaseorderenc",
                        data: args,
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).then(function success(result) {
                        console.log('getIdCompra result', result);
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
