//Displays game information screen
class HHInfo {
    //Constructor
    constructor(gameManager) {
        //Initialise variables
        this.gameManager = gameManager;
        this.textData = {
            textX: canvas.width / 2,
            textY: 250,
            titleX: canvas.width / 2,
            titleY: 110,
            textWidth: 500,
            textFont: "bold 16px 'mainFont'",
            titleFont: "bold 32px 'mainFont'",
            color: "rgba(70, 50, 30, 1)",
            leading: 2,
            title: "About this game",
            text: "Hands of Heroes © Peter Houlihan 2024"
        };
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
        ctx.fillStyle = this.textData.color;
        ctx.font = this.textData.titleFont;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(
            this.textData.title,
            this.textData.titleX,
            this.textData.titleY);

        //Draw text
        ctx.fillStyle = this.textData.color;
        ctx.font = this.textData.textFont;
        ctx.textAlign = "justify";
        ctx.textBaseline = "top";
        fillLines(
            ctx,
            this.textData.text,
            this.textData.textX,
            this.textData.textY,
            this.textData.textWidth,
            this.textData.leading);

        //Draw exit button
        buttonDraw(this.exitButton);
    }

    //Process click event
    click(coords) {
        //Check exit button
        if (buttonCheck(this.exitButton)) {
            //Exit game
            this.gameManager.openMenu();
        }
    }
}