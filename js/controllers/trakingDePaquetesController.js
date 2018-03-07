angular
    .module('boxit')
    .controller('trakingDePaquetesController', ['$scope', '$http', 'userData',
        function ($scope, $http, userData) {
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
                
                if(Object.keys(result.data.Rows).length==1){
               
                    var a=result.data.Rows;
                    $scope.trakings = a;
                  //  alert(Object.value(result.data.Rows));
                  /* $.each(a, function (index, value) {
                        alert( value.attributes);
                        $.each(value.attributes, function (index2, value2) {
                        alert( value2.Paquete);
                        });
                    });*/
                }else{
                    $scope.trakings = result.data.Rows;
                }
            }, function error(result) {
                console.log(result);
            });
        }]);
