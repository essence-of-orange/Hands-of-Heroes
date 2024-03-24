//Loads resources and draws loading screen
class AssetLoader {
    //Constructor
    constructor(canvas, ctx) {
        //Canvas references
        this.canvas = canvas;
        this.ctx = ctx;

        //Status variables
        this.status = {
            gameReady: false,
            BGImgReady: false,
            BGScriptReady: false,
            BGMusicReady: false,
            BGMusicPlaying: false,
            totalResources: 0,
            totalLoaded: 0
        };

        //Bar variables
        this.bar = {
            width: 200,
            height: 25,
            border: 5,
            xOffset: 0,
            yOffset: 0,
            filePixels: 0,
            statusText: ""
        };
        this.graphics = {
            bg: "rgba(8,2,0,1)",
            fg: "rgba(135,35,65,1)"
        };
        this.bgResources = {
            bgImg: 0,
            bgMusic: 0
        };

        //Background variables
        this.BGData = {
            xOffset: 0,
            yOffset: 0,
            width: ((canvas.width / 32) + 2) * 32,
            height: ((canvas.height / 32) + 2) * 32,
            xCount: (canvas.width / 32) + 2,
            yCount: (canvas.height / 32) + 2,
            tileArray: []
        };
        this.BGCoords = {
            BGx: 0,
            BGy: 0,
            Cx: 0,
            Cy: 0
        };

        //Asset Paths
        this.scriptPaths = [
            "./Scripts/Graphics/buttons.js",
            "./Scripts/Graphics/cursor.js",
            "./Scripts/Graphics/fade.js",
            "./Scripts/Logic/HHCard.js",
            "./Scripts/Logic/HHEngine.js",
            "./Scripts/Logic/HHExchange.js",
            "./Scripts/Logic/HHGame.js",
            "./Scripts/Logic/HHLobby.js",
            "./Scripts/Logic/HHManager.js",
            "./Scripts/Logic/HHPlayer.js",
            "./Scripts/Logic/peerjs.min.js",
            "./Scripts/Scenes/HHTable.js",
            "./Scripts/Scenes/HHInfo.js",
            "./Scripts/Scenes/HHInstructions.js",
            "./Scripts/Scenes/HHMenu.js",
            "./Scripts/Scenes/HHSettings.js",
            "./Scripts/Scenes/HHSetup.js",
            "./Scripts/Scenes/HHVictory.js"];
        this.cardBGPaths = [
            "./Images/Card_BGs/Card_Unicorn.png",
            "./Images/Card_BGs/Card_Vampire.png",
            "./Images/Card_BGs/Card_Goblin.png",
            "./Images/Card_BGs/Card_Dwarf.png",
            "./Images/Card_BGs/Card_Sidhe.png",
            "./Images/Card_BGs/Card_Elf.png",
            "./Images/Card_BGs/Card_Giant.png",
            "./Images/Card_BGs/Card_Hobbit.png",
            "./Images/Card_BGs/Card_Back.png",
            "./Images/Card_BGs/Card_Defeated.png"];
        this.cardValuePaths = [
            "./Images/Card_Values/Card_0.png",
            "./Images/Card_Values/Card_1.png",
            "./Images/Card_Values/Card_2.png",
            "./Images/Card_Values/Card_3.png",
            "./Images/Card_Values/Card_4.png",
            "./Images/Card_Values/Card_5.png",
            "./Images/Card_Values/Card_6.png",
            "./Images/Card_Values/Card_7.png",
            "./Images/Card_Values/Card_8.png",
            "./Images/Card_Values/Card_9.png",
            "./Images/Card_Values/Card_10.png",
            "./Images/Card_Values/Card_11.png",
            "./Images/Card_Values/Card_12.png",
            "./Images/Card_Values/Card_13.png",
            "./Images/Card_Values/Card_14.png",
            "./Images/Card_Values/Card_15.png",
            "./Images/Card_Values/Card_16.png"];
        this.fadeBGPaths = [
            "./Images/Fades/Fade00.png",
            "./Images/Fades/Fade01.png",
            "./Images/Fades/Fade02.png",
            "./Images/Fades/Fade03.png",
            "./Images/Fades/Fade04.png",
            "./Images/Fades/Fade05.png",
            "./Images/Fades/Fade06.png",
            "./Images/Fades/Fade07.png",
            "./Images/Fades/Fade08.png",
            "./Images/Fades/Fade09.png",
            "./Images/Fades/Fade10.png",
            "./Images/Fades/Fade11.png",
            "./Images/Fades/Fade12.png",
            "./Images/Fades/Fade13.png",
            "./Images/Fades/Fade14.png",
            "./Images/Fades/Fade15.png",
            "./Images/Fades/Fade16.png"];
        this.iconDarkPaths = [
            "./Images/Icons/Icon_Dark_Unicorn.png",
            "./Images/Icons/Icon_Dark_Vampire.png",
            "./Images/Icons/Icon_Dark_Goblin.png",
            "./Images/Icons/Icon_Dark_Dwarf.png",
            "./Images/Icons/Icon_Dark_Sidhe.png",
            "./Images/Icons/Icon_Dark_Elf.png",
            "./Images/Icons/Icon_Dark_Giant.png",
            "./Images/Icons/Icon_Dark_Hobbit.png"];
        this.iconLightPaths = [
            "./Images/Icons/Icon_Light_Unicorn.png",
            "./Images/Icons/Icon_Light_Vampire.png",
            "./Images/Icons/Icon_Light_Goblin.png",
            "./Images/Icons/Icon_Light_Dwarf.png",
            "./Images/Icons/Icon_Light_Sidhe.png",
            "./Images/Icons/Icon_Light_Elf.png",
            "./Images/Icons/Icon_Light_Giant.png",
            "./Images/Icons/Icon_Light_Hobbit.png"];
        this.iconChatPaths = [
            "./Images/Icons/Chat_Icon_Unicorn.png",
            "./Images/Icons/Chat_Icon_Vampire.png",
            "./Images/Icons/Chat_Icon_Goblin.png",
            "./Images/Icons/Chat_Icon_Dwarf.png",
            "./Images/Icons/Chat_Icon_Sidhe.png",
            "./Images/Icons/Chat_Icon_Elf.png",
            "./Images/Icons/Chat_Icon_Giant.png",
            "./Images/Icons/Chat_Icon_Hobbit.png",
            "./Images/Icons/Chat_Icon_Null.png"];

        this.buttonBGPath = "./Images/UI/ButtonBG.png";
        this.gameBGPath = "./Images/UI/GameBG.png";
        this.infoBGPath = "./Images/UI/InfoBG.png";
        this.tableBGPath = "./Images/UI/Table.png";
        this.cursorSpritePath = "./Images/UI/Cursor.png";

        this.mainFontPath = "url(./Fonts/Immortal.ttf)";
        this.textFontPath = "url(./Fonts/Benegraphic.ttf)";
        this.titleFontPath = "url(./Fonts/Satans_Minions.ttf)";

        this.BGImgPath = "./Images/UI/BGImg.png";
        this.BGScriptPath = "./Scripts/Graphics/background.js";
        this.BGMusicPath = "./Audio/BGMusic.mp3";

        this.audioPaths = [];

        //Resource containers
        this.scripts = [];
        this.cardBGs = [];
        this.cardValues = [];
        this.fadeBGs = [];
        this.iconsDark = [];
        this.iconsLight = [];
        this.iconsChat = [];

        this.buttonBG;
        this.gameBG;
        this.infoBG;
        this.tableBG;
        this.cursorSprite;

        this.mainFont;
        this.textFont;
        this.titleFont;

        this.audio = [];

        //Load background script
        this.BGScript = document.createElement("script");
        this.BGScript.src = this.BGScriptPath;
        this.BGScript.onload = function () { loader.status.BGScriptReady = true; };
        document.head.append(this.BGScript);

        //Load background image
        this.BGImg = new Image();
        this.BGImg.src = this.BGImgPath;
        this.BGImg.onload = function () { loader.status.BGImgReady = true; };

        //Load scripts
        for (var i = 0; i < this.scriptPaths.length; i++) {
            //Load script
            this.scripts.push(document.createElement('script'));
            this.scripts[i].src = this.scriptPaths[i];
            this.scripts[i].onload = function () { loader.status.totalLoaded++; };
            document.head.append(this.scripts[i]);

            //Update tracker
            this.status.totalResources++;
        }

        //Load card bgs
        for (let i = 0; i < this.cardBGPaths.length; i++) {
            //Load cardBG
            this.cardBGs.push(new Image());
            this.cardBGs[i].src = this.cardBGPaths[i];
            this.cardBGs[i].onload = function () { loader.status.totalLoaded++; };

            //Update tracker
            this.status.totalResources += 1;
        }

        //Load card values
        for (let i = 0; i < this.cardValuePaths.length; i++){
            //Load card value
            this.cardValues.push(new Image());
            this.cardValues[i].src = this.cardValuePaths[i];
            this.cardValues[i].onload = function () { loader.status.totalLoaded++; };

            //Update tracker
            this.status.totalResources += 1;
        }

        //Load fade BGs
        for (let i = 0; i < this.fadeBGPaths.length; i++){
            //Load fade bg
            this.fadeBGs.push(new Image());
            this.fadeBGs[i].src = this.fadeBGPaths[i];
            this.fadeBGs[i].onload = function () { loader.status.totalLoaded++; };

            //Update tracker
            this.status.totalResources += 1;
        }

        //Load card icons
        for (let i = 0; i < this.iconDarkPaths.length; i++) {
            //Load dark icon
            this.iconsDark.push(new Image());
            this.iconsDark[i].src = this.iconDarkPaths[i];
            this.iconsDark[i].onload = function () { loader.status.totalLoaded++; };

            //Load light icon
            this.iconsLight.push(new Image());
            this.iconsLight[i].src = this.iconLightPaths[i];
            this.iconsLight[i].onload = function () { loader.status.totalLoaded++; };

            //Update tracker
            this.status.totalResources += 2;
        }

        //Load GUI images
        this.buttonBG = new Image();
        this.buttonBG.src = this.buttonBGPath;
        this.buttonBG.onload = function () { loader.status.totalLoaded++; };
        this.gameBG = new Image();
        this.gameBG.src = this.gameBGPath;
        this.gameBG.onload = function () { loader.status.totalLoaded++; };
        this.infoBG = new Image();
        this.infoBG.src = this.infoBGPath;
        this.infoBG.onload = function () { loader.status.totalLoaded++; };
        this.tableBG = new Image();
        this.tableBG.src = this.tableBGPath;
        this.tableBG.onload = function () { loader.status.totalLoaded++; };
        this.cursorSprite = new Image();
        this.cursorSprite.src = this.cursorSpritePath;
        this.cursorSprite.onload = function () { loader.status.totalLoaded++; };
        this.status.totalResources += 5;

        //Load fonts
        this.mainFont = new FontFace("mainFont", this.mainFontPath);
        this.textFont = new FontFace("textFont", this.textFontPath);
        this.titleFont = new FontFace("titleFont", this.titleFontPath);
        this.mainFont.load().then(
            () => { document.fonts.add(this.mainFont); },
            (err) => { console.error(err); }
        );
        this.textFont.load().then(
            () => { document.fonts.add(this.textFont); },
            (err) => { console.error(err); }
        );
        this.titleFont.load().then(
            () => { document.fonts.add(this.titleFont); },
            (err) => { console.error(err); }
        );


        //Load audio


        //Set status bar variables
        this.bar.xOffset = (this.canvas.width / 2) - (this.bar.width / 2);
        this.bar.yOffset = (this.canvas.height / 2) - (this.bar.height / 2);
        this.bar.filePixels = this.bar.width / this.status.totalResources;

        //Initialise BG Array
        for (var i = 0; i < this.BGData.xCount; i++) {
            //Add new row
            this.BGData.tileArray.push([]);

            for (var j = 0; j < this.BGData.yCount; j++) {
                //Generate reference
                this.BGData.tileArray[i].push(Math.floor(Math.random() * 8));
            }
        }
    }

    //Draw graphics
    draw() {
        //Blank canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = this.graphics.bg;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        //Draw background
        if (this.status.BGScriptReady && this.status.BGImgReady) {
            drawBG();
        }

        //Draw bar
        this.drawBar();

        //Start music
        if (this.status.BGMusicReady & this.status.BGMusicPlaying == false) {
            //Play music

        }

        //Check status
        if (this.status.totalLoaded == this.status.totalResources) {
            //Update status
            this.status.gameReady = true;
        }
    }

    //Draw status bar
    drawBar() {
        //Draw background
        this.ctx.fillStyle = this.graphics.bg;
        this.ctx.fillRect(this.bar.xOffset,
            this.bar.yOffset,
            this.bar.width + (this.bar.border * 2),
            this.bar.height + (this.bar.border * 2));

        //Draw frame
        this.ctx.strokeStyle = this.graphics.fg;
        this.ctx.lineWidth = this.bar.border / 2;
        this.ctx.strokeRect(this.bar.xOffset,
            this.bar.yOffset,
            this.bar.width + (this.bar.border * 2),
            this.bar.height + (this.bar.border * 2));

        //Draw bar
        this.ctx.fillStyle = this.graphics.fg;
        this.ctx.fillRect(this.bar.xOffset + this.bar.border,
            this.bar.yOffset + this.bar.border,
            this.status.totalLoaded * this.bar.filePixels,
            this.bar.height);

        //Write loading text
        this.ctx.font = "bold 16px arial";
        this.ctx.textAlign = "left";
        if (Math.floor(time.currentTime / 500) % 4 == 0) {
            this.bar.statusText = "LOADING";
        } else if (Math.floor(time.currentTime / 500) % 4 == 1) {
            this.bar.statusText = "LOADING.";
        } else if (Math.floor(time.currentTime / 500) % 4 == 2) {
            this.bar.statusText = "LOADING..";
        } else if (Math.floor(time.currentTime / 500) % 4 == 3) {
            this.bar.statusText = "LOADING...";
        }

        //Write status
        this.ctx.fillText(this.bar.statusText,
            this.bar.xOffset,
            this.bar.yOffset - (this.bar.height / 2));
        this.ctx.textAlign = "right";
        this.ctx.fillText(this.status.totalLoaded.toString() + "/" + this.status.totalResources.toString(),
            this.bar.xOffset + this.bar.width + (this.bar.border * 2),
            this.bar.yOffset - (this.bar.height / 2));
    }
}