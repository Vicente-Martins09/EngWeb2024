const mongoose = require('mongoose')
const { modelName } = require("../models/pessoas")
var Pessoas = require("../models/pessoas")

module.exports.listModalidades = () =>{
    return Pessoas.distinct('desportos')
        .then(modalidades => {
            modalidades.sort();
            return modalidades;
        });
}

module.exports.listAtletasModolidade = modalidade=>{
    return Pessoas.find({desportos: {$in : modalidade}}, 'nome')
    .then(pessoas=>{
        return pessoas.sort();
    })
}
