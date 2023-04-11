//////////////////////////////////
//init variables
var nav = L.map("nav").setView([11.019, -74.81], 13);
let datos = [];
let circle;
let puntosEncontrados = [];
let previousMarker;
let newMarker;
var stepSlider = document.getElementById('slider');
var stepSliderZoom = document.getElementById('sliderZoom');


//create sliders 
noUiSlider.create(stepSlider, {
    start: [0],
    behaviour: 'smooth-steps-tap-snap',
    step: 1,
    range: {
        'min': [0],
        'max': [10]
    }
});
noUiSlider.create(stepSliderZoom, {
    start: 1,
    behaviour: 'smooth-steps-tap-snap',
    step: 1,
    range: {
        'min': 1,
        'max': 10
    }
});
document.getElementById("returnToHome").addEventListener("click", () => {
    window.location.href = "/";
});
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(nav);

stepSlider.noUiSlider.disable();
stepSliderZoom.noUiSlider.disable();


//////////////////////////////////

//function for handling the date range picker
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

//logic withing the "solicitar" button
$(function () {
    $("#sendBtn").click(function () {
        
        //eliminate all previous data, if they exist
        puntosEncontrados = [];
        if (circle) {
            circle.remove();
        }
        if (previousMarker) {
            previousMarker.remove();
        }

        //request data to the server
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
                console.log( $('input[name="datetimes"]')
                .data("daterangepicker")
                .endDate.format("YYYY/MM/DD HH:mm:ss"))
                let coordenadas = [];
                datos = data;
                let coord = [];
                // Get a reference to the previously drawn polyline and marker, if they exist
                const previousPolyline = nav.previousPolyline;
                previousMarker = nav.previousMarker;

                // Remove the previously drawn polyline and marker from the map, if they exist
                if (previousPolyline) {
                    previousPolyline.remove();
                }
                if (previousMarker) {
                    previousMarker.remove();
                }

                //if there is data found within the range requested
                if(data.length>0){
                    for (var i = 0; i < data.length; i++) {
                        coord = [data[i].latitud, data[i].longitud];
                        coordenadas.push(coord);
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
                    newMarker = L.marker(coordenadas[coordenadas.length - 1]).addTo(nav);
    
                    // Store the new polyline and marker in properties of the map object
                    nav.previousPolyline = newPolyline;
                    nav.previousMarker = newMarker;
                    
                    //reactivate the event listener on clicking the map
                    nav.off('click');
                    nav.on('click', e => onClickMapa(e));
                }else{ 

                    //disabling the event listener and sliders, since there are no data
                    nav.off('click');
                    stepSlider.noUiSlider.disable();
                    stepSliderZoom.noUiSlider.disable();
                }
               
            },
        });
    });
});

//filter function
function puntoDentroRadio(coordenada, centro, radio) {
    return (coordenada.latitud - centro.lat) ** 2 + (coordenada.longitud - centro.lng) ** 2 <= radio ** 2;
}

//click handler function
function onClickMapa(e) {
    var zoom_slider = Math.round(stepSliderZoom.noUiSlider.get(true)) 
    const zoomLevel = nav.getZoom(); // get the current zoom level of the map
    const radio = (0.002*zoom_slider) * Math.pow(2, 22 - zoomLevel); // calculate the radius based on the zoom level and the zoomslider

    const PuntoCentral = e.latlng;
    const radio_latitud = radio / 110.574 //converts the radius to degrees
    if (circle) {
        circle.remove();
    }
    circle = L.circle(PuntoCentral, {
        color: '#4c007d',
        fillColor: '#bc4ed8',
        fillOpacity: 0.3,
        radius: radio_latitud * 111000 //converts the radius to meters
    }).addTo(nav);

    //filter the array of coordinates retrieved from the server
    puntosEncontrados = datos.filter(p => puntoDentroRadio(p, PuntoCentral, radio_latitud));

    if (puntosEncontrados.length > 0) {

        //array of index to access the specific coordinate
        var valuesForSlider = [];
        for (var i = 0; i < puntosEncontrados.length; i++) {
            valuesForSlider.push(i);
        }

        //it needs to destroy and create the slider in order to update correctly
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

            //displays time and date of the current selected data with the slider
            var display_index = Math.round(stepSlider.noUiSlider.get(true))
            document.getElementById("display").textContent = puntosEncontrados[display_index].fecha + " " + puntosEncontrados[display_index].hora;
            previousMarker = nav.previousMarker;

            if (previousMarker) {
                previousMarker.remove();
            }
            //creates a marker on the map with the corresponding coordinate
            newMarker = L.marker([puntosEncontrados[display_index].latitud, puntosEncontrados[display_index].longitud]).addTo(nav);
            nav.previousMarker = newMarker;

        });
    } else {
        stepSlider.noUiSlider.disable();
    }
}
