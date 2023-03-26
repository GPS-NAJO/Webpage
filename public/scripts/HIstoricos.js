
var nav = L.map("nav").setView([11.019, -74.81], 13);
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(nav);

$(function () {
    $('input[name="datetimes"]').daterangepicker({
        timePicker: true,
        timePicker24Hour: true,
        timePickerIncrement: 5,
        locale: {
            format: "YYYY/MM/DD HH:mm:ss",
        },
        minDate: "2023/03/06 09:00:00",
        maxDate: new Date(),
        startDate: moment().startOf("hour"),
        endDate: moment().startOf("hour").add(32, "hour"),
    });
});
document.getElementById("returnToHome").addEventListener("click", () => {
    window.location.href = "/";
});

let datos = [];
let circle;
let puntosEncontrados = [];
$(function () {
    $("#sendBtn").click(function () {
        puntosEncontrados = [];
        if (circle) {
            circle.remove();
        }
        console.log("endTime:", $('input[name="datetimes"]').data("daterangepicker").endDate.format("YYYY/MM/DD HH:mm:ss"));
        $.ajax({
            url: "/api/historicos",
            data: {
                startTime: $('input[name="datetimes"]')
                    .data("daterangepicker")
                    .startDate.format("YYYY/MM/DD HH:mm:ss"),
                endTime: $('input[name="datetimes"]')
                    .data("daterangepicker")
                    .endDate.format("YYYY/MM/DD HH:mm:ss"),
            },
            success: function (data) {
                let coordenadas = [];
                datos = data;
                let coord = [];
                for (var i = 0; i < data.length; i++) {
                    coord = [data[i].latitud, data[i].longitud];
                    coordenadas.push(coord);
                }

                // Get a reference to the previously drawn polyline and marker, if they exist
                const previousPolyline = nav.previousPolyline;
                const previousMarker = nav.previousMarker;

                // Remove the previously drawn polyline and marker from the map, if they exist
                if (previousPolyline) {
                    previousPolyline.remove();
                }
                if (previousMarker) {
                    previousMarker.remove();
                }

                // Create the new polyline and add it to the map
                const newPolyline = L.polyline(
                    coordenadas,
                    {
                        color: "red",
                    }
                ).addTo(nav);

                // Set the view of the map and add a marker at the last coordinate
                nav.setView(coord, 15);
                const newMarker = L.marker(coordenadas[coordenadas.length - 1]).addTo(nav);

                // Store the new polyline and marker in properties of the map object
                nav.previousPolyline = newPolyline;
                nav.previousMarker = newMarker;
            },
        });
    });
});
var stepSlider = document.getElementById('slider');
noUiSlider.create(stepSlider, {
    start: [0],
    behaviour: 'smooth-steps-tap-snap',
    step: 1,
    range: {
        'min': [0],
        'max': [10]
    }
});
stepSlider.noUiSlider.disable();
var stepSliderZoom = document.getElementById('sliderZoom');
noUiSlider.create(stepSliderZoom, {
    start: 0,
    behaviour: 'smooth-steps-tap-snap',
    step: 1,
    range: {
        'min': 0,
        'max': 20
    }
});
stepSliderZoom.noUiSlider.disable();
function puntoDentroRadio(coordenada, centro, radio) {
    return (coordenada.latitud - centro.lat) ** 2 + (coordenada.longitud - centro.lng) ** 2 <= radio ** 2;
}
function onClickMapa(e) {



    const zoomLevel = nav.getZoom(); // get the current zoom level of the map
    const radio = 0.002 * Math.pow(2, 22 - zoomLevel); // calculate the radius based on the zoom level

    const PuntoCentral = e.latlng;
    const radio_latitud = radio / 110.574
    if (circle) {
        circle.remove();
    }
    circle = L.circle(PuntoCentral, {
        color: '#4c007d',
        fillColor: '#bc4ed8',
        fillOpacity: 0.3,
        radius: radio_latitud * 111000
    }).addTo(nav);
    console.log(PuntoCentral);
    puntosEncontrados = datos.filter(p => puntoDentroRadio(p, PuntoCentral, radio_latitud));
    if (puntosEncontrados.length > 0) {

        var valuesForSlider = [];

        for (var i = 0; i < puntosEncontrados.length; i++) {
            valuesForSlider.push(i);
        }
        if (stepSlider) {
            stepSlider.noUiSlider.destroy();

        }
        noUiSlider.create(stepSlider, {
            start: [0],
            behaviour: 'smooth-steps-tap-snap',
            step: 1,
            range: {
                'min': [0],
                'max': [puntosEncontrados.length - 1]
            }
        });
        stepSlider.noUiSlider.enable();
        stepSliderZoom.noUiSlider.enable();
        var format = {
            to: function (value) {
                return valuesForSlider[Math.round(value)];
            },
            from: function (value) {
                return valuesForSlider.indexOf(Number(value));
            }
        };

        stepSlider.noUiSlider.on('change', function () {

            var display_index = Math.round(stepSlider.noUiSlider.get(true))
            document.getElementById("display").textContent = puntosEncontrados[display_index].fecha + " " + puntosEncontrados[display_index].hora;
            const previousMarker = nav.previousMarker;

            if (previousMarker) {
                previousMarker.remove();
            }

            const newMarker = L.marker([puntosEncontrados[display_index].latitud, puntosEncontrados[display_index].longitud]).addTo(nav);
            nav.previousMarker = newMarker;

        });
        console.log(puntosEncontrados);
        console.log(valuesForSlider);
    } else {
        //TODO 
        //popup
    }
}
nav.on('click', e => onClickMapa(e));