const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io').listen(server)
const port = 3000

// Services
const gameService = require('./services/gameService')

let playerSockets = io.of('/player')
let players = {}

playerSockets.on('connection', function (playerSocket) {
	console.log('A player client connected: ' + playerSocket.id)

	playerSocket.on('register', function (data) {
		gameService.register({
			id: playerSocket.id,
			team: data.team
		})

		console.log('A player client has registered ' + playerSocket.id)
	})

	
	
	playerSocket.on('disconnect', function () {
		gameService.deregister(playerSocket.id)
		console.log('A player client has disconnected ' + playerSocket.id)
	})
})

let dashboardSockets = io.of('/dashboard')

dashboardSockets.on('connection', function (dashboardSocket) {
	console.log('A dashboard client connected: ' + dashboardSocket.id)

	dashboardSocket.on('disconnect', function () {
		console.log('A dashboard client has disconnected ' + dashboardSocket.id)
	})
})



app.get('/ping', function(req, res) {
    res.send('pong')
})

app.get('/status', function(req, res) {
    res.json(gameService.getAllStatus())
})

app.get('/splash', function (req, res) {
	playerSockets.emit('instruction', {
		instruction: 'splash'
	});
	res.send('ok, splash')
})

app.get('/keypad', function (req, res) {
	playerSockets.emit('instruction', {
		instruction: 'keypad'
	});
	res.send('ok, keypad')
})

app.get('/game-over', function (req, res) {
	playerSockets.emit('instruction', {
		instruction: 'game-over'
	});
	res.send('ok, game-over')
})

	

app.use(express.static('public'))

server.listen(port, () => console.log(`Express app listening on port ${port}!`))



