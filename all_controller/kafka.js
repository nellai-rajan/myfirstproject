// console.log("Enter kafka")
// const { dbconnect } = require('../dbconnection.js')
// dbconnect()

// require('dotenv').config()
// const PORT=process.env.PORT

// const kaffka=require('kafka-node')

// const client=new kaffka.KafkaClient({kafkaHost:'localhost:9092'})
// // console.log("client===>",client)
// client.on('ready',()=>{
//     console.log("kafka client connected...")
// })
// client.on('error',()=>{
//     console.log("clienterror===>",error)
// })
// const producer=new kaffka.Producer(client)
// console.log("producer---->")

// producer.on('ready',()=>{
//     console.log("ENTER producer")
//     producer.send([{topic:"test-topic",messages:"helllo kaffka"}],
//         (err,data)=>{
//             try{
//                 console.log("errrr",err)
//                 console.log("send data==>",data)
//             }catch(catcherr){
//                 console.log("catcherr",catcherr)
//             }
       
//     })
// })
// producer.on('error', (err) => {
//     console.log("err=====>",err);
// });
// client.emit("ready",)//manully broker connect



