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
        const currentRound = status['current_round']
        const currentTurnInRound = status['current_turn_in_round']
        const currentRoundTurnStart = (currentRound - 1) * 3

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

        // Update team running sum
        for (let i = 1; i <= 3; i++) {
            $(`#running-total-text-${i}`).html(
                status['running_sum_for_current_round'][`team_${i}`]
            )
        }

        // Update submissions
        for (let teamIndex = 1; teamIndex <= 3; teamIndex++) {
            for (let turnIndex = 1; turnIndex <= 3; turnIndex++) {
                for (let playerIndex = 1; playerIndex <= 4; playerIndex++) {
                    const totalTurnIndex = currentRoundTurnStart + turnIndex - 1
                    if (status['players'][`team_${teamIndex}`][playerIndex-1] && status['players'][`team_${teamIndex}`][playerIndex-1]['submissions'][totalTurnIndex] > 0) {
                        $(`#submission-text-${teamIndex}-${turnIndex}-${playerIndex}`).html(
                            status['players'][`team_${teamIndex}`][playerIndex-1]['submissions'][totalTurnIndex]
                        )
                    } else {
                        $(`#submission-text-${teamIndex}-${turnIndex}-${playerIndex}`).html(
                            '?'
                        )
                    }
                    
                }
            }   
        }
    }

    function getStars(points) {
        switch (points) {
            case 0:
                return '☆☆☆☆';
            case 1:
                return '★☆☆☆';
            case 2:
                return '★★☆☆';
            case 3:
                return '★★★☆';
            case 4:
                return '★★★★';
            default:
                return '☆☆☆☆';
        }
    }

    setInterval(refreshStatusReport, 100);

});

