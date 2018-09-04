angular
    .module('boxit')
    .controller('shoppingCarController', ['$scope', '$http', '$q', '$anchorScroll', 'userData', '$uibModal', '$localStorage', '$window', '$location', '$interval', '$state',
        function ($scope, $http, $q, $anchorScroll, userData, $uibModal, $localStorage, $window, $location, $interval, $state) {
            var products = [];
            var links = [];
            $scope.subCategories = [];
            $scope.checkout = false;
            $scope.shopping = true;
            $scope.showPagination = false;
            $scope.showImage = true;
            $scope.showCar = false;
            $scope.showCarMessage = false;
            $scope.showCarItems = false;
            $scope.showLoginMessage = false;
            $scope.loading = true;
            $scope.loadMain = true;
            $scope.totalItems = 50;
            $scope.currentPage = 1;
            $scope.amazonLink = "";
            $scope.showSubCategories = false;
            var userObj =  userData.getData();
            var id;
            $scope.indexs = undefined;  //userData.getSearchIndex();
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
            $scope.showProductsCategory = true;
            
console.log('controller shoppingCarController');
             //setInterval(getCar, 10000);
            var getCar = function () {
               
                userData.getShoppingCar(id).then(function success(result) {
                    console.log(result);
                    refreshCar(result);
                    return result;
                }, function error(result) {
                    console.log(result);
                });
            };
            $scope.doSearch = function () {
                console.log('doSearch');
                $scope.showProductsCategory = false;
                console.log('showProductsCategory',$scope.showProductsCategory);
                $scope.loadMain = true;
                $scope.showCar = false;
                $scope.currentPage = 1;
                products = [];
               // console.log(this);
                if (this.index != null || this.index != undefined) {

                    searchProducts(this).then(function success(result) {
                        $scope.showCarMessage = false;
                        $scope.showImage = false;
                        $scope.Items = products[0];
                       // products.reverse();
                        if (products[0] == undefined) {
                            $scope.loadMain = false;
                            $scope.showCar = false;
                            var modalInstance = $uibModal.open({
                                animation: true,
                                templateUrl: 'views/modalCambioClave.html',
                                controller: 'modalCambioClaveController',
                                size: 'sm',
                                resolve: {
                                    mensaje: function () {
                                        var mensaje = {};
                                        mensaje.titulo = "Error en la Busqueda";
                                        mensaje.texto = "La busqueda no arrojo resultados";
                                        mensaje.estilo = "alerta";
                                        return mensaje;
                                    }
                                }

                            });
                            
                        
                            modalInstance.closed.then(function (someData) {
                                $scope.loadMain = true;
                                $scope.firstSearch();
                                getCar();
                                $scope.showProductsCategory = true;
                            });
                        } else {
                            $scope.loadMain = false;
                            $scope.showCar = true;
                            $scope.showPagination = true
                            
                        }
                    });
                } else {
                    $scope.loadMain = false;
                    var modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: 'views/modalCambioClave.html',
                        controller: 'modalCambioClaveController',
                        size: 'sm',
                        resolve: {
                            mensaje: function () {
                                var mensaje = {};
                                mensaje.titulo = "Error en la Busqueda";
                                mensaje.texto = "Por Favor seleccione una categoria.";
                                mensaje.estilo = "alerta";
                                return mensaje;
                            }
                        }

                    });
                    modalInstance.closed.then(function (someData) {
                        
                        $scope.loadMain = true;
                        $scope.firstSearch();
                         getCar();
                    });
                }
            };
            function searchProducts(self) {
                //console.log($scope.subCategory.SubCategoryName);
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
                    if (self.keyword != undefined) {
                        var searchParams = {};
                      //  console.log(self);
                        searchParams["Keywords"] = self.keyword;
                        searchParams["SearchIndex"] = self.index.attributes.SearchIndex;
                        searchParams["ItemPage"] = i;
                        var curIndex = i;
                        //console.log(curIndex);
                        defered.resolve(callPages(searchParams).then(function success(result) {

                            if (result !== undefined && result !== null) {
                               // console.log(curIndex);
                               // products.push(result);
                                //var test = [];
                               // result;

//                                result.forEach(
//                                    function (item) {
//
//                                        console.log(item.ItemId);
//
//
//                                    }
//                                );

                            }
                        //    console.log(products);

                            //defered.resolve('success');

                        }, function error(result) {
                            console.log(result);
                            // defered.resolve('success');
                        }));


                        promises.push(defered.promise);
                    } else {

                        var searchParams = {};
                        searchParams["SearchIndex"] = self.index.attributes.SearchIndex;
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

                      if (result !== undefined && result !== null){
                       //   console.log(params["ItemPage"]);
                       //   console.log(result.data.Item);
                         products[params["ItemPage"] - 1] =  result.data.Item;
                      }
                    defered.resolve(result.data.Item);
                }, function error(result) {
                    defered.reject(result.data);
                });
                return promise;
            }

            $scope.pageChanged = function () {
                this.Items = products[this.currentPage - 1];
               // $location.hash('top');
               // $anchorScroll();
            };
            $scope.initIndex = function () {
                
               // if ($scope.indexs == undefined) {
                    console.log("realizando busqueda");
                    userData.setSearchIndex();
                    $interval(function () {
                        $scope.indexs = userData.getSearchIndex();
                }, 1500);
                //}
             //  $scope.index= $scope.indexs[0];

            };
            $scope.viewItemDetail= function (item) {
                userData.getItemDetails(item.ItemId).then(function success(result) {
                    console.log(result);
                });
            }
            $scope.viewItem = function (item) {
                userData.getItemDetails(item.ItemId).then(function success(result) {
                var modalInstance =   $uibModal.open({
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
                    
                   modalInstance.closed.then(function (someData) {
                        //$scope.loadMain = true;
                       // $scope.firstSearch();
                        getCar();
                    });
                
                }, function error(result) {
                    console.log(result);
                });
            };
            $scope.onKeyEnterPress = function () {
              //  console.log(this);
              //  console.log($event);
                if (event.keyCode === 13) {
                    $scope.doSearch();
                }
            };
            $scope.showShoppingCar = function () {
                    console.log('shoppingCarController showShoppingCar');
                $state.go('modal');
            };
            $scope.goBack = function () {
                history.back();
            };
            $scope.closeModal = function () {
                $localStorage.modalIns.close();
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
                var i;
                for (i = 0; i < $scope.carItems.length; i++) {
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
            $scope.purchase = function () {
                var promises = [];
                links = [];
                var IdCliente = userData.getData().IdCliente;
                itemLinks().then(function success(result) {

                //   console.log($scope.carItems);
                    for (var i = 0; i < $scope.carItems.length; i++) {


                        var item = $scope.carItems[i];
                        var args = {};
                        args["IdCliente"] = IdCliente;
                        //descripcion del producto
                        args["Package"] = item.Title;
                        //link al producto en amazon
                        args["Link"] = links[i];
                        //cantidad de unidades
                        args["Quantity"] = item.Quantity;
                        //precio de la unidad
                        args["Amount"] = item.Price.Amount;
                        // console.log(args);

                     //   console.log(i);
                        promises.push(itemCheckOut(args));
                    }
                });
                clearCar(IdCliente);
                $scope.checkout = true;
                $scope.shopping = false;
                $state.go("checkoutmessage")
                //$window.location = '/BoxitStore.html#/checkoutmessage';
                return $q.all(promises);
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
                    $scope.loadMain = false;
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
           
            function calcularTotal(carItems) {
                var totalAcumulado = 0;
                for (var i = 0; i < carItems.length; i++) {
                    var item = carItems[i];
                    totalAcumulado = totalAcumulado + parseInt(item.Quantity);
                }
                return totalAcumulado;
            }

            function getSubCategories(category) {
                var defered = $q.defer();
                var promise = defered.promise;
                $http({
                    method: "POST",
                    url: userData.getHost() + "/amazon/amazongetcategories",
                    data: {
                        "SearchIndex": category
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

            $scope.setSubCategories = function () {
                getSubCategories(this.index.attributes.SearchIndex).then(function success(result) {
                   
                    $scope.subCategories = result.data;
                    $scope.showSubCategories = true;
                }, function error(result) {
                    console.log(result);
                    $scope.showSubCategories = false;
                });
            };
            
            getCar();
            


            var getProductsCategory = function () {

                
            $scope.showProductsCategory = true;
                var searchParams = {};
                searchParams["SearchIndex"] = 'Baby';
                userData.getDefaultSearch(searchParams).then(function success(result) {
                    var mostrarSoloEstosCuatro = {};
                    mostrarSoloEstosCuatro[0] = result[0];
                    mostrarSoloEstosCuatro[1] = result[1];
                    mostrarSoloEstosCuatro[2] = result[2];
                    mostrarSoloEstosCuatro[3] = result[3];
                    $scope.ItemsBaby = mostrarSoloEstosCuatro;
                    console.log('ItemsBaby',$scope.ItemsBaby)
                }, function error(result) {
                });

                var searchParams = {};
                searchParams["SearchIndex"] = 'Electronics';
                userData.getDefaultSearch(searchParams).then(function success(result) {
                    $scope.ItemsElectronicsUno= {};
                    $scope.ItemsElectronicsDos= {};
                    $scope.ItemsElectronicsTres= {};
                    $scope.ItemsElectronicsUno[0] = result[0];
                    $scope.ItemsElectronicsUno[1] = result[1];
                    $scope.ItemsElectronicsUno[2] = result[2];
                    $scope.ItemsElectronicsUno[3] = result[3];
                    $scope.ItemsElectronicsDos[0] = result[4];
                    $scope.ItemsElectronicsDos[1] = result[5];
                    $scope.ItemsElectronicsDos[2] = result[6];
                    $scope.ItemsElectronicsDos[3] = result[7];
                    $scope.ItemsElectronicsTres[0] = result[8];
                    $scope.ItemsElectronicsTres[1] = result[9];
                    console.log('ItemsElectronics',$scope.ItemsElectronics)
                }, function error(result) {
                });


            };

            if($scope.showProductsCategory){
            getProductsCategory();
            }

            var refreshMyWishList = function (item) {
                console.log('item',item.ItemId);
            }
            
            $scope.addToWishList = function (item) {                
                if(localStorage.getItem('myWishList')=== null){
                    oldItems = [];
                                       
                }else{
                    console.log('oldItems',oldItems);
                    var oldItems = JSON.parse(localStorage.getItem('myWishList')) || []; 
                }
                var newItem = {
                    'ItemId': item.ItemId,
                    'ImageUrl': item.Image.ImageUrl,
                    'Title': item.Attributes.Title,
                    'FormattedPrice': item.Offers.Offer.OfferListing.Price.FormattedPrice
                };
                oldItems.push(newItem);                
                localStorage.setItem('myWishList', JSON.stringify(oldItems));
                refreshMyWishList(item);
                console.log('oldItems',oldItems);
            };

        }]);
