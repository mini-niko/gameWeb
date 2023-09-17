
const colors = {
    anotherPlayers: {
        hunter: "darkred",
        runner: "gray",
    },
    principalPlayer: {
        hunter: "red",
        runner: "green"
    }
}
const border = 20
import {playerSize} from "../core/Player.js";
export const screenSize = {
    width: 4096,
    height: 2304
}
export function renderScreen(screen, game, currentPlayerId, requestAnimationFrame) {
    const context = screen.getContext("2d")

    context.clearRect(0, 0, screen.width, screen.height)
    const image = new Image()
    image.src = "../../images/avatar.png"

    for(const playerId in game.state.players) {
        const player = game.state.players[playerId]
        let color;

        if(playerId == currentPlayerId) {
            color = context.fillStyle = colors.principalPlayer[player.type]
        }
        else {
            color = context.fillStyle = colors.anotherPlayers[player.type]
        }

        context.fillStyle = color

        context.drawImage(image, player.x + border, player.y + border, playerSize.width - border, playerSize.height - border)

        context.strokeStyle = color

        context.lineWidth = border

        context.strokeRect(player.x + border / 2, player.y + border / 2, playerSize.width - border, playerSize.height - border)
        //context.fillRect(player.x, player.y, 32, 32)
    }

    requestAnimationFrame(() => { renderScreen(screen, game, currentPlayerId, requestAnimationFrame)})
}