import Tile from "../game-objects/Tile";
import GameScene from "../scenes/GameScene";
import State from "../types/State";

class SwapState extends State{
    private scene: GameScene
    private elapsedTime = 0

    constructor(scene: GameScene) {
        super()
        this.scene = scene
    }

    enter(tile1: Tile | undefined, tile2: Tile | undefined, swapBack: boolean): void {
        console.log("SwapState");
        this.scene.swapTiles(tile1, tile2, swapBack)

    }
    exit(): void {
    }
    execute(time: number, delta: number): void {
    }

}

export default SwapState