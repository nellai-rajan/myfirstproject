const { dbconnect } = require('../dbconnection.js')
const roomGames=require('../all_schemas/room-game.schma.js')
const {Parser}=require('json2csv')
const app=require('../express.js')
dbconnect()

app.post('/createRoomGame',async(req,res)=>{
    try{
        console.log("req---->",req.body)
        let create=await roomGames.create(req.body)
        console.log("create---->",create)
        res.send(create)
    }catch(error){
        console.log("catchError",error)
        res.send(error)
    }
})

app.get('/getAllRoomGame',async(req,res)=>{
    console.log("req===>",req)
    queryData={}
    console.log("req.params",req.params)
    console.log("req.query",req.query)
    if(req.query.gameName){
        queryData={
            ...queryData,
            gameName: req.query.gameName
        }
    }
    if(req.query.players){
        queryData={
            ...queryData,
            players:req.query.players
        }
    }
   console.log("queryData===>",queryData)
   let count=await roomGames.countDocuments(queryData)
   console.log("count===>",count)
    let getAll=await roomGames.find(queryData)
    console.log("getAll===>",getAll)
    res.send(getAll)
})

app.get("/getById/:id",async(req,res)=>{
    console.log("req===>",req.params.id)
    // let getOne=await roomGames.findById(req.params.id) //directly find _id
    let getOne=await roomGames.findOne({_id:req.params.id}) //_id is passing
    console.log(getOne)
    res.send(getOne)
})


app.get("/export/packagefile",async(req,res)=>{
    console.log("req===>",req)
    queryData={}
    if(req.query.gameName){
        queryData={
            ...queryData,
            gameName: req.query.gameName
        }
    }
    if(req.query.players){
        queryData={
            ...queryData,
            players:req.query.players
        }
    }

    let option=[
        {
            label:"GameName",
            value:"gameName"
        },
        {
            label:"How_Many_Players",
            value:"players"
        }
    ]
    let count=await roomGames.countDocuments(queryData)
    console.log("count===>",count)
    let data= await roomGames.find(queryData)

   const json2csvparser=new Parser({fields:option.map(opt=>opt.value)})
   const csv =json2csvparser.parse(data)
    res.writeHead(200,{
        'content-type':'text/csv',
        'content-disposition':'attachement;filename=roomGame.csv'
    })
    res.end(csv)

})

app.get('/export/file',async(req,res)=>{ 
//    res.setHeader(
//     "Content-Disposition",
//     `attchment;filename=roomGame-${Date.now()}.csv`
//    )
   res.writeHead(200,{
    "content-type":"text/csv",
    "Content-Disposition":`attchment;filename=roomGame-${Date.now()}.csv`
   })

   const header=["gameName","How_Many_Players","HI","WHO"]

   res.write(header.join(',')+"\n")
   const count=await roomGames.countDocuments()
   console.log("count--->",count)
   const getData=await roomGames.find().select({gameName:1,players:1}).lean()

   const rows=getData.map(value=>{
         return header.map(head=>{
            if(head=="How_Many_Players"){
                return value["players"] || ""
            }
                return value[head] ||'' //this only head and key is same get panum.
            }).join(",")
   }).join(","+"\n")

   console.log("rows----",rows)
   res.write(rows)

//    await Promise.all(rows)
   res.end()

})