import Phaser from 'phaser';
import { PUZZLE_PAIRS } from '../data/puzzleData.js';

export default class PuzzleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PuzzleScene' });
  }

  init(data) {
    this.gameScene = data.gameScene;
  }

  create() {
    this.cameras.main.fadeIn(400, 0, 0, 0);
    const w = this.cameras.main.width;
    const h = this.cameras.main.height;

    this.createDeskBackground(w, h);

    this.selectedConcept = null;
    this.matchedPairs = [];
    this.totalPairs = PUZZLE_PAIRS.length;

    // Title
    this.add.text(w / 2, 34, '◆  RESTORE THE ARCHIVE  ◆', {
      fontFamily: 'Cinzel, Georgia, serif',
      fontSize: '26px',
      color: '#C4A46C',
      letterSpacing: 3,
    }).setOrigin(0.5);

    // Subtitle
    this.add.text(w / 2, 64, 'Match each concept with its correct description', {
      fontFamily: 'Lora, Georgia, serif',
      fontSize: '13px',
      color: '#A0896C',
      fontStyle: 'italic',
    }).setOrigin(0.5);

    // Ornamental divider
    const div = this.add.graphics();
    div.lineStyle(1, 0xC4A46C, 0.2);
    div.lineBetween(w / 2 - 100, 78, w / 2 + 100, 78);
    div.fillStyle(0xC4A46C, 0.3);
    div.fillCircle(w / 2, 78, 2);

    // Column headers
    this.add.text(w * 0.25, 100, 'CONCEPTS', {
      fontFamily: 'Cinzel, Georgia, serif',
      fontSize: '13px',
      color: '#8B7355',
      letterSpacing: 3,
    }).setOrigin(0.5);

    this.add.text(w * 0.75, 100, 'DESCRIPTIONS', {
      fontFamily: 'Cinzel, Georgia, serif',
      fontSize: '13px',
      color: '#8B7355',
      letterSpacing: 3,
    }).setOrigin(0.5);

    this.createCards(w, h);
    this.createBackButton(w, h);
  }

  createDeskBackground(w, h) {
    const g = this.add.graphics();

    // Dark desk surface
    g.fillStyle(0x1a0a00);
    g.fillRect(0, 0, w, h);

    // Wood grain texture
    for (let i = 0; i < 60; i++) {
      const y = Phaser.Math.Between(0, h);
      g.fillStyle(0x2A1506, Phaser.Math.FloatBetween(0.03, 0.08));
      g.fillRect(0, y, w, Phaser.Math.Between(1, 3));
    }

    // Warm central glow
    g.fillStyle(0xC4A46C, 0.04);
    g.fillCircle(w / 2, h / 2, 220);

    // Subtle border frame
    g.lineStyle(1, 0xC4A46C, 0.15);
    g.strokeRect(20, 20, w - 40, h - 40);
    g.lineStyle(1, 0x8B7355, 0.1);
    g.strokeRect(26, 26, w - 52, h - 52);

    // Corner accents
    const corners = [[20, 20], [w - 20, 20], [20, h - 20], [w - 20, h - 20]];
    corners.forEach(([cx, cy]) => {
      g.fillStyle(0xC4A46C, 0.15);
      g.fillRect(cx - 3, cy - 3, 6, 6);
    });
  }

  createCards(w, h) {
    this.conceptCards = [];
    this.descCards = [];
    this.shuffledDescs = Phaser.Utils.Array.Shuffle([...PUZZLE_PAIRS]);

    const conceptStartX = w * 0.25;
    const descStartX = w * 0.75;
    const startY = 140;
    const cardW = 230;
    const cardH = 90;
    const gap = 22;

    PUZZLE_PAIRS.forEach((pair, i) => {
      const cy = startY + i * (cardH + gap);
      const conceptCard = this.createParchmentCard(
        conceptStartX, cy, cardW, cardH,
        pair.concept, null, 'concept', pair.id
      );
      this.conceptCards.push(conceptCard);
    });

    this.shuffledDescs.forEach((pair, i) => {
      const cy = startY + i * (cardH + gap);
      const descCard = this.createParchmentCard(
        descStartX, cy, cardW, cardH,
        pair.description, pair.detail, 'description', pair.id
      );
      this.descCards.push(descCard);
    });

    // Status text
    this.statusText = this.add.text(w / 2, h - 70, '', {
      fontFamily: 'Lora, Georgia, serif',
      fontSize: '14px',
      color: '#E8D5B0',
    }).setOrigin(0.5);

    // Instruction
    this.add.text(w / 2, h - 40, 'Click a concept, then click its matching description', {
      fontFamily: 'Lora, Georgia, serif',
      fontSize: '12px',
      color: '#6B5335',
      fontStyle: 'italic',
    }).setOrigin(0.5);
  }

  createParchmentCard(x, y, w, h, title, subtitle, type, pairId) {
    const container = this.add.container(x, y);

    // Card shadow
    const shadow = this.add.graphics();
    shadow.fillStyle(0x000000, 0.25);
    shadow.fillRoundedRect(-w / 2 + 3, -h / 2 + 3, w, h, 10);
    container.add(shadow);

    // Main card (parchment look)
    const bg = this.add.graphics();
    bg.fillStyle(0x3D2B1A, 0.92);
    bg.fillRoundedRect(-w / 2, -h / 2, w, h, 10);

    // Subtle texture dots
    bg.fillStyle(0xD4C5A9, 0.03);
    for (let i = 0; i < 12; i++) {
      bg.fillCircle(
        Phaser.Math.Between(-w / 2 + 10, w / 2 - 10),
        Phaser.Math.Between(-h / 2 + 10, h / 2 - 10),
        Phaser.Math.FloatBetween(1, 3)
      );
    }

    // Gold border
    bg.lineStyle(2, 0x8B7355, 0.7);
    bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 10);

    // Inner lighter border
    bg.lineStyle(1, 0xC4A46C, 0.2);
    bg.strokeRoundedRect(-w / 2 + 4, -h / 2 + 4, w - 8, h - 8, 8);
    container.add(bg);

    // Title text
    const titleText = this.add.text(0, subtitle ? -14 : 0, title, {
      fontFamily: 'Cinzel, Georgia, serif',
      fontSize: '16px',
      color: '#E8D5B0',
      align: 'center',
      letterSpacing: 1,
      wordWrap: { width: w - 30 },
    }).setOrigin(0.5);
    container.add(titleText);

    // Subtitle (detail)
    let subtitleText = null;
    if (subtitle) {
      subtitleText = this.add.text(0, 16, subtitle, {
        fontFamily: 'Lora, Georgia, serif',
        fontSize: '10px',
        color: '#A0896C',
        align: 'center',
        wordWrap: { width: w - 24 },
        lineSpacing: 2,
      }).setOrigin(0.5);
      container.add(subtitleText);
    }

    // Hit area
    const hitArea = this.add.rectangle(0, 0, w, h, 0x000000, 0.01)
      .setInteractive({ useHandCursor: true });
    container.add(hitArea);

    // Store data
    container.setData('type', type);
    container.setData('pairId', pairId);
    container.setData('bg', bg);
    container.setData('shadow', shadow);
    container.setData('titleText', titleText);
    container.setData('subtitleText', subtitleText);
    container.setData('width', w);
    container.setData('height', h);
    container.setData('matched', false);

    // Hover effects
    hitArea.on('pointerover', () => {
      if (container.getData('matched')) return;
      shadow.clear();
      shadow.fillStyle(0x000000, 0.35);
      shadow.fillRoundedRect(-w / 2 + 4, -h / 2 + 4, w, h, 10);
      bg.clear();
      bg.fillStyle(0x5C3A1E, 0.95);
      bg.fillRoundedRect(-w / 2, -h / 2, w, h, 10);
      bg.fillStyle(0xD4C5A9, 0.04);
      for (let i = 0; i < 12; i++) {
        bg.fillCircle(
          Phaser.Math.Between(-w / 2 + 10, w / 2 - 10),
          Phaser.Math.Between(-h / 2 + 10, h / 2 - 10),
          Phaser.Math.FloatBetween(1, 3)
        );
      }
      bg.lineStyle(2, 0xC4A46C, 0.9);
      bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 10);
      bg.lineStyle(1, 0xE8D5B0, 0.3);
      bg.strokeRoundedRect(-w / 2 + 4, -h / 2 + 4, w - 8, h - 8, 8);
    });

    hitArea.on('pointerout', () => {
      if (container.getData('matched')) return;
      if (container === this.selectedConcept) return;
      shadow.clear();
      shadow.fillStyle(0x000000, 0.25);
      shadow.fillRoundedRect(-w / 2 + 3, -h / 2 + 3, w, h, 10);
      bg.clear();
      bg.fillStyle(0x3D2B1A, 0.92);
      bg.fillRoundedRect(-w / 2, -h / 2, w, h, 10);
      bg.fillStyle(0xD4C5A9, 0.03);
      for (let i = 0; i < 12; i++) {
        bg.fillCircle(
          Phaser.Math.Between(-w / 2 + 10, w / 2 - 10),
          Phaser.Math.Between(-h / 2 + 10, h / 2 - 10),
          Phaser.Math.FloatBetween(1, 3)
        );
      }
      bg.lineStyle(2, 0x8B7355, 0.7);
      bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 10);
      bg.lineStyle(1, 0xC4A46C, 0.2);
      bg.strokeRoundedRect(-w / 2 + 4, -h / 2 + 4, w - 8, h - 8, 8);
    });

    hitArea.on('pointerdown', () => {
      if (container.getData('matched')) return;
      this.onCardClick(container);
    });

    return container;
  }

  onCardClick(card) {
    const type = card.getData('type');

    if (type === 'concept') {
      this.selectConcept(card);
    } else if (type === 'description') {
      if (this.selectedConcept) {
        this.checkMatch(this.selectedConcept, card);
      }
    }
  }

  selectConcept(card) {
    // Deselect previous
    if (this.selectedConcept && this.selectedConcept !== card) {
      const prevBg = this.selectedConcept.getData('bg');
      const w = this.selectedConcept.getData('width');
      const h = this.selectedConcept.getData('height');
      prevBg.clear();
      prevBg.fillStyle(0x3D2B1A, 0.92);
      prevBg.fillRoundedRect(-w / 2, -h / 2, w, h, 10);
      prevBg.lineStyle(2, 0x8B7355, 0.7);
      prevBg.strokeRoundedRect(-w / 2, -h / 2, w, h, 10);
      prevBg.lineStyle(1, 0xC4A46C, 0.2);
      prevBg.strokeRoundedRect(-w / 2 + 4, -h / 2 + 4, w - 8, h - 8, 8);
    }

    this.selectedConcept = card;

    // Highlight selected
    const bg = card.getData('bg');
    const w = card.getData('width');
    const h = card.getData('height');
    bg.clear();
    bg.fillStyle(0x5C3A1E, 0.95);
    bg.fillRoundedRect(-w / 2, -h / 2, w, h, 10);
    bg.lineStyle(2, 0xC4A46C, 1);
    bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 10);
    bg.lineStyle(1, 0xFFE8C0, 0.4);
    bg.strokeRoundedRect(-w / 2 + 4, -h / 2 + 4, w - 8, h - 8, 8);
  }

  checkMatch(conceptCard, descCard) {
    const conceptId = conceptCard.getData('pairId');
    const descId = descCard.getData('pairId');

    if (conceptId === descId) {
      this.onCorrectMatch(conceptCard, descCard);
    } else {
      this.onWrongMatch(conceptCard, descCard);
    }
  }

  onCorrectMatch(conceptCard, descCard) {
    conceptCard.setData('matched', true);
    descCard.setData('matched', true);

    [conceptCard, descCard].forEach(card => {
      const bg = card.getData('bg');
      const w = card.getData('width');
      const h = card.getData('height');
      bg.clear();
      bg.fillStyle(0x2A3A1A, 0.92);
      bg.fillRoundedRect(-w / 2, -h / 2, w, h, 10);
      bg.lineStyle(2, 0x5A9840, 0.8);
      bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 10);
      bg.lineStyle(1, 0x6BAA4A, 0.3);
      bg.strokeRoundedRect(-w / 2 + 4, -h / 2 + 4, w - 8, h - 8, 8);
      card.disableInteractive();

      if (card.getData('titleText')) {
        card.getData('titleText').setColor('#C4E8A0');
      }
    });

    this.matchedPairs.push(conceptId);
    this.selectedConcept = null;
    this.statusText.setText(`◆  Matched: ${this.matchedPairs.length}/${this.totalPairs}`);

    // Success pulse
    this.tweens.add({
      targets: [conceptCard, descCard],
      scaleX: 1.06,
      scaleY: 1.06,
      duration: 150,
      yoyo: true,
      ease: 'Quad.easeOut',
    });

    if (this.matchedPairs.length >= this.totalPairs) {
      this.time.delayedCall(700, () => {
        this.showPuzzleComplete();
      });
    }
  }

  onWrongMatch(conceptCard, descCard) {
    this.statusText.setText('Not quite right — try again.');
    this.statusText.setColor('#C4743A');

    this.selectedConcept = null;

    const cb = conceptCard.getData('bg');
    const db = descCard.getData('bg');
    const cw = conceptCard.getData('width');
    const ch = conceptCard.getData('height');
    const dw = descCard.getData('width');
    const dh = descCard.getData('height');

    // Flash red
    const drawRed = (g, w, h) => {
      g.clear();
      g.fillStyle(0x4A1A1A, 0.92);
      g.fillRoundedRect(-w / 2, -h / 2, w, h, 10);
      g.lineStyle(2, 0x8B3A3A, 0.8);
      g.strokeRoundedRect(-w / 2, -h / 2, w, h, 10);
    };

    drawRed(cb, cw, ch);
    drawRed(db, dw, dh);

    // Shake effect
    this.tweens.add({
      targets: [conceptCard, descCard],
      x: { from: conceptCard.x - 3, to: conceptCard.x + 3 },
      duration: 40,
      yoyo: true,
      repeat: 3,
    });

    // Reset after delay
    this.time.delayedCall(600, () => {
      [conceptCard, descCard].forEach(card => {
        const bg = card.getData('bg');
        const w = card.getData('width');
        const h = card.getData('height');
        bg.clear();
        bg.fillStyle(0x3D2B1A, 0.92);
        bg.fillRoundedRect(-w / 2, -h / 2, w, h, 10);
        bg.lineStyle(2, 0x8B7355, 0.7);
        bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 10);
        bg.lineStyle(1, 0xC4A46C, 0.2);
        bg.strokeRoundedRect(-w / 2 + 4, -h / 2 + 4, w - 8, h - 8, 8);
      });
      this.statusText.setText('');
      this.statusText.setColor('#E8D5B0');
    });
  }

  showPuzzleComplete() {
    const w = this.cameras.main.width;
    const h = this.cameras.main.height;

    const overlay = this.add.rectangle(w / 2, h / 2, w, h, 0x000000, 0.65)
      .setInteractive().setDepth(10);

    const panelW = 440;
    const panelH = 220;
    const px = w / 2;
    const py = h / 2;

    // Shadow
    const shadow = this.add.graphics().setDepth(11);
    shadow.fillStyle(0x000000, 0.3);
    shadow.fillRoundedRect(px - panelW / 2 + 3, py - panelH / 2 + 3, panelW, panelH, 14);

    const panel = this.add.graphics().setDepth(11);
    panel.fillStyle(0x2A1506, 0.97);
    panel.fillRoundedRect(px - panelW / 2, py - panelH / 2, panelW, panelH, 14);
    panel.lineStyle(2, 0xC4A46C, 0.8);
    panel.strokeRoundedRect(px - panelW / 2, py - panelH / 2, panelW, panelH, 14);

    // Inner border
    panel.lineStyle(1, 0x8B7355, 0.3);
    panel.strokeRoundedRect(px - panelW / 2 + 8, py - panelH / 2 + 8, panelW - 16, panelH - 16, 10);

    // Icon
    const icon = this.add.text(px, py - 50, '◆', {
      fontFamily: 'serif',
      fontSize: '28px',
      color: '#C4A46C',
    }).setOrigin(0.5).setDepth(12).setScale(0);

    this.tweens.add({
      targets: icon,
      scaleX: 1,
      scaleY: 1,
      duration: 500,
      ease: 'Back.easeOut',
    });

    const title = this.add.text(px, py - 20, 'ARCHIVE RESTORED', {
      fontFamily: 'Cinzel, Georgia, serif',
      fontSize: '24px',
      color: '#C4A46C',
      letterSpacing: 3,
    }).setOrigin(0.5).setDepth(12).setAlpha(0);

    this.tweens.add({
      targets: title,
      alpha: 1,
      duration: 400,
      delay: 200,
    });

    const msg = this.add.text(px, py + 15, 'The catalog is correctly organized.\nAll fragments are in their proper place.', {
      fontFamily: 'Lora, Georgia, serif',
      fontSize: '14px',
      color: '#D4C5A9',
      align: 'center',
      lineSpacing: 4,
    }).setOrigin(0.5).setDepth(12).setAlpha(0);

    this.tweens.add({
      targets: msg,
      alpha: 1,
      duration: 400,
      delay: 500,
    });

    const pointsText = this.add.text(px, py + 60, '+20 Heritage Points', {
      fontFamily: 'Cinzel, Georgia, serif',
      fontSize: '18px',
      color: '#FFE8C0',
      letterSpacing: 2,
    }).setOrigin(0.5).setDepth(12).setAlpha(0);

    this.tweens.add({
      targets: pointsText,
      alpha: 1,
      scaleX: { from: 0.5, to: 1 },
      scaleY: { from: 0.5, to: 1 },
      duration: 500,
      delay: 800,
      ease: 'Back.easeOut',
    });

    const continueText = this.add.text(px, py + panelH / 2 - 30, 'CLICK TO CONTINUE', {
      fontFamily: 'Cinzel, Georgia, serif',
      fontSize: '12px',
      color: '#A0896C',
      letterSpacing: 2,
    }).setOrigin(0.5).setDepth(12);

    this.tweens.add({
      targets: continueText,
      alpha: { from: 0.4, to: 0.9 },
      duration: 600,
      yoyo: true,
      repeat: -1,
    });

    overlay.on('pointerdown', () => {
      this.cameras.main.fadeOut(400, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.stop();
        if (this.gameScene) {
          if (this.gameScene.chapterManager) {
            this.gameScene.chapterManager.solvePuzzle();
          }
          this.gameScene.scene.resume();
          this.gameScene.updateAllUI();
          this.gameScene.updatePointsDisplay();
          this.gameScene.startDialogue('archivist', 'puzzleDone', () => {
            this.gameScene.updateAllUI();
          });
        }
      });
    });
  }

  createBackButton(w, h) {
    const backBtn = this.add.text(w - 24, 18, '✕', {
      fontFamily: 'serif',
      fontSize: '18px',
      color: '#8B7355',
    }).setOrigin(1, 0).setInteractive({ useHandCursor: true });

    backBtn.on('pointerover', () => backBtn.setColor('#FFE8C0'));
    backBtn.on('pointerout', () => backBtn.setColor('#8B7355'));
    const exitPuzzle = () => {
      this.cameras.main.fadeOut(300, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.stop();
        if (this.gameScene) {
          this.gameScene.scene.resume();
        }
      });
    };

    backBtn.on('pointerdown', exitPuzzle);
    this.input.keyboard.on('keydown-ESC', exitPuzzle);
  }
}