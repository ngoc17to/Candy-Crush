export class BootScene extends Phaser.Scene {
    private loadingBar: Phaser.GameObjects.Graphics
    private progressBar: Phaser.GameObjects.Graphics
  
    constructor() {
        super({
            key: 'BootScene'
        })
    }
  
    preload(): void {
        // set the background and create loading bar
        this.cameras.main.setBackgroundColor(0x98d687)
        this.createLoadingbar()
  
        // pass value to change the loading bar fill
        this.load.on('progress', (value: number) => {
            this.progressBar.clear();
            this.progressBar.fillStyle(0xfff6d3, 1);
            this.progressBar.fillRect(
                this.cameras.main.width / 4,
                this.cameras.main.height / 2 - 16,
                (this.cameras.main.width / 2) * value,
                16
            );
        });
  
        // delete bar graphics, when loading complete
        this.load.on('complete', () => {
            this.progressBar.destroy();
            this.loadingBar.destroy();
        });
  
        // load out package
        this.load.pack('preload', './assets/pack.json', 'preload')
        this.load.pack('explodeParticle', './assets/explodePack.json', 'explodeParticle')
        this.load.image('background', './assets/images/BackgroundWithThrone.jpg')
        this.load.image('board', './assets/images/Level1-Board.png')
        this.load.image('particle', './assets/images/CircleWithOutwardsLines.png')
        this.load.image('horizontalRocket', './assets/images/Boosters/HorizontalRocket.png')
        this.load.image('verticalRocket', './assets/images/Boosters/VerticalRocket.png')
        this.load.image('lightBall', './assets/images/Boosters/Light Ball.png')

    }
  
    update(): void {
        this.scene.start('GameScene')
    }
  
    private createLoadingbar(): void {
        this.loadingBar = this.add.graphics()
        this.loadingBar.fillStyle(0x5dae47, 1)
        this.loadingBar.fillRect(
            this.cameras.main.width / 4 - 2,
            this.cameras.main.height / 2 - 18,
            this.cameras.main.width / 2 + 4,
            20
        )
        this.progressBar = this.add.graphics()
    }
  }
  