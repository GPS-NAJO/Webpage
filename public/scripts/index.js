let status = 0;
var nav = L.map("nav");
var marker = null;
var coordenadas = [];
function getData() {
  $.ajax("/api/gps", {
    method: "GET",
    success: function (data) {
      // Establecer el color de fondo del elemento

      $("#latitud").text(data.latitud);
      $("#latitud").css(
        "color",
        "#" + Math.floor(Math.random() * 16777215).toString(16)
      );
      $("#longitud").text(data.longitud);
      $("#longitud").css(
        "color",
        "#" + Math.floor(Math.random() * 16777215).toString(16)
      );
      var fecha = new Date(data.timestamp); // Convertir el timestamp a milisegundos y crear un objeto Date
      var fechaLegible = fecha.toLocaleString();
      var fechas = fechaLegible.split(",");
      $("#hora").text(fechas[1]);
      $("#hora").css(
        "color",
        "#" + Math.floor(Math.random() * 16777215).toString(16)
      );
      $("#fecha").text(fechas[0]);
      $("#fecha").css(
        "color",
        "#" + Math.floor(Math.random() * 16777215).toString(16)
      );

      $("#id").text(data.id);
      $("#id").css(
        "color",
        "#" + Math.floor(Math.random() * 16777215).toString(16)
      );

      let coordenadas = [];
      let coords = [data.latitud, data.longitud];
      for (let i = 0; i < 10; i++) {
        let coords = [data.latitud, data.longitud];
        coordenadas.push(coords);
      }
      if (status === 0) {
        //let coords=[Number(data.latitud), Number(data.longitud)]
        const map = nav.setView(coords, 08);
        // Crea una capa de mosaicos
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
          maxZoom: 20,
        }).addTo(map);
        // Crea un control de rutas y agrega la ruta al mapa
        if (coordenadas.length > 1) {
          var polyline = L.polyline([coordenadas], {
            color: "red",
          }).addTo(map);
        }
        marker = L.marker(coordenadas[coordenadas.length - 1]).addTo(nav);
        status = 1;
      } else {
        nav.setView(coords, 18);
        marker?.setLatLng(coordenadas[coordenadas.length - 1]);
      }
    },
  });
}

// function getRandomInRange(from, to, fixed) {
// return (Math.random() * (to - from) + from).toFixed(fixed) * 1;
//} //comentar para ecs
//let coords = [getRandomInRange(-90, 90), getRandomInRange(-180, 180)]

getData();
setInterval(() => {
  getData();
}, 6000);

//Entorno de desarrollo con simulación
if (process.argv.includes("--d")) {
  elseif(process.argv.includes("--d"));
}
