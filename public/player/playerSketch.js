$(document).ready(function () {
    let socket = io('/player')

    

    // Listen for confirmation of connection
    socket.on('connect', function () {
        console.log("Connected")
    })

    let currentDisplayState = 'CHOOSE_TEAM'
    updateDisplay()

    register = function (teamNumber) {
        socket.emit('register', { team: teamNumber })
        currentDisplayState = 'SUBMIT_NUMBER'
        updateDisplay()
    }

    submit = function(submittedNumber) {
        socket.emit('submit', { submittedNumber: submittedNumber })
        currentDisplayState = 'IDLE'
        updateDisplay()
    }

    function updateDisplay() {
        hideAllDivs()
        switch (currentDisplayState) {
            case 'CHOOSE_TEAM':
                $("#login-buttons").show()
                break;
            case 'SUBMIT_NUMBER':
                $("#keypad").show()
                break;
            case 'IDLE':
                $("#splash-text").show()
                break;
            default:
                break;
        }
    }

    function hideAllDivs() {
        $("#login-buttons").hide()
        $("#keypad").hide()
        $("#splash-text").hide()
    }

});

