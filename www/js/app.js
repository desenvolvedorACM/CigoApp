// Ionic Starter App

var db = null;
var app = angular.module('app', ['ionic', 'ionic-material', 'app.services', 'app.controllers', 'ngCordova', 'ngCordovaOauth']);


app.run(function ($rootScope, $ionicPlatform, $ionicHistory, $ionicPopup, $cordovaNetwork, $location, $window) {
  $ionicPlatform.ready(function () {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)

    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }

    if (window.StatusBar) {
      StatusBar.styleDefault();
    }


    $ionicPlatform.registerBackButtonAction(function (e) {

      e.preventDefault();

      function showConfirm() {
        var confirmPopup = $ionicPopup.show({
          title: 'Sair CigoApp',
          template: 'Tem certeza que deseja sair do CigoApp?',
          buttons: [{
            text: 'Não',
            type: 'button-default',
          }, {
            text: 'Sim',
            type: 'button-positive',
            onTap: function () {
              ionic.Platform.exitApp();
            }
          }]
        });
      };

      // Is there a page to go back to?
      if ($ionicHistory.backView()) {
        // Go back in history
        $ionicHistory.backView().go();
      } else {
        // This is the last page: Show confirmation popup
        showConfirm();
      }

      return false;
    }, 101);

    // $ionicPlatform.registerBackButtonAction(function (event) {

    //     //     $ionicPopup.confirm({
    //     //         title: 'Aviso',
    //     //         template: 'deseja sair do CigoApp?'
    //     //     })
    //     //    .then(function (res) {
    //     //             if (res) {

    //     //                 ionic.Platform.exitApp();
    //     //             }
    //     //         });

    //     e.preventDefault();

    //     var confirmPopup = $ionicPopup.confirm({
    //         title: 'Aviso',
    //         template: 'Tem certeza que deseja sair do CigoApp',
    //         buttons: [{
    //             text: 'Não',
    //             type: 'button-default',
    //             onTap: function (e) {

    //                navigator.app.backHistory();

    //             }
    //         }, {
    //             text: 'Sim',
    //             type: 'button-positive',
    //             onTap: function (e) {

    //                 ionic.Platform.exitApp();
    //             }
    //         }]
    //     });

    // }, 100);



    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    //> Teste de conexão com a internet.
    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    //TemConexao() == "No network connection"
    var isOnline = $cordovaNetwork.isOnline();
    var isOffline = $cordovaNetwork.isOffline();

    if (isOffline) {

      //window.localStorage.setItem("isInternetOn", "nao");

      $ionicPopup.alert({
        title: 'Falha',
        content: '<div style="text-align: center">Falha na Conexão de Internet</div>'
      });

      $location.path('/app/erro');
      //$window.location.reload();

      //console.log("Exiting app");
      //navigator.app.exitApp();

    } else {


      //window.localStorage.setItem("isInternetOn", "sim");
      //toastr.success(TemConexao(), " Tipo de Conexão ");

      cordova.plugins.diagnostic.isLocationEnabled(function (enabled) {

        // $ionicPopup.alert({
        //     title: 'Aviso GPS',
        //     content: '<div style="text-align: center">GPS ' + (enabled ? "enabled" : "disabled") + '</div>'

        // });


        //>> SE O GPS ESTA DESABILITADO
        if (!enabled) {

          // $ionicPopup.alert({
          //     title: 'Aviso GPS',
          //     content: '<div style="text-align: center">Não foi possível obter a posição atual. \n Os sinais GPS são fracos ou o GPS foi desligado</div>'

          // });

          // var confirmPopup = $ionicPopup.confirm({
          //     title: 'Delete',
          //     template: 'Are you sure you want to delete this?'
          // });

          // confirmPopup
          //     .then(function (res) {
          //         if (res) {
          //             console.log('Deleted !');
          //         } else {
          //             console.log('Deletion canceled !');
          //         }
          //     });

          var confirmPopup = $ionicPopup.confirm({
            title: 'Aviso GPS',
            template: 'Serviço de localização desligado, \n ligue os serviços de localização nas configurações do seu aparelho para melhorar a sua experiência de viagem.' +
              '\n deseja ativar o GPS?',
            buttons: [{
              text: 'Não',
              type: 'button-default',
              onTap: function (e) {

                e.preventDefault();
                $location.path('/app/inicio');
                $window.location.reload();
                // e.preventDefault() will stop the popup from closing when tapped.

              }
            }, {
              text: 'Sim',
              type: 'button-positive',
              onTap: function (e) {

                if (window.cordova) {
                  cordova.plugins.diagnostic.switchToLocationSettings();
                }
              }
            }]
          });
        }

      }, function (error) {

        $ionicPopup.alert({
          title: 'Falha',
          content: '<div style="text-align: center">The following error occurred: ' + error + '</div>'
        });

        //alert("The following error occurred: " + error);
      });


    }


    window.screen.lockOrientation('portrait');


    //     //toastr.success(TemConexao(), " Tipo de Conexão ");

    //     // rotate and lock orientation to portrait
    //     window.screen.lockOrientation('portrait');

    //     // rotate and lock orientation to landscape
    //     //window.screen.lockOrientation('landscape');

    //     // allow user rotate 
    //     //screen.unlockOrientation();
    //     // window.screen.unlockOrientation();

    //     // access current orientation 
    //     //console.log('Orientation is ' + screen.orientation);

    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    //CRIAÇÂO BD
    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    //db = $cordovaSQLite.openDB("DBCigoApp.db");
    //$cordovaSQLite.execute(db, "DROP TABLE IF EXISTS paradas");
    //$cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS paradas (id integer primary key, nomeparada text, numparada integer, lat text, lng text, endereco text)");

  });
});



app.config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
      cache: false,
      url: '/app',
      // abstract: false,
      templateUrl: 'templates/menu.html',
      controller: 'AppCtrl'
    })

    .state('app.inicio', {
      url: '/inicio',
      views: {
        'menuContent': {
          templateUrl: 'templates/inicio.html',
          controller: 'CtrlInicio'
        }
      }
    })

    .state('app.meusonibus', {
      url: '/meusonibus',
      views: {
        'menuContent': {
          templateUrl: 'templates/meusonibus.html'
        }
      }
    })

    .state('app.configuracoes', {
      url: '/configuracoes',
      views: {
        'menuContent': {
          templateUrl: 'templates/configuracoes.html'
        }
      }
    })

    .state('app.cadastrarparadas', {
      url: '/cadastrarparadas',
      views: {
        'menuContent': {
          templateUrl: 'templates/cadastrarparadas.html',
          controller: 'CtrlMapearParada'
        }
      }
    })

    .state('app.consultarparadas', {
      url: '/consultarparadas',
      views: {
        'menuContent': {
          templateUrl: 'templates/consultarparadas.html',
          controller: 'CtrlConsultarParadas'
        }
      }
    })

    .state('app.sobre', {
      url: '/sobre',
      views: {
        'menuContent': {
          templateUrl: 'templates/sobre.html',
          controller: 'CtrlSobre'
        }
      }
    })

    .state('app.erro', {
      url: '/erro',
      views: {
        'menuContent': {
          templateUrl: 'templates/trataerro.html',
          controller: 'CtrlErro'
        }
      }
    })

    .state('app.pesquisaronibus', {
      url: '/pesquisaronibus/:idLinha/:Placa/:TipoOnibus',
      views: {
        'menuContent': {
          templateUrl: 'templates/pesquisaronibus1.html',
          controller: 'CtrlPesquisaOnibus'
        }
      }
    })



    .state('app.reportarinformacoes', {
      url: '/reportarinformacoes',
      views: {
        'menuContent': {
          templateUrl: 'templates/reportarinformacoes.html',
          controller: 'CtrlReportarInformacoes'
        }
      }
    })

    .state('app.selecionartipolinha', {
      url: '/selecionartipolinha',
      views: {
        'menuContent': {
          templateUrl: 'templates/selecionartipolinha.html',
          controller: 'CtrlSelecionarTipoLinha'
        }
      }
    })

    .state('app.tipoonibusselecionado', {
      url: '/tipoonibusselecionado/:idLinha/:Placa/:TipoOnibus',
      views: {
        'menuContent': {
          templateUrl: 'templates/pesquisaronibus1.html',
          controller: 'CtrlTipoOnibusSelecionado'
        }
      }
    })

    .state('app.listarlinhas', {
      url: '/listarlinhas/:idParada/:TipoOnibus',
      views: {
        'menuContent': {
          templateUrl: 'templates/listarlinhas.html',
          controller: 'CtrlListaLinhas'
        }
      }
    })

    .state('app.login', {
      url: '/login',
      views: {
        'menuContent': {
          templateUrl: 'templates/loginredesocial.html',
          controller: 'ctrlLoginRedeSocial'
        }
      }
    })

    .state('app.contratolicenca', {
      url: '/contratolicenca',
      views: {
        'menuContent': {
          templateUrl: 'templates/contratolicenca.html',
          controller: 'ctrlContratoLicenca'
        }
      }
    })

    .state('app.listarhorarios', {
      url: '/listarhorarios/:idParada/:idLinha/:TipoOnibus',
      views: {
        'menuContent': {
          templateUrl: 'templates/listarhorarios1.html',
          controller: 'CtrlListarHorarios'
        }
      }
    });


  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/contratolicenca');
});
