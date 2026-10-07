import Phaser from 'phaser';
import BootScene from './scenes/BootScene.js';
import MenuScene from './scenes/MenuScene.js';
import IntroScene from './scenes/IntroScene.js';
import GameScene from './scenes/GameScene.js';
import PuzzleScene from './scenes/PuzzleScene.js';
import EvidenceBoardScene from './scenes/EvidenceBoardScene.js';
import FinalChoiceScene from './scenes/FinalChoiceScene.js';
import FinalScene from './scenes/FinalScene.js';

const config = {
  type: Phaser.AUTO,
  width: 1024,
  height: 768,
  parent: 'game-container',
  backgroundColor: '#1a0a00',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scene: [BootScene, MenuScene, IntroScene, GameScene, PuzzleScene, EvidenceBoardScene, FinalChoiceScene, FinalScene],
};

const game = new Phaser.Game(config);