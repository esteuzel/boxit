angular
    .module('boxit')
    .controller('itemDetailController', ['$scope', '$stateParams', 'userData', '$q' , '$window','$http',
        function ($scope, $stateParams, userData, $q, $window, $http) {

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

            userData.getItemDetails($stateParams.itemId).then(function success(item) {
                console.log('item',item);
               if (item != undefined) {

                   $scope.titulo = item.Item.Attributes.Title;
                   $scope.texto = getDescription(item).trim();
                   $scope.imgUrl = item.Item.Image.ImageUrl;
                   $scope.itemPrice = item.Item.Offers.Offer.OfferListing.Price.FormattedPrice;
                   amount = item.Item.Offers.Offer.OfferListing.Price.Amount;
                   setItemData(item);
                   setItemVariation(item);
               }
            });
            

            function setItemData(item) {
                currentIdItem = item.Item.ItemId;
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
                    $scope.tooltip="nADA";
                }
                $scope.total = numeral(( amount * $scope.cantidad) / 100).format('$0,0.00');
                $scope.showMain = true;
                $scope.loadMain = false;
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
                    defered.resolve(result.data.Item.Variations);
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

            $scope.addToCar = function () {
                var args = {};
                args["IdCliente"] = userData.getData().IdCliente;
                args["ItemId"] = currentIdItem;
                if ($scope.cantidad == 0 || $scope.cantidad === undefined) {
                    args["Quantity"] = "0";
                } else {
                    args["Quantity"] = $scope.cantidad;
                }
                userData.addItemToCar(args).then(function success(result) {
                    $uibModalInstance.close();
                }, function error(result) {
                    console.log(result);
                });
            };

            $scope.refreshTotal = function () {
                $scope.total = numeral((item.Item.Offers.Offer.OfferListing.Price.Amount * $scope.cantidad) / 100).format('$0,0.00');
            };





/*











            console.log(item);
            var amount;
            var carItemId;
            var getQuantity = function (carItems) {
                if ( carItems.length === undefined) {
                     console.log(carItems);
                     return carItems.Quantity;
                }
                for (var i = 0; i < carItems.length; i++) {
                    var item = carItems[i];
                    if (item.ItemId == $stateParams.itemId) {
                        carItemId = item.CartItemId;
                        return item.Quantity;
                    }
                }
            };

            $scope.modifyCar = function () {
                var args = {};
                args["IdCliente"] = userData.getData().IdCliente;
                args["CartItemId"] = carItemId;
                args["Quantity"] = $scope.cantidad;
                $http({
                    method: "POST",
                    url: userData.getHost() + "/amazon/amazonmodifycart",
                    data: args,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(function success(result) {
                    //$scope.$emit('modificaron',result);
                    $window.location = 'BoxitStore.html#/itemList';
                }, function error(result) {
                    console.log(result);
                });
            };

            userData.getItemDetails($stateParams.itemId).then(function success(item) {
                 console.log();
                if (item != undefined) {
                    $scope.titulo = item.Item.Attributes.Title;
                    $scope.texto = getDescription(item).trim();
                    $scope.imgUrl = item.Item.Image.ImageUrl;
                    $scope.itemPrice = item.Item.Offers.Offer.OfferListing.Price.FormattedPrice;
                    amount = item.Item.Offers.Offer.OfferListing.Price.Amount
                }

                function getDescription(item) {
                    var description = "";
                    if (item.Item.Attributes.Feature.length != null && typeof item.Item.Attributes.Feature === "string") {
                        description = item.Item.Attributes.Feature;
                    } else {
                        if (item.Item.Attributes.Feature.length != null) {
                            for (var i = 0; i < item.Item.Attributes.Feature.length; i++) {
                                description = description.concat(" ", item.Item.Attributes.Feature[i]);
                            }
                        }
                    }
                    return description;
                }
                userData.getShoppingCar(userData.getData().IdCliente).then(function success(result) {
                    var carItems = result.data.Data.Cart.CartItems.CartItem;
                    $scope.cantidad = getQuantity(carItems);
                    if (amount != undefined && $scope.cantidad != undefined) {
                        $scope.total = numeral((amount * $scope.cantidad) / 100).format('$0,0.00');
                    }
                }, function error(result) {
                    console.log(result);
                });
            }, function error(result) {
                console.log(result);
            });

            $scope.refreshTotal = function () {
                if (amount != undefined) {
                    $scope.total = numeral((amount * $scope.cantidad) / 100).format('$0,0.00');
                }
            }
*/
        }]);