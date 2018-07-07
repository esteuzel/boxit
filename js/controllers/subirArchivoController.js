
angular.module('boxit')

.controller('subirArchivoController', ['$scope','Upload', '$timeout', '$http', 'ngToast', 'userData', '$uibModal',

    function ($scope, Upload, $timeout, $http, ngToast, userData,$uibModal) {


        $scope.uploadFiles = function(file, errFiles) {
            $scope.f = file;
            $scope.errFile = errFiles && errFiles[0];
            if (file) {
                file.upload = Upload.upload({
                    url: 'http://myboxit.local/api/',
                    method: 'POST',
                    data: {'nombre':'fabio',file: file},
                    file: file
                });
    
                file.upload.then(function (response) {
                    console.log(' response', response);
                    $timeout(function () {
                        file.result = response.data;
                        console.log(' $scope.f', $scope.f);
                    });
                }, function (response) {
                    console.log(' response', response);
                    if (response.status > 0)
                        $scope.errorMsg = response.status + ': ' + response.data;
                }, function (evt) {
                    file.progress = Math.min(100, parseInt(100.0 * 
                                             evt.loaded / evt.total));
                });
            }   
        }

    }]);



