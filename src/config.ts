import { BootScene } from "./scenes/BootScene";
import GameScene from "./scenes/PlayScene";


export const GameConfig: Phaser.Types.Core.GameConfig = {
  title: 'Candy crush',
  width: 532,
  height: 660,
  type: Phaser.AUTO,
  parent: 'game',
  scene: [BootScene, GameScene],
  render: { pixelArt: false, antialias: true }
};
