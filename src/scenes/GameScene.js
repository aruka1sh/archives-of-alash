import Phaser from 'phaser';
import Player from '../entities/Player.js';
import NPC from '../entities/NPC.js';
import QuestManager from '../systems/QuestManager.js';
import { MAP_WIDTH, MAP_HEIGHT, PLAYER_START, BUILDINGS, TREES, NPCS, FRAGMENTS, DECORATIONS } from '../data/mapData.js';
import { DIALOGUE, QUEST2_CHOICES } from '../data/dialogue.js';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    this.cameras.main.fadeIn(500, 0, 0, 0);

    this.physics.world.setBounds(0, 0, MAP_WIDTH, MAP_HEIGHT);
    this.cameras.main.setBounds(0, 0, MAP_WIDTH, MAP_HEIGHT);

    this.dialogueActive = false;
    this.dialogueQueue = [];
    this.dialogueIndex = 0;
    this.isTyping = false;
    this.showingChoices = false;
    this.interactionTarget = null;
    this.allQuestsDone = false;

    this.questManager = new QuestManager(this);

    this.drawMap();
    this.createDecorations();
    this.createTrees();
    this.createBuildings();
    this.createFragments();
    this.createPlayer();
    this.createNPCs();
    this.createUI();
    this.setupInput();
    this.createAmbientParticles();

    this.questManager.startQuest('quest1');
    this.updateQuestPanel();
  }

  update() {
    if (this.dialogueActive || this.allQuestsDone) {
      if (this.player) this.player.setVelocity(0, 0);
      return;
    }

    this.player.update(this.cursors, this.wasd);
    this.checkInteractions();
  }

  drawMap() {
    const g = this.add.graphics();
    g.setDepth(0);

    g.fillStyle(0x5A7D3A);
    g.fillRect(0, 0, MAP_WIDTH, MAP_HEIGHT);

    g.fillStyle(0x6B8E4A);
    for (let i = 0; i < 200; i++) {
      const gx = Phaser.Math.Between(0, MAP_WIDTH);
      const gy = Phaser.Math.Between(0, MAP_HEIGHT);
      g.fillCircle(gx, gy, Phaser.Math.Between(2, 5));
    }

    g.fillStyle(0x8B7355, 0.6);
    g.fillRect(300, 250, 1000, 450);
    g.fillRect(400, 700, 700, 150);

    g.fillStyle(0x9B8B75, 0.3);
    g.fillRect(320, 270, 960, 410);
    g.fillRect(420, 720, 660, 110);

    g.fillStyle(0xA09070, 0.4);
    g.fillCircle(800, 600, 180);

    g.lineStyle(1, 0x6B8E4A, 0.3);
    for (let i = 0; i < 60; i++) {
      const gx = Phaser.Math.Between(0, MAP_WIDTH);
      const gy = Phaser.Math.Between(0, MAP_HEIGHT);
      g.lineBetween(gx, gy, gx + 2, gy + Phaser.Math.Between(2, 6));
    }

    g.lineStyle(2, 0x7A6345, 0.4);
    g.strokeCircle(800, 600, 180);
  }

  createTrees() {
    TREES.forEach(t => {
      const tree = this.add.image(t.x, t.y, 'tree').setDepth(5);
      tree.setScale(Phaser.Math.FloatBetween(0.8, 1.2));
    });
  }

  createDecorations() {
    DECORATIONS.forEach(d => {
      const g = this.add.graphics().setDepth(3);
      if (d.type === 'fence_h') {
        g.lineStyle(2, 0x5C3A1E);
        for (let i = 0; i < d.w; i += 15) {
          g.lineBetween(d.x + i, d.y, d.x + i + 10, d.y + 12);
          g.lineBetween(d.x + i + 10, d.y + 12, d.x + i + 20, d.y);
        }
        g.lineStyle(1, 0x5C3A1E);
        g.lineBetween(d.x, d.y + 6, d.x + d.w, d.y + 6);
      } else if (d.type === 'fence_v') {
        g.lineStyle(2, 0x5C3A1E);
        for (let i = 0; i < d.h; i += 15) {
          g.lineBetween(d.x, d.y + i, d.x + 12, d.y + i + 10);
          g.lineBetween(d.x + 12, d.y + i + 10, d.x, d.y + i + 20);
        }
        g.lineStyle(1, 0x5C3A1E);
        g.lineBetween(d.x + 6, d.y, d.x + 6, d.y + d.h);
      } else if (d.type === 'well') {
        g.fillStyle(0x8B7355);
        g.fillCircle(d.x, d.y, 18);
        g.fillStyle(0x3D5A2E);
        g.fillCircle(d.x, d.y, 12);
        g.lineStyle(2, 0x5C3A1E);
        g.strokeCircle(d.x, d.y, 18);
      } else if (d.type === 'cart') {
        g.fillStyle(0x7A6345);
        g.fillRect(d.x - 15, d.y - 8, 30, 16);
        g.fillStyle(0x5C3A1E);
        g.fillCircle(d.x - 12, d.y + 10, 7);
        g.fillCircle(d.x + 12, d.y + 10, 7);
      } else if (d.type === 'stones') {
        g.fillStyle(0x808080);
        g.fillCircle(d.x, d.y, 5);
        g.fillCircle(d.x + 8, d.y + 2, 4);
        g.fillCircle(d.x - 6, d.y + 3, 4);
        g.fillCircle(d.x + 4, d.y - 4, 3);
      }
    });
  }

  createBuildings() {
    this.buildingBodies = [];

    BUILDINGS.forEach(b => {
      const g = this.add.graphics().setDepth(2);
      const { x, y, w, h, type, color, label } = b;

      g.fillStyle(0x000000, 0.15);
      g.fillRect(x + 4, y + 4, w, h);

      if (type === 'yurt') {
        this.drawYurt(g, x + w / 2, y + h / 2, Math.min(w, h) / 2);
      } else if (type === 'brick') {
        g.fillStyle(color);
        g.fillRect(x, y, w, h);
        g.fillStyle(0x8B7355);
        g.fillRect(x - 4, y - 6, w + 8, 14);
        g.fillStyle(0xD4C5A9, 0.3);
        for (let row = 0; row < h - 14; row += 8) {
          g.fillRect(x + 2, y + 14 + row, w - 4, 3);
        }
        g.fillStyle(0x4A3520);
        g.fillRect(x + w / 2 - 10, y + h - 24, 20, 24);
        g.fillStyle(0xD4C5A9);
        g.fillRect(x + 8, y + 30, 16, 16);
        g.fillRect(x + w - 24, y + 30, 16, 16);
      } else {
        g.fillStyle(color);
        g.fillRect(x, y, w, h);
        g.fillStyle(0x5C3A1E);
        g.fillTriangle(x - 6, y, x + w / 2, y - 22, x + w + 6, y);
        g.fillStyle(0x4A3520);
        g.fillRect(x + w / 2 - 8, y + h - 20, 16, 20);
        g.fillStyle(0xD4C5A9);
        g.fillRect(x + 8, y + 20, 14, 14);
        g.fillRect(x + w - 22, y + 20, 14, 14);
      }

      const zone = this.add.zone(x + w / 2, y + h / 2, w, h);
      this.physics.add.existing(zone, true);
      this.buildingBodies.push(zone);

      if (label) {
        this.add.text(x + w / 2, y - 18, label, {
          fontFamily: 'Lora, Georgia, serif',
          fontSize: '11px',
          color: '#E8D5B0',
          stroke: '#2A1506',
          strokeThickness: 3,
          align: 'center',
        }).setOrigin(0.5).setDepth(8);
      }
    });
  }

  drawYurt(g, cx, cy, r) {
    g.fillStyle(0xD4C5A9);
    g.fillCircle(cx, cy, r);
    g.lineStyle(2, 0x8B7355, 0.6);
    g.strokeCircle(cx, cy, r);
    g.fillStyle(0x8B7355);
    g.fillCircle(cx, cy - r * 0.4, r * 0.65);
    g.fillStyle(0x6B5335);
    g.fillCircle(cx, cy - r * 0.7, r * 0.18);
    g.fillStyle(0x4A3520);
    g.fillRect(cx - 7, cy + r * 0.15, 14, r * 0.7);
    g.lineStyle(1, 0x5C3A1E, 0.4);
    g.lineBetween(cx - r, cy, cx + r, cy);
    g.lineBetween(cx, cy - r, cx, cy + r);
    g.lineBetween(cx - r * 0.7, cy - r * 0.7, cx + r * 0.7, cy + r * 0.7);
    g.lineBetween(cx + r * 0.7, cy - r * 0.7, cx - r * 0.7, cy + r * 0.7);

    g.fillStyle(0xC4A46C, 0.3);
    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 6) {
      const ox = cx + Math.cos(angle) * r * 0.55;
      const oy = cy + Math.sin(angle) * r * 0.55;
      g.fillCircle(ox, oy, 3);
    }
  }

  createPlayer() {
    this.player = new Player(this, PLAYER_START.x, PLAYER_START.y);
    this.player.setDepth(10);

    this.physics.add.collider(this.player, this.buildingBodies);

    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
    this.cameras.main.setDeadzone(100, 80);
  }

  createNPCs() {
    this.npcs = [];
    NPCS.forEach(npcData => {
      const npc = new NPC(this, npcData.x, npcData.y, npcData.texture, npcData);
      this.npcs.push(npc);
      this.physics.add.collider(this.player, npc);
    });
  }

  createFragments() {
    this.fragments = [];
    this.collectedFragments = [];

    FRAGMENTS.forEach(fData => {
      const f = this.add.image(fData.x, fData.y, 'fragment').setDepth(6);
      this.physics.add.existing(f, true);

      f.setData('id', fData.id);

      this.tweens.add({
        targets: f,
        alpha: { from: 1, to: 0.5 },
        y: fData.y - 4,
        duration: 1200,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });

      const glow = this.add.circle(fData.x, fData.y, 16, 0xC4A46C, 0.15).setDepth(5);
      this.tweens.add({
        targets: glow,
        alpha: { from: 0.2, to: 0.4 },
        scaleX: { from: 1, to: 1.5 },
        scaleY: { from: 1, to: 1.5 },
        duration: 1500,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });

      this.fragments.push({ sprite: f, glow: glow, data: fData });
    });
  }

  createUI() {
    this.questPanel = this.add.graphics().setDepth(90).setScrollFactor(0);
    this.questTitleText = this.add.text(18, 14, '', {
      fontFamily: 'Cinzel, Georgia, serif',
      fontSize: '11px',
      color: '#C4A46C',
    }).setDepth(91).setScrollFactor(0);
    this.questDescText = this.add.text(18, 30, '', {
      fontFamily: 'Lora, Georgia, serif',
      fontSize: '13px',
      color: '#E8D5B0',
    }).setDepth(91).setScrollFactor(0);
    this.questProgressText = this.add.text(18, 48, '', {
      fontFamily: 'Lora, Georgia, serif',
      fontSize: '12px',
      color: '#A0896C',
    }).setDepth(91).setScrollFactor(0);

    this.pointsText = this.add.text(this.cameras.main.width - 18, 14, '', {
      fontFamily: 'Cinzel, Georgia, serif',
      fontSize: '14px',
      color: '#C4A46C',
      stroke: '#2A1506',
      strokeThickness: 2,
    }).setOrigin(1, 0).setDepth(91).setScrollFactor(0);

    this.interactText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height - 80, '', {
      fontFamily: 'Cinzel, Georgia, serif',
      fontSize: '16px',
      color: '#FFE8C0',
      stroke: '#2A1506',
      strokeThickness: 4,
    }).setOrigin(0.5).setDepth(91).setScrollFactor(0).setAlpha(0);

    this.updatePointsDisplay();
  }

  updateQuestPanel() {
    const activeQuest = this.questManager.getActiveQuest();
    if (!activeQuest) {
      this.questPanel.clear();
      this.questTitleText.setText('');
      this.questDescText.setText('');
      this.questProgressText.setText('');
      return;
    }

    const px = 12;
    const py = 10;
    const pw = 240;
    const ph = 62;

    this.questPanel.clear();
    this.questPanel.fillStyle(0x1a0a00, 0.85);
    this.questPanel.fillRoundedRect(px, py, pw, ph, 8);
    this.questPanel.lineStyle(1, 0xC4A46C, 0.5);
    this.questPanel.strokeRoundedRect(px, py, pw, ph, 8);
    this.questPanel.fillStyle(0xC4A46C, 0.2);
    this.questPanel.fillRoundedRect(px + 2, py + 2, pw - 4, 18, 4);

    this.questTitleText.setText('◆ QUEST ◆');
    this.questDescText.setText(activeQuest.description);
    this.questProgressText.setText(`${activeQuest.progressText}: ${activeQuest.progress}/${activeQuest.target}`);
  }

  updatePointsDisplay() {
    this.pointsText.setText(`✦ ${this.questManager.getPoints()} HP`);
  }

  setupInput() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = {
      up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };

    this.interactKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    this.interactKey.on('down', () => {
      if (!this.dialogueActive && this.interactionTarget) {
        this.handleInteraction(this.interactionTarget);
      }
    });

    this.spaceKey.on('down', () => {
      if (this.dialogueActive && !this.isTyping && !this.showingChoices) {
        this.advanceDialogue();
      }
    });

    this.escKey.on('down', () => {
      if (this.dialogueActive && !this.showingChoices) {
        this.closeDialogue();
      }
    });
  }

  checkInteractions() {
    if (this.dialogueActive) return;

    let closest = null;
    let closestDist = 55;

    for (const npc of this.npcs) {
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, npc.x, npc.y);
      if (dist < closestDist) {
        closestDist = dist;
        closest = { type: 'npc', target: npc };
      }
    }

    if (this.questManager.isQuestActive('quest1')) {
      for (const f of this.fragments) {
        if (f.collected) continue;
        const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, f.data.x, f.data.y);
        if (dist < 50 && dist < closestDist) {
          closestDist = dist;
          closest = { type: 'fragment', target: f };
        }
      }
    }

    if (closest) {
      this.interactionTarget = closest;
      this.interactText.setText(`[E] INTERACT`);
      this.interactText.setAlpha(1);
      this.tweens.add({
        targets: this.interactText,
        alpha: { from: 0.7, to: 1 },
        duration: 500,
        yoyo: true,
        repeat: -1,
      });
    } else {
      this.interactionTarget = null;
      this.tweens.killTweensOf(this.interactText);
      this.interactText.setAlpha(0);
    }
  }

  handleInteraction(target) {
    if (target.type === 'npc') {
      this.interactWithNPC(target.target);
    } else if (target.type === 'fragment') {
      this.collectFragment(target.target);
    }
  }

  interactWithNPC(npc) {
    const key = npc.getDialogKey();
    const qm = this.questManager;

    if (qm.isQuestActive('quest2') && key === 'elder') {
      this.showElderQuest2Dialog();
      return;
    }

    if (qm.isQuestActive('quest3') && key === 'archivist' && qm.getProgress('quest3') === 0) {
      this.startDialogue(key, 'puzzleIntro', () => {
        qm.addProgress('quest3', 1);
        this.time.delayedCall(500, () => {
          this.scene.pause();
          this.scene.launch('PuzzleScene', { gameScene: this });
        });
      });
      return;
    }

    if (qm.isQuestActive('quest3') && key === 'elder') {
      this.startDialogue(key, 'questComplete', () => {
        qm.completeQuest('quest3');
        this.updateQuestPanel();
        this.updatePointsDisplay();
        this.time.delayedCall(1000, () => {
          this.showFinalScene();
        });
      });
      return;
    }

    if (qm.isQuestCompleted('quest3') && key === 'elder') {
      this.showFinalScene();
      return;
    }

    this.startDialogue(key, 'greeting');

    if (qm.isQuestActive('quest1')) {
      this.startDialogue(key, 'questHint');
    }
  }

  showElderQuest2Dialog() {
    const qm = this.questManager;
    this.startDialogue('elder', 'quest2Intro', () => {
      this.showQuest2Choices();
    });
  }

  showQuest2Choices() {
    this.showingChoices = true;
    const w = this.cameras.main.width;
    const h = this.cameras.main.height;

    this.choiceContainer = this.add.container(0, 0).setDepth(100).setScrollFactor(0);

    const overlay = this.add.rectangle(w / 2, h / 2, w, h, 0x000000, 0.4)
      .setInteractive();
    this.choiceContainer.add(overlay);

    const panelW = 560;
    const panelH = 340;
    const px = w / 2;
    const py = h / 2;

    const panel = this.add.graphics();
    panel.fillStyle(0x2A1506, 0.97);
    panel.fillRoundedRect(px - panelW / 2, py - panelH / 2, panelW, panelH, 12);
    panel.lineStyle(2, 0xC4A46C, 0.8);
    panel.strokeRoundedRect(px - panelW / 2, py - panelH / 2, panelW, panelH, 12);
    this.choiceContainer.add(panel);

    const title = this.add.text(px, py - panelH / 2 + 25, 'ABAI\'S WISDOM', {
      fontFamily: 'Cinzel, Georgia, serif',
      fontSize: '20px',
      color: '#C4A46C',
    }).setOrigin(0.5);
    this.choiceContainer.add(title);

    const qText = this.add.text(px, py - 70, QUEST2_CHOICES.question, {
      fontFamily: 'Lora, Georgia, serif',
      fontSize: '15px',
      color: '#E8D5B0',
      wordWrap: { width: panelW - 60 },
      align: 'center',
    }).setOrigin(0.5);
    this.choiceContainer.add(qText);

    const options = QUEST2_CHOICES.options;
    const btnStartY = py;
    const btnH = 42;
    const btnW = panelW - 60;
    const btnGap = 50;

    options.forEach((opt, i) => {
      const by = btnStartY + i * btnGap;
      const btnBg = this.add.graphics();
      btnBg.fillStyle(0x3D2B1A, 0.9);
      btnBg.fillRoundedRect(px - btnW / 2, by - btnH / 2, btnW, btnH, 8);
      btnBg.lineStyle(1, 0x8B7355, 0.6);
      btnBg.strokeRoundedRect(px - btnW / 2, by - btnH / 2, btnW, btnH, 8);
      this.choiceContainer.add(btnBg);

      const label = `${opt.id}. ${opt.text}`;
      const btnText = this.add.text(px, by, label, {
        fontFamily: 'Lora, Georgia, serif',
        fontSize: '14px',
        color: '#D4C5A9',
        wordWrap: { width: btnW - 30 },
        align: 'center',
      }).setOrigin(0.5);
      this.choiceContainer.add(btnText);

      const hitArea = this.add.rectangle(px, by, btnW, btnH, 0x000000, 0)
        .setInteractive({ useHandCursor: true });
      this.choiceContainer.add(hitArea);

      hitArea.on('pointerover', () => {
        btnBg.clear();
        btnBg.fillStyle(0x5C3A1E, 0.95);
        btnBg.fillRoundedRect(px - btnW / 2, by - btnH / 2, btnW, btnH, 8);
        btnBg.lineStyle(2, 0xC4A46C, 0.8);
        btnBg.strokeRoundedRect(px - btnW / 2, by - btnH / 2, btnW, btnH, 8);
        btnText.setColor('#FFE8C0');
      });
      hitArea.on('pointerout', () => {
        btnBg.clear();
        btnBg.fillStyle(0x3D2B1A, 0.9);
        btnBg.fillRoundedRect(px - btnW / 2, by - btnH / 2, btnW, btnH, 8);
        btnBg.lineStyle(1, 0x8B7355, 0.6);
        btnBg.strokeRoundedRect(px - btnW / 2, by - btnH / 2, btnW, btnH, 8);
        btnText.setColor('#D4C5A9');
      });
      hitArea.on('pointerdown', () => {
        this.handleQuest2Answer(opt);
      });
    });
  }

  handleQuest2Answer(option) {
    if (this.choiceContainer) {
      this.choiceContainer.destroy();
      this.choiceContainer = null;
    }
    this.showingChoices = false;

    if (option.correct) {
      this.showFeedbackOverlay(option.feedback, true, () => {
        this.startDialogue('elder', 'correctAnswer', () => {
          this.questManager.completeQuest('quest2');
          this.updateQuestPanel();
          this.updatePointsDisplay();
          if (this.questManager.isQuestActive('quest3')) {
            this.updateQuestPanel();
          }
        });
      });
    } else {
      this.showFeedbackOverlay(option.feedback, false, () => {
        this.showQuest2Choices();
      });
    }
  }

  showFeedbackOverlay(text, isCorrect, callback) {
    const w = this.cameras.main.width;
    const h = this.cameras.main.height;

    const container = this.add.container(0, 0).setDepth(101).setScrollFactor(0);
    const overlay = this.add.rectangle(w / 2, h / 2, w, h, 0x000000, 0.5).setInteractive();
    container.add(overlay);

    const panelW = 480;
    const panelH = 200;
    const px = w / 2;
    const py = h / 2;

    const panel = this.add.graphics();
    const borderColor = isCorrect ? 0x4A8238 : 0x8B4513;
    panel.fillStyle(0x2A1506, 0.97);
    panel.fillRoundedRect(px - panelW / 2, py - panelH / 2, panelW, panelH, 12);
    panel.lineStyle(2, borderColor, 0.9);
    panel.strokeRoundedRect(px - panelW / 2, py - panelH / 2, panelW, panelH, 12);
    container.add(panel);

    const headerText = isCorrect ? '✓ CORRECT' : '✗ NOT QUITE';
    const headerColor = isCorrect ? '#6BAA4A' : '#C4743A';
    const header = this.add.text(px, py - panelH / 2 + 30, headerText, {
      fontFamily: 'Cinzel, Georgia, serif',
      fontSize: '18px',
      color: headerColor,
    }).setOrigin(0.5);
    container.add(header);

    const fbText = this.add.text(px, py + 5, text, {
      fontFamily: 'Lora, Georgia, serif',
      fontSize: '14px',
      color: '#D4C5A9',
      wordWrap: { width: panelW - 50 },
      align: 'center',
    }).setOrigin(0.5);
    container.add(fbText);

    const continueText = this.add.text(px, py + panelH / 2 - 30, '[ CLICK TO CONTINUE ]', {
      fontFamily: 'Cinzel, Georgia, serif',
      fontSize: '12px',
      color: '#A0896C',
    }).setOrigin(0.5);
    container.add(continueText);

    this.tweens.add({
      targets: continueText,
      alpha: { from: 0.5, to: 1 },
      duration: 600,
      yoyo: true,
      repeat: -1,
    });

    overlay.on('pointerdown', () => {
      container.destroy();
      if (callback) callback();
    });
  }

  collectFragment(fragment) {
    if (fragment.collected) return;
    fragment.collected = true;

    this.tweens.killTweensOf(fragment.sprite);
    this.tweens.killTweensOf(fragment.glow);

    this.tweens.add({
      targets: [fragment.sprite, fragment.glow],
      alpha: 0,
      scaleX: 1.5,
      scaleY: 1.5,
      duration: 400,
      ease: 'Cubic.easeOut',
      onComplete: () => {
        fragment.sprite.destroy();
        fragment.glow.destroy();
      }
    });

    const floatText = this.add.text(fragment.data.x, fragment.data.y, '+1 Fragment', {
      fontFamily: 'Lora, Georgia, serif',
      fontSize: '16px',
      color: '#FFE8C0',
      stroke: '#2A1506',
      strokeThickness: 3,
    }).setOrigin(0.5).setDepth(20);

    this.tweens.add({
      targets: floatText,
      y: floatText.y - 40,
      alpha: 0,
      duration: 1200,
      ease: 'Cubic.easeOut',
      onComplete: () => floatText.destroy(),
    });

    const isComplete = this.questManager.addProgress('quest1', 1);
    this.updateQuestPanel();

    if (isComplete) {
      this.time.delayedCall(800, () => {
        const result = this.questManager.completeQuest('quest1');
        this.updateQuestPanel();
        this.updatePointsDisplay();
        this.showQuestCompleteEffect('Quest Complete!', 'All manuscript fragments recovered.\n+10 Heritage Points');
      });
    }
  }

  showQuestCompleteEffect(title, message) {
    const w = this.cameras.main.width;
    const h = this.cameras.main.height;

    const container = this.add.container(0, 0).setDepth(100).setScrollFactor(0);

    const overlay = this.add.rectangle(w / 2, h / 2, w, h, 0x000000, 0.5).setInteractive();
    container.add(overlay);

    const panelW = 400;
    const panelH = 180;
    const px = w / 2;
    const py = h / 2;

    const panel = this.add.graphics();
    panel.fillStyle(0x2A1506, 0.97);
    panel.fillRoundedRect(px - panelW / 2, py - panelH / 2, panelW, panelH, 12);
    panel.lineStyle(2, 0xC4A46C, 0.9);
    panel.strokeRoundedRect(px - panelW / 2, py - panelH / 2, panelW, panelH, 12);
    container.add(panel);

    const titleText = this.add.text(px, py - 30, title, {
      fontFamily: 'Cinzel, Georgia, serif',
      fontSize: '22px',
      color: '#C4A46C',
    }).setOrigin(0.5).setScale(0.5);
    container.add(titleText);

    const msgText = this.add.text(px, py + 20, message, {
      fontFamily: 'Lora, Georgia, serif',
      fontSize: '15px',
      color: '#D4C5A9',
      align: 'center',
    }).setOrigin(0.5).setAlpha(0);
    container.add(msgText);

    this.tweens.add({
      targets: titleText,
      scaleX: 1,
      scaleY: 1,
      duration: 500,
      ease: 'Back.easeOut',
      onComplete: () => {
        this.tweens.add({
          targets: msgText,
          alpha: 1,
          duration: 400,
        });
      }
    });

    this.time.delayedCall(2500, () => {
      this.tweens.add({
        targets: container,
        alpha: 0,
        duration: 400,
        onComplete: () => container.destroy(),
      });
    });
  }

  startDialogue(npcKey, dialogKey, onComplete) {
    const dialogueData = DIALOGUE[npcKey];
    if (!dialogueData || !dialogueData[dialogKey]) {
      if (onComplete) onComplete();
      return;
    }

    this.dialogueQueue = [...dialogueData[dialogKey]];
    this.dialogueIndex = 0;
    this.dialogueActive = true;
    this.dialogueCompleteCb = onComplete || null;

    this.interactText.setAlpha(0);
    this.tweens.killTweensOf(this.interactText);

    this.createDialogueBox();
    this.showCurrentDialogue();
  }

  createDialogueBox() {
    if (this.dialogueContainer) {
      this.dialogueContainer.destroy();
    }

    const w = this.cameras.main.width;
    const h = this.cameras.main.height;

    this.dialogueContainer = this.add.container(0, 0).setDepth(95).setScrollFactor(0);

    const boxW = w - 80;
    const boxH = 150;
    const bx = (w - boxW) / 2;
    const by = h - boxH - 30;

    const bg = this.add.graphics();
    bg.fillStyle(0x2A1506, 0.95);
    bg.fillRoundedRect(bx, by, boxW, boxH, 10);
    bg.lineStyle(2, 0xC4A46C, 0.7);
    bg.strokeRoundedRect(bx, by, boxW, boxH, 10);
    bg.fillStyle(0xC4A46C, 0.1);
    bg.fillRoundedRect(bx + 4, by + 4, boxW - 8, 22, 4);
    this.dialogueContainer.add(bg);

    this.speakerText = this.add.text(bx + 16, by + 10, '', {
      fontFamily: 'Cinzel, Georgia, serif',
      fontSize: '13px',
      color: '#C4A46C',
    });
    this.dialogueContainer.add(this.speakerText);

    this.dialogueContentText = this.add.text(bx + 16, by + 40, '', {
      fontFamily: 'Lora, Georgia, serif',
      fontSize: '15px',
      color: '#E8D5B0',
      wordWrap: { width: boxW - 40 },
      lineSpacing: 4,
    });
    this.dialogueContainer.add(this.dialogueContentText);

    this.continueHint = this.add.text(bx + boxW - 20, by + boxH - 20, '▶', {
      fontFamily: 'Lora, Georgia, serif',
      fontSize: '14px',
      color: '#C4A46C',
    }).setOrigin(1, 0).setAlpha(0);
    this.dialogueContainer.add(this.continueHint);
  }

  showCurrentDialogue() {
    if (this.dialogueIndex >= this.dialogueQueue.length) {
      this.closeDialogue();
      return;
    }

    const msg = this.dialogueQueue[this.dialogueIndex];
    this.speakerText.setText(msg.speaker);
    this.continueHint.setAlpha(0);

    this.typeText(msg.text, () => {
      this.continueHint.setAlpha(1);
      this.tweens.add({
        targets: this.continueHint,
        alpha: { from: 0.4, to: 1 },
        duration: 500,
        yoyo: true,
        repeat: -1,
      });
    });
  }

  typeText(text, onComplete) {
    this.isTyping = true;
    this.dialogueContentText.setText('');
    let charIndex = 0;

    if (this.typeTimer) this.typeTimer.destroy();

    this.typeTimer = this.time.addEvent({
      delay: 22,
      callback: () => {
        if (charIndex < text.length) {
          this.dialogueContentText.setText(text.substring(0, charIndex + 1));
          charIndex++;
        } else {
          this.typeTimer.destroy();
          this.isTyping = false;
          if (onComplete) onComplete();
        }
      },
      repeat: text.length - 1,
    });
  }

  advanceDialogue() {
    if (this.isTyping) {
      if (this.typeTimer) this.typeTimer.destroy();
      const msg = this.dialogueQueue[this.dialogueIndex];
      this.dialogueContentText.setText(msg.text);
      this.isTyping = false;

      this.continueHint.setAlpha(1);
      this.tweens.add({
        targets: this.continueHint,
        alpha: { from: 0.4, to: 1 },
        duration: 500,
        yoyo: true,
        repeat: -1,
      });
      return;
    }

    if (this.tweens) this.tweens.killTweensOf(this.continueHint);

    this.dialogueIndex++;
    this.showCurrentDialogue();
  }

  closeDialogue() {
    this.dialogueActive = false;
    this.isTyping = false;

    if (this.typeTimer) this.typeTimer.destroy();
    if (this.dialogueContainer) {
      this.dialogueContainer.destroy();
      this.dialogueContainer = null;
    }

    const cb = this.dialogueCompleteCb;
    this.dialogueCompleteCb = null;

    if (cb) cb();
  }

  createAmbientParticles() {
    this.add.particles(0, 0, 'particle', {
      x: { min: 0, max: MAP_WIDTH },
      y: { min: 0, max: MAP_HEIGHT },
      lifespan: { min: 4000, max: 8000 },
      speed: { min: 2, max: 8 },
      scale: { start: 0.6, end: 0 },
      alpha: { start: 0.15, end: 0 },
      frequency: 600,
      quantity: 1,
      tint: 0xE8D5B0,
    }).setDepth(1);
  }

  showFinalScene() {
    this.allQuestsDone = true;
    this.cameras.main.fadeOut(800, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('FinalScene', {
        points: this.questManager.getPoints(),
        rank: this.questManager.getRank(),
      });
    });
  }
}