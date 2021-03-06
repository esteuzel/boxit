angular.module('boxit')

        .controller('modalLoginController', ['$scope', '$http', 'userData', '$uibModal','$state','$uibModalInstance',

            function ($scope, $http,  userData, $uibModal,$state,$uibModalInstance) {

                $scope.showLogin = true;
                $scope.showRecuperar = false;   
                $scope.loadingLogin = false;

                $scope.lostPassword = function () {
                    $scope.showLogin = false;
                    $scope.showRecuperar = true;
                };

                $scope.restorePassword = function () {
                    userData.resetPassword($scope.lostEmail).then(function success(result) {
                        var respuesta = result;
                        var estilo = "alerta";
                        if ("Email is required or invalid format" === respuesta) {
                            respuesta = "El correo tiene formato invalido";
                        } else if ("Mail was sent" === respuesta) {
                            respuesta = "Se ha generado el correo para la recuperacion de clave";
                            estilo = "exito";
                        } else if ("The email does not exist" === respuesta) {
                            respuesta = "No existe el usuario indicado";
                        }
                        $uibModal.open({
                            animation: true,
                            templateUrl: 'views/modalCambioClave.html',
                            controller: 'modalCambioClaveController',
                            size: 'sm',
                            resolve: {
                                mensaje: function () {
                                    var mensaje = {};
                                    mensaje.titulo = "Inicio de sesion";
                                    mensaje.texto = respuesta;
                                    mensaje.estilo = estilo;
                                    return mensaje;
                                }
                            }
                        });
                        $scope.showLogin = true;
                        $scope.showRecuperar = false;
                    });
                };       

                $scope.Login = function () {
                    $scope.loadingLogin = true;
                    $scope.showLogin = false;
                    $http({
                        method: "POST",
                        url: userData.getHost() + "/users/loginuserboxit",
                        data: {
                            "UserEmail": $scope.username,
                            "UserPassword": $scope.password
                        },
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).then(function success(result) {
                        if (result.data.Rows.attributes.IdCliente === undefined) {
                            
                            //alert(JSON.stringify(result.data.Rows.attributes.Message));
                            // ngToast.create(JSON.stringify(result.data.Rows.attributes.Message));
                            var respuesta = result.data.Rows.attributes.Message;
                            if ("Invalid BoxIt User") {
                                respuesta = "Usuario invalido o clave invalida";
                            } else if ("UserEmail is required") {
                                respuesta = "El correo es requerido";
                            } else if ("UserEmail length is invalid") {
                                respuesta = "El correo es requerido";
                            } else if ("UserEmail invalid format") {
                                respuesta = "El correo es requerido";
                            } else if (" UserPassword is required") {
                                respuesta = "El correo es requerido";
                            } else if ("UserPassword length is invalid") {
                                respuesta = "Longitud del password invalida";
                            }

                            $scope.loadingLogin = false;
                            $scope.showLogin = true;
                            $uibModal.open({
                                animation: true,
                                templateUrl: 'views/modalCambioClave.html',
                                controller: 'modalCambioClaveController',
                                size: 'sm',
                                resolve: {
                                    mensaje: function () {
                                        var mensaje = {};
                                        mensaje.titulo = "Inicio de sesion";
                                        mensaje.texto = respuesta;
                                        mensaje.estilo = "alerta";
                                        return mensaje;
                                    }
                                }
                            });
                        } else {
                            //alert(JSON.stringify(result.data));
                            //var test = userData.getData();
                            var id = result.data.Rows.attributes.IdCliente;
                            userData.setData(id).then(function () {
                                //ngToast.create(JSON.stringify(userData.getData()));
                                angular.element(document.getElementById('cartNumber')).scope().$emit('estadoSesion', {
                                    estado: true
                                });
                                // $interval(function () {
                                //$state.go("itemList",{},{reload:true});  //$window.location = "/userInterface.html#/userInterface";
                                // }, 3000);
                                $state.go("boxitStore",{},{reload:true});
                                $uibModalInstance.close();
                            });
                        }
                    }, function error(result) {
                        console.log(result.data);
                    });
                };

                $scope.onKeyEnterPress = function (event) {
                    if (event.keyCode === 13) {
                        $scope.Login();
                    }
                };
                $scope.closeModal = function(){
                    console.log('closeModal');
                    $uibModalInstance.close();
                }
            }]);