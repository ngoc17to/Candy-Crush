import State from "../types/State";
import GameScene from "../scenes/GameScene";
import Tile from "../game-objects/Tile";

class ShuffleState extends State {
    private scene: GameScene;
    private tiles: Phaser.GameObjects.Group;

    constructor(scene: GameScene) {
        super();
        this.scene = scene;
        this.tiles = scene.tiles

    }

    enter(): void {
        console.log("ShuffleState");
        // this.shuffleTiles().then(() => {
        //     this.scene.stateMachine.transition('play');
        // });
        // this.placeTilesInCircle();


    }
    private placeTilesInCircle(): void {
        const circle = new Phaser.Geom.Circle(this.scene.cameras.main.width / 2, this.scene.cameras.main.height / 2, 100);

        // Place tiles on the circle
        Phaser.Actions.PlaceOnCircle(this.tiles.getChildren(), circle);

        // Create a tween to rotate the tiles around the circle
        this.scene.tweens.add({
            targets: circle,
            radius: 100,
            ease: 'Quintic.easeInOut',
            duration: 1500,
            yoyo: false,
            repeat: 0,
            onUpdate: () => {
                Phaser.Actions.RotateAroundDistance(this.tiles.getChildren(), circle, 0.02, circle.radius);
            },
            onComplete: () => {
                this.moveTilesToOriginalPositions();
            }
        });
    }

    private moveTilesToOriginalPositions(): void {
        this.tiles.getChildren().forEach((tile, index) => {
            const tileSprite = tile as Tile | undefined

            this.scene.tweens.add({
                targets: tileSprite,
                x: tileSprite?.x,
                y: tileSprite?.y,
                duration: 500,
                delay: index * 50, // Optional: delay each tile's movement slightly for a staggered effect
                ease: 'Power2',
                onComplete: () => {
                    if (tileSprite === this.tiles.getChildren()[this.tiles.getChildren().length - 1]) {
                        // Last tile completed moving, transition to next state
                        this.scene.stateMachine.transition('play');
                    }
                }
            });
        });
    }

    // private shuffleTiles(): Promise<void> {
    //     return new Promise((resolve) => {
    //         // Thực hiện trộn lại các tile ở đây
    //         this.scene.shuffleTiles(); // Giả sử bạn có hàm shuffleTiles trong GameScene

    //         // Sử dụng tween hoặc delayed call để hoàn tất việc trộn
    //         this.scene.time.delayedCall(2000, () => {
    //             resolve();
    //         });
    //     });
    // }

    exit(): void {
        // Thực hiện bất kỳ logic nào khi thoát khỏi state Shuffle
    }

    execute(time: number, delta: number): void {
        // Thực hiện logic cập nhật nếu cần
    }
}

export default ShuffleState;
