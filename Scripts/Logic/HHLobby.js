//Runs game chat and guest management
class HHLobby {
    //Constructor
    constructor() {
        //Player tracker
        this.playerCount = 0;

        //Button emojis
        this.emojis = {
            kick: 0x1F528,
            mute: 0x1F910,
            unmute: 0x1F603,
            edit: 0x2712
        }

        //Chatbox
        this.chatBox = {
            maxMessages: 128,
            currentMessages: 0,
            log: []
        }
    }

    //Create lobby
    createLobby(hosting) {
        //Clear old data
        this.clearLobby();

        //Check if hosting
        if (hosting) {
            //Add invite button
            const inviteDiv = document.createElement("div");
            inviteDiv.id = "invite_user";
            const inviteButton = document.createElement("button");
            document.getElementById("member_list").appendChild(inviteDiv);
            inviteDiv.appendChild(inviteButton);
            inviteButton.style.fontFamily = "'titleFont'";
            inviteButton.style.background = 'url(./Images/UI/ButtonBG.png)';
            inviteButton.style.backgroundSize = '100% 100%';
            inviteButton.style.border = 'none';
            inviteButton.style.height = '30px';
            inviteButton.innerText = 'Get invite code';
            inviteButton.onclick = function () { gameManager.engine.getCode(); };
        }

        //Unlock chat
        document.getElementById("chat_bar").disabled = false;
        document.getElementById("chat_button").disabled = false;
    }

    //Update lobby with new data
    populateLobby(lobbyData) {
        //Populate memberlist
        for (let i = 0; i < lobbyData.players.length; i++) {
            //Check if self
            if (i == lobbyData.playerIndex) {
                this.addPlayer(lobbyData.players[i].name, i, lobbyData.players[i].factionIndex, false, true);
            } else {
                this.addPlayer(lobbyData.players[i].name, i, lobbyData.players[i].factionIndex, false, false);
            }
        }

        //Populate chatbox
        if (lobbyData.log != null) {
            for (let i = 0; i < lobbyData.log.length; i++) {
                //Add line
                this.addMessage(lobbyData.log[i]);
            }
        }
    }

    //Add player
    addPlayer(name, index, factionIndex, controls, editable) {
        //Create player tag
        const playerIndex = index;
        const playerFactionIndex = factionIndex;
        const newPlayerTag = document.createElement("div");
        newPlayerTag.id = "playerTag_" + playerIndex;
        newPlayerTag.classList.add("player_tag");
        document.getElementById("member_list").appendChild(newPlayerTag);

        //Create chat icon
        const newChatIcon = document.createElement("img");
        newChatIcon.id = "chatIcon_" + playerIndex;
        newChatIcon.src = loader.iconChatPaths[playerFactionIndex];
        newPlayerTag.appendChild(newChatIcon);

        //Create name tag
        const newNameTag = document.createElement("div");
        newNameTag.id = "nameTag_" + playerIndex;
        newNameTag.innerText = "\u00A0" + name;
        newNameTag.style.fontFamily = "'mainFont'";
        newNameTag.classList.add("name_tag");
        newPlayerTag.appendChild(newNameTag);

        //Check to add controls
        if (controls) {
            //Create buttons
            const newMuteButton = document.createElement("button");
            const newKickButton = document.createElement("button");
            newMuteButton.id = "muteButton_" + playerIndex;
            newKickButton.id = "kickButton_" + playerIndex;
            newMuteButton.style.background = 'url(./Images/UI/ButtonBG.png)';
            newKickButton.style.background = 'url(./Images/UI/ButtonBG.png)';
            newMuteButton.style.backgroundSize = '100% 100%';
            newKickButton.style.backgroundSize = '100% 100%';
            newMuteButton.style.border = 'none';
            newKickButton.style.border = 'none';
            newMuteButton.innerText = String.fromCodePoint(this.emojis.mute);
            newKickButton.innerText = String.fromCodePoint(this.emojis.kick);
            newMuteButton.onclick = function () { gameManager.engine.mutePlayer(playerIndex) };
            newKickButton.onclick = function () { gameManager.engine.kickPlayer(playerIndex) };
            newPlayerTag.appendChild(newMuteButton);
            newPlayerTag.appendChild(newKickButton);
        }

        //Check to make editable
        if (editable) {
            const newEditButton = document.createElement("button");
            newEditButton.id = "editButton_" + playerIndex;
            newEditButton.style.background = 'url(./Images/UI/ButtonBG.png)';
            newEditButton.style.backgroundSize = '100% 100%';
            newEditButton.style.backgroundSize = '100% 100%';
            newEditButton.innerText = String.fromCodePoint(this.emojis.edit);
            newEditButton.onclick = function () { gameManager.engine.requestUpdateName(playerIndex) };
            newPlayerTag.appendChild(newEditButton);
        }

        //Update tracker
        this.playerCount++;
    }

    //Update player tag
    updatePlayer(name, index, factionIndex) {
        //Generate IDs
        const tagID = "nameTag_" + index.toString();
        const iconID = "chatIcon_" + index.toString();

        //Update tag
        document.getElementById(tagID).innerText = "\u00A0" + name;
        document.getElementById(iconID).src = loader.iconChatPaths[factionIndex];
    }

    //Send message from chatbar
    sendMessage() {
        //Obtain message
        const chatBar = document.getElementById("chat_bar");
        const message = chatBar.value;

        //Blank chat bar
        chatBar.value = "";

        //Send message
        gameManager.engine.sendChat(message);
    }
    barMessage(event) {
        if (event.key == "Enter") {
            this.sendMessage();
        }
    }

    //Receive message from engine
    addMessage(message) {
        //Get reference to chatbox
        let chatBox = document.getElementById("chat_box");

        //Define newline
        let newLine = document.createElement("div");
        newLine.innerText = message;
        newLine.style.fontFamily = "'mainFont'";
        newLine.id = "chatline_" + this.chatBox.currentMessages.toString();

        //Add message to chatbox
        chatBox.appendChild(newLine);

        //Add message to log
        this.chatBox.log.push(message);

        //Scroll all the way down
        chatBox.scrollTop = chatBox.scrollHeight;

        //Increment count
        this.chatBox.currentMessages++;

        //Check for overflow
        if (this.chatBox.currentMessages > this.chatBox.maxMessages) {
            //Cull top message from log
            this.chatBox.log.shift();

            //Cull top message from chatbox
            chatBox.firstChild.remove();
        }
    }

    //Change mute button to mute or unmute
    switchMuteButton(state, index) {
        //Check state
        if (state == "mute") {
            //Switch to mute
            const buttonID = "muteButton_" + index;
            const playerIndex = index;
            const muteButton = document.getElementById(buttonID);
            muteButton.innerText = String.fromCodePoint(this.emojis.mute);
            muteButton.onclick = function () { gameManager.engine.mutePlayer(playerIndex) };
        } else {
            //Switch to unmute
            const buttonID = "muteButton_" + index;
            const playerIndex = index;
            const muteButton = document.getElementById(buttonID);
            muteButton.innerText = String.fromCodePoint(this.emojis.unmute);
            muteButton.onclick = function () { gameManager.engine.unmutePlayer(playerIndex) };
        }
    }

    //Remove player
    removePlayer(index) {
        //Find tag
        let tagID = "playerTag_" + index.toString();
        let tagElement = document.getElementById(tagID);

        //Remove tag
        if (tagElement != null) {
            tagElement.remove();
        }

        console.log("Just removed player " + index);

        //Update ids of tags belonging to players with higher indices
        for (let i = index + 1; i < this.playerCount; i++) {
            console.log("Now updating player " + i);
            //Define new index
            let newIndex = i - 1;

            //Update playerTag
            let playerTagID = "playerTag_" + i;
            let playerTag = document.getElementById(playerTagID);
            if (playerTag != null) {
                playerTag.id = "playerTag_" + newIndex;
            }

            //Update chatIcon
            let chatIconID = "chatIcon_" + i;
            let chatIcon = document.getElementById(chatIconID);
            if (chatIcon != null) {
                chatIcon.id = "chatIcon_" + newIndex;
            }

            //Update nameTag
            let nameTagID = "nameTag_" + i;
            let nameTag = document.getElementById(nameTagID);
            if (nameTag != null) {
                nameTag.id = "nameTag_" + newIndex;
            }

            //Update muteButton
            let muteButtonID = "muteButton_" + i;
            let muteButton = document.getElementById(muteButtonID);
            if (muteButton != null) {
                muteButton.id = "muteButton_" + newIndex;
                muteButton.onclick = function () { gameManager.engine.mutePlayer(newIndex) };
            }

            //Update kickButton
            let kickButtonID = "kickButton_" + i;
            let kickButton = document.getElementById(kickButtonID);
            if (kickButton != null) {
                kickButton.id = "kickButton_" + newIndex;
                kickButton.onclick = function () { gameManager.engine.kickPlayer(newIndex) };
            }

            //Update editButton
            let editButtonID = "editButton_" + i;
            let editButton = document.getElementById(editButtonID);
            if (editButton != null) {
                editButton.id = "editButton_" + newIndex;
                editButton.onclick = function () { gameManager.engine.requestUpdateName(newIndex) };
            }
        }

        //Update tracker
        this.playerCount--;
    }

    //Clear lobby
    clearLobby() {
        //Purge Memberlist
        document.getElementById("member_list").innerHTML = "";

        //Reset tracker
        this.playerCount = 0;

        //Purge Chatbox
        document.getElementById("chat_box").innerHTML = "";
        this.chatBox.currentMessages = 0;
        this.chatBox.log = [];

        //Purge Chatbar
        document.getElementById("chat_bar").value = "";

        //Lock chat
        document.getElementById("chat_bar").disabled = true;
        document.getElementById("chat_button").disabled = true;
    }
}