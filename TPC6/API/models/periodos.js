var mongoose = require("mongoose")

var periodosSchema = new mongoose.Schema({
    _id: String,
    nome: String,
    seculo: String,
    origem: String,
    desc: String
}, { versionKey: false });


module.exports = mongoose.model('periodos', periodosSchema)