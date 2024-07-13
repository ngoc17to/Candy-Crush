import { CONST } from "../const";
import GameScene from "../scenes/GameScene";
import State from "../types/State";

class PlayState extends State{
    private scene: GameScene
    private elapsedTime = 0

    constructor(scene: GameScene) {
        super()
        this.scene = scene
        this.elapsedTime = 0
        this.scene.input.on("gameobjectdown", () => {
            this.elapsedTime = 0;
        });
    }

    enter(): void {
        console.log("PlayState")
    }
    exit(): void {
        this.elapsedTime = 0
        
    }
    execute(time: number, delta: number): void {
        if(this.elapsedTime >= CONST.TRANSITION_DELAY){
            // console.log('PlayState -> IdleState')
            // this.stateMachine.transition('idle')
        }
        else{
            this.elapsedTime += delta
        }
    }

}

export default PlayState