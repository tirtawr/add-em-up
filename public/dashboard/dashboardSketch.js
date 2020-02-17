$(document).ready(function () {
    let socket = io('/dashboard')

    

    socket.on('status-response', function (status) {
        window.gameState = status
        updateDisplayWithStatus(status)
    })

    refreshStatusReport = function () {
        socket.emit('status-request', '')
    }

    function updateDisplayWithStatus(status) {
        // Update round target
        if (status['current_stage'] == 'END_GAME') {
            $(`#current-target`).html('Thanks For Playing!')
        } else if (status['current_round'] == 0){
            $(`#current-target`).html('Welcome!')
        } else {
            if (status['current_target'] > 0) {
                $(`#current-target`).html(`Target: ${status['current_target']}`)
            } else {
                $(`#current-target`).html('')
            }
        }

        // Update team stars
        for (let i = 1; i <= 3; i++) {
            $(`#point-text-${i}`).html(getStars(status['scores'][`team_${i}`]))
        }

        // Update team running su,
        for (let i = 1; i <= 3; i++) {
            $(`#running-total-text-${i}`).html(
                (status['running_sum_for_current_round'][`team_${i}`])
            )
        }
    }

    function getStars(points) {
        switch (points) {
            case 0:
                return '☆☆☆☆☆';
            case 1:
                return '★☆☆☆☆';
            case 2:
                return '★★☆☆☆';
            case 3:
                return '★★★☆☆';
            case 4:
                return '★★★★☆';
            case 5:
                return '★★★★★';
            default:
                return '☆☆☆☆☆';
        }
    }

    // function updateDisplay() {
    //     hideAllDivs()
    //     switch (currentDisplayState) {
    //         case 'CHOOSE_TEAM':
    //             $("#login-buttons").show()
    //             break;
    //         case 'KEYPAD':
    //             $("#keypad").show()
    //             break;
    //         case 'SPLASH':
    //             $("#splash-text").show()
    //             break;
    //         case 'END_GAME':
    //             $("#game-over-text").show()
    //             break;
    //         default:
    //             break;
    //     }
    // }

    // function hideAllDivs() {
    //     $("#login-buttons").hide()
    //     $("#keypad").hide()
    //     $("#splash-text").hide()
    //     $("#game-over-text").hide()
    // }

    setInterval(refreshStatusReport, 100);

});

