angular
    .module('boxit')
            .controller('myWishList', ['$scope', '$stateParams', 'userData', '$uibModal', '$q' , '$window','$http', '$state',
            function ($scope, $stateParams, userData, $uibModal, $q, $window, $http, $state) {
            //localStorage.removeItem('myWishList');
            $scope.showCar = false;
            $scope.showCarMessage = true;
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

            var getToWishList = function (item) {
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
                }     
            };
            $scope.Items = getToWishList();
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
            $state.go('modal');
            };
            $scope.goBack = function () {
                history.back();
            };
            $scope.closeModal = function () {
                $localStorage.modalIns.close();
            };
            $scope.addToCar = function (id) {
                userData.getItemDetails(id).then(function success(itemDetail) {
                    //console.log('itemDetail',itemDetail);
                    if (itemDetail != undefined) {
                        //return itemadded;
                        itemadded = itemDetail.Item;
                        
                        if (userObj != undefined) {
                            var args = {};
                            args["IdCliente"] = userData.getData().IdCliente;
                            args["ItemId"] = itemadded.ItemId;
                            args["OfferListingId"] = "";
                            args["Price"] = itemadded.Offers.Offer.OfferListing.Price.Amount / 100;
                            args["Quantity"] = "1";
                            // PackageDimensions 
                            args["Height"] = itemadded.Attributes.PackageDimensions.Height == null ? 0 : itemadded.Attributes.PackageDimensions.Height;
                            args["Length"] = itemadded.Attributes.PackageDimensions.Length == null ? 0 : itemadded.Attributes.PackageDimensions.Length;
                            args["Weight"] = itemadded.Attributes.PackageDimensions.Weight == null ? 0 : itemadded.Attributes.PackageDimensions.Weight;
                            args["Width"] = itemadded.Attributes.PackageDimensions.Width == null ? 0 : itemadded.Attributes.PackageDimensions.Width;               
                            // Image
                            args["UrlImage"] = itemadded.Image.ImageUrl;
                            args["Title"] = itemadded.Attributes.Title;
                            
                            console.log("args",args);
                            userData.addItemToCar(args).then(function success(result) {
                                refreshCar(result);
                            }, function error(error) {
                                console.log(error);
                            });
                        } else {
                            $scope.showShoppingCar();
                        }
                    }
                });
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

            $scope.clearWishList = function (item) {
                localStorage.setItem('myWishList'+userObj.IdCliente,null);
                $state.go('boxitStore');
                console.log('vaciar');
                console.log('myWishList'+userObj.IdCliente);
            }

            $scope.$on("$destroy", function handler() {
                $('.navbar').removeClass('white');
                $('.rusia2018-right').hide();
                $('.giftcards-right').hide();
            });            
                $('.navbar').addClass('white');
                $('.rusia2018-right').show();
                $('.giftcards-right').show();


        }]);
