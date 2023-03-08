var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var udplistener = require('./listener/index')
var homeRouter = require('./routes/home');
var app = express();
var {message} = require('./listener/index.js');
//hola
//hola
//hola
//hola
//hola
//hola
//hola
//hola
//hola
//hola
//hola
const { parse } = require('path');
// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

udplistener.Listener()
    
app.use('/', homeRouter);

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
