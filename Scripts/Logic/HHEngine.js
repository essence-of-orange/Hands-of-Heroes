////////////////////////////////////////////////
//  Runs game logic and controls game data    //
////////////////////////////////////////////////
class HHEngine {
    //////////////////
    //  CONSTRUCTOR //
    //////////////////
    constructor(lobby) {
        //Reference to lobby object
        this.lobby = lobby;

        this.networking = {
            peer: null,
            id: "",
            name: "",
            myIndex: null
        }

        //Game logic variables
        this.gameState = {
            hosting: false,
            phase: "limbo"
        };
        this.game = null;
        this.settings = {
            maxPlayers: 8,
            animationSpeed: 2,
            factionAvailable: [
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true
            ]
        };
        this.players = [];
        this.factions = [];
    }

    //////////////////////////
    //  SHARED FUNCTIONS    //
    //////////////////////////

    //Receive message
    receiveMessage(data) {
        if (data.type == "chat_message") {
            this.receiveChat(data);
        } else if (data.type == "lobby_data" & this.gameState.hosting == false) {
            this.populateLobby(data);
        } else if (data.type == "player_update") {
            this.lobby.updatePlayer(data.name, data.index, data.factionIndex);
        } else if (data.type == "add_player") {
            this.lobby.addPlayer(data.name, data.index, data.factionIndex, false, false);
        } else if (data.type == "mute_player") {
            this.mutePlayer(data.index);
        } else if (data.type == "unmute_player") {
            this.unmutePlayer(data.index);
        } else if (data.type == "name_update") {
            this.updateName(data);
        } else if (data.type == "faction_update") {
            this.updateFaction(data);
        } else if (data.type == "faction_info") {
            gameManager.setupScreen.updateIcons(data.factionsArray);
        } else if (data.type == "index_update") {
            this.networking.myIndex = data.newIndex;
        } else if (data.type == "table_data") {
            this.initTable(data.tableData);
        } else if (data.type == "add_card") {
            this.addCard(data.cardData);
        } else if (data.type == "remove_card") {
            this.removeCard(data.cardData);
        } else if (data.type == "select_champion") {
            this.game.selectChampion(data.playerIndex, data.selectedIndex);
        } else if (data.type == "select_changeling") {
            this.game.selectChangeling(data.playerIndex, data.selectedIndex);
        } else if (data.type == "swap_changeling") {
            this.game.swapChangeling(data.playerIndex, data.decision, data.swapIndex);
        } else if (data.type == "update_UI") {
            this.updateUI(data.UIData);
        } else if (data.type == "remove_player") {
            this.lobby.removePlayer(data.index);
        } else if (data.type == "return_setup") {
            this.returnSetup();
        } else if (data.type == "kick") {
            this.acceptKick(data);
        } else {
            console.log("ERROR : Unknown message type");
            console.log(data);
        }
    }

    //Send chat message
    sendChat(message) {
        //Format message
        const newLine = this.networking.name + ": " + message;
        const data = {
            type: "chat_message",
            message: newLine,
            id: this.networking.id
        };

        //Check if host
        if (this.gameState.hosting) {
            //Check if muted
            if (this.players[0].muted) {
                //Post rejection to own chat
                this.lobby.addMessage("You are currently muted and can't send messages");
            } else {
                //Add message to self
                this.lobby.addMessage(newLine);

                //Send message to all players
                this.sendPlayers(data);
            }
        } else {
            //Send message to host
            this.sendHost(data);
        }
    }

    //Receive chat message
    receiveChat(messageData) {
        //Check if host
        if (this.gameState.hosting) {
            //Find index
            const index = this.getPlayerIndex(messageData.id);

            //Check if muted
            if (this.players[index].muted) {
                //Send rejection message back to sender
                this.sendPlayer({
                    type: "chat_message",
                    message: "You are currently muted and can't send messages",
                    id: this.networking.id
                },
                    index);
            } else {
                //Add message to self
                this.lobby.addMessage(messageData.message);

                //Forward message to all players
                this.sendPlayers(messageData);
            }
        } else {
            //Add message to self
            this.lobby.addMessage(messageData.message);
        }
    }

    //Mute indicated player
    mutePlayer(index) {
        //Check if host
        if (this.gameState.hosting) {
            //Mute own player object
            this.players[index].muted = true;

            //Switch mute button to unmute
            this.lobby.switchMuteButton("unmute", index)
        } else {
            //Send request to host
            this.sendHost({
                type: "mute_player",
                index: index
            });
        }
    }

    //Unmute indicated player
    unmutePlayer(index) {
        //Check if host
        if (this.gameState.hosting) {
            //unmute own player object
            this.players[index].muted = false;

            //Switch mute button to mute
            this.lobby.switchMuteButton("mute", index)
        } else {
            //Send request to host
            this.sendHost({
                type: "unmute_player",
                index: index
            });
        }
    }

    //Ask for a players name to be updated
    requestUpdateName(index) {
        //Get new name from user
        let newName = prompt("Please enter new username:", "");

        //Format player info
        let nameInfo = {
            type: "name_update",
            index: index,
            name: newName
        };

        //Validate new name
        if (newName != "" & newName != null) {
            //Check if host
            if (this.gameState.hosting) {
                //Update name
                this.updateName(nameInfo);
            } else {
                //Send player info
                this.sendHost(nameInfo);
            }
        }
    }

    //Ask for a players faction to be updated
    requestUpdateFaction(factionIndex) {
        //Format player info
        let factionInfo = {
            type: "faction_update",
            index: this.networking.myIndex,
            factionIndex: factionIndex
        };

        //Check if host
        if (this.gameState.hosting) {
            this.updateFaction(factionInfo);
        } else {
            //Send player info
            this.sendHost(factionInfo);
        }
    }

    //Initialise game table
    initTable(tableData) {
        //Pass data to table screen
        gameManager.tableScreen.initTable(tableData);

        //Trigger fade to table screen
        gameManager.setupScreen.exitValue = "game";
        gameManager.setupScreen.fadeDirection = "out";
    }

    //Add card to game table
    addCard(cardData) {
        gameManager.tableScreen.addCard(cardData);
    }

    //Remove card from game table
    removeCard(cardData) {
        gameManager.tableScreen.removeCard(cardData);
    }

    //Send UI Update to game table
    updateUI(UIData) {
        gameManager.tableScreen.updateUI(UIData);
    }

    //Send champion to arena
    selectChampion(playerIndex, selectedIndex) {
        //Check if host
        if (this.gameState.hosting) {
            //Send directly to game
            this.game.selectChampion(playerIndex, selectedIndex);
        } else {
            //Send to host
            this.sendHost({
                type: "select_champion",
                playerIndex: playerIndex,
                selectedIndex: selectedIndex
            })
        }
    }

    //Select changeling to send to arena
    selectChangeling(playerIndex, selectedIndex) {
        //Check if host
        if (this.gameState.hosting) {
            //Send directly to game
            this.game.selectChangeling(playerIndex, selectedIndex);
        } else {
            //Send to host
            this.sendHost({
                type: "select_changeling",
                playerIndex: playerIndex,
                selectedIndex: selectedIndex
            })
        }
    }

    //Swap changeling into arena
    swapChangeling(playerIndex, decision, swapIndex) {
        //Check if host
        if (this.gameState.hosting) {
            //Send directly to game
            this.game.swapChangeling(playerIndex, decision, swapIndex);
        } else {
            //Send to host
            this.sendHost({
                type: "swap_changeling",
                playerIndex: playerIndex,
                decision: decision,
                swapIndex: swapIndex
            })
        }
    }

    //Exit game
    exitGame() {
        //Check if host
        if (this.gameState.hosting) {
            //Update gamestate
            this.gameState.phase = "exiting";

            //Close connections with players
            for (let i = 1; i < this.players.length; i++) {
                //Close connection
                this.players[i].connection.close();
            }

            //Blank player list
            this.players = [];

            //Kill game
            this.game = null;

            //Reset game state
            this.gameState = {
                hosting: false,
                phase: "limbo"
            };
        } else {
            //Close connection with host
            this.networking.hostID = "";
            this.networking.hostConnection.close();
            this.networking.hostConnection = null;
        }

        //Reset networking object
        this.networking.peer.destroy();
        this.networking.id = "";
        this.networking.name = "";
        this.networking.myIndex = null;

        //Clear setup
        gameManager.setupScreen.initIcons();

        //Clear lobby
        this.lobby.clearLobby();

        //Clear table
        gameManager.tableScreen.blankTable();

        //Return to main menu
        gameManager.openMenu();
    }

    ////////////////////
    // HOST FUNCTIONS //
    ////////////////////

    //Create new game
    newGame(newName) {
        //Create peer
        this.networking.peer = new Peer()

        //If connection could not be made to peer.js server
        this.networking.peer.on('error', function (id) {
            //Alert player
            alert("Connection could not be made to peer.js, please try again in a few seconds.");
            
            //Destroy peer
            gameManager.engine.networking.peer.destroy();
        });


        //Once peer has been successfully created continue to create game
        this.networking.peer.on('open', function (id) {
            //Switch to gamescreen and set fade to max
            gameManager.currentScene = "setup";
            fadeValue = fadeMax;

            //Import settings
            gameManager.engine.settings = gameManager.settingsScreen.settings;

            //Initialise gamestate
            gameManager.engine.gameState.hosting = true;
            gameManager.engine.gameState.phase = "setup";

            //Initialise factions
            gameManager.engine.initFactions();

            //Create lobby
            gameManager.engine.lobby.createLobby(true);

            //Record ID
            gameManager.engine.networking.id = gameManager.engine.networking.peer.id;

            //Create own player object
            gameManager.engine.players.push({
                name: newName,
                faction: gameManager.engine.findFaction(),
                connection: null,
                id: gameManager.engine.networking.id,
                muted: false
            });

            //Add faction data
            gameManager.engine.factions[gameManager.engine.players[0].faction].available = false;
            gameManager.engine.factions[gameManager.engine.players[0].faction].playerIndex = 0;
            gameManager.engine.factions[gameManager.engine.players[0].faction].playerName = newName;

            //Add player data to networking object
            gameManager.engine.networking.name = newName;
            gameManager.engine.networking.myIndex = 0;

            //Add self to lobby
            gameManager.engine.lobby.addPlayer(gameManager.engine.players[0].name, 0, 0, false, true);
            gameManager.setupScreen.updateIcons(gameManager.engine.factions);
        });

        //Handle player connections
        this.networking.peer.on('connection', function (conn) {
            //When player joins
            conn.on('open', function () {
                //Ensure game is in setup phase and max number of players is not exceeded
                if (gameManager.engine.players.length < gameManager.engine.settings.maxPlayers & gameManager.engine.gameState.phase == "setup") {
                    //Accept player to game
                    gameManager.engine.acceptPlayer(conn);
                }
            });

            //When player leaves
            conn.on("close", function () {
                //Check phase
                if (gameManager.engine.gameState.phase != "exiting") {
                    //Remove player
                    gameManager.engine.removePlayer(conn.peer);
                }
            });
        });
    }

    //Start game
    startGame() {
        //Create game object
        this.game = new HHGame(this, this.players, this.settings.animationSpeed);

        //Update state
        this.gameState.phase = "game";
    }

    //Update game
    updateGame() {
        //Check game exists
        if (this.game != null) {
            this.game.update();
        }
    }

    //Return to setup
    returnSetup() {
        if (this.gameState.hosting) {
            //Destroy game
            this.game = null;
        }

        //Clear table
        gameManager.tableScreen.blankTable();

        //Open setup
        gameManager.currentScene = "setup";
    }

    //Obtain invite code
    getCode() {
        //Check code exists
        if (this.networking.id == undefined) {
            //Inform user connection unavailable
            alert("Peer.js has not yet established, please try again in a few seconds.");
        } else {
            //Check secure context
            if (window.isSecureContext) {
                //Copy code to clipboard
                navigator.clipboard.writeText(this.networking.id);
            } else {
                //Send code via alert
                alert(this.networking.id);
            }
        }
    }

    //Send message to player
    sendPlayer(data, index) {
        this.players[index].connection.send(data);
    }

    //Send message to all players
    sendPlayers(data) {
        //Iterate through players, skipping the host
        for (var i = 1; i < this.players.length; i++) {
            //Send message
            this.players[i].connection.send(data);
        }
    }

    //Accept player
    acceptPlayer(connection) {
        //Find player faction
        const playerFactionIndex = this.findFaction();
        this.factions[playerFactionIndex].available = false;
        this.factions[playerFactionIndex].playerIndex = this.players.length;
        this.factions[playerFactionIndex].playerName = "";

        //Add player to own lobby
        this.lobby.addPlayer("", this.players.length, playerFactionIndex, true, false);

        //Add player to other player's lobbies
        this.sendPlayers({
            type: "add_player",
            index: this.players.length,
            factionIndex: playerFactionIndex
        });

        //Create player object
        this.players.push({
            id: connection.peer,
            name: "",
            faction: playerFactionIndex,
            connection: connection,
            muted: false
        });

        //Accept player messages
        connection.on('data', function (data) {
            gameManager.engine.receiveMessage(data);
        });

        //Create lobby data
        const lobby_data = {
            type: "lobby_data",
            players: [],
            log: this.lobby.chatBox.log,
            playerIndex: this.players.length - 1
        }

        //Populate players
        for (var i = 0; i < this.players.length; i++) {
            lobby_data.players.push({
                name: this.players[i].name,
                factionIndex: this.players[i].faction
            });
        }

        //Send player lobby update
        connection.send(lobby_data);
    }

    //Update player info
    updatePlayer(playerData) {
        //Find index
        const index = this.getPlayerIndex(playerData.id);

        //Update player object
        this.players[index].name = playerData.name;
        this.players[index].faction = playerData.playerFactionIndex;

        //Update own lobby
        this.lobby.updatePlayer(playerData.name, index, this.players[index].faction);

        //Broadcast change to players
        this.sendPlayers({
            type: "player_update",
            index: index,
            factionIndex: this.players[index].faction,
            name: playerData.name
        });
    }

    //Update player name
    updateName(nameData) {
        //Check name is not duplicate
        let unique = true;
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].name == nameData.name) {
                unique = false;
            }
        }

        //If not duplicate update name
        if (unique) {
            //Update player object
            this.players[nameData.index].name = nameData.name;

            //Update factions
            this.factions[this.players[nameData.index].faction].playerName = nameData.name;

            //Update own lobby
            this.lobby.updatePlayer(nameData.name, nameData.index, this.players[nameData.index].faction);

            //Update own faction info
            gameManager.setupScreen.updateIcons(this.factions);

            //Broadcast name change to players
            this.sendPlayers({
                type: "player_update",
                index: nameData.index,
                name: nameData.name,
                factionIndex: this.players[nameData.index].faction
            });

            //Broadcast faction update to players
            this.sendPlayers({
                type: "faction_info",
                factionsArray: this.factions
            });
        } else {
            //Check if own index
            if (nameData.index == 0) {
                //Send warning
                this.lobby.addMessage("That name is already taken");
            } else {
                //Send warning
                this.sendPlayer({ type: "chat_message", message: "That name is already taken" }, nameData.index);
            }
        }
    }

    //Update player faction
    updateFaction(factionData) {
        //Validate faction
        if (this.factions[factionData.factionIndex].available) {
            //Update factions
            this.factions[this.players[factionData.index].faction].available = true;
            this.factions[this.players[factionData.index].faction].playerIndex = null;
            this.factions[this.players[factionData.index].faction].playerName = "";
            this.factions[factionData.factionIndex].available = false;
            this.factions[factionData.factionIndex].playerIndex = factionData.index;
            this.factions[factionData.factionIndex].playerName = this.players[factionData.index].name;

            //Update player object
            this.players[factionData.index].faction = factionData.factionIndex;

            //Update own lobby
            this.lobby.updatePlayer(this.players[factionData.index].name, factionData.index, factionData.factionIndex);

            //Update own faction info
            gameManager.setupScreen.updateIcons(this.factions);

            //Broadcast change of player info to players
            this.sendPlayers({
                type: "player_update",
                index: factionData.index,
                name: this.players[factionData.index].name,
                factionIndex: factionData.factionIndex
            });
            //Broadcast change of faction info to players
            this.sendPlayers({
                type: "faction_info",
                factionsArray: this.factions
            });
        } else {
            console.log("Faction not available, request denied");
        }
    }

    //Find a player's index from their ID
    getPlayerIndex(id) {
        //Iterate through players
        for (var i = 0; i < this.players.length; i++) {
            //Check id
            if (this.players[i].id == id) {
                //Player found, return index
                return i;
            }
        }

        //Player not found
        return -1;
    }

    //Initialise factions
    initFactions() {
        //Blank factions
        this.factions = [];

        //Iterate through factions
        for (let i = 0; i < 9; i++) {
            //Create faction
            this.factions.push({
                available: this.settings.factionAvailable[i],
                playerIndex: null,
                playerName: ""
            });
        }
    }

    //Find first available faction
    findFaction() {
        //Iterate through factions
        for (let i = 0; i < this.factions.length; i++) {
            //Check faction
            if (this.factions[i].available) {
                return i;
            }
        }

        //Faction not found
        console.log("All the factions seem to be taken");
        return -1;
    }

    //Remove selected player
    removePlayer(id) {
        //Find index
        const index = this.getPlayerIndex(id);

        //Remove player from own lobby
        this.lobby.removePlayer(index);

        //Send remove player messages to others
        this.sendPlayers({ type: "remove_player", index: index });

        //Update factions
        this.factions[this.players[index].faction].available = true;
        this.factions[this.players[index].faction].playerIndex = null;
        this.factions[this.players[index].faction].playerName = "";

        //Update own faction info
        gameManager.setupScreen.updateIcons(this.factions);

        //Broadcast faction update to players
        this.sendPlayers({
            type: "faction_info",
            factionsArray: this.factions
        });

        //Inform players of exit
        let exitMessage = this.players[index].name + " has left the game";
        this.lobby.addMessage(exitMessage);
        this.sendPlayers({ type: "chat_message", message: exitMessage });

        //Remove player data
        this.players.splice(index, 1);

        //Update indices
        for (let i = index; i < this.players.length; i++) {
            //Update faction
            this.factions[this.players[i].faction].playerIndex = index;

            //Update myIndex
            this.sendPlayer({ type: "index_update", newIndex: index }, index);
        }

        //If game ongoing, return to setup
        if (this.gameState.phase == "game") {
            //Return host to setup
            this.returnSetup();

            //Return players to setup
            this.sendPlayers({
                type: "return_setup"
            });
        }
    }

    //Kick selected player
    kickPlayer(index) {
        //Obtain reason from user
        let reason = prompt("Reason for kick: ", "");

        //Check reason exists
        if (reason != "" & reason != null) {
            //Send kick message to player
            //This will cause them to close the connection
            //Which in turn will trigger removePlayer
            this.sendPlayer({ type: "kick", reason: reason }, index);

            //Inform players of kick
            let kickMessage = this.players[index].name + " has been removed from the game : " + reason;
            this.lobby.addMessage(kickMessage);
            this.sendPlayers({ type: "chat_message", message: kickMessage });
        }
    }

    //////////////////////
    //  GUEST FUNCTIONS //
    //////////////////////

    //Send message to host
    sendHost(data) {
        this.networking.hostConnection.send(data);
    }

    //Attempt to join game
    joinGame(inviteCode, newName) {
        //Create peer
        this.networking.peer = new Peer()

        //If connection could not be made to peer.js server
        this.networking.peer.on('error', function (id) {
            //Alert player
            alert("Connection could not be made to peer.js, please try again in a few seconds.");

            //Destroy peer
            gameManager.engine.networking.peer.destroy();
        });

        //Once peer has been successfully created continue to join game
        this.networking.peer.on('open', function (id) {
            //Record ID
            gameManager.engine.networking.id = gameManager.engine.networking.peer.id;

            //Create connection
            gameManager.engine.networking.hostID = inviteCode;
            gameManager.engine.networking.hostConnection = gameManager.engine.networking.peer.connect(gameManager.engine.networking.hostID);

            //Wait for connection to establish
            gameManager.engine.networking.hostConnection.on('open', function () {
                //Add event listener to handle tab or browser closing
                window.addEventListener('beforeunload', function (e) {
                    //Close connection
                    gameManager.engine.networking.hostConnection.close();
                    //e.preventDefault();
                    //e.returnValue = '';
                });

                //Switch to gamescreen
                gameManager.currentScene = "setup";

                //Accept messages from host
                gameManager.engine.networking.hostConnection.on('data', function (data) {
                    gameManager.engine.receiveMessage(data);
                });

                //Initialise name
                gameManager.engine.networking.name = newName;

                //Create lobby
                gameManager.lobby.createLobby(false);
            });

            //If connection is closed, exit game
            gameManager.engine.networking.hostConnection.on('close', function () {
                gameManager.engine.exitGame();
                gameManager.lobby.addMessage("Lost connection to host");
            });

            //If an error is encountered alert the player
            gameManager.engine.networking.hostConnection.on('error', function () {
                alert("Connection could not be established. Please check invite code");
            });
        });
    }

    //Add info to lobby
    populateLobby(lobbyData) {
        //Set own ID
        this.networking.myIndex = lobbyData.playerIndex;

        //Send data to lobby
        this.lobby.populateLobby(lobbyData);

        //Format player info
        let nameInfo = {
            type: "name_update",
            index: this.networking.myIndex,
            name: this.networking.name
        };

        //Send name to host
        this.sendHost(nameInfo);
    }

    //Acknowledge kick request
    acceptKick(data) {
        //Leave game and send kick message
        this.exitGame();
        this.lobby.addMessage("You have been removed from the game : " + data.reason);
    }
}