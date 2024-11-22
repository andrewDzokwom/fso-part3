const express = require("express")
const { get } = require("http")

const app = express()
const PORT = 3001

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get("/", (req, res)=>{
    res.send("<h1>This is the HomePage</h1>")
})

app.get("/api/persons", (req, res) =>{
    res.json(persons)
})

function getTotalPersons(){
    return persons.length
}

app.get("/info", (req, res)=>{
    const totalPersons = getTotalPersons()
    const text = `Phonebook has info for ${totalPersons} ${totalPersons> 1 ? "people": "person"}.`
    const timeNow = new Date()
    res.send(`<p>${text}</p><p>${timeNow}</p>`)
})
app.get("/api/persons/:id", (req, res)=>{
    const personId = req.params.id
    const person = persons.find(person => person.id === personId)
    if (person){
        res.send(person)
        return
    }
    res.status(404).end()
})

app.listen(PORT, ()=>{
    console.log("This is a confirmation  it is running!")
})


