$(document).ready(function () {
    let socket = io('/player')

    

    // Listen for confirmation of connection
    socket.on('connect', function () {
        console.log("Connected")
    })

    // Receive message from server
    socket.on('instruction', function (message) {
        const instruction = message.instruction;
        switch (instruction) {
            case 'SPLASH':
                currentDisplayState = 'SPLASH'
                updateDisplay()
                break;
            case 'KEYPAD':
                currentDisplayState = 'KEYPAD'
                updateDisplay()
                break;
            case 'END_GAME':
                currentDisplayState = 'END_GAME'
                updateDisplay()
                break;
            default:
                console.error(`Received unknown instruction [${instruction}]`)
                break;
        }
    });

    let currentDisplayState = 'CHOOSE_TEAM'
    updateDisplay()

    register = function (teamNumber) {
        socket.emit('register', { team: teamNumber })
        currentDisplayState = 'SPLASH'
        updateDisplay()
    }

    submit = function(submittedNumber) {
        socket.emit('submit', { submittedNumber: submittedNumber })
        currentDisplayState = 'SPLASH'
        updateDisplay()
    }

    function updateDisplay() {
        hideAllDivs()
        switch (currentDisplayState) {
            case 'CHOOSE_TEAM':
                $("#login-buttons").show()
                break;
            case 'KEYPAD':
                $("#keypad").show()
                break;
            case 'SPLASH':
                $("#splash-text").show()
                break;
            case 'END_GAME':
                $("#game-over-text").show()
                break;
            default:
                break;
        }
    }

    function hideAllDivs() {
        $("#login-buttons").hide()
        $("#keypad").hide()
        $("#splash-text").hide()
        $("#game-over-text").hide()
    }

});

