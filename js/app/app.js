angular.module('boxit', ['ngToast', 'ui.bootstrap', 'ui.router', 'ngStorage', 'angular-md5','ngFileUpload'])
    .config(['$urlRouterProvider', '$stateProvider', '$locationProvider',function ($urlRouterProvider, $stateProvider, $locationProvider) {        
        $locationProvider.html5Mode(true);
        $urlRouterProvider.otherwise('/home');
        $stateProvider.state('userMenu', {
            url: '/userInterface',
            templateUrl: 'views/userMenu.html?v=105',
            controller: 'userMenuController'
        }).state('userMenu.inicio', {
            url: '/inicio',
            templateUrl: 'views/inicio.html?v=105',
            controller: 'inicioController'
        }).state('userMenu.editarPerfil', {
            url: '/editarPerfil',
            templateUrl: 'views/editarPerfil.html?v=105',
            controller: 'editarPerfilController'
        }).state('userMenu.modificarContrasena', {
            url: '/modificarContrasena',
            templateUrl: 'views/modificarContrasena.html?v=105',
            controller: 'modificarContrasenaController'
        }).state('userMenu.seleccionarBoxIt', {
            url: '/seleccionarBoxIt',
            templateUrl: 'views/seleccionarBoxIt.html?v=105',
            controller: 'seleccionarBoxitController'
        }).state('userMenu.anunciarPaquete', {
            url: '/anunciarPaquete',
            templateUrl: 'views/anunciarPaquete.html?v=105',
            controller: 'anunciarPaqueteController'
        }).state('userMenu.trakingDePaquetes', {
            url: '/trakingDePaquetes',
            templateUrl: 'views/trakingDePaquetes.html?v=105',
            controller: 'trakingDePaquetesController'
        }).state('userMenu.cerrarSesion', {
            url: '/cerrarSesion',
            templateUrl: 'views/cerrarSesion.html?v=105',
            controller: 'cerrarSesionController'
        /*}).state('recovery', {
            url: '/recovery/:hash',
            templateUrl: "views/recuperarPassForm.html?v=105",
            controller: 'passwordController'*/
        }).state('activar', {
            url: '/activar/:hash',
            templateUrl: "views/activar.html?v=105",
            controller: 'activarController'
        }).state('anular',{
           url:'/anularOrden/:orden',
           templateUrl: "views/anularOrden.html?v=105",
           controller: 'anularController' 
        }).state('home', {
                url: "/home",
                cache: false,
                templateUrl: "views/home.html?v=105",
                controller: "homeController"
            }
        ).state('devolucion', {
                url: "/devolucion",
                templateUrl: "views/Devolucion.html?v=105",
                controller: ""
            }
        ).state('enviar', {
                url: "/enviar",
                templateUrl: "views/Enviar.html?v=105",
                controller: ""
            }
        ).state('faq', {
                url: "/faq",
                templateUrl: "views/faq.html?v=105",
                controller: ""

            }
        ).state('vende', {
            url: "/vende",
            templateUrl: "views/vende.html",
            controller: ""

        }
        ).state('empresarial-boxit-residencial', {
            url: "/empresarial-boxit-residencial",
            templateUrl: "views/empresarial-boxit-residencial.html",
            controller: ""

        }
        ).state('empresarial-boxit-tulocal', {
            url: "/empresarial-boxit-tulocal",
            templateUrl: "views/empresarial-boxit-tulocal.html",
            controller: ""

        }
        ).state('nosotros', {
            url: "/nosotros",
            templateUrl: "views/nosotros.html",
            controller: ""

        }
        ).state('blog', {
            url: "/blog",
            templateUrl: "views/blog.html",
            controller: ""

        }
        ).state('prensa', {
            url: "/prensa",
            templateUrl: "views/prensa.html",
            controller: ""

        }
        ).state('contactanos', {
            url: "/contactanos",
            templateUrl: "views/contactanos.html?v=105",
            controller: ""
    
        }
        ).state('ProductosProhibidos', {
            url: "/ProductosProhibidos",
            templateUrl: "views/ProductosProhibidos.html?v=105",
            controller: ""
    
        }
         ).state('FarmaciaDroga', {
            url: "/FarmaciaDroga",
            templateUrl: "views/FarmaciaDroga.html?v=105",
            controller: ""
    
        }
         ).state('MaterialPeligroso', {
            url: "/MaterialPeligroso",
            templateUrl: "views/MaterialPeligroso.html?v=105",
            controller: ""
    
        }
          ).state('TramitesEspeciales', {
            url: "/TramitesEspeciales",
            templateUrl: "views/TramitesEspeciales.html?v=105",
            controller: ""
    
        }
          ).state('ubicaciones', {
            url: "/ubicaciones",
            templateUrl: "views/ubicaciones.html?v=002",
            controller: ""
    
        }
        ).state('iniciarSesion', {
                url: "/iniciarSesion",
                templateUrl: "views/IniciarSesion.html?v=105",
                controller: "loginController"

            }
        ).state('confirmacion', {
            url: "/confirmacion/:hash",
            templateUrl: "views/recuperarPassForm.html?v=105",
            params: {
                hash: ""
            },
            controller: "passwordController"
        }    
        ).state('pagoservicio', {
                url: "/pagoservicio",
                templateUrl: "views/Pagoservicio.html?v=105",
                controller: ""

            }
        ).state('precios', {
                url: "/precios",
                templateUrl: "views/Precios.html?v=105",
                controller: "precioController"
            }
        ).state('registro', {
                url: "/registro",
                cache: false,
                templateUrl: "views/Registro.html?v=105",
                controller: "siginController"
            }
        ).state('retiro', {
                url: "/retiro",
                templateUrl: "views/Retiro.html?v=105",
                controller: ""
            }
        ).state('boxitStoreOld', {
                url: "/boxitStoreOld",
                templateUrl: "views/BoxitStoreOld.html?v=105",
                controller: "shoppingCarController"
            }
        /*).state('boxitStore', {
                url: "/boxitStore",
                templateUrl: "views/BoxitStore.html?"+$.now(),
                controller: "boxitStoreController"
            }*/
        ).state('boxitStore', {
            url: '/boxitStore/:serchdata',
            reloadOnSearch : false,
            templateUrl: "views/BoxitStore.html?v=106",
            params: {
                serchdata: ""
            },                
            controller: 'boxitStoreController'
        }

        ).state('carrito', {
                url: "/carrito",
                templateUrl: "views/Carrito.html?v=105",
                controller: "carritoController"
            }
        ).state('modal', {
                parent: 'boxitStore',
                url: '/modal',
                onEnter: ['$uibModal', '$state', function ($uibModal, $state) {
                    console.log('Open modal');
                    $uibModal.open({
                        templateUrl: 'views/modalShoppingCar.html?v=105"',
                        size: 'lg',
                        controller: 'modalShoppingCarController'
                    }).result.finally(function () {
                        $state.go('boxitStore');
                    });
                }]
            }
        ).state('itemList', {
                url: '/itemList',
                parent: 'modal',
                views: {
                    'modal@': {
                        templateUrl: 'views/itemList.html?v=105'
                    }
                },
                controller: 'shoppingCarController'
            }
        ).state('itemDetail', {
            url: '/itemDetail/:itemId',
            reloadOnSearch : false,
            templateUrl: 'views/itemDetail.html?v=106',
            params: {
                itemId: ""
            },                
            controller: 'itemDetailController'
        }
        /*
        ).state('itemDetails', {
                url: '/itemDetails?itemId',
                parent: 'modal',
                views: {
                    'modal@': {
                        templateUrl: 'views/detallesDelArticulo.html'
                    }
                },
                params: {
                    itemId: ""
                },
                controller: 'detallesDelArticuloController'
            }
            */
        ).state('checkoutmessage', {
                url: '/checkoutmessage',
                parent: 'modal',
                views: {
                    'modal@': {
                        templateUrl: 'views/checkoutmessage.html?v=105'
                    }
                }
            }
        ).state('modalLogin', {
                url: '/modalLogin',
                parent: 'modal',
                views: {
                    'modal@': {
                        templateUrl: 'views/modalLogin.html?v=105'
                    }
                },
                controller:'modalLoginController'
            }
            ).state('terminosycondiciones', {
                url: '/terminosycondiciones',
                parent: 'home',
                onEnter: ['$uibModal', '$state', function ($uibModal, $state) {
                    console.log('Open modal terminosycondiciones');
                    $uibModal.open({
                        templateUrl: 'views/terminosycondiciones.html?v=105',
                        size: 'lg',
                    }).result.finally(function () {
                        $state.go('home');
                    });
                }]
            }

        ).state('modalRusia', {
            parent: 'rusia2018',
            url: '/rusia2018modal',
            onEnter: ['$uibModal', '$state', function ($uibModal, $state) {
                console.log('Open modal');
                $uibModal.open({
                    templateUrl: 'views/modalLogin.html',
                    size: 'lg',
                    controller: 'modalLoginController'
                }).result.finally(function () {
                    $state.go('boxitStore');
                });
            }]
        }
        ).state('subirArchivo', {
            url: '/subirArchivo',
            templateUrl: 'views/subirArchivo.html?v=105',
            controller: 'subirArchivoController'
        }
/*
        ).state('modalLoginNew', {
                url: '/modalLoginNew',
                parent: 'boxitStore',
                onEnter: ['$uibModal', '$state', function ($uibModal, $state) {
                    console.log('Open modalLoginNew');
                    $uibModal.open({
                        templateUrl: "views/modalLoginNew.html?"+$.now(),
                        size: 'lg',
                        component: 'close',
                        controller: 'modalLoginController'
                    }).result.finally(function () {
                        $state.go('boxitStore');
                    });
                }]
            }
            */
        ).state('misFavoritos', {
            url: "/misFavoritos",
            templateUrl: "views/misFavoritos.html?v=105",
            controller: "myWishList"
        }        
        ).state('rusia2018', {
            url: "/rusia2018",
            templateUrl: "views/rusia2018.html",
            controller: "rusia2018Controller"
        }    
        ).state('rusiaDetail', {
            url: '/rusiaDetail/:itemId',
            reloadOnSearch : false,
            templateUrl: 'views/rusiaDetail.html',
            params: {
                itemId: ""
            },                
            controller: 'rusiaDetailController'
        }
        ).state('giftcards', {
            url: "/giftcards",
            templateUrl: "views/giftcards.html?v=105",
            controller: "giftcardsController"
        }

        );
    }]).run(run);
    
        run.$inject = ['$rootScope', '$location', '$window'];
            function run($rootScope, $location, $window) {         
                // track pageview on state change
                $rootScope.$on('$locationChangeStart', function (event) {
                //$window.ga('send', 'pageview', $location.path());
                console.log("pageview",$location.path());
            });
        }
  /* boxit.run(function($rootScope, $templateCache) {
   $rootScope.$on('$viewContentLoaded', function() {
      $templateCache.removeAll();
   });
});*/

 /*boxit.config(['$httpProvider', function($httpProvider) {
    //initialize get if not there
    if (!$httpProvider.defaults.headers.get) {
        $httpProvider.defaults.headers.get = {};    
    }    

    // Answer edited to include suggestions from comments
    // because previous version of code introduced browser-related errors

    //disable IE ajax request caching
    $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
    // extra
    $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
    $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
}]);*/
