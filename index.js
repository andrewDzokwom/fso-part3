const express = require("express")

const app = express()
const PORT = 3001

app.use(express.json())

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
        res.json(person)
    }
    res.status(404).end()
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



app.post("/api/persons", (req, res)=> {
    const body= req.body
    
    if (!body.name || !body.number){
        const errorMessage = {
            error: "name or number is empty"
        }
        res.status(400).json(errorMessage)
    }else if(persons.find(person => person.name === body.name)){
        const errorMessage = {
            error: "name mus be unique"
        }
        res.status(400).json(errorMessage)
    }else{
        const  person = body
        person.id = String(generateId())
        persons = persons.concat(person)
        res.json(person)
    }
})

app.listen(PORT, ()=>{
    console.log(`Server is running on address http://localhost:${PORT}`)
})


