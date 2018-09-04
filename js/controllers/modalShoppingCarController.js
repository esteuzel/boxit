/**
 * Created by USRSIS0155 on 26/05/2016.
 */
angular
        .module('boxit')
        .controller('modalShoppingCarController', ['$scope', '$http', '$q', '$anchorScroll', 'userData', '$uibModal', '$localStorage', '$window', '$location', '$interval', '$state', '$uibModalInstance',
            function ($scope, $http, $q, $anchorScroll, userData, $uibModal, $localStorage, $window, $location, $interval, $state, $uibModalInstance) {
                var products = [];
                var links = [];
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
                $scope.amazonLink = "";
                $scope.showTerms = false;
                $scope.acceptTerms = false;
                var userObj = userData.getData();
                var id;
                $scope.indexs = userData.getSearchIndex();
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

console.log('controller modalShoppingCarController');


                var getCar = function () {
                    userData.getShoppingCar(id).then(function success(result) {
                        refreshCar(result);
                        return result;
                    }, function error(result) {
                        console.log(result);
                    });
                };


                $scope.doSearch = function () {
                    products = [];
                    searchProducts().then(function success(result) {
                        $scope.showCarMessage = false;
                        $scope.showImage = false;
                        $scope.Items = products[0];
                        products.reverse();
                        if (products[0] == undefined) {
                            $scope.showCar = false;
                            $scope.showCarMessage = true;
                        } else {
                            $scope.showCar = true;
                            $scope.showPagination = true;
                        }
                    });
                };
                function searchProducts() {
//                    var defered = $q.defer();
//                    var promise = defered.promise;
//                    var i = 1;
//                    for (i = 1; i < 6; i++) {
//                        var searchParams = {};
//                        searchParams["Keywords"] = $scope.keyword;
//                        searchParams["SearchIndex"] = $scope.index.attributes.SearchIndex;
//                        searchParams["ItemPage"] = i;
//                        callPages(searchParams).then(function success(result) {
//                            products.push(result);
//                            defered.resolve("success");
//
//                        });
//                    }
//                    return promise;

                    var promises = [];
                    var i;
                    for (i = 1; i < 6; i++) {
                        var defered = $q.defer();
                        if ($scope.keyword != undefined) {
                            var searchParams = {};
                            searchParams["Keywords"] = $scope.keyword;
                            searchParams["SearchIndex"] = $scope.index.attributes.SearchIndex;
                            searchParams["ItemPage"] = i;
                            defered.resolve(callPages(searchParams).then(function success(result) {

                                if (result !== undefined) {
                                    products.push(result);
                                }
                                //defered.resolve('success');

                            }, function error(result) {
                                console.log(result);
                                // defered.resolve('success');
                            }));
                            promises.push(defered.promise);
                        } else {

                            var searchParams = {};
                            searchParams["SearchIndex"] = $scope.index.attributes.SearchIndex;
                            searchParams["ItemPage"] = i;
                            var IdCliente = 1;

                            if (userData.getData() !== undefined) {
                                IdCliente = userData.getData().IdCliente;
                            }
                            searchParams["IdCliente"] = IdCliente;
                            defered.resolve(userData.getDefaultSearch(searchParams).then(function success(result) {

                                if (result !== undefined) {
                                    products.push(result);
                                }
                            }, function error(result) {
                                console.log(result);
                            }));
                            promises.push(defered.promise);
                        }
                    }
                    return $q.all(promises);

                }

                function callPages(params) {
                    var defered = $q.defer();
                    var promise = defered.promise;
                    $http({
                        method: "POST",
                        url: userData.getHost() + "/amazon/amazongetkeywords",
                        data: params,
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).then(function success(result) {
                        defered.resolve(result.data.Item);
                    }, function error(result) {
                        defered.reject(result.data);
                    });
                    return promise;
                }

                $scope.pageChanged = function () {
                    $scope.Items = products[$scope.currentPage - 1];
                    $location.hash('top');
                    $anchorScroll();
                };
//                $scope.initIndex = function () {
//                    if ($scope.indexs != undefined) {
//                        $scope.index = $scope.indexs[0];
//                    } else {
//                        userData.setSearchIndex();
//                        $interval(function () {
//                            $scope.indexs = userData.getSearchIndex();
//                            $scope.index = $scope.indexs[0];
//                        }, 1500);
//                    }
//                };
                $scope.viewItem = function (item) {

                    userData.getItemDetails(item.ItemId).then(function success(result) {
                        $uibModal.open({
                            animation: true,
                            templateUrl: 'views/modalDetallesArticulo.html',
                            controller: 'modalDetallesArticulosController',
                            size: 'lg',
                            resolve: {
                                item: function () {
                                    return result;
                                }
                            }
                        });
                    }, function error(result) {
                        console.log(result);
                    });
                };
                $scope.onKeyEnterPress = function (event) {
                    if (event.keyCode === 13) {
                        $scope.doSearch();
                    }
                };
                $scope.showShoppingCar = function () {
                    console.log('modalShoppingCarController showShoppingCar');
                    var modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: 'views/modalShoppingCar.html',
                        size: 'lg',
                        controller: 'shoppingCarController'
                    });
                    $localStorage.modalIns = modalInstance;
                    //$window.location = "/index.html#/boxitStore/itemList";
                };
                $scope.goBack = function () {

                    if ($scope.showTerms) {
                        $scope.showTerms = false;
                    } else {
                        history.back();
                    }
                };
                $scope.closeModal = function () {
                    $uibModalInstance.close();
                };
                $scope.changeModal = function () {

                    $state.go('itemList');
                };
                var getItemLink = function (id) {
                    var defered = $q.defer();
                    var promise = defered.promise;
                    userData.getItemDetails(id).then(function success(result) {
                        defered.resolve(result.Item.PageUrl);
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
                            links.push(result);


                        }, function error(result) {
                            console.log(result);
                            // defered.resolve('success');
                        }));
                        promises.push(defered.promise);
                    }
                    return $q.all(promises);
                };


                $scope.checkboxChange = function () {

                    $scope.acceptTerms = !$scope.acceptTerms;

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

                    if (!$scope.showTerms && valid) {
                        $scope.showTerms = true;
                        valid = false;
                    }



                    return valid;

                };

                $scope.purchase = function () {

                    console.log($scope.carItems);
                    if (!validate()) {

                        return "";

                    }


                    $scope.showTerms = false;
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
                            args["Link"] =links[i];
                            //cantidad de unidades
                            args["Quantity"] = item.Quantity;
                            //precio de la unidad
                            args["Amount"] = item.Price.FormattedPrice;
                            // console.log(args);

                            detail["PurchaseOrderDetail"] = args;
                            details.push(detail);
                        }


                        // console.log(details);
                        getIdCompra().then(function success(result) {
                            var args = {};


                            //console.log("metodos nuevos");
                            args["IdOrdenCompra"] = result;
                            args["ListPurchaseOrderDetail"] = details;
                            //  console.log(args["ListPurchaseOrderDetail"]);
                            newCheckout(args).then(function success(result) {
                                var answer = result;

                                if (answer === "The Purchase Order Detail Has Been Created") {
                                    clearCar(IdCliente);
                                    $scope.checkout = true;
                                    $scope.shopping = false;
                                    $state.go("checkoutmessage");
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
                var clearCar = function (IdCliente) {

                    var defered = $q.defer();
                    var promise = defered.promise;
                    var params = {};
                    params["IdCliente"] = IdCliente;
                    $http({
                        method: "POST",
                        url: userData.getHost() + "/amazon/amazonclearcart",
                        data: params,
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).then(function success(result) {
                        defered.resolve(result.data);
                    }, function error(result) {
                        defered.reject(result.data);
                    });
                    return promise;

                };


                $scope.openAmazon = function () {
                    if ($scope.amazonLink === "") {
                        return "";
                    } else {
                        $window.open($scope.amazonLink, '_blank');
                    }


                };
                $scope.addToCar = function (id) {

                    if (userObj != undefined) {
                        var args = {};
                        args["IdCliente"] = userData.getData().IdCliente;
                        args["ItemId"] = id;
                        args["Quantity"] = "1";
                        userData.addItemToCar(args).then(function success(result) {
                            refreshCar(result);
                        }, function error(error) {
                            console.log(error);
                        });
                    } else {
                        $scope.showShoppingCar();
                    }
                };
                var refreshCar = function (result) {
                    $scope.showCarItems = false;
                    $scope.showLoginMessage = false;
                    $scope.loading = true;
                    //   console.log(result.data.Data.Cart);
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
                                $scope.loading = false;
                                $scope.showCarItems = true;
                                 $scope.mostrarBoxitShoppingCart = true;
                                angular.element(document.getElementById('cartNumber')).scope().carNumber = $scope.carNumber;
                            } else {
                                getCar();
                            }
                        } else {
                            $scope.carNumber = 0;
                            angular.element(document.getElementById('cartNumber')).scope().carNumber = $scope.carNumber;
                            $scope.subTotal = 0;
                            $scope.showEmptyMessage = true;
                            $scope.loading = false;
                        }
                    } else {
                        $scope.subTotal = 0;
                        $scope.carNumber = 0;
                        angular.element(document.getElementById('cartNumber')).scope().carNumber = $scope.carNumber;
                        $scope.showCarItems = false;
                        if (userObj == undefined) {
                            // $scope.showLoginMessage = true;
                            $scope.loading = false;
                            $scope.loggin = true;
                            $scope.shopping = false;
                            $state.go("modalLogin");

                        }
                    }
                };
                /*$scope.modifyCar = function (op, carItemId, cantidad) {
                    var args = {};
                    args["IdCliente"] = userData.getData().IdCliente;
                    args["CartItemId"] = carItemId;
                    if (op == 0) {
                        args["Quantity"] = (parseInt(cantidad) - 1).toString();
                    } else {
                        args["Quantity"] = (parseInt(cantidad) + 1).toString();
                    }
                    $http({
                        method: "POST",
                        url: userData.getHost() + "/amazon/amazonmodifycart",
                        data: args,
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).then(function success(result) {
                        $scope.$parent.subTotal = result.data.Data.Cart.CartItems.SubTotal.FormattedPrice;
                        refreshCar(result);
                    }, function error(result) {
                        console.log(result);
                    });
                };*/
                $scope.firstSearch = function () {
                    userData.getFirstSearch().then(function success(result) {
                        $scope.Items = result;
                        $scope.showCar = true;
                        $scope.showImage = false;
                    }, function error(result) {
                    });
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


                getCar();


                function calcularTotal(carItems) {
                    var totalAcumulado = 0;
                    for (var i = 0; i < carItems.length; i++) {
                        var item = carItems[i];
                        totalAcumulado = totalAcumulado + parseInt(item.Quantity);
                    }
                    return totalAcumulado;
                }



            }]);

