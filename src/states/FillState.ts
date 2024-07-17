import { CONST } from "../const";
import Tile from "../game-objects/Tile";
import GameScene from "../scenes/GameScene";
import State from "../types/State";

class FillState extends State{
    private scene: GameScene
    private elapsedTime = 0

    constructor(scene: GameScene) {
        super()
        this.scene = scene
        this.elapsedTime = 0
    }

    async enter(): Promise<void> {
        console.log("FillState");

        await Promise.all([
            this.scene.makeTilesFall(),
            this.scene.replenishField()
        ]);
    }
    
    exit(): void {
        
    }

    execute(time: number, delta: number): void {
        // this.elapsedTime += delta
        // // if(this.elapsedTime > 3000)
        // for(let y = 0; y < CONST.gridHeight; y++){
        //     for(let x = 0; x < CONST.gridWidth; x ++){
        //         if(this.scene.tileGrid[y][x] === undefined)
        //         {
        //             this.scene.makeTilesFall()
        //             this.scene.replenishField()
        //         }
        //     }
        // }           
        //  this.scene.stateMachine.transition('play');

    }

}

export default FillState