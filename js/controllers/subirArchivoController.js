
angular.module('boxit')

.controller('subirArchivoController', ['$scope','Upload', '$timeout', '$http', 'ngToast', 'userData', '$uibModal',

    function ($scope, Upload, $timeout, $http, ngToast, userData,$uibModal) {


        $scope.uploadFiles = function(file, errFiles) {
            /*if (file!=null) {
            $scope.f = file;
            console.log(' file', file);
            newFile = file;
            console.log(' newFile', newFile);
            newFile = Upload.rename(newFile, 'fabio_'+newFile.name) ;
            console.log(' newFile', newFile);
            }*/
            /*
            
            console.log(' newFile.name', newFile.name);
            newFile = Upload.rename(newFile, 'fabio') ;
            console.log(' newFile.name', newFile.name);
            newFile.name = 'fabio';
            console.log(' newFile', newFile);
*/
            $scope.errFile = errFiles && errFiles[0];
            if($scope.errFile){ $scope.errFile.text = "Error"; }
           
            if (file) {
                file.upload = Upload.upload({
                    url: 'http://myboxit.local/api/',
                    method: 'POST',
                    data: {'nombre':'fabio333',file: file},
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
                        $scope.errorMsg = response.status + '  -:- ' + response.data;
                }, function (evt) {
                    file.progress = Math.min(100, parseInt(100.0 * 
                                             evt.loaded / evt.total));
                });
            }   
        }

    }]);



