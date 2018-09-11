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

                $scope.filename = "";

                //$scope.categories = userData.getCategories(); 
                $scope.categoriesList = [];
                $scope.categoriesListEs = [];
                obtenerCategoriesList();
                //console.log('$scope.categories',$scope.categories);                

                $scope.anunciar = function () {
                    console.log(' $scope.category', $scope.category);
                    var user = userData.getData();
                    if($scope.f){

                        console.log(' $scope.f', $scope.f);

                        $scope.filename = $scope.f.name;

                    
                    
                    console.log(' $scope.filename', $scope.filename); 

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

                            "FileName":  $scope.filename

                        },

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

                                 respuesta = "El precio tiene un formato inválido";

                             }else if ("Quantity is required" === respuesta){

                                 respuesta = "La cantidad es requerida";

                             }else if ("Quantity invalid format" === respuesta){

                                 respuesta = "La cantidad esta en un formato inválido";

                             }else if ("Description is required" === respuesta){

                                 respuesta = "La descripcion es requerida";

                             }else if ("TrackingNumber length is invalid" === respuesta){

                                 respuesta = "La longitud del número de tracking es inválido";

                             }else if ("Shop length is invalid" === respuesta){

                                 respuesta = "La longitud de la tienda es inválida";

                             }else if ("Description length is invalid" === respuesta) {

                                 respuesta = "La longitud de la descripción es inválida";

                             }else if("Success" === respuesta) {

                                 respuesta = "Alerta de Tracking generada con éxito";

                                 estilo = "exito";

                             }  

                            if(estilo == "exito"){
                                let newName = user.IdCliente+'_'+$scope.TrackingNumber;
                                let newFileQuinto = $scope.f;                    
                                newFileQuinto = Upload.rename(newFileQuinto, newName+'_'+newFileQuinto.name) ;
                                console.log(' newFileQuinto', newFileQuinto);
                                $scope.uploadFiles(newFileQuinto,null,true);

                                $scope.TrackingNumber = "";
                                $scope.Shop = "";        
                                $scope.Value = "";        
                                $scope.arraivalDate = "";        
                                $scope.category = "";        
                                $scope.Description = "";        
                                $scope.filename = "";
                            }

                                

                                $uibModal.open({

                            animation: true,

                            templateUrl: 'views/modalCambioClave.html',

                            controller: 'modalCambioClaveController',

                            size: 'sm',

                            resolve: {

                                mensaje: function () {

                                    var mensaje = {};

                                    mensaje.titulo = "Alertar paquete";

                                    mensaje.texto = respuesta;

                                    mensaje.estilo = estilo;

                                    return mensaje;

                                }

                            }



                        });


                    }, function error(results) {

                        console.log(results.data);

                    });

                    

                }else{
                    console.log(' $scope.f no', $scope.f);
                    var estilo = "alerta";
                    respuesta = "Debe adjuntar copia de la factura.";
                    $uibModal.open({
                        animation: true,
                        templateUrl: 'views/modalCambioClave.html',
                        controller: 'modalCambioClaveController',
                        size: 'sm',
                        resolve: {
                            mensaje: function () {
                                var mensaje = {};
                                mensaje.titulo = "Alertar paquete";
                                mensaje.texto = respuesta;
                                mensaje.estilo = estilo;
                                return mensaje;
                            }
                        }
                    });
                }



                };

                $scope.open = function () {

                    $scope.popup1.opened = true;

                };

                $scope.today = function () {

                    $scope.popup1 = {

                        opened: false

                    };

                //$scope.arraivalDate = new Date

                    //var oldUser = userData.getData();

                    var unformattedDate = new Date(); // moment(oldUser.UserBirthdate, "DD/MM/YY");

                    console.log(unformattedDate);

                    console.log(moment(unformattedDate).format('DD/MM/YYYY'));

                    //$scope.arraivalDate = new Date(moment(unformattedDate)); 
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

                $scope.uploadFiles = function(file, errFiles, enviar=false) {
                    $scope.f = file;                                       
                    $scope.errFile = errFiles && errFiles[0];
                    if($scope.errFile){ $scope.errFile.text = "Error"; }
                    if(enviar){                    
                        if (file) {
                            file.upload = Upload.upload({
                                url: 'https://ws.myboxit.net:40151/UploadHandler.ashx',
                                data: {file: file},
                                file:file,
                            });
                
                            file.upload.then(function (response) {
                                $timeout(function () {
                                    file.result = response.data;
                                    console.log(' $scope.f', $scope.f);
                                    console.log(' file', file);
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
                }

            }]);





