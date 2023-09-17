import { Game } from "../core/Game.js";
import { KeyboardListener } from "../input/KeyboardListener.js";
import { renderScreen } from "./renderScreen.js";
import { screenSize } from "./renderScreen.js";
import { ButtonListener } from "../input/ButtonListener.js";
import { startSocket } from "../network/sockets.js";

export const screen = document.getElementById("screen")
screen.height = screenSize.height
screen.width = screenSize.width

export const game = new Game();
export const keyboardListener = new KeyboardListener()
export const buttonListener = new ButtonListener()
export const socket = io()

startSocket()