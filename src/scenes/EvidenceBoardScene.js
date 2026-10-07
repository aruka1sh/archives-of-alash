import Phaser from 'phaser';
import { DEDUCTION_PAIRS } from '../data/evidence.js';

export default class EvidenceBoardScene extends Phaser.Scene {
  constructor() {
    super({ key: 'EvidenceBoardScene' });
  }

  init(data) {
    this.gameScene = data.gameScene;
    this.cm = data.gameScene.chapterManager;
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

    this.add.text(w / 2, 54, 'THE MISSING MANUSCRIPT', {
      fontFamily: 'Cinzel, Georgia, serif',
      fontSize: '16px',
      color: '#E8D5B0',
      letterSpacing: 3,
    }).setOrigin(0.5);

    // Divider
    const div = this.add.graphics();
    div.lineStyle(1, 0xC4A46C, 0.25);
    div.lineBetween(w * 0.15, 68, w * 0.85, 68);

    // Evidence cards
    this.renderEvidenceCards(w, h);

    // Deduction section
    this.renderDeductions(w, h);

    // Selected cards for connection
    this.selectedForDeduction = [];
    this.deductionStatusText = this.add.text(w / 2, h - 75, '', {
      fontFamily: 'Lora, Georgia, serif',
      fontSize: '13px',
      color: '#E8D5B0',
    }).setOrigin(0.5);

    // Connect button
    this.createConnectButton(w, h);

    // Close instruction
    this.add.text(w / 2, h - 20, 'Press TAB or ESC to close', {
      fontFamily: 'Lora, Georgia, serif',
      fontSize: '11px',
      color: '#6B5335',
      fontStyle: 'italic',
    }).setOrigin(0.5);

    // Close on TAB/ESC
    this.input.keyboard.on('keydown-TAB', () => this.closeBoard());
    this.input.keyboard.on('keydown-ESC', () => this.closeBoard());
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
      this.add.text(w / 2, startY + 60, 'No evidence discovered yet.\nExplore the village and talk to people.', {
        fontFamily: 'Lora, Georgia, serif',
        fontSize: '14px',
        color: '#A0896C',
        align: 'center',
        fontStyle: 'italic',
      }).setOrigin(0.5);
      return;
    }

    this.add.text(20, startY - 5, `EVIDENCE  (${found.length} found)`, {
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

      const selected = this.selectedForDeduction.includes(e.id);

      const bg = this.add.graphics();
      bg.fillStyle(selected ? 0x4A3A1A : 0x2A1506, 0.92);
      bg.fillRoundedRect(cx - cardW / 2, cy - cardH / 2, cardW, cardH, 8);
      bg.lineStyle(1.5, selected ? 0xC4A46C : 0x8B7355, selected ? 0.9 : 0.6);
      bg.strokeRoundedRect(cx - cardW / 2, cy - cardH / 2, cardW, cardH, 8);

      const icon = this.add.text(cx - cardW / 2 + 12, cy - cardH / 2 + 10, e.icon || '◆', {
        fontFamily: 'serif',
        fontSize: '13px',
        color: '#C4A46C',
      });

      const name = this.add.text(cx - cardW / 2 + 30, cy - cardH / 2 + 10, e.name, {
        fontFamily: 'Cinzel, Georgia, serif',
        fontSize: '10px',
        color: '#E8D5B0',
        letterSpacing: 1,
        wordWrap: { width: cardW - 45 },
      });

      const desc = this.add.text(cx - cardW / 2 + 10, cy - cardH / 2 + 30, e.description, {
        fontFamily: 'Lora, Georgia, serif',
        fontSize: '9px',
        color: '#A0896C',
        wordWrap: { width: cardW - 24 },
        lineSpacing: 2,
      });

      const hitArea = this.add.rectangle(cx, cy, cardW, cardH, 0x000000, 0.01)
        .setInteractive({ useHandCursor: true });

      // Click to select for deduction
      hitArea.on('pointerdown', () => {
        this.toggleEvidenceSelection(e.id);
      });

      // Right-click or double-click to inspect
      hitArea.on('pointerover', () => {
        bg.clear();
        bg.fillStyle(selected ? 0x5C4E2E : 0x3D2B1A, 0.95);
        bg.fillRoundedRect(cx - cardW / 2, cy - cardH / 2, cardW, cardH, 8);
        bg.lineStyle(2, '#C4A46C', 0.8);
        bg.strokeRoundedRect(cx - cardW / 2, cy - cardH / 2, cardW, cardH, 8);
      });
      hitArea.on('pointerout', () => {
        bg.clear();
        bg.fillStyle(selected ? 0x4A3A1A : 0x2A1506, 0.92);
        bg.fillRoundedRect(cx - cardW / 2, cy - cardH / 2, cardW, cardH, 8);
        bg.lineStyle(1.5, selected ? 0xC4A46C : 0x8B7355, selected ? 0.9 : 0.6);
        bg.strokeRoundedRect(cx - cardW / 2, cy - cardH / 2, cardW, cardH, 8);
      });
    });
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
    this.deductionStatusText.setText('');
    this.scene.restart({ gameScene: this.gameScene });
  }

  renderDeductions(w, h) {
    const deductions = this.cm.getDeductions();
    if (deductions.length === 0) return;

    const startY = 340;
    this.add.text(20, startY, 'DEDUCTIONS', {
      fontFamily: 'Cinzel, Georgia, serif',
      fontSize: '11px',
      color: '#8B7355',
      letterSpacing: 2,
    });

    deductions.forEach((d, i) => {
      const dy = startY + 24 + i * 22;
      this.add.text(22, dy, `◆ ${d.result}`, {
        fontFamily: 'Lora, Georgia, serif',
        fontSize: '12px',
        color: '#C4A46C',
        fontStyle: 'italic',
      });
    });
  }

  createConnectButton(w, h) {
    const btnW = 200;
    const btnH = 36;
    const btnX = w / 2;
    const btnY = h - 50;

    const bg = this.add.graphics();
    bg.fillStyle(0x3D2B1A, 0.9);
    bg.fillRoundedRect(btnX - btnW / 2, btnY - btnH / 2, btnW, btnH, 6);
    bg.lineStyle(1.5, 0xC4A46C, 0.6);
    bg.strokeRoundedRect(btnX - btnW / 2, btnY - btnH / 2, btnW, btnH, 6);

    this.add.text(btnX, btnY, 'CONNECT CLUES', {
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
      bg.fillRoundedRect(btnX - btnW / 2, btnY - btnH / 2, btnW, btnH, 6);
      bg.lineStyle(2, 0xC4A46C, 0.9);
      bg.strokeRoundedRect(btnX - btnW / 2, btnY - btnH / 2, btnW, btnH, 6);
    });
    hitArea.on('pointerout', () => {
      bg.clear();
      bg.fillStyle(0x3D2B1A, 0.9);
      bg.fillRoundedRect(btnX - btnW / 2, btnY - btnH / 2, btnW, btnH, 6);
      bg.lineStyle(1.5, 0xC4A46C, 0.6);
      bg.strokeRoundedRect(btnX - btnW / 2, btnY - btnH / 2, btnW, btnH, 6);
    });

    hitArea.on('pointerdown', () => {
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
          this.deductionStatusText.setText('◆ DEDUCTION COMPLETE: ' + result.result);
          this.deductionStatusText.setColor('#6BAA4A');
        } else {
          this.deductionStatusText.setText('Already deduced: ' + result.result);
          this.deductionStatusText.setColor('#A0896C');
        }
        this.selectedForDeduction = [];
        this.time.delayedCall(600, () => {
          this.scene.restart({ gameScene: this.gameScene });
        });

        const ch3Reqs = this.cm.getEvidenceCount() >= 4 && this.cm.getDeductionCount() >= 2;
        if (ch3Reqs && this.cm.isChapterActive('ch3') && !this.cm.isChapterCompleted('ch3')) {
          this.time.delayedCall(1200, () => {
            this.cm.completeChapter('ch3');
            this.cm.setEvening(true);
            this.scene.stop();
            this.gameScene.scene.resume();
            this.gameScene.applyEveningTransition();
            this.gameScene.updateAllUI();
            this.gameScene.showQuestCompleteEffect(
              'CHAPTER COMPLETE',
              'Enough evidence gathered. Return to the archive at night.',
              '+15 Heritage Points'
            );
          });
        }
      } else {
        this.deductionStatusText.setText('These clues do not seem connected.');
        this.deductionStatusText.setColor('#C4743A');
      }
    });
  }

  closeBoard() {
    this.scene.stop();
    this.gameScene.scene.resume();
  }
}