const mongoose = require('mongoose')
require('dotenv'),config()

const url = process.env.MONGODB_URI

console.log('connecting to:', url)
mongoose.connect(url)
    .then(result =>{
        console.log('connectedd to database')
    })
    .catch(error =>{
        console.log('failed to connect to database', error.message)
    })

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

module.exports = mongoose.model("Person", personSchema)