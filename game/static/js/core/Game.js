import { Player, playerSize } from "./Player.js";
import { screenSize } from "../view/renderScreen.js";
const observers = []
export class Game {
    constructor() {
        this.state = {
            players: {

            },
            gamemode: null,
        }
    }

    subscribe(observerFunction) {
        const haveObserverFunction = observers.find((observer) => observer.name == observerFunction.name)

        if(!haveObserverFunction)
            observers.push(observerFunction)
    }

    notifyAll(command) {
        for(const observerFunction of observers) {
            observerFunction(command)
        }
    }

    addPlayer(command) {
        const playerId = command.playerId

        this.state.players[playerId] = new Player(command)
        const player = this.state.players[playerId]

        const newCommand = {
            event: "add-player",
            playerId,
            x: player.x,
            y: player.y,
            type: player.type
        }

        this.notifyAll(newCommand)
    }

    removePlayer(command) {
        const playerId = command.playerId

        delete this.state.players[playerId]

        const newCommand = {
            event: "remove-player",
            playerId,
        }

        this.notifyAll(newCommand)
    }

    movePlayer(command) {
        this.notifyAll(command)

        const thisGame = this
        const pressedKeyFunctions = {
            ArrowUp() {
                let collision = thisGame.checkPlayerCollision({
                    playerId: command.playerId,
                    x: player.x,
                    y: player.y - playerSize.height,
                })

                if (!collision) {
                    player.y = Math.max(0, player.y - playerSize.height)
                    return true
                }
                else{
                    return false
                }
            },
            ArrowDown() {
                let collision = thisGame.checkPlayerCollision({
                    playerId: command.playerId,
                    x: player.x,
                    y: player.y + playerSize.height
                })

                if (!collision) {
                    player.y = Math.min(screenSize.height - playerSize.height, player.y + playerSize.height)
                    return true
                }
                else{
                    return false
                }
            },
            ArrowLeft() {
                let collision = thisGame.checkPlayerCollision({
                    playerId: command.playerId,
                    x: player.x - playerSize.width,
                    y: player.y
                })

                if (!collision) {
                    player.x = Math.max(0, player.x - playerSize.width)
                    return true
                }
                else{
                    return false
                }
            },
            ArrowRight() {
                let collision = thisGame.checkPlayerCollision({
                    playerId: command.playerId,
                    x: player.x + playerSize.width,
                    y: player.y
                })

                if (!collision) {
                    player.x = Math.min(screenSize.width - playerSize.width, player.x + playerSize.width)
                    return true
                }
                else{
                    return false
                }
            }
        }

        const state = this.state
        const playerId = command.playerId
        const keyPressed = command.keyPressed
        const player = state.players[playerId]
        const moveFunction = pressedKeyFunctions[keyPressed]

        if (player && moveFunction) {
            moveFunction()
        }
    }

    setState(state) {
        this.state = state
    }

    setGamemode(command) {
        this.notifyAll(command)
        const thisGame = this

        const buttonsGamemodesFunction = {
            activeHunter() {
                if (thisGame.gamemode != "hunter") {
                    player.type = "hunter"
                    thisGame.state.gamemode = "hunter"
                }
            },
            desactiveHunter() {
                thisGame.gamemode = null

                for(const somePlayerId in thisGame.state.players) {
                    if(thisGame.state.players[somePlayerId].type != "runner") {
                        thisGame.state.players[somePlayerId].type = "runner"
                    }
                }
            }
        }

        const playerId = command.playerId
        const buttonId = command.buttonPressedId
        const player = this.state.players[playerId]
        const gamemodeFunction = buttonsGamemodesFunction[buttonId]

        if(gamemodeFunction) {
            gamemodeFunction()
        }
    }

    checkPlayerCollision(command) {
        const playerId = command.playerId
        const player = this.state.players[playerId]
        const x = command.x
        const y = command.y

        for (let anotherPlayerId in this.state.players) {
            const anotherPlayer = this.state.players[anotherPlayerId]

            if (
                anotherPlayerId != playerId && x == anotherPlayer.x && y == anotherPlayer.y
            ) {
                if (player.type == "hunter" && anotherPlayer.type == "runner") {
                    player.type = "runner"
                    anotherPlayer.type = "hunter"
                }
                return true
            }

        }

        return false
    }
}
