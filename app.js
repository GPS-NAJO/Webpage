//Dependencies
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var udplistener = require("./listener/index");
var homeRouter = require("./routes/home");
var app = express();
var { message } = require("./listener/index.js");
var Database = require("./Databases.js");
const { parse } = require("path");
const database = new Database();

//configuration parameters
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));


udplistener.Listener(); //Function to recieve the GPS data

//web routing
app.use("/", homeRouter);
app.get('/public/scripts/Historicos.js', function(req, res) {
  res.set('Content-Type', 'text/javascript');
  res.sendFile(path.join(__dirname, 'public', 'scripts', 'Historicos.js'));
});

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
module.exports = app;
