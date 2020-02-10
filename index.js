// implement your API here
const express = require('express');

const users = require('./data/db');

const server = express();

server.use(express.json());

server.post('/api/users', (req, res) => {
    const body = req.body;
    if(!body.name || !body.bio) {
        res.status(400).json({ errorMessage: "Please provide name and bio for the user." })
    } else {
        users.insert(body).then(user => {
            res.status(201).json(user)
        }).catch(err => {
            console.log(err)
            res.status(500).json({ errorMessage: "There was an error while saving the user to the database" })
        })
    }
})

server.get('/api/users', (req, res) => {
    users.find().then(users => {
        res.status(201).json(users)
    }).catch(err => {
        console.log(err)
        res.status(500).json({ errorMessage: "The users information could not be retrieved." })
    })
})

server.get('/api/users/:id', (req, res) => {
    users.findById(req.params.id).then(user => {
        if(user) {
            res.status(200).json(user)
        } else {
            res.status(404).json({ message: "The user with the specified ID does not exist." })
        }
    }).catch(err => {
        console.log(err)
        res.status(500).json({ errorMessage: "The user information could not be retrieved." })
    })
})

server.delete('/api/users/:id', (req, res) => {
    users.remove(req.params.id).then(removed => {
        if(removed) {
            res.status(200).json(removed)
        } else {
            res.status(404).json({ message: "The user with the specified ID does not exist." })
        }
    }).catch(err => {
        console.log(err)
        res.status(500).json({ errorMessage: "The user could not be removed." })
    })
})

server.put('/api/users/:id', (req, res) => {
    const body = req.body;
    users.update(req.params.id, body).then(updated => {
        if(updated !== 1) {
            res.status(404).json({ message: "The user with the specified ID does not exist." })
        } else if (!body.name || !body.bio) {
            res.status(400).json({ errorMessage: "Please provide name and bio for the user." })
        } else {
            res.status(200).json(updated)
        }
    }).catch(err => {
        console.log(err)
        res.status(500).json({ errorMessage: "The user could not be removed." })
    })
})

const port = 5000;
server.listen(port, () => console.log(`\n** API on port ${port} \n`))