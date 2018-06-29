/* 

 * To change this license header, choose License Headers in Project Properties.

 * To change this template file, choose Tools | Templates

 * and open the template in the editor.

 */

angular.module('boxit')

        .controller('anunciarPaqueteController', ['$scope', '$http', 'ngToast', 'userData', '$uibModal',

            function ($scope, $http, ngToast, userData,$uibModal) {

                $scope.TrackingNumber = "";

                $scope.Shop = "";

                $scope.Value = "";

                $scope.arraivalDate = "";

                $scope.category = "";

                $scope.Description = "";

                $scope.format = 'dd/MM/yyyy';

                //$scope.categories = userData.getCategories(); 
                $scope.categoriesList = [];
                obtenerCategoriesList();
                console.log('$scope.categories',$scope.categories);                

                $scope.anunciar = function () {

                    var user = userData.getData();

                    $http({

                        method: "POST",

                        url: userData.getHost() + "/users/insertclientalert",

                        data: {

                            "IdCliente": user.IdCliente,

                            "TrackingNumber": $scope.TrackingNumber,

                            "Shop": $scope.Shop,

                            "Value": $scope.Value,

                            "arraivalDate": $scope.arraivalDate,

                            "category": $scope.category,

                            Description: $scope.Description

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
                $scope.categoriesList.push({"value":"All","text":"Todas las Categorías"});
                $scope.categoriesList.push({"value":"Appliances","text":"Appliances"});
                $scope.categoriesList.push({"value":"MobileApps","text":"MobileApps"});
                $scope.categoriesList.push({"value":"ArtsAndCrafts","text":"Arts And Crafts"});
                $scope.categoriesList.push({"value":"Automotive","text":"Automotive"});
                $scope.categoriesList.push({"value":"Baby","text":"Baby"});
                $scope.categoriesList.push({"value":"Beauty","text":"Beauty"});
                $scope.categoriesList.push({"value":"Books","text":"Books"});
                $scope.categoriesList.push({"value":"Music","text":"Music"});
                $scope.categoriesList.push({"value":"Wireless","text":"Wireless"});
                $scope.categoriesList.push({"value":"Fashion","text":"Fashion"});
                $scope.categoriesList.push({"value":"FashionBaby","text":"Fashion Baby"});
                $scope.categoriesList.push({"value":"FashionBoys","text":"Fashion Boys"});
                $scope.categoriesList.push({"value":"FashionGirls","text":"Fashion Girls"});
                $scope.categoriesList.push({"value":"FashionMen","text":"Fashion Men"});
                $scope.categoriesList.push({"value":"FashionWomen","text":"Fashion Women"});
                $scope.categoriesList.push({"value":"Collectibles","text":"Collectibles"});
                $scope.categoriesList.push({"value":"PCHardware","text":"PC Hardware"});
                $scope.categoriesList.push({"value":"MP3Downloads","text":"MP3 Downloads"});
                $scope.categoriesList.push({"value":"Electronics","text":"Electronics"});
                $scope.categoriesList.push({"value":"GiftCards","text":"Gift Cards"});
                $scope.categoriesList.push({"value":"Grocery","text":"Grocery"});
                $scope.categoriesList.push({"value":"HealthPersonal-Care","text":"Health Personal-Care"});
                $scope.categoriesList.push({"value":"HomeGarden","text":"Home Garden"});
                $scope.categoriesList.push({"value":"Industrial","text":"Industrial"});
                $scope.categoriesList.push({"value":"KindleStore","text":"Kindle Store"});
                $scope.categoriesList.push({"value":"Luggage","text":"Luggage"});
                $scope.categoriesList.push({"value":"Magazines","text":"Magazines"});
                $scope.categoriesList.push({"value":"Movies","text":"Movies"});
                $scope.categoriesList.push({"value":"MusicalInstruments","text":"Musical Instruments"});
                $scope.categoriesList.push({"value":"OfficeProducts","text":"Office Products"});
                $scope.categoriesList.push({"value":"LawnAndGarden","text":"Lawn And Garden"});
                $scope.categoriesList.push({"value":"PetSupplies","text":"Pet Supplies"});
                $scope.categoriesList.push({"value":"Software","text":"Software"});
                $scope.categoriesList.push({"value":"SportingGoods","text":"Sporting Goods"});
                $scope.categoriesList.push({"value":"Tools","text":"Tools"});
                $scope.categoriesList.push({"value":"Toys","text":"Toys"});
                $scope.categoriesList.push({"value":"VideoGames","text":"Video Games"});
                $scope.categoriesList.push({"value":"Wine","text":"Wine"});
                console.log('categoriesList',$scope.categoriesList);
                }
            }]);





