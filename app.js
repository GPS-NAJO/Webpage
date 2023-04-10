//Dependencies
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var udplistener = require("./listener/index");
var app = express();
var { message } = require("./listener/index.js");
var Database = require("./Databases.js");
const database = new Database();

//configuration parameters
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join("../Webpagen-FrontEnd", "build")));


udplistener.Listener(); //Function to recieve the GPS data

//Real time gps data sent to the client side
app.get("/api/gps", (req, res) => {
  if (process.argv.includes("--d")) {
    const minLatitude = 10.923518;
    const maxLatitude = 10.996802;
    const minLongitude = -74.862975;
    const maxLongitude = -74.769347;

    const latitude = Math.random() * (maxLatitude - minLatitude) + minLatitude;
    const longitude =
      Math.random() * (maxLongitude - minLongitude) + minLongitude;
    const altitude = 0;
    const id = 664;
    const timestamp = 1686749580000;
    gpsjson = {
      latitud: latitude,
      longitud: longitude,
      altitud: altitude,
      timestamp: timestamp,
      id: id,
    };
    res.json(gpsjson);
    console.log(gpsjson);
  } else {
    try {
      if (message.value != null) {
        var gpsdata = message.value.split(";");
        var gpsjson = {
          latitud: gpsdata[0],
          longitud: gpsdata[1],
          altitud: gpsdata[2],
          timestamp: parseInt(gpsdata[3], 10),
          id: gpsdata[4],
        };
        res.json(gpsjson);
        console.log(gpsjson);
      }
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  }
});

//handling GET request data from the database to the client side
app.get("/api/historicos", async (req,res) =>{
  const startTime = req.query.startTime;
  const endTime = req.query.endTime;
  const datos = await database.registroHandler.GetQueryRange(startTime,endTime);
  datos.sort(function(a,b){
    const fechaA = new Date(a.date + "T" + a.time);
    const fechaB = new Date(b.date + "T" + b.time);
    return fechaA - fechaB;
    });
  res.json(datos);
})

//web routing
app.get('/*', function (req, res) {
  const filePath = path.resolve(__dirname, '../Webpagen-FrontEnd/build/index.html');
  res.sendFile(filePath);
});


module.exports = app;
