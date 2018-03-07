/**
 * Created by USRSIS0155 on 11/05/2016.
 */
angular
    .module('boxit')
    .controller('modalDetallesArticulosController', ['$scope', '$uibModalInstance', 'item', 'userData','$q','$http',
        function ($scope, $uibModalInstance, item, userData,$q,$http) {
            var currentIdItem = item.Item.ItemId;
            $scope.showZise = false;
            $scope.ShowColor = false;
            $scope.showCombination = false;
            $scope.showVariationsArray = false;
            $scope.showVariationsObject = false;
            $scope.showFeature = false;
            $scope.disabledAdd = false;
            var usrObj = userData.getData();
            setItemData(item);
            setItemVariation(item);
            function setItemData(item) {
                currentIdItem = item.Item.ItemId;
                $scope.userNotLogged = usrObj === undefined;
                $scope.titulo = item.Item.Attributes.Title;
                $scope.texto = getDescription(item).trim();
                $scope.imgUrl = item.Item.Image.ImageUrl;
                $scope.itemPrice = item.Item.Offers.Offer == null ? 0 : item.Item.Offers.Offer.OfferListing.Price.FormattedPrice;
                $scope.cantidad = 1;
                var amount = item.Item.Offers.Offer == null ? 0 : item.Item.Offers.Offer.OfferListing.Price.Amount;
                console.log($scope.userNotLogged);
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
                if ($scope.variation != null && $scope.variation != undefined) {
                    userData.getItemDetails($scope.variation.ItemId).then(function success(result) {
                        setItemData(result);
                        setItemVariation(result);
                    }, function error(result) {
                        console.log(result);
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
            $scope.closeModal = function () {
                $uibModalInstance.close();
            }
        }]);
