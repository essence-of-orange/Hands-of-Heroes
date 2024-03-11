//Draw button graphic
function buttonDraw(button) {
    //Draw background
    ctx.drawImage(loader.buttonBG, button.startX, button.startY);

    //Draw text
    if (button.enabled) {
        ctx.fillStyle = "Black";
    } else {
        ctx.fillStyle = "rgba(100,100,73,0.75)";
    }
    ctx.font = "bold 16px 'mainFont'";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(button.name,
        button.textX,
        button.textY);
}

//Draw faction icon graphic
function iconDraw(icon) {
    //Draw title
    ctx.fillStyle = "Tan";
    ctx.font = "bold 16px 'mainFont'";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(icon.factionName,
        icon.textX,
        icon.textY);

    //Check value
    if (icon.available) {
        //Draw icon
        ctx.drawImage(loader.iconsDark[icon.factionIndex], icon.startX, icon.startY);
    } else {
        //Draw icon
        ctx.drawImage(loader.iconsLight[icon.factionIndex], icon.startX, icon.startY);

        //Draw name
        ctx.fillStyle = "AntiqueWhite";
        ctx.font = "bold 16px 'mainFont'";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(icon.playerName,
            icon.nameX,
            icon.nameY);
    }

    //Check hover
    if (iconHover(icon)){
        //Draw background
        ctx.fillStyle = "rgba(225, 200, 180, 0.5)";
        ctx.fillRect(
            icon.startX + icon.frame,
            icon.startY + icon.frame,
            icon.width - (icon.frame * 2),
            icon.height - (icon.frame * 2));

        //Draw text
        ctx.fillStyle = "rgba(70, 50, 30, 1)";
        ctx.font = "bold 12px 'mainFont'";
        ctx.textAlign = "justify";
        ctx.textBaseline = "top";
        fillLines(
            ctx,
            icon.tip,
            icon.textX,
            icon.startY + icon.frame + 12,
            icon.width - (icon.frame * 2),
            0);
    }
}

//Draw settings control
function controlDraw(control){
    //Draw Border
    ctx.strokeStyle = control.color;
    ctx.lineWidth = control.border;
    ctx.strokeRect(
        control.startX,
        control.startY,
        control.width,
        control.height);

    //Draw Text
    ctx.fillStyle = control.color;
    ctx.font = control.font;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
        control.text,
        control.textX,
        control.textY)
}

//Draw multi-line text
function fillLines(ctx, text, startX, startY, lineWidth, leading){
    //Calculate values
    let textDimensions = ctx.measureText(text);
    let totalWidth = textDimensions.width;
    let lineCount = Math.ceil(totalWidth / lineWidth);
    let lineHeight = textDimensions.fontBoundingBoxAscent + textDimensions.fontBoundingBoxDescent + leading;
    let lineLength = Math.ceil(text.length / lineCount);

    //Write lines
    for(let i = 0; i < lineCount; i++){
        ctx.fillText(
            text.substring(i * lineLength, (i + 1) * lineLength),
            startX,
            startY + (i * lineHeight),
            lineWidth);
    }
}

//Detect hover
function iconHover(icon){
    if (mouse.x >= icon.startX & mouse.x <= icon.endX) {
        if (mouse.y >= icon.startY & mouse.y <= icon.endY) {
            //Hover detected
            return true;
        }
    }

    //Hover not detected
    return false;
}

//Detect button click
function buttonCheck(button) {
    if (mouse.x >= button.startX & mouse.x <= button.endX) {
        if (mouse.y >= button.startY & mouse.y <= button.endY) {
            if (button.enabled) {
                //Click detected
                return true;
            }
        }
    }

    //Click not detected
    return false;
}