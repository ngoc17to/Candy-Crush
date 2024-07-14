import { CONST } from "../const";
import Tile from "../game-objects/Tile";
import GameScene from "../scenes/GameScene";
import State from "../types/State";

class DestroyState extends State{
    private scene: GameScene
    private elapsedTime = 0

    constructor(scene: GameScene) {
        super()
        this.scene = scene
        this.elapsedTime = 0
    }

    enter(): void {
        console.log("DestroyState")
        this.scene.destroyTiles()
    }
    exit(): void {
    }
    execute(time: number, delta: number): void {
    }

}

export default DestroyState