angular
    .module('boxit')
    .controller('boxitStoreController', ['$scope', '$stateParams', '$http', '$q', '$anchorScroll', 'userData', '$uibModal', '$localStorage', '$window', '$location', '$interval', '$state',
        function ($scope, $stateParams, $http, $q, $anchorScroll, userData, $uibModal, $localStorage, $window, $location, $interval, $state) {
            var products = [];
            var allProducts = [];            
            var links = [];
            console.log('$stateParams.serchdata',$stateParams.serchdata);
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
            $scope.labusquedanoarrojoresultados=false;
            $scope.topCategory = "";
            $scope.showLeftCategories = false;
            $scope.categoriesList = [];
            $scope.subcategoryProducts = [];
            $scope.itemsTopSellerProducts = [];
            $scope.itemsNewReleaseProducts = [];
            $scope.showTopSellerProducts = false;
            $scope.showNewReleaseProducts = false;

            console.log("$scope.categoriesList",$scope.categoriesList);
            var userObj =  userData.getData();
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
            $scope.showProductsCategory = true;
            
            //console.log('controller boxitStoreController');
             //setInterval(getCar, 10000);
            var getCar = function () {
               
                userData.getShoppingCar(id).then(function success(result) {
                    //console.log(result);
                    refreshCar(result);
                    return result;
                }, function error(result) {
                    console.log(result);
                });
            };
            $scope.doSearch = function () {                
                console.log('doSearch');
                $scope.showProductsCategory = false;
                $scope.showStoreCarousel = false;
                //console.log('showProductsCategory',$scope.showProductsCategory);
                $scope.loadMain = true;
                $scope.showCar = false;
                $scope.currentPage = 1;
                products = [];
                $scope.totalItems = 0;
                allProducts = [];
               // console.log(this);

                    searchProducts(this).then(function success(result) {
                        $scope.showCarMessage = false;
                        $scope.showImage = false;
                        products = [];
                        $scope.totalItems = allProducts.length;
                        if($scope.totalItems>$scope.itemsPerPage){
                            $scope.showPagination = true;
                        }else{
                            $scope.showPagination = false
                        }
                        let j = 0;
                        products[j] = [];
                        for (i = 0; i < allProducts.length; i++) {                            
                            if(i%$scope.itemsPerPage==0 & i>0){
                                j++;
                                products[j] = [];
                            }
                            if(allProducts[i]){
                                products[j].push(allProducts[i]);
                            }  
                        }
                        $scope.Items = products[0];
                        if(products[0].length==0){
                            products[0] = undefined;
                        }
                        $scope.labusquedanoarrojoresultados=false;                
                       // products.reverse();
                        if (products[0] == undefined) {
                            $scope.loadMain = false;
                            $scope.showCar = false;
                            $scope.labusquedanoarrojoresultados=true;
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
                        } else {
                            $scope.loadMain = false;
                            $scope.showCar = true;
                            $scope.showPagination = true
                            
                        }
                    });                
            };
            function searchProducts(self) {
                
                var promises = [];
                var i;
                for (i = 1; i < 6; i++) {
                    var defered = $q.defer();
                   // console.log("self.keyword ",self.keyword);
                    
                    if (self.keyword != undefined) {
                        localStorage.setItem("keyword",self.keyword);
                        var searchParams = {};
                      //  console.log(self);
                        searchParams["Keywords"] = self.keyword;
                        if (self.index != null || self.index != undefined)
                        {
                            searchParams["SearchIndex"] = self.index.attributes.SearchIndex;

                        }else{
                            searchParams["SearchIndex"] = "All";
                        }
                        searchParams["ItemPage"] = i;
                        var curIndex = i;
                        //console.log(curIndex);
                        defered.resolve(callPages(searchParams).then(function success(result) {
                            if (result !== undefined && result !== null) {}
                            //defered.resolve('success');
                        }, function error(result) {
                            console.log(result);
                            // defered.resolve('success');
                        }));

                        promises.push(defered.promise);

                        $location.path('/boxitStore/'+searchParams["SearchIndex"]+','+searchParams["Keywords"]);
                        console.log('$location.path(',$location.path());
                        console.log();

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
                //console.log("params",params);
                $http({
                    method: "POST",
                    url: userData.getHost() + "/amazon/amazongetkeywords",
                    data: params,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(function success(result) {
                      if (result !== undefined && result !== null){
                         products[params["ItemPage"] - 1] =  result.data.Item;
                         if(result.data.Item){
                            if(result.data.Item.length>1){
                                angular.forEach(result.data.Item, function(value, key) {
                                    //console.log("value" , value );
                                    let newValue = checkItemData(value);
                                    if(newValue!=null){
                                        allProducts.push(newValue);
                                    }                                    
                                });
                            }else{
                                value = result.data.Item;
                                let newValue = checkItemData(value);
                                if(newValue!=null){
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

            function checkItemData(value){
                value.Price_FormattedPrice = 0;
                if(!value.ItemId || value.ItemId==null){ return null; }
                if(!value.Image || value.Image==null){ return null; }  
                if(value.Offers!=null){                                                           
                    if(value.Offers.Offer!=null){
                        if(value.Offers.Offer.OfferListing!=null){
                            if(value.Offers.Offer.OfferListing.Price!=null){
                                value.Price_FormattedPrice=value.Offers.Offer.OfferListing.Price.FormattedPrice;
                                console.log("value.Price_FormattedPrice",value.Price_FormattedPrice);
                            }
                        }
                    }
                }
                if(value.OfferSummary!=null){
                    if(value.OfferSummary.ListPrice!=null){
                        value.ListPrice_FormattedPrice=value.OfferSummary.ListPrice.FormattedPrice;
                        console.log("value.Price_FormattedPrice",value.Price_FormattedPrice);
                    }
                }
                console.log("value.Price_FormattedPrice",value.Price_FormattedPrice);
                       
                return value;
            }

            $scope.pageChanged = function () {
                this.Items = products[this.currentPage - 1];
               // $location.hash('top');
               // $anchorScroll();
            };
            $scope.initIndex = function () {
                
                if ($scope.indexs == undefined) {
                    console.log("realizando busqueda");
                    userData.setSearchIndex();
                    $interval(function () {
                        $scope.indexs = userData.getSearchIndex();
                    }, 1500);
                }
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
                    console.log('boxitStoreController showShoppingCar');
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
            $scope.addToCar = function (itemadded,cat) {
                if (userObj != undefined) {
                    moveToCart(itemadded.ItemId,cat);
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
                    if(itemadded.Attributes.PackageDimensions != null){
                        args["Weight"] = itemadded.Attributes.PackageDimensions.Weight;
                    }else{
                        args["Weight"] = 0;
                    }
                    args["Width"] = itemadded.Attributes.PackageDimensions.Width;

                    // Image
                    args["UrlImage"] = itemadded.Image.ImageUrl;
                    console.log("args",args);
                    userData.addItemToCar(args).then(function success(result) {
                        console.log("addItemToCar",result);
                        refreshCar(result);
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

                    //$scope.showShoppingCar();                    
                    //$state.go('modalLoginNew');                    
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
            $scope.modifyCar = function (op, carItemId, cantidad) {
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
            };
            $scope.firstSearch = function () {
                $scope.showStoreCarousel = true;
                
                //let atributoSearchIndexSelected = localStorage.getItem("atributoSearchIndexSelected");
                let vars = $stateParams.serchdata.split(',');
                console.log('vars[0]',vars[0]);
                console.log('vars[0]',typeof vars[0]);
                let atributoSearchIndexSelected = vars[0];
                console.log("atributoSearchIndexSelected",atributoSearchIndexSelected);
                
            if(atributoSearchIndexSelected!='' && atributoSearchIndexSelected!=null && $scope.labusquedanoarrojoresultados==false){
                                
                //let keyword = localStorage.getItem("keyword");
                let keyword = vars[1];
                console.log("self.keyword ",$scope.keyword);
                console.log("keyword ",keyword);

                if(keyword!=null){
                    $scope.keyword = keyword;
                }
                if($scope.indexs==undefined){
                    $scope.indexs = userData.getSearchIndex();
                }
                //console.log("$scope.indexs",$scope.indexs);

                angular.forEach($scope.indexs, function(value, key) {
                    //console.log("value" , value );
                    if(value.attributes.SearchIndex == atributoSearchIndexSelected){
                        $scope.index = value;
                    }
                });          
                
                $scope.loadMain = false;
                $scope.showCar = true;
                $scope.showImage = false;
                $scope.doSearch();
            }else{
                //userData.getFirstSearch().then(function success(result) {
                    $scope.loadMain = false;
                    //$scope.Items = result;
                    $scope.showCar = true;
                    $scope.showImage = false;
                //}, function error(result) {
                //});
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
                console.log("this.index",this.index);
                console.log("setSubCategories",this.index.attributes.SearchIndex);
                localStorage.setItem("atributoSearchIndexSelected",this.index.attributes.SearchIndex);
            
                getSubCategories(this.index.attributes.SearchIndex).then(function success(result) {
                   
                    $scope.subCategories = result.data;
                    $scope.showSubCategories = true;
                }, function error(result) {
                    console.log(result);
                    $scope.showSubCategories = false;
                });
            };
            if (userObj != undefined) {
            getCar();
            }
            


            var getProductsCategory = function () {
            $scope.showProductsCategory = true;
                
             var searchParams = {};
                searchParams["SearchIndex"] = 'Electronics';
                userData.getDefaultSearch(searchParams).then(function success(result) {
                    $scope.ItemsElectronicsAll= result;
                    $scope.ItemsElectronicsUno= {};
                    $scope.ItemsElectronicsDos= {};
                    $scope.ItemsElectronicsTres= {};
                    $scope.ItemsElectronicsUno[0] = checkItemData(result[0]);
                    $scope.ItemsElectronicsUno[1] = checkItemData(result[1]);
                    $scope.ItemsElectronicsUno[2] = checkItemData(result[2]);
                    $scope.ItemsElectronicsUno[3] = checkItemData(result[3]);
                    $scope.ItemsElectronicsDos[0] = checkItemData(result[4]);
                    $scope.ItemsElectronicsDos[1] = checkItemData(result[5]);
                    $scope.ItemsElectronicsDos[2] = checkItemData(result[6]);
                    $scope.ItemsElectronicsDos[3] = checkItemData(result[7]);
                    $scope.ItemsElectronicsTres[0] = checkItemData(result[8]);
                    $scope.ItemsElectronicsTres[1] = checkItemData(result[9]);
                    console.log('ItemsElectronics',$scope.ItemsElectronicsAll)
                }, function error(result) {
                });
                /*
                añadir en el boxit store, categoría de  belleza y salud, ropa y  juguetes-juegos. así como actualmente está electronics y baby que están bien
                */
              /*var searchParams = {};
               searchParams["SearchIndex"] = 'Handbags';
               userData.getDefaultSearch(searchParams).then(function success(result) {
                $scope.ItemsHandbagsUno= {};
                $scope.ItemsHandbagsDos= {};
                $scope.ItemsHandbagsTres= {};
                $scope.ItemsHandbagsUno[0] = result[0];
                $scope.ItemsHandbagsUno[1] = result[1];
                $scope.ItemsHandbagsUno[2] = result[2];
                $scope.ItemsHandbagsUno[3] = result[3];
                $scope.ItemsHandbagsDos[0] = result[4];
                $scope.ItemsHandbagsDos[1] = result[5];
                $scope.ItemsHandbagsDos[2] = result[6];
                $scope.ItemsHandbagsDos[3] = result[7];
                $scope.ItemsHandbagsTres[0] = result[8];
                $scope.ItemsHandbagsTres[1] = result[9];
                console.log('ItemsHandbags',$scope.ItemsHandbags)
               }, function error(result) {
               });*/

               var searchParams = {};
               searchParams["SearchIndex"] = "FashionWomen";
               userData.getDefaultSearch(searchParams).then(function success(result) {
                $scope.ItemsToysAll = result;
                $scope.ItemsToysUno= {};
                $scope.ItemsToysDos= {};
                $scope.ItemsToysTres= {};
                $scope.ItemsToysUno[0] = checkItemData(result[0]);
                $scope.ItemsToysUno[1] = checkItemData(result[1]);
                $scope.ItemsToysUno[2] = checkItemData(result[2]);
                $scope.ItemsToysUno[3] = checkItemData(result[3]);
                $scope.ItemsToysDos[0] = checkItemData(result[4]);
                $scope.ItemsToysDos[1] = checkItemData(result[5]);
                $scope.ItemsToysDos[2] = checkItemData(result[6]);
                $scope.ItemsToysDos[3] = checkItemData(result[7]);
                $scope.ItemsToysTres[0] = checkItemData(result[8]);
                $scope.ItemsToysTres[1] = checkItemData(result[9]);
                //console.log('ItemsToys',$scope.ItemsToys)
               }, function error(result) {
               });
               
              var searchParams = {};
               searchParams["SearchIndex"] = 'FashionMen';
               userData.getDefaultSearch(searchParams).then(function success(result) {                
                   if(result!=null & result!=undefined){
                    $scope.ItemsmenshoesAll= result;
                    $scope.ItemsmenshoesUno= {};
                    $scope.ItemsmenshoesDos= {};
                    $scope.ItemsmenshoesTres= {};
                    $scope.ItemsmenshoesUno[0] = checkItemData(result[0]);
                    $scope.ItemsmenshoesUno[1] = checkItemData(result[1]);
                    $scope.ItemsmenshoesUno[2] = checkItemData(result[2]);
                    $scope.ItemsmenshoesUno[3] = checkItemData(result[3]);
                    $scope.ItemsmenshoesDos[0] = checkItemData(result[4]);
                    $scope.ItemsmenshoesDos[1] = checkItemData(result[5]);
                    $scope.ItemsmenshoesDos[2] = checkItemData(result[6]);
                    $scope.ItemsmenshoesDos[3] = checkItemData(result[7]);
                    $scope.ItemsmenshoesTres[0] = checkItemData(result[8]);
                    $scope.ItemsmenshoesTres[1] = checkItemData(result[9]);
                    //console.log('Itemsmenshoes',$scope.Itemsmenshoes);
                   }
             
                }, function error(result) {
                });

               var searchParams = {};
               searchParams["SearchIndex"] = 'Fashion';
               userData.getDefaultSearch(searchParams).then(function success(result) {                
                   if(result!=null & result!=undefined){
                    $scope.ItemswhatchesAll= result;
                    $scope.ItemswhatchesUno= {};
                    $scope.ItemswhatchesDos= {};
                    $scope.ItemswhatchesTres= {};
                    $scope.ItemswhatchesUno[0] = checkItemData(result[0]);
                    $scope.ItemswhatchesUno[1] = checkItemData(result[1]);
                    $scope.ItemswhatchesUno[2] = checkItemData(result[2]);
                    $scope.ItemswhatchesUno[3] = checkItemData(result[3]);
                    $scope.ItemswhatchesDos[0] = checkItemData(result[4]);
                    $scope.ItemswhatchesDos[1] = checkItemData(result[5]);
                    $scope.ItemswhatchesDos[2] = checkItemData(result[6]);
                    $scope.ItemswhatchesDos[3] = checkItemData(result[7]);
                    $scope.ItemswhatchesTres[0] = checkItemData(result[8]);
                    $scope.ItemswhatchesTres[1] = checkItemData(result[9]);
                    //console.log('Itemswhatches',$scope.Itemswhatches);
                   }
             
                }, function error(result) {
                });

                var searchParams = {};
               searchParams["SearchIndex"] = 'FashionGirls';
               userData.getDefaultSearch(searchParams).then(function success(result) {                
                   if(result!=null & result!=undefined){
                    $scope.ItemshandbagsAll= result;
                    $scope.ItemshandbagsUno= {};
                    $scope.ItemshandbagsDos= {};
                    $scope.ItemshandbagsTres= {};
                    $scope.ItemshandbagsUno[0] = checkItemData(result[0]);
                    $scope.ItemshandbagsUno[1] = checkItemData(result[1]);
                    $scope.ItemshandbagsUno[2] = checkItemData(result[2]);
                    $scope.ItemshandbagsUno[3] = checkItemData(result[3]);
                    $scope.ItemshandbagsDos[0] = checkItemData(result[4]);
                    $scope.ItemshandbagsDos[1] = checkItemData(result[5]);
                    $scope.ItemshandbagsDos[2] = checkItemData(result[6]);
                    $scope.ItemshandbagsDos[3] = checkItemData(result[7]);
                    $scope.ItemshandbagsTres[0] = checkItemData(result[8]);
                    $scope.ItemshandbagsTres[1] = checkItemData(result[9]);
                    //console.log('Itemshandbags',$scope.Itemshandbags);
                   }
             
                }, function error(result) {
                });
                
            };

            if($scope.showProductsCategory){
            getProductsCategory();
            }

            var refreshMyWishList = function (item) {
                //console.log('item',item.ItemId);
            }

            function goToTopBody(){
                $('html,body').animate({
                    scrollTop: (1)
                }, 1000);
            }

            $scope.addToWishList = function (item) {
                if (userObj != undefined) {
                    //console.log('myWishList'+userObj.IdCliente);
                    if(localStorage.getItem('myWishList'+userObj.IdCliente)=== null){
                        oldItems = [];                                       
                    }else{
                        //console.log('oldItems',oldItems);
                        var oldItems = JSON.parse(localStorage.getItem('myWishList'+userObj.IdCliente)) || []; 
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
            $scope.$on("$destroy", function handler() {
                $('.navbar').removeClass('white');
                $('.rusia2018-right').hide();
                $('.giftcards-right').hide();
            });            
                $('.navbar').addClass('white');
                $('.rusia2018-right').show();
                $('.giftcards-right').show();
            //console.log("show Rusia"); 

            

            //guardarSubcategorias();
            function guardarSubcategorias(){
                let categorias = [];
                let subcategorias = [];
                angular.forEach($scope.categoriesList, function(value, key) {
                    if(value.value == $scope.topCategory){
                        value.subcategorias = [];
                        categorias.push(value);
                    }
                });
                angular.forEach($scope.subCategoriAs, function(value, key) {                    
                    categorias[0].subcategorias.push(value);
                });                
                console.log(JSON.stringify(categorias));
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
                console.log('$scope.categoriesList',$scope.categoriesList[catIndex].subcategorias);
                return $scope.categoriesList[catIndex].subcategorias;

            }
            
            $scope.mostrarSubcategorias = function (topCategory,catIndex) {
                $scope.topCategory = topCategory;
                if($scope.topCategoryLastSelected == topCategory){
                    $scope.showSubCategoriAs = 0;
                    $scope.topCategoryLastSelected = 0;
                }else{
                    $scope.topCategoryLastSelected = topCategory;    
                    categoryClick(topCategory);
                    $scope.subCategoriAs = obtenerSubcategorias(catIndex);
                    //obtenerSubcategorias(catIndex).then(function success(result) {  
                        $scope.showSubCategoriAs = topCategory;
                        //$scope.subCategoriAs = result.data;                        
                    //}, function error(result) {
                        //console.log(result);
                        //$scope.showSubCategoriAs = false;
                    //});
                }
            };

            function categoryClick(category){
                angular.forEach($scope.indexs, function(value, key) {
                    if(value.attributes.SearchIndex == category){
                        $scope.index = value;
                    }
                });
                //$scope.setSubCategories();
            }

            function subCategoryClick(subCategory){
                angular.forEach($scope.subCategories, function(value, key) {
                    //console.log("value" , value );
                    if(value.SubCategoryId == subCategory){
                        $scope.subCategory = value;
                    }
                });
                
                //showProductsSubcategory();
            }
            $scope.mostrarProductos = function (subCategory,subCategoryTexto,categoryValue) {
                console.log('categoryValue',categoryValue);
                var element = document.getElementById("buttonShowCategories");
                $(element).click();
                
                console.log('element',element);
                categoryClick(categoryValue);
                $scope.keyword = "";
                $scope.showTopSellerProducts = false;  
                $scope.showNewReleaseProducts = false;  
                localStorage.setItem('subCategorySelected',subCategory);
                let subCategorySelected = localStorage.getItem('subCategorySelected');
                console.log('subCategorySelected',subCategorySelected);
                subCategoryClick(subCategory);
                console.log('mostrarProductos subCategory',subCategory);
                $scope.itemsTopSellerProducts = [];
                $scope.loadMain = true;
                goToTopBody();

                getTopSellerProducts(subCategory).then(function success(result) {                      
                    console.log('getTopSellerProducts',result);
                    angular.forEach(result.data.Item, function(value, key) {
                        console.log("value" , value );
                        $scope.itemsTopSellerProducts.push(value);
                    });
                    console.log('$scope.itemsTopSellerProducts.length',$scope.itemsTopSellerProducts.length);
                    if($scope.itemsTopSellerProducts.length>0){
                        $scope.showTopSellerProducts = true;
                        $scope.loadMain = false;
                    }else{
                        getSearchEmptySubcategoryProducts(subCategory,subCategoryTexto).then(function success(result) {
                            angular.forEach(result.data.Item, function(value) {
                                //console.log("value" , value );
                                let newValue = checkItemData(value);
                                $scope.itemsTopSellerProducts.push(newValue);
                            });
                        });

                    }
                    
                    //$scope.Items = $scope.subcategoryProducts;
                    
                }, function error(result) {
                    console.log(result);
                });
                $scope.itemsNewReleaseProducts = [];

                getNewReleaseProducts(subCategory).then(function success(result) {                      
                    console.log('getNewReleaseProducts',result);
                    angular.forEach(result.data.Item, function(value, key) {
                        console.log("value" , value );
                        let newValue = checkItemData(value);
                        $scope.itemsNewReleaseProducts.push(newValue);
                    });
                    if($scope.itemsTopSellerProducts.length){
                        $scope.showNewReleaseProducts = true;
                    }
                    
                }, function error(result) {
                    console.log(result);
                });

                //getTopSellerProducts
                $scope.showProductsCategory = false;
                $scope.showStoreCarousel = false;
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

            function getSearchEmptySubcategoryProducts(BrowseNodeId,subCategoryTexto){
                $scope.keyword = subCategoryTexto;
                $scope.doSearch();
            }
            
            
            //getNewReleaseProducts

            //obtener listado de categorias
            $scope.showLeftCategories = true;
            obtenerCategoriesListEs();            
            
            function obtenerCategoriesListFromJson(){
                return $http.get('categorias-subcategorias.json').then(function(response) {
                    let datos = response.data.categorias;
                    let i = 0;
                    angular.forEach(datos, function(value, key) {
                        value.text = $scope.categoriesListEs[i].texto;
                        let subcats = value.subcategorias;

                        subcatIndex = 0;

                        angular.forEach(subcats, function(v) {
                            //console.log('v',v);
                            value.subcategorias[subcatIndex].textoEs = $scope.subCategoriesEs[v.SubCategoryId];
                            subcatIndex++;
                        });

                        $scope.categoriesList.push(value);
                        i++;
                        //console.log('value',value);
                    });
                });                
            }  
            function obtenerCategoriesListEs(){
                $scope.categoriesListEs = [];
                $scope.subCategoriesEs = [];

                $http.get('subcategorias_es.csv').then(function(datos) {
                    $scope.subCategoriesEs = csvToArray(datos.data);
                    //console.log('$scope.subCategoriesEs',$scope.subCategoriesEs);                    
                }); 
                
                $http.get('categorias-es.json').then(function(response) {
                    $scope.categoriesListEs = response.data.categoriases;    
                    //console.log(' $scope.categoriesListEs', $scope.categoriesListEs);    
                    obtenerCategoriesListFromJson();
                });                 
            }
            
            function csvToArray(csvString) {
                var lines = csvString.split('\n');
                var row = [];
                lines.forEach(function (v){
                    var line = v.split(',');                    
                    row[line[0]] = line[2];
                    //console.log("v",v);
                });
                return row;
                //console.log("row",row);                
            }

        }]);
