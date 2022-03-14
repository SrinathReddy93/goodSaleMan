const mongoose = require('mongoose');

const policy = new mongoose.Schema({
    salesManId:{type:Number, required:true},
    status:{ type: String, required:true}
},{
    timestamps:true
})

module.exports = mongoose.model('policy', policy);