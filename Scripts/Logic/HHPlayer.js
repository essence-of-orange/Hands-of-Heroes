class HHPlayer {
    //Constructor
    constructor(name, position, faction){
        //Initialise variables
        this.name = name;
        this.position = position;
        this.faction = faction;
        this.deck = [];
        this.hand = [];
        this.champion = null;
        this.changeling = null;
        this.dungeon = [];
        this.hasSelected = false;
        this.hasAdvanced = false;

        //Create deck
        for(let i = 1; i < 17; i++){
            this.deck.push(new HHCard(faction, i));
        }

        //Create hand
        for(let i = 0; i < 4; i++){
            this.hand.push(null);
        }

        //Shuffle deck three times for good luck
        this.shuffleDeck();
        this.shuffleDeck();
        this.shuffleDeck();
    }

    //Shuffle deck
    shuffleDeck(){
        //Swap values
        let j = 0;
        let swapTemp = null;

        //Iterate through deck
        for(let i = 0; i < this.deck.length; i++){
            //Generate random index
            j = Math.floor((Math.random() * 16));

            //Swap cards
            swapTemp = this.deck[i];
            this.deck[i] = this.deck[j];
            this.deck[j] = swapTemp;
        }
    }
}