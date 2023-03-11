var express = require('express');
var router = express.Router();

router.get('/h', function(req, res, next) {
  res.render('historial');
});

module.exports = router;