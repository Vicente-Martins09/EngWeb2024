var express = require('express');
var router = express.Router();
var axios = require('axios');


router.get('/', function(req, res, next) {
    var d = new Date().toISOString().substring(0, 16)
    axios.get("http://localhost:16000/periodos")
      .then(resp=>{
        var periodos = resp.data
        res.status(200).render("listaPeriodos",{"lPeriodos": periodos, "date":d})
        
    })
    .catch(erro=>{
        res.status(501).render("erro",{"erro": erro})
    })
});




router.get('/Add', function(req, res, next) {
    var d = new Date().toISOString().substring(0, 16)
    res.status(200).render("periodoAdd",{"date":d})
});


router.post('/Add', function(req, res, next) {
    var d = new Date().toISOString().substring(0, 16)
    var result = req.body
  
    axios.post("http://localhost:16000/periodos",result)
        .then(resp=>{
            console.log(resp.data)
            res.status(201).redirect('/periodos')
        })
        .catch(erro=>{
            res.status(502).render("erro",{"erro" : erro})
        })
});

router.get('/:idPeriodo', function(req, res, next) {
    var d = new Date().toISOString().substring(0, 16)
    axios.get("http://localhost:16000/periodos/" + req.params.idPeriodo)
        .then(resp=>{
            var periodo = resp.data
            res.status(200).render("periodoPage",{"periodo": periodo, "date":d})
        
        })
        .catch(erro=>{
        res.status(503).render("erro",{"erro": erro})
        })
});

router.get('/edit/:idPeriodo', function(req, res, next) {
    var d = new Date().toISOString().substring(0, 16)
    axios.get("http://localhost:16000/periodos/" + req.params.idPeriodo)
        .then(resp=>{
            var periodo = resp.data
            res.status(200).render("periodoEdit",{"periodo": periodo, "date":d})
        })
        .catch(erro=>{
            res.status(504).render("erro",{"erro": erro})
        })
});

router.post('/edit/:idPeriodo', function(req, res, next) {
    var d = new Date().toISOString().substring(0, 16)
    var periodo = req.body
  
    axios.put("http://localhost:16000/periodos/" + req.params.idPeriodo, periodo)
        .then(resp=>{
            res.status(201).redirect('/periodos')
        })
        .catch(erro=>{
            res.status(502).render("erro",{"erro" : erro})
        })
});

router.get('/delete/:idPeriodo', function(req, res, next) {
    var d = new Date().toISOString().substring(0, 16)
    axios.delete("http://localhost:16000/periodos/" + req.params.idPeriodo)
        .then(resp=>{
            res.redirect('/periodos')
            
        })
        .catch(erro=>{
            res.status(505).render("erro",{"erro": erro})
        })
});

module.exports = router;