var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home');
});
/* GET historial page. */
router.get('/historial', function(req, res, next) {
  res.render('historial');
});

module.exports = router;
