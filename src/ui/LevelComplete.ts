import GameScene from "../scenes/GameScene";

class LevelComplete extends Phaser.GameObjects.Container {
    private background: Phaser.GameObjects.Sprite;
    private levelCompleteText: Phaser.GameObjects.Text;

    constructor(scene: GameScene, x: number, y: number) {
        super(scene, x, y);

        this.background = scene.add.sprite(0, 0, 'menu').setScale(0.25)
        this.levelCompleteText = scene.add.text(0, 0, 'Level Complete!!!',
        {font: '36px Arial', color:'#e67300'})
        
        Phaser.Display.Align.In.Center(this.levelCompleteText, this.background, 0, 0);

        this.add([this.background,this.levelCompleteText]);

        this.setVisible(false);

        this.setSize(this.background.displayWidth, this.background.displayHeight)
        this.setDepth(3)
        scene.add.existing(this);
    }
}

export default LevelComplete