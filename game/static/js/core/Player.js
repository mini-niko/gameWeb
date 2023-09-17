import { screenSize } from "../view/renderScreen.js";
export const playerSize = {
    width: 256,
    height: 256
}
export class Player {
    constructor(command) {
        this.playerName = command.playerName
        this.x = command.x ? command.x : Math.floor(Math.random() * (screenSize.width / playerSize.width)) * playerSize.width
        this.y = command.y ? command.y : Math.floor(Math.random() * (screenSize.height / playerSize.height)) * playerSize.height
        this.type = command.type ? command.type : "runner"
    }
}