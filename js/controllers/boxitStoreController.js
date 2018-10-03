angular
    .module('boxit')
    .controller('boxitStoreController', ['$scope', '$stateParams', '$http', '$q', '$anchorScroll', 'userData', '$uibModal', '$localStorage', '$window', '$location', '$interval', '$state',
        function ($scope, $stateParams, $http, $q, $anchorScroll, userData, $uibModal, $localStorage, $window, $location, $interval, $state) {
            var products = [];
            var allProducts = [];
            var links = [];
            ////console.log('$stateParams.serchdata',$stateParams.serchdata);
            $scope.subCategories = [];
            $scope.checkout = false;
            $scope.shopping = true;
            $scope.showPagination = false;
            $scope.showImage = true;
            $scope.showCar = false;
            $scope.showStoreFirstTen = true;
            $scope.showStoreCarousel = true;
            $scope.showCarMessage = false;
            $scope.showCarItems = false;
            $scope.showLoginMessage = false;
            $scope.loading = true;
            $scope.loadMain = true;
            $scope.totalItems = 0;
            $scope.currentPage = 1;
            $scope.itemsPerPage = 12;
            $scope.amazonLink = "";
            $scope.showSubCategories = false;
            $scope.labusquedanoarrojoresultados = false;
            $scope.mostrarlabusquedanoarrojoresultados = true;
            $scope.topCategory = "";
            $scope.showLeftCategories = false;
            $scope.categoriesList = [];
            $scope.subCategoriesList = [];
            $scope.subcategoryProducts = [];
            $scope.itemsTopSellerProducts = [];
            $scope.itemsNewReleaseProducts = [];
            $scope.showTopSellerProducts = false;
            $scope.showNewReleaseProducts = false;
            $scope.showStoreBreadcrumb = false;
            $scope.showSearchTopNewProdctsEmpty = false;
            $scope.preventCacheSearchKeyword = false;
            $scope.searchButtonCatName = 'Categorías';
            $scope.subCategory = '';
            //$scope.subCategoryTexto = "";
            $scope.breadcrumbSubCategoryTexto = "jaja";
            $scope.categoryTexto = "Categorías";
            $scope.showLeftCategories = true;
            obtenerCategoriesListEs();

            //////console.log("$scope.categoriesList",$scope.categoriesList);
            //////console.log("$scope.subCategoriesList",$scope.subCategoriesList); SubCategoryId textoEs
            var userObj = userData.getData();
            var id;
            $scope.indexs = userData.getSearchIndex();
            if (userObj != undefined) {
                $scope.UserName = userObj.UserName;
            } /*else {
                $scope.UserName = "Invitado";
            }*/
            if (userObj != undefined) {
                id = userObj.IdCliente;
            } else {
                id = 0;
            }
            $scope.showProductsCategory = false;

            //////console.log('controller boxitStoreController');
            //setInterval(getCar, 10000);
            /*var getCar = function () {
               
                userData.getShoppingCar(id).then(function success(result) {
                    //////console.log(result);
                    refreshCar(result);
                    return result;
                }, function error(result) {
                    ////console.log(result);
                });
            };*/
            $scope.doSearch = function () {
                //console.log('doSearch');
                $scope.showProductsCategory = false;
                $scope.showStoreCarousel = false;
                //////console.log('showProductsCategory',$scope.showProductsCategory);
                $scope.loadMain = true;
                $scope.showCar = false;
                $scope.currentPage = 1;
                products = [];
                $scope.totalItems = 0;
                allProducts = [];
                // ////console.log(this);
                ////console.log("SearchIndex ",$scope.index.attributes.SearchIndex);
                //console.log("SubCategoryId ",$scope.subCategory);
                //console.log("self.keyword ",$scope.keyword);

                searchProducts(this).then(function success(result) {
                    $scope.showCarMessage = false;
                    $scope.showImage = false;
                    products = [];
                    if(allProducts.length==0){
                        $scope.hayItemsPorMostrar = false;
                        $scope.showPopupNoResultsPlease =
                        showPopupNoResults();
                    }
                    $scope.totalItems = allProducts.length;
                    if ($scope.totalItems > $scope.itemsPerPage) {
                        $scope.showPagination = true;
                    } else {
                        $scope.showPagination = false
                    }
                    let j = 0;
                    products[j] = [];
                    for (i = 0; i < allProducts.length; i++) {
                        if (i % $scope.itemsPerPage == 0 & i > 0) {
                            j++;
                            products[j] = [];
                        }
                        if (allProducts[i]) {
                            products[j].push(allProducts[i]);
                        }
                    }
                    $scope.Items = products[0];
                    if (products[0].length == 0) {
                        products[0] = undefined;
                    }
                    $scope.labusquedanoarrojoresultados = false;
                    // products.reverse();
                    if (products[0] == undefined) {
                        $scope.loadMain = false;
                        $scope.showCar = false;
                        $scope.labusquedanoarrojoresultados = true;
                        ////console.log('######## BUSQUEDA ##########');
                        ////console.log('"La busqueda no arrojo resultados: "', $scope.keyword);

                        if ($scope.mostrarlabusquedanoarrojoresultados == true) {


                            var modalInstance = $uibModal.open({
                                animation: true,
                                templateUrl: 'views/modalCambioClave.html',
                                controller: 'modalCambioClaveController',
                                size: 'sm',
                                resolve: {
                                    mensaje: function () {
                                        var mensaje = {};
                                        mensaje.titulo = "Busqueda";
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
                        }
                        $scope.loadMain = true;
                        //$scope.firstSearch();
                        //getCar();
                        $scope.showProductsCategory = true;


                    } else {
                        $scope.loadMain = false;
                        $scope.showCar = true;
                        $scope.showPagination = true;
                        $scope.showStoreBreadcrumb = true;
                        $scope.categoryTexto = $scope.index.attributes.SearchIndex;
                        //$scope.subCategoryTexto = $scope.subCategoryTexto; 
                        //////console.log('$scope.categoriesListEs',$scope.categoriesListEs);
                        ////console.log('$scope.breadcrumbSubCategoryTexto',$scope.breadcrumbSubCategoryTexto);

                        angular.forEach($scope.categoriesListEs, function (value, key) {
                            //////console.log('value',value);
                            if (value.code == $scope.index.attributes.SearchIndex) {
                                $scope.categoryTexto = value.texto;
                            }
                        });
                        //{{index.attributes.SearchIndex}}

                        //call it here



                    }
                });

            };
            function searchProducts(self) {

                let coma = encodeURIComponent(",");
                var searchParams = {};
                        let comillaSimple = encodeURIComponent("'");
                        let barra = encodeURIComponent("/");
                        let Keywords = self.keyword;
                        Keywords = Keywords.replace(",", coma);
                        Keywords = Keywords.replace("'", comillaSimple);
                        Keywords = Keywords.replace("/", barra);

                        if (!$scope.preventCacheSearchKeyword) {
                            //$scope.preventCacheSearchKeyword = true;

                            if ($scope.subCategory > 0) {
                                searchParams["SubCategoryId"] = $scope.subCategory;
                            } else {
                                searchParams["SubCategoryId"] = '';
                            }
    
                            if (self.index != null || self.index != undefined) {
                                searchParams["SearchIndex"] = self.index.attributes.SearchIndex;
    
                            } else {
                                searchParams["SearchIndex"] = "All";
                            }


                            $location.path('/boxitStore/' + searchParams["SearchIndex"] + ',' + searchParams["SubCategoryId"] + ',' + Keywords);
                            //return;
                            //console.log('$location.path(',$location.path());  
                        }


                //console.log('searchProducts');
                $scope.hayItemsPorMostrar = false;
                var promises = [];
                var i;
                for (i = 1; i < 6; i++) {
                    var defered = $q.defer();

                    if (self.keyword != undefined) {
                        localStorage.setItem("keyword", self.keyword);
                        var searchParams = {};
                        //  ////console.log(self);
                        searchParams["Keywords"] = self.keyword;
                        if ($scope.subCategory > 0) {
                            searchParams["SubCategoryId"] = $scope.subCategory;
                        } else {
                            searchParams["SubCategoryId"] = '';
                        }

                        if (self.index != null || self.index != undefined) {
                            searchParams["SearchIndex"] = self.index.attributes.SearchIndex;

                        } else {
                            searchParams["SearchIndex"] = "All";
                        }

                        searchParams["ItemPage"] = i;
                        var curIndex = i;
                        //console.log('searchParams ::: ', searchParams);
                        defered.resolve(callPages(searchParams).then(function success(result) {
                            //console.log('result', result);
                            if (result !== undefined && result !== null) {
                                //console.log('result', result);
                                $scope.hayItemsPorMostrar = true;
                            }
                            //defered.resolve('success');
                        }, function error(result) {
                            //console.log(result);
                            // defered.resolve('success');
                        }));

                        promises.push(defered.promise);
                        


                    } else {

                        var searchParams = {};
                        /*
                                                if (self.index != null || self.index != undefined)
                                                {
                                                    searchParams["SearchIndex"] = self.index.attributes.SearchIndex;
                                                }else{
                                                    searchParams["SearchIndex"] = "All";
                                                }*/
                        searchParams["SearchIndex"] = self.index.attributes.SearchIndex;
                        if ($scope.subCategory > 0) {
                            searchParams["SubCategoryId"] = $scope.subCategory;
                        } else {
                            searchParams["SubCategoryId"] = '';
                        }
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
                            ////console.log(result);
                        }));
                        promises.push(defered.promise);
                    }
                }
                return $q.all(promises);

            }


            function callPages(params) {
                var defered = $q.defer();
                var promise = defered.promise;
                //console.log("params",params);
                //console.log("callPages","/amazon/amazongetkeywords");
                $http({
                    method: "POST",
                    url: userData.getHost() + "/amazon/amazongetkeywords",
                    data: params,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(function success(result) {
                    //console.log("callPages amazongetkeywords result", result);
                    if (result !== undefined && result !== null) {
                        products[params["ItemPage"] - 1] = result.data.Item;
                        if (result.data.Item) {
                            if (result.data.Item.length > 1) {
                                angular.forEach(result.data.Item, function (value, key) {
                                    //////console.log("value" , value );
                                    let newValue = checkItemData(value);
                                    if (newValue != null) {
                                        allProducts.push(newValue);
                                    }
                                });
                                //console.log("allProducts" , allProducts );
                            } else {
                                value = result.data.Item;
                                let newValue = checkItemData(value);
                                if (newValue != null) {
                                    allProducts.push(newValue);
                                }
                            }
                        }
                    }
                    defered.resolve(result.data.Item);
                }, function error(result) {
                    defered.reject(result.data);
                });
                return promise;
            }

            function checkItemData(value) {
                value.Price_FormattedPrice = 0;
                value.priceToShow = "";
                if (!value.ItemId || value.ItemId == null) { return null; }
                if (!value.Image || value.Image == null) { return null; }

                if (value.Offers != null) {
                    if (value.Offers.Offer != null) {
                        if (value.Offers.Offer.OfferListing != null) {
                            if (value.Offers.Offer.OfferListing.Price != null) {
                                value.priceToShow = value.Offers.Offer.OfferListing.Price.FormattedPrice;

                            }
                        }
                    }
                }

                if (value.priceToShow == "" || value.priceToShow == "Too low to display") {
                    if (value.Attributes != null) {
                        if (value.Attributes.ListPrice != null) {
                            if (value.Attributes.ListPrice.FormattedPrice != null) {
                                value.priceToShow = value.Attributes.ListPrice.FormattedPrice;
                            }
                        }
                    }
                }

                if (value.priceToShow == "" || value.priceToShow == "Too low to display") {
                    if (value.OfferSummary != null) {
                        if (value.OfferSummary.ListPrice != null) {
                            value.priceToShow = value.OfferSummary.ListPrice.FormattedPrice;
                        }
                    }
                }

                if (value.priceToShow == "Too low to display") {
                    value.priceToShow = "";
                }

                if (value.Offers != null) {
                    if (value.Offers.Offer != null) {
                        if (value.Offers.Offer.OfferListing != null) {
                            if (value.Offers.Offer.OfferListing.PercentageSaved != null) {
                                //console.log("value",value);
                                value.PercentageSaved = value.Offers.Offer.OfferListing.PercentageSaved;
                                value.AmountSaved = value.Offers.Offer.OfferListing.AmountSaved.FormattedPrice;
                                value.priceOld = value.Offers.Offer.OfferListing.Price.FormattedPrice;
                                value.haveDiscount = false;
                                value.priceOld = (parseFloat(value.Offers.Offer.OfferListing.AmountSaved.Amount) + parseFloat(value.Offers.Offer.OfferListing.Price.Amount)) / 100;
                                value.priceOld = "$" + parseFloat(Math.round(value.priceOld * 100) / 100).toFixed(2);

                                if (value.Offers.Offer.OfferListing.PercentageSaved != null
                                    && value.Offers.Offer.OfferListing.AmountSaved != null
                                    && value.Offers.Offer.OfferListing.AmountSaved.FormattedPrice != null) {
                                    value.haveDiscount = true;
                                    //value.priceToShow=value.OfferSummary.ListPrice.FormattedPrice;

                                    value.priceToShow = value.Offers.Offer.OfferListing.Price.FormattedPrice;
                                }

                            }
                        }
                    }
                }

                return value;
            }

            $scope.pageChanged = function () {
                this.Items = products[this.currentPage - 1];
                // $location.hash('top');
                // $anchorScroll();
            };



            $scope.initIndex = function () {
                if ($scope.indexs == undefined) {

                    userData.setSearchIndex();
                    $interval(function () {
                        $scope.indexs = userData.getSearchIndex();
                    }, 1500);
                }
                //  $scope.index= $scope.indexs[0];

            };
            $scope.viewItemDetail = function (item) {
                userData.getItemDetails(item.ItemId).then(function success(result) {

                });
            }
            $scope.viewItem = function (item) {
                userData.getItemDetails(item.ItemId).then(function success(result) {
                    var modalInstance = $uibModal.open({
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
                        //getCar();
                    });

                }, function error(result) {
                });
            };
            $scope.onKeyEnterPress = function () {
                if (event.keyCode === 13) {
                    $scope.doSearch();
                }
            };
            $scope.showShoppingCar = function () {
                $state.go('modal');
            };
            $scope.goBack = function () {
                history.back();
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
            $scope.addToCar = function (itemadded, cat) {
                if (userObj != undefined) {
                    moveToCart(itemadded.ItemId, cat);
                    var args = {};
                    args["IdCliente"] = userData.getData().IdCliente;
                    args["ItemId"] = itemadded.ItemId;
                    args["OfferListingId"] = "";
                    args["Quantity"] = "1";
                    //args["Price"] = itemadded.Offers.Offer.OfferListing.Price.Amount / 100;
                    args["Price"] = itemadded.OfferSummary.ListPrice.Amount / 100;
                    // PackageDimensions 
                    args["Height"] = itemadded.Attributes.PackageDimensions.Height;
                    args["Length"] = itemadded.Attributes.PackageDimensions.Length;
                    if (itemadded.Attributes.PackageDimensions != null) {
                        args["Weight"] = itemadded.Attributes.PackageDimensions.Weight;
                    } else {
                        args["Weight"] = 0;
                    }
                    args["Width"] = itemadded.Attributes.PackageDimensions.Width;

                    // Image
                    args["UrlImage"] = itemadded.Image.ImageUrl;
                    args["Title"] = itemadded.Attributes.Title;

                    userData.addItemToCar(args).then(function success(result) {

                        //refreshCar(result);
                        calcularCarritoTotal(result);
                    }, function error(error) {

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

                    //$scope.showShoppingCar();                    
                    //$state.go('modalLoginNew');                    
                }
            };
            function calcularCarritoTotal(carItems) {
                userData.getAmazonCountItemCart(userData.getData().IdCliente).then(function success(result) {
                    //console.log(result);               
                    $scope.carNumber = result.data.Data.Cart.Quantity;
                    return result.data.Data.Cart.Quantity;
                }, function error(result) {

                });
            }
            /*var refreshCar = function (result) {
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
            };*/
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
                    
                });
            };*/
            $scope.firstSearch = function () {
                $scope.mostrarlabusquedanoarrojoresultados = false;
                $scope.showStoreCarousel = true;
                $scope.showProductsCategory = false;
                $scope.showStoreBreadcrumb = false;
                //let atributoSearchIndexSelected = localStorage.getItem("atributoSearchIndexSelected");
                let vars = $stateParams.serchdata.split(',');

                let atributoSearchIndexSelected = vars[0];

                if (atributoSearchIndexSelected != '' && atributoSearchIndexSelected != null && $scope.labusquedanoarrojoresultados == false) {

                    if (vars[1] > 0) {
                        let SubCategoryId = vars[1];
                        $scope.subCategory = vars[1];
                        showFirstSearchItemsByUrlParams(vars);
                        $scope.showStoreBreadcrumb = true;
                    }

                    getSubcategoryText(vars[1]);

                    //let keyword = localStorage.getItem("keyword");
                    let keyword = decodeURIComponent(vars[2]);



                    if (keyword != null) {
                        $scope.keyword = keyword;
                    }
                    if ($scope.indexs == undefined) {
                        $scope.indexs = userData.getSearchIndex();
                    }


                    angular.forEach($scope.indexs, function (value, key) {

                        if (value.attributes.SearchIndex == atributoSearchIndexSelected) {
                            $scope.index = value;
                        }
                    });

                    $http.get('categorias-es.json').then(function (response) {
                        $scope.categoriesListEs = response.data.categoriases;
                        angular.forEach($scope.categoriesListEs, function (value, key) {
                            if (value.code == $scope.index.attributes.SearchIndex) {
                                $scope.categoryTexto = value.texto;
                            }
                        });
                    });

                    $scope.loadMain = false;
                    $scope.showCar = true;
                    $scope.showImage = false;
                    $scope.doSearch();
                } else {

                    $scope.showProductsCategory = true;
                    getProductsCategory();
                    $scope.loadMain = false;
                    //$scope.Items = result;
                    $scope.showCar = true;
                    $scope.showImage = false;

                }

            };

            function getSubcategoryText(sid) {

                $scope.subCategoriesEs = [];

                $http.get('subcategorias_es.csv').then(function (datos) {
                    $scope.subCategoriesEs = csvToArray(datos.data);

                    $scope.breadcrumbSubCategoryTexto = $scope.subCategoriesEs[sid];
                    //return $scope.subCategoriesEs[sid];             
                });

                /*angular.forEach($scope.subCategoriesList, function(value, key) {
                          
                });    
                angular.forEach($scope.subCategoriesList, function(value, key) { 
                    
                                    
                    if(value.SubCategoryId==sid){
                        
                        return value.textoEs;
                    }                                        
                });   */
            }

            /* $scope.clearShoppingCar = function () {
                 clearCar(userObj.IdCliente).then(function success(result) {
                     var obj = {};
                     obj["data"] = result;
                     refreshCar(obj);
                     angular.element(document.getElementById('cartNumber')).scope().carNumber = 0;
                     $scope.closeModal();
                 });
             };*/

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
                localStorage.setItem("atributoSearchIndexSelected", this.index.attributes.SearchIndex);

                getSubCategories(this.index.attributes.SearchIndex).then(function success(result) {

                    $scope.subCategories = result.data;
                    $scope.showSubCategories = true;
                }, function error(result) {

                    $scope.showSubCategories = false;
                });
            };


            if (userObj != undefined) {
                calcularCarritoTotal(null);
            }



            var getProductsCategory = function () {
                $scope.showProductsCategory = true;
                $scope.showProductsCategoryElectronics = false;

                /*
                11058281,Makeup,Maquillaje
                196601011,Baby & Toddler Toys,Juguetes para Bebés y Niños
                541966,Computers & Accessories,Computadoras y Accesorios
                2811119011,Cell Phones & Accessories,Teléfonos Celulares y Accesorios
                2619534011, PetSupplies, Mascotas
                */

               

                subCategory = 1040660; //1040660Ropa Mujer //11058281;//Makeup,Maquillaje
                $scope.itemsTopSellerMakeup = [];
                $scope.showTopSellerMakeup = false;
                    getTenProducts($scope.itemsTopSellerMakeup,"Fashion", 7147440011, "").then(function success(result) {
                        //console.log('resultresultresultresult',result);
                        //console.log('allProducts',allProducts);
                        /*
                        angular.forEach(result, function (value, key) {
                            //console.log('value',value);
                            let newValue = checkItemData(value);
                            if (newValue != null) {
                                $scope.itemsTopSellerMakeup.push(newValue);
                            }
                        });
                        */
                        if ($scope.itemsTopSellerMakeup.length > 0) {                            
                            $scope.showTopSellerMakeup = true;

                            $scope.ItemsMakeupAll = $scope.itemsTopSellerMakeup;
                            $scope.ItemsMakeupUno = {};
                            $scope.ItemsMakeupDos = {};
                            $scope.ItemsMakeupTres = {};
                            $x = 0;
                            $scope.ItemsMakeupAllTotal = [];
                            angular.forEach($scope.ItemsMakeupAll, function (value, key) {
                                if ($x < 4) {
                                    $scope.ItemsMakeupUno[$x] = value;
                                    $scope.ItemsMakeupAllTotal[0] = 1;
                                } else if ($x < 8) {
                                    $scope.ItemsMakeupDos[$x] = value;
                                    $scope.ItemsMakeupAllTotal[1] = 2;
                                } else if ($x < 12) {
                                    $scope.ItemsMakeupTres[$x] = value;
                                    $scope.ItemsMakeupAllTotal[2] = 3;
                                }
                                $x++;
                            });
                        }
                    }, function error(result) {

                });

                subCategory = 196601011;//Baby & Toddler Toys,Juguetes para Bebés y Niños
                $scope.itemsTopSellerBaby = [];
                $scope.showTopSellerBaby = false;
                getTopSellerProducts(subCategory).then(function success(result) {
                    angular.forEach(result.data.Item, function (value, key) {
                        let newValue = checkItemData(value);
                        if (newValue != null) {
                            $scope.itemsTopSellerBaby.push(newValue);
                        }
                    });
                    if ($scope.itemsTopSellerBaby.length > 0) {
                        $scope.ItemsBabyAllTotal = $scope.itemsTopSellerBaby.length;
                        $scope.showTopSellerBaby = true;

                        $scope.ItemsBabyAll = $scope.itemsTopSellerBaby;
                        $scope.ItemsBabyUno = {};
                        $scope.ItemsBabyDos = {};
                        $scope.ItemsBabyTres = {};
                        $x = 0;
                        $scope.ItemsBabyAllTotal = [];
                        angular.forEach($scope.ItemsBabyAll, function (value, key) {
                            if ($x < 4) {
                                $scope.ItemsBabyUno[$x] = value;
                                $scope.ItemsBabyAllTotal[0] = 1;
                            } else if ($x < 8) {
                                $scope.ItemsBabyDos[$x] = value;
                                $scope.ItemsBabyAllTotal[1] = 2;
                            } else if ($x < 12) {
                                $scope.ItemsBabyTres[$x] = value;
                                $scope.ItemsBabyAllTotal[2] = 3;
                            }
                            $x++;
                        });
                    }
                }, function error(result) {

                });


                subCategory = 541966;//Computers & Accessories,Computadoras y Accesorios
                $scope.itemsTopSellerComputers = [];
                $scope.showTopSellerComputers = false;
                getTopSellerProducts(subCategory).then(function success(result) {
                    angular.forEach(result.data.Item, function (value, key) {
                        let newValue = checkItemData(value);
                        if (newValue != null) {
                            $scope.itemsTopSellerComputers.push(newValue);
                        }
                    });
                    if ($scope.itemsTopSellerComputers.length > 0) {
                        $scope.showTopSellerComputers = true;
                        ////console.log('getTopSellerProducts Computers $scope.itemsTopSellerComputers ',$scope.itemsTopSellerComputers);
                        $scope.ItemsComputersAll = $scope.itemsTopSellerComputers;
                        $scope.ItemsComputersUno = {};
                        $scope.ItemsComputersDos = {};
                        $scope.ItemsComputersTres = {};
                        $x = 0;
                        $scope.ItemsComputersAllTotal = [];
                        angular.forEach($scope.ItemsComputersAll, function (value, key) {
                            if ($x < 4) {
                                $scope.ItemsComputersUno[$x] = value;
                                $scope.ItemsComputersAllTotal[0] = 1;
                            } else if ($x < 8) {
                                $scope.ItemsComputersDos[$x] = value;
                                $scope.ItemsComputersAllTotal[1] = 2;
                            } else if ($x < 12) {
                                $scope.ItemsComputersTres[$x] = value;
                                $scope.ItemsComputersAllTotal[2] = 3;
                            }
                            $x++;
                        });
                        console.log('$scope.ItemsComputersAllTotal',$scope.ItemsComputersAllTotal);
                    }
                }, function error(result) {
                    ////console.log(result);
                });


                subCategory = 2811119011;//2811119011,CellPhones & Accessories,Teléfonos Celulares y Accesorios
                $scope.itemsTopSellerCellPhones = [];
                $scope.showTopSellerCellPhones = false;
                getTopSellerProducts(subCategory).then(function success(result) {
                    angular.forEach(result.data.Item, function (value, key) {
                        let newValue = checkItemData(value);
                        if (newValue != null) {
                            $scope.itemsTopSellerCellPhones.push(newValue);
                        }
                    });
                    if ($scope.itemsTopSellerCellPhones.length > 0) {
                        $scope.showTopSellerCellPhones = true;
                        ////console.log('getTopSellerProducts CellPhones $scope.itemsTopSellerCellPhones ',$scope.itemsTopSellerCellPhones);
                        $scope.ItemsCellPhonesAll = $scope.itemsTopSellerCellPhones;
                        $scope.ItemsCellPhonesUno = {};
                        $scope.ItemsCellPhonesDos = {};
                        $scope.ItemsCellPhonesTres = {};
                        $x = 0;
                        $scope.ItemsCellPhonesAllTotal = [];
                        angular.forEach($scope.ItemsCellPhonesAll, function (value, key) {
                            if ($x < 4) {
                                $scope.ItemsCellPhonesUno[$x] = value;
                                $scope.ItemsCellPhonesAllTotal[0] = 1;
                            } else if ($x < 8) {
                                $scope.ItemsCellPhonesDos[$x] = value;
                                $scope.ItemsCellPhonesAllTotal[1] = 2;
                            } else if ($x < 12) {
                                $scope.ItemsCellPhonesTres[$x] = value;
                                $scope.ItemsCellPhonesAllTotal[2] = 3;
                            }
                            $x++;
                        });
                    }
                }, function error(result) {
                    ////console.log(result);
                });

/*
                subCategory = 1040658; //roma hombres //2619534011;//PetSupplies, Mascotas
                $scope.itemsTopSellerPetSupplies = [];
                $scope.showTopSellerPetSupplies = false;
                getTopSellerProducts(subCategory).then(function success(result) {
                    angular.forEach(result.data.Item, function (value, key) {
                        let newValue = checkItemData(value);
                        if (newValue != null) {
                            $scope.itemsTopSellerPetSupplies.push(newValue);
                        }
                    });
                    if ($scope.itemsTopSellerPetSupplies.length > 0) {
                        $scope.showTopSellerPetSupplies = true;
                        ////console.log('getTopSellerProducts PetSupplies $scope.itemsTopSellerPetSupplies ',$scope.itemsTopSellerPetSupplies);
                        $scope.ItemsPetSuppliesAll = $scope.itemsTopSellerPetSupplies;
                        $scope.ItemsPetSuppliesUno = {};
                        $scope.ItemsPetSuppliesDos = {};
                        $scope.ItemsPetSuppliesTres = {};
                        $x = 0;
                        angular.forEach($scope.ItemsPetSuppliesAll, function (value, key) {
                            if ($x < 4) {
                                $scope.ItemsPetSuppliesUno[$x] = value;
                            } else if ($x < 8) {
                                $scope.ItemsPetSuppliesDos[$x] = value;
                            } else if ($x < 12) {
                                $scope.ItemsPetSuppliesTres[$x] = value;
                            }
                            $x++;
                        });
                    }
                }, function error(result) {
                    ////console.log(result);
                });
*/





                subCategory = 1040658; //roma hombres //2619534011;//PetSupplies, Mascotas
                $scope.itemsTopSellerPetSupplies = [];
                $scope.showTopSellerPetSupplies = false;
                getTenProducts($scope.itemsTopSellerPetSupplies, "Fashion", 1040658, "").then(function success(result) {
                    //console.log('resultresultresultresult',result);
                    //console.log('allProducts',allProducts);
                    /*
                    angular.forEach(result, function (value, key) {
                        //console.log('value',value);
                        let newValue = checkItemData(value);
                        if (newValue != null) {
                            $scope.itemsTopSellerMakeup.push(newValue);
                        }
                    });
                    */
                    if ($scope.itemsTopSellerPetSupplies.length > 0) {
                        $scope.showTopSellerPetSupplies = true;
                        ////console.log('getTopSellerProducts PetSupplies $scope.itemsTopSellerPetSupplies ',$scope.itemsTopSellerPetSupplies);
                        $scope.ItemsPetSuppliesAll = $scope.itemsTopSellerPetSupplies;
                        $scope.ItemsPetSuppliesUno = {};
                        $scope.ItemsPetSuppliesDos = {};
                        $scope.ItemsPetSuppliesTres = {};
                        $x = 0;
                        $scope.ItemsPetSuppliesAllTotal[0] = [];
                        angular.forEach($scope.ItemsPetSuppliesAll, function (value, key) {
                            if ($x < 4) {
                                $scope.ItemsPetSuppliesUno[$x] = value;
                                $scope.ItemsPetSuppliesAllTotal[0] = 1;
                            } else if ($x < 8) {
                                $scope.ItemsPetSuppliesDos[$x] = value;
                                $scope.ItemsPetSuppliesAllTotal[1] = 2;
                            } else if ($x < 12) {
                                $scope.ItemsPetSuppliesTres[$x] = value;
                                $scope.ItemsPetSuppliesAllTotal[2] = 3;
                            }
                            $x++;
                        });
                        
                    }
                }, function error(result) {
                    ////console.log(result);
                });





            };

            if ($scope.showProductsCategory) {
                getProductsCategory();
            }

            var refreshMyWishList = function (item) {
                //////console.log('item',item.ItemId);
            }

            function goToTopBody() {
                $('html,body').animate({
                    scrollTop: (1)
                }, 1000);
            }

            $scope.addToWishList = function (item) {
                if (userObj != undefined) {
                    //////console.log('myWishList'+userObj.IdCliente);
                    if (localStorage.getItem('myWishList' + userObj.IdCliente) === null) {
                        oldItems = [];
                    } else {
                        //////console.log('oldItems',oldItems);
                        var oldItems = JSON.parse(localStorage.getItem('myWishList' + userObj.IdCliente)) || [];
                    }
                    var newItem = {
                        'ItemId': item.ItemId,
                        'ImageUrl': item.Image.ImageUrl,
                        'Title': item.Attributes.Title,
                        //'FormattedPrice': item.Offers.Offer.OfferListing.Price.FormattedPrice
                        'FormattedPrice': item.OfferSummary.ListPrice.FormattedPrice
                    };
                    let duplicados = false;
                    for (let index = 0; index < oldItems.length; index++) {
                        let element = oldItems[index];
                        if (element.ItemId === item.ItemId) {
                            $state.go('misFavoritos');
                            setTimeout(goToTopBody, 200);
                            duplicados = true;
                        }
                        ////console.log('element',element);
                    }
                    if (!duplicados) {
                        oldItems.push(newItem);
                        localStorage.setItem('myWishList' + userObj.IdCliente, JSON.stringify(oldItems));
                        refreshMyWishList(item);
                        ////console.log('oldItems',oldItems);
                        var element = document.getElementsByClassName("add_to_wish_list-" + item.ItemId);
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

            function moveToCart(id, cat) {
                let boxitBartop = angular.element(document.getElementById('boxitBar-top'));
                let productaddtocartitemidcat = "product-addtocart-" + id + "-" + cat;
                let datagoimageContainer = angular.element(document.getElementById(productaddtocartitemidcat));
                var body = $("html, body");
                body.stop().animate({ scrollTop: 0 }, 700, 'swing', function () { });
                var itemImg = datagoimageContainer.attr('data-goimage');
                flyToElement(itemImg, '.cart_anchor');
            }

            function flyToElement(flyer, flyingTo) {
                //var $func = $(this);
                let flyer_var = angular.element(document.getElementById(flyer));
                var divider = 3;
                var flyerClone = flyer_var.clone();
                $(flyerClone).css({ position: 'absolute', top: flyer_var.offset().top + "px", left: flyer_var.offset().left + "px", opacity: 1, 'z-index': 1000 });
                $(flyerClone).addClass("moveme");
                $('body').append($(flyerClone));
                var gotoX = $(flyingTo).offset().left + ($(flyingTo).width() / 2) - (flyer_var.width() / divider) / 2;
                var gotoY = $(flyingTo).offset().top + ($(flyingTo).height() / 2) - (flyer_var.height() / divider) / 2;
                $(flyerClone).animate({
                    opacity: 0.4,
                    left: gotoX,
                    top: gotoY,
                    width: flyer_var.width() / divider,
                    height: flyer_var.height() / divider
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
                $('.rusia2018-right').hide();
                $('.giftcards-right').hide();
            });
            $('.navbar').addClass('white');
            $('.rusia2018-right').show();
            $('.giftcards-right').show();
            //////console.log("show Rusia"); 



            //guardarSubcategorias();
            function guardarSubcategorias() {
                let categorias = [];
                let subcategorias = [];
                angular.forEach($scope.categoriesList, function (value, key) {
                    if (value.value == $scope.topCategory) {
                        value.subcategorias = [];
                        categorias.push(value);
                    }
                });
                angular.forEach($scope.subCategoriAs, function (value, key) {
                    categorias[0].subcategorias.push(value);
                });
                ////console.log(JSON.stringify(categorias));
            }

            function obtenerSubcategorias_OLD(category) {
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

            function obtenerSubcategorias(catIndex) {
                ////console.log('$scope.categoriesList',$scope.categoriesList[catIndex].subcategorias);
                return $scope.categoriesList[catIndex].subcategorias;

            }

            $scope.mostrarSubcategorias = function (topCategory, catIndex) {
                $scope.topCategory = topCategory;
                if ($scope.topCategoryLastSelected == topCategory) {
                    $scope.showSubCategoriAs = 0;
                    $scope.topCategoryLastSelected = 0;
                } else {
                    $scope.topCategoryLastSelected = topCategory;
                    categoryClick(topCategory);
                    $scope.subCategoriAs = obtenerSubcategorias(catIndex);
                    //obtenerSubcategorias(catIndex).then(function success(result) {  
                    $scope.showSubCategoriAs = topCategory;
                    //$scope.subCategoriAs = result.data;                        
                    //}, function error(result) {
                    //////console.log(result);
                    //$scope.showSubCategoriAs = false;
                    //});
                }
            };

            function categoryClick(category) {
                angular.forEach($scope.indexs, function (value, key) {
                    if (value.attributes.SearchIndex == category) {
                        $scope.index = value;
                    }
                });
                //$scope.setSubCategories();
            }

            function subCategoryClick(subCategory) {
                angular.forEach($scope.subCategories, function (value, key) {
                    //////console.log("value" , value );
                    if (value.SubCategoryId == subCategory) {
                        $scope.subCategory = value;
                    }
                });

                //showProductsSubcategory();
            }
            $scope.mostrarProductos = function (subCategory, subCategoryTexto, categoryValue, categoryTexto) {
                //console.log('mostrarProductos');
                $scope.mostrarlabusquedanoarrojoresultados = false;
                $scope.showStoreBreadcrumb = true;
                $scope.subCategoryTexto = subCategoryTexto;
                $scope.breadcrumbSubCategoryTexto = subCategoryTexto;
                $scope.categoriaTexto = categoryTexto;
                $scope.categoryTexto = categoryTexto;
                ////console.log('$scope.categoriaTexto',$scope.categoriaTexto);
                ////console.log('categoryTexto',categoryTexto);
                ////console.log('$scope.breadcrumbSubCategoryTexto',$scope.breadcrumbSubCategoryTexto);
                //////console.log('$scope.categoryTexto',$scope.categoryTexto);
                var element = document.getElementById("buttonShowCategories");
                $(element).click();



                //////console.log('$location.path(',$location.path());  


                //////console.log('element',element);



                $location.path('/boxitStore/' + categoryValue + ',' + subCategory + ',');
                

            }

            function showFirstSearchItemsByUrlParams(vars) {
                //console.log('showFirstSearchItemsByUrlParams');
                categoryClick(vars[0]);
                $scope.keyword = "";
                $scope.showTopSellerProducts = false;
                $scope.showNewReleaseProducts = false;
                localStorage.setItem('subCategorySelected', vars[1]);
                let subCategorySelected = localStorage.getItem('subCategorySelected');
                subCategoryClick(vars[1]);
                $scope.itemsTopSellerProducts = [];
                $scope.loadMain = true;
                goToTopBody();


                if(vars[2]==""){
                    showTopSellerProducts(vars[1]);
                    showNewReleaseProducts(vars[1]);
                    showTenMoreProducts(vars[0], vars[1]);
                }
                //console.log('vars[2]',vars[2]);
                

                $scope.showProductsCategory = false;
                $scope.showStoreCarousel = false;
            }
            function showTopSellerProducts(subCategory) {
                //console.log('showTopSellerProducts');
                getTopSellerProducts(subCategory).then(function success(result) {
                    //console.log('getTopSellerProducts',result);
                    angular.forEach(result.data.Item, function (value, key) {
                        //////console.log("value" , value );
                        let newValue = checkItemData(value);
                        //////console.log("newValue" , newValue );
                        if (newValue != null && newValue.priceToShow != '') {
                            //////console.log("newValue.priceToShow" , newValue.priceToShow );
                            $scope.itemsTopSellerProducts.push(newValue);
                        }
                    });
                    ////console.log('$scope.itemsTopSellerProducts.length',$scope.itemsTopSellerProducts.length);
                    if ($scope.itemsTopSellerProducts.length > 0) {
                        $scope.showTopSellerProducts = true;
                        $scope.loadMain = false;
                    } else {
                        $scope.showSearchTopNewProdctsEmpty = true;
                    }

                    //$scope.Items = $scope.subcategoryProducts;

                }, function error(result) {
                    ////console.log(result);
                });
            }


            function showNewReleaseProducts(subCategory) {
                //console.log('showNewReleaseProducts');
                $scope.itemsNewReleaseProducts = [];
                getNewReleaseProducts(subCategory).then(function success(result) {
                    ////console.log('getNewReleaseProducts.length');
                    angular.forEach(result.data.Item, function (value, key) {
                        //////console.log("value" , value );
                        let newValue = checkItemData(value);
                        //////console.log("newValue" , newValue );
                        if (newValue != null && newValue.priceToShow != '') {
                            //////console.log("newValue.priceToShow" , newValue.priceToShow );
                            $scope.itemsNewReleaseProducts.push(newValue);
                        }
                    });
                    if ($scope.itemsNewReleaseProducts.length > 0) {
                        $scope.showNewReleaseProducts = true;
                        $scope.loadMain = false;
                        ////console.log("$scope.itemsNewReleaseProducts.length" , $scope.itemsNewReleaseProducts.length );
                    } else {
                        if ($scope.showSearchTopNewProdctsEmpty) {

                        }
                    }

                }, function error(result) {
                    ////console.log(result);
                });
            }


            function showTenMoreProducts(categoryValue, subCategory) {
                //console.log('showTenMoreProducts');
                var defered = $q.defer();
                params = [];
                params["SearchIndex"] = categoryValue;
                params["Keywords"] = "";
                if (subCategory > 0) {
                    params["SubCategoryId"] = subCategory;
                } else {
                    params["SubCategoryId"] = '';
                }

                ////console.log("params",params);
                $http({
                    method: "POST",
                    url: userData.getHost() + "/amazon/amazongetkeywords",
                    data: params,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(function success(result) {
                    //console.log('result',result);
                    if (result !== undefined && result !== null) {
                        if (result.data.Item) {
                            if (result.data.Item.length > 1) {
                                angular.forEach(result.data.Item, function (value, key) {
                                    ////console.log("value" , value );
                                    let newValue = checkItemData(value);
                                    if (newValue != null) {
                                        allProducts.push(newValue);
                                    }
                                });
                            } else {
                                value = result.data.Item;
                                let newValue = checkItemData(value);
                                if (newValue != null) {
                                    allProducts.push(newValue);
                                }
                            }
                        }
                    }
                    defered.resolve(result.data.Item);
                }, function error(result) {
                    defered.reject(result.data);
                });

            }
















            function getTopSellerProducts(BrowseNodeId) {
                var defered = $q.defer();
                var promise = defered.promise;
                $http({
                    method: "POST",
                    url: userData.getHost() + "/amazon/amazongettopsellerproducts",
                    data: {
                        "BrowseNodeId": BrowseNodeId
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

            function getNewReleaseProducts(BrowseNodeId) {
                var defered = $q.defer();
                var promise = defered.promise;
                $http({
                    method: "POST",
                    url: userData.getHost() + "/amazon/amazongetnewreleaseproducts",
                    data: {
                        "BrowseNodeId": BrowseNodeId
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

            function getTenProducts(objetoContenedor,categoryValue, subCategory=0, keyword_="") {
                //console.log('getTenProducts');
                //var defered = $q.defer();
                //var promise = defered.promise;
                products = [];
                var promises = [];
                var i;
                for (i = 1; i < 6; i++) {
                    var defered = $q.defer();

                        var searchParams = {};
                        //  ////console.log(self);
                        searchParams["Keywords"] = keyword_;
                        searchParams["SubCategoryId"] = subCategory;                        
                        searchParams["SearchIndex"] = categoryValue;
                        searchParams["ItemPage"] = i;
                        var curIndex = i;
                        //console.log('searchParams ::: ', searchParams);
                        defered.resolve(callPageItems(objetoContenedor,searchParams).then(function success(result) {
                            //console.log('result', result);
                            if (result !== undefined && result !== null) {
                                //console.log('result', result);
                                //$scope.hayItemsPorMostrar = true;
                            }
                            //defered.resolve('success');
                        }, function error(result) {
                            //console.log(result);
                            // defered.resolve('success');
                        }));

                        promises.push(defered.promise);                    
                }
                return $q.all(promises);
            }


            function callPageItems(objetoContenedor,params) {
                var defered = $q.defer();
                var promise = defered.promise;
                //console.log("params",params);
                //console.log("callPages","/amazon/amazongetkeywords");
                $http({
                    method: "POST",
                    url: userData.getHost() + "/amazon/amazongetkeywords",
                    data: params,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(function success(result) {
                    //console.log("callPages amazongetkeywords result", result);
                    if (result !== undefined && result !== null) {
                        products[params["ItemPage"] - 1] = result.data.Item;
                        if (result.data.Item) {
                            if (result.data.Item.length > 1) {
                                angular.forEach(result.data.Item, function (value, key) {
                                    //////console.log("value" , value );
                                    let newValue = checkItemData(value);
                                    if (newValue != null) {
                                        if(objetoContenedor.length<12){
                                             objetoContenedor.push(newValue);
                                        }                                       
                                    }
                                });
                                //console.log("allProducts" , allProducts );
                            } else {
                                value = result.data.Item;
                                let newValue = checkItemData(value);
                                if (newValue != null) {
                                    if(objetoContenedor.length<12){
                                        objetoContenedor.push(newValue);
                                   } 
                                }
                            }
                        }
                    }
                    defered.resolve(result.data.Item);
                }, function error(result) {
                    defered.reject(result.data);
                });
                return promise;
            }






                /*
                //console.log("params",params);
                $http({
                    method: "POST",
                    url: userData.getHost() + "/amazon/amazongetkeywords",
                    data: params,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(function success(result) {
                   //console.log('result',result);
                    if (result !== undefined && result !== null) {
                        if (result.data.Item) {
                            if (result.data.Item.length > 1) {
                                angular.forEach(result.data.Item, function (value, key) {
                                    //console.log("value" , value );
                                    let newValue = checkItemData(value);
                                    if (newValue != null) {
                                        allProducts.push(newValue);
                                    }
                                });
                            } else {
                                value = result.data.Item;
                                let newValue = checkItemData(value);
                                if (newValue != null) {
                                    allProducts.push(newValue);
                                }
                            }
                        }
                    }
                    defered.resolve(result.data.Item);
                }, function error(result) {
                    defered.reject(result.data);
                });
                return promise;
                */

            /*function getSearchEmptySubcategoryProducts(subCategoryTexto){
                $scope.keyword = subCategoryTexto;
                $scope.preventCacheSearchKeyword = true;
                $scope.doSearch();
                return true;
            }*/


            //getNewReleaseProducts

            //obtener listado de categorias


            function obtenerCategoriesListFromJson() {
                return $http.get('categorias-subcategorias.json').then(function (response) {
                    let datos = response.data.categorias;
                    let i = 0;
                    angular.forEach(datos, function (value, key) {
                        value.text = $scope.categoriesListEs[i].texto;
                        let subcats = value.subcategorias;

                        subcatIndex = 0;

                        angular.forEach(subcats, function (v) {
                            //////console.log('v',v);
                            value.subcategorias[subcatIndex].textoEs = $scope.subCategoriesEs[v.SubCategoryId];
                            subcatIndex++;
                            $scope.subCategoriesList.push(value.subcategorias[subcatIndex]);
                        });

                        $scope.categoriesList.push(value);
                        i++;
                        //////console.log('value',value);
                    });
                });
            }
            function obtenerCategoriesListEs() {
                $scope.categoriesListEs = [];
                $scope.subCategoriesEs = [];

                $http.get('subcategorias_es.csv').then(function (datos) {
                    $scope.subCategoriesEs = csvToArray(datos.data);
                    ////console.log('$scope.subCategoriesEs',$scope.subCategoriesEs);                    
                });

                $http.get('categorias-es.json').then(function (response) {
                    $scope.categoriesListEs = response.data.categoriases;
                    //////console.log(' $scope.categoriesListEs', $scope.categoriesListEs);    
                    obtenerCategoriesListFromJson();
                });
            }

            function csvToArray(csvString) {
                var lines = csvString.split('\n');
                var row = [];
                lines.forEach(function (v) {
                    var line = v.split(',');
                    row[line[0]] = line[2];
                    //////console.log("v",v);
                });
                return row;
                //////console.log("row",row);                
            }

            $scope.resetearCategorias = function () {
                $scope.showStoreBreadcrumb = false;
                $scope.subCategoryTexto = "";
                $scope.categoryTexto = "Categorías";
                $scope.showTopSellerProducts = false;
                $scope.showNewReleaseProducts = false;

                $scope.index = "";
                $scope.keyword = '';
                ////console.log('$location.path(/boxitStore',$location.path());
                $location.path('/boxitStore/');
                /*
                                if($scope.keyword!=undefined && $scope.keyword!=null && $scope.keyword!="undefined" && $scope.keyword!='' && $scope.keyword!=' '){
                                    if($scope.keyword.length>0){
                                        categoryClick("All");
                                        $scope.keyword = '';
                                        $scope.doSearch();
                                    }else{
                                        $scope.index = "";
                                        $scope.keyword = '';
                                        $state.go('boxitStore');
                                        location.reload();
                                    }                    
                                }else{
                                    $scope.index = "";
                                    $scope.keyword = '';
                                    $state.go('boxitStore');
                                    location.reload();
                                }
                                */
            };

            function showPopupNoResults(){
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'views/modalCambioClave.html',
                    controller: 'modalCambioClaveController',
                    size: 'sm',
                    resolve: {
                        mensaje: function () {
                            var mensaje = {};
                            mensaje.titulo = "Busqueda";
                            mensaje.texto = "La busqueda no arrojo resultados...";
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
            };

        }]);
