class GameService {
    
    constructor() {
        this.players = {};
        this.currentStage = 'IDLE'
        this.currentTurn = 0
        this.scores = {
            1: 0,
            2: 0,
            3: 0
        }
        this.TURN_DURATION = 5000
        this.MAX_TURNS_PER_ROUND = 3
    }

    adjustScore(teamNumber, amount) {
        this.scores[teamNumber] += amount
    }

    register(player) {
        this.players[player.id] = player
    }

    deregister(playerId) {
        delete this.players[playerId]
    }

    submitNumber(playerId, number) {
        if(this.currentStage == 'KEYPAD') {
            this.players[playerId]['submissions'][this.currentTurn-1] = number
        } else {
            console.error('[Error] submitNumber called while not in keypad round')
        }
    }

    endGame() {
        this.currentTurn = 0
    }

    startTurn(callback) {
        this.currentStage = 'KEYPAD'
        this.currentTurn++
        setTimeout(() => { // arrow function required here for context
            this.currentStage = 'SPLASH'
            callback()
        }, this.TURN_DURATION);
    }


    getCurrentStage() {
        return this.currentStage
    }

    getAllStatus() {
        return {
            'current_stage': this.currentStage,
            'current_round': Math.ceil(this.currentTurn / this.MAX_TURNS_PER_ROUND),
            'current_turn_in_round': ((this.currentTurn - 1) % this.MAX_TURNS_PER_ROUND) + 1,
            'current_turn_total': this.currentTurn,
            'player_count': Object.keys(this.players).length,
            'scores': this.scores,
            'players': this.players
        }
    }
}

module.exports = new GameService();