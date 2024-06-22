const mongoose = require('mongoose')
var Compositor = require("../models/compositores")

module.exports.list = ()=>{
    return Compositor.find().exec();
}

module.exports.findById = id =>{
    return Compositor.findOne({_id: id}).exec();
}

module.exports.insert = compositor =>{
    if((Compositor.find({ _id: compositor._id }).exec()).lenght !=1){
        var newCompositor = new Compositor(compositor)
        return newCompositor.save()

    }
}

module.exports.update = (id, livro) => {
    return Compositor.findByIdAndUpdate(id, livro, { new: true }).exec();
}

module.exports.delete = id => {
    return Compositor.findByIdAndDelete(id).exec();
}