const mongoose = require('mongoose');

module.exports=()=>{
    mongoose.connect('mongodb://localhost:27017/mydb');
    mongoose.connection.once('connection',()=>{
        console.log('db connected');
    })
}