import { CONST } from "../const";
import GameScene from "../scenes/GameScene";

class ScoreManager {
    private score: number;
    private milestone: number;
    private scene: GameScene;
    private scoreText: Phaser.GameObjects.Text

    constructor(scene: GameScene, initialMilestone: number) {
        this.scene = scene;
        this.score = 0;
        this.scoreText = this.scene.add.text(CONST.GRID_OFFSET_X + 320, CONST.GRID_OFFSET_Y - 40, `${this.score}`, {
            fontSize: '48px',
            color: '#000',
            fontStyle: 'bold',
            align: 'center',
        })
        this.scoreText.setOrigin(0.5)
        this.milestone = initialMilestone;
    }

    public addScore(points: number): void {
        this.score += points;        
        this.scene.tweens.add({
            targets: this.scoreText,
            scale: 1.2,
            duration: 100,
            yoyo: true,
            repeat: 0,
        })
    }

    public getMilestone(): number {
        return this.milestone
    }

    public setMilestone(value: number): void {
        this.milestone = value
    }

    public getScore(): number {
        return this.score;
    }

    public update(): void {
        this.scoreText.setText(`${this.score}`)
    }
}

export default ScoreManager