import { renderScreen } from "../view/renderScreen.js";
import { game, keyboardListener, buttonListener, socket } from "../view/script.js"

const socketEvents = {
    "connect"() {

        game.state.currentPlayerId = socket.id
        console.log(game)


        keyboardListener.registerPlayerId(game.state.currentPlayerId)
        keyboardListener.subscribe(function movePlayer(command) {
            game.movePlayer(command)
        })
        keyboardListener.subscribe(function socketHandler(command) {
            socket.emit(command.event, command)
        })

        buttonListener.registerPlayerId(game.state.currentPlayerId)
        buttonListener.subscribe(function setGamemode(command) {
            game.setGamemode(command)
        })
        buttonListener.subscribe(function socketHandler(command) {
            socket.emit(command.event, command)
        })

        console.log(`socket.io> Player connected on Client with id ${game.state.currentPlayerId}`)

        renderScreen(game, requestAnimationFrame)

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
        console.log(`socket.io> Moved player with id ${command.playerId}`)

        if (game.state.currentPlayerId != command.playerId) {
            game.movePlayer(command)
        }
    },
    "update-gamemode"(command) {
        console.log(`socket.io> Update mode from player with id ${command.playerId}`)

        const playerId = socket.id

        if(game.state.currentPlayerId != command.playerId) {
            game.setGamemode(command)
        }
    },
    disconnect() {
        socket.off()
        socket.on("connect", socketEvents.connect)
    }
}

export function startSocket() {

    socket.on("connect", socketEvents.connect)

}
