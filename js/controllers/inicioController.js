/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

angular.module('boxit')
        .controller('inicioController', ['$scope', '$http', '$q', 'userData',
            function ($scope, $http, $q, userData) {
                $scope.ShowUserAddress = false;
                $scope.ShowDefaultAddressPremium = false;
                $scope.ShowDefaultAddressBasica = false;
                $scope.userPlanName = "";
              
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

                    $scope.IdCliente = user.IdCliente;
                    $scope.IdClientePremium = parseInt(user.IdCliente)+400000;
                    $scope.username = user.UserName;
                    $scope.lastname = user.UserLastName;
                    $scope.UserBirthdate = user.UserBirthdate;
                    $scope.UserGender = user.UserGender=='M'?'Femenino':'Masculino';
                    $scope.UserPhone = user.UserPhone;
                    $scope.UserEmail = user.UserEmail;
                    $scope.IdTipoPlan = user.IdTipoPlan;
                    $scope.IdPlataforma = user.IdPlataforma;
                    $scope.SaldoCliente = user.SaldoCliente;
                    //console.log("user",user);
                    //$scope.IdTipoPlan = 1;
                    switch ($scope.IdTipoPlan) {
                        case "1": $scope.userPlanName = "Básico";
                                $scope.ShowDefaultAddressBasica = true;
                            break;
                        case "3": $scope.userPlanName = "Básico"; 
                                $scope.ShowDefaultAddressBasica = true;                            
                            break;
                        case "2": $scope.userPlanName = "Premium"; 
                                $scope.ShowDefaultAddressPremium = true;                           
                            break;
                        case "4": $scope.userPlanName = "Premium";
                                $scope.ShowDefaultAddressPremium = true;
                            break;                    s
                        default: $scope.userPlanName = "Básico";
                                $scope.ShowDefaultAddressBasica = true;
                            break;
                    }
                    //$scope.userPlanName = $scope.IdTipoPlan == 1 ? "Basico" : "Premium";
                    //$scope.ShowUserAddress = true;
                    //$scope.ShowDefaultAddressPremium = $scope.IdTipoPlan == 1;
                    //$scope.ShowDefaultAddressBasica = $scope.IdTipoPlan == 2;
                    //console.log("user",user);
                    getPlataforma();
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



                function getPlataforma(){
                    $scope.plataformas = [];
                    $http({
                        method: "POST",
                        url: userData.getHost() + "/users/getplataformas",
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).then(function success(results) {
                        //alert(JSON.stringify(results.data));
                        $scope.plataformas = results.data;
                        for (var i = 0; i < $scope.plataformas.length; i++) {
                            var plataforma = $scope.plataformas[i];
                            if (plataforma.attributes.IdPlataforma === userData.getData().IdPlataforma) {
                                $scope.descPlataforma = plataforma;
                                $scope.NamePlataforma = plataforma.attributes.Address + ' - ' + plataforma.attributes.DescPlataforma;
                                //{"attributes":{"IdPlataforma":"3","DescPlataforma":"011","Address":"CIUDAD DEL SABER (BOXIT PLAZA)","Direccion":"PTY1468"}}
                                break;
                            }
                        }
                    }, function error(results) {
                        console.log(results.data);
                    });
                }

            }]);
