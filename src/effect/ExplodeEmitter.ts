import { explodeFrameMap } from "../const";

class ExplodeEmitter {
    private scene: Phaser.Scene;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    createExplosionParticles(x: number, y: number, tileType: string){
        const frame = explodeFrameMap[tileType]
        const emitter = this.scene.add.particles(x, y, frame, {
            angle: { min: 0, max: 360 },
            lifespan: 1000,
            speed: 150,
            gravityY: 800,
            scale: {
                start: 0.2,
                end: 0,
                ease: 'Sine.easeInOut',
            },
        });

        emitter.explode(7)

    }
}

export default ExplodeEmitter;
