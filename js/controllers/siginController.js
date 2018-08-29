/**
 * Created by USRSIS0155 on 28/04/2016.
 */
angular
        .module('boxit')
        .controller('siginController', [ '$scope', '$http', '$window', 'userData', '$interval', '$uibModal','$location',
            function ($scope, $http, $window, userData, $interval, $uibModal,$location) {
                $scope.IdTipoPlan = 1;
                $scope.Categ = [
                    {name:"Intrumentos Musicales",id:"1", checked:"false"},
                    {name:"Moda Femenina",id:"2", checked:"false"},
                    {name:"Ropa",id:"3", checked:"false"},
                    {name:"Videojuegos y Juguetes",id:"4", checked:"false"},
                    {name:"Accesorios de Celular",id:"5", checked:"false"},
                    {name:"Articulos Deportivos",id:"6", checked:"false"},
                    {name:"Libros",id:"7", checked:"false"},
                    {name:"Tecnología",id:"8", checked:"false"},
                    {name:"Otros",id:"9", checked:"false"},
                ];
               
                $scope.today = function () {
                    $scope.popup1 = {
                        opened: false
                    };
                    $scope.UserBirthdate = '';//new Date();
                };
                $scope.today();
                $scope.format = 'dd/MM/yyyy';
                $scope.dateOptions = {
                  //  dateDisabled: disabled,
                    formatYear: 'yyyy',
                    showToday: false,    
                    maxDate: new Date(2019, 1, 1),
                    minDate: new Date(1915, 1, 1),
                    startingDay: 1
                };
                $scope.allBoxitAddress = [];
                $scope.plataformas = [];
                $http({
                    method: "POST",
                    url: userData.getHost() + "/users/getplataformas",
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(function success(results) {
                    $scope.plataformas = results.data;
                    for (var i = 0; i < $scope.plataformas.length; i++) {
                        $scope.allBoxitAddress[$scope.plataformas[i].attributes.IdPlataforma] = $scope.plataformas[i].attributes.Direccion_Fisica;
                        //console.log("$scope.allBoxitAddress",$scope.allBoxitAddress);
                        //console.log("$scope.plataformas[i].attributes",$scope.plataformas[i].attributes);
                        
                    }
                }, function error(results) {
                    console.log(results.data);
                });
                $scope.open = function () {
                    $scope.popup1.opened = true;
                };
                function disabled(data) {
                    var date = data.date,
                            mode = data.mode;
                    return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
                }

                $scope.Sigin = function () {
                    var args = {};
                    console.log('$scope.UserBirthdate',$scope.UserBirthdate);
                    console.log('typeof', typeof $scope.UserBirthdate);
                    var fecha1 = moment($scope.UserBirthdate);
                    var fecha2 = moment(new Date());
                    var diferencia = fecha2.diff(fecha1, 'years');

                    if($scope.UserBirthdate===''){
                        console.log('$scope.UserBirthdate',$scope.UserBirthdate);
                        $uibModal.open({
                            animation: true,
                            templateUrl: 'views/modalCambioClave.html',
                            controller: 'modalCambioClaveController',
                            size: 'sm',
                            resolve: {
                                mensaje: function () {
                                    var mensaje = {};
                                    mensaje.titulo = "Registro Usuario";
                                    mensaje.texto = "Debes ingresar tu fecha de nacimiento.";
                                    mensaje.estilo = "alerta";
                                    return mensaje;
                                }
                            }
                        });
                        return "";
                    }
                    
                    console.log(fecha2.diff(fecha1, 'years'), ' años de diferencia');
                    if ((diferencia<18)) {
                        //  ngToast.create("Password no coincide");
                        $uibModal.open({
                            animation: true,
                            templateUrl: 'views/modalCambioClave.html',
                            controller: 'modalCambioClaveController',
                            size: 'sm',
                            resolve: {
                                mensaje: function () {
                                    var mensaje = {};
                                    mensaje.titulo = "Registro Usuario";
                                    mensaje.texto = "Debes ser mayor de edad";
                                    mensaje.estilo = "alerta";
                                    return mensaje;
                                }
                            }
                        });
                        return "";
                    }

                    if (!($scope.password === $scope.confirmarpassword)) {
                        //  ngToast.create("Password no coincide");

                        $uibModal.open({
                            animation: true,
                            templateUrl: 'views/modalCambioClave.html',
                            controller: 'modalCambioClaveController',
                            size: 'sm',
                            resolve: {
                                mensaje: function () {
                                    var mensaje = {};
                                    mensaje.titulo = "Registro Usuario";
                                    mensaje.texto = "Password no coincide";
                                    mensaje.estilo = "alerta";
                                    return mensaje;
                                }
                            }

                        });




                        return "";
                    }
                    var cat="";
                    var i=0;
                    for(var x = 0;x < $scope.Categ.length;x++)
                    {
                        if ($scope.Categ[x].checked == true){
                            if(i==0){
                                cat=$scope.Categ[x].id;
                            }else{
                                cat+= ','+$scope.Categ[x].id;
                            }
                            i++;
                        }
                    }
                    args["UserName"] = $scope.username;
                    args["UserLastName"] = $scope.lastname;
                    args["UserEmail"] = $scope.useremail;
                    args["UserPassword"] = $scope.password;
                    args["UserGender"] = $scope.UserGender;
                    //console.log("$scope.UserBirthdate",$scope.UserBirthdate);
                    if($scope.UserBirthdate != ""){
                        args["UserBirthdate"] = moment($scope.UserBirthdate).format('YYYY/MM/DD');
                    }
                    args["IdPlataforma"] = $scope.plataforma != null ?
                            $scope.plataforma.attributes.IdPlataforma : null;
                    args["Phone"] = $scope.Phone 
                    args["CEnteraste"] = $scope.CEnteraste;
                    if($scope.Otro_CEnteraste== undefined ){
                         args["Otro_CEnteraste"]= "NO";
                    }else{
                         args["Otro_CEnteraste"]=$scope.Otro_CEnteraste;
                    }
                    args["Categorias"] = cat;
                    if($scope.Otra_Categoria== undefined ){
                       args["Otra_Categoria"]= "NO"; 
                    }else{
                       args["Otra_Categoria"]=$scope.Otra_Categoria;
                    }
                    args["IdTipoPlan"]=$scope.IdTipoPlan;
                    args["CodPromo"]=$scope.CodPromo;  
                    console.log("args",args);  
                       var respuesta = "";
                     $http({
                        method: "POST",
                        url: userData.getHost() + "/users/insertuserboxit",
                        data: args,
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).then(function success(result) {
                        if (result.data.attributes.IdCliente === undefined) {

                            respuesta = result.data.attributes.Message;
                            var estilo = "alerta";
                            if ("The User Has Been Created" === respuesta) {
                                respuesta = "Se ha creado el usuario";
                                estilo = "exito";
                            } else if ("The User Could Not be Created" === respuesta) {
                                respuesta = "No se ha  podido crear el usuario";
                            } else if ("UserEmail Already Exists" === respuesta) {
                                respuesta = "El usuario ya existe";
                            } else if ("UserName is required" === respuesta) {
                                respuesta = "El nombre del usuario es requerido";
                            } else if ("UserLastName is required" === respuesta) {
                                respuesta = "El apellido del usuario es requerido";
                            } else if ("UserLastName length is invalid" === respuesta) {
                                respuesta = "La longitud del apellido es invalida";
                            } else if ("UserPassword length is invalid" === respuesta) {
                                respuesta = "La longitud del password es invalida";
                            } else if ("UserEmail is required" === respuesta) {
                                respuesta = "El correo es requerido";
                            } else if ("User email length is invalid" === respuesta) {
                                respuesta = "La longitud del correo es invalida";
                            } else if ("UserEmail invalid format" === respuesta) {
                                respuesta = "El formato del correo es invalido";
                            } else if (respuesta === "IdPlataforma is required") {
                                respuesta = "Debe seleccionar plataforma";
                            } else if (respuesta === "Phone is required"){
                                respuesta = "El numero de telefono es requerido";
                            } else if (respuesta === "CEnteraste is required"){
                                respuesta = "Selecciona Como te Enteraste de Boxit.";
                            } else if (respuesta === "Categorias is required"){
                                respuesta = "Selecciona alguna Categoría de tu Preferencia";
                            }


                            // ngToast.create(JSON.stringify(result.data.attributes.Message));
                            $uibModal.open({
                                animation: true,
                                templateUrl: 'views/modalCambioClave.html',
                                controller: 'modalCambioClaveController',
                                size: 'sm',
                                resolve: {
                                    mensaje: function () {
                                        var mensaje = {};
                                        mensaje.titulo = "Registro Usuario";
                                        mensaje.texto = respuesta;
                                        mensaje.estilo = estilo;
                                        return mensaje;
                                    }
                                }

                            });





                        } else {

                            // userData.activateUser(result.data.attributes.IdCliente);

                            respuesta = "Usted recibirá un correo de confirmación de cuenta. \n\
                            Para continuar debe confirmar su registro a través del email recibido";

                            estilo = "exito";
                            var modalInstance = $uibModal.open({
                                animation: true,
                                templateUrl: 'views/modalCambioClave.html',
                                controller: 'modalCambioClaveController',
                                size: 'sm',
                                resolve: {
                                    mensaje: function () {
                                        var mensaje = {};
                                        mensaje.titulo = "Registro Usuario";
                                        mensaje.texto = respuesta;
                                        mensaje.estilo = estilo;
                                        return mensaje;
                                    }
                                }
                            });
                            modalInstance.closed.then(function (someData) {
                                $location.path('/boxitStore/');
                            });
                        }

                    }
                    , function error(result) {
                        console.log(result.data);
                    }
                    );
                };

                
                $scope.leerTerminosycondiciones = function () {
                   console.log("leerTerminosycondiciones");
                        //  ngToast.create("Password no coincide");

                        $uibModal.open({
                            animation: true,
                            templateUrl: 'views/terminosycondiciones.html',
                            size: 'lg',
                            resolve: {
                                mensaje: function () {
                                    var mensaje = {};
                                    mensaje.titulo = "Registro Usuario";
                                    mensaje.texto = "Password no coincide";
                                    mensaje.estilo = "alerta";
                                    return mensaje;
                                }
                            }

                        });
                    
                }
                $scope.showBoxitAddress = function () {           
                    console.log("$scope.boxitAddress",$scope.plataforma.attributes.IdPlataforma);         
                    if($scope.plataforma != null){
                        if($scope.plataforma.attributes.IdPlataforma>0){
                            $scope.boxitAddress = $scope.allBoxitAddress[$scope.plataforma.attributes.IdPlataforma];
                        }
                    }else{
                        $scope.boxitAddress = "";
                    }
                    if($scope.boxitAddress){
                        $scope.showBxitAddress=true;
                    }else{
                        $scope.showBxitAddress=false;
                    }
                    console.log("$scope.boxitAddress",$scope.boxitAddress);
                }
            }]);
