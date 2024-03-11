//Displays game settings screen
class HHSettings {
    //Constructor
    constructor(gameManager) {
        //Initialise variables
        this.gameManager = gameManager;
        this.settings = {
            maxPlayers: 8,
            animationSpeed: 2,
            factionAvailable: [
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true
            ]
        };
        this.titleData = {
            titleX: canvas.width / 2,
            titleY: 110,
            font: "bold 32px 'mainFont'",
            color: "rgba(70, 50, 30, 1)",
            text: "Settings"
        };
        this.settingsData = {
            labelX: 250,
            valueX: canvas.width - 250,
            startY: 145,
            interval: 28,
            font: "bold 16px 'mainFont'",
            color: "rgba(70, 50, 30, 1)"
        };
        this.settingsLabels = [
            "Max Players:",
            "Animation Speed:",
            "Unicorns:",
            "Vampires:",
            "Goblins:",
            "Dwarves:",
            "Sidhe:",
            "Elves:",
            "Giants:",
            "Hobbits:"
        ];
        this.controlsData = {
            startX: canvas.width - 240,
            startY: 143,
            width: 14,
            height: 14,
            leftOffset: 95,
            border: 2
        };
        this.controls = [];
        this.animvalues = [
            "Slow",
            "Medium",
            "Fast",
            "Instant",
        ]
        this.buttonData = {
            width: 200,
            height: 50,
            startY: canvas.height - 55
        };
        this.exitButton = {
            width: this.buttonData.width,
            height: this.buttonData.height,
            startX: (canvas.width / 2) - (this.buttonData.width / 2),
            startY: this.buttonData.startY,
            endX: (canvas.width / 2) - (this.buttonData.width / 2) + this.buttonData.width,
            endY: this.buttonData.startY + this.buttonData.height,
            textX: canvas.width / 2,
            textY: this.buttonData.startY + (this.buttonData.height / 2),
            name: "Return to Menu",
            enabled: true
        };

        //Initialise controls
        for (let i = 0; i < 2; i++) {
            this.controls.push({
                width: this.controlsData.width,
                height: this.controlsData.height,
                startX: this.controlsData.startX,
                startY: this.controlsData.startY + (i * this.settingsData.interval),
                endX: this.controlsData.startX + this.controlsData.width,
                endY: this.controlsData.startY + (i * this.settingsData.interval) + this.controlsData.height,
                textX: this.controlsData.startX + (this.controlsData.width / 2),
                textY: this.controlsData.startY + (i * this.settingsData.interval) + (this.controlsData.width / 2) + 3,
                enabled: true,
                text: "+",
                font: this.settingsData.font,
                color: this.settingsData.color,
                border: this.controlsData.border
            });
        }
        for (let i = 0; i < 2; i++) {
            this.controls.push({
                width: this.controlsData.width,
                height: this.controlsData.height,
                startX: this.controlsData.startX - this.controlsData.leftOffset,
                startY: this.controlsData.startY + (i * this.settingsData.interval),
                endX: this.controlsData.startX - this.controlsData.leftOffset + this.controlsData.width,
                endY: this.controlsData.startY + (i * this.settingsData.interval) + this.controlsData.height,
                textX: this.controlsData.startX - this.controlsData.leftOffset + (this.controlsData.width / 2),
                textY: this.controlsData.startY + (i * this.settingsData.interval) + (this.controlsData.height / 2) + 2,
                enabled: true,
                text: "-",
                font: this.settingsData.font,
                color: this.settingsData.color,
                border: this.controlsData.border
            });
        }
        for (let i = 0; i < 8; i++) {
            this.controls.push({
                width: this.controlsData.width,
                height: this.controlsData.height,
                startX: this.settingsData.valueX - this.controlsData.width,
                startY: this.controlsData.startY + ((i + 2) * this.settingsData.interval),
                endX: this.settingsData.valueX,
                endY: this.controlsData.startY + ((i + 2) * this.settingsData.interval) + this.controlsData.height,
                textX: this.settingsData.valueX - this.controlsData.width + (this.controlsData.width / 2),
                textY: this.controlsData.startY + ((i + 2) * this.settingsData.interval) + (this.controlsData.height / 2) + 1,
                enabled: true,
                text: "x",
                font: this.settingsData.font,
                color: this.settingsData.color,
                border: this.controlsData.border
            });
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

        //Draw parchment
        ctx.drawImage(loader.infoBG, 100, 65);

        //Draw title
        ctx.fillStyle = this.titleData.color;
        ctx.font = this.titleData.font;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(
            this.titleData.text,
            this.titleData.titleX,
            this.titleData.titleY);

        //Draw labels
        for (let i = 0; i < this.settingsLabels.length; i++) {
            ctx.fillStyle = this.settingsData.color;
            ctx.font = this.settingsData.font;
            ctx.textAlign = "left";
            ctx.textBaseline = "top";
            ctx.fillText(
                this.settingsLabels[i],
                this.settingsData.labelX,
                this.settingsData.startY + (i * this.settingsData.interval));
        }

        //Draw values
        ctx.textAlign = "right";
        ctx.fillText(
            this.settings.maxPlayers.toString(),
            this.settingsData.valueX,
            this.settingsData.startY
        );
        ctx.fillText(
            this.animvalues[this.settings.animationSpeed],
            this.settingsData.valueX,
            this.settingsData.startY + this.settingsData.interval
        );

        //Draw controls
        for (let i = 0; i < this.controls.length; i++) {
            controlDraw(this.controls[i]);
        }


        //Draw exit button
        buttonDraw(this.exitButton);
    }

    //Process click event
    click(coords) {
        //Check exit button
        if (buttonCheck(this.exitButton)) {
            //Return to menu
            this.gameManager.openMenu();
        }

        //Check max player controls
        if (buttonCheck(this.controls[0])) {
            //Check factions
            if (this.settings.maxPlayers < this.checkFactions()) {
                //Increment value
                this.settings.maxPlayers++;
            }
        } else if (buttonCheck(this.controls[2])) {
            //Check value
            if (this.settings.maxPlayers > 1) {
                //Decrement value
                this.settings.maxPlayers--;
            }
        }

        //Check animation speed controls
        if (buttonCheck(this.controls[1])) {
            //Check value
            if (this.settings.animationSpeed < this.animvalues.length - 1) {
                //Increment speed
                this.settings.animationSpeed++;
            }
        } else if (buttonCheck(this.controls[3])) {
            //Check value
            if (this.settings.animationSpeed > 0) {
                //Decrement speed
                this.settings.animationSpeed--;
            }
        }

        //Check faction controls
        for (let i = 0; i < this.settings.factionAvailable.length; i++) {
            //Check click
            if (buttonCheck(this.controls[i + 4])) {
                //Check if faction is enabled
                if (this.settings.factionAvailable[i] == true) {
                    //Check there are more than two factions available
                    if (this.checkFactions() > 2) {
                        //Disable faction
                        this.controls[i + 4].text = "";
                        this.settings.factionAvailable[i] = false;

                        //Check max players
                        if (this.settings.maxPlayers > this.checkFactions()) {
                            this.settings.maxPlayers = this.checkFactions();
                        }
                    }
                } else {
                    //Enable faction
                    this.controls[i + 4].text = "x";
                    this.settings.factionAvailable[i] = true;
                }
            }
        }
    }

    //Check available factions
    checkFactions() {
        //Count number of available factions
        let count = 0;
        for (let i = 0; i < this.settings.factionAvailable.length; i++) {
            if (this.settings.factionAvailable[i] == true) {
                count++;
            }
        }

        //Return result
        return count;
    }
}