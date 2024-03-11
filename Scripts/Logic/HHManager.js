//Manages game scenes
class HHManager {
    //Constructor
    constructor() {
        //Game Objects
        this.lobby = new HHLobby();
        this.engine = new HHEngine(this.lobby);
        this.menuScreen = new HHMenu(this);
        this.setupScreen = new HHSetup(this.engine);
        this.gameScreen = new HHTable(this.engine);
        this.victoryScreen = new HHVictory(this.engine);
        this.settingsScreen = new HHSettings(this);
        this.instructionScreen = new HHInstructions(this);
        this.infoScreen = new HHInfo(this);

        //Game State
        this.state = {
            currentScene: "menu"
        };
    }

    //Draws game graphics
    draw() {
        //Draw appropriate scene
        if (this.state.currentScene == "menu") {
            this.menuScreen.draw();
        } else if (this.state.currentScene == "setup") {
            this.setupScreen.draw(this.engine.visibleState);
        } else if (this.state.currentScene == "game") {
            this.gameScreen.draw(this.engine.visibleState);
        } else if (this.state.currentScene == "victory") {
            this.victoryScreen.draw(this.engine.visibleState);
        } else if (this.state.currentScene == "settings") {
            this.settingsScreen.draw(this.engine.settings);
        } else if (this.state.currentScene == "instructions") {
            this.instructionScreen.draw();
        } else if (this.state.currentScene == "about") {
            this.infoScreen.draw();
        }
    }

    //Handles mouse input
    click(coords){
        //Pass to appropriate scene
        if (this.state.currentScene == "menu") {
            this.menuScreen.click(coords);
        } else if (this.state.currentScene == "setup") {
            this.setupScreen.click(coords);
        } else if (this.state.currentScene == "game") {
            this.gameScreen.click(coords);
        } else if (this.state.currentScene == "victory") {
            this.victoryScreen.click(coords);
        } else if (this.state.currentScene == "settings") {
            this.settingsScreen.click(coords);
        } else if (this.state.currentScene == "instructions") {
            this.instructionScreen.click(coords);
        } else if (this.state.currentScene == "about") {
            this.infoScreen.click(coords);
        }
    }

    //Start new game
    newGame(){
        //Create new game
        gameManager.engine.newGame();
    }

    //Request to join existing game
    joinGame(){
        //Instruct engine to join game
        gameManager.engine.joinGame();
    }

    //Join requested game
    enterGame(){
        //Change state
        gameManager.state.currentScene = "setup";

        //Instruct engine to enter game
        gameManager.engine.enterGame();
    }

    //Show game screen
    openGame(){
        gameManager.state.currentScene = "game";
    }

    //Show settings
    openSettings(){
        gameManager.state.currentScene = "settings";
    }

    //Show instructions on how to play the game
    openInstructions(){
        gameManager.state.currentScene = "instructions";
    }

    //Show information about the game
    openInfo(){
        gameManager.state.currentScene = "about";
    }

    //Return to main menu
    openMenu(){
        gameManager.state.currentScene = "menu";
    }
}