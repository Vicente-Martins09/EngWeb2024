const mongoose = require('mongoose')
var Periodo = require("../models/periodos")

module.exports.list = ()=>{
    return Periodo.find().exec();
}

module.exports.findById = id =>{
    return Periodo.findOne({_id: id}).exec();
}

module.exports.insert = periodo =>{
    if((Periodo.find({ _id: periodo._id }).exec()).lenght !=1){
        var newPeriodo = new Periodo(periodo)
        return newPeriodo.save()

    }
}

module.exports.update = (id, periodo) => {
    return Periodo.findByIdAndUpdate(id, periodo, { new: true }).exec();
}

module.exports.delete = id => {
    return Periodo.findByIdAndDelete(id).exec();
}