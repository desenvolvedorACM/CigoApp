
var fac = angular.module('app.services', [])

fac.factory('InvioSiga', function ($q, $http) {

    var url = "http://187.84.226.114:8044/Homologacao/CigoAppIntegracao/api/CigoAppIntegracaoInvioSiga/";
    var urlBanco = "http://187.84.226.114:8044/Homologacao/CigoAppIntegracao/api/CigoAppServicoGetDadosGPS/";
    var dadosGPs = new Array();


    function BuscaGPs(placa) {

        var promessa = $q.defer();

        $http.get(url + placa)
            .then(function (result, status, headers, config, statusText) {

                dadosGPs.length = 0;
                dadosGPs.push(result.data);

                // angular.forEach(result.data.DadosGps, function (key, value) {

                // });

                promessa.resolve(dadosGPs);

            })
            .catch(function (Erro) {

                promessa.reject(Erro);

            });

        //$ionicLoading.hide();

        return promessa.promise;
    }


    function BuscaDadosBancoGPS(placa) {

        var promessa = $q.defer();

        $http.get(urlBanco + placa)
            .then(function (result, status, headers, config, statusText) {

                dadosGPs.length = 0;
                dadosGPs.push(result.data);

                // angular.forEach(result.data.DadosGps, function (key, value) {

                // });

                promessa.resolve(dadosGPs);

            })
            .catch(function (Erro) {

                promessa.reject(Erro);

            });

        //$ionicLoading.hide();

        return promessa.promise;
    }

    return {

        BuscaGPs: BuscaGPs,
        BuscaDadosBancoGPS: BuscaDadosBancoGPS

    }

});


fac.factory('Paradas', function ($q, $http) {

    var url = "http://187.84.226.114:8044/Homologacao/CigoAppIntegracao/api/CigoAppIntegracao/";
    var url1 = "http://cigoappintegracao.cigoapp.com/api/CigoAppIntegracao/";

    var urlCigoApp = "http://cigoappintegracao.cigoapp.com/api/CigoAppParadasItinerarios/";
    var urlNova = "http://187.84.226.114:8044/Homologacao/CigoAppIntegracao/api/CigoAppParadasItinerarios/";



    var paradas = [];


    function TodasParadas() {


        // $('.loader').removeClass("invisible");
        var promessa = $q.defer();

        $http.get(url1)
            .then(function (result, status, headers, config, statusText) {

                paradas.length = 0;
                var Dados = JSON.parse(result.data);
                //$('.loader').addClass("invisible");

                angular.forEach(Dados.lstParadas, function (key, value) {

                    paradas.index = value;
                    paradas.push(key);

                });

                promessa.resolve(paradas);


            })
            .catch(function (Erro) {

                promessa.reject(Erro);
                //$('.loader').addClass("invisible");

            });


        return promessa.promise;

    }


    function ParadasTipoOnibus(TipoOnibus) {


        var promessa = $q.defer();

        //--Municipal - M / municipal
        $http.get(urlNova + TipoOnibus)
            .then(function (result, status, headers, config, statusText) {

                paradas.length = 0;

                if (result.data.Sucesso) {

                    angular.forEach(result.data.lstParadasItinerarios, function (key, value) {

                        paradas.index = value;
                        paradas.push(key);

                    });

                    promessa.resolve(paradas);
                }



            })
            .catch(function (Erro) {

                promessa.reject(Erro);

            });


        return promessa.promise;


    }


    return {

        TodasParadas: TodasParadas,
        ParadasTipoOnibus: ParadasTipoOnibus

    }



});


fac.factory('ItinerariosCigoApp', function ($q, $http) {

    var url = "http://187.84.226.114:8044/Homologacao/CigoAppIntegracao/api/ItinerariosCigoApp/"; // PEGO LINHAS

    var Itinerarios = new Array();


    function ItinerariosParada(idParada) {


        var promessa = $q.defer();

        $http.get(url + idParada + '/1')
            .then(function (result, status, headers, config, statusText) {

                Itinerarios.length = 0;

                if (result.data.Sucesso == true) {

                    angular.forEach(result.data.lstItinerarios, function (key, value) {

                        Itinerarios.index = value;
                        Itinerarios.push(key);

                    });
                }

                promessa.resolve(Itinerarios);

            })
            .catch(function (Erro) {

                promessa.reject(Erro);

            });


        return promessa.promise;
    }


    return {

        ItinerariosParada: ItinerariosParada

    }

});


fac.factory('GeoMItinerarios', function ($q, $http) {

    var url = "http://187.84.226.114:8044/Homologacao/CigoAppIntegracao/api/ItinerariosCigoApp/";


    var PosGeograficas = new Array();

    function PosicoesGeograficas(idLinha) {


        var promessa = $q.defer();

        $http.get(url + idLinha)
            .then(function (result, status, headers, config, statusText) {

                PosGeograficas.length = 0;

                if (result.data.Sucesso == true) {

                    angular.forEach(result.data.posGeograficas, function (key, value) {

                        PosGeograficas.index = value;
                        PosGeograficas.push(key);

                    });
                }

                promessa.resolve(PosGeograficas);

            })
            .catch(function (Erro) {

                promessa.reject(Erro);

            });


        return promessa.promise;
    }


    return {

        PosicoesGeograficas: PosicoesGeograficas

    }

});


fac.factory('HorariosItinerariosCigoApp', function ($q, $http) {

    // IDParada - Itinerarios por parada
    var url = "http://187.84.226.114:8044/Homologacao/CigoAppIntegracao/api/HorariosItinerariosCigoApp/";
    var urlPlaca = "http://187.84.226.114:8044/Homologacao/CigoAppIntegracao/api/CigoAppHorariosItinerariosPlaca/"; //Placa
    var urlNova = "http://cigoappintegracao.cigoapp.com/api/HorariosItinerariosCigoApp/";

    var HorariosItinerarios = new Array();
    var HorariosItinerariosSelecionado = new Array();
    var HorariosItinerariosSelecionado = new Array();
    var NovoItinerariosPorPlaca = new Array();


    function BuscarHorariosDoItinerario(idLinha) {


        try {

            HorariosItinerariosSelecionado.length = 0;

            for (var i = 0; i < HorariosItinerarios.length; i++) {

                if (HorariosItinerarios[i].idlinha == idLinha) {

                    HorariosItinerariosSelecionado.push(HorariosItinerarios[i]);
                }
            }

        } catch (error) {

            alert('Erro: ' + error);
        }

        return HorariosItinerariosSelecionado;
    }


    function BuscarItinerariosidParada(idParada) {


        var promessa = $q.defer();

        $http.get(urlNova + idParada)
            .then(function (result, status, headers, config, statusText) {

                HorariosItinerarios.length = 0;

                if (result.data.Sucesso == true) {

                    angular.forEach(result.data.lstItinerariosParada, function (key, value) {

                        HorariosItinerarios.index = value;
                        HorariosItinerarios.push(key);

                    });
                }

                promessa.resolve(HorariosItinerarios);

            })
            .catch(function (Erro) {

                promessa.reject(Erro);

            });


        return promessa.promise;
    }


    function BuscarItinerariosidPlaca(Placa) {



        var promessa = $q.defer();

        $http.get(urlPlaca + Placa)
            .then(function (result, status, headers, config, statusText) {

                ItinerariosPorPlaca.length = 0;

                if (result.data.Sucesso == true) {

                    angular.forEach(result.data.lstItinerariosParada, function (key, value) {

                        ItinerariosPorPlaca.index = value;
                        ItinerariosPorPlaca.push(key);

                    });
                }

                promessa.resolve(ItinerariosPorPlaca);

            })
            .catch(function (Erro) {

                promessa.reject(Erro);

            });


        return promessa.promise;
    }


    function BuscarParadasItinerario(idLinha) {


        try {

            NovoItinerariosPorPlaca.length = 0;

            for (var i = 0; i < ItinerariosPorPlaca.length; i++) {

                if (ItinerariosPorPlaca[i].idlinha == idLinha) {

                    NovoItinerariosPorPlaca.push(ItinerariosPorPlaca[i].lstParadas);
                }
            }

        } catch (error) {

            alert('Erro: BuscarParadasItinerario ' + error);
        }

        return NovoItinerariosPorPlaca;
    }

    return {

        BuscarItinerariosidParada: BuscarItinerariosidParada,
        BuscarHorariosDoItinerario: BuscarHorariosDoItinerario,
        BuscarItinerariosidPlaca: BuscarItinerariosidPlaca,
        BuscarParadasItinerario: BuscarParadasItinerario

    }

});


