/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var user = {
    IdCliente: "",
    UserName: "",
    UserLastName: "",
    UserGender: "",
    UserBirthdate: "",
    IdPlataforma: "",
    UserEmail: "",
    UserPhone: "",
    userMiamiAddress: {
        nombre: "",
        apellido: "",
        address1: "",
        address2: "",
        city: "",
        state: "",
        zip: "",
        country: "",
        tel: ""
    }
};
var host = "http://myboxit.com:8080";
//var host = "";
angular.module('boxit')
        .factory('userData', function ($http, $q, $localStorage) {
            var factory = {};
            factory.logoff = function () {
                delete $localStorage.userBoxIt;
            };
            factory.getMiamiAddress = function (id) {
                var defered = $q.defer();
                var promise = defered.promise;
                $http({
                    method: "POST",
                    url: host + "/users/getaddressmiamiuser",
                    data: {
                        "IdCliente": id

                    },
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(function success(result) {


                    if (result.data.Rows.attributes.AddressMiami === undefined) {
                        defered.resolve(result.data.Rows.attributes.Message);
                    } else {


                        var rawAddress = result.data.Rows.attributes.AddressMiami;
                        var splitAddress = rawAddress.split("\r\n");
                        var miamiAddress = {
                            nombre: "",
                            apellido: "",
                            address1: "",
                            address2: "",
                            city: "",
                            state: "",
                            zip: "",
                            country: "",
                            tel: ""

                        };
                        miamiAddress.nombre = splitAddress[0].toString().replace("NOMBRE:", "");
                        miamiAddress.apellido = splitAddress[1].toString().replace("APELLIDO:", "");
                        miamiAddress.address1 = splitAddress[2].toString().replace("ADDRESS 1:", "");
                        miamiAddress.address2 = splitAddress[3].toString().replace("ADDRESS 2:", "");
                        miamiAddress.city = splitAddress[4].toString().replace("CITY:", "");
                        miamiAddress.state = splitAddress[5].toString().replace("STATE/PROVINCIA/REGION:", "");
                        miamiAddress.zip = splitAddress[6].toString().replace("ZIP CODE:", "");
                        miamiAddress.country = splitAddress[7].toString().replace("CITY:", "");
                        miamiAddress.tel = splitAddress[8].toString().replace("TEL:", "");
                        user.userMiamiAddress = miamiAddress;
                        defered.resolve(user.userMiamiAddress);
                    }

                }, function error(result) {
                    defered.reject(result.data);
                });
                return promise;
            };
            factory.setData = function (id) {
                var defered = $q.defer();
                var promise = defered.promise;
                $http({
                    method: "POST",
                    url: host + "/users/getinfouserboxit",
                    data: {
                        "IdCliente": id

                    },
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(function success(result) {

                    if (result.data.Rows.attributes.IdCliente === undefined) {
                        defered.resolve(result.Data.Rows.attributes.Message);
                    } else {


                        user.IdCliente = result.data.Rows.attributes.IdCliente;
                        user.UserName = result.data.Rows.attributes.UserName;
                        user.UserLastName = result.data.Rows.attributes.UserLastName;
                        user.UserGender = result.data.Rows.attributes.UserGender;
                        user.UserBirthdate = result.data.Rows.attributes.UserBirthdate;
                        user.IdPlataforma = result.data.Rows.attributes.IdPlataforma;
                        user.UserEmail = result.data.Rows.attributes.UserEmail;
                        user.UserPhone = result.data.Rows.attributes.UserPhone;
                        user.userMiamiAddress = factory.getMiamiAddress(user.IdCliente).then(function () {
                            $localStorage.userBoxIt = user;
                            console.log(user.UserBirthdate);
                            defered.resolve($localStorage.userBoxIt);
                        });
                    }

                }, function error(result) {
                    defered.reject(result.data);
                });
                return promise;
            };
            factory.getData = function () {

                return $localStorage.userBoxIt;
            };
            factory.updateData = function (newUser) {
                var defered = $q.defer();
                var promise = defered.promise;
                console.log(JSON.stringify(newUser));
                $http({
                    method: "POST",
                    url: host + "/users/updateinfouserboxIt",
                    data: newUser,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(function success(result) {
                    //console.log(result);
                    //   if (result.data.attributes.IdCliente === undefined) {

                    var respuesta = result.data.attributes.Message;
                    if ("IdCliente could not be found" === respuesta) {
                        respuesta = "El Id de cliente no pudo ser encontrado.";
                    } else if ("UserEmail is required" === respuesta) {
                        respuesta = "El correo del usuario es requerido";
                    } else if ("UserEmail invalid format" === respuesta) {
                        respuesta = "El formato de correo es invalido";
                    } else if ("UserEmail Already Exists" === respuesta) {
                        respuesta = "Ya existe un usuario con el mismo correo";
                    } else if ("IdPlataforma could not be found" === respuesta) {
                        respuesta = "No se puedo determinar la plataforma";
                    } else if ("UserName is required" === respuesta) {
                        respuesta = "El nombre del usuario es requerido";
                    } else if ("UserLastName is required" === respuesta) {
                        respuesta = "El apellido del usuario es requerido";
                    } else if ("UserGender is required" === respuesta) {
                        respuesta = "El genero del usuario es requerido";
                    } else if ("UserGender is different for H and M" === respuesta) {
                        respuesta = "El genero seleccionado es invalido";
                    } else if ("UserBirthdate is required" === respuesta) {
                        respuesta = "La fecha de nacimiento es requerida";
                    } else if ("UserBirthdate invalid format" === respuesta) {
                        respuesta = "La fecha de nacimiento tiene un formato invalido";
                    } else if ("Success" === respuesta) {
                        respuesta = "Cambio realizado con exito";
                    } else if ("IdCliente is empty or invalid format" === respuesta) {
                        respuesta = "IdCliente invalido";
                    }


                    defered.resolve(respuesta);
                    //  } else {


                    //    defered.resolve(result.data.attributes.Message);
                    // }

                }, function error(result) {
                    defered.resolve(result.data);
                });
                return promise;
            };
            
            factory.anular = function(orden){
              var defered = $q.defer();
                var promise = defered.promise;
                var args = {};
                args["IdCompraCliente"] = orden;
                $http({
                    method: "POST",
                    url: host + "/amazon/amazonannulpurchaseorder",
                    data: args,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(function success(result) {
                    defered.resolve(result.data.Data.Rows.attributes.Message);
                }, function error(result) {
                    defered.reject(result.Data);
                });
                return promise;  
                
            };
            
            factory.activateUser = function (id) {
                var defered = $q.defer();
                var promise = defered.promise;
                var args = {};
                args["IdCliente"] = id;
                $http({
                    method: "POST",
                    url: host + "/users/activeuserboxit",
                    data: args,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(function success(result) {
                    defered.resolve(result.data.Data.Rows.attributes.Message);
                }, function error(result) {
                    defered.reject(result.Data);
                });
                return promise;
            };
            factory.setSearchIndex = function () {
               // $localStorage.searchIndex = null
                $http({
                    method: "POST",
                    url: host + "/amazon/amazongetsearchindex",
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(function success(result) {
                    console.log(result.data);
                    
                    $localStorage.searchIndex = result.data;
                }, function error(result) {
                    console.log(result.data);
                });
            };
            factory.getSearchIndex = function () {
                return $localStorage.searchIndex;     
            };
            factory.resetPassword = function (email) {

                var defered = $q.defer();
                var promise = defered.promise;
                var args = {};
                args["Email"] = email;
                $http({
                    method: "POST",
                    url: host + "/users/sendforgetpassword",
                    data: args,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(function success(result) {
                    console.log(result.data);
                    defered.resolve(result.data.Rows.attributes.Message);
                }, function error(result) {
                    console.log(result);
                    defered.reject(result.Data);
                });
                return promise;


            };
            factory.getShoppingCar = function (id) {
                var defered = $q.defer();
                var promise = defered.promise;
                $http({
                    method: "POST",
                    url: host + "/amazon/amazongetcart",
                    data: {
                        "IdCliente": id
                    },
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(function success(result) {
                    defered.resolve(result);
                }, function error(result) {
                    defered.reject(result);
                });
                return promise;
            };
            factory.getItemDetails = function (id) {
                var defered = $q.defer();
                var promise = defered.promise;
                var itemObj = {"ItemId": id};
                $http({
                    method: "POST",
                    url: host + "/amazon/amazongetitemid",
                    data: itemObj,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(function success(result) {
                    defered.resolve(result.data.Items);
                }, function error(result) {
                    defered.reject(result)
                });
                return promise;
            };
            factory.addItemToCar = function (args) {
                var defered = $q.defer();
                var promise = defered.promise;
                $http({
                    method: "POST",
                    url: host + "/amazon/amazonaddcart",
                    data: args,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(function success(result) {
                    defered.resolve(result)
                }, function error(result) {
                    defered.reject(result)
                });
                return promise;
            };
            factory.getFirstSearch = function () {
                var defered = $q.defer();
                var promise = defered.promise;
                $http({
                    method: "POST",
                    url: host + "/amazon/amazongetkeywordsrandom",
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(function success(result) {
                    console.log(result.data.Item);
                    defered.resolve(result.data.Item);
                }, function error(result) {
                    console.log(result);
                    defered.reject(result.data);
                });
                return promise;
            };
            factory.getDefaultSearch = function (args) {

                var defered = $q.defer();
                var promise = defered.promise;
                $http({
                    method: "POST",
                    url: host + "/amazon/amazongetkeywordsinit",
                    data: args,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(function success(result) {
                    console.log(result.data.Item);
                    defered.resolve(result.data.Item);
                }, function error(result) {
                    console.log(result);
                    defered.reject(result.data);
                });
                return promise;

            };
            factory.getHost = function () {
                return host;
            };
            return factory;
        });