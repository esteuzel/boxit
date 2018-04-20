angular.module('boxit', ['ngToast', 'ui.bootstrap', 'ui.router', 'ngStorage', 'angular-md5'])
    .config(['$urlRouterProvider', '$stateProvider', function ($urlRouterProvider, $stateProvider) {

        $urlRouterProvider.otherwise('/home');
        $stateProvider.state('userMenu', {
            url: '/userInterface',
            templateUrl: 'views/userMenu.html?v= + Math.random()',
            controller: 'userMenuController'
        }).state('userMenu.inicio', {
            url: '/inicio',
            templateUrl: 'views/inicio.html?v=${new Date().getTime()}',
            controller: 'inicioController'
        }).state('userMenu.editarPerfil', {
            url: '/editarPerfil',
            templateUrl: 'views/editarPerfil.html?v=${new Date().getTime()}',
            controller: 'editarPerfilController'
        }).state('userMenu.modificarContrasena', {
            url: '/modificarContrasena',
            templateUrl: 'views/modificarContrasena.html?v=${new Date().getTime()}',
            controller: 'modificarContrasenaController'
        }).state('userMenu.seleccionarBoxIt', {
            url: '/seleccionarBoxIt',
            templateUrl: 'views/seleccionarBoxIt.html?v=${new Date().getTime()}',
            controller: 'seleccionarBoxitController'
        }).state('userMenu.anunciarPaquete', {
            url: '/anunciarPaquete',
            templateUrl: 'views/anunciarPaquete.html?v=${new Date().getTime()}',
            controller: 'anunciarPaqueteController'
        }).state('userMenu.trakingDePaquetes', {
            url: '/trakingDePaquetes',
            templateUrl: 'views/trakingDePaquetes.html?v=${new Date().getTime()}',
            controller: 'trakingDePaquetesController'
        }).state('userMenu.cerrarSesion', {
            url: '/cerrarSesion',
            templateUrl: 'views/cerrarSesion.html?v=${new Date().getTime()}',
            controller: 'cerrarSesionController'
        }).state('recovery', {
            url: '/recovery/:hash',
            templateUrl: "views/recuperarPassForm.html?v=${new Date().getTime()}",
            controller: 'passwordController'
        }).state('activar', {
            url: '/activar/:hash',
            templateUrl: "views/activar.html?v=${new Date().getTime()}",
            controller: 'activarController'
        }).state('anular',{
           url:'/anularOrden/:orden',
           templateUrl: "views/anularOrden.html?v=${new Date().getTime()}",
           controller: 'anularController' 
        }).state('home', {
                url: "/home",
                cache: false,
                templateUrl: "views/home.html",
                controller: "homeController"
            }
        ).state('devolucion', {
                url: "/devolucion",
                templateUrl: "views/Devolucion.html?v=${new Date().getTime()}",
                controller: ""
            }
        ).state('enviar', {
                url: "/enviar",
                templateUrl: "views/Enviar.html?v=${new Date().getTime()}",
                controller: ""
            }
        ).state('faq', {
                url: "/faq",
                templateUrl: "views/faq.html?v=${new Date().getTime()}",
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
	        templateUrl: "views/contactanos.html?v=${new Date().getTime()}",
	        controller: ""
	
	    }
	    ).state('ProductosProhibidos', {
	        url: "/ProductosProhibidos",
	        templateUrl: "views/ProductosProhibidos.html?v=${new Date().getTime()}",
	        controller: ""
	
	    }
         ).state('FarmaciaDroga', {
	        url: "/FarmaciaDroga",
	        templateUrl: "views/FarmaciaDroga.html?v=${new Date().getTime()}",
	        controller: ""
	
	    }
         ).state('MaterialPeligroso', {
	        url: "/MaterialPeligroso",
	        templateUrl: "views/MaterialPeligroso.html?v=${new Date().getTime()}",
	        controller: ""
	
	    }
          ).state('TramitesEspeciales', {
	        url: "/TramitesEspeciales",
	        templateUrl: "views/TramitesEspeciales.html?v=${new Date().getTime()}",
	        controller: ""
	
	    }
          ).state('ubicaciones', {
            url: "/ubicaciones",
            templateUrl: "views/ubicaciones.html?v=002",
            controller: ""
    
        }
        ).state('iniciarSesion', {
                url: "/iniciarSesion",
                templateUrl: "views/IniciarSesion.html?v=${new Date().getTime()}",
                controller: "loginController"

            }        
        ).state('pagoservicio', {
                url: "/pagoservicio",
                templateUrl: "views/Pagoservicio.html?v=${new Date().getTime()}",
                controller: ""

            }
        ).state('precios', {
                url: "/precios",
                templateUrl: "views/Precios.html?v=${new Date().getTime()}",
                controller: "precioController"
            }
        ).state('registro', {
                url: "/registro",
                cache: false,
                templateUrl: "views/Registro.html?"+$.now(),
                controller: "siginController"
            }
        ).state('retiro', {
                url: "/retiro",
                templateUrl: "views/Retiro.html?v=${new Date().getTime()}",
                controller: ""
            }
        ).state('boxitStoreOld', {
                url: "/boxitStoreOld",
                templateUrl: "views/BoxitStoreOld.html?"+$.now(),
                controller: "shoppingCarController"
            }
        ).state('boxitStore', {
                url: "/boxitStore",
                templateUrl: "views/BoxitStore.html?"+$.now(),
                controller: "boxitStoreController"
            }
        ).state('carrito', {
                url: "/carrito",
                templateUrl: "views/Carrito.html?"+$.now(),
                controller: "carritoController"
            }
        ).state('modal', {
                parent: 'boxitStore',
                url: '/modal',
                onEnter: ['$uibModal', '$state', function ($uibModal, $state) {
                    console.log('Open modal');
                    $uibModal.open({
                        templateUrl: 'views/modalShoppingCar.html',
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
                        templateUrl: 'views/itemList.html'
                    }
                },
                controller: 'shoppingCarController'
            }
        ).state('itemDetail', {
            url: '/itemDetail/:itemId',
            reloadOnSearch : false,
            templateUrl: 'views/itemDetail.html',
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
                        templateUrl: 'views/checkoutmessage.html'
                    }
                }
            }
        ).state('modalLogin', {
                url: '/modalLogin',
                parent: 'modal',
                views: {
                    'modal@': {
                        templateUrl: 'views/modalLogin.html'
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
                        templateUrl: 'views/terminosycondiciones.html',
                        size: 'lg',
                    }).result.finally(function () {
                        
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
            templateUrl: "views/misFavoritos.html",
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
            templateUrl: "views/giftcards.html",
            controller: "giftcardsController"
        }

        );
    }]);
    
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
