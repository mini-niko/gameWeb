import { renderScreen, screenSize } from "./renderScreen.js";
import { startSocket } from "../network/socket.js"

const screen = document.getElementById("screen")
const context = screen.getContext("2d")
screen.height = screenSize.height
screen.width = screenSize.width

export const socket = io()

startSocket(context)