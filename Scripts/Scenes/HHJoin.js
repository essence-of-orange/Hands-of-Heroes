//Displays game joining screen
class HHJoin {
    //Constructor
    constructor(canvas, ctx) {
        //Canvas variables
        this.canvas = canvas;
        this.ctx = ctx;

        //Status variables
        this.status = "waiting";
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