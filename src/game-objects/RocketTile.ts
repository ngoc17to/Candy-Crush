import { CONST } from "../const"
import game from "../game";
import GameScene from "../scenes/GameScene"
import Tile from "./Tile"

class RocketTile extends Tile {
    private direction: 'HORIZONTAL' | 'VERTICAL'
    private firstTweens: Phaser.Types.Tweens.TweenBuilderConfig[] = [];
    private secondTweens: Phaser.Types.Tweens.TweenBuilderConfig[] = [];
    constructor(scene: Phaser.Scene, x: number, y: number, direction: 'HORIZONTAL' | 'VERTICAL') {
        const texture = direction === 'HORIZONTAL' ? 'horizontalRocket' : 'verticalRocket'
        super(scene, x, y, texture)
        this.direction = direction
        this.scene = scene
    }
    public destroyTile(): void {
        this.destroyRocket()
    }
    public addDestroyTweens(gameScene: GameScene, tweens: Phaser.Types.Tweens.TweenBuilderConfig[], row: number, col: number, destroy: { value: number }): void {
        const destroyTile = gameScene.tileGrid[row][col]
        if(destroyTile){
            tweens.push({
                targets: gameScene.tileGrid[row][col],
                x: gameScene.tileGrid[row][col]?.x,
                y: gameScene.tileGrid[row][col]?.y,
                duration: 100,
                onComplete: () => {
                    destroy.value--;
                    if (destroyTile instanceof Tile) {
                        destroyTile.destroyTween();
                    }
                    gameScene.tileGrid[row][col]?.destroyTile();
                    gameScene.tileGrid[row][col] = undefined;
                    if ( destroy.value === 0 ){
                        gameScene.stateMachine.transition('fill')
                    }
                }
            });
        }
    }
    public destroyRocket(): void {
        const gameScene = this.scene as GameScene; // Cast to GameScene if necessary
        const {x,y} = gameScene.getTilePos(gameScene.tileGrid, this)
        const centerX = x;
        const centerY = y;
        gameScene.tileGrid[y][x]?.destroy();
        gameScene.tileGrid[y][x] = undefined
        if (this.direction === 'HORIZONTAL') {
            // Destroy tiles in the same row (horizontal)
            const destroy = { value: CONST.gridWidth - 2 };
            for (let offset = 1; offset < CONST.gridWidth; offset++) {
                this.addDestroyTweens(gameScene, this.secondTweens, centerY, centerX + offset, destroy)
                this.addDestroyTweens(gameScene, this.firstTweens, centerY, centerX - offset, destroy)
            }
        } else if (this.direction === 'VERTICAL') {
            // Destroy tiles in the same column (vertical)
            const destroy = { value: CONST.gridHeight - 2 };
            for (let offset = 1; offset < CONST.gridHeight; offset++) {
                this.addDestroyTweens(gameScene, this.secondTweens, centerY + offset, centerX, destroy)
                this.addDestroyTweens(gameScene, this.firstTweens, centerY - offset, centerX, destroy)
            }
        }
        gameScene.tweens.chain({tweens: this.firstTweens, loop: false});
        gameScene.tweens.chain({tweens: this.secondTweens, loop: false});

    }
    private isTileValid(gameScene: GameScene, row: number, col: number): boolean {
        if (row < 0 || row >= CONST.gridHeight || col < 0 || col >= CONST.gridWidth) {
            return false
        }
        return true
    }
}

export default RocketTile