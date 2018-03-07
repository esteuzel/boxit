/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


angular.module('boxit')
        .controller('precioController', ['$scope', '$http', '$q', '$anchorScroll', 'userData', '$uibModal', '$localStorage', '$window', '$location', '$interval', '$state',
        function ($scope, $http, $q, $anchorScroll, userData, $uibModal, $localStorage, $window, $location, $interval, $state) {

           // $scope.tarifas = {}; 
            
               function init () {
//                   console.log(getTarifas().data);
//                  // $scope.tarifas = getTarifas().data;
//                   console.log($scope.tarifas);}
                    getTarifas().then(function success(result){
                     // console.log(getTarifas());
                     // console.log(getTarifas().data);
                        //console.log(result);
                        $scope.tarifas =  result;//getTarifas();
                        console.log( $scope.tarifas);
                     //  console.log($scope.tarifas);
                     
                    });


               }
            
               function getTarifas() {
                var defered = $q.defer();
                var promise = defered.promise;
                $http({
                    method: "POST",
                    url: userData.getHost() + "/users/gettarifas",
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(function success(result) {
                  //  console.log(result.data);
                    defered.resolve(result.data);
                }, function error(result) {
                    defered.reject(result.data);
                });
                return promise;
            }
            
            init();
            }]);