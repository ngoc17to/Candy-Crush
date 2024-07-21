import State from "../types/State";
import GameScene from "../scenes/GameScene";
import Tile from "../game-objects/Tile";
import { CONST } from "../const";
import { GameObjects } from "phaser";

class ShuffleState extends State {
    private scene: GameScene;
    private tiles: (Tile | undefined)[];
    private confetti: Phaser.GameObjects.Particles.ParticleEmitter;

    constructor(scene: GameScene) {
        super();
        this.scene = scene;
        this.tiles = scene.tiles;
        this.setupConfetti();
    }

    private setupConfetti(): void {

        this.confetti = this.scene.add.particles(0, 0, 'confetti', {
            frequency: 1000 / 100,
            lifespan: { min: 8000, max: 12000 },
            speedY: { min: -4000, max: -2000 },
            speedX: { min: -400, max: 400 },
            angle: { min: -85, max: -95 },
            gravityY: 2000,
            frame: { frames: [0, 2, 4, 6, 8, 10, 12, 14, 16], cycle: true },
            quantity: { min: 80, max: 120 },
            emitting: false,
            scale: { start: 0.8, end: 0.2 },
            scaleX: {
                onEmit: () => {
                    return 1
                },
                onUpdate: (particle) => {
                    return Math.cos((2*Math.PI) * 8 * particle.lifeT)
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
        });
        this.confetti.setDepth(1000);
    }

    enter(): void {
        console.log("Shuffle State");
        this.showLevelCompleteMessage();
        this.explodeConfetti();
        this.scene.shuffleTiles();
        this.scene.canPick = false;
        this.animateTilesCircle();
    }

    private explodeConfetti(): void {
        const { width, height } = this.scene.cameras.main;
        this.confetti.explode(200, width / 2, height);
    }
    private showLevelCompleteMessage(): void {
        const { levelComplete, tweens } = this.scene;
        levelComplete.setVisible(true).setAlpha(0);
        
        tweens.add({
            targets: levelComplete,
            alpha: 1,
            scale: 1,
            duration: 300,
            ease: 'Quint.easeIn',
            onComplete: () => {
                this.scene.time.delayedCall(1500, () => {
                    tweens.add({
                        targets: levelComplete,
                        alpha: 0,
                        scale: 0.5,
                        duration: 300,
                        ease: 'Quint.easeIn',
                        onComplete: () => levelComplete.setVisible(false).setActive(false)
                    });
                });
            }
        });
    }

    private animateTilesCircle(): void {
        const tiles = this.scene.tiles as GameObjects.GameObject[];
        const { width, height } = this.scene.cameras.main;
        const centerX = width / 2 - 20;
        const centerY = height / 2 + 50;
        const radius = Math.min(width, height) / 5;
        
        const circle = new Phaser.Geom.Circle(centerX, centerY, radius);
        Phaser.Actions.PlaceOnCircle(tiles, circle);

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
            onComplete: () => this.moveTilesToNewPositions()
        });
    }

    private moveTilesToNewPositions(): void {
        const tiles = this.scene.tiles as GameObjects.GameObject[];
        tiles.forEach((tileObj: GameObjects.GameObject, index: number) => {
            const tile = tileObj as Tile;
            const x = index % CONST.gridWidth;
            const y = Math.floor(index / CONST.gridWidth);
            const newX = x * CONST.tileWidth + CONST.GRID_OFFSET_X;
            const newY = y * CONST.tileHeight + CONST.GRID_OFFSET_Y;

            this.scene.tweens.add({
                targets: tile,
                x: newX,
                y: newY,
                duration: 1000,
                ease: 'Power2',
                onComplete: () => {
                    if (index === tiles.length - 1) {
                        this.scene.stateMachine.transition('match');
                        this.scene.canPick = true;
                    }
                }
            });
        });
    }

    exit(): void {}
    execute(time: number, delta: number): void {}
}

export default ShuffleState;