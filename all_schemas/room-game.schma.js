const mongoose  = require("mongoose");

const roomGameSchema=new mongoose.Schema({
    players:Number,
    gameName:String
},{versionKey:false})


const roomGames=mongoose.model("roomGame",roomGameSchema)
module.exports=
    roomGames

