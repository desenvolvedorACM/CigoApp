
// api-connection
function check_network() {

    var networkState = navigator.network.connection.type;
    var retorno = "";

    var states = {};
    states[Connection.UNKNOWN] = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI] = 'WiFi connection';
    states[Connection.CELL_2G] = 'Cell 2G connection';
    states[Connection.CELL_3G] = 'Cell 3G connection';
    states[Connection.CELL_4G] = 'Cell 4G connection';
    states[Connection.NONE] = 'No network connection';

    if (states[networkState].toString() == "No network connection") {

        showAlert("Falha na Conexão Internet", "Falha");
        retorno = "No network connection";

    } 

    //$('#connection').html(states[networkState]);
}

function TemConexao() {

    var networkState = navigator.network.connection.type;
    var retorno = "";

    var states = {};
    states[Connection.UNKNOWN] = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI] = 'WiFi connection';
    states[Connection.CELL_2G] = 'Cell 2G connection';
    states[Connection.CELL_3G] = 'Cell 3G connection';
    states[Connection.CELL_4G] = 'Cell 4G connection';
    states[Connection.NONE] = 'No network connection';

    return states[networkState];
    //showAlert(states[networkState]);
    //$('#connection').html(states[networkState]);
}


  var onSuccess = function(position) {

         showAlert('Localização', 'Simulando Dados Localização: \n Latitude: ' + position.coords.latitude + '\n' + '\n' + 'Longitude: ' + position.coords.longitude);


            //   'Accuracy: '          + position.coords.accuracy          + '\n' +
            //   'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
            //   'Heading: '           + position.coords.heading           + '\n' +
            //   'Speed: '             + position.coords.speed             + '\n' +
            //   'Timestamp: '         + position.timestamp                + '\n');
    };

    // onError Callback receives a PositionError object
    //
   var onError = function(error) {

        showAlert('Erro','code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
    };
