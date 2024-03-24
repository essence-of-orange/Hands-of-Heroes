//Manages game scenes
class HHManager {
    //Constructor
    constructor() {
        //Game Objects
        this.lobby = new HHLobby();
        this.engine = new HHEngine(this.lobby);
        this.menuScreen = new HHMenu(this);
        this.setupScreen = new HHSetup(this.engine);
        this.tableScreen = new HHTable(this.engine);
        this.victoryScreen = new HHVictory(this.engine);
        this.settingsScreen = new HHSettings(this);
        this.instructionScreen = new HHInstructions(this);
        this.infoScreen = new HHInfo(this);

        //Game State
        this.currentScene = "menu";
    }

    //Updates logic and draws game graphics
    update() {
        //Call update and draw appropriate scene
        if (this.currentScene == "menu") {
            this.menuScreen.draw();
        } else if (this.currentScene == "setup") {
            this.setupScreen.draw(this.engine.visibleState);
        } else if (this.currentScene == "game") {
            this.engine.updateGame();
            this.tableScreen.draw();
        } else if (this.currentScene == "victory") {
            this.victoryScreen.draw();
        } else if (this.currentScene == "settings") {
            this.settingsScreen.draw(this.engine.settings);
        } else if (this.currentScene == "instructions") {
            this.instructionScreen.draw();
        } else if (this.currentScene == "about") {
            this.infoScreen.draw();
        }

        //Draw cursor
        drawCursor();
    }

    //Handles mouse input
    click(coords) {
        //Pass to appropriate scene
        if (this.currentScene == "menu") {
            this.menuScreen.click(coords);
        } else if (this.currentScene == "setup") {
            this.setupScreen.click(coords);
        } else if (this.currentScene == "game") {
            this.tableScreen.click(coords);
        } else if (this.currentScene == "victory") {
            this.victoryScreen.click(coords);
        } else if (this.currentScene == "settings") {
            this.settingsScreen.click(coords);
        } else if (this.currentScene == "instructions") {
            this.instructionScreen.click(coords);
        } else if (this.currentScene == "about") {
            this.infoScreen.click(coords);
        }
    }

    //Start new game
    newGame() {
        //Request name from user
        let newName = prompt("Please enter a username", "");

        //Check input
        if (newName != "" & newName != null) {
            //Create new game
            gameManager.engine.newGame(newName);
        }
    }

    //Request to join existing game
    joinGame() {
        //Request name from user
        let inviteCode = prompt("Please enter an invite code", "");

        //Check input
        if (inviteCode != "" & inviteCode != null) {
            //Request name from user
            let newName = prompt("Please enter a username", "");

            //Check input
            if (newName != "" & newName != null) {
                //Instruct engine to join game
                gameManager.engine.joinGame(inviteCode, newName);
            }
        }
    }

    //Show game screen
    openGame() {
        gameManager.currentScene = "game";
    }

    //Show victory screen
    openVictory() {
        gameManager.currentScene = "victory";
    }

    //Show settings
    openSettings() {
        gameManager.currentScene = "settings";
    }

    //Show instructions on how to play the game
    openInstructions() {
        gameManager.currentScene = "instructions";
    }

    //Show information about the game
    openInfo() {
        gameManager.currentScene = "about";
    }

    //Return to main menu
    openMenu() {
        gameManager.currentScene = "menu";
    }
}