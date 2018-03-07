/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


angular
        .module('boxit')
        .controller('homeController', ['$scope','$uibModal',
            function ($scope,$uibModal,$templateCache) {
                if($templateCache){
                    $templateCache.removeAll();
                }
                 $scope.init = function () {
                    
                       /*$uibModal.open({
                                    animation: true,
                                    templateUrl: 'views/modalPopUp.html',
                                    controller: 'modalPopUpController',
                                    size: 'lg',
                                  
                                    }

                                );*/
                    
                };
                $scope.init();
            }]);