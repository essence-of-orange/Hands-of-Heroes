//Declare fade variables
fadeMax = 600;
fadeMin = 0;
fadeDivisor = fadeMax / 16;
fadeValue = fadeMin;
fadeSpeed = 1;
fadeWidth = 800 / 4;
fadeHeight = 600 / 4;
fadeMaxTimestep = 17;

//Fade canvas
function fade(direction) {
    //Check direction and update fade value
    if (direction == "in") {
        //Check direction and update fade value
        fadeValue -= fadeSpeed * Math.min(time.deltaTime, fadeMaxTimestep);

        //Check for end of fade
        if (fadeValue < fadeMin) {
            fadeValue = fadeMin;
        }
    } else if (direction == "out") {
        //Check direction and update fade value
        fadeValue += fadeSpeed * Math.min(time.deltaTime, fadeMaxTimestep);

        //Check for overshoot
        if (fadeValue > fadeMax) {
            fadeValue = fadeMax;
        }
    }

    //Calculate fade index
    let fadeIndex = Math.floor(fadeValue / fadeDivisor);

    //Draw fade to canvas
    ctx.drawImage(loader.fadeBGs[fadeIndex], 0, 0);
}