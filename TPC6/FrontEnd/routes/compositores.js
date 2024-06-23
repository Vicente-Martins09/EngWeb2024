var express = require('express');
var router = express.Router();
var axios = require('axios');

/* GET users listing. */
router.get('/', function(req, res, next) {
  var d = new Date().toISOString().substring(0, 16)
  axios.get("http://localhost:16000/compositores")
    .then(resp=>{
      var compositores = resp.data
      res.status(200).render("listaCompositores",{"lCompositores": compositores, "date":d})
      
  })
  .catch(erro=>{
      res.status(501).render("erro",{"erro": erro})
  })
});



router.get('/Add', function(req, res, next) {
  var d = new Date().toISOString().substring(0, 16)
  res.status(200).render("compositorAdd",{"date":d})
});

router.post('/Add', function(req, res, next) {
  var result = req.body

  axios.post("http://localhost:16000/compositores",result)
      .then(resp=>{
          console.log(resp.data)
          res.status(201).redirect('/compositores')
      })
      .catch(erro=>{
          res.status(502).render("erro",{"erro" : erro})
      })
});

router.get('/:idCompositor', function(req, res, next) {
    var d = new Date().toISOString().substring(0, 16)
    axios.get("http://localhost:3000/compositores/" + req.params.idCompositor)
        .then(resp=>{
            var compositor = resp.data
            res.status(200).render("compositorPage",{"compositor": compositor, "date":d})
            
        })
        .catch(erro=>{
            res.status(503).render("erro",{"erro": erro})
        })
  });

  
router.get('/edit/:idCompositor', function(req, res, next) {
  var d = new Date().toISOString().substring(0, 16)
  axios.get("http://localhost:16000/compositores/" + req.params.idCompositor)
      .then(resp=>{
          var compositor = resp.data
          res.status(200).render("compositorEdit",{"compositor": compositor, "date":d})
          
      })
      .catch(erro=>{
          res.status(504).render("erro",{"erro": erro})
      })
});

router.post('/edit/:idCompositor', function(req, res, next) {
  var d = new Date().toISOString().substring(0, 16)
  var compositor = req.body

  axios.put("http://localhost:16000/compositores/" + req.params.idCompositor, compositor)
      .then(resp=>{
          res.status(201).redirect('/compositores')
      })
      .catch(erro=>{
          res.status(502).render("erro",{"erro" : erro})
      })
});

router.get('/delete/:idCompositor', function(req, res, next) {
  var d = new Date().toISOString().substring(0, 16)
  axios.delete("http://localhost:16000/compositores/" + req.params.idCompositor)
      .then(resp=>{
          res.redirect('/compositores')
      })
      .catch(erro=>{
          res.status(505).render("erro",{"erro": erro})
      })
});

module.exports = router;
