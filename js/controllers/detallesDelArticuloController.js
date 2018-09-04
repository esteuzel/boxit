angular

    .module('boxit')

    .controller('detallesDelArticuloController', ['$scope', '$stateParams', 'userData', '$window','$http',

        function ($scope, $stateParams, userData, $window,$http) {

            var item = $stateParams.itemId;

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

            /*$scope.modifyCar = function () {

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

            };*/

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

        }]);

