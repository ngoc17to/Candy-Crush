import { CONST } from "../const";
import GameScene from "../scenes/GameScene";
import State from "../types/State";

class PlayState extends State{
    private scene: GameScene
    private elapsedTime = 0

    constructor(scene: GameScene) {
        super()
        this.scene = scene
        this.elapsedTime = 0
        this.scene.input.on("gameobjectdown", () => {this.elapsedTime = 0}, this);

    }

    enter(): void {
        console.log("PlayState")
        this.elapsedTime = 0
        this.scene.canPick = true
        if(this.scene.scoreManager.getScore() >= this.scene.scoreManager.getMilestone()){
            this.scene.scoreManager.setMilestone(this.scene.scoreManager.getMilestone() + 1000)
            this.stateMachine.transition('shuffle')
        }
        const hint = this.scene.getHint()
        if (hint.length === 0) {
            this.stateMachine.transition('shuffle')
        } else {
            const randomHint = hint[Phaser.Math.Between(0, hint.length - 1)]
            const firstHintBox = this.scene.firstHintBox
            const secondHintBox = this.scene.secondHintBox

            firstHintBox.x = randomHint.x1 * CONST.tileWidth + CONST.GRID_OFFSET_X;
            firstHintBox.y = randomHint.y1 * CONST.tileHeight + CONST.GRID_OFFSET_Y

            secondHintBox.x = randomHint.x2 * CONST.tileWidth + CONST.GRID_OFFSET_X;
            secondHintBox.y = randomHint.y2 * CONST.tileHeight + CONST.GRID_OFFSET_Y
        }
    }
    exit(): void {
        this.elapsedTime = 0
        this.scene.firstHintBox.setVisible(false)
        this.scene.secondHintBox.setVisible(false)
        
    }
    execute(time: number, delta: number): void {
        if (this.elapsedTime > CONST.HINT_APPEAR) {
            this.scene.firstHintBox.setVisible(true)
            this.scene.secondHintBox.setVisible(true)
        }
        if(this.elapsedTime >= CONST.TRANSITION_DELAY){
            const tileGrid = this.scene.tileGrid
            for (let i = 0; i < tileGrid.length; i++) {
                for (let j = 0; j < tileGrid[i].length; j++) {
                    if (tileGrid[i][j]) {
                        this.scene.tweens.add({
                            targets: tileGrid[i][j],
                            displayWidth: CONST.tileWidth,
                            displayHeight: CONST.tileHeight,
                            ease: 'Sine.easeInOut',
                            duration: 200,
                            delay: 50 * i + j * 50,
                            yoyo: true,
                            repeat: 0,
                        })
                    }
                }
            }
            this.elapsedTime = 0
        }
        else{
            this.elapsedTime += delta
        }
    }

}

export default PlayState