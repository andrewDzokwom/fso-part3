require('dotenv').config()
const express = require("express")
const morgan  = require("morgan")
const cors = require("cors")
const Person = require("./models/person.js")

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.static('dist'))
app.use(cors())
app.use(express.json())

app.get("/", (req, res)=>{
    res.send("<h1>This is the HomePage</h1>")
})
 
// get list of contacts 
app.get("/api/persons", (req, res) =>{
    Person.find({}).then(persons => {
        res.json(persons)
    }).catch(error => {
        console.log(error)
        res.status(400).json({
            error: "unable to reach "
        })
    })
})

// add contact to the list
app.post("/api/persons",  (req, res)=> {
    const {name, number}= req.body
    // check if name and number are both empty
    if (!name.trim() && !number.trim()){
        return   res.status(404).json({
                error: "name and number is missing"
            })
    }
    //check if only  number is empty
    if(!number.trim()){
        return   res.status(404).json({
                error: "number is missing"
            })
    }
    // check if only name is empty
    if (!name.trim()){
        return res.status(404).json({
            error: "name is missing"
        })
    }

    // check for  duplication or add if there is any (name only)
    Person.find({name})
        .then(returnedPerson => {

        const isEmpty = returnedPerson.length === 0
        if (!isEmpty){
            const errorMessage = {
                error: "name must be unique"
            }
            res.status(400).json(errorMessage)
        }else{
            const  newPerson = new Person({ name, number})
            newPerson.save().then(savedPerson =>{
                res.json(savedPerson)
            })
            
        }
    }).catch(error => {
        console.log(error)
        res.status(400).json({
            error: "unable to reach "
        })
    })

async function getTotalPersons(){
    const persons  = await Person.find({}).then(persons => persons)
    return await persons.length
}

app.get("/info", (req, res)=>{
    const totalPersons = getTotalPersons()
    const text = `Phonebook has info for ${totalPersons} ${totalPersons> 1 ? "people": "person"}.`
    const timeNow = new Date()
    res.send(`<p>${text}</p><p>${timeNow}</p>`)
})
app.get("/api/persons/:id", (req, res)=>{
    Person.findById(req.params.id)
        .then(person => {
            if (person){
                res.json(person)
            }else{
                res.status(404).json({
                    error: "person not found / could have also used end() method without a message."
                })
            }
        })
        .catch(error =>{
            console.log(error)
            res.status(404).json({
                error: "malformatted id"
            })
        })
})

app.delete("/api/persons/:id", (req, res)=>{
    const personId = req.params.id
    const personToDelete = persons.find(person => person.id === personId)
    if (!personToDelete){
        res.status(404).end()
    }
    persons = persons.filter(person => person.id !== personId)
    res.status(204).end()
})

function generateId(){
    const generatedId = Math.floor(Math.random()*100)
    if (!(persons.find(person => person.id === String(generatedId)))){
        return generatedId
    }
    generateId()
}

app.use(morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      JSON.stringify(req.body)
    ].join(' ')
  }))


    
    // if (!body.name.trim() || !body.number.trim()){
    //     const errorMessage = {
    //         error: "name or number is empty"
    //     }
    //     res.status(400).json(errorMessage)
    // }else if(Person.find({name: body.name}.then(person => person.length > 0))){
    //     const errorMessage = {
    //         error: "name must be unique"
    //     }
    //     res.status(400).json(errorMessage)
    // }else{
    //     const  person = new Person({
    //         name: body.name,
    //         number: body.number
    //     })
        
    //     person.save().then(savedPerson =>{
    //         res.json(person)
    //     })
    // }
})

app.listen(PORT, ()=>{
    console.log(`Server is running on address http://localhost:${PORT}`)
})


