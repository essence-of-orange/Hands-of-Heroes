//Displays game setup screen
class HHSetup {
    //Constructor
    constructor(gameEngine) {
        //Canvas variables
        this.gameEngine = gameEngine;

        //UI variables
        this.fadeDirection = "in";
        this.iconData = {
            width: 150,
            height: 150,
            startX: (canvas.width / 2) - 345,
            startY: 100,
            textOffsetX: 75,
            textOffsetY: 10,
            nameOffsetY: 30,
            spacingX: 30,
            spacingY: 75,
            frame: 14
        };
        this.iconNames = [
            "Unicorns",
            "Vampires",
            "Goblins",
            "Dwarves",
            "Sidhe",
            "Elves",
            "Giants",
            "Hobbits"
        ];
        this.iconTips = [
            "'Difficult captives': In any battle if there is a captive greater and lesser in value. Unicorn cards run free.",
            "'Sanguine': Vampiric royalty gain one value for every corpse in a battle.",
            "'Nuisance': Each Goblin captive costs their captor -1 in victory.",
            "'Stubborn': Dwarven cards automatically win stalemates",
            "'Changeling': Play a second card 4pts+/- champion's value face down. Can swap cards before battle.",
            "'Haughty': Elven royalty gain one value during victory.",
            "'Really Tall': Giant players are so tall they can see everyone's hand.",
            "'Tiny': Hobbit cards cannot be captured by any card more than twice it's value."
        ];
        this.icons = [];
        this.buttonData = {
            width: 200,
            height: 50,
            startY: canvas.height - 75,
            spacing: 25
        };
        this.exitButton = {
            width: this.buttonData.width,
            height: this.buttonData.height,
            startX: (canvas.width / 2) - this.buttonData.width - this.buttonData.spacing,
            startY: this.buttonData.startY,
            endX: (canvas.width / 2) - this.buttonData.spacing,
            endY: this.buttonData.startY + this.buttonData.height,
            textX: (canvas.width / 2) - (this.buttonData.width / 2) - this.buttonData.spacing,
            textY: this.buttonData.startY + (this.buttonData.height / 2),
            name: "Exit Game",
            enabled: true
        };
        this.startButton = {
            width: this.buttonData.width,
            height: this.buttonData.height,
            startX: (canvas.width / 2) + this.buttonData.spacing,
            startY: this.buttonData.startY,
            endX: (canvas.width / 2) + this.buttonData.spacing + this.buttonData.width,
            endY: this.buttonData.startY + this.buttonData.height,
            textX: (canvas.width / 2) + this.buttonData.spacing + (this.buttonData.width / 2),
            textY: this.buttonData.startY + (this.buttonData.height / 2),
            name: "Start Game",
            enabled: false
        };
        this.exitValue = "";

        //Initialise icons
        this.initIcons();
    }

    //Reset icons to initial state
    initIcons() {
        //Blank array
        this.icons = [];

        //Initialise icons
        for (let i = 0; i < 8; i++) {
            if (i < 4) {
                //First row
                this.icons.push({
                    startX: this.iconData.startX + (i * this.iconData.width) + (i * this.iconData.spacingX),
                    startY: this.iconData.startY
                });
            } else {
                //Second row
                this.icons.push({
                    startX: this.iconData.startX + ((i - 4) * this.iconData.width) + ((i - 4) * this.iconData.spacingX),
                    startY: this.iconData.startY + this.iconData.height + this.iconData.spacingY
                });
            }

            //Remaining data
            this.icons[i].width = this.iconData.width;
            this.icons[i].height = this.iconData.height;
            this.icons[i].endX = this.icons[i].startX + this.iconData.width;
            this.icons[i].endY = this.icons[i].startY + this.iconData.height;
            this.icons[i].textX = this.icons[i].startX + this.iconData.textOffsetX;
            this.icons[i].textY = this.icons[i].startY - this.iconData.textOffsetY;
            this.icons[i].nameX = this.icons[i].startX + this.iconData.textOffsetX;
            this.icons[i].nameY = this.icons[i].startY - this.iconData.nameOffsetY;
            this.icons[i].frame = this.iconData.frame;
            this.icons[i].factionIndex = i;
            this.icons[i].available = true;
            this.icons[i].enabled = true;
            this.icons[i].playerName = "";
            this.icons[i].factionName = this.iconNames[i];
            this.icons[i].tip = this.iconTips[i];
        }
    }

    //Update icons with new data
    updateIcons(iconUpdate) {
        //Iterate through info
        for (let i = 0; i < 8; i++) {
            //Update icon
            this.icons[i].available = iconUpdate[i].available;
            this.icons[i].playerName = iconUpdate[i].playerName;
        }
    }

    //Draw graphics
    draw() {
        //Blank canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        //Draw background
        drawBG();

        //Draw instruction
        ctx.fillStyle = "AntiqueWhite";
        ctx.font = "bold 25px 'titleFont'";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Choose your faction", canvas.width / 2, 25);

        //Draw icons
        for (let i = 0; i < this.icons.length; i++) {
            iconDraw(this.icons[i]);
        }

        //Update start button
        if (this.gameEngine.players.length > 1 & this.gameEngine.gameState.hosting == true){
            this.startButton.enabled = true;
        } else {
            this.startButton.enabled = false;
        }

        //Draw buttons
        buttonDraw(this.exitButton);
        buttonDraw(this.startButton);

        //Fade
        fade(this.fadeDirection);

        //Check exit
        if (this.fadeDirection == "out" & fadeValue == fadeMax) {
            //Restore fade direction
            this.fadeDirection = "in";
            
            //Execute exit function
            if(this.exitValue == "menu"){
                this.gameEngine.exitGame();
            } else if (this.exitValue == "game"){
                gameManager.openGame();
            }
        }
    }

    //Process click event
    click(coords) {
        //Check icons
        for (var i = 0; i < this.icons.length; i++) {
            //Check current icon
            if (buttonCheck(this.icons[i])) {
                //Request change icon
                this.gameEngine.requestUpdateFaction(i);
            }
        }

        //Check exit button
        if (buttonCheck(this.exitButton)) {
            //Set exit index
            this.exitValue = "menu";

            //Set fade direction
            this.fadeDirection = "out";
        }

        //Check start button
        if (buttonCheck(this.startButton)) {
            this.gameEngine.startGame();
        }
    }
}