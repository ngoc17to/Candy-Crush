import { CONST } from "../const";
import GameScene from "../scenes/GameScene";
import State from "../types/State";

class MatchState extends State{
    private scene: GameScene

    constructor(scene: GameScene) {
        super()
        this.scene = scene

    }

    enter(): void {
        console.log("MatchState")
        if(this.scene.matchInBoard()){
            this.scene.handleMatches()
        }
        else{
            this.scene.canPick = true;
            this.scene.firstSelectedTile = undefined;
            this.scene.secondSelectedTile = undefined;
            this.stateMachine.transition('play')
        }
    }
    exit(): void {
        
    }
    execute(time: number, delta: number): void {

    }

}

export default MatchState