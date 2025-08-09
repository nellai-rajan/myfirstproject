console.log("ENTER MAIN")
require("./dbconnection.js")
require('./all_controller/users.js')
// const crud=require("./crud.js")
require ('./all_controller/room-games.js')
require('./all_controller/ground-games.js')

require('./all_controller/getDatakafka.js')
require('./all_controller/kafka.js')


require('./all_controller/redis.js')

require('./utils/product-pdf.js')

const app=require('./express.js')
require('dotenv').config()
const PORT=process.env.PORT
app.listen(PORT,()=>{
    console.log("Server is running on port ",PORT) 
})
