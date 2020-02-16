class GameService {
    
    constructor() {
        this.players = {};
        this.currentStage = 'IDLE'
    }

    register(player) {
        this.players[player.id] = player
    }

    deregister(playerId) {
        delete this.players[playerId]
    }


    getCurrentStage() {
        return this.currentStage
    }

    getAllStatus() {
        return {
            'current_stage': this.currentStage,
            'players': this.players
        }
    }
}

module.exports = new GameService();