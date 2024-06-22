var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var d= new Date().toISOString().substring(0,16)
  res.render('index', {"date":d});
});

module.exports = router;

