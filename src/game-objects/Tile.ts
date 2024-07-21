import { CONST } from "../const"
import ExplodeEmitter from "../effect/ExplodeEmitter"
import GameScene from "../scenes/GameScene"

class Tile extends Phaser.GameObjects.Sprite {
    private explodeEmitter: ExplodeEmitter
    protected currentScene: GameScene

    constructor(scene: GameScene, x: number, y: number, texture: string) {
        super(scene, x, y, texture)
        this.explodeEmitter = new ExplodeEmitter(scene)
        this.currentScene = scene

        this.setOrigin(0, 0)
        this.setInteractive()
        this.setSize(CONST.tileWidth, CONST.tileHeight)
        this.setScale(0.7)

        this.scene.add.existing(this)
    }
    public destroyTile(): void {
        this.destroyTween()
        this.destroy()
        this.currentScene.scoreManager.addScore(100);
    }
    public destroyTween(): void {
        const gameScene = this.scene as GameScene;
        if(this!==undefined){
            const {x,y} = gameScene.getTilePos(gameScene.tileGrid, this)

            gameScene.add.particles(0, 0, 'particle', {
                x: gameScene.tileGrid[y][x]!.x + CONST.tileWidth / 2,
                y: gameScene.tileGrid[y][x]!.y + CONST.tileHeight / 2,
                angle: { min: 0, max: 360},
                lifespan: 250,
                speed: 100,
                quantity: 10,
                gravityY: 150,
                scale: { 
                    start: 0.15, 
                    end: 0.02, 
                    ease: 'Sine.easeInOut', 
                },
                duration: 10,
            })
            this.explodeEmitter.createExplosionParticles(
                gameScene.tileGrid[y][x]!.x + CONST.tileWidth / 2,
                gameScene.tileGrid[y][x]!.y + CONST.tileHeight / 2,
                gameScene.tileGrid[y][x]!.texture.key
            )
        }
    }
}

export default Tile