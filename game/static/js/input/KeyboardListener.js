
export class KeyboardListener {
    constructor(screen) {
        this.state = {
            observers: [],
            playerId: null,
            clicked: false
        }
        eventListener((event) => {this.handleKeydown(event)})
    }
    subscribe(observerFunction) {
        const haveObserverFunction = this.state.observers.find((observer) => observer.name == observerFunction.name)

        if (!haveObserverFunction)
            this.state.observers.push(observerFunction)
    }

    notifyAll(command) {
        for(const observerFunction of this.state.observers) {
            observerFunction(command)
        }
    }

    handleKeydown(event) {
        if(!this.state.clicked) {
            this.state.clicked = true
            const keyPressed = event.key
            const command = {
                event: "move-player",
                playerId: this.state.playerId,
                keyPressed
            }

            this.notifyAll(command)
            setTimeout(() =>{
                this.state.clicked = false
            }, 70)
        }
    }

    registerPlayerId(playerId) {
        this.state.playerId = playerId
    }
}

function eventListener(callback) {
    document.addEventListener("keydown", callback)
}
