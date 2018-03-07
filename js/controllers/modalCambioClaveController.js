angular
    .module('boxit')
    .controller('modalCambioClaveController', ['$scope', '$uibModalInstance','mensaje',
        function ($scope, $uibModalInstance, mensaje) {
            console.log(mensaje);
            $scope.titulo = mensaje.titulo;
            $scope.texto = mensaje.texto;
            if(mensaje.estilo === "exito") {
                  $scope.estilo = "text-success";
                  $scope.boton = "btn-success";
            }else if(mensaje.estilo ===  "advertencia"){
                $scope.estilo = "text-warning";
                $scope.boton = "btn-warning";
            }else if(mensaje.estilo === "alerta"){
                $scope.estilo = "text-danger";
               $scope.boton = "btn-danger";
            }
            console.log();
            $scope.ok = function () {
                $uibModalInstance.close();
            };
        }]);
