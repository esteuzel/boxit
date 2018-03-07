/**
 * Created by USRSIS0155 on 09/05/2016.
 */
angular
        .module('boxit')
        .controller('indexController', ['$scope', 'userData','$uibModal',
            function ($scope, userData,$uibModal) {
               
                $scope.loged = false;
                if (!(userData.getData() === undefined)) {
                    $scope.loged = true;
                }
               
               $scope.desplegarUsu = function(){
                 
                   $(".desplegableUsu").toggle();
                   
               };
               
                  $scope.desplegarMenu = function(){
                   
                   $(".desplegable").toggle();
                   
               };
               $scope.desplegarInformacion = function(){
                   
                   $(".desplegableInformacion").toggle();
                   
               };
               
               
               $scope.hideMain = function () {
                   
                   $(".MobileMenu").hide();
               }
               
               
                $scope.$on('estadoSesion', function (event, estado) {
                 
                    $scope.loged = estado.estado;
                    // profileObj contains; name, country and email from emitted event
                });

                $scope.cerrarSesion = function () {
                    //cerrar sesion aca  
                    userData.logoff();
                    $scope.loged = false;

                };
                 $scope.c = function () {
                  //  userData.setSearchIndex();
                    
                       $uibModal.open({
                                    animation: true,
                                    templateUrl: 'views/modalPopUp.html',
                                    controller: 'modalPopUpController',
                                    size: 'lg',
                                  
                                    }

                                );
                    
                };
               // $scope.init();
            }]);
