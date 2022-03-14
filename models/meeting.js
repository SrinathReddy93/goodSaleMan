const mongoose = require('mongoose');

const meeting = new mongoose.Schema({
    salesManId:{type:Number, required:true},
    status:{ type: String, required:true},
    clientName:{ type:String },
    clientDetails: {
        name: { type: String},
        email: {type: String}
    }
},{
    timestamps:true
})

module.exports = mongoose.model('meeting', meeting);