import Phaser from 'phaser';
import Player from '../entities/Player.js';
import NPC from '../entities/NPC.js';
import ChapterManager from '../systems/ChapterManager.js';
import { MAP_WIDTH, MAP_HEIGHT, PLAYER_START, BUILDINGS, TREES, NPCS, FRAGMENTS, DECORATIONS } from '../data/mapData.js';
import { DIALOGUE, INTERVIEW_CHOICES } from '../data/dialogue.js';
import { EVIDENCE } from '../data/evidence.js';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    this.cameras.main.fadeIn(600, 0, 0, 0);

    this.physics.world.setBounds(0, 0, MAP_WIDTH, MAP_HEIGHT);
    this.cameras.main.setBounds(0, 0, MAP_WIDTH, MAP_HEIGHT);

    this.dialogueActive = false;
    this.dialogueQueue = [];
    this.dialogueIndex = 0;
    this.isTyping = false;
    this.showingChoices = false;
    this.interactionTarget = null;
    this.allQuestsDone = false;
    this.eveningApplied = false;

    this.chapterManager = new ChapterManager();
    // Try loading previous save if available
    this.chapterManager.loadState();

    this.drawMap();
    this.createShadowLayer();
    this.createDecorations();
    this.createTrees();
    this.createBuildings();
    this.createFragments();
    this.createEvidenceObjects();
    this.createPlayer();
    this.createNPCs();
    this.createUI();
    this.setupInput();
    this.createAmbientParticles();

    if (this.chapterManager.isEvening) {
      this.applyEveningTransition(true);
    }

    // Auto-advance checks on load if criteria were fulfilled in saved state
    if (this.chapterManager.isChapterActive('ch2') && this.chapterManager.getInterviewedCount() >= 3) {
      this.chapterManager.completeChapter('ch2');
      this.createEvidenceObjects();
    }
    const hasCopyistDeduction = this.chapterManager.getDeductions().some(d =>
      d.result.toLowerCase().includes('copyist') || d.result.toLowerCase().includes('scribe')
    );
    if (this.chapterManager.isChapterActive('ch3') && this.chapterManager.getEvidenceCount() >= 4 && hasCopyistDeduction) {
      this.chapterManager.completeChapter('ch3');
      this.createEvidenceObjects();
    }

    this.updateAllUI();
  }

  update() {
    if (this.dialogueActive || this.allQuestsDone || this.showingChoices) {
      if (this.player) this.player.setVelocity(0, 0);
      return;
    }

    this.player.update(this.cursors, this.wasd);
    if (this.npcs) {
      this.npcs.forEach(npc => npc.updateShadowPosition());
    }
    this.checkInteractions();
  }

  // ==================== MAP ====================
  drawMap() {
    const g = this.add.graphics().setDepth(0);
    g.fillStyle(0x5A7D3A);
    g.fillRect(0, 0, MAP_WIDTH, MAP_HEIGHT);

    for (let i = 0; i < 300; i++) {
      const gx = Phaser.Math.Between(0, MAP_WIDTH);
      const gy = Phaser.Math.Between(0, MAP_HEIGHT);
      const shade = Phaser.Math.Between(0, 2);
      const colors = [0x557838, 0x648840, 0x4E7030];
      g.fillStyle(colors[shade], Phaser.Math.FloatBetween(0.6, 0.9));
      g.fillCircle(gx, gy, Phaser.Math.Between(2, 6));
    }

    for (let i = 0; i < 120; i++) {
      const gx = Phaser.Math.Between(0, MAP_WIDTH);
      const gy = Phaser.Math.Between(0, MAP_HEIGHT);
      g.lineStyle(1, 0x4E7030, 0.3);
      g.lineBetween(gx, gy, gx + 2, gy - 4);
      g.lineBetween(gx, gy, gx - 2, gy - 3);
    }

    g.fillStyle(0x8B7355, 0.5);
    g.fillRect(300, 250, 1000, 450);
    g.fillRect(400, 700, 700, 150);
    g.fillStyle(0x9B8B75, 0.35);
    g.fillRect(320, 270, 960, 410);
    g.fillRect(420, 720, 660, 110);
    g.fillStyle(0xA09070, 0.4);
    g.fillCircle(800, 600, 180);
    g.lineStyle(1, 0x6B5335, 0.3);
    g.strokeRect(300, 250, 1000, 450);
    g.strokeRect(400, 700, 700, 150);
    g.strokeCircle(800, 600, 180);
    g.fillStyle(0x8B7355, 0.3);
    g.fillRect(690, 430, 20, 120);
    g.fillRect(890, 500, 20, 100);

    for (let i = 0; i < 30; i++) {
      const px = Phaser.Math.Between(330, 1270);
      const py = Phaser.Math.Between(280, 680);
      g.lineStyle(1, 0x7A6345, 0.2);
      g.lineBetween(px, py, px + Phaser.Math.Between(-5, 5), py + Phaser.Math.Between(2, 8));
    }
  }

  createShadowLayer() {
    const g = this.add.graphics().setDepth(1);
    BUILDINGS.forEach(b => {
      g.fillStyle(0x000000, 0.12);
      g.fillEllipse(b.x + b.w / 2, b.y + b.h + 4, b.w * 1.1, 16);
    });
  }

  createTrees() {
    TREES.forEach(t => {
      const tree = this.add.image(t.x, t.y, 'tree').setDepth(5);
      const scale = Phaser.Math.FloatBetween(0.85, 1.25);
      tree.setScale(scale);
      const shadow = this.add.image(t.x + 2, t.y + 5, 'shadow')
        .setDepth(4).setAlpha(0.3).setScale(scale * 0.7);
      shadow.setTint(0x1a3a08);
    });
  }

  createDecorations() {
    DECORATIONS.forEach(d => {
      const g = this.add.graphics().setDepth(3);
      if (d.type === 'fence_h') {
        g.fillStyle(0x000000, 0.1);
        g.fillRect(d.x + 2, d.y + 4, d.w, 3);
        g.fillStyle(0x4A3520);
        for (let i = 0; i <= d.w; i += 20) g.fillRect(d.x + i, d.y - 2, 4, 16);
        g.fillStyle(0x5C3A1E);
        g.fillRect(d.x, d.y + 2, d.w, 3);
        g.fillRect(d.x, d.y + 9, d.w, 3);
      } else if (d.type === 'well') {
        g.fillStyle(0x000000, 0.15);
        g.fillEllipse(d.x, d.y + 16, 38, 12);
        g.fillStyle(0x7A6A55);
        g.fillCircle(d.x, d.y, 18);
        g.lineStyle(2, 0x6B5335);
        g.strokeCircle(d.x, d.y, 18);
        g.fillStyle(0x2A1A08);
        g.fillCircle(d.x, d.y, 12);
        g.fillStyle(0x5C3A1E);
        g.fillRect(d.x - 14, d.y - 2, 28, 4);
        g.fillStyle(0x4A3520);
        g.fillRect(d.x - 12, d.y - 22, 4, 20);
        g.fillRect(d.x + 8, d.y - 22, 4, 20);
        g.fillStyle(0x5C3A1E);
        g.fillTriangle(d.x - 16, d.y - 22, d.x, d.y - 34, d.x + 16, d.y - 22);
      } else if (d.type === 'cart') {
        g.fillStyle(0x000000, 0.12);
        g.fillEllipse(d.x, d.y + 12, 36, 10);
        g.fillStyle(0x7A6345);
        g.fillRoundedRect(d.x - 15, d.y - 8, 30, 14, 3);
        g.fillStyle(0x6B5335);
        g.fillRect(d.x - 12, d.y - 5, 24, 8);
        g.lineStyle(2, 0x4A3520);
        g.strokeCircle(d.x - 10, d.y + 10, 7);
        g.strokeCircle(d.x + 10, d.y + 10, 7);
      }
    });
  }

  createBuildings() {
    this.buildingBodies = [];
    BUILDINGS.forEach(b => {
      const g = this.add.graphics().setDepth(2);
      g.fillStyle(0x000000, 0.15);
      g.fillEllipse(b.x + b.w / 2, b.y + b.h + 3, b.w + 16, 14);

      if (b.type === 'yurt') this.drawYurt(g, b.x + b.w / 2, b.y + b.h / 2, Math.min(b.w, b.h) / 2);
      else if (b.type === 'brick') {
        g.fillStyle(b.color);
        g.fillRoundedRect(b.x, b.y + 6, b.w, b.h - 6, { tl: 0, tr: 0, bl: 3, br: 3 });
        g.fillStyle(0x5C3A1E);
        g.fillRect(b.x - 6, b.y - 4, b.w + 12, 18);
        g.fillStyle(0x3D2B1A);
        g.fillRoundedRect(b.x + b.w / 2 - 10, b.y + b.h - 22, 20, 22, { tl: 6, tr: 6, bl: 0, br: 0 });
        g.fillStyle(0xD4C5A9, 0.7);
        g.fillRoundedRect(b.x + 10, b.y + 28, 18, 18, 2);
        g.fillRoundedRect(b.x + b.w - 28, b.y + 28, 18, 18, 2);
      } else {
        g.fillStyle(b.color);
        g.fillRoundedRect(b.x, b.y + 8, b.w, b.h - 8, { tl: 0, tr: 0, bl: 3, br: 3 });
        g.fillStyle(0x5C3A1E);
        g.fillTriangle(b.x - 8, b.y + 8, b.x + b.w / 2, b.y - 26, b.x + b.w + 8, b.y + 8);
        g.fillStyle(0x4A3520);
        g.fillRoundedRect(b.x + b.w / 2 - 8, b.y + b.h - 20, 16, 20, { tl: 4, tr: 4, bl: 0, br: 0 });
        g.fillStyle(0xE8D5B0, 0.3);
        g.fillRoundedRect(b.x + 10, b.y + 22, 16, 16, 2);
        g.fillRoundedRect(b.x + b.w - 26, b.y + 22, 16, 16, 2);
      }

      const zone = this.add.zone(b.x + b.w / 2, b.y + b.h / 2, b.w, b.h);
      this.physics.add.existing(zone, true);
      this.buildingBodies.push(zone);
    });
  }

  drawYurt(g, cx, cy, r) {
    g.fillStyle(0x8B7355);
    g.fillCircle(cx, cy + r * 0.1, r * 1.08);
    g.fillStyle(0xD4C5A9);
    g.fillCircle(cx, cy, r);
    g.fillStyle(0x8B7355);
    g.fillCircle(cx, cy - r * 0.4, r * 0.68);
    g.fillStyle(0x6B5335);
    g.fillCircle(cx, cy - r * 0.78, r * 0.2);
    g.fillStyle(0x4A3520);
    g.fillRoundedRect(cx - 7, cy + r * 0.2, 14, r * 0.65, { tl: 4, tr: 4, bl: 0, br: 0 });
    g.fillStyle(0xC4A46C, 0.4);
    g.fillCircle(cx, cy - r * 0.98, 3);
  }

  // ==================== PLAYER & NPCs ====================
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

  // ==================== FRAGMENTS & EVIDENCE ====================
  createFragments() {
    this.fragments = [];
    const cm = this.chapterManager;
    if (cm.isChapterCompleted('ch1') || !cm.isChapterActive('ch1')) {
      return;
    }

    FRAGMENTS.forEach((fData, idx) => {
      const isThird = idx === 2;
      // Skip if already collected from previous save
      if (cm.isFragmentCollected(fData.id)) return;

      const glow = this.add.image(fData.x, fData.y, 'glow').setDepth(4).setAlpha(0.3).setScale(1.2);
      this.tweens.add({ targets: glow, alpha: { from: 0.35, to: 0.15 }, scaleX: { from: 1.2, to: 1.6 }, scaleY: { from: 1.2, to: 1.6 }, duration: 1800, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

      const f = this.add.image(fData.x, fData.y, 'fragment').setDepth(6);
      f.setData('id', fData.id);
      f.setData('isThird', isThird);
      this.tweens.add({ targets: f, y: fData.y - 3, duration: 1500, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

      this.fragments.push({
        sprite: f, glowLarge: glow, data: fData, collected: false, isThird: isThird
      });
    });
  }

  createEvidenceObjects() {
    if (this.evidenceObjects) {
      this.evidenceObjects.forEach(eo => {
        if (eo.marker) eo.marker.destroy();
        if (eo.label) eo.label.destroy();
      });
    }
    this.evidenceObjects = [];
    const cm = this.chapterManager;
    const currentChapter = cm.activeChapterId;

    // Filter evidence appropriate for current chapter or earlier
    const allowedChapters = {
      ch1: ['ch1'],
      ch2: ['ch1', 'ch2'],
      ch3: ['ch1', 'ch2', 'ch3'],
      ch4: ['ch1', 'ch2', 'ch3', 'ch4'],
      ch5: ['ch1', 'ch2', 'ch3', 'ch4', 'ch5'],
      ch6: ['ch1', 'ch2', 'ch3', 'ch4', 'ch5', 'ch6'],
    }[currentChapter] || ['ch1'];

    EVIDENCE.forEach(ev => {
      // torn_manuscript is obtained by picking up the third fragment in Chapter 1
      if (ev.id === 'torn_manuscript') return;
      if (!allowedChapters.includes(ev.chapter)) return;
      if (cm.evidence[ev.id] && cm.evidence[ev.id].found) return;

      const pos = ev.foundAt;
      const marker = this.add.circle(pos.x, pos.y, 9, 0xC4A46C, 0.15).setDepth(4);
      this.tweens.add({
        targets: marker,
        alpha: { from: 0.25, to: 0.05 },
        scaleX: { from: 1, to: 1.7 },
        scaleY: { from: 1, to: 1.7 },
        duration: 2000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });

      const label = this.add.text(pos.x, pos.y - 14, '?', {
        fontFamily: 'Cinzel, Georgia, serif',
        fontSize: '13px',
        color: '#C4A46C',
        stroke: '#2A1506',
        strokeThickness: 2,
      }).setOrigin(0.5).setDepth(7);

      this.evidenceObjects.push({ marker, label, data: ev, pos, collected: false });
    });
  }

  // ==================== UI ====================
  createUI() {
    this.chapterPanel = this.add.graphics().setDepth(90).setScrollFactor(0);
    this.chapterTitleTxt = this.add.text(20, 16, '', { fontFamily: 'Cinzel, Georgia, serif', fontSize: '10px', color: '#C4A46C', letterSpacing: 2 }).setDepth(91).setScrollFactor(0);
    this.chapterDescTxt = this.add.text(20, 32, '', { fontFamily: 'Lora, Georgia, serif', fontSize: '13px', color: '#E8D5B0' }).setDepth(91).setScrollFactor(0);
    this.chapterProgressTxt = this.add.text(20, 50, '', { fontFamily: 'Lora, Georgia, serif', fontSize: '11px', color: '#A0896C' }).setDepth(91).setScrollFactor(0);

    this.pointsPanel = this.add.graphics().setDepth(90).setScrollFactor(0);
    this.pointsIcon = this.add.text(0, 16, '◆', { fontFamily: 'serif', fontSize: '14px', color: '#C4A46C' }).setDepth(91).setScrollFactor(0);
    this.pointsLabel = this.add.text(0, 16, 'HERITAGE', { fontFamily: 'Cinzel, Georgia, serif', fontSize: '9px', color: '#A0896C', letterSpacing: 1 }).setDepth(91).setScrollFactor(0);
    this.pointsValue = this.add.text(0, 30, '0', { fontFamily: 'Cinzel, Georgia, serif', fontSize: '22px', color: '#FFE8C0', stroke: '#2A1506', strokeThickness: 2 }).setDepth(91).setScrollFactor(0);

    this.interactText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height - 80, '', {
      fontFamily: 'Cinzel, Georgia, serif', fontSize: '16px', color: '#FFE8C0', stroke: '#2A1506', strokeThickness: 4, letterSpacing: 2,
    }).setOrigin(0.5).setDepth(91).setScrollFactor(0).setAlpha(0);

    // Evening overlay
    this.eveningOverlay = this.add.rectangle(
      this.cameras.main.width / 2, this.cameras.main.height / 2,
      this.cameras.main.width, this.cameras.main.height, 0x1A2A3A, 0
    ).setDepth(88).setScrollFactor(0);

    this.updateAllUI();
  }

  updateAllUI() {
    this.updateChapterPanel();
    this.updatePointsDisplay();
  }

  updateChapterPanel() {
    const cm = this.chapterManager;
    const ch = cm.getActiveChapter();
    if (!ch) {
      this.chapterPanel.clear();
      this.chapterTitleTxt.setText('');
      this.chapterDescTxt.setText('');
      this.chapterProgressTxt.setText('');
      return;
    }

    const px = 14, py = 10, pw = 280, ph = 74;
    this.chapterPanel.clear();
    this.chapterPanel.fillStyle(0x000000, 0.25);
    this.chapterPanel.fillRoundedRect(px + 2, py + 2, pw, ph, 8);
    this.chapterPanel.fillStyle(0x1a0a00, 0.92);
    this.chapterPanel.fillRoundedRect(px, py, pw, ph, 8);
    this.chapterPanel.lineStyle(1, 0xC4A46C, 0.5);
    this.chapterPanel.strokeRoundedRect(px, py, pw, ph, 8);
    this.chapterPanel.fillStyle(0xC4A46C, 0.12);
    this.chapterPanel.fillRoundedRect(px + 3, py + 3, pw - 6, 18, { tl: 6, tr: 6, bl: 0, br: 0 });

    this.chapterTitleTxt.setText(`CHAPTER ${ch.number} — ${ch.title.toUpperCase()}`);
    this.chapterDescTxt.setText(ch.objective);

    if (cm.isChapterActive('ch1')) {
      const p = cm.getChapterProgress();
      if (p >= 3) {
        this.chapterProgressTxt.setText('All 3 folios found! Return to the Archivist.');
      } else {
        this.chapterProgressTxt.setText(`Fragments: ${p}/3 recovered from the village`);
      }
    } else if (cm.isChapterActive('ch2')) {
      this.chapterProgressTxt.setText(`Questioned: ${cm.getInterviewedCount()}/3 | Avg Trust: ${cm.getAverageTrust()}%`);
    } else if (cm.isChapterActive('ch3')) {
      this.chapterProgressTxt.setText(`Evidence: ${cm.getEvidenceCount()} | Deductions: ${cm.getDeductionCount()} (TAB: Case File)`);
    } else if (cm.isChapterActive('ch4')) {
      this.chapterProgressTxt.setText('Speak with the Village Elder to learn where it was hidden.');
    } else if (cm.isChapterActive('ch5')) {
      const cacheDiscovered = cm.evidence['cache_marks'] && cm.evidence['cache_marks'].found;
      const chestDiscovered = cm.evidence['archivist_chest'] && cm.evidence['archivist_chest'].found;
      if (!cacheDiscovered) {
        this.chapterProgressTxt.setText('Investigate the stone cache south of the old well.');
      } else if (!chestDiscovered) {
        this.chapterProgressTxt.setText('Cache is empty! Search the archive exterior for clues.');
      } else {
        this.chapterProgressTxt.setText('Confront the Archivist about the packed travel chest!');
      }
    } else {
      this.chapterProgressTxt.setText('Speak with the Elder to decide the fate of the page.');
    }
  }

  updatePointsDisplay() {
    const w = this.cameras.main.width;
    const pw = 95, ph = 52, px = w - pw - 14, py = 10;
    const points = this.chapterManager.getPoints();

    this.pointsPanel.clear();
    this.pointsPanel.fillStyle(0x000000, 0.25);
    this.pointsPanel.fillRoundedRect(px + 2, py + 2, pw, ph, 8);
    this.pointsPanel.fillStyle(0x1a0a00, 0.92);
    this.pointsPanel.fillRoundedRect(px, py, pw, ph, 8);
    this.pointsPanel.lineStyle(1, 0xC4A46C, 0.5);
    this.pointsPanel.strokeRoundedRect(px, py, pw, ph, 8);

    this.pointsIcon.setPosition(px + 12, py + 6);
    this.pointsLabel.setPosition(px + 28, py + 8);
    this.pointsValue.setPosition(px + pw / 2, py + 24).setOrigin(0.5, 0);
    this.pointsValue.setText(`${points}`);
  }

  // ==================== INPUT ====================
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
    this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    this.tabKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TAB);

    this.interactKey.on('down', () => {
      if (!this.dialogueActive && this.interactionTarget && !this.showingChoices) {
        this.handleInteraction(this.interactionTarget);
      } else if (this.dialogueActive && !this.showingChoices) {
        this.advanceDialogue();
      }
    });
    this.spaceKey.on('down', () => {
      if (this.dialogueActive && !this.showingChoices) this.advanceDialogue();
    });
    this.enterKey.on('down', () => {
      if (this.dialogueActive && !this.showingChoices) this.advanceDialogue();
    });
    this.escKey.on('down', () => {
      if (this.dialogueActive && !this.showingChoices) this.closeDialogue();
    });
    this.tabKey.on('down', () => {
      if (!this.dialogueActive && !this.showingChoices && !this.scene.isPaused() && !this.scene.isActive('EvidenceBoardScene')) {
        this.scene.pause();
        this.scene.launch('EvidenceBoardScene', { gameScene: this });
      }
    });
  }

  // ==================== INTERACTIONS ====================
  checkInteractions() {
    if (this.dialogueActive || this.showingChoices) return;

    let closest = null;
    let closestDist = 55;

    // Check NPCs
    for (const npc of this.npcs) {
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, npc.x, npc.y);
      if (dist < closestDist) { closestDist = dist; closest = { type: 'npc', target: npc }; }
    }

    // Check fragments (Chapter 1)
    if (this.chapterManager.isChapterActive('ch1')) {
      for (const f of this.fragments) {
        if (f.collected) continue;
        const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, f.data.x, f.data.y);
        if (dist < 50 && dist < closestDist) { closestDist = dist; closest = { type: 'fragment', target: f }; }
      }
    }

    // Check evidence objects (Chapters 2+)
    if (!this.chapterManager.isChapterActive('ch1')) {
      for (const eo of this.evidenceObjects) {
        if (eo.collected) continue;
        const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, eo.pos.x, eo.pos.y);
        if (dist < 48 && dist < closestDist) { closestDist = dist; closest = { type: 'evidence', target: eo }; }
      }
    }

    if (closest) {
      this.interactionTarget = closest;
      this.interactText.setText('[E] INTERACT');
      if (this.interactText.alpha < 0.1) {
        this.interactText.setAlpha(1);
        this.tweens.add({ targets: this.interactText, alpha: { from: 0.7, to: 1 }, duration: 600, yoyo: true, repeat: -1 });
      }
    } else {
      this.interactionTarget = null;
      this.tweens.killTweensOf(this.interactText);
      this.interactText.setAlpha(0);
    }
  }

  handleInteraction(target) {
    if (target.type === 'npc') this.interactWithNPC(target.target);
    else if (target.type === 'fragment') this.collectFragment(target.target);
    else if (target.type === 'evidence') this.collectEvidence(target.target);
  }

  // ==================== NPC INTERACTION ====================
  interactWithNPC(npc) {
    const key = npc.getDialogKey();
    const cm = this.chapterManager;

    // Chapter 1: Flow
    if (cm.isChapterActive('ch1')) {
      if (key === 'archivist') {
        if (cm.getChapterProgress() >= 3) {
          this.startDialogue(key, 'chapter1_missing', () => {
            cm.completeChapter('ch1');
            this.createEvidenceObjects();
            this.updateAllUI();
            this.showQuestCompleteEffect(
              'CHAPTER 1 COMPLETE',
              'The third page was sliced out with a quill knife.\nQuestion the villagers to find out why.',
              '+10 Heritage Points'
            );
          });
          return;
        }
        this.startDialogue(key, 'chapter1_start');
        return;
      }
      this.startDialogue(key, 'greeting');
      return;
    }

    // Chapter 2: Interviews with trust choices
    if (cm.isChapterActive('ch2') && INTERVIEW_CHOICES[key]) {
      if (!cm.isNPCInterviewed(key)) {
        this.startDialogueData(INTERVIEW_CHOICES[key].intro, () => {
          this.showInterviewChoices(key);
        });
      } else {
        if (cm.getInterviewedCount() >= 3) {
          cm.completeChapter('ch2');
          this.createEvidenceObjects();
          this.updateAllUI();
          this.showQuestCompleteEffect(
            'CHAPTER 2 COMPLETE',
            'All three villagers questioned.\nInvestigate clues and connect them on the Case File (TAB).',
            '+10 Heritage Points'
          );
        } else {
          this.startDialogue(key, 'greeting');
        }
      }
      return;
    }

    // Chapter 3: Puzzle minigame with Archivist, clues with Teacher
    if (cm.isChapterActive('ch3')) {
      const hasCopyistDeduction = cm.getDeductions().some(d =>
        d.result.toLowerCase().includes('copyist') || d.result.toLowerCase().includes('scribe')
      );
      if (cm.getEvidenceCount() >= 4 && hasCopyistDeduction) {
        cm.completeChapter('ch3');
        this.createEvidenceObjects();
        this.updateAllUI();
        this.showQuestCompleteEffect(
          'CHAPTER 3 COMPLETE',
          'The secret is revealed: the page holds 12 names!\nSpeak with the Elder to discover where it was hidden.',
          '+15 Heritage Points'
        );
        return;
      }
      if (key === 'archivist') {
        if (!cm.puzzleSolved) {
          this.startDialogue(key, 'puzzleOffer', () => {
            this.scene.pause();
            this.scene.launch('PuzzleScene', { gameScene: this });
          });
          return;
        }
        this.startDialogue(key, 'greeting');
        return;
      }
      if (key === 'teacher') {
        this.startDialogue(key, 'chapter3_start');
        return;
      }
    }

    // Chapter 4: Nightfall & Elder confession
    if (cm.isChapterActive('ch4')) {
      if (key === 'elder') {
        this.startDialogue(key, 'chapter4_start', () => {
          cm.setEvening(true);
          this.applyEveningTransition();
          cm.completeChapter('ch4');
          this.createEvidenceObjects();
          this.updateAllUI();
          this.showQuestCompleteEffect(
            'CHAPTER 4 COMPLETE',
            'The Elder revealed the secret cache by the well!\nGo to the old well to recover the page.',
            '+15 Heritage Points'
          );
        });
        return;
      }
    }

    // Chapter 5: The Empty Cache & Confronting Archivist
    if (cm.isChapterActive('ch5')) {
      const cacheDiscovered = cm.evidence['cache_marks'] && cm.evidence['cache_marks'].found;
      const chestDiscovered = cm.evidence['archivist_chest'] && cm.evidence['archivist_chest'].found;

      if (key === 'elder') {
        if (cacheDiscovered) {
          this.startDialogue(key, 'chapter5_shock');
        } else {
          this.startDialogue(key, 'chapter5_prompt');
        }
        return;
      }
      if (key === 'archivist') {
        if (chestDiscovered) {
          this.startDialogue(key, 'chapter5_confront', () => {
            cm.completeChapter('ch5');
            this.updateAllUI();
            this.showQuestCompleteEffect(
              'CHAPTER 5 COMPLETE',
              'The missing page is recovered!\nSpeak with the Elder to decide its fate.',
              '+15 Heritage Points'
            );
          });
        } else {
          this.startDialogue(key, 'chapter5_busy');
        }
        return;
      }
    }

    // Chapter 6: Final Decision
    if (cm.isChapterActive('ch6')) {
      if (key === 'elder') {
        this.startDialogue(key, 'chapter6_start', () => {
          this.time.delayedCall(500, () => {
            this.scene.pause();
            this.scene.launch('FinalChoiceScene', { gameScene: this });
          });
        });
        return;
      }
    }

    // Default greeting
    this.startDialogue(key, 'greeting');
  }

  // ==================== INTERVIEW CHOICES (Chapter 2) ====================
  showInterviewChoices(npcKey) {
    this.showingChoices = true;
    const w = this.cameras.main.width;
    const h = this.cameras.main.height;
    const choices = INTERVIEW_CHOICES[npcKey].choices;

    this.choiceContainer = this.add.container(0, 0).setDepth(100).setScrollFactor(0);

    const overlay = this.add.rectangle(w / 2, h / 2, w, h, 0x000000, 0.55).setInteractive();
    this.choiceContainer.add(overlay);

    const panelW = 580, panelH = 290, px = w / 2, py = h / 2;

    const panel = this.add.graphics();
    panel.fillStyle(0x2A1506, 0.98);
    panel.fillRoundedRect(px - panelW / 2, py - panelH / 2, panelW, panelH, 14);
    panel.lineStyle(2, 0xC4A46C, 0.8);
    panel.strokeRoundedRect(px - panelW / 2, py - panelH / 2, panelW, panelH, 14);
    this.choiceContainer.add(panel);

    const title = this.add.text(px, py - panelH / 2 + 22, `◆  QUESTION ${npcKey.toUpperCase()}  ◆`, {
      fontFamily: 'Cinzel, Georgia, serif', fontSize: '16px', color: '#C4A46C', letterSpacing: 2,
    }).setOrigin(0.5);
    this.choiceContainer.add(title);

    const hint = this.add.text(px, py - panelH / 2 + 40, 'Press [A], [B], [C] or click to select', {
      fontFamily: 'Lora, Georgia, serif', fontSize: '11px', color: '#A0896C', fontStyle: 'italic',
    }).setOrigin(0.5);
    this.choiceContainer.add(hint);

    choices.forEach((choice, i) => {
      const by = py - 32 + i * 64;
      const bw = panelW - 50, bh = 46;

      const btnBg = this.add.graphics();
      btnBg.fillStyle(0x3D2B1A, 0.95);
      btnBg.fillRoundedRect(px - bw / 2, by - bh / 2, bw, bh, 8);
      btnBg.lineStyle(1, 0x8B7355, 0.6);
      btnBg.strokeRoundedRect(px - bw / 2, by - bh / 2, bw, bh, 8);
      this.choiceContainer.add(btnBg);

      const label = `${['A', 'B', 'C'][i]}. ${choice.text}`;
      const btnText = this.add.text(px, by, label, {
        fontFamily: 'Lora, Georgia, serif', fontSize: '13px', color: '#D4C5A9',
        wordWrap: { width: bw - 30 }, align: 'center',
      }).setOrigin(0.5);
      this.choiceContainer.add(btnText);

      const hitArea = this.add.rectangle(px, by, bw, bh, 0x000000, 0.01).setInteractive({ useHandCursor: true });
      this.choiceContainer.add(hitArea);

      hitArea.on('pointerover', () => {
        btnBg.clear();
        btnBg.fillStyle(0x5C3A1E, 0.98);
        btnBg.fillRoundedRect(px - bw / 2, by - bh / 2, bw, bh, 8);
        btnBg.lineStyle(2, 0xC4A46C, 0.9);
        btnBg.strokeRoundedRect(px - bw / 2, by - bh / 2, bw, bh, 8);
        btnText.setColor('#FFE8C0');
      });
      hitArea.on('pointerout', () => {
        btnBg.clear();
        btnBg.fillStyle(0x3D2B1A, 0.95);
        btnBg.fillRoundedRect(px - bw / 2, by - bh / 2, bw, bh, 8);
        btnBg.lineStyle(1, 0x8B7355, 0.6);
        btnBg.strokeRoundedRect(px - bw / 2, by - bh / 2, bw, bh, 8);
        btnText.setColor('#D4C5A9');
      });
      hitArea.on('pointerdown', () => {
        this.handleInterviewChoice(npcKey, choice);
      });
    });

    // Keyboard shortcuts for choices: A, B, C (or 1, 2, 3)
    this.choiceKeyHandlers = [];
    const keyCodes = [
      [Phaser.Input.Keyboard.KeyCodes.A, Phaser.Input.Keyboard.KeyCodes.ONE],
      [Phaser.Input.Keyboard.KeyCodes.B, Phaser.Input.Keyboard.KeyCodes.TWO],
      [Phaser.Input.Keyboard.KeyCodes.C, Phaser.Input.Keyboard.KeyCodes.THREE]
    ];

    choices.forEach((choice, i) => {
      if (keyCodes[i]) {
        keyCodes[i].forEach(code => {
          const keyObj = this.input.keyboard.addKey(code);
          const onDown = () => {
            if (this.showingChoices) {
              this.handleInterviewChoice(npcKey, choice);
            }
          };
          keyObj.once('down', onDown);
          this.choiceKeyHandlers.push({ keyObj, onDown });
        });
      }
    });
  }

  cleanupChoiceKeys() {
    if (this.choiceKeyHandlers) {
      this.choiceKeyHandlers.forEach(({ keyObj, onDown }) => {
        keyObj.off('down', onDown);
      });
      this.choiceKeyHandlers = [];
    }
  }

  handleInterviewChoice(npcKey, choice) {
    this.cleanupChoiceKeys();
    if (this.choiceContainer) { this.choiceContainer.destroy(); this.choiceContainer = null; }
    this.showingChoices = false;

    const cm = this.chapterManager;
    cm.adjustTrust(npcKey, choice.trust);
    cm.markNPCInterviewed(npcKey);

    // Immediately update UI so interviewed count and trust change right away!
    this.updateAllUI();

    this.startDialogueData(choice.reply, () => {
      this.updateAllUI();
      if (cm.getInterviewedCount() >= 3 && cm.isChapterActive('ch2')) {
        cm.completeChapter('ch2');
        this.createEvidenceObjects();
        this.updateAllUI();
        this.showQuestCompleteEffect(
          'CHAPTER 2 COMPLETE',
          'All three villagers questioned.\nInvestigate clues and connect them on the Case File (TAB).',
          '+10 Heritage Points'
        );
      }
    });
  }

  // ==================== COLLECTION ====================
  collectFragment(fragment) {
    if (fragment.collected) return;
    fragment.collected = true;

    this.tweens.killTweensOf(fragment.sprite);
    if (fragment.glowLarge) this.tweens.killTweensOf(fragment.glowLarge);

    this.tweens.add({
      targets: [fragment.sprite, fragment.glowLarge],
      alpha: 0, scaleX: 1.8, scaleY: 1.8, duration: 350, ease: 'Cubic.easeOut',
      onComplete: () => {
        if (fragment.sprite) fragment.sprite.destroy();
        if (fragment.glowLarge) fragment.glowLarge.destroy();
      }
    });

    const isThird = fragment.isThird;
    const notifContainer = this.add.container(fragment.data.x, fragment.data.y).setDepth(20);
    const notifBg = this.add.graphics();
    notifBg.fillStyle(0x1a0a00, 0.9);
    notifBg.fillRoundedRect(-75, -20, 150, 40, 8);
    notifBg.lineStyle(1, 0xC4A46C, 0.8);
    notifBg.strokeRoundedRect(-75, -20, 150, 40, 8);
    notifContainer.add(notifBg);

    const titleStr = isThird ? 'TORN FRAGMENT' : 'MANUSCRIPT';
    const subStr = isThird ? 'EDGE CUT WITH KNIFE' : 'PAGE RECOVERED';
    notifContainer.add(this.add.text(0, -9, titleStr, { fontFamily: 'Cinzel, Georgia, serif', fontSize: '11px', color: '#C4A46C', letterSpacing: 2 }).setOrigin(0.5));
    notifContainer.add(this.add.text(0, 9, subStr, { fontFamily: 'Lora, Georgia, serif', fontSize: '11px', color: '#FFE8C0' }).setOrigin(0.5));

    this.tweens.add({ targets: notifContainer, y: notifContainer.y - 30, alpha: { from: 1, to: 0 }, duration: 2000, delay: 500, ease: 'Cubic.easeOut', onComplete: () => notifContainer.destroy() });

    const cm = this.chapterManager;
    cm.collectFragment(fragment.data.id);

    if (isThird) {
      cm.discoverEvidence('torn_manuscript');
    }

    this.updateAllUI();
  }

  collectEvidence(eo) {
    if (eo.collected) return;
    const cm = this.chapterManager;
    const result = cm.discoverEvidence(eo.data.id);
    if (!result) return;

    eo.collected = true;
    this.tweens.add({ targets: [eo.marker, eo.label], alpha: 0, duration: 400, onComplete: () => { eo.marker.destroy(); eo.label.destroy(); } });

    // Notification
    const w = this.cameras.main.width;
    const container = this.add.container(w / 2, this.cameras.main.height / 2).setDepth(100).setScrollFactor(0);
    const panelW = 380, panelH = 120;

    const bg = this.add.graphics();
    bg.fillStyle(0x2A1506, 0.97);
    bg.fillRoundedRect(-panelW / 2, -panelH / 2, panelW, panelH, 12);
    bg.lineStyle(2, 0xC4A46C, 0.8);
    bg.strokeRoundedRect(-panelW / 2, -panelH / 2, panelW, panelH, 12);
    container.add(bg);

    container.add(this.add.text(0, -34, '◆  EVIDENCE DISCOVERED  ◆', {
      fontFamily: 'Cinzel, Georgia, serif', fontSize: '13px', color: '#C4A46C', letterSpacing: 1,
    }).setOrigin(0.5));
    container.add(this.add.text(0, -8, result.name, {
      fontFamily: 'Cinzel, Georgia, serif', fontSize: '16px', color: '#FFE8C0',
    }).setOrigin(0.5));
    container.add(this.add.text(0, 16, result.description, {
      fontFamily: 'Lora, Georgia, serif', fontSize: '12px', color: '#D4C5A9',
      wordWrap: { width: panelW - 40 }, align: 'center',
    }).setOrigin(0.5));
    container.add(this.add.text(0, panelH / 2 - 18, '+5 Heritage Points  |  Press TAB for Case File', {
      fontFamily: 'Lora, Georgia, serif', fontSize: '10.5px', color: '#A0896C', fontStyle: 'italic',
    }).setOrigin(0.5));

    this.tweens.add({ targets: container, alpha: { from: 1, to: 0 }, duration: 600, delay: 4000, onComplete: () => container.destroy() });

    this.updateAllUI();

    // Prevent soft-lock: Check if Chapter 3 conditions are met upon collecting evidence
    const hasCopyistDeduction = cm.getDeductions().some(d =>
      d.result.toLowerCase().includes('copyist') || d.result.toLowerCase().includes('scribe')
    );
    if (cm.isChapterActive('ch3') && cm.getEvidenceCount() >= 4 && hasCopyistDeduction) {
      this.time.delayedCall(1200, () => {
        if (cm.isChapterActive('ch3')) {
          cm.completeChapter('ch3');
          this.createEvidenceObjects();
          this.updateAllUI();
          this.showQuestCompleteEffect(
            'CHAPTER 3 COMPLETE',
            'The secret is revealed: the page holds 12 names!\nSpeak with the Elder to discover where it was hidden.',
            '+15 Heritage Points'
          );
        }
      });
    }
  }

  // ==================== DAY/NIGHT TRANSITION ====================
  applyEveningTransition(instant = false) {
    if (!this.eveningOverlay) return;
    if (this.eveningApplied) return;
    this.eveningApplied = true;

    if (instant) {
      this.eveningOverlay.setAlpha(0.38);
    } else {
      this.tweens.add({
        targets: this.eveningOverlay,
        alpha: 0.38,
        duration: 2000,
        ease: 'Cubic.easeInOut',
      });
    }

    // Lantern light effect near archive and well
    const lanternPositions = [
      { x: 1280, y: 220 },
      { x: 750, y: 680 },
    ];

    lanternPositions.forEach(pos => {
      const lantern = this.add.circle(pos.x, pos.y, 65, 0xFFD700, 0.08).setDepth(2);
      this.tweens.add({
        targets: lantern,
        alpha: { from: 0.06, to: 0.12 },
        scaleX: { from: 1, to: 1.25 },
        scaleY: { from: 1, to: 1.25 },
        duration: 2200,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    });
  }

  // ==================== DIALOGUE ====================
  startDialogue(npcKey, dialogKey, onComplete) {
    const dialogueData = DIALOGUE[npcKey];
    if (!dialogueData || !dialogueData[dialogKey]) {
      if (onComplete) onComplete();
      return;
    }
    this.startDialogueData(dialogueData[dialogKey], onComplete);
  }

  startDialogueData(messages, onComplete) {
    this.dialogueQueue = [...messages];
    this.dialogueIndex = 0;
    this.dialogueActive = true;
    this.dialogueCompleteCb = onComplete || null;
    this.interactText.setAlpha(0);
    this.tweens.killTweensOf(this.interactText);
    this.createDialogueBox();
    this.showCurrentDialogue();
  }

  createDialogueBox() {
    if (this.dialogueContainer) this.dialogueContainer.destroy();
    const w = this.cameras.main.width, h = this.cameras.main.height;
    this.dialogueContainer = this.add.container(0, 0).setDepth(95).setScrollFactor(0);

    const boxW = w - 80, boxH = 155, bx = (w - boxW) / 2, by = h - boxH - 25;

    const shadow = this.add.graphics();
    shadow.fillStyle(0x000000, 0.3);
    shadow.fillRoundedRect(bx + 3, by + 3, boxW, boxH, 12);
    this.dialogueContainer.add(shadow);

    const bg = this.add.graphics();
    bg.fillStyle(0x2A1A0A, 0.98);
    bg.fillRoundedRect(bx, by, boxW, boxH, 12);
    bg.lineStyle(2, 0xC4A46C, 0.7);
    bg.strokeRoundedRect(bx, by, boxW, boxH, 12);
    bg.lineStyle(1, 0x8B7355, 0.3);
    bg.strokeRoundedRect(bx + 5, by + 5, boxW - 10, boxH - 10, 8);
    bg.fillStyle(0xC4A46C, 0.08);
    bg.fillRoundedRect(bx + 6, by + 6, boxW - 12, 22, { tl: 7, tr: 7, bl: 0, br: 0 });
    this.dialogueContainer.add(bg);

    this.speakerText = this.add.text(bx + 20, by + 12, '', { fontFamily: 'Cinzel, Georgia, serif', fontSize: '12px', color: '#C4A46C', letterSpacing: 2 });
    this.dialogueContainer.add(this.speakerText);

    this.dialogueContentText = this.add.text(bx + 20, by + 44, '', { fontFamily: 'Lora, Georgia, serif', fontSize: '15px', color: '#E8D5B0', wordWrap: { width: boxW - 48 }, lineSpacing: 5 });
    this.dialogueContainer.add(this.dialogueContentText);

    this.continueHint = this.add.text(bx + boxW - 22, by + boxH - 24, '▶ [SPACE / CLICK]', { fontFamily: 'Cinzel, Georgia, serif', fontSize: '11px', color: '#C4A46C' }).setOrigin(1, 0).setAlpha(0);
    this.dialogueContainer.add(this.continueHint);

    // Click area across entire dialogue box
    const clickArea = this.add.rectangle(bx + boxW / 2, by + boxH / 2, boxW, boxH, 0x000000, 0.001)
      .setInteractive({ useHandCursor: true });
    clickArea.on('pointerdown', () => {
      if (this.dialogueActive && !this.showingChoices) this.advanceDialogue();
    });
    this.dialogueContainer.add(clickArea);
  }

  showCurrentDialogue() {
    if (this.dialogueIndex >= this.dialogueQueue.length) { this.closeDialogue(); return; }
    const msg = this.dialogueQueue[this.dialogueIndex];
    this.speakerText.setText('◆  ' + msg.speaker.toUpperCase());
    this.continueHint.setAlpha(0);
    this.tweens.killTweensOf(this.continueHint);
    this.typeText(msg.text, () => {
      this.continueHint.setAlpha(0.6);
      this.tweens.add({ targets: this.continueHint, alpha: { from: 0.3, to: 0.8 }, duration: 500, yoyo: true, repeat: -1 });
    });
  }

  typeText(text, onComplete) {
    this.isTyping = true;
    this.dialogueContentText.setText('');
    let charIndex = 0;
    if (this.typeTimer) this.typeTimer.destroy();
    this.typeTimer = this.time.addEvent({
      delay: 18,
      callback: () => {
        if (charIndex < text.length) { this.dialogueContentText.setText(text.substring(0, charIndex + 1)); charIndex++; }
        else { this.typeTimer.destroy(); this.isTyping = false; if (onComplete) onComplete(); }
      },
      repeat: text.length - 1,
    });
  }

  advanceDialogue() {
    if (this.isTyping) {
      if (this.typeTimer) this.typeTimer.destroy();
      this.dialogueContentText.setText(this.dialogueQueue[this.dialogueIndex].text);
      this.isTyping = false;
      this.continueHint.setAlpha(0.6);
      this.tweens.add({ targets: this.continueHint, alpha: { from: 0.3, to: 0.8 }, duration: 500, yoyo: true, repeat: -1 });
      return;
    }
    this.tweens.killTweensOf(this.continueHint);
    this.dialogueIndex++;
    this.showCurrentDialogue();
  }

  closeDialogue() {
    this.dialogueActive = false;
    this.isTyping = false;
    if (this.typeTimer) this.typeTimer.destroy();
    if (this.dialogueContainer) { this.dialogueContainer.destroy(); this.dialogueContainer = null; }
    const cb = this.dialogueCompleteCb;
    this.dialogueCompleteCb = null;
    if (cb) cb();
  }

  // ==================== EFFECTS ====================
  showQuestCompleteEffect(title, message, points) {
    const w = this.cameras.main.width, h = this.cameras.main.height;
    const container = this.add.container(0, 0).setDepth(100).setScrollFactor(0);
    const overlay = this.add.rectangle(w / 2, h / 2, w, h, 0x000000, 0.55).setInteractive();
    container.add(overlay);

    const panelW = 440, panelH = 200, px = w / 2, py = h / 2;
    const panel = this.add.graphics();
    panel.fillStyle(0x2A1506, 0.98);
    panel.fillRoundedRect(px - panelW / 2, py - panelH / 2, panelW, panelH, 14);
    panel.lineStyle(2, 0xC4A46C, 0.8);
    panel.strokeRoundedRect(px - panelW / 2, py - panelH / 2, panelW, panelH, 14);
    container.add(panel);

    const icon = this.add.text(px, py - 52, '◆', { fontFamily: 'serif', fontSize: '24px', color: '#C4A46C' }).setOrigin(0.5).setScale(0);
    container.add(icon);
    this.tweens.add({ targets: icon, scaleX: 1, scaleY: 1, duration: 500, ease: 'Back.easeOut' });

    container.add(this.add.text(px, py - 22, title, { fontFamily: 'Cinzel, Georgia, serif', fontSize: '19px', color: '#C4A46C', letterSpacing: 2 }).setOrigin(0.5));
    container.add(this.add.text(px, py + 12, message, { fontFamily: 'Lora, Georgia, serif', fontSize: '13.5px', color: '#D4C5A9', align: 'center', lineSpacing: 4 }).setOrigin(0.5));
    if (points) container.add(this.add.text(px, py + 58, points, { fontFamily: 'Cinzel, Georgia, serif', fontSize: '16px', color: '#FFE8C0' }).setOrigin(0.5));

    this.time.delayedCall(4000, () => {
      this.tweens.add({ targets: container, alpha: 0, duration: 400, onComplete: () => container.destroy() });
    });
  }

  createAmbientParticles() {
    this.add.particles(0, 0, 'particle', { x: { min: 0, max: MAP_WIDTH }, y: { min: 0, max: MAP_HEIGHT }, lifespan: { min: 5000, max: 10000 }, speed: { min: 1, max: 6 }, scale: { start: 0.5, end: 0 }, alpha: { start: 0.12, end: 0 }, frequency: 500, quantity: 1, tint: 0xE8D5B0 }).setDepth(1);
    this.add.particles(0, 0, 'particle', { x: { min: 0, max: MAP_WIDTH }, y: { min: 0, max: MAP_HEIGHT }, lifespan: { min: 6000, max: 12000 }, speed: { min: 2, max: 10 }, scale: { start: 0.4, end: 0 }, alpha: { start: 0.15, end: 0 }, frequency: 900, quantity: 1, tint: 0xFFE8C0 }).setDepth(1);
  }
}