import { CONST } from "../const";
import GameScene from "../scenes/GameScene";
import RocketTile from "./RocketTile";
import Tile from "./Tile";

class BallTile extends Tile {
    private connections: Phaser.GameObjects.Line[] = [];

    constructor(scene: GameScene, x: number, y: number) {
        super(scene, x, y, 'lightBall');
    }

    public destroyTile(): void {
        const gameScene = this.scene as GameScene;
        const swappedTile = gameScene.firstSelectedTile instanceof BallTile ?
                            gameScene.secondSelectedTile :
                            gameScene.firstSelectedTile;
        console.trace()
        if (swappedTile) {
            this.destroyMatchingTiles(swappedTile.texture.key);
        } else {
            super.destroyTile();
        }
    }

    private destroyMatchingTiles(tileType: string): void {
        const matchingTiles = this.findMatchingTiles(tileType);
        
        this.createConnectionEffects(matchingTiles);
    }

    private findMatchingTiles(tileType: string): Tile[] {
        const gameScene = this.scene as GameScene;
        const matchingTiles: Tile[] = [];

        for (let y = 0; y < CONST.gridHeight; y++) {
            for (let x = 0; x < CONST.gridWidth; x++) {
                const tile = gameScene.tileGrid[y][x];
                if (tile && tile.texture.key === tileType) {
                    matchingTiles.push(tile);
                }
            }
        }

        return matchingTiles;
    }

    private createConnectionEffects(tiles: Tile[]): void {
        const gameScene = this.scene as GameScene;
        const connectionTweens: Phaser.Types.Tweens.TweenBuilderConfig[] = [];

        tiles.forEach((tile, index) => {

            const line = gameScene.add.line(
                0, 0,
                this.x + 16, this.y + 16,
                tile.x + 16, tile.y + 16,
                0xffffff
            );
            line.setOrigin(0, 0);
            line.setAlpha(0);
            line.setLineWidth(2);

            this.connections.push(line);

            connectionTweens.push({
                targets: line,
                alpha: 1,
                duration: 50,
                onComplete: () => {
                    if (index === tiles.length - 1) {
                        this.createExplosionEffects(tiles);
                    }
                }
            });
        });

        gameScene.tweens.chain({
            tweens: connectionTweens
        });
    }

    private createExplosionEffects(tiles: Tile[]): void {
        const gameScene = this.scene as GameScene;
        
        tiles.forEach((tile) => {
            const tilePos = gameScene.getTilePos(gameScene.tileGrid, tile);
            tile.destroyTile();
            gameScene.tileGrid[tilePos.y][tilePos.x] = undefined;
        });
        this.destroy();
        this.connections.forEach(connection => connection.destroy());
        gameScene.time.delayedCall(600, () => {
            gameScene.stateMachine.transition('fill');
        });
    }
    public swapWithBall(otherBall: BallTile): void {
        this.explodeAll();
        otherBall.destroy();
    }

    private explodeAll(): void {
        const gameScene = this.currentScene;
        for (let row = 0; row < CONST.gridHeight; row++) {
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
        gameScene.time.delayedCall(600, () => {
            gameScene.stateMachine.transition('fill');
        });
    }
}

export default BallTile;