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

    this.add.rectangle(w / 2, h / 2, w, h, 0x1a0a00);

    this.selectedConcept = null;
    this.matchedPairs = [];
    this.totalPairs = PUZZLE_PAIRS.length;

    this.add.text(w / 2, 40, 'RESTORE THE ARCHIVE', {
      fontFamily: 'Cinzel, Georgia, serif',
      fontSize: '28px',
      color: '#C4A46C',
    }).setOrigin(0.5);

    this.add.text(w / 2, 72, 'Match each concept with its correct description', {
      fontFamily: 'Lora, Georgia, serif',
      fontSize: '14px',
      color: '#A0896C',
      fontStyle: 'italic',
    }).setOrigin(0.5);

    this.createCards(w, h);
    this.createBackButton(w, h);
  }

  createCards(w, h) {
    this.conceptCards = [];
    this.descCards = [];
    this.shuffledDescs = Phaser.Utils.Array.Shuffle([...PUZZLE_PAIRS]);

    const conceptStartX = w * 0.25;
    const descStartX = w * 0.75;
    const startY = 150;
    const cardW = 220;
    const cardH = 80;
    const gap = 20;

    PUZZLE_PAIRS.forEach((pair, i) => {
      const cy = startY + i * (cardH + gap);
      const conceptCard = this.createCard(conceptStartX, cy, cardW, cardH,
        pair.concept, null, 'concept', pair.id);
      this.conceptCards.push(conceptCard);
    });

    this.shuffledDescs.forEach((pair, i) => {
      const cy = startY + i * (cardH + gap);
      const descCard = this.createCard(descStartX, cy, cardW, cardH,
        pair.description, pair.detail, 'description', pair.id);
      this.descCards.push(descCard);
    });

    this.statusText = this.add.text(w / 2, h - 80, '', {
      fontFamily: 'Lora, Georgia, serif',
      fontSize: '15px',
      color: '#E8D5B0',
    }).setOrigin(0.5);
  }

  createCard(x, y, w, h, title, subtitle, type, pairId) {
    const container = this.add.container(x, y);

    const bg = this.add.graphics();
    bg.fillStyle(0x3D2B1A, 0.9);
    bg.fillRoundedRect(-w / 2, -h / 2, w, h, 10);
    bg.lineStyle(2, 0x8B7355, 0.7);
    bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 10);
    container.add(bg);

    const titleText = this.add.text(0, subtitle ? -14 : 0, title, {
      fontFamily: 'Cinzel, Georgia, serif',
      fontSize: '16px',
      color: '#E8D5B0',
      align: 'center',
    }).setOrigin(0.5);
    container.add(titleText);

    let subtitleText = null;
    if (subtitle) {
      subtitleText = this.add.text(0, 14, subtitle, {
        fontFamily: 'Lora, Georgia, serif',
        fontSize: '11px',
        color: '#A0896C',
        align: 'center',
      }).setOrigin(0.5);
      container.add(subtitleText);
    }

    const hitArea = this.add.rectangle(0, 0, w, h, 0x000000, 0)
      .setInteractive({ useHandCursor: true });
    container.add(hitArea);

    container.setData('type', type);
    container.setData('pairId', pairId);
    container.setData('bg', bg);
    container.setData('titleText', titleText);
    container.setData('subtitleText', subtitleText);
    container.setData('width', w);
    container.setData('height', h);
    container.setData('matched', false);

    hitArea.on('pointerover', () => {
      if (container.getData('matched')) return;
      bg.clear();
      bg.fillStyle(0x5C3A1E, 0.95);
      bg.fillRoundedRect(-w / 2, -h / 2, w, h, 10);
      bg.lineStyle(2, 0xC4A46C, 0.9);
      bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 10);
    });

    hitArea.on('pointerout', () => {
      if (container.getData('matched')) return;
      if (container === this.selectedConcept || container === this.selectedDesc) return;
      bg.clear();
      bg.fillStyle(0x3D2B1A, 0.9);
      bg.fillRoundedRect(-w / 2, -h / 2, w, h, 10);
      bg.lineStyle(2, 0x8B7355, 0.7);
      bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 10);
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
    if (this.selectedConcept) {
      const prevBg = this.selectedConcept.getData('bg');
      const w = this.selectedConcept.getData('width');
      const h = this.selectedConcept.getData('height');
      prevBg.clear();
      prevBg.fillStyle(0x3D2B1A, 0.9);
      prevBg.fillRoundedRect(-w / 2, -h / 2, w, h, 10);
      prevBg.lineStyle(2, 0x8B7355, 0.7);
      prevBg.strokeRoundedRect(-w / 2, -h / 2, w, h, 10);
    }

    this.selectedConcept = card;
    const bg = card.getData('bg');
    const w = card.getData('width');
    const h = card.getData('height');
    bg.clear();
    bg.fillStyle(0x5C3A1E, 0.95);
    bg.fillRoundedRect(-w / 2, -h / 2, w, h, 10);
    bg.lineStyle(2, 0xC4A46C, 1);
    bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 10);
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
      bg.fillStyle(0x2A4A1A, 0.9);
      bg.fillRoundedRect(-w / 2, -h / 2, w, h, 10);
      bg.lineStyle(2, 0x4A8238, 0.9);
      bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 10);
      card.disableInteractive();
    });

    this.matchedPairs.push(conceptId);
    this.selectedConcept = null;

    if (conceptCard.getData('subtitleText')) {
      conceptCard.getData('titleText').setColor('#C4E8A0');
    }
    if (descCard.getData('titleText')) {
      descCard.getData('titleText').setColor('#C4E8A0');
    }

    this.statusText.setText(`Matched: ${this.matchedPairs.length}/${this.totalPairs}`);

    this.tweens.add({
      targets: [conceptCard, descCard],
      scaleX: 1.05,
      scaleY: 1.05,
      duration: 150,
      yoyo: true,
      ease: 'Quad.easeOut',
    });

    if (this.matchedPairs.length >= this.totalPairs) {
      this.time.delayedCall(600, () => {
        this.showPuzzleComplete();
      });
    }
  }

  onWrongMatch(conceptCard, descCard) {
    this.statusText.setText('Not quite right. Try again.');
    this.statusText.setColor('#C4743A');

    this.selectedConcept = null;
    const cb = conceptCard.getData('bg');
    const db = descCard.getData('bg');
    const cw = conceptCard.getData('width');
    const ch = conceptCard.getData('height');
    const dw = descCard.getData('width');
    const dh = descCard.getData('height');

    cb.clear();
    cb.fillStyle(0x4A1A1A, 0.9);
    cb.fillRoundedRect(-cw / 2, -ch / 2, cw, ch, 10);
    cb.lineStyle(2, 0x8B3A3A, 0.9);
    cb.strokeRoundedRect(-cw / 2, -ch / 2, cw, ch, 10);

    db.clear();
    db.fillStyle(0x4A1A1A, 0.9);
    db.fillRoundedRect(-dw / 2, -dh / 2, dw, dh, 10);
    db.lineStyle(2, 0x8B3A3A, 0.9);
    db.strokeRoundedRect(-dw / 2, -dh / 2, dw, dh, 10);

    this.time.delayedCall(500, () => {
      cb.clear();
      cb.fillStyle(0x3D2B1A, 0.9);
      cb.fillRoundedRect(-cw / 2, -ch / 2, cw, ch, 10);
      cb.lineStyle(2, 0x8B7355, 0.7);
      cb.strokeRoundedRect(-cw / 2, -ch / 2, cw, ch, 10);

      db.clear();
      db.fillStyle(0x3D2B1A, 0.9);
      db.fillRoundedRect(-dw / 2, -dh / 2, dw, dh, 10);
      db.lineStyle(2, 0x8B7355, 0.7);
      db.strokeRoundedRect(-dw / 2, -dh / 2, dw, dh, 10);

      this.statusText.setText('');
      this.statusText.setColor('#E8D5B0');
    });
  }

  showPuzzleComplete() {
    const w = this.cameras.main.width;
    const h = this.cameras.main.height;

    const overlay = this.add.rectangle(w / 2, h / 2, w, h, 0x000000, 0.6)
      .setInteractive().setDepth(10);

    const panelW = 420;
    const panelH = 200;
    const px = w / 2;
    const py = h / 2;

    const panel = this.add.graphics().setDepth(11);
    panel.fillStyle(0x2A1506, 0.97);
    panel.fillRoundedRect(px - panelW / 2, py - panelH / 2, panelW, panelH, 12);
    panel.lineStyle(2, 0xC4A46C, 0.9);
    panel.strokeRoundedRect(px - panelW / 2, py - panelH / 2, panelW, panelH, 12);

    const title = this.add.text(px, py - 45, '✦ ARCHIVE RESTORED ✦', {
      fontFamily: 'Cinzel, Georgia, serif',
      fontSize: '24px',
      color: '#C4A46C',
    }).setOrigin(0.5).setDepth(12);

    const msg = this.add.text(px, py, 'The catalog is correctly organized.\nAll fragments are in their proper place.', {
      fontFamily: 'Lora, Georgia, serif',
      fontSize: '15px',
      color: '#D4C5A9',
      align: 'center',
    }).setOrigin(0.5).setDepth(12);

    const pointsText = this.add.text(px, py + 50, '+20 Heritage Points', {
      fontFamily: 'Cinzel, Georgia, serif',
      fontSize: '18px',
      color: '#FFE8C0',
    }).setOrigin(0.5).setDepth(12);

    const continueText = this.add.text(px, py + panelH / 2 - 25, '[ CLICK TO CONTINUE ]', {
      fontFamily: 'Cinzel, Georgia, serif',
      fontSize: '13px',
      color: '#A0896C',
    }).setOrigin(0.5).setDepth(12);

    this.tweens.add({
      targets: continueText,
      alpha: { from: 0.5, to: 1 },
      duration: 500,
      yoyo: true,
      repeat: -1,
    });

    overlay.on('pointerdown', () => {
      this.cameras.main.fadeOut(400, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.stop();
        if (this.gameScene) {
          this.gameScene.scene.resume();
          this.gameScene.questManager.completeQuest('quest3');
          this.gameScene.updateQuestPanel();
          this.gameScene.updatePointsDisplay();
          this.gameScene.startDialogue('archivist', 'puzzleDone', () => {
            this.gameScene.updateQuestPanel();
          });
        }
      });
    });
  }

  createBackButton(w, h) {
    const backText = this.add.text(w - 20, 20, '✕', {
      fontFamily: 'Cinzel, Georgia, serif',
      fontSize: '20px',
      color: '#8B7355',
    }).setOrigin(1, 0).setInteractive({ useHandCursor: true });

    backText.on('pointerover', () => backText.setColor('#FFE8C0'));
    backText.on('pointerout', () => backText.setColor('#8B7355'));
    backText.on('pointerdown', () => {
      this.cameras.main.fadeOut(300, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.stop();
        if (this.gameScene) {
          this.gameScene.scene.resume();
        }
      });
    });
  }
}