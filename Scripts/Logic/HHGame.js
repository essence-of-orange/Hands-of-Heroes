class HHGame {
    //Constructor
    constructor(players) {
        //Initialise game data
        this.players = [];
        this.turn = 0;

        //Initialise players
        for (let i = 0; i < players.length; i++) {
            this.players.push(new HHPlayer());
        }
    }
}