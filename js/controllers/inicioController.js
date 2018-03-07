/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

angular.module('boxit')
        .controller('inicioController', ['$scope', '$http', '$q', 'userData',
            function ($scope, $http, $q, userData) {

              
                var init = function () {

                    var user = userData.getData();
		    $scope.nombre = user.userMiamiAddress.nombre;
                    $scope.apellido = user.userMiamiAddress.apellido;
                    $scope.address1 = user.userMiamiAddress.address1;
                    $scope.address2 = user.userMiamiAddress.address2;
                    $scope.city = user.userMiamiAddress.city;
                    $scope.state = user.userMiamiAddress.state;
                    $scope.zip = user.userMiamiAddress.zip;
                    $scope.country = user.userMiamiAddress.country;
                    $scope.tel = user.userMiamiAddress.tel;
                    $scope.miami = 0;
                    $scope.panama = 0;
                    $scope.boxit = 0;
                    $scope.entregado = 0;
                    $scope.total = 0;
                    /*getTracking().then(function success(result) {                  
                        $scope.total = result.length; 
                        //console.log (result);                      
                                             					
                        for (var i = 0; i < result.length; i++) {					
                         	// console.log (result[i].attributes.Estatus);
                            if (result[i].attributes.Estatus.toUpperCase() ===
                                    "ENTREGADO".toString().toUpperCase())
                            {
                                $scope.entregado++;
                            }
                            if (result[i].attributes.Estatus.toUpperCase() ===
                                    "onhand".toString().toUpperCase())
                            {
                                $scope.miami++;
                            }
                            if (result[i].attributes.Estatus.toUpperCase() ===
                                    "OnBoxIt".toString().toUpperCase())
                            {
                                $scope.boxit++;
                            }
                            if (result[i].attributes.Estatus.toUpperCase() ===
                                    "arrived".toString().toUpperCase())
                            {
                                $scope.panama++;
								
                            }



                            //                             ENTREGADO
// onhand
// OnBoxIt
// ENTREGADO
// arrived
                        }

                    }, function error(result) {

                        $scope.total = 0;
                    });

*/
                };

                var getTracking = function () {
                    var defered = $q.defer();
                    var promise = defered.promise;
                    var trackings = [];
                    $http({
                        method: "POST",
                        url: userData.getHost() + "/users/gettracking",
                        data: {
                            "IdCliente": userData.getData().IdCliente
                        },
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).then(function success(result) {
                        trackings = result.data.Rows;
                        defered.resolve(trackings);

                    }, function error(result) {

                        defered.resolve(result);

                    });

                    return promise;
                };
                init();

            }]);
