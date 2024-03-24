//Displays menu screen
class HHMenu {
    //Constructor
    constructor(gameManager) {
        //Data variables
        this.gameManager = gameManager;
        //UI variables
        this.fadeDirection = "in";
        this.buttonData = {
            width: 200,
            height: 50,
            startY: 150,
            spacing: 10
        };
        this.buttonNames = [
            "New Game",
            "Join Game",
            "Settings",
            "How to Play",
            "About"
        ];
        this.exitIndex = 0;
        this.exitFunctions = [
            this.gameManager.newGame,
            this.gameManager.joinGame,
            this.gameManager.openSettings,
            this.gameManager.openInstructions,
            this.gameManager.openInfo
        ];
        this.buttons = [];

        //Initialise button coodinates
        for (var i = 0; i < this.buttonNames.length; i++) {
            //Push new coordinates to array
            this.buttons.push({
                width: this.buttonData.width,
                height: this.buttonData.height,
                startX: (canvas.width / 2) - (this.buttonData.width / 2),
                startY: this.buttonData.startY + (i * (this.buttonData.height + this.buttonData.spacing)),
                endX: (canvas.width / 2) - (this.buttonData.width / 2) + this.buttonData.width,
                endY: this.buttonData.startY + (i * this.buttonData.height) + (i * this.buttonData.spacing) + this.buttonData.height,
                textX: canvas.width / 2,
                textY: this.buttonData.startY + (i * this.buttonData.height) + (i * this.buttonData.spacing) + (this.buttonData.height / 2),
                name: this.buttonNames[i],
                enabled: true
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

        //Iterate through buttons
        for (var i = 0; i < this.buttonNames.length; i++) {
            //Draw button
            buttonDraw(this.buttons[i]);
        }

        //Fade
        fade(this.fadeDirection);

        //Check exit
        if (this.fadeDirection == "out" & fadeValue == fadeMax) {
            //Restore fade direction
            this.fadeDirection = "in";

            //Exit
            this.exitFunctions[this.exitIndex]();
        }
    }

    //Process click event
    click(coords) {
        //Iterate through buttons
        for (var i = 0; i < this.buttons.length; i++) {
            //Check current button
            if (buttonCheck(this.buttons[i])) {
                //Set fade direction
                this.fadeDirection = "out";

                //Set exit index
                this.exitIndex = i;
            }
        }
    }
}