import { CONST } from "../const"
import Tile from "./Tile"

class BallTile extends Tile {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'lightBall')
    }
}

export default BallTile