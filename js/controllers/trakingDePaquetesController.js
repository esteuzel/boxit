angular
    .module('boxit')
    .controller('trakingDePaquetesController', ['$scope', '$http', 'userData',
        function ($scope, $http, userData) {
            $scope.showAll = false;
            $scope.showPaquetes = false;
            $scope.showOrdenes = false;
            $scope.showOrdenesPendientes = false;
            $scope.showOrdenesPagadas = false;
            $scope.showPaquetesProceso = false;
            $scope.showPaquetesEntregados = false;
            $scope.showPaquetesAlertado = false;
            
            $scope.showTrakings = function (parametros) {
                console.log("parametros: ",parametros);
                $('.tarjetas').hide();
                $scope.showAll = false;
                $scope.showPaquetes = false;
                $scope.showOrdenes = false;
                $scope.showOrdenesPendientes = false;
                $scope.showOrdenesPagadas = false;
                $scope.showPaquetesAlertado = false;
                $scope.showPaquetesProceso = false;
                $scope.showPaquetesEntregados = false;
                let showThisClass = '';
                switch (parametros) {
                    case 'showPaquetes': case 'showPaquetesProceso':
                        $scope.showPaquetes = true;
                        $scope.showPaquetesProceso = true;   
                        showThisClass = 'showPaquetesProceso';                
                        break;
                    case 'showPaquetesEntregados': 
                        $scope.showPaquetes = true;
                        $scope.showPaquetesEntregados = true;  
                        showThisClass = 'showPaquetesEntregados';                      
                        break;
                    case 'showPaquetesAlertado': 
                        $scope.showPaquetes = true;
                        $scope.showPaquetesAlertado = true;  
                        showThisClass = 'showPaquetesAlertado';                      
                        break;

                    case 'showOrdenes': case 'showOrdenesPendientes':
                        $scope.showOrdenes = true;
                        $scope.showOrdenesPendientes = true;  
                        showThisClass = 'showOrdenesPendientes';
                        break;                        
                    case 'showOrdenesPagadas': 
                        $scope.showOrdenes = true;
                        $scope.showOrdenesPagadas = true;  
                        showThisClass = 'showOrdenesPagadas';                      
                        break; 
                    default:
                        $scope.showAll = true;               
                        $scope.showOrdenesPendientes = false;
                        $scope.showOrdenesPagadas = false;
                        $scope.showPaquetesAlertado = false;
                        $scope.showPaquetesProceso = false;
                        $scope.showPaquetesEntregados = false;
                        showThisClass = 'tarjetas';
                        break;
                }
                $('.'+showThisClass).show();
            }
            $http({
                method: "POST",
                url: userData.getHost() + "/users/gettracking",
                data: {
                    "IdCliente": userData.getData().IdCliente
                },
              //  dataType: 'json',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function success(result) {
                console.log("result",result);
                var a = [];
                if(Object.keys(result.data.Rows).length==1){                                        
                    a.push(result.data.Rows);                   
                    /*
                    Alertado
                    OnBoxIt
                    Entregado
                    En Tránsito
                    Pagada
                  //  alert(Object.value(result.data.Rows));
                  /* $.each(a, function (index, value) {
                        alert( value.attributes);
                        $.each(value.attributes, function (index2, value2) {
                        alert( value2.Paquete);
                        });
                    });*/
                }else{
                    a = result.data.Rows;
                }
                let b = [];
                let statusClass = '';
                $.each(a, function (index2, value) {                   
                    console.log("value",value);
                    let estado = value.attributes.Estatus;
                    switch (estado) {
                        case 'Alertado':
                        statusClass = 'showPaquetesAlertado';                        
                        break;
                        case 'Entregado':
                        statusClass = 'showPaquetesEntregados';                        
                        break;
                        case 'En Tránsito':
                        statusClass = 'showPaquetesProceso';                        
                        break;
                        case 'OnBoxIt':
                        statusClass = 'showOrdenesPendientes';                        
                        break;
                        case 'Pagada':
                        statusClass = 'showOrdenesPagadas';                        
                        break;
                        default:
                        statusClass = 'showOrdenesPendientes';        
                        break;
                    }
                    if(statusClass != 'showPaquetesProceso'){
                        statusClass = statusClass + ' hideTemporal';
                    }                    
                    value.attributes.statusClass = statusClass;
                    b.push(value);
                });

                $scope.trakings = b;
                $('.showPaquetesProceso').removeClass('hideTemporal');
                $scope.showTrakings('showPaquetesProceso');

            }, function error(result) {
                console.log(result);
            });

            $scope.hideAll = function (traking) {
                
            };
        }]);
       