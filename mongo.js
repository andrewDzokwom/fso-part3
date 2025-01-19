const  mongoose = require('mongoose')



// if (process.argv.length < 5){
//     console.log('provide the arguments un the following order: node mongo.js <password> <name> <number>')
//     process.exit(1)
// }

const password = process.argv[2]
 mongoose.set('strictQuery', false)

const url = `mongodb+srv://phonebook:${password}@cluster0.xbvxt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

//connect to db
mongoose.connect(url)

// create the schema
const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

// create the model
const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 5){
    // create new person 
    const person =  new Person({
        name:process.argv[3],
        number: process.argv[4]
    })


    person.save().then((person)=>{
        console.log(`added ${person.name} number ${person.number} to the phonebook`)
        //close the connection
        mongoose.connection.close()
    })

}



if (process.argv.length === 3){
    Person.find({}).then(result =>{
        console.log('phonebook:')
        result.forEach(person =>{
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
}

