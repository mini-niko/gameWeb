import express from "express"
import http from "http"
import { Server } from "socket.io"
import { Game } from "./static/js/core/Game.js";

const app = express()
const server = http.createServer(app)
const sockets = new Server(server)

app.use(express.static("static"))

const game = new Game()

game.subscribe(function serverSocketHandler(command) {
    console.log(`socket.io> Emmiting ${command.event} from playerId ${command.playerId}`)
    sockets.emit(command.event, command)
})

sockets.on("connection", (socket) => {
    const playerId = socket.id
    console.log(`socket.io> Player connected on Server with id ${playerId}`)

    game.addPlayer({ playerId: socket.id, playerName: ""})

    socket.emit("setup", game.state)

    socket.on("disconnect", () => {
        console.log(`socket.io> Player disconnected on Server with id ${playerId}`)
        game.removePlayer({ playerId: playerId })
    })

    socket.on("move-player", (command) => {
        command.playerId = playerId
        command.event = "move-player"

        game.movePlayer(command)
    })

    socket.on("update-gamemode", (command) => {
        command.playerId = playerId
        command.event = "update-gamemode"

        game.setGamemode(command)
    })

})


server.listen(3000, () => {
    console.log("> Server listening on port: 3000")
})