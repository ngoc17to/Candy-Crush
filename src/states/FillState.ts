import { CONST } from "../const";
import Tile from "../game-objects/Tile";
import GameScene from "../scenes/GameScene";
import State from "../types/State";

class FillState extends State{
    private scene: GameScene
    private isFilled: boolean

    constructor(scene: GameScene) {
        super()
        this.scene = scene
        this.isFilled = false
    }

    enter(): void {
        console.log("FillState");
        this.scene.makeTilesFall()
        this.scene.replenishField()

    }
    
    
    exit(): void {
        this.isFilled = false

    }

    execute(time: number, delta: number): void {
        const tileGrid = this.scene.tileGrid
        // const tileGridState: (string|number|undefined)[][] = []
        // const tileGridPos: ({x: number|undefined, y: number|undefined})[][] = []
        
        // for(let i = 0; i < CONST.gridHeight; i++){
        //     tileGridState[i] = []
        //     for(let j = 0; j < CONST.gridWidth; j++){
        //         tileGridState[i].push(tileGrid[i][j]?.state)
        //     }
        // }
        // console.log(tileGridState)

        if (tileGrid.every((row) => row.every((tile) => tile && tile.state == 'replenished'))) {
                this.stateMachine.transition('match');
        }

    }

}

export default FillState