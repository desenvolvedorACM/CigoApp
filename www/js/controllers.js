var control = angular.module('app.controllers', [])


control.controller('AppCtrl', function ($scope, $ionicModal, $ionicPopup, $ionicLoading, $ionicPopover, $location, $window) {


  // Form data for the login modal
  $scope.loginData = {};


  // .fromTemplate() method
  // var template = '<ion-popover-view>' +
  //     // '   <ion-header-bar>' +
  //     // '       <h1 class="title">Aceso Menu</h1>' +
  //     // '   </ion-header-bar>' +
  //     '   <ion-content class="padding">' +
  //     '      <button class="btn btn-primary btn-block" ng-click="CadastrarParada();">Mapear Paradas</button>' +
  //     '      <button class="btn btn-primary btn-block" ng-click="ConsultarParadas();">Consultar Paradas</button>' +
  //     '   </ion-content>' +
  //     '</ion-popover-view>';


  // $scope.popover = $ionicPopover.fromTemplate(template, {
  //     scope: $scope
  // });

  // $scope.closePopover = function () {
  //     $scope.popover.hide();
  // };


  //Cleanup the popover when we're done with it!
  $scope.$on('$destroy', function () {
    $scope.popover.remove();
  });


  $scope.loading = function () {
    $ionicLoading.show({
      template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>'
    });

    // For example's sake, hide the sheet after two seconds
    $timeout(function () {
      $ionicLoading.hide();
    }, 2000);
  };


  $scope.PesquisaOnibus = function () {

    $location.path('/app/pesquisaronibus/0/0/0');
    $window.location.reload();
    //window.location.reload()
  }


  $scope.MeusOnibus = function () {

    $location.path('/app/meusonibus');
    $window.location.reload();
    //window.location.reload()
  }


  $scope.Configuracoes = function () {

    $location.path('/app/configuracoes');
    $window.location.reload();
    //window.location.reload()
  }


  $scope.CadastrarParada = function () {

    $location.path('/app/cadastrarparadas');
    $window.location.reload();
  }


  $scope.ReportarInformacoes = function () {

    $location.path('/app/login');
    $scope.$apply();
    //window.location.reload()

  }


  $scope.DirecionaLoginRedeSocial = function () {

    $location.path('/app/login');
    $scope.$apply();

  }

});


control.controller('CtrlPesquisaOnibus', function ($scope, $timeout, $ionicModal, $ionicPopup, $ionicLoading, $cordovaGeolocation, $window, $location, Paradas, InvioSiga, HorariosItinerariosCigoApp, GeoMItinerarios, $stateParams) {


  var markers = new Array();
  var Circles = new Array();
  var marker, i, Circle;
  var locations = new Array();
  var linhasPlotar = new Array();



  var map = new google.maps.Map($('#map_content')[0], {
    //zoom: 12,
    //center: new google.maps.LatLng(-29.9496015, -50.9812005),
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    disableDefaultUI: true

  });



  $('.divMunicipal').click(function () {

    $scope.IniciaMapa(1);

    $('.ModalSelecionaTipoOnibus')
      .hide(500);

    $('.Modal_botao_exibe_SelecionaTipoOnibus')
      .show(500)

  });



  $('.divIntermunicipal').click(function () {

    $scope.IniciaMapa(2);

    $('.ModalSelecionaTipoOnibus')
      .hide(500);

    $('.Modal_botao_exibe_SelecionaTipoOnibus')
      .show(500);

  });


  // $('.popSelecionaTipoOnibus').click(function () {

  //     $('.popSelecionaTipoOnibus')
  //         .hide(800);

  //     $('.botao_exibe_SelecionaTipoOnibus')
  //         .show(900)

  //     // $("#div1").fadeIn();
  //     // $("#div2").fadeIn("slow");
  //     // $("#div3").fadeIn(3000);

  //     // $("#div1").fadeOut();
  //     // $("#div2").fadeOut("slow");
  //     // $("#div3").fadeOut(3000);

  //     // $("#div1").fadeToggle();
  //     // $("#div2").fadeToggle("slow");
  //     // $("#div3").fadeToggle(3000);

  // });


  $('.Modal_botao_exibe_SelecionaTipoOnibus').click(function () {

    $('.Modal_botao_exibe_SelecionaTipoOnibus')
      .hide(500);

    $('.ModalSelecionaTipoOnibus')
      .show(500)
  });



  $scope.Fechar = function () {

    $scope.modal.hide();

    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {
      $scope.modal.remove();
    });

    // Execute action on hide modal
    $scope.$on('modal.hidden', function () {
      // Execute action
    });

    // Execute action on remove modal
    $scope.$on('modal.removed', function () {
      // Execute action
    });
  };


  $scope.openModal_HorariosNGS = function () {


    $ionicModal.fromTemplateUrl('ModalHorarios.html', {
        scope: $scope,
        animation: 'newspaper'
      })
      .then(function (modal) {

        $scope.modal = modal;
        $scope.modal.show();
      });
  };



  $scope.CancelaViagem = function () {


    $('.popTempoOnibus').addClass('invisible');
    $('.Fundo').addClass('invisible');

    $scope.LimpaTimers();

    $ionicPopup.alert({
      title: 'Aviso',
      content: '<div style="text-align: center">Solicitação de viagem cancelada.</div>'
    });

  }



  $scope.ExibeParada = function (Circle, latitude, longitude) {

    var latLng = new google.maps.LatLng(latitude, longitude);
    return Circle.getBounds().contains(latLng) && google.maps.geometry.spherical.computeDistanceBetween(Circle.getCenter(), latLng) <= Circle.getRadius();
  }


  $scope.DeleteMarkers = function (markers) {

    markers.forEach(function (marker) {

      marker.setMap(null);
    });
  };



  $scope.clearCircle = function (Circles) {

    Circles.forEach(function (Circle) {

      Circle.setMap(null);
    });
  };



  $scope.LimpaTimers = function () {

    //clearInterval(tempoTeste);
    for (var i = 1; i < 99999; i++) {
      window.clearInterval(i);
      window.clearTimeout(i);
    }

  }


  $scope.LimpaTimerEspecifico = function (nomeTimer) {

    clearInterval(nomeTimer);
  }



  $scope.IniciaMapa = function (TipoOnibus) {



    $('.Modal_botao_exibe_SelecionaTipoOnibus')
      .show(800);

    $('.pin_centro')
      .show(200);

    $('.pin_localiza')
      .show(200);


    $('.pin_localiza').click(function () {


      var posOptions = {
        maximumAge: 1000,
        timeout: 6000,
        enableHighAccuracy: true
      };


      navigator.geolocation.getCurrentPosition(function (pos) {

        $scope.lat = pos.coords.latitude;
        $scope.lng = pos.coords.longitude;

        if ($scope.lat != '' && $scope.lng != '') {

          map.setCenter(new google.maps.LatLng($scope.lat, $scope.lng));
          map.setZoom(15);
        }

      }, function (PositionError) {

        //code = 1
        //User denied Geolocation
        //PositionError.POSITION_UNAVAILABLE ou PositionError.TIMEOUT 
        //$ionicLoading.hide();

        if (PositionError.TIMEOUT) {

          $ionicPopup.alert({
            title: 'Aviso GPS',
            content: '<div style="text-align: center"> Código ' + PositionError.code + '<br /> Mensagem: ' + PositionError.message +
              ' <br /><hr/>Não foi possível obter a posição atual.Os sinais GPS são fracos ou o GPS foi desligado</div>'

          });

          $location.path('/app/pesquisaronibus/0/0/0');
          $scope.$apply();
          //$window.location.reload();
        }

      }, posOptions);

    });

    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    //> LOCALIZAÇÃO DO USUÁRIO NO MAPA
    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    // var controlDiv = document.createElement('div');

    // // Set CSS for the control border
    // var controlUI = document.createElement('img');
    // controlUI.id = 'pin_localizar'
    // controlUI.src = 'img/center_position_1.jpg';
    // controlUI.addClass = 'img pin_localiza';
    // controlUI.width = '60';
    // controlUI.height = '60';

    // controlDiv.appendChild(controlUI);

    // controlDiv.addEventListener('click', function () {


    //   var posOptions = {
    //     maximumAge: 1000,
    //     timeout: 6000,
    //     enableHighAccuracy: true
    //   };


    //   navigator.geolocation.getCurrentPosition(function (pos) {

    //     $scope.lat = pos.coords.latitude;
    //     $scope.lng = pos.coords.longitude;

    //     if ($scope.lat != '' && $scope.lng != '') {

    //       map.setCenter(new google.maps.LatLng($scope.lat, $scope.lng));
    //       map.setZoom(15);
    //     }

    //   }, function (PositionError) {

    //     //code = 1
    //     //User denied Geolocation
    //     //PositionError.POSITION_UNAVAILABLE ou PositionError.TIMEOUT 
    //     //$ionicLoading.hide();

    //     if (PositionError.TIMEOUT) {

    //       $ionicPopup.alert({
    //         title: 'Aviso GPS',
    //         content: '<div style="text-align: center"> Código ' + PositionError.code + '<br /> Mensagem: ' + PositionError.message +
    //           ' <br /><hr/>Não foi possível obter a posição atual.Os sinais GPS são fracos ou o GPS foi desligado</div>'

    //       });

    //       $location.path('/app/pesquisaronibus/0/0/0');
    //       $scope.$apply();
    //       //$window.location.reload();
    //     }

    //   }, posOptions);

    // });


    //map.controls[google.maps.ControlPosition.RIGHT_CENTER].clear();
    //map.controls[google.maps.ControlPosition.RIGHT_CENTER].push(controlDiv);


    // $ionicLoading.show({
    //     template: '<div class="loader_inicia_onibus">' +
    //     '<svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg>' +
    //     '<br/><span style=\"8px\">Buscando paradas..</span></div>'
    // });


    $ionicLoading.show({
      template: '<div class="loader_padrao">' +
        '<div class="col-xs-12">' +
        '<div class="col-xs-3 text-left"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>' +
        '<div class="col-xs-9 text-left"><span style="vertical-align: bottom;margin-top:45px;position:absolute; font-size:15px;">Pesquisando paradas..</span></div>' +
        '</div></div>'
    });


    if (TipoOnibus != "") {


      Paradas.ParadasTipoOnibus(TipoOnibus)
        .then(function (paradas) {

          if (paradas.length > 0) {


            var infowindow = new google.maps.InfoWindow({
              maxWidth: 900
            });


            for (i = 0; i < paradas.length; i++) {

              locations[i] = [paradas[i].nomeparada, paradas[i].lat, paradas[i].lng, paradas[i].id, paradas[i].marcada]

            }


            //var centro = new google.maps.LatLng(-29.9496015, -50.9812005);
            // var map = new google.maps.Map($('#map_content')[0], {
            //     //zoom: 12,
            //     //center: new google.maps.LatLng(-29.9496015, -50.9812005),
            //     mapTypeId: google.maps.MapTypeId.ROADMAP,
            //     disableDefaultUI: true
            // });


            //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
            //> LOCALIZAÇÃO DO USUÁRIO NO MAPA
            //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
            var posOptions = {
              maximumAge: 1000,
              timeout: 6000,
              enableHighAccuracy: true
            };


            navigator.geolocation.getCurrentPosition(function (pos) {

              $scope.lat = pos.coords.latitude;
              $scope.lng = pos.coords.longitude;

              //$scope.lat = "-29.917512";
              //$scope.lng = "-51.1830887460327";


              //ARMAZENO AS INFORMAÇÕES DE LOCALIZAÇÃO, ENQUANTO ESTA COM APP ABERTO.
              sessionStorage.setItem('lat', $scope.lat);
              sessionStorage.setItem('lng', $scope.lng);


              if ($scope.lat != '' && $scope.lng != '') {


                //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
                //>>Cria marcador de localização usuário.
                //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
                marker = new google.maps.Marker({
                  title: 'Sua localização',
                  position: new google.maps.LatLng($scope.lat, $scope.lng),
                  //map: map,
                  icon: 'img/localiza_pessoa_40.png',
                  //animation: google.maps.Animation.BOUNCE, //BOUNCE DROP
                  draggable: false //permite arrastar,
                  //label: 'Você esta aqui'
                });


                // // To add the marker to the map, call setMap();
                marker.setMap(map);


                // To add the marker to the map, call setMap();
                //marker.setMap(map);
                map.setCenter(new google.maps.LatLng($scope.lat, $scope.lng));
                map.setZoom(15);


                var optionsCircle = {
                  // strokeColor: '#FF0000',
                  // strokeOpacity: 0.8,
                  // strokeWeight: 2,
                  // fillColor: '#FF0000',
                  // fillOpacity: 0.35,
                  strokeColor: '#FF0000',
                  strokeOpacity: 0.00001,
                  strokeWeight: 0,
                  //map: map,
                  center: new google.maps.LatLng($scope.lat, $scope.lng),
                  radius: 500, //in km -  default in meters.
                  editable: false, //permite editar
                  draggable: true, //permite arrastar
                }



                $scope.clearCircle(Circles);

                var Circle = new google.maps.Circle(optionsCircle);
                Circle.setMap(map);
                Circle.setVisible(false);

                Circles.push(Circle);


                map.addListener('dragend', function () {


                  var ne = Circle.getBounds().getNorthEast();
                  var sw = Circle.getBounds().getSouthWest();
                  var Radios = Circle.getRadius(); //in meters


                  var contentString = '<b>Informações Râio</b><br />' +
                    'NorthEast: ' + ne.lat() + ', ' + ne.lng() + '<br />' +
                    'SouthWest: ' + sw.lat() + ', ' + sw.lng() + '<br />' +
                    'Calculando raio em metros: ' + Radios + '<br/><br/>' +
                    '<b>Total paradas: </b>' + locations.length;



                  //map.setCenter(new google.maps.LatLng(sw.lat(), sw.lng()));
                  var CentroMapa = map.getCenter();
                  var CentroCircle = Circle.getCenter();
                  //var centroMarcador = marker.getPosition();
                  //var getBounds = map.getBounds();


                  map.setCenter(new google.maps.LatLng(CentroMapa.lat(), CentroMapa.lng()));
                  Circle.setCenter(new google.maps.LatLng(CentroMapa.lat(), CentroMapa.lng()));
                  //marker.setPosition(new google.maps.LatLng(CentroCircle.lat(), CentroCircle.lng()));
                  // Define an info window on the map.
                  //var infoWindow1 = new google.maps.InfoWindow();


                  // Set the info window's content and position.
                  // infoWindow1.setContent(contentString);
                  // infoWindow1.setPosition(ne);
                  // infoWindow1.open(map);


                  $scope.DeleteMarkers(markers);

                  //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
                  //> CARREGO AS PARADAS DENTRO DO Raio.
                  //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

                  for (i = 0; i < locations.length; i++) {

                    var Exibir = $scope.ExibeParada(Circle, locations[i][1], locations[i][2]);

                    if (Exibir) {

                      marker = new google.maps.Marker({
                        title: locations[i][0],
                        position: new google.maps.LatLng(locations[i][1], locations[i][2]),
                        map: map,
                        icon: 'img/Parada_azul_40.png',
                        draggable: false //permite arrastar
                      });


                      google.maps.event.addListener(marker, 'click', (function (marker, i) {
                        return function () {


                          // infowindow.setContent('<div><b>Nome Parada: </b>' + locations[i][0] +
                          //     '<br/>' + '<b>Lat:</b>' + locations[i][1] + '<br/>' + '<b>Lng:</b>' + locations[i][2] + '</div>');
                          // infowindow.open(map, marker);

                          $scope.lat = locations[i][1];
                          $scope.lng = locations[i][2];

                          sessionStorage.setItem('lat', $scope.lat);
                          sessionStorage.setItem('lng', $scope.lng);


                          //ENVIO O IDLINHA POR PARAMETRO.
                          $scope.IDparada = locations[i][3];

                          $location.path('app/listarlinhas/' + $scope.IDparada + '/' + TipoOnibus);
                          $scope.$apply();

                          //$state.go('login');

                        }

                      })(marker, i));


                      //Add marker to the array.
                      markers.push(marker);

                    }
                  }

                });

                $ionicLoading.hide();

              }


            }, function (PositionError) {

              //code = 1
              //User denied Geolocation
              //PositionError.POSITION_UNAVAILABLE ou PositionError.TIMEOUT 
              $ionicLoading.hide();

              $ionicPopup.alert({
                title: 'Aviso GPS',
                content: '<div style="text-align: center"> Código ' + PositionError.code + '<br /> Mensagem: ' + PositionError.message +
                  ' <br /><hr/>Não foi possível obter a posição atual.Os sinais GPS são fracos ou o GPS foi desligado</div>'

              });


            }, posOptions);


          } else {

            //bootbox.alert('Nenhuma parada encontrada.');
            $ionicPopup.alert({
              title: 'Aviso',
              content: '<div style="text-align: center">Nenhuma parada encontrada.</div>'
            });
          }

        });


    } else {


      Paradas.TodasParadas()
        .then(function (paradas) {

          if (paradas.length > 0) {


            var infowindow = new google.maps.InfoWindow({
              maxWidth: 900
            });


            for (i = 0; i < paradas.length; i++) {

              locations[i] = [paradas[i].nomeparada, paradas[i].lat, paradas[i].lng, paradas[i].id, paradas[i].marcada]

            }


            //var centro = new google.maps.LatLng(-29.9496015, -50.9812005);
            // var map = new google.maps.Map($('#map_content')[0], {
            //     //zoom: 12,
            //     //center: new google.maps.LatLng(-29.9496015, -50.9812005),
            //     mapTypeId: google.maps.MapTypeId.ROADMAP,
            //     disableDefaultUI: true
            // });


            //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
            //> LOCALIZAÇÃO DO USUÁRIO NO MAPA
            //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
            var posOptions = {
              maximumAge: 1000,
              timeout: 6000,
              enableHighAccuracy: true
            };


            navigator.geolocation.getCurrentPosition(function (pos) {

              $scope.lat = pos.coords.latitude;
              $scope.lng = pos.coords.longitude;

              //$scope.lat = "-29.917512";
              //$scope.lng = "-51.1830887460327";


              //ARMAZENO AS INFORMAÇÕES DE LOCALIZAÇÃO, ENQUANTO ESTA COM APP ABERTO.
              sessionStorage.setItem('lat', $scope.lat);
              sessionStorage.setItem('lng', $scope.lng);


              if ($scope.lat != '' && $scope.lng != '') {


                //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
                //>>Cria marcador de localização usuário.
                //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
                marker = new google.maps.Marker({
                  title: 'Sua localização',
                  position: new google.maps.LatLng($scope.lat, $scope.lng),
                  //map: map,
                  icon: 'img/localiza_pessoa_40.png',
                  //animation: google.maps.Animation.BOUNCE, //BOUNCE DROP
                  draggable: false //permite arrastar,
                  //label: 'Você esta aqui'
                });


                // // To add the marker to the map, call setMap();
                marker.setMap(map);


                // To add the marker to the map, call setMap();
                //marker.setMap(map);
                map.setCenter(new google.maps.LatLng($scope.lat, $scope.lng));
                map.setZoom(15);


                var optionsCircle = {
                  // strokeColor: '#FF0000',
                  // strokeOpacity: 0.8,
                  // strokeWeight: 2,
                  // fillColor: '#FF0000',
                  // fillOpacity: 0.35,
                  strokeColor: '#FF0000',
                  strokeOpacity: 0.00001,
                  strokeWeight: 0,
                  //map: map,
                  center: new google.maps.LatLng($scope.lat, $scope.lng),
                  radius: 500, //in km -  default in meters.
                  editable: false, //permite editar
                  draggable: true, //permite arrastar
                }



                $scope.clearCircle(Circles);

                var Circle = new google.maps.Circle(optionsCircle);
                Circle.setMap(map);
                Circle.setVisible(false);

                Circles.push(Circle);


                map.addListener('dragend', function () {


                  var ne = Circle.getBounds().getNorthEast();
                  var sw = Circle.getBounds().getSouthWest();
                  var Radios = Circle.getRadius(); //in meters


                  var contentString = '<b>Informações Râio</b><br />' +
                    'NorthEast: ' + ne.lat() + ', ' + ne.lng() + '<br />' +
                    'SouthWest: ' + sw.lat() + ', ' + sw.lng() + '<br />' +
                    'Calculando raio em metros: ' + Radios + '<br/><br/>' +
                    '<b>Total paradas: </b>' + locations.length;



                  //map.setCenter(new google.maps.LatLng(sw.lat(), sw.lng()));
                  var CentroMapa = map.getCenter();
                  var CentroCircle = Circle.getCenter();
                  //var centroMarcador = marker.getPosition();
                  //var getBounds = map.getBounds();


                  map.setCenter(new google.maps.LatLng(CentroMapa.lat(), CentroMapa.lng()));
                  Circle.setCenter(new google.maps.LatLng(CentroMapa.lat(), CentroMapa.lng()));
                  //marker.setPosition(new google.maps.LatLng(CentroCircle.lat(), CentroCircle.lng()));
                  // Define an info window on the map.
                  //var infoWindow1 = new google.maps.InfoWindow();


                  // Set the info window's content and position.
                  // infoWindow1.setContent(contentString);
                  // infoWindow1.setPosition(ne);
                  // infoWindow1.open(map);


                  $scope.DeleteMarkers(markers);

                  //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
                  //> CARREGO AS PARADAS DENTRO DO Raio.
                  //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

                  for (i = 0; i < locations.length; i++) {

                    var Exibir = $scope.ExibeParada(Circle, locations[i][1], locations[i][2]);

                    if (Exibir) {

                      marker = new google.maps.Marker({
                        title: locations[i][0],
                        position: new google.maps.LatLng(locations[i][1], locations[i][2]),
                        map: map,
                        icon: 'img/Parada_azul_40.png',
                        draggable: false //permite arrastar
                      });


                      google.maps.event.addListener(marker, 'click', (function (marker, i) {
                        return function () {


                          // infowindow.setContent('<div><b>Nome Parada: </b>' + locations[i][0] +
                          //     '<br/>' + '<b>Lat:</b>' + locations[i][1] + '<br/>' + '<b>Lng:</b>' + locations[i][2] + '</div>');
                          // infowindow.open(map, marker);

                          $scope.lat = locations[i][1];
                          $scope.lng = locations[i][2];

                          sessionStorage.setItem('lat', $scope.lat);
                          sessionStorage.setItem('lng', $scope.lng);


                          //ENVIO O IDLINHA POR PARAMETRO.
                          $scope.IDparada = locations[i][3];

                          $location.path('app/listarlinhas/' + $scope.IDparada + '/' + TipoOnibus);
                          $scope.$apply();

                          //$state.go('login');

                        }

                      })(marker, i));


                      //Add marker to the array.
                      markers.push(marker);

                    }
                  }

                });

                $ionicLoading.hide();

              }


            }, function (PositionError) {

              //code = 1
              //User denied Geolocation
              //PositionError.POSITION_UNAVAILABLE ou PositionError.TIMEOUT 
              $ionicLoading.hide();

              $ionicPopup.alert({
                title: 'Aviso GPS',
                content: '<div style="text-align: center"> Código ' + PositionError.code + '<br /> Mensagem: ' + PositionError.message +
                  ' <br /><hr/>Não foi possível obter a posição atual.Os sinais GPS são fracos ou o GPS foi desligado</div>'

              });


            }, posOptions);


          } else {

            //bootbox.alert('Nenhuma parada encontrada.');
            $ionicPopup.alert({
              title: 'Aviso',
              content: '<div style="text-align: center">Nenhuma parada encontrada.</div>'
            });
          }

        });
    }


  }


  $scope.CarregaMapa = function (TipoOnibus) {


    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    //> LOCALIZAÇÃO DO USUÁRIO NO MAPA
    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    var controlDiv = document.createElement('div');

    // Set CSS for the control border
    // <img id="pin_centro" src="img/pin_marker_70_70.png" alt="" class="img pin_centro invisivel" />
    var controlUI = document.createElement('img');
    controlUI.id = 'pin_centro'
    controlUI.src = 'img/novo_center_position_50_49.png';
    controlUI.addClass = 'img';

    controlDiv.appendChild(controlUI);

    controlDiv.addEventListener('click', function () {


      var posOptions = {
        maximumAge: 1000,
        timeout: 6000,
        enableHighAccuracy: true
      };


      navigator.geolocation.getCurrentPosition(function (pos) {

        $scope.lat = pos.coords.latitude;
        $scope.lng = pos.coords.longitude;

        if ($scope.lat != '' && $scope.lng != '') {

          map.setCenter(new google.maps.LatLng($scope.lat, $scope.lng));
          map.setZoom(15);
        }

      }, function (PositionError) {

        //code = 1
        //User denied Geolocation
        //PositionError.POSITION_UNAVAILABLE ou PositionError.TIMEOUT 
        //$ionicLoading.hide();

        if (PositionError.TIMEOUT) {

          $ionicPopup.alert({
            title: 'Aviso GPS',
            content: '<div style="text-align: center"> Código ' + PositionError.code + '<br /> Mensagem: ' + PositionError.message +
              ' <br /><hr/>Não foi possível obter a posição atual.Os sinais GPS são fracos ou o GPS foi desligado</div>'

          });

          $location.path('/app/pesquisaronibus/0/0/0');
          $scope.$apply();
          //$window.location.reload();
        }

      }, posOptions);

    });


    map.controls[google.maps.ControlPosition.RIGHT_CENTER].clear();
    map.controls[google.maps.ControlPosition.RIGHT_CENTER].push(controlDiv);



    Paradas.ParadasTipoOnibus(TipoOnibus)
      .then(function (paradas) {

        if (paradas.length > 0) {


          GeoMItinerarios.PosicoesGeograficas($scope.idLinha)
            .then(function (PosGeograficas) {


              var infowindow = new google.maps.InfoWindow({
                maxWidth: 900
              });


              for (i = 0; i < paradas.length; i++) {

                locations[i] = [paradas[i].nomeparada, paradas[i].lat, paradas[i].lng, paradas[i].id, paradas[i].marcada]

              }


              // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
              // >> LINHAS A PLOTAR.
              // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

              for (var p = 0; p < PosGeograficas.length; p++) {

                linhasPlotar.push({
                  lat: parseFloat(PosGeograficas[p].lat),
                  lng: parseFloat(PosGeograficas[p].lng)
                });
              }


              //var myLatlng = new google.maps.LatLng(parseFloat(trader.geo.lat),parseFloat(trader.geo.lon));

              var Poly = new google.maps.Polyline({
                map: map,
                path: linhasPlotar,
                geodesic: true,
                strokeColor: '#000',
                strokeOpacity: 2.0,
                strokeWeight: 4,
                editable: false
              });


              Poly.setMap(map);



              $scope.lat = sessionStorage.getItem('lat');
              $scope.lng = sessionStorage.getItem('lng');


              if ($scope.lat != '' && $scope.lng != '') {


                // marker = new google.maps.Marker({
                //     title: 'Sua localização',
                //     position: new google.maps.LatLng($scope.lat, $scope.lng),
                //     //map: map,
                //     icon: 'img/pin_marker_70_70.png',
                //     //animation: google.maps.Animation.BOUNCE, //BOUNCE DROP
                //     draggable: false //permite arrastar
                // });


                // To add the marker to the map, call setMap();
                //marker.setMap(map);

                //map.setCenter(new google.maps.LatLng(locations[locations.length - 1][1], locations[locations.length - 1][2]));
                map.setCenter(new google.maps.LatLng($scope.lat, $scope.lng));
                map.setZoom(15);



                var optionsCircle = {
                  // strokeColor: '#FF0000',
                  // strokeOpacity: 0.8,
                  // strokeWeight: 2,
                  // fillColor: '#FF0000',
                  // fillOpacity: 0.35,
                  strokeColor: '#FF0000',
                  strokeOpacity: 0.00001,
                  strokeWeight: 0,
                  //map: map,
                  center: new google.maps.LatLng($scope.lat, $scope.lng),
                  radius: 500, //in km -  default in meters.
                  editable: false, //permite editar
                  draggable: true, //permite arrastar
                }


                $scope.DeleteMarkers(markers);
                $scope.clearCircle(Circles);

                var Circle = new google.maps.Circle(optionsCircle);
                Circle.setMap(map);
                Circle.setVisible(false);

                Circles.push(Circle);


                map.addListener('dragend', function () {


                  var ne = Circle.getBounds().getNorthEast();
                  var sw = Circle.getBounds().getSouthWest();
                  var Radios = Circle.getRadius(); //in meters


                  var contentString = '<b>Informações Râio</b><br />' +
                    'NorthEast: ' + ne.lat() + ', ' + ne.lng() + '<br />' +
                    'SouthWest: ' + sw.lat() + ', ' + sw.lng() + '<br />' +
                    'Calculando raio em metros: ' + Radios + '<br/><br/>' +
                    '<b>Total paradas: </b>' + locations.length;



                  //map.setCenter(new google.maps.LatLng(sw.lat(), sw.lng()));
                  var CentroMapa = map.getCenter();
                  var CentroCircle = Circle.getCenter();
                  //var centroMarcador = marker.getPosition();
                  //var getBounds = map.getBounds();


                  map.setCenter(new google.maps.LatLng(CentroMapa.lat(), CentroMapa.lng()));
                  Circle.setCenter(new google.maps.LatLng(CentroMapa.lat(), CentroMapa.lng()));
                  //marker.setPosition(new google.maps.LatLng(CentroCircle.lat(), CentroCircle.lng()));
                  // Define an info window on the map.
                  //var infoWindow1 = new google.maps.InfoWindow();


                  // Set the info window's content and position.
                  // infoWindow1.setContent(contentString);
                  // infoWindow1.setPosition(ne);
                  // infoWindow1.open(map);


                  $scope.DeleteMarkers(markers);

                  //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
                  //> CARREGO AS PARADAS DENTRO DO Raio.
                  //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

                  for (i = 0; i < locations.length; i++) {

                    var Exibir = $scope.ExibeParada(Circle, locations[i][1], locations[i][2]);

                    if (Exibir) {

                      marker = new google.maps.Marker({
                        title: locations[i][0],
                        position: new google.maps.LatLng(locations[i][1], locations[i][2]),
                        map: map,
                        icon: 'img/Parada_azul_40.png',
                        draggable: false //permite arrastar
                      });


                      google.maps.event.addListener(marker, 'click', (function (marker, i) {
                        return function () {


                          // infowindow.setContent('<div><b>Nome Parada: </b>' + locations[i][0] +
                          //     '<br/>' + '<b>Lat:</b>' + locations[i][1] + '<br/>' + '<b>Lng:</b>' + locations[i][2] + '</div>');
                          // infowindow.open(map, marker);

                          $scope.lat = locations[i][1];
                          $scope.lng = locations[i][2];

                          sessionStorage.setItem('lat', $scope.lat);
                          sessionStorage.setItem('lng', $scope.lng);


                          //ENVIO O IDLINHA POR PARAMETRO.
                          $scope.IDparada = locations[i][3];

                          $location.path('app/listarlinhas/' + $scope.IDparada + '/' + TipoOnibus);
                          $scope.$apply();

                          //$state.go('login');

                        }

                      })(marker, i));


                      //Add marker to the array.
                      markers.push(marker);

                    }
                  }

                });

                $ionicLoading.hide();

              }

            });
        }



        //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< ::: ::: >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        //> LOCALIZO OS ONIBUS ONLINE.
        //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< ::: ::: >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        if ($scope.Placa != "0") {


          // $ionicLoading.show({
          //     template: '<div class="loader_pesquisa_onibus"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg>' +
          //     '<br/><span style=\"8px\">Pesquisando Ônibus..</span></div>'
          // });



          $ionicLoading.show({
            template: '<div class="loader_padrao">' +
              '<div class="col-xs-12">' +
              '<div class="col-xs-3 text-left"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>' +
              '<div class="col-xs-9 text-left"><span style="vertical-align: bottom;margin-top:45px;position:absolute; font-size:15px;">Pesquisando paradas..</span></div>' +
              '</div></div>'
          });


          //$scope.openModal_HorariosNGS();
          $scope.LocalizarOnibus($scope.Placa);

        }

      });

  }



  $scope.LocalizarOnibus = function (Placa) {


    var maximo = 0;
    var progresso = 0;
    var DistanciaVariavel = 0;


    var DataAtual = new Date();
    var Hora = DataAtual.getHours();
    var Min = DataAtual.getMinutes();
    var Segundo = DataAtual.getSeconds();
    var SemHorario = true;


    if (Min < 10) {

      Min = '0' + Min;

    } else {

      Min = Min + '';
    }

    if (Hora < 10) {

      Hora = '0' + Hora;

    } else {

      Hora = Hora + '';
    }

    var HoraAtual = Hora + ':' + Min + ':' + Segundo;

    // $scope.Itinerarios = HorariosItinerariosCigoApp.BuscarHorariosDoItinerario(idLinha);
    // if ($scope.Itinerarios.length > 0) {

    //     $scope.lstHorariosNGS[0].lstHorariosNGS;
    // }


    var TimeOut = 1 //segundos;
    var marker, i;
    var markers = [];


    // var tempoInicio = setInterval(function () {

    //     $ionicLoading.show({
    //         template: '<div class="loader_pesquisa_onibus"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg>' +
    //         '<br/><span style=\"8px\">Pesquisando Ônibus..</span></div>'
    //     });


    // }, 3000);


    // this.clearInterval(tempoInicio);



    //<<<<<<<<<<<<<<<<<<<< TENTO PEGAR O GPS DE PRIMERIRA >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    InvioSiga.BuscaDadosBancoGPS(Placa)
      .then(function (dadosGPs) {


        // $ionicLoading.show({
        //     template: '<div class="loader_pesquisa_onibus"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg>' +
        //     '<br/><span style=\"8px\">Pesquisando Ônibus..</span></div>'
        // });

        if (dadosGPs[0].DadosGps != null) {

          var Duracao = document.getElementById('lbDuration');
          if (Duracao != null) {

            Duracao.style.fontSize = '16px';
          }

          var DadosOnibus = dadosGPs[0].DadosGps
          var Result = dadosGPs[0];
          var isOnibusOnline = Result.DadosGps.componentes;



          if (DadosOnibus.CodRetorno == 0) {

            if (isOnibusOnline.estado == 1) {


              if (DadosOnibus.Velocidade != 0) {


                var origen = {
                  lat: parseFloat($scope.lat),
                  lng: parseFloat($scope.lng)
                };
                var destino = {
                  lat: DadosOnibus.Latitude,
                  lng: DadosOnibus.Longitude
                };



                $scope.DeleteMarkers(markers);

                marker = new google.maps.Marker({
                  title: 'localização',
                  position: new google.maps.LatLng(DadosOnibus.Latitude, DadosOnibus.Longitude),
                  map: map,
                  icon: 'img/onibus_frente_50_52.png',
                  //animation: google.maps.Animation.BOUNCE, //BOUNCE DROP
                  draggable: false //permite arrastar
                });

                var infowindow = new google.maps.InfoWindow({
                  maxWidth: 900
                });


                infowindow.setContent('<div><b>localização: </b>' + DadosOnibus.localizacao +
                  '<br /><b>Placa: </b>' + DadosOnibus.Placa +
                  '<br /><b>Velocidade: </b>' + DadosOnibus.Velocidade + ' Km/h' +
                  '<br /><b>Posição: </b> Ônibus Parado no momento' +
                  '</div>');


                infowindow.open(map, marker);

                markers.push(marker);


                // To add the marker to the map, call setMap();
                //marker.setMap(map);
                map.setCenter(new google.maps.LatLng(DadosOnibus.Latitude, DadosOnibus.Longitude));
                map.setZoom(15);


                var service = new google.maps.DistanceMatrixService;
                service.getDistanceMatrix({
                  origins: [origen],
                  destinations: [destino],
                  travelMode: google.maps.TravelMode.DRIVING,
                  unitSystem: google.maps.UnitSystem.METRIC,
                  avoidHighways: false,
                  avoidTolls: false

                }, function (response, status) {

                  if (status !== google.maps.DistanceMatrixStatus.OK) {

                    //alert('Gerou Erro: ' + status);

                    $ionicPopup.alert({
                      title: 'Gerou Erro:',
                      content: 'Status: ' + +status

                    });

                  } else {

                    var originList = response.originAddresses;
                    var destinationList = response.destinationAddresses;
                    var res = response.rows;


                    $.each(response.rows, function (key, value) {

                      //var results = value[i].elements;
                      var tempo = value.elements[0].duration;
                      var distancia = value.elements[0].distance;

                      $('#lbDuration')[0].innerHTML = tempo.text;
                      //$('#lbDistance')[0].innerText = distancia.text;


                      DistanciaVariavel = distancia.value;

                      var barra = document.getElementById("pg");

                      if (barra != null) {

                        // var valorAux = parseFloat(DistanciaVariavel / maximo);
                        // var valorAux1 = parseInt(valorAux - 1);
                        // barra.value = parseInt(valorAux1 * 100);
                        //var valorAux = parseFloat(DistanciaVariavel / maximo).toFixed(2);
                        console.log('primeriro valor ' + parseFloat(tempo.value / 60).toFixed(2));
                        barra.value = parseFloat(tempo.value / 60).toFixed(2);

                      }

                    });

                    $('.popTempoOnibus').removeClass('invisible');
                    //$('.Fundo').removeClass('invisible');

                    $ionicLoading.hide();

                  }
                });


              } else {


                $scope.DeleteMarkers(markers);

                marker = new google.maps.Marker({
                  title: 'localização',
                  position: new google.maps.LatLng(DadosOnibus.Latitude, DadosOnibus.Longitude),
                  map: map,
                  icon: 'img/onibus_frente_50_52.png',
                  //animation: google.maps.Animation.BOUNCE, //BOUNCE DROP
                  draggable: false //permite arrastar
                });

                var infowindow = new google.maps.InfoWindow({
                  maxWidth: 900
                });


                infowindow.setContent('<div><b>localização: </b>' + DadosOnibus.localizacao +
                  '<br /><b>Placa: </b>' + DadosOnibus.Placa +
                  '<br /><b>Velocidade: </b>' + DadosOnibus.Velocidade + ' Km/h' +
                  '<br /><b>Posição: </b> Ônibus Parado no momento' +
                  '</div>');

                infowindow.open(map, marker);

                markers.push(marker);
                $ionicLoading.hide();

                // $ionicPopup.alert({
                //     title: 'Aviso',
                //     content: '<div style="text-align: center">Ônibus parado no momento.</div>'
                // });
              }


            } else {

              $ionicLoading.hide();
              $scope.LimpaTimers();

              $ionicPopup.alert({
                title: 'Aviso',
                content: '<div style="text-align: center">Nenhum Ônibus disponivel no momento</div>'
              });

            }

          }

        } else {

          $ionicPopup.alert({
            title: 'Aviso',
            content: '<div style="text-align: center">Veiculo sem GPS no momento.</div>'
          });
        }


      });



    var TempoOnibus = setInterval(function () {

      InvioSiga.BuscaDadosBancoGPS(Placa)
        .then(function (dadosGPs) {


          // $ionicLoading.show({
          //     template: '<div class="loader_pesquisa_onibus"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg>' +
          //     '<br/><span style=\"8px\">Pesquisando Ônibus..</span></div>'
          // });


          var DadosOnibus = dadosGPs[0].DadosGps
          var Result = dadosGPs[0];
          var isOnibusOnline = Result.DadosGps.componentes;


          if (DadosOnibus.CodRetorno == 0) {

            if (isOnibusOnline.estado == 1) {


              if (DadosOnibus.Velocidade != 0) {


                var origen = {
                  lat: parseFloat($scope.lat),
                  lng: parseFloat($scope.lng)
                };
                var destino = {
                  lat: DadosOnibus.Latitude,
                  lng: DadosOnibus.Longitude
                };



                $scope.DeleteMarkers(markers);

                marker = new google.maps.Marker({
                  title: 'localização',
                  position: new google.maps.LatLng(DadosOnibus.Latitude, DadosOnibus.Longitude),
                  map: map,
                  icon: 'img/onibus_frente_50_52.png',
                  //animation: google.maps.Animation.BOUNCE, //BOUNCE DROP
                  draggable: false //permite arrastar
                });


                var infowindow = new google.maps.InfoWindow({
                  maxWidth: 900
                });


                infowindow.setContent('<div><b>localização: </b>' + DadosOnibus.localizacao +
                  '<br /><b>Placa: </b>' + DadosOnibus.Placa +
                  '<br /><b>Velocidade: </b>' + DadosOnibus.Velocidade + ' Km/h' +
                  '</div>');

                infowindow.open(map, marker);

                markers.push(marker);


                // To add the marker to the map, call setMap();
                //marker.setMap(map);
                map.setCenter(new google.maps.LatLng(DadosOnibus.Latitude, DadosOnibus.Longitude));
                map.setZoom(15);


                var service = new google.maps.DistanceMatrixService;
                service.getDistanceMatrix({
                  origins: [origen],
                  destinations: [destino],
                  travelMode: google.maps.TravelMode.DRIVING,
                  unitSystem: google.maps.UnitSystem.METRIC,
                  avoidHighways: false,
                  avoidTolls: false

                }, function (response, status) {

                  if (status !== google.maps.DistanceMatrixStatus.OK) {

                    //alert('Gerou Erro: ' + status);

                    $ionicPopup.alert({
                      title: 'Gerou Erro:',
                      content: 'Status: ' + +status

                    });

                  } else {

                    var originList = response.originAddresses;
                    var destinationList = response.destinationAddresses;
                    var res = response.rows;


                    $.each(response.rows, function (key, value) {

                      //var results = value[i].elements;
                      var tempo = value.elements[0].duration;
                      var distancia = value.elements[0].distance;

                      $('#lbDuration')[0].innerHTML = tempo.text;
                      //$('#lbDistance')[0].innerText = distancia.text;

                      DistanciaVariavel = distancia.value;


                      var barra = document.getElementById("pg");

                      if (barra != null) {

                        // var valorAux = parseFloat(DistanciaVariavel / maximo);
                        // var valorAux1 = parseInt(valorAux - 1);
                        // barra.value = parseInt(valorAux1 * 100);

                        //console.log('maximo ' + maximo);
                        console.log('DistanciaVariavel ' + DistanciaVariavel);


                        // var valorAux = parseFloat(DistanciaVariavel / maximo).toFixed(2);
                        // barra.value = parseInt(valorAux * 100);
                        var teste = tempo.text.split(' ');
                        var vlr1 = teste[0];
                        var vlr2 = teste[1];

                        console.log('vlr1 ' + vlr1);
                        console.log('vlr2 ' + vlr2);

                        console.log('tempo Min ' + tempo.text);
                        console.log('tempo Segundos ' + tempo.value);


                        console.log('Valor Barra ' + parseFloat(tempo.value) / 60);
                        barra.value = parseFloat(tempo.value / 60);

                      }



                      $('.popTempoOnibus').removeClass('invisible');
                      //$('.Fundo').removeClass('invisible');

                      $ionicLoading.hide();

                      //180000 =  3MIN
                      //600000 =  10MIN
                      //1800000 = 30MIN
                      if (tempo.value <= 180000) {

                        $ionicLoading.hide();
                        $scope.LimpaTimers();

                        $('.popTempoOnibus').addClass('invisible');
                        $('.Fundo').addClass('invisible');
                        $('.pop_chegada_onibus').removeClass('invisible');


                        //AVISO DE CHEGADA.
                        navigator.notification.beep(1);
                        navigator.notification.vibrate(2000);

                      }

                    });

                  }
                });


              } else {


                $scope.DeleteMarkers(markers);

                marker = new google.maps.Marker({
                  title: 'localização',
                  position: new google.maps.LatLng(DadosOnibus.Latitude, DadosOnibus.Longitude),
                  map: map,
                  icon: 'img/onibus_frente_50_52.png',
                  //animation: google.maps.Animation.BOUNCE, //BOUNCE DROP
                  draggable: false //permite arrastar
                });

                var infowindow = new google.maps.InfoWindow({
                  maxWidth: 900
                });


                infowindow.setContent('<div><b>localização: </b>' + DadosOnibus.localizacao +
                  '<br /><b>Placa: </b>' + DadosOnibus.Placa +
                  '<br /><b>Velocidade: </b>' + DadosOnibus.Velocidade + ' Km/h' +
                  '<br /><b>Posição: </b> Ônibus Parado no momento' +
                  '</div>');

                infowindow.open(map, marker);

                markers.push(marker);
                $ionicLoading.hide();

                // $ionicPopup.alert({
                //     title: 'Aviso',
                //     content: '<div style="text-align: center">Ônibus parado no momento.</div>'
                // });
              }


            } else {

              $ionicLoading.hide();

              $scope.LimpaTimers();

              $ionicPopup.alert({
                title: 'Aviso',
                content: '<div style="text-align: center">Nenhum Ônibus disponivel no momento</div>'
              });

            }

          } else {

            // $ionicLoading.show({
            //     template: '<div class="loader_pesquisa_onibus"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg>' +
            //     '<br/><span style=\"8px\">Pesquisando Ônibus..</span></div>'
            // });

            console.log('TimeOut ' + TimeOut);

            TimeOut += 1;

            if (TimeOut == 60) {

              TimeOut = 1;
              $ionicLoading.hide();
              //$scope.LimpaTimers();

              $ionicPopup.alert({
                title: 'Conexão perdida',
                content: '<div style="text-align: center"> Ops, Verifique sua conexão de internet e tente novamente.</div>'
              });


            }
          }

        });


    }, 20000);

  }


  $scope.idLinha = $stateParams.idLinha;
  $scope.Placa = $stateParams.Placa;
  $scope.TipoOnibus = $stateParams.TipoOnibus;

  if ($scope.idLinha != "0" && $scope.Placa != "0" && $scope.TipoOnibus != "0") {

    $scope.CarregaMapa($scope.TipoOnibus);


  } else {


    $scope.IniciaMapa(2);

    // map.addListener('dragend', function () {

    //             $('.pin_centro')
    //                 .show(900);
    //             //markerUser.setPosition(new google.maps.LatLng(map.getCenter().lat(), map.getCenter().lng()));

    //         });

  }

});


control.controller('CtrlInicio', function ($scope, $ionicModal, $ionicPopup, $timeout, $location, $window) {


  var ExibeTelaInicio = window.localStorage.getItem("ExibeTelaInicio");

  $scope.hideNavBar = true;

  //var path = $location.path();
  //$ionicNavBarDelegate.showBar(false);
  //$ionicNavBarDelegate.showBackButton(false);
  //$ionicNavBarDelegate.title('Pagina de inicio');

  //alert(ExibeTelaInicio);

  //só exibe tela primeira vez;
  if (ExibeTelaInicio != null) {

    $location.path('/app/contratolicenca');
    $scope.$apply();

    // $location.path('/app/pesquisaronibus/0/0/0');
    // $window.location.reload();
  }


  $scope.avancar = function () {

    window.localStorage.setItem("ExibeTelaInicio", false);
    //$location.url('/app/pesquisaronibus');
    $location.path('/app/pesquisaronibus/0/0');
    $window.location.reload();
    //window.location.reload()
  }

});


control.controller('CtrlMapearParada', function ($scope, $http, $ionicPopup, $location, $window, $cordovaSQLite, $cordovaGeolocation) {


  $scope.nome_parada = "";
  $scope.num_parada = "";
  $scope.lat = "";
  $scope.lng = "";
  $scope.endereco = "";

  var lat = "";
  var lng = "";


  $scope.MarcarParada = function () {


    // var posOptions = { maximumAge: 3000, timeout: 5000, enableHighAccuracy: true };
    // //var posOptions = { timeout: 10000, enableHighAccuracy: false };

    // $cordovaGeolocation.getCurrentPosition(posOptions)
    //     .then(function (pos) {

    //         lat = pos.coords.latitude;
    //         lng = pos.coords.longitude;

    //         $scope.lat = lat;
    //         $scope.lng = lng;


    //         var alertPopup = $ionicPopup.alert({
    //             title: '<b>Aviso</b>',
    //             template: '<div style="text-align: center">lat ' + lat + '<br/>lng' + lng + '</div>'
    //         });


    //         //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    //         // PEGO ENDEREÇO GOOGLE
    //         //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    //         // var KEY = "AIzaSyCBHryrxomgmV37WxLY6uGY1YdpMpUXyRY";
    //         // var latlng = lat + "," + lng;
    //         // var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + latlng + "&sensor=true&key" + KEY;


    //         // $http.get(url)
    //         //     .success(function (data, status, headers, config) {

    //         //         for (var i = 0; i < data.results.length; i++) {

    //         //             if (data.results[i].types[0] == "street_address") {

    //         //                 var adress = data.results[i].formatted_address;
    //         //                 $scope.endereco = adress;

    //         //                 // var alertPopup = $ionicPopup.alert({
    //         //                 //     title: '<b>Endereco</b>',
    //         //                 //     template: '<div style="text-align: center">' + adress + '</div>'
    //         //                 // });

    //         //             }
    //         //         }
    //         //     })
    //         //     .catch(function (error) {

    //         //         $ionicPopup.alert({
    //         //             title: '<b>Erro Google</b>',
    //         //             template: '<div style="text-align: center"> Código ' + error.code + '<br/> Mensagem: ' + error.message + '</div>'
    //         //         });

    //         //     });


    //     }, function (error) {

    //         $ionicPopup.alert({
    //             title: 'Erro GPS',
    //             template: '<div style="text-align: center"> Código ' + error.code + '<br/> Mensagem: ' + error.message + '</div>'
    //         });

    //         //bootbox.alert('Erro ' + error);
    //     });


    navigator.geolocation.getCurrentPosition(function (pos) {

      $scope.lat = pos.coords.latitude;
      $scope.lng = pos.coords.longitude;

      var alertPopup = $ionicPopup.alert({
        title: '<b>Aviso</b>',
        template: '<div style="text-align: center">lat ' + $scope.lat + '<br/>lng' + $scope.lng + '</div>'
      });

    }, function (error) {

      $ionicPopup.alert({
        title: 'Erro GPS',
        template: '<div style="text-align: center"> Código ' + error.code + '<br/> Mensagem: ' + error.message + '</div>'
      });

    }, {
      maximumAge: 3000,
      timeout: 5000,
      enableHighAccuracy: true
    });


    //>>>>>>>>>>>>>>> // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    // var posOptions = { maximumAge: 3000, timeout: 5000, enableHighAccuracy: true };
    // $cordovaGeolocation.getCurrentPosition(posOptions)
    //     .then(function (pos) {

    //         $scope.lat = pos.coords.latitude;
    //         $scope.lng = pos.coords.longitude;

    //         var alertPopup = $ionicPopup.alert({
    //             title: '<b>Aviso</b>',
    //             template: '<div style="text-align: center">lat ' + $scope.lat + '<br/>lng' + $scope.lng + '</div>'
    //         });

    //     }, function (error) {

    //         $ionicPopup.alert({
    //             title: 'Erro GPS',
    //             template: '<div style="text-align: center"> Código ' + error.code + '<br/> Mensagem: ' + error.message + '</div>'
    //         });

    //         //bootbox.alert('Erro ' + error);
    //     });

  };


  $scope.insert = function () {

    var query = "INSERT INTO paradas (nomeparada, numparada, lat, lng, endereco) VALUES (?,?,?,?,?)";

    var nomeparada = "Parada-1";
    var numparada = 97;
    var lat = "-22.555";
    var lng = "-50.666";
    var endereco = "rua Teste";

    var values = [nomeparada, numparada, lat, lng, endereco];

    $cordovaSQLite.execute(db, query, values)
      .then(function (res) {

        alertPopup = $ionicPopup.alert({
          title: '<b>Aviso</b>',
          template: '<div style="text-align: center">' + "INSERT ID -> " + res.insertId + '</div>'
        });

        //console.log("INSERT ID -> " + res.insertId);
      }, function (err) {

        alertPopup = $ionicPopup.alert({
          title: '<b>Aviso</b>',
          template: '<div style="text-align: center">' + "INSERT ID -> " + err.code + '</br>' + err.message + '</div>'
        });

        // console.error(err);
      });
  }


  $scope.select = function () {


    var query = "SELECT * FROM paradas";

    $cordovaSQLite.execute(db, query, [])
      .then(function (res) {

        if (res.rows.length > 0) {

          for (var i = 0; res.rows.length; i++) {

            $ionicPopup.alert({
              title: '<b>Aviso</b>',
              template: 'Parada: ' + res.rows.item(i).nomeparada + '<br/>' + 'Nro Parada: ' + res.rows.item(i).numparada +
                '<br/>' + ':lat ' + res.rows.item(i).lat + '<br/>' + 'lng: ' + res.rows.item(i).lng + '<br/>' + 'Endereço: ' + res.rows.item(i).endereco
            });

          }

          alertPopup = $ionicPopup.alert({
            title: '<b>Aviso</b>',
            template: '<div style="text-align: center">' + "SELECTED -> " + res.rows.item(1).nomeparada + " </br> Total " + res.rows.length + '</div>'
          });

          //console.log("SELECTED -> " + res.rows.item(0).firstname + " " + res.rows.item(0).lastname);

          //================================ TABELA DE PARADAS ===================================

          //  $.each(res.rows, function (index) {

          //     var row = res.rows.item(index);

          //     alertPopup = $ionicPopup.alert({
          //         title: '<b>Aviso</b>',
          //         template: 'Nome' + row.firstname
          //     });

          // });


        } else {

          alertPopup = $ionicPopup.alert({
            title: '<b>Aviso</b>',
            template: '<div style="text-align: center">Nenhum resultado</div>'
          });

          //console.log("No results found");
        }

      }, function (err) {

        alertPopup = $ionicPopup.alert({
          title: '<b>Aviso</b>',
          template: '<div style="text-align: center">' + err.code + '</br>' + err.message + '</div>'
        });

        //console.error(err);
      });
  }


  $scope.Gravar = function () {

    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    // DADOS DO BD
    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    var query = "INSERT INTO paradas (nomeparada, numparada, lat, lng, endereco) VALUES (?,?,?,?,?)";

    var nomeparada = $scope.nome_parada;
    var numparada = $scope.num_parada;
    var lat = $scope.lat;
    var lng = $scope.lng;
    var endereco = $scope.endereco;

    var values = [nomeparada, numparada, lat, lng, endereco];

    $cordovaSQLite.execute(db, query, values)
      .then(function (res) {

        alertPopup = $ionicPopup.alert({
          title: '<b>Aviso</b>',
          template: '<div style="text-align: center">' + "Dados Gravados com sucesso ID-> " + res.insertId + '</div>'
        });


        //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        //> LIMPANDO OS CAMPOS
        //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        $scope.nome_parada = "";
        $scope.num_parada = "";
        $scope.lat = "";
        $scope.lng = "";
        $scope.endereco = "";

        //console.log("INSERT ID -> " + res.insertId);

      }, function (err) {

        alertPopup = $ionicPopup.alert({
          title: '<b>Aviso</b>',
          template: '<div style="text-align: center">' + "ERRO -> " + err.code + '</br>' + err.message + '</div>'
        });

        // console.error(err);
      });
  }

});


control.controller('CtrlConsultarParadas', function ($scope, $http, $ionicPopup, $ionicLoading, $location, $window, $cordovaSQLite) {

  $scope.nroID = "";
  var paradas = [];

  var paradass = [

    {
      id: 1,
      nomeparada: 'Canoas lassale',
      nroparada: 1,
      lat: '-29.9149604',
      lng: '-51.193061',
      endereco: 'R.Machado de Assis, 37-Harmonia,Canoas - RS,Brasil'
    },
    {
      id: 2,
      nomeparada: 'Canoas lassale',
      nroparada: 1,
      lat: '-29.9149604',
      lng: '-51.193061',
      endereco: 'R.Machado de Assis, 37-Harmonia,Canoas - RS,Brasil'
    },
    {
      id: 3,
      nomeparada: 'Canoas lassale',
      nroparada: 1,
      lat: '-29.9149604',
      lng: '-51.193061',
      endereco: 'R.Machado de Assis, 37-Harmonia,Canoas - RS,Brasil'
    },
    {
      id: 4,
      nomeparada: 'Canoas lassale',
      nroparada: 1,
      lat: '-29.9149604',
      lng: '-51.193061',
      endereco: 'R.Machado de Assis, 37-Harmonia,Canoas - RS,Brasil'
    },
    {
      id: 5,
      nomeparada: 'Canoas lassale',
      nroparada: 1,
      lat: '-29.9149604',
      lng: '-51.193061',
      endereco: 'R.Machado de Assis, 37-Harmonia,Canoas - RS,Brasil'
    },
    {
      id: 6,
      nomeparada: 'Canoas lassale',
      nroparada: 1,
      lat: '-29.9149604',
      lng: '-51.193061',
      endereco: 'R.Machado de Assis, 37-Harmonia,Canoas - RS,Brasil'
    }
  ]


  $scope.select = function () {


    var lbTotal = $("#lbTotal")[0];
    $("#tbParadas").empty();

    var tbParadas = $("#tbParadas")[0];
    var html = "";

    html += "<tr class=\"success\"  style=\"font-size:10px\">";
    //html += "<td>ID</td>";
    html += "<td>Nome Parada</td>";
    //html += "<td>Nro Parada</td>";
    html += "<td>Lat</td>";
    html += "<td>Lng</td>";
    //html += "<td>End.</td>";
    html += "</tr>";

    // for (var i = 0; Paradas.length; i++) {

    //     html += "<tr>";
    //     html += "<td>" + Paradas[i].id + "</td>";
    //     html += "<td>" + Paradas[i].nomeparada + "</td>";
    //     html += "<td>" + Paradas[i].numparada + "</td>";
    //     html += "</tr>";

    //      tbParadas.innerHTML = html;

    // }

    var query = "SELECT * FROM paradas";
    $cordovaSQLite.execute(db, query, [])
      .then(function (res) {

        $scope.paradas = res;

        lbTotal.innerHTML = '<b>Total Paradas Mapeadas:&nbsp</b>' + res.rows.length;

        if (res.rows.length > 0) {

          for (var i = 0; res.rows.length; i++) {

            var row = res.rows.item(i);

            html += "<tr style=\"font-size:10px\">";
            //html += "<td>" + res.rows.item(i).id + "</td>";
            html += "<td>" + row['nomeparada'] + "</td>";
            //html += "<td>" + row['numparada'] + "</td>";
            html += "<td>" + row['lat'] + "</td>";
            html += "<td>" + row['lng'] + "</td>";
            //html += "<td>" + row['endereco'] + "</td>";
            html += "</tr>";

            tbParadas.innerHTML = html;

            // $('#divparada').append("<li class=\"item\">" + "ID: " + row['id']
            //     + "  " + " Nome Par." + row['nomeparada'] + "  " + "Nro Par:" + row['numparada'] + "  " + "lat:" + row['lat'] + "  " + "lng:" + row['lng'] + "</li>");

          }

          //$("#lbTotal")[0].innerText = res.rows.length;

          //  $.each(res.rows, function (index) {

          //     var row = res.rows.item(index);

          //     alertPopup = $ionicPopup.alert({
          //         title: '<b>Aviso</b>',
          //         template: 'Nome' + row.firstname
          //     });

          // });


        } else {

          alertPopup = $ionicPopup.alert({
            title: '<b>Aviso</b>',
            template: '<div style="text-align: center">Nenhum resultado</div>'
          });

          //console.log("No results found");
        }

      }, function (err) {

        alertPopup = $ionicPopup.alert({
          title: '<b>Erro SQLite</b>',
          template: '<div style="text-align: center">' + err.code + '</br>' + err.message + '</div>'
        });

        //console.error(err);
      });

  }


  $scope.apagar = function () {

    var id = $scope.nroID;

    var query = "DELETE FROM paradas WHERE id = ?";
    $cordovaSQLite.execute(db, query, [id])
      .then(function (res) {

        alertPopup = $ionicPopup.alert({
          title: '<b>Aviso</b>',
          template: '<div style="text-align: center">Parada Excluida</div>'
        });


        //>>>>>>>>>>>>>> CARREGO A CONSULTA >>>>>>>>>>>>>>>>>>
        var lbTotal = $("#lbTotal")[0];
        $("#tbParadas").empty();

        var tbParadas = $("#tbParadas")[0];
        var html = "";

        html += "<tr class=\"success\">";
        html += "<td>ID</td>";
        html += "<td>Nome Parada</td>";
        html += "<td>Nro Parada</td>";
        html += "<td>Lat</td>";
        html += "<td>Lng</td>";
        html += "</tr>";

        // for (var i = 0; Paradas.length; i++) {

        //     html += "<tr>";
        //     html += "<td>" + Paradas[i].id + "</td>";
        //     html += "<td>" + Paradas[i].nomeparada + "</td>";
        //     html += "<td>" + Paradas[i].numparada + "</td>";
        //     html += "</tr>";

        //      tbParadas.innerHTML = html;

        // }

        var query = "SELECT * FROM paradas";
        $cordovaSQLite.execute(db, query, [])
          .then(function (res) {

            $scope.paradas = res;

            lbTotal.innerHTML = '<b>Total Paradas Mapeadas:&nbsp</b>' + res.rows.length;

            if (res.rows.length > 0) {

              for (var i = 0; res.rows.length; i++) {

                var row = res.rows.item(i);

                html += "<tr>";
                html += "<td>" + res.rows.item(i).id + "</td>";
                html += "<td>" + row['nomeparada'] + "</td>";
                html += "<td>" + row['numparada'] + "</td>";
                html += "<td>" + row['lat'] + "</td>";
                html += "<td>" + row['lng'] + "</td>";
                html += "</tr>";

                tbParadas.innerHTML = html;

              }

            } else {

              alertPopup = $ionicPopup.alert({
                title: '<b>Aviso</b>',
                template: '<div style="text-align: center">Nenhum resultado</div>'
              });

              //console.log("No results found");
            }

          }, function (err) {

            alertPopup = $ionicPopup.alert({
              title: '<b>Aviso</b>',
              template: '<div style="text-align: center">' + err.code + '</br>' + err.message + '</div>'
            });

            //console.error(err);
          });


      }, function (err) {

        alertPopup = $ionicPopup.alert({
          title: '<b>Aviso</b>',
          template: '<div style="text-align: center">' + err.code + '</br>' + err.message + '</div>'
        });

        //console.error(err);
      });

  }


  $scope.ExportarParadas = function () {


    var url = "http://localhost:8044/CigoApp.Integracao/Home/PostExportaDados";
    var urlRemota = "http://integracaocigoapp.arrobatecinformatica.com.br/Home/PostExportaDados";

    var urlServico = "http://localhost:8044/CigoApp.Integracao/api/IntegracaoCigoApp/";
    var urlRemotaServico = "http://integracaocigoapp.arrobatecinformatica.com.br/api/IntegracaoCigoApp/";



    $ionicLoading.show({
      template: '<div class="loader">Aguarde... <br/><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>'
    });


    $http.post(urlRemotaServico, JSON.stringify(paradass))
      .success(function (data, status, headers, config) {

        $ionicLoading.hide();

        var dados = JSON.parse(data);

        if (dados.Erro != '') {

          alertPopup = $ionicPopup.alert({
            title: '<b>Aviso</b>',
            template: '<div style="text-align: center">' + dados.Erro + '</div>'
          });

        } else {

          alertPopup = $ionicPopup.alert({
            title: '<b>Aviso</b>',
            template: '<div style="text-align: center">' + dados.Msg + '</div>'
          });
        }

      })
      .catch(function (Erro) {

        alertPopup = $ionicPopup.alert({
          title: '<b>Erro Exportar</b>',
          template: '<div style="text-align: center">' + Erro.code + '</br>' + Erro.message + '</div>'
        });

      });


    var query = "SELECT * FROM paradas";
    $cordovaSQLite.execute(db, query, [])
      .then(function (res) {

        if (res.rows.length > 0) {

          for (var i = 0; res.rows.length; i++) {

            var row = res.rows.item(i);

            var item = {
              id: 0,
              nomeparada: row['nomeparada'],
              nroparada: row['numparada'],
              lat: row['lat'],
              lng: row['lng'],
              endereco: row['endereco']
            };

            paradas.push(item);

          }

        } else {

          alertPopup = $ionicPopup.alert({
            title: '<b>Aviso</b>',
            template: '<div style="text-align: center">Nenhum resultado</div>'
          });

        }


      }, function (err) {

        alertPopup = $ionicPopup.alert({
          title: '<b>Erro SQLite</b>',
          template: '<div style="text-align: center">' + err.code + '</br>' + err.message + '</div>'
        });

        //console.error(err);
      });



    if (paradas.length > 0) {


      alertPopup = $ionicPopup.alert({
        title: '<b>Aviso</b>',
        template: '<div style="text-align: center">Total Registros: ' + paradas.length + '</div>'
      });


      paradas.length = 0;
    }

  }
});



control.controller('CtrlErro', function ($scope, $timeout, $ionicPopup, $ionicLoading, $ionicModal) {

  $scope.erroInternet = "Falha na Conexão de Internet";

});



control.controller('CtrlListaLinhas', function ($scope, $timeout, $ionicModal, $ionicPopup, $ionicLoading, $window, $location, HorariosItinerariosCigoApp, GeoMItinerarios, $stateParams) {


  // $ionicLoading.show({
  //     template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>'
  // });


  $ionicLoading.show({
    template: '<div class="loader_padrao">' +
      '<div class="col-xs-12">' +
      '<div class="col-xs-3 text-left"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>' +
      '<div class="col-xs-9 text-left"><span style="vertical-align: bottom;margin-top:45px;position:absolute; font-size:15px;">Pesquisando paradas..</span></div>' +
      '</div></div>'
  });



  var IDParada = $stateParams.idParada;
  var TipoOnibus = $stateParams.TipoOnibus;

  var cbolinhas = $('#cbolinhas');
  $scope.lstLinhasAux = new Array();


  if (IDParada != "") {

    //alert('o Id da Linha ' + IDParada);
    //SEMPRE INFORMAR IDPARADA
    //963,964,965 930
    HorariosItinerariosCigoApp.BuscarItinerariosidParada(IDParada)
      .then(function (HorariosItinerarios) {

        $scope.lstLinhas = HorariosItinerarios;
        $scope.lstTodasLinhas = HorariosItinerarios;

        $ionicLoading.hide();

        //cbolinhas
        //    .empty()
        //    .append('<option value=""></option>');


        // $.each(data, function (key, value) {

        //     cbolinhas.append('<option id="' + key + '" value="' + value.cpfcnpj.Valor + '">' + value.Nome.Valor + '</option>');
        // });

        //cbolinhas.selectToAutocomplete();

      });

  }


  $scope.PesquisaOnibus = function (item) {

    if (item.dspesquisar != undefined) {

      $scope.lstLinhasAux.length = 0


      for (var i = 0; i < $scope.lstTodasLinhas.length; i++) {

        if ($scope.lstTodasLinhas[i].Nome.includes(item.dspesquisar.toUpperCase())) {

          $scope.lstLinhasAux.push($scope.lstTodasLinhas[i]);
        }

      }

      $scope.lstLinhas = $scope.lstLinhasAux
    }
  }


  $scope.buscarHorariosNGSTab = function (item) {

    if (item != null) {

      if (item.Nome != '') {

        $scope.IDLinha = item.idlinha;
        //$scope.lstHorariosNGS = item.lstHorariosNGS;
        $location.path('app/listarhorarios/' + IDParada + '/' + $scope.IDLinha + '/' + TipoOnibus);
        //$scope.$apply();

      }

    }
  };


});


control.controller('CtrlListarHorarios', function ($scope, $timeout, $ionicModal, $ionicPopup, $ionicLoading, $window, $location, HorariosItinerariosCigoApp, GeoMItinerarios, $stateParams) {



  var IDLinha = $stateParams.idLinha;
  var IDParada = $stateParams.idParada;
  var TipoOnibus = $stateParams.TipoOnibus;

  var DataAtual = new Date();
  var Hora = DataAtual.getHours();
  var Min = DataAtual.getMinutes();
  var Segundo = DataAtual.getSeconds();
  var SemHorario = true;


  if (Min < 10) {

    Min = '0' + Min;

  } else {

    Min = Min + '';
  }

  if (Hora < 10) {

    Hora = '0' + Hora;

  } else {

    Hora = Hora + '';
  }


  $scope.HoraAtual = Hora + ':' + Min + ':' + Segundo;



  $scope.HorarioSelecionado = function (item) {

    $location.path('app/pesquisaronibus/' + item.idlinha + '/' + item.Placa + '/' + TipoOnibus);
    $window.location.reload(true);
    //$scope.$apply();

  }


  $scope.lstHorariosNGSValidos = new Array();

  $scope.Itinerarios = HorariosItinerariosCigoApp.BuscarHorariosDoItinerario(IDLinha);
  if ($scope.Itinerarios.length > 0) {

    $scope.lstHorariosNGS = $scope.Itinerarios[0].lstHorariosNGS;

    if ($scope.lstHorariosNGS.length > 0) {

      for (h = 0; h < $scope.lstHorariosNGS.length; h++) {

        //if ($scope.lstHorariosNGS[h].HorarioSaida >= $scope.HoraAtual) {

        $scope.lstHorariosNGSValidos.push($scope.lstHorariosNGS[h]);
        //}
      }

    } else {


      $('#divTableHorarios')
        .addClass('invisivel')
        .hide(800);

      $('#divAviso')
        .removeClass('hide')
        .show(1000);

      $ionicPopup.alert({
        title: 'Aviso',
        content: '<div style="text-align: center">Nenhum horário encontrado para este Itinerário.</div>'
      });
    }

  } else {

    $ionicPopup.alert({
      title: 'Aviso',
      content: '<div style="text-align: center">Nenhum Itinerário encontrado.</div>'
    });
  }

});


control.controller('CtrlSobre', function ($scope, $timeout, $ionicPopup, $ionicLoading, $ionicModal) {


});


control.controller('CtrlReportarInformacoes', function ($scope, $timeout, $ionicPopup, $ionicLoading, $ionicModal) {


});


control.controller('CtrlSelecionarTipoLinha', function ($scope, $timeout, $ionicPopup, $ionicLoading, $ionicModal, $location) {


  $scope.hideNavBar = true;

  //$scope.hideBackButton = false;
  //$ionicNavBarDelegate.showBackButton(true);

  $scope.Municipal = function () {

    $location.path('/app/pesquisaronibus/0/0');
    //$window.location.reload();
    $scope.$apply();

  };

  $scope.InterMunicipal = function () {

    $location.path('/app/pesquisaronibus/0/0');
    $window.location.reload();
    //$scope.$apply();

  };

});



//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//> LOGIN COM REDES SOCIAIS.
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
control.controller('ctrlLoginRedeSocial', function ($scope, $http, $window, $ionicPopup, $ionicLoading, $ionicModal, $location, $cordovaOauth) {



  $scope.LoginwithFacebook = function () {


    var CLIENT_ID_HERE = "1675826866051617";

    $cordovaOauth.facebook(CLIENT_ID_HERE, ["email", "public_profile"])
      .then(function (result) {

        $scope.showProfile = false;

        if (result != '') {

          $http.get("https://graph.facebook.com/v2.2/me", {
            params: {
              access_token: result.access_token
            }

          }).then(function (res) {

            $ionicPopup.alert({
              title: 'Aviso',
              content: '<div style="text-align: center">Usuário(a) ' + res.data.name +
                '<br />autenticado com sucesso.</div>'
            });

            //bootbox.alert('Usuário ' + JSON.stringify(res.data));
            //bootbox.alert('Usuário ' + res.data.name + ' autenticado com sucesso');

            $location.path('/app/reportarinformacoes');
            //$scope.$apply();
            $window.location.reload()


          }, function (error) {

            $ionicPopup.alert({
              title: 'Aviso',
              content: '<div style="text-align: center"><br />' +
                'There was a problem getting your profile.  Check the logs for details. </div><br />' +
                error
            });

            //alert("There was a problem getting your profile.  Check the logs for details.");
            //bootbox.alert('Erro ' + error);

          });
        }

      }, function (error) {

        //bootbox.alert("Falha na Autenticação \n" + error);
        alert("Auth Failed..!!" + error);

      });
  };


  $scope.LoginwithGoogle = function () {


    var CLIENT_ID = "240693687793-6i69fi8n50esu88u6nh3undf63dahji5.apps.googleusercontent.com";
    var CHEVE_SECRETA = "jPPMGv9eszGuwdfDaEWfl_4R";

    $cordovaOauth.google(CLIENT_ID, ["email", "profile"])
      .then(function (result) {

        if (result != '') {

          $scope.showProfile = false;

          $http.get("https://www.googleapis.com/plus/v1/people/me", {
            params: {
              access_token: result.access_token
            }
          }).then(function (res) {

            // $scope.showProfile = true;
            // $scope.details = res.data;

            alert('Usuário ' + res.data.displayName + ' autenticado com sucesso');

            $location.path('/app/reportarinformacoes');
            //$scope.$apply();
            $window.location.reload()

            //bootbox.alert('Dados I' + JSON.stringify(res.data.emais));

            //bootbox.alert('Nome' + res.data.displayName);
            //window.localStorage.setItem("email", res.data.displayName);
            //$location.url('/');


          }, function (error) {

            alert("Error: " + error);

          });


        } else {

          alert('Usuário ou  Senha Inválidos!');

        }

      }, function (error) {

        alert('Erro ' + error);
        //console.log('Erro ' + error);
      });
  }


  $scope.LoginLocal = function () {


    // if ($scope.email != undefined && $scope.senha != undefined) {

    //   LogarEmpresa.logar($scope.email, $scope.senha)
    //     .then(function (logado) {

    //       if (logado) {

    //         //bootbox.alert('Usuário ' + $scope.email + ' \n autenticado com sucesso.');
    //         window.localStorage.setItem("email", $scope.email);

    //         $location.path('/app/pesquisaronibus/0/0/0');
    //         $scope.$apply();


    //       } else {

    //         //bootbox.alert('Usuário ou  Senha Inválidos!');
    //       }
    //     });

    // } else {

    //   //bootbox.alert('É necessário informar Usuário e Senha.');
    // }

  };


});


control.controller('ctrlContratoLicenca', function ($scope, $timeout, $ionicPopup, $ionicLoading, $ionicModal, $location, $window) {

  $scope.hideNavBar = true;


  var ExibeTelaInicio = window.localStorage.getItem("ExibeTelaInicio");

  $scope.hideNavBar = true;

  //var path = $location.path();
  //$ionicNavBarDelegate.showBar(false);
  //$ionicNavBarDelegate.showBackButton(false);
  //$ionicNavBarDelegate.title('Pagina de inicio');

  //alert(ExibeTelaInicio);

  //só exibe tela primeira vez;
  if (ExibeTelaInicio != null) {

    // $location.path('/app/contratolicenca');
    // $scope.$apply();

    $location.path('/app/pesquisaronibus/0/0/0');
    $window.location.reload();
  }


  $scope.Avanca = function () {

    window.localStorage.setItem("ExibeTelaInicio", false);

    //$location.url('/app/pesquisaronibus');
    $location.path('/app/inicio');
    //$window.location.reload();
    $scope.$apply();
  }

});


//>>>>>>>>>>>>>>>>>>>>> :: FUNÇÕES :: >>>>>>>>>>>>>>>>>>>>>>>>>>
function toggleBounce(marker) {

  if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
  } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
  }
}



function trim(vlr) {

  while (vlr.indexOf(" ") != -1) {
    vlr = vlr.replace(" ", "");
  }

  return vlr;
}

function degrees(rad) {
  return rad * (180 / Math.PI);
}

function radians(deg) {
  return deg * (Math.PI / 180);
}



function OnErro(xhr, status, erro) {

  alert('Code: ' + erro.code + '\n' + 'Erro: ' + erro.message);
}

function ocultabotao() {

  $('#divChegada').addClass('invisible');
  $('#divCorpo').addClass('invisible');
  $('.Fundo').addClass('invisible');
}


function ocultaPopUp($scope) {


  $scope.modal.hide();

  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function () {
    $scope.modal.remove();
  });

  // Execute action on hide modal
  $scope.$on('modal.hidden', function () {
    // Execute action
  });

  // Execute action on remove modal
  $scope.$on('modal.removed', function () {
    // Execute action
  });

}



function openModal_Itinerarios($scope, $ionicModal, $ionicLoading) {

  $ionicLoading.hide();

  $ionicModal.fromTemplateUrl('ModalItinerario.html', {
      scope: $scope,
      animation: 'newspaper'
    })
    .then(function (modal) {
      $scope.modal = modal;
      $scope.modal.show();
    });
};




function BarraProgresso() {

  var progresso = new Number();
  var maximo = new Number();
  var progresso = 0;
  var maximo = 100;

  function start() {

    if ((progresso + 1) < maximo) {
      progresso = progresso + 1;
      document.getElementById("pg").value = progresso;

    }

    setTimeout("start();", 30);
  }

}
