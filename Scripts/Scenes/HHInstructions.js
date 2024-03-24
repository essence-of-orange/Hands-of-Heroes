//Displays game information screen
class HHInstructions {
    //Constructor
    constructor(gameManager) {
        //Data variables
        this.gameManager = gameManager;
        this.textData = {
            textX: canvas.width / 2,
            textY: 145,
            titleX: canvas.width / 2,
            titleY: 110,
            textWidth: 500,
            textFont: "bold 14px 'mainFont'",
            titleFont: "bold 32px 'mainFont'",
            color: "rgba(70, 50, 30, 1)",
            leading: 2,
            title: "How to Play",
            text: "Hands of Heroes is a game for 2-8 players. First one player must begin a new game, then send their invite code to the others. Next each player must pick a faction. Players then draw a hand of four cards, and 'battle' by playing cards into the center of the playing area. In each battle the highest card wins, returns to the owner's hand and the other cards are taken captive and taken to their dungeon. Assassin cards count as 1, unless a royal card is in the battle in which case they count as 17. If the two highest cards tie, they defeat each other and the remaining cards continue. The next battle is initated by the previous winner. If all cards are defeated they are sent to their owner's dungeon. Battles continue until one player has lost all of their cards. Players then take turns ransoming cards until they have as many of their own cards as possible back. The winner is the player with the highest value deck."
        };
        //UI variables
        this.fadeDirection = "in";
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

        //Fade
        fade(this.fadeDirection);

        //Check exit
        if (this.fadeDirection == "out" & fadeValue == fadeMax) {
            //Restore fade direction
            this.fadeDirection = "in";
            
            //Return to menu
            this.gameManager.openMenu();
        }
    }

    //Process click event
    click(coords) {
        //Check exit button
        if (buttonCheck(this.exitButton)) {
            //Set fade direction
            this.fadeDirection = "out";
        }
    }
}