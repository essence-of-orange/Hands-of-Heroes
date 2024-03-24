class HHGame {
    //////////////////
    //  CONSTRUCTOR //
    //////////////////
    constructor(engine, players, animationSpeed) {
        //Initialise game data
        this.engine = engine;
        this.players = [];
        this.animBase = 1000;
        this.animLength = 0;
        this.timerLength = 0;
        this.phase = "setup";
        this.timer = 0;
        this.waiting = false;
        this.battleStarted = false;
        this.exchange = null;
        this.complete = false;
        this.positions = [
            [0],
            [0],
            [0, 4],
            [0, 3, 5],
            [0, 2, 4, 6],
            [0, 1, 3, 5, 7],
            [0, 1, 3, 4, 5, 7],
            [0, 1, 2, 3, 5, 6, 7],
            [0, 1, 2, 3, 4, 5, 6, 7, 8]
        ];

        //Initialise animation length
        //"Instant" is still given a low speed to prevent errors
        if (animationSpeed == 0) {
            this.animLength = this.animBase;
        } else if (animationSpeed == 1) {
            this.animLength = this.animBase / 2;
        } else if (animationSpeed == 2) {
            this.animLength = this.animBase / 4;
        } else if (animationSpeed == 3) {
            this.animLength = 16;
        }
        this.timerLength = this.animLength * 1.5

        //Initialise players
        for (let i = 0; i < players.length; i++) {
            this.players.push(new HHPlayer(
                players[i].name,
                this.positions[players.length][i],
                players[i].faction));
        }

        //Create player data
        let playerData = []
        for (let i = 0; i < this.players.length; i++) {
            playerData.push({
                name: this.players[i].name,
                position: this.players[i].position,
                faction: this.players[i].faction,
                staticCards: [
                    {
                        //Deck
                        faction: 8,
                        value: 0,
                        defeated: false,
                        position: 0
                    }
                ],
                dynamicCards: []
            });
        }

        //Send table data to players
        for (let i = 0; i < this.players.length; i++) {
            //Create table data object
            let tableData = {
                position: this.players[i].position,
                animLength: this.animLength,
                players: playerData
            };

            //Check index
            if (i == 0) {
                //Send player data to host
                this.engine.initTable(tableData);
            } else {
                //Send player data to guest
                this.engine.sendPlayer({
                    type: "table_data",
                    tableData: tableData
                }, i);
            }
        }

        //Randomly select initial belligerant
        this.belligerant = Math.floor(Math.random() * this.players.length);
        this.active = this.belligerant;

        //Update phase
        this.phase = "recruitment";
    }

    //////////////
    //  UPDATE  //
    //////////////
    update() {
        //Check if game is complete
        if (this.complete) {
            return;
        }

        //Check if waiting for player input
        if (this.waiting) {
            return;
        }

        //Check ongoing animation
        if (this.timer > 0) {
            this.timer -= time.deltaTime;
            return;
        }

        //Check overshoot
        if (this.timer < 0) {
            this.timer = 0;
        }

        //Check if dealing
        if (this.phase == "recruitment") {
            //Send UI update
            this.sendUI(this.active, "");

            //Iterate through players
            for (let i = 0; i < this.players.length; i++) {
                //Check player has cards in deck
                if (this.players[i].deck.length > 0) {
                    //Iterate through hand
                    for (let j = 0; j < this.players[i].hand.length; j++) {
                        //Check hand position
                        if (this.players[i].hand[j] == null) {
                            //Deal card
                            this.dealCard(i, j);
                            return;
                        }
                    }
                }
            }

            //Check endgame
            for (let i = 0; i < this.players.length; i++) {
                //Check deck and hand
                if (this.players[i].deck.length == 0 & this.players[i].hand.length == 0) {
                    //Begin exchange
                    this.exchange = new HHExchange();
                    this.phase = "ransoming"
                    return;
                }
            }

            //All players have been dealt their hands, move to next phase
            this.phase = "selection";

            //Clear hasSelected value on players
            for (let i = 0; i < this.players.length; i++) {
                this.players[i].hasSelected = false;
            }
        }

        //Check if selecting cards
        if (this.phase == "selection") {
            //Check overshoot
            if (this.active >= this.players.length) {
                this.active = 0;
            }

            //Check if active player has already selected
            if (this.players[this.active].hasSelected) {
                //Selection complete. Check if sidhe player exists and has changeling
                for (let i = 0; i < this.players.length; i++) {
                    //Check player
                    if (this.players[i].faction == 4 & this.players[i].changeling != null) {
                        //Ask sidhe player to swap changeling
                        this.active = i;
                        this.sendUI(this.active, "swap_changeling");
                        this.waiting = true;
                        return;
                    }
                }

                //Move to next phase
                this.phase = "battle";
                return;
            } else {
                //Selection is ongoing, check if active player has selected champion
                if (this.players[this.active].champion == null) {
                    //Invite player to choose champion
                    this.sendUI(this.active, "select_champion");
                    this.waiting = true;
                    return;
                }

                //Check if active player is sidhe and has selected changeling
                if (this.players[this.active].faction == 4 & this.players[this.active].changeling == null) {
                    //Check if player has at least one eligable card
                    let champVal = this.players[this.active].champion.value;
                    let minVal = champVal - 4;
                    let maxVal = champVal + 4;
                    for (let i = 0; i < 4; i++) {
                        //Check card is not null
                        if (this.players[this.active].deck[i] != null) {
                            //Get value
                            let changVal = this.players[this.active].deck[i].value;

                            //Check value is within range
                            if (changVal >= minVal & changVal <= maxVal) {
                                //Suitable card found, invite player to choose changeling
                                this.sendUI(this.active, "select_changeling");
                                this.waiting = true;
                                return;
                            }
                        }
                    }
                }

                //Mark player as having selected and move to next player
                this.players[this.active].hasSelected = true;
                this.nextActive();
                return;
            }
        }

        //Check ongoing battle
        if (this.phase == "battle") {
            //Check battle exists
            if (this.battleStarted == false) {
                //Advance belligerant champion to throne
                this.ascendThrone(this.belligerant, 9, null);

                //Record advance
                this.players[this.belligerant].hasAdvanced = true;

                //Record start of battle
                console.log("Starting battle");
                this.battleStarted = true;
                return;
            }

            //Check victory
            if (this.checkVictory()) {
                //Battle complete, perform cleanup
                console.log("Battle complete! Time to clean up");
                this.cleanBattlefield();

                //Move to next phase
                this.battleStarted = false;
                this.active = this.belligerant;
                this.phase = "recruitment";
            }

            //Check if player is belligerant or defeated
            if (this.players[this.active].champion.defeated == true | this.active == this.belligerant) {
                //Move to next player
                console.log("player " + this.active + " defeated/belligerant, moving to next player")
                this.nextActive();
                return;
            }

            //Check if player has advanced to the gate
            if (this.players[this.active].hasAdvanced == false) {
                console.log("Advancing player " + this.active);
                this.advanceGate();
                return;
            }

            //Calculate player strengths
            let throneStrength = this.calcStrength(this.belligerant, this.active);
            let gateStrength = this.calcStrength(this.active, this.belligerant);
            console.log("Thronestrength = " + throneStrength);
            console.log("Gatestrength = " + gateStrength);

            //Compare strengths
            if (throneStrength > gateStrength) {
                console.log("Throne wins, forcing challenger to retreat");
                //Incumbant remains, rival is defeated
                this.retreatGate();
                return;
            } else if (gateStrength > throneStrength) {
                console.log("Gate wins, forcing throne to retreat");
                //Rival is victorious, incumbant defeated
                this.ascendThrone(this.active, 17, this.belligerant);
                return;
            } else {
                console.log("Possible stalemate");
                //Possibly stalemate, check if either player is a dwarf
                if (this.players[this.belligerant].faction == 3) {
                    console.log("Throne wins, forcing challenger to retreat");
                    //Incumbant remains, rival is defeated
                    this.retreatGate();
                    return;
                } else if (this.players[this.active].faction == 3) {
                    console.log("Gate wins, forcing throne to retreat");
                    //Rival is victorious, incumbant defeated
                    this.ascendThrone(this.active, 17, this.belligerant);
                    return;
                } else {
                    console.log("Stalemate, working out the result");
                    //Stalemate
                    this.handleStalemate();
                }
            }
        }

        //Check ongoing ransoming
        if (this.exchange != null) {
            if (this.exchange.complete != true) {
                this.exchange.update();
                return;
            } else {
                //Game over, switch to victory
                console.log("To do");
                this.complete = true;
                return;
            }
        }
    }

    //Move to next active player
    nextActive() {
        //Increment active
        this.active++;

        //Check for overshoot
        if (this.active >= this.players.length) {
            this.active = 0;
        }

        //Send UI update
        this.sendUI(this.active, "");
    }

    //////////////////////////
    //  BATTLE FUNCTIONS    //
    //////////////////////////

    //Calculate strength of player's champion
    calcStrength(playerIndex, opponentIndex) {
        //Find value
        let playerStrength = this.players[playerIndex].champion.value;

        //Check if champion is vampire royalty
        if (this.players[playerIndex].faction == 1 & playerStrength >= 13) {
            //Set initial corpse value
            let corpseCount = 0;

            //Count corpses
            for (let i = 0; i < this.players.length; i++) {
                //Check for corpse
                if (this.players[i].champion.defeated & i != playerIndex) {
                    //Corpse discovered
                    corpseCount++
                }
            }

            //Add to strength
            playerStrength += corpseCount;
        }

        //Check if assassin active
        if (playerStrength == 1 & this.players[opponentIndex].champion.value >= 13) {
            playerStrength = 17;
        }

        //Return result
        return playerStrength;
    }

    //Check if belligerant has remaining rivals
    checkVictory() {
        //Iterate through players
        for (let i = 0; i < this.players.length; i++) {
            //Check if belligerant
            if (i != this.belligerant) {
                //Check if champion is defeated
                if (this.players[i].champion.defeated == false) {
                    //At least one rival remains, return false
                    return false;
                }
            }
        }

        //No rivals could be found, return true
        return true;
    }

    //Causes active champion to advance to gate
    advanceGate() {
        //Record state
        this.players[this.active].hasAdvanced = true;

        //Get values
        let champFac = this.players[this.active].faction;
        let champVal = this.players[this.active].champion.value;

        //Move card
        this.moveCard(this.active, 9, this.active, 9, 17, champFac, champVal, champFac, champVal, false, "none");
    }

    //Causes active champion to retreat from gate
    retreatGate() {
        //Record defeat
        this.players[this.active].champion.defeated = true;

        //Get values
        let champFac = this.players[this.active].faction;
        let champVal = this.players[this.active].champion.value;

        //Move card
        this.moveCard(this.active, 17, this.active, 17, 9, champFac, champVal, champFac, champVal, true, "none");

        //Set new active
        this.nextActive();
    }

    //Causes designated champion to ascend throne
    ascendThrone(newBelligerant, newOrigin, oldBelligerant) {
        //Check if previous belligerant exists
        if (oldBelligerant != null) {
            //Record defeat
            this.players[oldBelligerant].champion.defeated = true;

            //Set values
            let oldChampFac = this.players[oldBelligerant].faction;
            let oldChampVal = this.players[oldBelligerant].champion.value;

            //Move card
            this.moveCard(oldBelligerant, 18, oldBelligerant, 18, 9, oldChampFac, oldChampVal, oldChampFac, oldChampVal, true, "none");
        }

        //Set new belligerant
        this.belligerant = newBelligerant;

        //Set new active
        this.active = newBelligerant;
        this.nextActive();

        //Set values
        let newChampFac = this.players[newBelligerant].faction;
        let newChampVal = this.players[newBelligerant].champion.value;

        this.moveCard(newBelligerant, newOrigin, newBelligerant, newOrigin, 18, newChampFac, newChampVal, newChampFac, newChampVal, false, "none");
    }

    //Deals with stalemate between gate and throne
    handleStalemate() {
        //Record defeat
        this.players[this.active].champion.defeated = true;
        this.players[this.belligerant].champion.defeated = true;

        //Get values
        let oldChampFac = this.players[this.belligerant].faction;
        let oldChampVal = this.players[this.belligerant].champion.value;
        let newChampFac = this.players[this.active].faction;
        let newChampVal = this.players[this.active].champion.value;

        //Move cards
        this.moveCard(this.belligerant, 18, this.belligerant, 18, 9, oldChampFac, oldChampVal, oldChampFac, oldChampVal, true, "none");
        this.moveCard(this.active, 17, this.active, 17, 9, newChampFac, newChampVal, newChampFac, newChampVal, true, "none");

        //Search for new belligerant
        for (let i = this.belligerant + 1; i != this.belligerant; i++) {
            //Check for overshoot
            if (i >= this.players.length) {
                i = 0;
            }

            //Check for undefeated
            if (this.players[i].champion.defeated == false) {
                //Enthrone new belligerant
                this.ascendThrone(i, 9, null);
                return;
            }
        }
    }

    //Clean up after battle
    cleanBattlefield() {
        console.log("Cleaning up battlefield");
        //Check for stalemate
        if (this.players[this.belligerant].champion.defeated) {
            console.log("Battle stalemated");
            //Return all champions to owners' dungeon
            for (let i = 0; i < this.players.length; i++) {
                //Get values
                let champFac = this.players[i].faction;
                let champVal = this.players[i].champion.value;

                //Send champion to own dungeon
                this.players[i].dungeon.push(this.players[i].champion);
                this.players[i].champion = null;

                //Send card to own dungeon
                this.moveCard(i, 9, i, 9, 19, champFac, champVal, champFac, champVal, true, "none");
            }
        } else {
            console.log("Player " + this.belligerant + " won the battle");
            //Return belligerant's champion to his hand and the rest to his dungeon (with some exceptions)
            for (let i = 0; i < this.players.length; i++) {
                //Get values
                let champFac = this.players[i].faction;
                let champVal = this.players[i].champion.value;
                console.log("Dealing with the champion of player " + i);
                console.log("Champion faction = " + champFac);
                console.log("Champion value = " + champVal);

                //Check if belligerant
                if (i == this.belligerant) {
                    console.log("This champion belongs to the winning player, returning to hand");
                    //Find first empty slot in hand
                    let destination = 0;
                    for (let j = 0; j < 4; j++) {
                        //Check slot
                        if (this.players[this.belligerant].hand[j] == null) {
                            destination = j;
                            console.log("Destination slot found at slot " + destination);
                            break;
                        }
                    }

                    //Return champion to hand
                    this.players[this.belligerant].hand[i] = this.players[this.belligerant].champion;
                    this.players[this.belligerant].champion = null;

                    console.log("The champion should be returned to hand in data now");
                    console.log("Champion:");
                    console.log(this.players[this.belligerant].champion);
                    console.log("Hand slot " + destination + ":");
                    console.log(this.players[this.belligerant].hand[i]);

                    //Return card to hand
                    this.moveCard(this.belligerant, 18, this.belligerant, 18, destination + 1, champFac, champVal, 8, 0, false, "down");
                    console.log("In theory we just returned the winning champion from throne to hand.");
                    return;
                } else {
                    console.log("This champion belongs to a loser, dealing accordingly");
                    //Check if champion is hobbit
                    if (champFac == 7) {
                        //Check if able to escape
                        if (champVal * 2 < this.players[this.belligerant].champion.value) {
                            //Send champion to own dungeon
                            this.players[i].dungeon.push(this.players[i].champion);
                            this.players[i].champion = null;

                            //Send card to own dungeon
                            this.moveCard(i, 9, i, 9, 19, champFac, champVal, champFac, champVal, true, "none");
                            continue;
                        }
                    }

                    //Check if champion is unicorn
                    if (champFac == 0) {

                    }

                    //Send champion to dungeon
                    this.players[this.belligerant].dungeon.push(this.players[i].champion);
                    this.players[i].champion = null;

                    //Calculate origin
                    let champOrigin = 9 + i;
                    if (i > this.belligerant) {
                        champOrigin -= this.belligerant;
                    } else {
                        champOrigin += (8 - this.belligerant);
                    }

                    //Remove old card
                    this.moveCard(i, 9, this.belligerant, champOrigin, 19, champFac, champVal, champFac, champVal, true, "none");
                    return;
                }
            }
        }
    }

    //////////////////////////
    //  SELECTION FUNCTIONS //
    //////////////////////////

    //Allows players to send a champion to the arena
    selectChampion(playerIndex, selectedIndex) {
        //Unsuspend game
        this.waiting = false;

        //Record selection
        this.players[playerIndex].champion = this.players[playerIndex].hand[selectedIndex - 1];
        this.players[playerIndex].hand[selectedIndex - 1] = null;

        //Move card
        let newVal = this.players[playerIndex].champion.value;
        let newFac = this.players[playerIndex].faction;
        this.moveCard(playerIndex, selectedIndex, playerIndex, selectedIndex, 9, newFac, newVal, newFac, newVal, false, "up");
    }

    //Allows sidhe players to select changeling
    selectChangeling(playerIndex, selectedIndex) {
        //Check if selection declined
        if (selectedIndex == -1) {
            //Unsuspend game
            this.waiting = false;

            //Mark player as having selected and move to next player
            this.players[playerIndex].hasSelected = true;
            this.nextActive();
        } else {
            //Unsuspend game
            this.waiting = false;

            //Record selection
            this.players[playerIndex].changeling = this.players[playerIndex].hand[selectedIndex - 1];
            this.players[playerIndex].hand[selectedIndex - 1] = null;

            //Move card
            let newFac = this.players[playerIndex].faction;
            let newVal = this.players[playerIndex].changeling.value;
            this.moveCard(playerIndex, selectedIndex, playerIndex, selectedIndex, selectedIndex + 4, newFac, newVal, 8, 0, false, "none");
        }
    }

    //Allows sidhe players to swap changeling card into arena
    swapChangeling(playerIndex, decision, swapIndex) {
        //Check decision
        if (decision == false) {
            //Unsuspend game
            this.waiting = false;

            //Return changeling to hand
            this.players[playerIndex].hand[swapIndex - 5] = this.players[playerIndex].changeling;

            //Move card
            let newFac = this.players[playerIndex].faction;
            let newVal = this.players[playerIndex].hand[swapIndex - 5].value;
            this.moveCard(playerIndex, swapIndex, playerIndex, swapIndex, swapIndex - 4, newFac, newVal, 8, 0, false, "none");
        } else {
            //Unsuspend game
            this.waiting = false;

            //Record swap
            this.players[playerIndex].hand[swapIndex - 5] = this.players[playerIndex].champion;
            this.players[playerIndex].champion = this.players[playerIndex].changeling;
            this.players[playerIndex].changeling = null;

            //Move cards
            let newFac = this.players[playerIndex].faction;
            let newChampVal = this.players[playerIndex].champion.value;
            let oldChampVal = this.players[playerIndex].hand[swapIndex - 5].value;
            this.moveCard(playerIndex, swapIndex, playerIndex, swapIndex, 9, newFac, newChampVal, newFac, newChampVal, false, "up");
            this.moveCard(playerIndex, 9, playerIndex, 9, swapIndex - 4, newFac, oldChampVal, newFac, oldChampVal, false, "down");
        }

        //Move to next phase
        this.phase == "battle";
    }

    //////////////////////////////
    //  COMMUNICATION FUNCTIONS //
    //////////////////////////////

    //Desseminates UI update
    sendUI(activePlayer, UIState) {
        //Record active player
        this.active = activePlayer;

        //Check if host is active player
        if (activePlayer == 0) {
            //Send active UI update to host
            this.engine.updateUI({
                activePlayer: activePlayer,
                UIState: UIState
            });
        } else {
            //Send inactive UI update to host
            this.engine.updateUI({
                activePlayer: activePlayer,
                UIState: ""
            });
        }

        //Iterate through players
        for (let i = 1; i < this.players.length; i++) {
            //Check if player is active
            if (activePlayer == i) {
                //Send active UI update to player
                this.engine.sendPlayer({
                    type: "update_UI",
                    UIData: {
                        activePlayer: activePlayer,
                        UIState: UIState
                    }
                }, i);
            } else {
                //Send inactive UI update to player
                this.engine.sendPlayer({
                    type: "update_UI",
                    UIData: {
                        activePlayer: activePlayer,
                        UIState: ""
                    }
                }, i);
            }
        }
    }

    //Deals a card from the deck to specified player
    dealCard(playerIndex, cardIndex) {
        //Set timer
        this.timer = this.timerLength;

        //Create dynamicCards
        let newVisibleCard = {
            faction: this.players[playerIndex].faction,
            value: this.players[playerIndex].deck[this.players[playerIndex].deck.length - 1].value,
            origin: 0,
            destination: cardIndex + 1,
            defeated: false,
            flip: "up",
            progress: 0
        };
        let newHiddenCard = {
            faction: 8,
            value: 0,
            origin: 0,
            destination: cardIndex + 1,
            defeated: false,
            flip: "none",
            progress: 0
        }

        //Deal card to hand
        this.players[playerIndex].hand[cardIndex] = this.players[playerIndex].deck.pop();

        //Check if deck is now empty
        if (this.players[playerIndex].deck.length == 0) {
            //Remove deck from table
            this.engine.removeCard({
                playerIndex: playerIndex,
                position: 0
            });
        }

        //Check if host can see card
        if (playerIndex == 0 | this.players[0].faction == 6) {
            //Send visible animation to host
            this.engine.addCard({
                playerIndex: playerIndex,
                newCard: newVisibleCard
            });
        } else {
            //Send hidden animation to host
            this.engine.addCard({
                playerIndex: playerIndex,
                newCard: newHiddenCard
            });
        }

        //Iterate through players
        for (let i = 1; i < this.players.length; i++) {
            //Check if player can see card
            if (playerIndex == i | this.players[i].faction == 6) {
                //Send visible animation to player
                this.engine.sendPlayer({
                    type: "add_card",
                    cardData: {
                        playerIndex: playerIndex,
                        newCard: newVisibleCard
                    }
                }, i);
            } else {
                //Send hidden animation to player
                this.engine.sendPlayer({
                    type: "add_card",
                    cardData: {
                        playerIndex: playerIndex,
                        newCard: newHiddenCard
                    }
                }, i);
            }
        }
    }

    //Moves card from one location to another
    moveCard(oldPlayer, oldPosition, newPlayer, origin, destination, visFac, visVal, hidFac, hidVal, defeated, flip) {
        //Set timer
        this.timer = this.timerLength;

        //Create dynamic card
        let newVisible = {
            faction: visFac,
            value: visVal,
            origin: origin,
            destination: destination,
            defeated: defeated,
            flip: "none",
            progress: 0
        };
        let newHidden = {
            faction: hidFac,
            value: hidVal,
            origin: origin,
            destination: destination,
            defeated: defeated,
            flip: flip,
            progress: 0
        };

        //Remove source card from host
        this.engine.removeCard({
            playerIndex: oldPlayer,
            position: oldPosition
        });

        //Check if host can see source card
        if (newPlayer == 0 | this.players[0].faction == 6) {
            //Send animation to host
            this.engine.addCard({
                playerIndex: newPlayer,
                newCard: newVisible
            });
        } else {
            //Send animation to host
            this.engine.addCard({
                playerIndex: newPlayer,
                newCard: newHidden
            });
        }

        //Iterate through players
        for (let i = 1; i < this.players.length; i++) {
            //Remove source card from player
            this.engine.sendPlayer({
                type: "remove_card",
                cardData: {
                    playerIndex: oldPlayer,
                    position: oldPosition
                }
            }, i);

            //Check if new player can see source card
            if (newPlayer == i | this.players[i].faction == 6) {
                //Send animation to player
                this.engine.sendPlayer({
                    type: "add_card",
                    cardData: {
                        playerIndex: newPlayer,
                        newCard: newVisible
                    }
                }, i);
            } else {
                //Send animation to player
                this.engine.sendPlayer({
                    type: "add_card",
                    cardData: {
                        playerIndex: newPlayer,
                        newCard: newHidden
                    }
                }, i);
            }
        }
    }
}