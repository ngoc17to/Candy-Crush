import StateMachine from "../states/StateMachine"

abstract class State {
    public stateMachine: StateMachine
    abstract enter(...stateArgs: any[]): void
    abstract exit(): void
    abstract execute(time: number, delta: number): void
}

export default State