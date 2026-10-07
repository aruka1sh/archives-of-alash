import Phaser from 'phaser';

export default class EvidenceBoardScene extends Phaser.Scene {
  constructor() {
    super({ key: 'EvidenceBoardScene' });
  }

  init(data) {
    this.gameScene = data.gameScene;
    this.cm = data.gameScene.chapterManager;
    this.selectedForDeduction = [];
    this.cardVisuals = new Map();
  }

  create() {
    const w = this.cameras.main.width;
    const h = this.cameras.main.height;

    this.add.rectangle(w / 2, h / 2, w, h, 0x120808, 0.97);

    // Title
    this.add.text(w / 2, 28, '◆  CASE FILE  ◆', {
      fontFamily: 'Cinzel, Georgia, serif',
      fontSize: '24px',
      color: '#C4A46C',
      letterSpacing: 4,
    }).setOrigin(0.5);

    this.add.text(w / 2, 54, 'THE MISSING MANUSCRIPT & THE 12 SCRIBES', {
      fontFamily: 'Cinzel, Georgia, serif',
      fontSize: '15px',
      color: '#E8D5B0',
      letterSpacing: 2,
    }).setOrigin(0.5);

    // Divider
    const div = this.add.graphics();
    div.lineStyle(1, 0xC4A46C, 0.25);
    div.lineBetween(w * 0.12, 68, w * 0.88, 68);

    // Evidence cards
    this.renderEvidenceCards(w, h);

    // Deduction section
    this.renderDeductions(w, h);

    // Status text
    this.deductionStatusText = this.add.text(w / 2, h - 75, '', {
      fontFamily: 'Lora, Georgia, serif',
      fontSize: '13px',
      color: '#E8D5B0',
    }).setOrigin(0.5);

    // Connect button
    this.createConnectButton(w, h);

    // Close instruction
    this.add.text(w / 2, h - 20, 'Press TAB or ESC to close | [ENTER] to connect selected clues', {
      fontFamily: 'Lora, Georgia, serif',
      fontSize: '11px',
      color: '#6B5335',
      fontStyle: 'italic',
    }).setOrigin(0.5);

    // Keyboard bindings
    this.input.keyboard.on('keydown-TAB', () => this.closeBoard());
    this.input.keyboard.on('keydown-ESC', () => this.closeBoard());
    this.input.keyboard.on('keydown-ENTER', () => this.performDeduction());
    this.input.keyboard.on('keydown-C', () => this.performDeduction());
  }

  renderEvidenceCards(w, h) {
    const evidence = this.cm.getEvidence();
    const found = evidence.filter(e => e.found);
    const cols = 4;
    const cardW = 210;
    const cardH = 88;
    const startX = 45;
    const startY = 85;
    const gapX = 12;
    const gapY = 12;

    if (found.length === 0) {
      this.add.text(w / 2, startY + 60, 'No evidence discovered yet.\nExplore the village and question the people.', {
        fontFamily: 'Lora, Georgia, serif',
        fontSize: '14px',
        color: '#A0896C',
        align: 'center',
        fontStyle: 'italic',
      }).setOrigin(0.5);
      return;
    }

    this.add.text(45, startY - 8, `EVIDENCE FOUND (${found.length})`, {
      fontFamily: 'Cinzel, Georgia, serif',
      fontSize: '11px',
      color: '#8B7355',
      letterSpacing: 2,
    });

    found.forEach((e, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const cx = startX + col * (cardW + gapX) + cardW / 2;
      const cy = startY + row * (cardH + gapY) + cardH / 2;

      const bg = this.add.graphics();
      this.drawCardBg(bg, cx, cy, cardW, cardH, false, false);

      const icon = this.add.text(cx - cardW / 2 + 12, cy - cardH / 2 + 10, e.icon || '◆', {
        fontFamily: 'serif',
        fontSize: '13px',
        color: '#C4A46C',
      });

      const name = this.add.text(cx - cardW / 2 + 28, cy - cardH / 2 + 10, e.name, {
        fontFamily: 'Cinzel, Georgia, serif',
        fontSize: '10px',
        color: '#E8D5B0',
        letterSpacing: 1,
        wordWrap: { width: cardW - 42 },
      });

      const desc = this.add.text(cx - cardW / 2 + 10, cy - cardH / 2 + 30, e.description, {
        fontFamily: 'Lora, Georgia, serif',
        fontSize: '9.5px',
        color: '#A0896C',
        wordWrap: { width: cardW - 20 },
        lineSpacing: 2,
      });

      const hitArea = this.add.rectangle(cx, cy, cardW, cardH, 0x000000, 0.01)
        .setInteractive({ useHandCursor: true });

      const cardData = { e, cx, cy, cardW, cardH, bg, hitArea };
      this.cardVisuals.set(e.id, cardData);

      hitArea.on('pointerdown', () => {
        this.toggleEvidenceSelection(e.id);
      });

      hitArea.on('pointerover', () => {
        const isSelected = this.selectedForDeduction.includes(e.id);
        this.drawCardBg(bg, cx, cy, cardW, cardH, isSelected, true);
      });

      hitArea.on('pointerout', () => {
        const isSelected = this.selectedForDeduction.includes(e.id);
        this.drawCardBg(bg, cx, cy, cardW, cardH, isSelected, false);
      });
    });
  }

  drawCardBg(graphics, cx, cy, w, h, isSelected, isHover) {
    graphics.clear();
    let fillColor = 0x2A1506;
    let strokeColor = 0x8B7355;
    let strokeWidth = 1.5;

    if (isSelected) {
      fillColor = isHover ? 0x6A4E2A : 0x543E1F;
      strokeColor = 0xC4A46C;
      strokeWidth = 2.5;
    } else if (isHover) {
      fillColor = 0x3D2B1A;
      strokeColor = 0xC4A46C;
    }

    graphics.fillStyle(fillColor, 0.95);
    graphics.fillRoundedRect(cx - w / 2, cy - h / 2, w, h, 8);
    graphics.lineStyle(strokeWidth, strokeColor, 0.9);
    graphics.strokeRoundedRect(cx - w / 2, cy - h / 2, w, h, 8);
  }

  toggleEvidenceSelection(evidenceId) {
    const idx = this.selectedForDeduction.indexOf(evidenceId);
    if (idx >= 0) {
      this.selectedForDeduction.splice(idx, 1);
    } else {
      if (this.selectedForDeduction.length >= 2) {
        this.selectedForDeduction.shift();
      }
      this.selectedForDeduction.push(evidenceId);
    }

    this.cardVisuals.forEach((card, id) => {
      const isSelected = this.selectedForDeduction.includes(id);
      this.drawCardBg(card.bg, card.cx, card.cy, card.cardW, card.cardH, isSelected, false);
    });

    if (this.selectedForDeduction.length === 2) {
      this.deductionStatusText.setText('Ready to connect! Click [CONNECT CLUES] below.');
      this.deductionStatusText.setColor('#FFE8C0');
    } else if (this.selectedForDeduction.length === 1) {
      this.deductionStatusText.setText('Select a second clue to link.');
      this.deductionStatusText.setColor('#A0896C');
    } else {
      this.deductionStatusText.setText('');
    }
  }

  renderDeductions(w, h) {
    if (this.deductionsContainer) {
      this.deductionsContainer.destroy();
    }

    this.deductionsContainer = this.add.container(0, 0);
    const deductions = this.cm.getDeductions();
    if (deductions.length === 0) return;

    const startY = 320;
    const title = this.add.text(45, startY, `DEDUCTIONS & REVELATIONS (${deductions.length})`, {
      fontFamily: 'Cinzel, Georgia, serif',
      fontSize: '11px',
      color: '#8B7355',
      letterSpacing: 2,
    });
    this.deductionsContainer.add(title);

    deductions.forEach((d, i) => {
      const dy = startY + 22 + i * 22;
      const text = this.add.text(48, dy, `◆ ${d.result}`, {
        fontFamily: 'Lora, Georgia, serif',
        fontSize: '12px',
        color: '#E8D5B0',
        fontStyle: 'italic',
      });
      this.deductionsContainer.add(text);
    });
  }

  createConnectButton(w, h) {
    const btnW = 220;
    const btnH = 38;
    const btnX = w / 2;
    const btnY = h - 48;

    const bg = this.add.graphics();
    bg.fillStyle(0x3D2B1A, 0.95);
    bg.fillRoundedRect(btnX - btnW / 2, btnY - btnH / 2, btnW, btnH, 8);
    bg.lineStyle(1.5, 0xC4A46C, 0.8);
    bg.strokeRoundedRect(btnX - btnW / 2, btnY - btnH / 2, btnW, btnH, 8);

    const label = this.add.text(btnX, btnY, 'CONNECT CLUES', {
      fontFamily: 'Cinzel, Georgia, serif',
      fontSize: '13px',
      color: '#E8D5B0',
      letterSpacing: 2,
    }).setOrigin(0.5);

    const hitArea = this.add.rectangle(btnX, btnY, btnW, btnH, 0x000000, 0.01)
      .setInteractive({ useHandCursor: true });

    hitArea.on('pointerover', () => {
      bg.clear();
      bg.fillStyle(0x5C3A1E, 0.95);
      bg.fillRoundedRect(btnX - btnW / 2, btnY - btnH / 2, btnW, btnH, 8);
      bg.lineStyle(2, 0xC4A46C, 1);
      bg.strokeRoundedRect(btnX - btnW / 2, btnY - btnH / 2, btnW, btnH, 8);
      label.setColor('#FFE8C0');
    });

    hitArea.on('pointerout', () => {
      bg.clear();
      bg.fillStyle(0x3D2B1A, 0.95);
      bg.fillRoundedRect(btnX - btnW / 2, btnY - btnH / 2, btnW, btnH, 8);
      bg.lineStyle(1.5, 0xC4A46C, 0.8);
      bg.strokeRoundedRect(btnX - btnW / 2, btnY - btnH / 2, btnW, btnH, 8);
      label.setColor('#E8D5B0');
    });

    hitArea.on('pointerdown', () => {
      this.performDeduction();
    });
  }

  performDeduction() {
    const w = this.cameras.main.width;
    const h = this.cameras.main.height;

    if (this.selectedForDeduction.length !== 2) {
      this.deductionStatusText.setText('Select exactly two evidence cards to connect.');
      this.deductionStatusText.setColor('#C4743A');
      return;
    }

    const result = this.cm.tryDeduction(
      this.selectedForDeduction[0],
      this.selectedForDeduction[1]
    );

    if (result.success) {
      if (result.new) {
        this.deductionStatusText.setText('◆ NEW DEDUCTION: ' + result.result);
        this.deductionStatusText.setColor('#70C050');
      } else {
        this.deductionStatusText.setText('Already deduced: ' + result.result);
        this.deductionStatusText.setColor('#A0896C');
      }

      this.selectedForDeduction = [];
      this.cardVisuals.forEach((card, id) => {
        this.drawCardBg(card.bg, card.cx, card.cy, card.cardW, card.cardH, false, false);
      });
      this.renderDeductions(w, h);

      if (this.gameScene) {
        this.gameScene.updateAllUI();
      }

      // Check if Chapter 3 goal is reached (deducing the 12 copyists)
      const hasCopyistDeduction = this.cm.getDeductions().some(d =>
        d.result.toLowerCase().includes('copyist') || d.result.toLowerCase().includes('scribe')
      );

      if (this.cm.isChapterActive('ch3') && this.cm.getEvidenceCount() >= 4 && hasCopyistDeduction) {
        this.time.delayedCall(1500, () => {
          this.cm.completeChapter('ch3');
          this.closeBoard();
          this.gameScene.showQuestCompleteEffect(
            'CHAPTER 3 COMPLETE',
            'The secret is revealed: the page holds 12 names!\nSpeak with the Elder to discover where it was hidden.',
            '+15 Heritage Points'
          );
          this.gameScene.updateAllUI();
        });
      }
    } else {
      this.deductionStatusText.setText('These clues do not seem connected.');
      this.deductionStatusText.setColor('#C4743A');
    }
  }

  closeBoard() {
    this.scene.stop();
    if (this.gameScene) {
      this.gameScene.scene.resume();
      this.gameScene.updateAllUI();
    }
  }
}