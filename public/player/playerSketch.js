let socket = io('/player');

// Listen for confirmation of connection
socket.on('connect', function () {
    console.log("Connected");
});

register = function (teamNumber) {
    socket.emit('register', { team: teamNumber });
}