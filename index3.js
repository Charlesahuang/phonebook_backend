const express = require("express");
const morgan = require("morgan");
const app = express();

app.use(morgan("tiny"));

let phonebook = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (request, response) => {
  response.json(phonebook);
});

app.get("/info", (request, response) => {
  const currentTime = new Date();
  const infoMessage = `<p>Phonebook has info for ${phonebook.length} people</p><p>${currentTime}</p>`;

  response.send(infoMessage);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = phonebook.find((person) => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  phonebook = phonebook.filter((person) => person.id !== id);

  response.status(204).end();
});

const generateId = () => {
  const min = 1;
  const max = 1000000;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({ error: "Name and number are required" });
  }

  const existingPerson = phonebook.find((person) => person.name === body.name);

  if (existingPerson) {
    return response.status(400).json({ error: "Name must be unique" });
  }

  const newPerson = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  phonebook = phonebook.concat(newPerson);

  response.json(newPerson);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
