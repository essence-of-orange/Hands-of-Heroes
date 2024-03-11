//Displays game screen
class HHTable {
    //Constructor
    constructor(gameEngine) {
        this.engine = gameEngine;
    }

    //Draw graphics
    draw(gameState) {
        //Blank canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        //Draw background
        drawBG();
    }
}