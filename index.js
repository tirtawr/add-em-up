const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io').listen(server)
const port = 3000

// Services
const gameService = require('./services/gameService')


// Player Socket
let playerSockets = io.of('/player')
playerSockets.on('connection', function (playerSocket) {
	console.log('A player client connected: ' + playerSocket.id)

	playerSocket.on('register', function (data) {
		gameService.register({
			id: playerSocket.id,
			team: data.team,
			submissions: [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1 ]
		})
		console.log('A player client has registered ' + playerSocket.id)
	})
	
	playerSocket.on('submit', function (data) {
		gameService.submitNumber(playerSocket.id, data.submittedNumber)
		console.log('A player client has disconnected ' + playerSocket.id)
	})

	playerSocket.on('disconnect', function () {
		gameService.deregister(playerSocket.id)
		console.log('A player client has disconnected ' + playerSocket.id)
	})
})


// Status Socket
let statusSockets = io.of('/status')
statusSockets.on('connection', function (statusSocket) {
	statusSocket.on('status-request', function (data) {
		statusSockets.emit('status-response', gameService.getAllStatus());
	})
})

// Admin Socket
let adminSockets = io.of('/admin')
adminSockets.on('connection', function (adminSocket) {
	console.log('An admin client connected: ' + adminSocket.id)

	adminSocket.on('instruction', function (data) {
		const instruction = data.instruction
		switch (instruction) {
			case 'END_GAME':
				gameService.endGame()
				playerSockets.emit('instruction', {
					instruction: 'END_GAME'
				});
				break;
			case 'START_TURN':
				playerSockets.emit('instruction', {
					instruction: 'KEYPAD'
				});
				gameService.startTurn(function () {
					playerSockets.emit('instruction', {
						instruction: 'SPLASH'
					});
				})
				break;
			default:
				console.error(`[Error] Unknown instruction [${instruction}] received from admin client`)
				break;
		}
	})

	adminSocket.on('status-request', function (data) {
		adminSockets.emit('status-response', gameService.getAllStatus());
	})

	adminSocket.on('disconnect', function () {
		console.log('An admin client has disconnected ' + adminSocket.id)
	})
})


// Rest API
app.get('/ping', function(req, res) {
    res.send('pong')
})

app.get('/status', function(req, res) {
    res.json(gameService.getAllStatus())
})

app.use(express.static('public'))

server.listen(port, () => console.log(`Express app listening on port ${port}!`))



