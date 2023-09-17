export class ButtonListener {
    constructor(screen) {
        this.state = {
            observers: [],
            playerId: null
        }
        eventListener((event) => {this.handleButtonClick(event)})
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

    handleButtonClick(event) {
        const buttonPressedId = event.srcElement.id

        const command = {
            event: "update-gamemode",
            playerId: this.state.playerId,
            buttonPressedId
        }

        this.notifyAll(command)
    }

    registerPlayerId(playerId) {
        this.state.playerId = playerId
    }
}


function eventListener(callback) {
    const buttonsDiv = document.getElementById("buttons")
    const buttons = buttonsDiv.querySelectorAll("button")

    buttons.forEach((button, index) => {
        button.addEventListener("click", callback)
    })
}
