import GameScene from "../scenes/GameScene";

class Confetti extends Phaser.GameObjects.Particles.ParticleEmitter {
    constructor(scene: GameScene){
        super(scene, 0, 0, 'confetti', {
            frequency: 1000 / 60,
            lifespan: 10000,
            speedY: { min: -6000, max: -4000 },
            speedX: { min: -500, max: 500 },
            angle: { min: -85, max: -95 },
            gravityY: 1000,
            frame: [0, 4, 8, 12, 16],
            quantity: 100,
            x: { min: 0, max: 800 },
            emitting: false,
            scaleX: {
                onEmit: (particle) => {
                    return 1
                },
                onUpdate: (particle) => {
                    // 4 cycles per lifespan
                    return Math.cos((2 * Math.PI) * 4 * particle.lifeT)
                },
            },
            rotate: {
                onEmit: (particle) => {
                    return 0
                },
                onUpdate: (particle) => {
                    // 2 cycles per lifespan
                    return 2 * 360 * Math.sign(particle.velocityX) * particle.lifeT
                },
            },
            accelerationX: {
                onEmit: (particle) => {
                    return 0
                },
                onUpdate: (particle) => {
                    return -particle.velocityX * Phaser.Math.Between(0, 1)
                },
            },
            accelerationY: {
                onEmit: (particle) => {
                    return 0
                },
                onUpdate: (particle) => {
                    return -particle.velocityY * Phaser.Math.Between(3, 4)
                },
            },
        })
        // this.stop()
    }
}

export default Confetti