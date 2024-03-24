//Displays game screen
class HHTable {
    //Constructor
    constructor(gameEngine) {
        //Data variables
        this.engine = gameEngine;
        this.players = [];
        this.activePlayer = null;
        this.selected = null;

        //UI variables
        this.fadeDirection = "in";
        this.UIState = "";
        this.animLength = 500;
        this.animHalf = Math.floor(this.animLength / 2);
        this.cardWidth = 56;
        this.cardHalf = this.cardWidth / 2;
        this.cardHeight = 84;
        this.cardBorder = 4;
        this.perspectiveRotation = 0 * Math.PI / 180;
        this.seatRotations = [
            0 * Math.PI / 180,
            45 * Math.PI / 180,
            90 * Math.PI / 180,
            135 * Math.PI / 180,
            180 * Math.PI / 180,
            225 * Math.PI / 180,
            270 * Math.PI / 180,
            315 * Math.PI / 180];

        //Position data
        this.positions = [
            //0: Deck
            {
                x: 45,
                y: 190,
                r: 0 * Math.PI / 180
            },
            //1: Hand 1
            {
                x: -60,
                y: 190,
                r: 0 * Math.PI / 180
            },
            //2: Hand 2
            {
                x: -45,
                y: 190,
                r: 0 * Math.PI / 180
            },
            //3: Hand 3
            {
                x: -30,
                y: 190,
                r: 0 * Math.PI / 180
            },
            //4: Hand 4
            {
                x: -15,
                y: 190,
                r: 0 * Math.PI / 180
            },
            //5: Changeling Hand 1
            {
                x: -60,
                y: 180,
                r: 0 * Math.PI / 180
            },
            //6: Changeling Hand 2
            {
                x: -45,
                y: 180,
                r: 0 * Math.PI / 180
            },
            //7: Changeling Hand 3
            {
                x: -30,
                y: 180,
                r: 0 * Math.PI / 180
            },
            //8: Changeling Hand 4
            {
                x: -15,
                y: 180,
                r: 0 * Math.PI / 180
            },
            //9: Arena 1
            {
                x: -this.cardHalf,
                y: 90,
                r: 0 * Math.PI / 180
            },
            //10: Arena 2
            {
                x: -this.cardHalf,
                y: 90,
                r: 45 * Math.PI / 180
            },
            //11: Arena 3
            {
                x: -this.cardHalf,
                y: 90,
                r: 90 * Math.PI / 180
            },
            //12: Arena 4
            {
                x: -this.cardHalf,
                y: 90,
                r: 135 * Math.PI / 180
            },
            //13: Arena 5
            {
                x: -this.cardHalf,
                y: 90,
                r: 180 * Math.PI / 180
            },
            //14: Arena 6
            {
                x: -this.cardHalf,
                y: 90,
                r: 225 * Math.PI / 180
            },
            //15: Arena 7
            {
                x: -this.cardHalf,
                y: 90,
                r: 270 * Math.PI / 180
            },
            //16: Arena 8
            {
                x: -this.cardHalf,
                y: 90,
                r: 315 * Math.PI / 180
            },
            //17: Gate
            {
                x: -this.cardHalf,
                y: 75,
                r: 0 * Math.PI / 180
            },
            //18: Throne
            {
                x: -this.cardHalf,
                y: Math.floor(-this.cardHeight / 2),
                r: 0 * Math.PI / 180
            },
            //19: Dungeon
            {
                x: -60,
                y: 500,
                r: 0 * Math.PI / 180
            }
        ];

        //Button variables
        this.buttondata = {
            width: 140,
            height: 50,
            startX: 645,
            endX: 645 + 140,
            textX: 645 + 67,
            top: 480,
            bottom: 540
        }
        this.buttons = [
            {
                width: this.buttondata.width,
                height: this.buttondata.height,
                startX: this.buttondata.startX,
                startY: this.buttondata.bottom,
                endX: this.buttondata.endX,
                endY: this.buttondata.bottom + this.buttondata.height,
                textX: this.buttondata.textX,
                textY: this.buttondata.bottom + this.buttondata.height / 2,
                name: "Pick Champion",
                enabled: false
            },
            {
                width: this.buttondata.width,
                height: this.buttondata.height,
                startX: this.buttondata.startX,
                startY: this.buttondata.top,
                endX: this.buttondata.endX,
                endY: this.buttondata.top + this.buttondata.height,
                textX: this.buttondata.textX,
                textY: this.buttondata.top + this.buttondata.height / 2,
                name: "Pick Changeling",
                enabled: false
            },
            {
                width: this.buttondata.width,
                height: this.buttondata.height,
                startX: this.buttondata.startX,
                startY: this.buttondata.bottom,
                endX: this.buttondata.endX,
                endY: this.buttondata.bottom + this.buttondata.height,
                textX: this.buttondata.textX,
                textY: this.buttondata.bottom + this.buttondata.height / 2,
                name: "Decline",
                enabled: true
            },
            {
                startX: 400 + this.positions[1].x,
                startY: 300 + this.positions[1].y,
                endX: 400 + this.positions[1].x + this.cardWidth,
                endY: 300 + this.positions[1].y + this.cardHeight,
                name: "Hand 1",
                enabled: false
            },
            {
                startX: 400 + this.positions[2].x,
                startY: 300 + this.positions[2].y,
                endX: 400 + this.positions[2].x + this.cardWidth,
                endY: 300 + this.positions[2].y + this.cardHeight,
                name: "Hand 2",
                enabled: false
            },
            {
                startX: 400 + this.positions[3].x,
                startY: 300 + this.positions[3].y,
                endX: 400 + this.positions[3].x + this.cardWidth,
                endY: 300 + this.positions[3].y + this.cardHeight,
                name: "Hand 3",
                enabled: false
            },
            {
                startX: 400 + this.positions[4].x,
                startY: 300 + this.positions[4].y,
                endX: 400 + this.positions[4].x + this.cardWidth,
                endY: 300 + this.positions[4].y + this.cardHeight,
                name: "Hand 4",
                enabled: false
            },
            {
                width: this.buttondata.width,
                height: this.buttondata.height,
                startX: this.buttondata.startX,
                startY: this.buttondata.top,
                endX: this.buttondata.endX,
                endY: this.buttondata.top + this.buttondata.height,
                textX: this.buttondata.textX,
                textY: this.buttondata.top + this.buttondata.height / 2,
                name: "Swap Changeling",
                enabled: true
            },
            {
                width: this.buttondata.width,
                height: this.buttondata.height,
                startX: this.buttondata.startX,
                startY: this.buttondata.bottom,
                endX: this.buttondata.endX,
                endY: this.buttondata.bottom + this.buttondata.height,
                textX: this.buttondata.textX,
                textY: this.buttondata.bottom + this.buttondata.height / 2,
                name: "Decline",
                enabled: true
            }
        ];
    }

    //////////////////////////
    //  GRAPHIC FUNCTIONS   //
    //////////////////////////

    //Draw graphics
    draw() {
        //Blank canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        //Draw background
        ctx.drawImage(loader.tableBG, 0, 0);

        //Draw player objects
        this.drawPlayers();

        //Check UI state
        if (this.UIState == "select_champion") {
            //Draw champion selection button
            buttonDraw(this.buttons[0]);
        } else if (this.UIState == "select_changeling") {
            //Draw changeling selection buttons
            buttonDraw(this.buttons[1]);
            buttonDraw(this.buttons[2]);
        } else if (this.UIState == "swap_changeling") {
            //Draw changeling swap buttons
            buttonDraw(this.buttons[7]);
            buttonDraw(this.buttons[8]);
        }

        //Fade
        fade(this.fadeDirection);

        //Check exit
        if (this.fadeDirection == "out" & fadeValue == fadeMax) {
            //Restore fade direction
            this.fadeDirection = "in";

            //Exit
            gameManager.showVictory();
        }
    }

    //Draws player objects
    drawPlayers() {
        //Iterate through players
        for (let i = 0; i < this.players.length; i++) {
            //Save transform
            ctx.save();

            //Translate to center
            ctx.translate(canvas.width / 2, canvas.height / 2);

            //Rotate to player
            ctx.rotate(this.perspectiveRotation);
            ctx.rotate(this.seatRotations[this.players[i].position]);

            //Set variables for name
            if (this.activePlayer == i) {
                ctx.fillStyle = "AntiqueWhite";
            } else {
                ctx.fillStyle = "rgb(75, 70, 55)";
            }
            ctx.font = "bold 16px 'mainFont'";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            //Calculate relative position
            let relPos = Math.abs((this.perspectiveRotation + this.seatRotations[this.players[i].position]) * (180 / Math.PI));

            //Check relative position
            if (relPos > 90 & relPos < 270) {
                //Draw text upside down

                ctx.save();
                ctx.rotate(Math.PI);
                ctx.fillText(
                    this.players[i].name,
                    0,
                    -290);
                ctx.restore();
            } else {
                //Draw text upright
                ctx.fillText(
                    this.players[i].name,
                    0,
                    295);
            }


            //Iterate through static cards
            for (let j = 0; j < this.players[i].staticCards.length; j++) {
                //Draw card
                this.drawStaticCard(i, j);
            }

            //Iterate through animated cards
            for (let j = 0; j < this.players[i].dynamicCards.length; j++) {

                //Draw card
                this.drawDynamicCard(i, j);

                //Update card
                if (this.updateCard(i, j)) {
                    //Decrement index
                    j--;
                }
            }

            //Restore transform
            ctx.restore();
        }
    }

    //Draws non moving cards
    drawStaticCard(playerIndex, cardIndex) {
        //Get values
        let newPos = this.players[playerIndex].staticCards[cardIndex].position;
        let newFac = this.players[playerIndex].staticCards[cardIndex].faction;
        let newVal = this.players[playerIndex].staticCards[cardIndex].value;

        //Check for defeated
        if (this.players[playerIndex].staticCards[cardIndex].defeated == true) {
            //Update faction
            newFac = 9;
        }

        //Save transform
        ctx.save();

        //Rotate into position
        ctx.rotate(this.positions[newPos]);

        //Draw card
        ctx.drawImage(
            loader.cardBGs[newFac],
            this.positions[newPos].x,
            this.positions[newPos].y,
            this.cardWidth,
            this.cardHeight
        );
        ctx.drawImage(
            loader.cardValues[newVal],
            this.positions[newPos].x,
            this.positions[newPos].y,
            this.cardWidth,
            this.cardHeight
        );

        //Check active and selected
        if (this.activePlayer == playerIndex & this.players[playerIndex].staticCards[cardIndex].position == this.selected) {
            //Draw border
            ctx.strokeStyle = "AntiqueWhite";
            ctx.lineWidth = this.cardBorder;
            ctx.strokeRect(
                this.positions[newPos].x,
                this.positions[newPos].y,
                this.cardWidth,
                this.cardHeight);
        }

        //Restore transform
        ctx.restore();
    }

    //Draws animated cards
    drawDynamicCard(playerIndex, cardIndex) {
        //Get values
        let newFac = this.players[playerIndex].dynamicCards[cardIndex].faction;
        let newVal = this.players[playerIndex].dynamicCards[cardIndex].value;
        let newPro = this.players[playerIndex].dynamicCards[cardIndex].progress;
        let newFlip = this.players[playerIndex].dynamicCards[cardIndex].flip;
        let origPos = this.players[playerIndex].dynamicCards[cardIndex].origin;
        let destPos = this.players[playerIndex].dynamicCards[cardIndex].destination;

        //Check for defeated
        if (this.players[playerIndex].dynamicCards[cardIndex].defeated == true) {
            //Update faction
            newFac = 9;
        }

        //Calculate intermediate values
        let startX = this.positions[origPos].x;
        let startY = this.positions[origPos].y;
        let startR = this.positions[origPos].r;
        let endX = this.positions[destPos].x;
        let endY = this.positions[destPos].y;
        let endR = this.positions[destPos].r;
        let intX = (endX - startX) / this.animLength;
        let intY = (endY - startY) / this.animLength;
        let intR = (endR - startR) / this.animLength;

        //Calculate new transform
        let newX = startX + (intX * newPro);
        let newY = startY + (intY * newPro);
        let newR = startR + (intR * newPro);

        //Set default width and reference images
        let cardBG = loader.cardBGs[newFac];
        let cardVal = loader.cardValues[newVal];
        let cardWidth = this.cardWidth;

        //Calculate width and reference images for flipped card
        if (newFlip == "up") {
            if (newPro <= this.animHalf) {
                cardBG = loader.cardBGs[8];
                cardVal = loader.cardValues[0];
                cardWidth = Math.floor(this.cardWidth * (newPro / this.animHalf));
            } else {
                cardBG = loader.cardBGs[newFac];
                cardVal = loader.cardValues[newVal];
                cardWidth = Math.floor(this.cardWidth * ((newPro - this.animHalf) / this.animHalf));
            }
        } else if (newFlip == "down") {
            if (newPro <= this.animHalf) {
                cardBG = loader.cardBGs[newFac];
                cardVal = loader.cardValues[newVal];
                cardWidth = Math.floor(this.cardWidth * (newPro / this.animHalf));
            } else {
                cardBG = loader.cardBGs[8];
                cardVal = loader.cardValues[0];
                cardWidth = Math.floor(this.cardWidth * ((newPro - this.animHalf) / this.animHalf));
            }
        }

        //Save transform
        ctx.save();

        //Rotate into position
        ctx.rotate(newR);

        //Draw card
        ctx.drawImage(
            cardBG,
            newX,
            newY,
            cardWidth,
            this.cardHeight
        );
        ctx.drawImage(
            cardVal,
            newX,
            newY,
            cardWidth,
            this.cardHeight
        );

        //Restore transform
        ctx.restore();
    }

    //Updates animated card
    updateCard(playerIndex, cardIndex) {
        //Update progress
        this.players[playerIndex].dynamicCards[cardIndex].progress += Math.round(time.deltaTime);

        //Check for destination
        if (this.players[playerIndex].dynamicCards[cardIndex].progress >= this.animLength) {
            let newFac = this.players[playerIndex].dynamicCards[cardIndex].faction;
            let newVal = this.players[playerIndex].dynamicCards[cardIndex].value;

            //If the card is being flipped down, then set to cardback
            if (this.players[playerIndex].dynamicCards[cardIndex].flip == "down") {
                newFac = 8;
                newVal = 0;
            }

            //Create new static card at relevant position
            console.log("Static card length = " + this.players[playerIndex].staticCards.length);
            console.log("Adding new static card");
            this.players[playerIndex].staticCards.push({
                faction: newFac,
                value: newVal,
                defeated: this.players[playerIndex].dynamicCards[cardIndex].defeated,
                position: this.players[playerIndex].dynamicCards[cardIndex].destination
            });
            console.log("Static card length = " + this.players[playerIndex].staticCards.length);

            //Sort static cards
            this.players[playerIndex].staticCards.sort(function (a, b) { return a.position - b.position });

            //Remove animated card
            this.players[playerIndex].dynamicCards.splice(cardIndex, 1);

            //Inform loop of removed card
            return true;
        }

        //Inform loop no card removed
        return false;
    }

    //////////////////////
    //  INPUT FUNCTIONS //
    //////////////////////

    //Process click event
    click(coords) {
        //Check UI state
        if (this.UIState == "select_champion") {
            //Check hand buttons
            this.manageHandButtons(0);

            //Check champion selection button
            this.manageChampionButton();
        } else if (this.UIState == "select_changeling") {
            //Check hand buttons
            this.manageHandButtons(1);

            //Check changeling selection buttons
            this.manageChangelingButtons();
        } else if (this.UIState == "swap_changeling") {
            //Check changeling swap buttons
            if (buttonCheck(this.buttons[7])) {
                //Init changeling index
                let swapIndex = this.findChangeling();

                //Swap changeling
                this.engine.swapChangeling(this.activePlayer, true, swapIndex);
            } else if (buttonCheck(this.buttons[8])) {
                //Init changeling index
                let swapIndex = this.findChangeling();

                //Decline to swap changeling
                this.engine.swapChangeling(this.activePlayer, false, swapIndex);
            }

            //Blank state
            this.blankState();
        }
    }

    //Find index of changeling card
    findChangeling() {
        //Iterate through cards
        for (let i = 0; i < this.players[this.activePlayer].staticCards.length; i++) {
            //Check if card is changeling
            if (this.players[this.activePlayer].staticCards[i].position > 4 & this.players[this.activePlayer].staticCards[i].position < 9) {
                //Set changeling index
                return this.players[this.activePlayer].staticCards[i].position;
            }
        }

        //Changeling not found
        return -1;
    }

    //Manages champion selection button
    manageChampionButton() {
        if (buttonCheck(this.buttons[0])) {
            //Select champion
            this.engine.selectChampion(this.activePlayer, this.selected);

            //Blank state
            this.blankState();
        }
    }

    //Manages changeling selection buttons
    manageChangelingButtons() {
        if (buttonCheck(this.buttons[1])) {
            //Select changeling
            this.engine.selectChangeling(this.activePlayer, this.selected);

            //Blank state
            this.blankState();
        } else if (buttonCheck(this.buttons[2])) {
            //Decline to select changeling
            this.engine.selectChangeling(this.activePlayer, -1);

            //Blank state
            this.blankState();
        }
    }

    //Sets trackers to blank state
    blankState() {
        //Reset selected
        this.selected = null;

        //Reset state
        this.UIState = "";

        //Change cursor
        cursorReady = false;
    }

    //Manages hand buttons during appropriate UI states
    manageHandButtons(pickButtonIndex) {
        //Update hand buttons
        this.updateHandButtons();

        //Check hand buttons
        this.checkHandButtons();

        //Update pick button
        if (this.selected != null) {
            this.buttons[pickButtonIndex].enabled = true;
        } else {
            this.buttons[pickButtonIndex].enabled = false;
        }
    }

    //Checks whether cards exist in hand and updates hand buttons accordingly
    updateHandButtons() {
        //Disable all buttons
        this.buttons[3].enabled = false;
        this.buttons[4].enabled = false;
        this.buttons[5].enabled = false;
        this.buttons[6].enabled = false;

        //Check cards
        if (this.UIState == "select_changeling") {
            for (let i = 0; i < this.players[this.activePlayer].staticCards.length; i++) {
                //Get data
                let cardPos = this.players[this.activePlayer].staticCards[i].position;
                let cardVal = this.players[this.activePlayer].staticCards[i].value;

                //Find permitted value range
                let champVal = 0;
                for (let j = 0; j < this.players[this.activePlayer].staticCards.length; j++) {
                    if (this.players[this.activePlayer].staticCards[j].position == 9) {
                        champVal = this.players[this.activePlayer].staticCards[j].value;
                        break;
                    }
                }
                let minVal = champVal - 4;
                let maxVal = champVal + 4;

                //Check card
                if (cardPos == 1 & cardVal >= minVal & cardVal <= maxVal) {
                    this.buttons[3].enabled = true;
                } else if (cardPos == 2 & cardVal >= minVal & cardVal <= maxVal) {
                    this.buttons[4].enabled = true;
                } else if (cardPos == 3 & cardVal >= minVal & cardVal <= maxVal) {
                    this.buttons[5].enabled = true;
                } else if (cardPos == 4 & cardVal >= minVal & cardVal <= maxVal) {
                    this.buttons[6].enabled = true;
                }
            }
        } else {
            for (let i = 0; i < this.players[this.activePlayer].staticCards.length; i++) {
                //Get position
                let cardPos = this.players[this.activePlayer].staticCards[i].position;

                //Check card
                if (cardPos == 1) {
                    this.buttons[3].enabled = true;
                } else if (cardPos == 2) {
                    this.buttons[4].enabled = true;
                } else if (cardPos == 3) {
                    this.buttons[5].enabled = true;
                } else if (cardPos == 4) {
                    this.buttons[6].enabled = true;
                }
            }
        }
    }

    //Checks hand buttons and updates selected card accordingly
    checkHandButtons() {
        if (buttonCheck(this.buttons[6]) & this.buttons[6].enabled) {
            //Update selection
            this.selected = 4;
        } else if (buttonCheck(this.buttons[5]) & this.buttons[5].enabled) {
            //Update selection
            this.selected = 3;
        } else if (buttonCheck(this.buttons[4]) & this.buttons[4].enabled) {
            //Update selection
            this.selected = 2;
        } else if (buttonCheck(this.buttons[3]) & this.buttons[3].enabled) {
            //Update selection
            this.selected = 1;
        }
    }

    //////////////////////////////
    // COMMUNICATION FUNCTIONS  //
    //////////////////////////////

    //Initialise Table
    initTable(tableData) {
        //Initialise rotation to own perspective
        this.perspectiveRotation = 0 - this.seatRotations[tableData.position];

        //Initialise animation speed
        this.animLength = tableData.animLength;
        this.animHalf = Math.floor(this.animLength / 2);

        //Initialise players
        this.players = tableData.players;
    }

    //Receive card
    addCard(cardData) {
        //Add card
        console.log("Moving card belonging to " + cardData.playerIndex + " from " + cardData.newCard.origin + " to " + cardData.newCard.destination);
        this.players[cardData.playerIndex].dynamicCards.push(cardData.newCard);
    }

    //Remove card at designated position
    removeCard(cardData) {
        console.log("Removing card from player " + cardData.playerIndex + " at position " + cardData.position);
        console.log("Array length = " + this.players[cardData.playerIndex].staticCards.length);
        console.log("Array count = " + Object.keys(this.players[cardData.playerIndex].staticCards).length);
        console.log(this.players[cardData.playerIndex].staticCards);
        console.log(console.log(JSON.stringify(this.players[cardData.playerIndex].staticCards)));
        console.log("Array length = " + this.players[cardData.playerIndex].staticCards.length);
        
        //Iterate through cards
        for (let i = 0; i < this.players[cardData.playerIndex].staticCards.length; i++) {
            console.log("Checking card " + i);
            //Check card
            if (this.players[cardData.playerIndex].staticCards[i].position == cardData.position) {
                //Remove card
                console.log("Card found at " + i);
                console.log("There are " + this.players[cardData.playerIndex].staticCards.length + " static cards");
                this.players[cardData.playerIndex].staticCards.splice(i, 1);
                console.log("Card removed");
                console.log("There are now " + this.players[cardData.playerIndex].staticCards.length + " static cards");

                //Decrement index
                i--;
            }
        }
    }

    //Receive new UI state
    updateUI(UIData) {
        //Update activate player
        this.activePlayer = UIData.activePlayer;

        //Update cursor
        if (UIData.UIState == "") {
            cursorReady = false;
        } else {
            cursorReady = true;
        }

        //Update UI state
        this.UIState = UIData.UIState;
    }

    //Return table screen data to original state
    blankTable() {
        this.players = [];
        this.activePlayer = null;
        this.selected = null;
        this.fadeDirection = "in";
        this.UIState = "";
        this.perspectiveRotation = 0 * Math.PI / 180;
        cursorReady = true;
    }
}