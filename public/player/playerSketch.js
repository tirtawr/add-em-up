$(document).ready(function () {
    let socket = io('/player')

    

    // Listen for confirmation of connection
    socket.on('connect', function () {
        console.log("Connected")
    })

    // Receive message from server
    socket.on('instruction', function (message) {
        const instruction = message.instruction;
        console.log(`received instruction ${instruction}`)
        switch (instruction) {
            case 'SPLASH':
                window.currentDisplayState = 'SPLASH'
                updateDisplay()
                break;
            case 'KEYPAD':
                window.currentDisplayState = 'KEYPAD'
                startCountDown()
                updateDisplay()
                break;
            case 'END_GAME':
                window.currentDisplayState = 'END_GAME'
                updateDisplay()
                break;
            default:
                console.error(`Received unknown instruction [${instruction}]`)
                break;
        }
    });

    window.currentDisplayState = 'CHOOSE_TEAM'
    updateDisplay()

    register = function (teamNumber) {
        $("#team-number").html(`Team ${teamNumber}`)
        socket.emit('register', { team: teamNumber })
        window.currentDisplayState = 'SPLASH'
        updateDisplay()
    }

    submit = function(submittedNumber) {
        socket.emit('submit', { submittedNumber: submittedNumber })
        window.currentDisplayState = 'SPLASH'
        updateDisplay()
    }

    function startCountDown() {
        let distance = 7000;
        $("#countdown").html(5)
        let interval = setInterval(() => {
            distance -= 1000
            const seconds = Math.floor(distance / 1000);
            $("#countdown").html(seconds)

            if (distance <= 0) {
                console.log('countdown over')
                console.log('window.currentDisplayState', window.currentDisplayState)
                if (window.currentDisplayState != 'SPLASH') {
                    console.log('random number submitted')
                    submit(generateRandomSubmission())
                }
                clearInterval(interval);
                $("#countdown").html('Add Em Up')
            }
        }, 950); //make it a little bit faster just to be safe
    }

    function generateRandomSubmission() {
        return Math.floor(Math.random() * 6) + 1 
    }

    function updateDisplay() {
        hideAllDivs()
        switch (window.currentDisplayState) {
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

