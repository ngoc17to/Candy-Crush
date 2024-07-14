import { CONST } from "../const"
import GameScene from "../scenes/GameScene"
import Tile from "./Tile"

class BallTile extends Tile {
    constructor(scene: GameScene, x: number, y: number) {
        super(scene, x, y, 'lightBall')
    }
}

export default BallTile