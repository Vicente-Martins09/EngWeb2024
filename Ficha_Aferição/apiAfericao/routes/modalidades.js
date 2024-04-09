var express = require('express');
var router = express.Router();
var Ficheiro = require("../controllers/modalidades")

/* GET users listing. */
router.get('/', function(req, res, next) {
  Ficheiro.listModalidades()
  .then(data => res.jsonp(data))
  .catch(erro => res.jsonp(erro))
});

router.get('/:modalidade', function(req,res,next){
  Ficheiro.listAtletasModolidade(req.params.modalidade)
  .then(data => res.jsonp(data))
  .catch(erro=> res.jsonp(erro))
})
module.exports = router;
