import { CONST } from "../const"
import game from "../game";
import GameScene from "../scenes/GameScene"
import BallTile from "./BallTile";
import Tile from "./Tile"

class RocketTile extends Tile {
    private direction: 'HORIZONTAL' | 'VERTICAL'
    private firstTweens: Phaser.Types.Tweens.TweenBuilderConfig[] = [];
    private secondTweens: Phaser.Types.Tweens.TweenBuilderConfig[] = [];
    private smokeEmitter: Phaser.GameObjects.Particles.ParticleEmitter | null = null;
    
    constructor(scene: GameScene, x: number, y: number, direction: 'HORIZONTAL' | 'VERTICAL') {
        const texture = direction === 'HORIZONTAL' ? 'horizontalRocket' : 'verticalRocket'
        super(scene, x, y, texture)
        this.direction = direction
    }
    public destroyTile(): void {
        this.destroyRocket()
    }
    public destroyRocket(): void {
        const gameScene = this.currentScene
        const {x,y} = gameScene.getTilePos(gameScene.tileGrid, this)
        this.explodeEffect();
        if (this.direction === 'HORIZONTAL') {
            // Destroy tiles in the same row (horizontal)
            const destroy = { value: CONST.gridWidth - 1 };
            for (let offset = 1; offset < CONST.gridWidth; offset++) {
                this.addDestroyTweens(gameScene, this.secondTweens, y, x + offset, destroy)
                this.addDestroyTweens(gameScene, this.firstTweens, y, x - offset, destroy)
            }
        } else if (this.direction === 'VERTICAL') {
            // Destroy tiles in the same column (vertical)
            const destroy = { value: CONST.gridHeight - 1 };
            for (let offset = 1; offset < CONST.gridHeight; offset++) {
                this.addDestroyTweens(gameScene, this.secondTweens, y + offset, x, destroy)
                this.addDestroyTweens(gameScene, this.firstTweens, y - offset, x, destroy)
            }
        }
        if (this.firstTweens.length > 0) {
            gameScene.tweens.chain({tweens: this.firstTweens, loop: false});
        }
        if (this.secondTweens.length > 0) {
            gameScene.tweens.chain({tweens: this.secondTweens, loop: false});
        }   
        gameScene.tileGrid[y][x]?.destroy();
    }
    public addDestroyTweens(gameScene: GameScene, tweens: Phaser.Types.Tweens.TweenBuilderConfig[], row: number, col: number, destroy: {value: number}): void {
        if(this.isPosValid(row, col)){
            const destroyTile = gameScene.tileGrid[row][col]
            if(destroyTile){
                tweens.push({
                    targets: gameScene.tileGrid[row][col],
                    x: gameScene.tileGrid[row][col]?.x,
                    y: gameScene.tileGrid[row][col]?.y,
                    duration: 100,
                    onComplete: () => {
                        if(destroyTile instanceof BallTile){
                            destroy.value--;
                        }
                        else if(destroyTile instanceof RocketTile && destroyTile.direction === this.direction){
                            destroy.value--;
                            destroyTile.destroy();
                            gameScene.tileGrid[row][col] = undefined;
                        }
                        else if(destroyTile instanceof RocketTile && destroyTile.direction !== this.direction){
                            destroyTile?.destroyTile();
                            gameScene.tileGrid[row][col] = undefined;
                        }
                        else{
                            destroy.value--;
                            destroyTile?.destroyTile();
                            gameScene.tileGrid[row][col] = undefined;
                        } 
                        
                        if(destroy.value === 0) {
                            gameScene.stateMachine.transition('fill')
                        }
                    }
                });
            }
        }
    }
    private isPosValid(row: number, col: number): boolean {
        if(row < 0 || row >= CONST.gridHeight || col < 0 || col >= CONST.gridWidth){
            return false
        }
        return true
    }
    public explodeEffect(): void {
        const gameScene = this.scene as GameScene;
        const {x, y} = gameScene.getTilePos(gameScene.tileGrid, this);
        
        this.createSingleRocket(x, y, -1);
        this.createSingleRocket(x, y, 1);
        
        this.destroy();
    }
    
    private createSingleRocket(startX: number, startY: number, direction: number): void {
        const gameScene = this.scene as GameScene;
        const startPosX = startX * CONST.tileWidth + CONST.GRID_OFFSET_X + CONST.tileWidth / 2;
        const startPosY = startY * CONST.tileHeight + CONST.GRID_OFFSET_Y + CONST.tileHeight / 2;
        
        const rocket = gameScene.add.image(startPosX, startPosY, 'singleRocket');
        rocket.setScale(1, 0.55)
        rocket.setOrigin(0.5);
        
        // Xác định hướng và góc quay
        let endX, endY, angle;
        if (this.direction === 'HORIZONTAL') {
            endX = direction > 0 ? gameScene.cameras.main.width : 0;
            endY = startPosY;
            angle = direction > 0 ? 180 : 0;
        } else {
            endX = startPosX;
            endY = direction > 0 ? gameScene.cameras.main.height : 0;
            angle = direction > 0 ? 270 : 90;
        }
        
        rocket.setAngle(angle);
        const smokeEmitter = gameScene.add.particles(startPosX, startPosY, 'smokeParticle', {
            colorEase: 'quad.out',
            speed: { min: 10, max: 50 },
            scale: { start: 0.6, end: 0, ease: 'sine.in' },
            angle: angle,
            quantity: 0.5,
        })
        gameScene.tweens.add({
            targets: rocket,
            x: endX,
            y: endY,
            duration: 800,
            ease: 'Linear',
            onUpdate: (tween, target) => {
                let x = target.x
                let y = target.y
                if(this.direction === 'HORIZONTAL') {
                    if(direction > 0) x = target.x - 22
                    else x = target.x + 22
                }
                else{
                    if(direction > 0) y = target.y - 22
                    else y = target.y + 22 
                }
                smokeEmitter.setPosition(x, y)
                // Kiểm tra nếu rocket đi ra background
                if (x < CONST.backgroundX || x > CONST.backgroundX + CONST.backgroundWidth ||
                    y < CONST.backgroundY || y > CONST.backgroundY + CONST.backgroundHeight) {
                    rocket.destroy();
                    smokeEmitter.destroy();
                    tween.stop();
                }
            },
            onComplete: () => {
                rocket.destroy();
                smokeEmitter.destroy();
            }
        });
    }
    public swapWithRocket(otherRocket: RocketTile): void {
        const gameScene = this.currentScene;
        this.explodeCross();
        gameScene.time.delayedCall(600, () => {
            gameScene.stateMachine.transition('fill');
        });
    }

    public swapWithBall(ball: BallTile): void {
        const gameScene = this.currentScene;
        const {x, y} = gameScene.getTilePos(gameScene.tileGrid, this);
        this.explodeEffect()
        if (this.direction === 'HORIZONTAL') {
            this.explodeRows(y - 1, y + 1);
        } else {
            this.explodeColumns(x - 1, x + 1);
        }
        
        ball.destroy();
        gameScene.time.delayedCall(600, () => {
            gameScene.stateMachine.transition('fill');
        });
    }

    private explodeCross(): void {
        const gameScene = this.currentScene;
        const {x, y} = gameScene.getTilePos(gameScene.tileGrid, this);
        
        this.explodeRow(y);
        this.explodeColumn(x);
    }

    private explodeRows(startRow: number, endRow: number): void {
        for (let row = startRow; row <= endRow; row++) {
            if (row >= 0 && row < CONST.gridHeight) {
                this.explodeRow(row);
            }
        }
    }

    private explodeColumns(startCol: number, endCol: number): void {
        for (let col = startCol; col <= endCol; col++) {
            if (col >= 0 && col < CONST.gridWidth) {
                this.explodeColumn(col);
            }
        }
    }

    private explodeRow(row: number): void {
        const gameScene = this.currentScene;
        for (let col = 0; col < CONST.gridWidth; col++) {
            const tile = gameScene.tileGrid[row][col];
            if (tile instanceof RocketTile || tile instanceof BallTile) {
                tile.destroy();
                gameScene.tileGrid[row][col] = undefined;
            }
            else if(tile) {
                tile.destroyTile();
                gameScene.tileGrid[row][col] = undefined;
            }
        }
    }

    private explodeColumn(col: number): void {
        const gameScene = this.currentScene;
        for (let row = 0; row < CONST.gridHeight; row++) {
            const tile = gameScene.tileGrid[row][col];
            if (tile instanceof RocketTile || tile instanceof BallTile) {
                tile.destroy();
                gameScene.tileGrid[row][col] = undefined;
            }
            else if(tile) {
                tile.destroyTile();
                gameScene.tileGrid[row][col] = undefined;
            }
        }
    }
}

export default RocketTile