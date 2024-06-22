var express = require('express');
var router = express.Router();

var Periodo = require("../controllers/periodos")

/* GET home page. */
router.get('/', function(req, res, next) {
  Periodo.list()
  .then(data => res.jsonp(data))
  .catch(erro => res.jsonp(erro))
});

router.get('/:id', function(req, res, next) {
  Periodo.findById(req.params.id)
    .then(data => res.jsonp(data))
    .catch(erro => res.jsonp(erro))
});

router.post('/', function(req, res, next) {
  Periodo.insert(req.body)
    .then(data=> res.jsonp(data))
    .catch(erro=> res.jsonp(erro))
});

router.delete('/:id', function(req, res, next) {
  Periodo.delete(req.params.id)
    .then(data => res.jsonp(data))
    .catch(erro=> res.jsonp(erro))
});


router.put('/:id', function(req, res, next) {
  Periodo.update(req.params.id, req.body)
    .then(data => res.jsonp(data))
    .catch(erro => res.jsonp(erro))
});
module.exports = router;
