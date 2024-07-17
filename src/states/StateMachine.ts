import State from "../types/State";

class StateMachine {
    private state: string | null
    private initialState: string
    private possibleStates: { [state: string]: State }
    private stateArgs: any[]

    constructor(initialState: string, possibleStates: { [state: string]: State } = {}, stateArgs: any[] = []) {
        this.initialState = initialState;
        this.possibleStates = possibleStates;
        this.stateArgs = stateArgs;
        this.state = null;
        
        for (const state of Object.values(this.possibleStates)) {
            state.stateMachine = this;
        }
    }
    
    public update(time: number, delta: number): void {
        // On the first step, the state is null and we need to initialize the first state.
        if (this.state === null) {
            this.state = this.initialState;
            this.possibleStates[this.state].enter();
        }
        // Run the current state's execute
        this.possibleStates[this.state].execute(time, delta);
    }

    public transition(newState: string, ...enterArgs: any[]): void {
        if (this.state) {
            this.possibleStates[this.state].exit()
        }
        this.state = newState;
        this.possibleStates[this.state].enter();
    }

    public getState(): string | null {
        return this.state
    }
}

export default StateMachine