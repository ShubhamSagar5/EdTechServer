const mongoose = require('mongoose')

require('dotenv').config() 

const Connectdb = () => {
    mongoose.connect(process.env.DATABASE_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    })
    .then(()=>{
        console.log("Database Connect Successfully")
    })
    .catch((err)=>{
        console.log("Something Error Occur During Database Connecting" + err.message)
        process.exit(1)
    })
}