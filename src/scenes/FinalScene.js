import Phaser from 'phaser';
import { HISTORY_CARDS } from '../data/chapters.js';

export default class FinalScene extends Phaser.Scene {
  constructor() {
    super({ key: 'FinalScene' });
  }

  init(data) {
    this.finalPoints = data.points || 0;
    this.finalRank = data.rank || 'CURIOUS RESEARCHER';
    this.finalEnding = data.ending || null;
    this.epilogueText = data.epilogueText || '';
    this.trust = data.trust || 50;
  }

  create() {
    this.cameras.main.fadeIn(800, 0, 0, 0);
    const w = this.cameras.main.width;
    const h = this.cameras.main.height;

    this.createBackground(w, h);
    this.createOrnamentalFrame(w, h);
    this.createAmbientParticles(w, h);

    let delay = 300;

    // Header
    const titleText = this.add.text(w / 2, 45, 'HERITAGE PRESERVED', {
      fontFamily: 'Cinzel, Georgia, serif',
      fontSize: '34px',
      color: '#C4A46C',
      stroke: '#2A1506',
      strokeThickness: 3,
      letterSpacing: 6,
    }).setOrigin(0.5).setAlpha(0);

    this.tweens.add({ targets: titleText, alpha: 1, duration: 800, delay });
    delay += 500;

    // Ending title
    if (this.finalEnding) {
      const endingTitle = this.add.text(w / 2, 88, `ENDING: ${this.finalEnding.ending}`, {
        fontFamily: 'Cinzel, Georgia, serif',
        fontSize: '22px',
        color: '#FFD700',
        stroke: '#2A1506',
        strokeThickness: 2,
        letterSpacing: 3,
      }).setOrigin(0.5).setAlpha(0);

      this.tweens.add({ targets: endingTitle, alpha: 1, duration: 800, delay });
      delay += 400;

      const endingQuote = this.add.text(w / 2, 118, `"${this.finalEnding.endingText}"`, {
        fontFamily: 'Lora, Georgia, serif',
        fontSize: '15px',
        color: '#E8D5B0',
        fontStyle: 'italic',
      }).setOrigin(0.5).setAlpha(0);

      this.tweens.add({ targets: endingQuote, alpha: 1, duration: 800, delay });
      delay += 500;
    }

    // Epilogue Box
    const epiBox = this.add.graphics().setAlpha(0);
    const epiW = 700;
    const epiH = 88;
    const epiY = 195;

    epiBox.fillStyle(0x2A1506, 0.85);
    epiBox.fillRoundedRect(w / 2 - epiW / 2, epiY - epiH / 2, epiW, epiH, 8);
    epiBox.lineStyle(1, 0x8B7355, 0.6);
    epiBox.strokeRoundedRect(w / 2 - epiW / 2, epiY - epiH / 2, epiW, epiH, 8);

    const epiText = this.add.text(w / 2, epiY, this.epilogueText, {
      fontFamily: 'Lora, Georgia, serif',
      fontSize: '13.5px',
      color: '#D4C5A9',
      align: 'center',
      wordWrap: { width: epiW - 40 },
      lineSpacing: 4,
    }).setOrigin(0.5).setAlpha(0);

    this.tweens.add({ targets: [epiBox, epiText], alpha: 1, duration: 800, delay });
    delay += 600;

    // Divider
    const div = this.add.graphics().setAlpha(0);
    div.lineStyle(1, 0xC4A46C, 0.25);
    div.lineBetween(w * 0.15, 260, w * 0.85, 260);
    this.tweens.add({ targets: div, alpha: 1, duration: 500, delay });
    delay += 300;

    // Heritage points display
    const pointsLabel = this.add.text(w / 2, 290, 'HERITAGE POINTS EARNED', {
      fontFamily: 'Cinzel, Georgia, serif',
      fontSize: '13px',
      color: '#A0896C',
      letterSpacing: 3,
    }).setOrigin(0.5).setAlpha(0);

    const pointsValue = this.add.text(w / 2, 335, `${this.finalPoints}`, {
      fontFamily: 'Cinzel, Georgia, serif',
      fontSize: '52px',
      color: '#FFE8C0',
      stroke: '#2A1506',
      strokeThickness: 3,
    }).setOrigin(0.5).setAlpha(0).setScale(0.7);

    this.tweens.add({ targets: pointsLabel, alpha: 1, duration: 500, delay });
    this.tweens.add({ targets: pointsValue, alpha: 1, scaleX: 1, scaleY: 1, duration: 600, delay: delay + 100, ease: 'Back.easeOut' });
    delay += 600;

    // Rank Badge
    const rankColor = this.getRankColor();
    const badgeW = 280;
    const badgeH = 40;
    const badgeY = 395;

    const rankBadge = this.add.graphics().setAlpha(0);
    rankBadge.fillStyle(0x1a0a00, 0.7);
    rankBadge.fillRoundedRect(w / 2 - badgeW / 2, badgeY - badgeH / 2, badgeW, badgeH, 20);
    rankBadge.lineStyle(1.5, rankColor, 0.8);
    rankBadge.strokeRoundedRect(w / 2 - badgeW / 2, badgeY - badgeH / 2, badgeW, badgeH, 20);

    const rankText = this.add.text(w / 2, badgeY, this.finalRank, {
      fontFamily: 'Cinzel, Georgia, serif',
      fontSize: '18px',
      color: rankColor,
      letterSpacing: 2,
    }).setOrigin(0.5).setAlpha(0);

    this.tweens.add({ targets: [rankBadge, rankText], alpha: 1, duration: 600, delay });
    delay += 600;

    // Action Buttons
    this.createButtons(w, h, delay);
  }

  createButtons(w, h, delay) {
    const btnW = 260;
    const btnH = 46;
    const btnY1 = 475;
    const btnY2 = 540;

    // Button 1: Historical Context
    this.createCustomButton(w / 2, btnY1, btnW, btnH, 'HISTORICAL CONTEXT', delay, () => {
      this.showHistoryModal(w, h);
    });

    // Button 2: Play Again
    this.createCustomButton(w / 2, btnY2, btnW, btnH, 'PLAY AGAIN', delay + 200, () => {
      try {
        localStorage.removeItem('archives_of_alash_save');
      } catch (e) {}
      this.cameras.main.fadeOut(600, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('MenuScene');
      });
    });
  }

  createCustomButton(x, y, btnW, btnH, label, delay, onClick) {
    const bg = this.add.graphics().setAlpha(0);
    bg.fillStyle(0x3D2B1A, 0.95);
    bg.fillRoundedRect(x - btnW / 2, y - btnH / 2, btnW, btnH, 8);
    bg.lineStyle(1.5, 0x8B7355, 0.7);
    bg.strokeRoundedRect(x - btnW / 2, y - btnH / 2, btnW, btnH, 8);

    const text = this.add.text(x, y, label, {
      fontFamily: 'Cinzel, Georgia, serif',
      fontSize: '15px',
      color: '#E8D5B0',
      letterSpacing: 2,
    }).setOrigin(0.5).setAlpha(0);

    const hitArea = this.add.rectangle(x, y, btnW, btnH, 0x000000, 0.01)
      .setInteractive({ useHandCursor: true });

    this.tweens.add({ targets: [bg, text], alpha: 1, duration: 600, delay });

    hitArea.on('pointerover', () => {
      bg.clear();
      bg.fillStyle(0x5C3A1E, 0.98);
      bg.fillRoundedRect(x - btnW / 2, y - btnH / 2, btnW, btnH, 8);
      bg.lineStyle(2, 0xC4A46C, 0.9);
      bg.strokeRoundedRect(x - btnW / 2, y - btnH / 2, btnW, btnH, 8);
      text.setColor('#FFE8C0');
    });

    hitArea.on('pointerout', () => {
      bg.clear();
      bg.fillStyle(0x3D2B1A, 0.95);
      bg.fillRoundedRect(x - btnW / 2, y - btnH / 2, btnW, btnH, 8);
      bg.lineStyle(1.5, 0x8B7355, 0.7);
      bg.strokeRoundedRect(x - btnW / 2, y - btnH / 2, btnW, btnH, 8);
      text.setColor('#E8D5B0');
    });

    hitArea.on('pointerdown', onClick);
  }

  showHistoryModal(w, h) {
    const modalContainer = this.add.container(0, 0).setDepth(150);

    const overlay = this.add.rectangle(w / 2, h / 2, w, h, 0x000000, 0.85).setInteractive();
    modalContainer.add(overlay);

    const panelW = 680;
    const panelH = 520;
    const px = w / 2;
    const py = h / 2;

    const panel = this.add.graphics();
    panel.fillStyle(0x2A1506, 0.98);
    panel.fillRoundedRect(px - panelW / 2, py - panelH / 2, panelW, panelH, 14);
    panel.lineStyle(2, 0xC4A46C, 0.8);
    panel.strokeRoundedRect(px - panelW / 2, py - panelH / 2, panelW, panelH, 14);
    modalContainer.add(panel);

    const title = this.add.text(px, py - panelH / 2 + 35, '◆  HISTORICAL CHRONICLES (1904–1937)  ◆', {
      fontFamily: 'Cinzel, Georgia, serif',
      fontSize: '18px',
      color: '#C4A46C',
      letterSpacing: 2,
    }).setOrigin(0.5);
    modalContainer.add(title);

    let cy = py - panelH / 2 + 75;
    HISTORY_CARDS.forEach((card) => {
      const cardTitle = this.add.text(px - panelW / 2 + 35, cy, card.title, {
        fontFamily: 'Cinzel, Georgia, serif',
        fontSize: '13px',
        color: '#E8D5B0',
        letterSpacing: 1,
      });
      modalContainer.add(cardTitle);

      const cardBody = this.add.text(px - panelW / 2 + 35, cy + 20, card.text, {
        fontFamily: 'Lora, Georgia, serif',
        fontSize: '12px',
        color: '#A0896C',
        wordWrap: { width: panelW - 70 },
        lineSpacing: 3,
      });
      modalContainer.add(cardBody);

      cy += 95;
    });

    const closeBtn = this.add.text(px, py + panelH / 2 - 30, '[ CLOSE ARCHIVES ]', {
      fontFamily: 'Cinzel, Georgia, serif',
      fontSize: '15px',
      color: '#C4A46C',
      letterSpacing: 2,
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    modalContainer.add(closeBtn);

    closeBtn.on('pointerover', () => closeBtn.setColor('#FFE8C0'));
    closeBtn.on('pointerout', () => closeBtn.setColor('#C4A46C'));
    closeBtn.on('pointerdown', () => modalContainer.destroy());
    overlay.on('pointerdown', () => modalContainer.destroy());
  }

  getRankColor() {
    if (this.finalRank === 'HERITAGE KEEPER') return '#FFD700';
    if (this.finalRank === 'ARCHIVE SCHOLAR') return '#C4A46C';
    return '#A0896C';
  }

  createBackground(w, h) {
    const g = this.add.graphics();
    g.fillStyle(0x120808);
    g.fillRect(0, 0, w, h);

    for (let i = 0; i < 4; i++) {
      g.fillStyle(0xC4A46C, 0.03 - i * 0.005);
      g.fillCircle(w / 2, h / 2, 140 + i * 60);
    }
  }

  createOrnamentalFrame(w, h) {
    const g = this.add.graphics();
    const m = 25;
    g.lineStyle(1, 0xC4A46C, 0.15);
    g.strokeRect(m, m, w - m * 2, h - m * 2);
    g.lineStyle(1, 0x8B7355, 0.1);
    g.strokeRect(m + 8, m + 8, w - (m + 8) * 2, h - (m + 8) * 2);
  }

  createAmbientParticles(w, h) {
    this.add.particles(0, 0, 'particle', {
      x: { min: 0, max: w },
      y: { min: 0, max: h },
      lifespan: { min: 4000, max: 8000 },
      speed: { min: 3, max: 12 },
      scale: { start: 0.6, end: 0 },
      alpha: { start: 0.15, end: 0 },
      frequency: 350,
      quantity: 1,
      tint: 0xC4A46C,
    }).setDepth(0);
  }
}