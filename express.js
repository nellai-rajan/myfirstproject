const express=require('express')
const cors=require('cors')
let app=express()
// app.use(cors())
app.use(express.json())
 
//This is middleware function

app.use((req,res,next)=>{
    console.log("res====>",req.method)
    next()     //   this is hooks(Express middleware)
})
module.exports=app