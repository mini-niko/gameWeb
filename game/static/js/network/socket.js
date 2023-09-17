import { Game } from "../core/Game.js";
import { KeyboardListener } from "../input/KeyboardListener.js";
import { ButtonListener } from "../input/ButtonListener.js";
import { socket } from "../view/script.js"
import { renderScreen } from "../view/renderScreen.js"
let currentPlayerId = null

export function startSocket(context) {
    const socketEvents = {
        "connect"() {

            currentPlayerId = socket.id

            keyboardListener.registerPlayerId(currentPlayerId)
            keyboardListener.subscribe(function movePlayer(command) {
                game.movePlayer(command)
            })
            keyboardListener.subscribe(function socketHandler(command) {
                socket.emit(command.event, command)
            })

            buttonListener.registerPlayerId(currentPlayerId)
            buttonListener.subscribe(function setGamemode(command) {
                game.setGamemode(command)
            })
            buttonListener.subscribe(function socketHandler(command) {
                socket.emit(command.event, command)
            })

            console.log(`socket.io> Player connected on Client with id ${currentPlayerId}`)

            console.log(currentPlayerId)

            renderScreen(context, game, currentPlayerId)

            for(const key in socketEvents) {
                if(key != "connect") {
                    socket.on(key, socketEvents[key])
                }
            }

        },
        setup(state) {
            game.setState(state)
        },
        "add-player"(command) {
            console.log(`socket.io> Added player with id ${command.playerId}`)
            game.addPlayer(command)
        },
        "remove-player"(command) {
            console.log(`socket.io> Removed player with id ${command.playerId}`)
            game.removePlayer(command)
        },
        "move-player"(command) {
            //console.log(`socket.io> Moved player with id ${command.playerId}`)

            if (currentPlayerId != command.playerId) {
                game.movePlayer(command)
            }
        },
        "update-gamemode"(command) {
            console.log(`socket.io> Update mode from player with id ${command.playerId}`)

            const playerId = socket.id

            if(currentPlayerId != command.playerId) {
                game.setGamemode(command)
            }
        },
        "disconnect"() {
            socket.off()
            socket.on("connect", socketEvents.connect)
        }
    }

    const game = new Game()
    const keyboardListener = new KeyboardListener()
    const buttonListener = new ButtonListener()

    socket.on("connect", socketEvents.connect)
}