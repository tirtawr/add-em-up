$(document).ready(function () {
    let socket = io('/admin')

    

    // Listen for confirmation of connection
    socket.on('connect', function () {
        console.log("Connected")
    })

    socket.on('status-response', function (status) {
        var node = new PrettyJSON.view.Node({
            el: $('#status-report'),
            data: status
        });
        node.expandAll()
    })

    sendInstruction = function(instruction) {
        socket.emit('instruction', { instruction: instruction })
    }

    addScore = function (teamNumber) {
        socket.emit('score-adjustment', { teamNumber: teamNumber, amount: 1 })
    }

    subtractScore = function (teamNumber) {
        socket.emit('score-adjustment', { teamNumber: teamNumber, amount: -1 })
    }

    refreshStatusReport = function() {
        socket.emit('status-request', '')  
    }

    setInterval(refreshStatusReport, 100);

});

