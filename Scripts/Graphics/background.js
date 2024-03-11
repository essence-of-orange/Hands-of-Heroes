function drawBG() {
    //Iterate through array
    for (var i = 0; i < loader.BGData.xCount; i++) {
        for (var j = 0; j < loader.BGData.yCount; j++) {
            //Find tile
            loader.BGCoords.BGx = 32 * loader.BGData.tileArray[i][j];

            //Calculate coordinates
            loader.BGCoords.Cx = loader.BGData.xOffset + (i * 32);
            loader.BGCoords.Cy = loader.BGData.yOffset + (j * 32);

            //Wrap image
            if (loader.BGCoords.Cx > (loader.BGData.width) - 32) {
                loader.BGCoords.Cx -= (loader.BGData.width);
            }
            if (loader.BGCoords.Cy > (loader.BGData.height) - 32) {
                loader.BGCoords.Cy -= (loader.BGData.height) + 8;
            }

            //Offset every second row
            if (j % 2 == 0) {
                loader.BGCoords.Cx -= 16;
            }

            //Draw tile
            loader.ctx.drawImage(loader.BGImg,
                loader.BGCoords.BGx,
                loader.BGCoords.BGy,
                32,
                32,
                loader.BGCoords.Cx,
                loader.BGCoords.Cy,
                32,
                32);
        }
    }

    //Update offsets
    loader.BGData.xOffset--;
    loader.BGData.yOffset++;

    //Validate offsets
    if (loader.BGData.xOffset < 0) {
        loader.BGData.xOffset = loader.BGData.width;
    }
    if (loader.BGData.yOffset > loader.BGData.height + 8) {
        loader.BGData.yOffset = 0;
    }
}