//Declare cursor variables
cursorWidth = 24;
cursorHeight = 24;
cursorReady = true;

cursorMinIndex = 0;
cursorMaxIndex = 256;
cursorDivisor = cursorMaxIndex / 3;
cursorIndex = cursorMinIndex;

//Draw cursor
function drawCursor(){
    //Check state
    if(cursorReady){
        //Draw cursor
        ctx.drawImage(
            loader.cursorSprite,
            0, 0, 24, 24,
            mouse.x, mouse.y, 24, 24);
    } else {
        //Update index
        cursorIndex += time.deltaTime;
        if(cursorIndex > cursorMaxIndex){
            cursorIndex = cursorMinIndex;
        }
        let index = cursorWidth * (1 + Math.floor(cursorIndex / cursorDivisor));

        //Draw cursor
        ctx.drawImage(
            loader.cursorSprite,
            index, 0, 24, 24,
            mouse.x, mouse.y, 24, 24);
    }
}