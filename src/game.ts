import 'phaser';
import { BootScene } from './scenes/BootScene';
import GameScene from './scenes/GameScene';

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: 'game',
        width: window.innerWidth,
        height: window.innerHeight
    },
	physics: {
		default: 'arcade',
		arcade: {
			gravity: {x: 0, y: 250 },
            debug: true,            
		}
	},
	scene: [BootScene, GameScene]
}

export default new Phaser.Game(config)