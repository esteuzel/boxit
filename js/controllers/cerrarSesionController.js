/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


angular.module('boxit')
        .controller('cerrarSesionController', ['$scope','$state', '$http', '$window', 'userData', '$interval',
            function ($scope,$state, $http, $window, userData, $interval) {

                userData.logoff();
                $scope.$emit('estadoSesion', {
                    estado: false
                });
               // $interval(function () {
                    $state.go('home');  //$window.location = "/Iniciarsesion.html";
              //  }, 3000);
            }]);