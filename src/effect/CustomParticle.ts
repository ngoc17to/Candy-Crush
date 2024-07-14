// class CustomParticle extends Phaser.GameObjects.Particle {
//     private initialVelocity: number;
//     private deceleration: number;

//     constructor(emitter: Phaser.GameObjects.Particles.ParticleEmitter) {
//         super(emitter);
//         this.initialVelocity = 500; // Adjust as needed
//         this.deceleration = 50; // Adjust as needed
//     }

//     update(delta: number, step: number, processors: any): boolean {
//         this.velocityY += this.deceleration * delta;
//         return super.update(delta, step, processors);
//     }
// }