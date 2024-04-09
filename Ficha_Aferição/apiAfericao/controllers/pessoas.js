const mongoose = require('mongoose')
const { modelName } = require("../models/pessoas")
var Pessoas = require("../models/pessoas")


module.exports.list = ()=>{
    return Pessoas
        .find()
        .sort({nome: 1})
        .exec()
}

module.exports.findById = id => {
    return Pessoas
        .findOne({_id : id})
        .exec()
}

module.exports.insert = pessoa => {
    // Verifica se a pessoa já existe pelo _id
    if((Pessoas.find({ _id: pessoa._id }).exec()).lenght !=1){
        var newPessoa = new Pessoas(pessoa)
        return newPessoa.save()

    }
}

module.exports.update = (id, pessoa) => {
    return Pessoas
        .findByIdAndUpdate(id, pessoa, { new: true })
        .exec();
}

module.exports.remove = id => {
    return Pessoas
        .findByIdAndDelete(id)
        .exec();
}

