/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
angular.module('boxit')
        .controller('modificarContrasenaController', ['$scope', '$http', 'ngToast', 'userData', '$uibModal',
            function ($scope, $http, ngToast, userData, $uibModal) {
                $scope.oldpassword = "";
                $scope.newpassword = "";
                $scope.confirmpassword = "";
                $scope.Update = function () {

                    var user = userData.getData();

                    if (!($scope.newpassword === $scope.confirmpassword)) {
                       // ngToast.create("Password no coincide");
                       var estilo = "alerta";
                       $uibModal.open({
                            animation: true,
                            templateUrl: 'views/modalCambioClave.html',
                            controller: 'modalCambioClaveController',
                            size: 'sm',
                            resolve: {
                                mensaje: function () {
                                    var mensaje = {};
                                    mensaje.titulo = "Cambio de clave";
                                    mensaje.texto = "Nueva contraseña no coincide";
                                    mensaje.estilo = estilo;
                                    return mensaje;
                                }
                            }

                        });
                       
                        return;
                    }
                    $http({
                        method: "POST",
                        url: userData.getHost() + "/users/updatepassworduserboxit",
                        data: {
                            "IdCliente": user.IdCliente,
                            "UserPasswordOld": $scope.oldpassword,
                            "UserPasswordNew": $scope.newpassword
                        },
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).then(function success(result) {
                        //console.log(result.data.Rows.attributes.Message);
                        //ngToast.create(result.data.Rows.attributes.Message);
                        var respuesta = "Contraseña cambiada con exito";
                        if("Old password is not correct" === result.data.Rows.attributes.Message) {
                          respuesta = "La contraseña anterior no es correcta";
                           estilo = "alerta";
                        }else if("The password has been changed" === result.data.Rows.attributes.Message){
                            respuesta = "Contraseña cambiada con exito";
                            estilo ="exito";
                        }
                        
                        
                        $uibModal.open({
                            animation: true,
                            templateUrl: 'views/modalCambioClave.html',
                            controller: 'modalCambioClaveController',
                            size: 'sm',
                            resolve: {
                                mensaje: function () {
                                    var mensaje = {}
                                    mensaje.titulo = "Cambio de clave";
                                    mensaje.texto = respuesta;
                                    return mensaje;
                                }
                            }

                        });
                        $scope.oldpassword = "";
                        $scope.newpassword = "";
                        $scope.confirmpassword = "";
                    }, function error(result) {
                        
                         $uibModal.open({
                            animation: true,
                            templateUrl: 'views/modalCambioClave.html',
                            controller: 'modalCambioClaveController',
                            size: 'sm',
                            resolve: {
                                mensaje: function () {
                                    var mensaje = {}
                                    mensaje.titulo = "Cambio de clave";
                                    mensaje.texto = result.data;
                                    mensaje.estilo = "alerta";
                                    return mensaje;
                                }
                            }

                        });
                        
                        
                        console.log(result.data);
                    });
                };


            }]);


