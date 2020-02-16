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
            case 'splash':
                currentDisplayState = 'SPLASH'
                updateDisplay()
                break;
            case 'keypad':
                currentDisplayState = 'KEYPAD'
                updateDisplay()
                break;
            case 'game-over':
                currentDisplayState = 'GAME_OVER'
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
        currentDisplayState = 'KEYPAD'
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
            case 'GAME_OVER':
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

