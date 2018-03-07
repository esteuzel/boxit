angular
    .module('boxit')
    .controller('modalPopUpController', ['$scope', '$uibModalInstance',
        function ($scope, $uibModalInstance) {
         
            
            $scope.cerrar = function () {
                $uibModalInstance.close();
            };
        }]);
