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


  // function to handle error 
const errorHandler = (error, req, res, next) => {
    console.error('error.name:', error.name)
    console.log("error.message:", error.message)
    if (error.name === 'CastError'){
        return res.status(404).json({
            error: "mal formatted id"
        })
    }else if(error.name === 'ValidatorError'){
        return res.status(404).json({
            error: error.message
        })
    }
}

// handler for unknown endpoints
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}


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

//get one contact 
app.get("/api/persons/:id", (req, res)=>{
    Person.findById(req.params.id)
        .then(person => {
            if (person){
                return res.json(person)
            }
            res.status(404).json({
                error: "person not found / could have also used end() method without a message."
            })
            
        })
        .catch(error =>{
            console.log(error)
            next(error)
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
        })
        .catch(error => {
            console.log(error)
            next(error)
        })
})

// handle updating contact
app.put("./api/persons/:id", (req, res)=>{
    const {name, number} = req.body
    const person = {name, number}
    Person.findByIdAndUpdate(req.params.id, person, {new: true})
})




app.delete("/api/persons/:id", (req, res)=>{
    
    Person.findByIdAndDelete(req.params.id)
        .then(() => {
        res.status(204).json({
            message: "person deleted"
        })
        })
        .catch(error =>{
            console.log(error)
            next(error)
        })
})

// info 
app.get("/info", (req, res)=>{

    Person.find({})
        .then(persons => {
            const totalPersons = persons.length
            const text = `Phonebook has info for ${persons.length} ${totalPersons> 1 ? "people": "person"}.`
            const timeNow = new Date()
            res.send(`<div><p>${text}</p><p>${timeNow}</p></div>`)
        })
        .catch(error =>{
            console.log(error)
            res.status(500).json({
                error: "servre is down/unable to reach"
            })
        })
})

app.use(unknownEndpoint)
app.use(errorHandler)





app.listen(PORT, ()=>{
    console.log(`Server is running on address http://localhost:${PORT}`)
})


