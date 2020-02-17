class GameService {
    
    constructor() {
        this.players = {}
        this.currentStage = 'IDLE'
        this.currentTotalTurn = 0
        this.scores = {
            team_1: 0,
            team_2: 0,
            team_3: 0
        }
        this.TURN_DURATION = 7000
        this.MAX_TURNS_PER_ROUND = 3
        this.POSSIBLE_TARGETS = [13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109]

        let shuffle = function (array) {
            let currentIndex = array.length
            let temporaryValue, randomIndex
            // While there remain elements to shuffle...
            while (0 !== currentIndex) {
                // Pick a remaining element...
                randomIndex = Math.floor(Math.random() * currentIndex)
                currentIndex -= 1
                // And swap it with the current element.
                temporaryValue = array[currentIndex]
                array[currentIndex] = array[randomIndex]
                array[randomIndex] = temporaryValue
            }
            return array
        }

        this.targets = shuffle(this.POSSIBLE_TARGETS)
    }

    adjustScore(teamNumber, amount) {
        this.scores[`team_${teamNumber}`] += amount
    }

    register(player) {
        this.players[player.id] = player
    }

    deregister(playerId) {
        delete this.players[playerId]
    }

    submitNumber(playerId, number) {
        if(this.currentStage == 'KEYPAD') {
            this.players[playerId]['submissions'][this.currentTotalTurn-1] = number
        } else {
            console.error('[Error] submitNumber called while not in keypad round')
        }
    }

    endGame() {
        this.currentTotalTurn = 0
        this.currentStage = 'END_GAME'
    }

    startTurn(callback) {
        this.currentStage = 'KEYPAD'
        this.currentTotalTurn++
        setTimeout(() => { // arrow function required here for context
            this.currentStage = 'SPLASH'
            callback()
        }, this.TURN_DURATION)
    }


    getCurrentStage() {
        return this.currentStage
    }

    normalizedPlayers() {
        const result = {
            team_1_count: 0,
            team_2_count: 0,
            team_3_count: 0,
            team_1: [],
            team_2: [],
            team_3: []
        }

        for (const playerId in this.players) {
            if (this.players.hasOwnProperty(playerId)) {
                const player = this.players[playerId]
                result[`team_${player.team}`].push(player)
            }
        }

        for (let i = 1; i <= 3; i++) {
            result[`team_${i}_count`] = result[`team_${i}`].length
        }
        return result
    }

    getRunningSumForTurn(teamIndex, turnIndex) {
        const players = this.normalizedPlayers()
        let runningSum = 0;
        let playersInTeam = players[`team_${teamIndex}`]
        for (let playerIndex = 0; playerIndex < playersInTeam.length; playerIndex++) {
            const player = playersInTeam[playerIndex];
            if (player.submissions[turnIndex] > 0) {
                runningSum += player.submissions[turnIndex] 
            }        
        }
        return runningSum
    }

    runningSumForCurrentRound() {
        const currentRound = Math.ceil(this.currentTotalTurn / this.MAX_TURNS_PER_ROUND)
        const currentTurnInRound = ((this.currentTotalTurn - 1) % this.MAX_TURNS_PER_ROUND) + 1
        const currentRoundTurnStart = (currentRound - 1) * 3
        const currentRoundTurnEnd = currentRoundTurnStart + currentTurnInRound

        let result = {
            team_1: 0,
            team_2: 0,
            team_3: 0
        }
        
        for (let teamIndex = 1; teamIndex <= 3; teamIndex++) {
            for (let turnIndex = currentRoundTurnStart; turnIndex < currentRoundTurnEnd; turnIndex++) {
                result[`team_${teamIndex}`] += this.getRunningSumForTurn(teamIndex, turnIndex)
            }
        }
        return result
    }

    getAllStatus() {
        const currentRound = Math.ceil(this.currentTotalTurn / this.MAX_TURNS_PER_ROUND)
        const currentTurnInRound = ((this.currentTotalTurn - 1) % this.MAX_TURNS_PER_ROUND) + 1
        const normalizedPlayers = this.normalizedPlayers()
        return {
            'current_stage': this.currentStage,
            'current_target': this.targets[currentRound+1],
            'current_round': currentRound,
            'current_turn_in_round': currentTurnInRound,
            'current_turn_total': this.currentTotalTurn,
            'running_sum_for_current_round': this.runningSumForCurrentRound(),
            'player_count': Object.keys(this.players).length,
            'scores': this.scores,
            'players': normalizedPlayers
        }
    }

}

module.exports = new GameService();