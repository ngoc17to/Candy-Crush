import { CONST } from "../const"
import game from "../game";
import GameScene from "../scenes/GameScene"
import Tile from "./Tile"

class RocketTile extends Tile {
    private direction: 'HORIZONTAL' | 'VERTICAL'
    private firstTweens: Phaser.Types.Tweens.TweenBuilderConfig[] = [];
    private secondTweens: Phaser.Types.Tweens.TweenBuilderConfig[] = [];
    constructor(scene: GameScene, x: number, y: number, direction: 'HORIZONTAL' | 'VERTICAL') {
        const texture = direction === 'HORIZONTAL' ? 'horizontalRocket' : 'verticalRocket'
        super(scene, x, y, texture)
        this.direction = direction
    }
    public destroyTile(): void {
        console.log('rocket tile')
        this.destroyRocket()
    }
    public addDestroyTweens(gameScene: GameScene, tweens: Phaser.Types.Tweens.TweenBuilderConfig[], row: number, col: number, destroy: {value: number}): void {
        const destroyTile = gameScene.tileGrid[row][col]
        if(destroyTile){
            tweens.push({
                targets: gameScene.tileGrid[row][col],
                x: gameScene.tileGrid[row][col]?.x,
                y: gameScene.tileGrid[row][col]?.y,
                duration: 100,
                onComplete: () => {
                    if (destroyTile instanceof Tile) {
                        destroy.value--;
                    }
                    destroyTile?.destroyTile();
                    gameScene.tileGrid[row][col] = undefined;
                    if(destroy.value === 0) {
                        gameScene.stateMachine.transition('fill')
                    }
                }
            });
        }
    }
    public destroyRocket(): void {
        const gameScene = this.currentScene
        const {x,y} = gameScene.getTilePos(gameScene.tileGrid, this)
        const centerX = x;
        const centerY = y;

        if (this.direction === 'HORIZONTAL') {
            // Destroy tiles in the same row (horizontal)
            const destroy = { value: CONST.gridWidth - 1 };
            for (let offset = 1; offset < CONST.gridWidth; offset++) {
                this.addDestroyTweens(gameScene, this.secondTweens, centerY, centerX + offset, destroy)
                this.addDestroyTweens(gameScene, this.firstTweens, centerY, centerX - offset, destroy)
            }
        } else if (this.direction === 'VERTICAL') {
            // Destroy tiles in the same column (vertical)
            const destroy = { value: CONST.gridHeight - 1 };
            for (let offset = 1; offset < CONST.gridHeight; offset++) {
                this.addDestroyTweens(gameScene, this.secondTweens, centerY + offset, centerX, destroy)
                this.addDestroyTweens(gameScene, this.firstTweens, centerY - offset, centerX, destroy)
            }
        }
        gameScene.tweens.chain({tweens: this.firstTweens, loop: false});
        gameScene.tweens.chain({tweens: this.secondTweens, loop: false});
        gameScene.tileGrid[y][x]?.destroy();
    }
}

export default RocketTile