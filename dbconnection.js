console.log("Enter db file")
const mongoose=require("mongoose")
const url = "mongodb://127.0.0.1:27017/MyDb"

// const { MongoClient } = require("mongodb")
// const client = Mongoose(url);
// let dBConnect



async function dbconnect() {
    try {
        await mongoose.connect(url)
        // dbName = "MyDb"
        // dBConnect = client.db(dbName)
        console.log("DB Succesfully Connected")
    }
    catch (error) {
        console.log("dbConnectCatchError", error)
    }
    // finally{
    //     await mongoose.connection.close()
    // }
}
// function dbClose() {
//     client.close()
// }

dbconnect()
// module.exports = { dbconnect, getDB: () => dBConnect, dbClose }
module.exports={dbconnect}
