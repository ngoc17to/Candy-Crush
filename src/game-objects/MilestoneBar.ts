import ScoreManager from "../manager/ScoreManager";
import GameScene from "../scenes/GameScene";

class MilestoneBar {
    private scene: GameScene;
    private progressBar: Phaser.GameObjects.Graphics;
    private progressBox: Phaser.GameObjects.Graphics;
    private scoreManager: ScoreManager;

    constructor(scene: GameScene, scoreManager: ScoreManager) {
        this.scene = scene;
        this.scoreManager = scoreManager;
        this.createMilestoneBar();
    }

    private createMilestoneBar(): void {
        const screenHeight = this.scene.cameras.main.height
        const screenWidth = this.scene.cameras.main.width


        this.progressBox = this.scene.add.graphics();
        this.progressBox.fillStyle(0x222222, 0.8);
        this.progressBox.fillRect((screenWidth - 320)/2, screenHeight/4 - 100, 320, 50);

        this.progressBar = this.scene.add.graphics();
    }

    public updateMilestoneBar(): void {
        const screenHeight = this.scene.cameras.main.height
        const screenWidth = this.scene.cameras.main.width
        this.progressBar.clear();
        this.progressBar.fillStyle(0xffffff, 1);
        const percentage = (this.scoreManager.getScore() / this.scoreManager.getMilestone()) * 100;
        this.progressBar.fillRect((screenWidth - 300)/2, screenHeight/4 - 90, 300 * (percentage / 100), 30);
    }
}

export default MilestoneBar