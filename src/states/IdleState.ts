import { CONST } from "../const";
import GameScene from "../scenes/GameScene";
import State from "../types/State";

class IdleState extends State{
    private scene: GameScene
    private idleTween: Phaser.Tweens.Tween[]

    constructor(scene: GameScene) {
        super()
        this.scene = scene
        this.idleTween = []
    }

    enter(): void {
        for(let y = 0; y < CONST.gridHeight; y++){
            for(let x = 0; x < CONST.gridWidth; x ++){
                this.idleTween.push(this.scene.tweens.add({
                    x: this.scene.tileGrid[y][x]!.x + CONST.gridWidth/2,
                    y: this.scene.tileGrid[y][x]!.y + CONST.gridHeight/2,
                    targets: this.scene.tileGrid[y][x],
                    scale: 0.6,
                    ease: 'sine.inout',
                    duration: 300,
                    delay: y * 50,
                    repeat: -1,
                    yoyo: true,
                    repeatDelay: 5000,
                }))
            }
        }
        this.scene.input.on("gameobjectdown", this.onGameObjectDown, this);


    }
    exit(): void {
        this.idleTween.forEach(tween => {
            tween.destroy();
        });   
        for(let y = 0; y < CONST.gridHeight; y++){
            for(let x = 0; x < CONST.gridWidth; x ++){
                this.scene.tileGrid[y][x]?.setScale(0.7)
            }
        }
        this.scene.input.off("gameobjectdown", this.onGameObjectDown, this);
    }
    private onGameObjectDown(): void {
        console.log('IdleState -> PlayState');
        this.stateMachine.transition('play');
    }
    execute(time: number, delta: number): void {
        


    }

}

export default IdleState