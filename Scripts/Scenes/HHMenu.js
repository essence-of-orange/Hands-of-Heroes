//Displays menu screen
class HHMenu {
    //Constructor
    constructor(gameManager) {
        //Button variables
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
        this.buttonFunctions = [
            gameManager.newGame,
            gameManager.joinGame,
            gameManager.openSettings,
            gameManager.openInstructions,
            gameManager.openInfo
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
    }

    //Process click event
    click(coords) {
        //Iterate through buttons
        for (var i = 0; i < this.buttons.length; i++) {
            //Check current button
            if (buttonCheck(this.buttons[i])) {
                //Button clicked
                this.buttonFunctions[i]();
            }
        }
    }
}