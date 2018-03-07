/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
angular.module('boxit')
        .controller('seleccionarBoxitController', ['$scope', '$http', 'userData', '$uibModal',
            function ($scope, $http, userData, $uibModal) {
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
                            break;
                        }
                    }
                }, function error(results) {
                    console.log(results.data);
                });
                $scope.Update = function () {


                    var oldUser = userData.getData();
                    var user = {};
                    user["IdCliente"] = oldUser.IdCliente;
                    user["UserName"] = oldUser.UserName;
                    user["UserLastName"] = oldUser.UserLastName;
                    user["UserGender"] = oldUser.UserGender;

                    var unformattedDate =  oldUser.UserBirthdate==="" ? new Date() : moment(oldUser.UserBirthdate, "DD/MM/YY");  //moment(oldUser.UserBirthdate, "DD/MM/YY");

                    user["UserBirthdate"] = moment(unformattedDate).add(1,'d').format('YYYY/MM/DD');
                    user["IdPlataforma"] = $scope.descPlataforma.attributes.IdPlataforma;
                    user["UserEmail"] = oldUser.UserEmail;
                    user["UserPhone"] = oldUser.UserPhone;
                    //user.IdPlataforma = $scope.descPlataforma.attributes.IdPlataforma;

                    //  alert(JSON.stringify(user));
                    // alert( JSON.stringify(userData.updateData(user)));
                    // console.log(oldUser);
                    console.log(user);
                    userData.updateData(user)
                            .then(function (data) {

                                var estilo = "alerta";
                                if ("Cambio realizado con exito" === data) {
                                    estilo = "exito";
                                }

                                //alert(data);
                                //   ngToast.create(data);
                                userData.setData(userData.getData().IdCliente);
                                $uibModal.open({
                                    animation: true,
                                    templateUrl: 'views/modalCambioClave.html',
                                    controller: 'modalCambioClaveController',
                                    size: 'sm',
                                    resolve: {
                                        mensaje: function () {
                                            var mensaje = {}
                                            mensaje.titulo = "Modificar Boxit";
                                            mensaje.texto = data;
                                            mensaje.estilo = estilo;
                                            return mensaje;
                                        }
                                    }

                                });

                                 userData.setData(oldUser.IdCliente).then(function () {
                                  
                                });



                                //console.log(data);
                            }).catch(function (err) {
                        console.log(err);
                    });
                };

            }]);

