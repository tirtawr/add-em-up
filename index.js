const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server);
const port = 80

app.use(express.static('public'))

app.get('/ping', (req, res) => res.send('pong'))

server.listen(port, () => console.log(`AddEmUp running on port ${port}!`))



