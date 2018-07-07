/* 

 * To change this license header, choose License Headers in Project Properties.

 * To change this template file, choose Tools | Templates

 * and open the template in the editor.

 */

angular.module('boxit')

        .controller('anunciarPaqueteController', ['$scope','Upload', '$timeout', '$http', 'ngToast', 'userData', '$uibModal',

            function ($scope, Upload, $timeout, $http, ngToast, userData,$uibModal) {

                $scope.TrackingNumber = "";

                $scope.Shop = "";

                $scope.Value = "";

                $scope.arraivalDate = "";

                $scope.category = "";

                $scope.Description = "";

                $scope.format = 'dd/MM/yyyy';

                //$scope.categories = userData.getCategories(); 
                $scope.categoriesList = [];
                $scope.categoriesListEs = [];
                obtenerCategoriesList();
                //console.log('$scope.categories',$scope.categories);                

                $scope.anunciar = function () {
                    console.log(' $scope.category', $scope.category);                                       
                    console.log(' $scope.f', $scope.f);
                    var user = userData.getData();                    

                    $http({

                        method: "POST",

                        url: userData.getHost() + "/users/insertclientalert",

                        data: {

                            "IdCliente": user.IdCliente,

                            "TrackingNumber": $scope.TrackingNumber,

                            "Shop": $scope.Shop,

                            "Value": $scope.Value,

                            "DateofArrival": moment($scope.arraivalDate).format('DD/MM/YYYY'),

                            "Category": $scope.category,

                            "Description": $scope.Description,

                            "file": $scope.f

                        },

                        file: $scope.f,

                        headers: {

                            'Content-Type': 'application/json'

                        }

                    }).then(function success(results) {

                        //  alert(JSON.stringify(JSON.stringify(results.data.Data.Rows.attributes.Message)));

                        // ngToast.create(JSON.stringify(results.data.Data.Rows.attributes.Message));

                             var respuesta = results.data.Data.Rows.attributes.Message;

                             var estilo = "alerta";

                             if("IdCliente is required" === respuesta) {

                                 respuesta = "Id de cliente requerido";

                             }else if("IdCliente could not be found" === respuesta) {

                                 respuesta = "Id de cliente no existe";

                             }else if ("TrackingNumber is required" === respuesta){

                                 respuesta = "Numero de Tracking requerido";

                             }else if ("Shop is required" === respuesta){

                                 respuesta = "La tienda es requerida";

                             }else if ("Value is required" === respuesta){

                                 respuesta = "El precio es requerido";

                             }else if ("Value invalid format" === respuesta) {

                                 respuesta = "El precio tiene un formato invalido";

                             }else if ("Quantity is required" === respuesta){

                                 respuesta = "La cantidad es requerida";

                             }else if ("Quantity invalid format" === respuesta){

                                 respuesta = "La cantidad esta en un formato invalido";

                             }else if ("Description is required" === respuesta){

                                 respuesta = "La descripcion es requerida";

                             }else if ("TrackingNumber length is invalid" === respuesta){

                                 respuesta = "La longitud del numero de tracking es invalido";

                             }else if ("Shop length is invalid" === respuesta){

                                 respuesta = "La longitud de la tienda es invalida";

                             }else if ("Description length is invalid" === respuesta) {

                                 respuesta = "La longitud de la descripcion es invalida";

                             }else if("Success" === respuesta) {

                                 respuesta = "Alerta de Tracking generada con exito";

                                 estilo = "exito";

                             }  

 

                                

                                

                                $uibModal.open({

                            animation: true,

                            templateUrl: 'views/modalCambioClave.html',

                            controller: 'modalCambioClaveController',

                            size: 'sm',

                            resolve: {

                                mensaje: function () {

                                    var mensaje = {};

                                    mensaje.titulo = "Anunciar paquete";

                                    mensaje.texto = respuesta;

                                    mensaje.estilo = estilo;

                                    return mensaje;

                                }

                            }



                        });















                        $scope.TrackingNumber = "";

                        $scope.Shop = "";

                        $scope.Value = "";

                        $scope.arraivalDate = "";

                        $scope.category = "";

                        $scope.Description = "";

                    }, function error(results) {

                        console.log(results.data);

                    });



                };

                $scope.open = function () {

                    $scope.popup1.opened = true;

                };

                $scope.today = function () {

                    $scope.popup1 = {

                        opened: false

                    };

                $scope.arraivalDate = new Date

                    //var oldUser = userData.getData();

                    var unformattedDate = new Date(); // moment(oldUser.UserBirthdate, "DD/MM/YY");

                    console.log(unformattedDate);

                    console.log(moment(unformattedDate).format('DD/MM/YYYY'));

                    $scope.arraivalDate = new Date(moment(unformattedDate)); 
                    console.log('$scope.arraivalDate',$scope.arraivalDate);


                };                

                $scope.today();
                
                
                
                function obtenerCategoriesList(){
                    $scope.categoriesListEs = [];                                    
                    $http.get('categorias-es.json').then(function(response) {
                        $scope.categoriesListEs = response.data.categoriases;    
                        console.log(' $scope.categoriesListEs', $scope.categoriesListEs);
                    });                 
                }

                $scope.uploadFiles = function(file, errFiles) {
                    $scope.f = file;
                    $scope.errFile = errFiles && errFiles[0];
                    if (file) {
                        file.upload = Upload.upload({
                            url: 'http://162.243.14.131:8080/upload',
                            data: {file: file}
                        });
            
                        file.upload.then(function (response) {
                            $timeout(function () {
                                file.result = response.data;
                                console.log(' $scope.f', $scope.f);
                            });
                        }, function (response) {
                            if (response.status > 0)
                                $scope.errorMsg = response.status + ': ' + response.data;
                        }, function (evt) {
                            file.progress = Math.min(100, parseInt(100.0 * 
                                                     evt.loaded / evt.total));
                        });
                    }   
                }

            }]);





