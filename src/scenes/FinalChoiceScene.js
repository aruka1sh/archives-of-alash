import Phaser from 'phaser';
import { FINAL_CHOICES } from '../data/chapters.js';

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

    this.add.text(w / 2, 30, '◆  THE FINAL DECISION  ◆', {
      fontFamily: 'Cinzel, Georgia, serif',
      fontSize: '26px',
      color: '#C4A46C',
      letterSpacing: 4,
    }).setOrigin(0.5);

    this.add.text(w / 2, 62, 'Now you know the truth. What will you do?', {
      fontFamily: 'Lora, Georgia, serif',
      fontSize: '15px',
      color: '#D4C5A9',
      fontStyle: 'italic',
    }).setOrigin(0.5);

    const startY = 110;
    const cardH = 150;
    const gap = 18;
    const cardW = 560;

    FINAL_CHOICES.forEach((choice, i) => {
      const cy = startY + i * (cardH + gap) + cardH / 2;
      const cx = w / 2;

      const bg = this.add.graphics();
      bg.fillStyle(0x2A1506, 0.92);
      bg.fillRoundedRect(cx - cardW / 2, cy - cardH / 2, cardW, cardH, 12);
      bg.lineStyle(1.5, 0x8B7355, 0.6);
      bg.strokeRoundedRect(cx - cardW / 2, cy - cardH / 2, cardW, cardH, 12);

      this.add.text(cx, cy - cardH / 2 + 22, `OPTION ${i + 1}: ${choice.title}`, {
        fontFamily: 'Cinzel, Georgia, serif',
        fontSize: '18px',
        color: '#E8D5B0',
        letterSpacing: 2,
      }).setOrigin(0.5);

      this.add.text(cx, cy - cardH / 2 + 44, choice.description, {
        fontFamily: 'Lora, Georgia, serif',
        fontSize: '13px',
        color: '#C4A46C',
        fontStyle: 'italic',
      }).setOrigin(0.5);

      this.add.text(cx, cy + 5, choice.detail, {
        fontFamily: 'Lora, Georgia, serif',
        fontSize: '14px',
        color: '#A0896C',
        wordWrap: { width: cardW - 60 },
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
        bg.fillStyle(0x2A1506, 0.92);
        bg.fillRoundedRect(cx - cardW / 2, cy - cardH / 2, cardW, cardH, 12);
        bg.lineStyle(1.5, 0x8B7355, 0.6);
        bg.strokeRoundedRect(cx - cardW / 2, cy - cardH / 2, cardW, cardH, 12);
      });
      hitArea.on('pointerdown', () => {
        this.makeChoice(choice);
      });
    });

    this.add.text(w / 2, h - 25, 'Choose carefully. This decision is final.', {
      fontFamily: 'Lora, Georgia, serif',
      fontSize: '12px',
      color: '#6B5335',
      fontStyle: 'italic',
    }).setOrigin(0.5);
  }

  makeChoice(choice) {
    const cm = this.cm;
    cm.setFinalChoice(choice.id);
    cm.completeChapter('ch5');
    cm.saveState();

    this.cameras.main.fadeOut(800, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.stop();
      this.gameScene.scene.stop();
      this.gameScene.scene.start('FinalScene', {
        points: cm.getPoints(),
        rank: cm.getRank(),
        ending: choice,
      });
    });
  }
}