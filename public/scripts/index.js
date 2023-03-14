var nav = L.map("nav");
var marker = null;
var coordenadas = [];

function getData(callback) {
  $.ajax("/api/gps", {
    method: "GET",
    success: function (data) {
      var fecha = new Date(data.timestamp); // Convertir el timestamp a milisegundos y crear un objeto Date
      var fechaLegible = fecha.toLocaleString();
      var fechas = fechaLegible.split(",");
      var dato = [data.latitud, data.longitud, fechas[0], fechas[1], data.id];
      callback(dato);
    },
  });
}

async function init() {
  getData(function (datos) {
    $("#latitud").text(datos[0]);
    $("#longitud").text(datos[1]);
    $("#hora").text(datos[3]);
    $("#fecha").text(datos[2]);
    $("#id").text(datos[4]);

    let coords = [parseFloat(datos[0]), parseFloat(datos[1])];
    coordenadas.push(coords);
    const map = nav.setView(coords, 15);

    // Crea una capa de mosaicos
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
      maxZoom: 20,
    }).addTo(map);

    // Crea un control de rutas y agrega la ruta al mapa
    marker = L.marker(coordenadas[coordenadas.length - 1]).addTo(nav);

    setInterval(() => {
      getData(function (datos) {
        $("#latitud").text(datos[0]);
        $("#longitud").text(datos[1]);
        $("#hora").text(datos[3]);
        $("#fecha").text(datos[2]);
        $("#id").text(datos[4]);

        let coords = [parseFloat(datos[0]), parseFloat(datos[1])];
        coordenadas.push(coords);

        if (coordenadas.length > 1) {
          var polyline = L.polyline(
            coordenadas.slice(-2),
            // ^^^ get the last two elements of the array
            {
              color: "red",
            }
          ).addTo(map);
        }
        nav.setView(coords, 15);
        marker?.setLatLng(coordenadas[coordenadas.length - 1]);
      });
    }, 6000);
  });
}

init();