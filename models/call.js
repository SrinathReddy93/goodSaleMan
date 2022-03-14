const mongoose = require('mongoose');

const call = new mongoose.Schema({
    salesManId:{type:Number, required:true},
    status:{ type: String, required:true}
},{
    timestamps:true
})

module.exports = mongoose.model('call', call);
