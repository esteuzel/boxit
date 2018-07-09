angular

        .module('boxit')

        .controller('userMenuController', ['$scope', '$state', 'userData',

            function ($scope, $state, userData) {

                $scope.menu1 = true;

                $scope.menu2 = false;

                $scope.menu3 = false;

                $scope.menu4 = false;

                $scope.menu5 = false;

                $scope.menu6 = false;

                $scope.menu7 = false;

                var user = userData.getData();



                var capitalize = function (s) {



                    var res = s.split(" ");

                    var result = "";

                    var temp = "";

                    for (var i = 0; i < res.length; i++) {

                    temp = res[i].toLowerCase(); //s.toLowerCase();

                    console.log(temp);

                    console.log(temp.charAt(0).toUpperCase() + temp.slice(1));

                    result = result + temp.charAt(0).toUpperCase() + temp.slice(1);

                    result = result + " ";

                    }

                    return result;

                };



                $scope.userName = capitalize(user.UserName); //userData.getData().userName;
                
                $state.go('userMenu.inicio');

                //  console.log(userData.getData());





                $scope.active = function (id) {

                    switch (id) {



                        case 1:

                            $scope.menu1 = true;

                            $scope.menu2 = false;

                            $scope.menu3 = false;

                            $scope.menu4 = false;

                            $scope.menu5 = false;

                            $scope.menu6 = false;

                            $scope.menu7 = false;

                            break;



                        case 2:

                            $scope.menu1 = false;

                            $scope.menu2 = true;

                            $scope.menu3 = false;

                            $scope.menu4 = false;

                            $scope.menu5 = false;

                            $scope.menu6 = false;

                            $scope.menu7 = false;

                            break;

                        case 3:

                            $scope.menu1 = false;

                            $scope.menu2 = false;

                            $scope.menu3 = true;

                            $scope.menu4 = false;

                            $scope.menu5 = false;

                            $scope.menu6 = false;

                            $scope.menu7 = false;

                            break;

                        case 4:

                            $scope.menu1 = false;

                            $scope.menu2 = false;

                            $scope.menu3 = false;

                            $scope.menu4 = true;

                            $scope.menu5 = false;

                            $scope.menu6 = false;

                            $scope.menu7 = false;

                            break;

                        case 5:

                            $scope.menu1 = false;

                            $scope.menu2 = false;

                            $scope.menu3 = false;

                            $scope.menu4 = false;

                            $scope.menu5 = true;

                            $scope.menu6 = false;

                            $scope.menu7 = false;

                            break;

                        case 6:

                            $scope.menu1 = false;

                            $scope.menu2 = false;

                            $scope.menu3 = false;

                            $scope.menu4 = false;

                            $scope.menu5 = false;

                            $scope.menu6 = true;

                            $scope.menu7 = false;

                            break;

                        case 7:

                            $scope.menu1 = false;

                            $scope.menu2 = false;

                            $scope.menu3 = false;

                            $scope.menu4 = false;

                            $scope.menu5 = false;

                            $scope.menu6 = false;

                            $scope.menu7 = true;

                            break;

                    }

                }

            }]);

