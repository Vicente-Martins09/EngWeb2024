var express = require('express');
var router = express.Router();
var Ficheiro = require("../controllers/pessoas")

/* GET users listing. */
router.get('/', function(req, res, next) {
  Ficheiro.list()
  .then(data => res.jsonp(data))
  .catch(erro => res.jsonp(erro))
});

router.get('/:id', function(req, res, next) {
  Ficheiro.findById(req.params.id)
    .then(data => res.jsonp(data))
    .catch(erro => res.jsonp(erro))
});

router.post('/', function(req, res, next) {
  console.log(req.body)
  Ficheiro.insert(req.body)
    .then(data => res.jsonp(data))
    .catch(erro => res.jsonp(erro))
});

router.put('/:id', function(req, res, next) {
  Ficheiro.update(req.params.id, req.body)
    .then(data => res.jsonp(data))
    .catch(erro => res.jsonp(erro))
});

router.delete('/:id', function(req, res, next) {
  return Ficheiro.remove(req.params.id)
    .then(data => res.jsonp(data))
    .catch(erro => res.jsonp(erro))
});
module.exports = router;
