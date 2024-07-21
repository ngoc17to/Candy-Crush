import State from "../types/State";
import GameScene from "../scenes/GameScene";
import Tile from "../game-objects/Tile";
import { CONST } from "../const";
import { GameObjects } from "phaser";
import Confetti from "../effect/Confetti";
class ShuffleState extends State {
    private scene: GameScene;
    private tiles: (Tile | undefined)[]
    private confetti: Phaser.GameObjects.Particles.ParticleEmitter

    constructor(scene: GameScene) {
        super();
        this.scene = scene;
        this.tiles = scene.tiles    
        this.confetti = this.scene.add.particles(0, 0, 'confetti', {
            frequency: 1000 / 60,
            lifespan: 10000,
            speedY: { min: -5000, max: -3000 },
            speedX: { min: -500, max: 500 },
            angle: { min: -85, max: -95 },
            gravityY: 2000,
            frame: [0, 2, 4, 6, 8, 10, 12, 14, 16],
            quantity: 100,
            x: { min: 0, max: 800 },
            emitting: false,
            scaleX: {
                onEmit: () => {
                    return 1
                },
                onUpdate: (particle) => {
                    return Math.cos((2 * Math.PI) * 8 * particle.lifeT)
                },
            },
            rotate: {
                onEmit: () => {
                    return 0
                },
                onUpdate: (particle) => {
                    return 4 * 360 * Math.sign(particle.velocityX) * particle.lifeT
                },
            },
            accelerationX: {
                onEmit: () => {
                    return 0
                },
                onUpdate: (particle) => {
                    return -particle.velocityX * Phaser.Math.Between(0, 1)
                },
            },
            accelerationY: {
                onEmit: () => {
                    return 0
                },
                onUpdate: (particle) => {
                    return -particle.velocityY * Phaser.Math.Between(3, 4)
                },
            },
        })

    }

    enter(): void {
        console.log("Shuffle State");
        this.scene.levelComplete.setVisible(true);
        this.scene.levelComplete.setAlpha(0);
        this.scene.tweens.add({
            targets: this.scene.levelComplete,
            alpha: 1,
            scale: 1,
            duration: 300,
            ease: 'Quint.easeIn'
        });
        this.scene.time.delayedCall(1500, () => {
             this.scene.levelComplete.setAlpha(1);
             this.scene.levelComplete.setScale(1);
            this.scene.tweens.add({
                targets:  this.scene.levelComplete,
                alpha: 0,
                scale: 0.5,
                duration: 300,
                ease: 'Quint.easeIn',
                onComplete: () => {
                     this.scene.levelComplete.setVisible(false);
                     this.scene.levelComplete.setActive(false);
                }
            });
        });
        this.confetti.explode(200, this.scene.cameras.main.width / 2, this.scene.cameras.main.height)
        this.scene.shuffleTiles()
        // Disable user interaction
        this.scene.canPick = false;

        const tiles = this.scene.tiles as GameObjects.GameObject[]
        const centerX = this.scene.cameras.main.width / 2 - 20;
        const centerY = this.scene.cameras.main.height / 2 + 50;
        const radius = Math.min(this.scene.cameras.main.width, this.scene.cameras.main.height) / 5;
        // Create a circle
        const circle = new Phaser.Geom.Circle(centerX, centerY, radius);

        // Place tiles on the circle
        Phaser.Actions.PlaceOnCircle(tiles, circle);

        // Create a tween to rotate the tiles around the circle
        this.scene.tweens.add({
            targets: circle,
            radius: radius,
            ease: 'Quintic.easeInOut',
            duration: 2000,
            yoyo: false,
            repeat: 1, 
            onUpdate: () => {
                Phaser.Actions.RotateAroundDistance(tiles, circle, 0.02, circle.radius);
            },
            onComplete: () => {
                this.moveTilesToNewPositions(this.scene);
            }
        });
    }

    moveTilesToNewPositions(scene: GameScene) {
        const tiles = this.scene.tiles as GameObjects.GameObject[]
        tiles.forEach((tileObj: GameObjects.GameObject, index: number) => {
            const tile = tileObj as Tile;
            const y = Math.floor(index / CONST.gridWidth);
            const x = index % CONST.gridWidth;
            const newX = x * CONST.tileWidth + CONST.GRID_OFFSET_X;
            const newY = y * CONST.tileHeight + CONST.GRID_OFFSET_Y;

            scene.tweens.add({
                targets: tile,
                x: newX,
                y: newY,
                duration: 1000,
                ease: 'Power2',
                onComplete: () => {
                    if (index === tiles.length - 1) {
                        // All tiles are in place, transition back to play state
                        this.scene.stateMachine.transition('match');
                        scene.canPick = true;
                    }
                }
            });
        });
    }

    exit(): void {
    }

    execute(time: number, delta: number): void {
    }
}

export default ShuffleState;
