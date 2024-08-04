import { CONST } from "../const"
import ScoreManager from "../manager/ScoreManager"
import GameScene from "../scenes/GameScene"

class Milestone extends Phaser.GameObjects.Container {
    private milestoneText: Phaser.GameObjects.Text
    private progressBar: Phaser.GameObjects.Image
    private progressFill: Phaser.GameObjects.Image
    private scoreManager: ScoreManager
    private cropRect: Phaser.Geom.Rectangle
    constructor(scene: GameScene) {
        super(scene)
        this.scoreManager = scene.scoreManager
        const milestone = this.scoreManager.getMilestone()
        const score = this.scoreManager.getScore()
        this.milestoneText = scene.add.text(CONST.GRID_OFFSET_X, CONST.GRID_OFFSET_Y - 100, `TARGET: ${milestone}`, {
            fontSize: '36px',
            color: '#000',
            fontStyle: 'bold',
        })
        this.progressBar = this.scene.add.image(CONST.GRID_OFFSET_X, CONST.GRID_OFFSET_Y - 50, 'progressBar')
        this.progressBar.setOrigin(0)
        this.progressBar.setScale(0.25)
        this.progressFill = this.scene.add.image(CONST.GRID_OFFSET_X, CONST.GRID_OFFSET_Y - 50, 'progressFill')
        this.progressFill.setOrigin(0)
        this.progressFill.setScale(0.25)
        this.cropRect = new Phaser.Geom.Rectangle(0, 0, 0, this.progressFill.height)
        this.progressFill.setCrop(this.cropRect)
        Phaser.Display.Align.In.LeftCenter(this.progressFill, this.progressBar, 0, 0)

        this.add(this.milestoneText)
        this.add(this.progressBar)
        this.add(this.progressFill)
        scene.add.existing(this)
    }

    update(): void {
        const currentMilestone = this.scoreManager.getMilestone()
        const score = this.scoreManager.getScore()
        const previousMilestone = currentMilestone - 2000
        const progress = Math.min(1, (score - previousMilestone) / (currentMilestone - previousMilestone))

        this.scene.tweens.add({
            targets: this.cropRect,
            width: this.progressFill.width * progress,
            duration: 100,
            yoyo: false,
            repeat: 0,
        })

        this.progressFill.setCrop(this.cropRect)
        this.milestoneText.setText(`TARGET: ${currentMilestone}`)
    }
}

export default Milestone