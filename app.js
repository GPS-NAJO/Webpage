var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var udplistener = require('./listener/index')
var homeRouter = require('./routes/home');
var app = express();
var {message} = require('./listener/index.js');
const { DataTypes } = require('sequelize');
var sequelize = require('./config');
const { parse } = require('path');
// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

const Registro = sequelize.define('Registro', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoincrement: true
  },
  ident: {
    type: DataTypes.CHAR,
    allowNull: false
  },
  latitud: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  longitud: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  hora: {
    type: DataTypes.TIME,
    allowNull: false,
  }
});

conectado();
async function conectado(){
try {
  await sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}
}
udplistener.Listener()




    
app.use('/', homeRouter);
var mensaje = 0;

app.get('/api/gps',(req,res) =>{
  try{
    if (message.value != null) {
      var gpsdata = message.value.split(";");
      var gpsjson = {
        latitud: gpsdata[0],
        longitud: gpsdata[1],
        altitud: gpsdata[2],
        timestamp: parseInt(gpsdata[3], 10),
        id: gpsdata[4]
      };
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(gpsjson));
            
      timestamp = parseInt(gpsdata[3],10)
      var fecha = new Date(timestamp); // Convertir el timestamp a milisegundos y crear un objeto Date
      var fechaLegible = fecha.toLocaleString();
      var fechas = fechaLegible.split(",");
      if(mensaje!==message){
        Registro.create({
	  id: Math.round(Math.random() * 10000),
          ident: gpsdata[4],
          latitud: parseInt(gpsdata[0]),
          longitud: parseInt(gpsdata[1]),
          fecha: fechas[0],
          hora: fechas[1]
        })
          .then((Registro) => {
            console.log('User created:', Registro.toJSON());
          })
          .catch((error) => {
            console.error('Unable to create user:', error);
          });
      }
      
        mensaje = message
    }
  } catch (err){
    console.error(err);
    res.status(500).send('Internal Server Error');
  }

});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
