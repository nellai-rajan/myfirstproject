// const { dbconnect } = require('../dbconnection.js')
// dbconnect()
// require('dotenv').config()
// const PORT=process.env.PORT


// const kafka = require('kafka-node');
// const client = new kafka.KafkaClient({ kafkaHost: 'localhost:9092' });

// console.log("ENTER GET DATA")
// // Create a Consumer instance
// const consumer = new kafka.Consumer(
//     client,
//     [{ topic: 'test-topic', partition: 0 }], // Replace 'test-topic' with your topic name
//     { autoCommit: true }
// );
// console.log("------>")
// // Event listener to receive messages
// consumer.on('message', (message) => {
//     console.log("MESSAGE===>")
//     console.log("Received message", message);
// });
// // consumer.addListener("test-topic",()=>{
// //     console.log("MESSAGE===>")

// // })

// // Error handling
// consumer.on('error', (err) => {
//     console.error('Error:', err);
// });