

const app=require('../express.js')
const {dbconnect}=require('../dbconnection.js')
dbconnect()
const user=require('../all_schemas/user-schema.js')
const jwt=require('jsonwebtoken')

require('dotenv').config()


let secretKey=process.env.JWT_SECRET_KEY

app.post("/user/create",async(req,res)=>{
    console.log("body",req)

    token=jwt.sign(req.body,secretKey)

    req.body.token=token
    req.body.createdAt=Date.now()
    createUsers=await user.create(req.body)
    res.send(createUsers)
})

app.get('/user/verify/:name/:password',async(req,res)=>{
    console.log("req===>",req.params)
    let query={}
    query.name=req.params.name
    const getUser=await user.findOne({name:req.params.name})
    console.log("getUser====>",getUser)


    // userDate=getUser.createdAt
    // nowDate=Date.now()
    // diff=nowDate-userDate
    // console.log("difffMillisec",diff)
    // diffMin=diff/(1000*60)
    // console.log("diffMin",diffMin)

    // if(diffMin>5){
    //     console.log("token expired")
    //     // let data={
    //     //     name:getUser.name,
    //     //     password:getUser.password
    //     // }
    //     // newToken=jwt.sign(data,secretKey)
    //     // updateToken=await user.updateOne({name:getUser.name,$set:{token:newToken}})
    //     // console.log("token updated")
    // }
    const token=getUser.token
    
   
    verifyUser=jwt.verify(token,secretKey)

    let message
    if(verifyUser.password==req.params.password){
        console.log("PASSWORD MATCHED")
        message="PASSWORD MATCHED"
    }else{
        console.log("PASSWORD NOT MATCHED")
        message="PASSWORD NOT MATCHED"

    }
    res.send(message)

})