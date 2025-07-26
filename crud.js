
console.log("crudEnter")
const { ObjectId } = require("mongodb")
// const { dbconnect, getDB, dbClose } = require("./dbconnection.js")  //all are same name la than edukanum

const jwt = require('jsonwebtoken')
require('dotenv').config()

const express = require('express')
let app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
let jwtSecretKey = process.env.JWT_SECRET_KEY
const PORT = process.env.PORT
// dbconnect()
// const DB=getDB()
// console.log("DB===>",typeof(DB))
app.listen(PORT, async () => {

    console.log("Server is running on port ", PORT)
})
async function crudOperation() {
    try {
        await dbconnect()
        const DB = getDB()
        console.log("DB", DB)
        console.log("DB", typeof (DB)) // db connect ahalana undefined varum
        // if(!DB){
        //     return {error:"DB NOT connected"}
        // }

        //  await DB.collection("sports").insertOne(
        //         {
        //         name:"hockey",
        //         players:11,
        //         team:"india",
        //         }
        //     )

        // await DB.collection("sports").insertMany(
        //     [
        //         {
        //             name:"vollyball",
        //             players:6,
        //             team:"india"
        //         },                
        //         {
        //             name:"basketball",
        //             players:7,
        //             team:"india"
        //         }
        //     ]
        // )

        // let updateDoc=await DB.collection("sports").updateMany({place:{$exists:false}},{$set:{place:"ground"}})

        // console.log("updateDoc",updateDoc,updateDoc.matchedCount) 

        // let getByid=await DB.collection("sports").findOne({_id:new ObjectId("67a738c7ee0a3bcde3ff574a")})
        // console.log("getByid",getByid)

        let getAll = await DB.collection("sports").find().project({ name: 1, _id: 0 }).toArray()  //toArray() convert panathan getall varum
        console.log("getAll===>", getAll)

        //    let getAllCount=await DB.collection("sports").estimatedDocumentCount() // "find" no use only count  this use "estimatedDocumentCount","countDocuments"
        //    console.log("getAllCount",getAllCount)
        // Jwt use


        // DB.post('/player/generateToken',(req,res)=>{
        //     try{
        //         console.log("ENTER create player")
        //         let jwtSecretKey=process.env.JWT_SECRET_KEY
        //         console.log("jwtSecretKey===>",jwtSecretKey)
        //         let data ={
        //             playerName:"Nellai",
        //             jerceyNo:3,
        //             gameName:["cricket",'football']
        //         }
        //         const token=jwt.sign(data,jwtSecretKey)
        //         console.log("token===>",token)
        //         res.send(token)
        //     }catch(error){
        //         console.log("catchError",error)
        //     }
        // })


        // console.log("jwtSecretKey===>",jwtSecretKey)
        // let playerData ={
        //                 playerName:"Nellai",
        //                 jerceyNo:3,
        //                 gameName:["cricket",'football']
        //             }
        // Token create: 
        // const token=jwt.sign(playerData,jwtSecretKey)
        // console.log("token==>",token)
        // generateToken
        // await DB.collection("players").insertOne({token:token})

        // verification of JWT:
        // token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwbGF5ZXJOYW1lIjoiTmVsbGFpIiwiamVyY2V5Tm8iOjMsImdhbWVOYW1lIjpbImNyaWNrZXQiLCJmb290YmFsbCJdLCJpYXQiOjE3Mzk2MDE0OTd9.cW04wSPw3ZFuQD_YEsABJ5M5TjXbC1Zr3YZuz3_z0nU"
        // const verify=jwt.verify(token,jwtSecretKey)
        // console.log("verify===>",verify)
        // verify===> {
        //     playerName: 'Nellai',
        //     jerceyNo: 3,
        //     gameName: [ 'cricket', 'football' ],
        //     iat: 1739601497
        //   }
        //   The value of the "iat" claim must be a timestamp that is registered with the authorization server

        // app.post('/create', async (req, res) => {
        //     console.log("ENTER app")
        //     console.log("req.body", req.body)
        //     let token = jwt.sign(req.body, jwtSecretKey)
        //     console.log("token===>", token)
        //     let data = {}
        //     data = req.body
        //     data.token = token
        //     console.log("data===>", data)
        // await client.db(dbName).command({ ping: 1 });

        //     console.log("DBBB", DB)
        //     let createPlayer = await DB.collection('players').insertOne(data)
        //     console.log("createPlayer==>", createPlayer)
        //     let verification = jwt.verify(token, jwtSecretKey)
        //     console.log("verification===>", verification)
        //     res.json(verification)
        // })


    } catch (error) {
        console.log("catch===<>", error)
        return error
    } finally {
        dbClose()
    }

}


// app.post('/create',async(req,res)=>{
//     console.log("ENTER app")
//     console.log("req.body",req.body)
//     let token=jwt.sign(req.body,jwtSecretKey)
//     console.log("token===>",token)
//     let data={}
//     data=req.body
//     data.token=token
//     console.log("data===>",data)
//     console.log("DB",typeof(DB))
//     let createPlayer=await DB.collection('players').insertOne(data)
//     console.log("createPlayer==>",createPlayer)
//     let verification=jwt.verify(token,jwtSecretKey)
//     console.log("verification===>",verification)
//     res.json(verification)
// })




crudOperation()
// console.log("createComplte")

