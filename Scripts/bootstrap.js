//Canvas variables
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');

//Temporarily draw black frame
ctx.clearRect(0, 0, canvas.width, canvas.height);
ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height);

//Time variables
var time = {
    currentTime: 0,
    prevTime: 0,
    deltaTime: 0
};
var mouse = {
    x: 0,
    y: 0
}
var deltaTime = 0;
var prevTime = 0;

//Create loader
var loader;
var loaderScript = document.createElement('script');
loaderScript.src = "./Scripts/AssetLoader.js"
loaderScript.onload = function () {
    //Initialise loader
    loader = new AssetLoader(canvas, ctx);

    //Initialise main loop
    window.requestAnimationFrame(loaderLoop);
};
document.head.append(loaderScript);

//Handle mouse input
var gameManager;
canvas.addEventListener('mousedown', function(event) {
    //Check game is running
    if(loader.status.gameReady){
        //Find coordinates
        const bounds = canvas.getBoundingClientRect();
        const clickX = Math.floor(event.clientX - bounds.left);
        const clickY = Math.floor(event.clientY - bounds.top);

        //Pass event to game manager
        gameManager.click({
            x: clickX,
            y: clickY
        });
    }
});

//Handle mouse movement
canvas.addEventListener('mousemove', function(event) {
    //Record coordinates
    mouse.x = event.offsetX;
    mouse.y = event.offsetY;
});

//Main loop
function mainLoop(currentTime) {
    //Update time
    time.prevTime = time.currentTime;
    time.currentTime = currentTime;
    time.deltaTime = time.currentTime - time.prevTime;

    //Draw game
    gameManager.draw();

    //Call next loop
    window.requestAnimationFrame(mainLoop);
}

function loaderLoop(currentTime) {
    //Update time
    time.prevTime = time.currentTime;
    time.currentTime = currentTime;
    time.deltaTime = time.currentTime - time.prevTime;

    //Draw loading screen
    loader.draw();

    //Start next loop
    if(loader.status.gameReady){
        //Initialise game manager
        gameManager = new HHManager();

        //Switch to main loop
        window.requestAnimationFrame(mainLoop);
    } else {
        //Continue with loader loop
        window.requestAnimationFrame(loaderLoop);
    }
}

