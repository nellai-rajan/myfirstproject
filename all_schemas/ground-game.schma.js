const mongoose = require("mongoose")

const groundGameSchema=new mongoose.Schema({
    name:String,
    players:Number,
    team:String   
},{versionKey:false})

const groundGames=mongoose.model('groundGame',groundGameSchema)

module.exports=groundGames