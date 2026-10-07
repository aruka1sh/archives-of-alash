import Phaser from 'phaser';
import { FINAL_CHOICES, EPILOGUES } from '../data/chapters.js';

export default class FinalChoiceScene extends Phaser.Scene {
  constructor() {
    super({ key: 'FinalChoiceScene' });
  }

  init(data) {
    this.gameScene = data.gameScene;
    this.cm = data.gameScene.chapterManager;
  }

  create() {
    const w = this.cameras.main.width;
    const h = this.cameras.main.height;

    this.add.rectangle(w / 2, h / 2, w, h, 0x120808, 0.97);

    this.add.text(w / 2, 28, '◆  THE FINAL DECISION  ◆', {
      fontFamily: 'Cinzel, Georgia, serif',
      fontSize: '26px',
      color: '#C4A46C',
      letterSpacing: 4,
    }).setOrigin(0.5);

    this.add.text(w / 2, 58, 'The manuscript holds the 12 living copyists’ names. What will you do with it?', {
      fontFamily: 'Lora, Georgia, serif',
      fontSize: '14px',
      color: '#D4C5A9',
      fontStyle: 'italic',
    }).setOrigin(0.5);

    const startY = 95;
    const cardH = 160;
    const gap = 16;
    const cardW = 620;

    const keyLetters = ['A', 'B', 'C'];

    FINAL_CHOICES.forEach((choice, i) => {
      const cy = startY + i * (cardH + gap) + cardH / 2;
      const cx = w / 2;

      const bg = this.add.graphics();
      bg.fillStyle(0x2A1506, 0.95);
      bg.fillRoundedRect(cx - cardW / 2, cy - cardH / 2, cardW, cardH, 12);
      bg.lineStyle(1.5, 0x8B7355, 0.6);
      bg.strokeRoundedRect(cx - cardW / 2, cy - cardH / 2, cardW, cardH, 12);

      this.add.text(cx, cy - cardH / 2 + 22, `[${i + 1}] OPTION ${i + 1}: ${choice.title}`, {
        fontFamily: 'Cinzel, Georgia, serif',
        fontSize: '18px',
        color: '#E8D5B0',
        letterSpacing: 2,
      }).setOrigin(0.5);

      this.add.text(cx, cy - cardH / 2 + 46, choice.description, {
        fontFamily: 'Lora, Georgia, serif',
        fontSize: '13px',
        color: '#C4A46C',
        fontStyle: 'italic',
      }).setOrigin(0.5);

      this.add.text(cx, cy + 12, choice.detail, {
        fontFamily: 'Lora, Georgia, serif',
        fontSize: '13px',
        color: '#D4C5A9',
        wordWrap: { width: cardW - 50 },
        align: 'center',
        lineSpacing: 3,
      }).setOrigin(0.5);

      const hitArea = this.add.rectangle(cx, cy, cardW, cardH, 0x000000, 0.01)
        .setInteractive({ useHandCursor: true });

      hitArea.on('pointerover', () => {
        bg.clear();
        bg.fillStyle(0x5C3A1E, 0.95);
        bg.fillRoundedRect(cx - cardW / 2, cy - cardH / 2, cardW, cardH, 12);
        bg.lineStyle(2, 0xC4A46C, 0.9);
        bg.strokeRoundedRect(cx - cardW / 2, cy - cardH / 2, cardW, cardH, 12);
      });
      hitArea.on('pointerout', () => {
        bg.clear();
        bg.fillStyle(0x2A1506, 0.95);
        bg.fillRoundedRect(cx - cardW / 2, cy - cardH / 2, cardW, cardH, 12);
        bg.lineStyle(1.5, 0x8B7355, 0.6);
        bg.strokeRoundedRect(cx - cardW / 2, cy - cardH / 2, cardW, cardH, 12);
      });
      hitArea.on('pointerdown', () => {
        this.makeChoice(choice);
      });
    });

    // Keyboard support: 1, 2, 3 and A, B, C
    const numKeys = [Phaser.Input.Keyboard.KeyCodes.ONE, Phaser.Input.Keyboard.KeyCodes.TWO, Phaser.Input.Keyboard.KeyCodes.THREE];
    const letterKeys = [Phaser.Input.Keyboard.KeyCodes.A, Phaser.Input.Keyboard.KeyCodes.B, Phaser.Input.Keyboard.KeyCodes.C];

    FINAL_CHOICES.forEach((choice, i) => {
      if (numKeys[i]) {
        this.input.keyboard.addKey(numKeys[i]).once('down', () => this.makeChoice(choice));
      }
      if (letterKeys[i]) {
        this.input.keyboard.addKey(letterKeys[i]).once('down', () => this.makeChoice(choice));
      }
    });

    this.add.text(w / 2, h - 22, 'Press [1], [2], [3] (or [A], [B], [C]) or click to choose.', {
      fontFamily: 'Lora, Georgia, serif',
      fontSize: '12px',
      color: '#8B7355',
      fontStyle: 'italic',
    }).setOrigin(0.5);
  }

  makeChoice(choice) {
    const cm = this.cm;
    cm.setFinalChoice(choice.id);
    cm.completeChapter('ch6');

    const trustLevel = cm.getAverageTrust() >= 60 ? 'high' : 'low';
    const epilogueText = EPILOGUES[choice.id] ? EPILOGUES[choice.id][trustLevel] : '';

    this.cameras.main.fadeOut(800, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.stop();
      if (this.gameScene) {
        this.gameScene.scene.stop();
      }
      this.scene.start('FinalScene', {
        points: cm.getPoints(),
        rank: cm.getRank(),
        ending: choice,
        epilogueText: epilogueText,
        trust: cm.getAverageTrust(),
      });
    });
  }
}