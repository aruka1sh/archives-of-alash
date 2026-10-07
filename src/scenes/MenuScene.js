import Phaser from 'phaser';

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    this.cameras.main.fadeIn(500, 0, 0, 0);
    const w = this.cameras.main.width;
    const h = this.cameras.main.height;

    this.add.rectangle(w / 2, h / 2, w, h, 0x1a0a00);

    this.drawOrnamentalBorders(w, h);
    this.createAmbientParticles(w, h);

    const titleY = h * 0.28;
    this.add.text(w / 2, titleY, 'ARCHIVES', {
      fontFamily: 'Cinzel, Georgia, serif',
      fontSize: '56px',
      color: '#C4A46C',
      stroke: '#2A1506',
      strokeThickness: 2,
    }).setOrigin(0.5).setAlpha(0).setScale(0.8);

    this.add.text(w / 2, titleY + 60, 'OF ALASH', {
      fontFamily: 'Cinzel, Georgia, serif',
      fontSize: '48px',
      color: '#E8D5B0',
      stroke: '#2A1506',
      strokeThickness: 2,
    }).setOrigin(0.5).setAlpha(0).setScale(0.8);

    const subtitleText = this.add.text(w / 2, titleY + 130, '"Preserve the word. Preserve the heritage."', {
      fontFamily: 'Lora, Georgia, serif',
      fontSize: '18px',
      color: '#A0896C',
      fontStyle: 'italic',
    }).setOrigin(0.5).setAlpha(0);

    this.tweens.add({
      targets: this.children.list.filter(c => c.type === 'Text'),
      alpha: 1,
      scaleX: 1,
      scaleY: 1,
      duration: 1200,
      ease: 'Cubic.easeOut',
      delay: this.tweens.stagger(300),
    });

    this.time.delayedCall(1800, () => {
      this.createMenuButtons(w, h);
      this.addVersionText(w, h);
    });
  }

  createMenuButtons(w, h) {
    const btnY1 = h * 0.62;
    const btnY2 = h * 0.72;
    const btnW = 240;
    const btnH = 50;

    const startBtn = this.createButton(w / 2, btnY1, btnW, btnH, 'START GAME', () => {
      this.transitionTo('IntroScene');
    });

    const howBtn = this.createButton(w / 2, btnY2, btnW, btnH, 'HOW TO PLAY', () => {
      this.showHowToPlay(w, h);
    });

    startBtn.setAlpha(0);
    howBtn.setAlpha(0);

    this.tweens.add({
      targets: [startBtn, startBtn.getData('text'), howBtn, howBtn.getData('text')],
      alpha: 1,
      duration: 600,
      ease: 'Cubic.easeOut',
      delay: this.tweens.stagger(200),
    });
  }

  createButton(x, y, w, h, label, callback) {
    const bg = this.add.graphics();
    bg.fillStyle(0x3D2B1A, 0.9);
    bg.fillRoundedRect(x - w / 2, y - h / 2, w, h, 8);
    bg.lineStyle(2, 0xC4A46C, 0.8);
    bg.strokeRoundedRect(x - w / 2, y - h / 2, w, h, 8);

    const hitArea = this.add.rectangle(x, y, w, h, 0x000000, 0)
      .setInteractive({ useHandCursor: true });

    const text = this.add.text(x, y, label, {
      fontFamily: 'Cinzel, Georgia, serif',
      fontSize: '20px',
      color: '#E8D5B0',
    }).setOrigin(0.5);

    hitArea.setData('text', text);

    hitArea.on('pointerover', () => {
      bg.clear();
      bg.fillStyle(0x5C3A1E, 0.95);
      bg.fillRoundedRect(x - w / 2, y - h / 2, w, h, 8);
      bg.lineStyle(2, 0xE8D5B0, 1);
      bg.strokeRoundedRect(x - w / 2, y - h / 2, w, h, 8);
      text.setColor('#FFE8C0');
      text.setScale(1.03);
    });

    hitArea.on('pointerout', () => {
      bg.clear();
      bg.fillStyle(0x3D2B1A, 0.9);
      bg.fillRoundedRect(x - w / 2, y - h / 2, w, h, 8);
      bg.lineStyle(2, 0xC4A46C, 0.8);
      bg.strokeRoundedRect(x - w / 2, y - h / 2, w, h, 8);
      text.setColor('#E8D5B0');
      text.setScale(1);
    });

    hitArea.on('pointerdown', () => {
      callback();
    });

    return bg;
  }

  showHowToPlay(w, h) {
    const overlay = this.add.rectangle(w / 2, h / 2, w, h, 0x000000, 0.7)
      .setInteractive().setDepth(100);

    const panelW = 500;
    const panelH = 480;
    const px = w / 2;
    const py = h / 2;

    const panel = this.add.graphics().setDepth(101);
    panel.fillStyle(0x2A1506, 0.95);
    panel.fillRoundedRect(px - panelW / 2, py - panelH / 2, panelW, panelH, 12);
    panel.lineStyle(2, 0xC4A46C, 0.9);
    panel.strokeRoundedRect(px - panelW / 2, py - panelH / 2, panelW, panelH, 12);

    const title = this.add.text(px, py - panelH / 2 + 35, 'HOW TO PLAY', {
      fontFamily: 'Cinzel, Georgia, serif',
      fontSize: '24px',
      color: '#C4A46C',
    }).setOrigin(0.5).setDepth(102);

    const instructions = [
      'Move your character using WASD or Arrow Keys',
      '',
      'Press E to interact with NPCs and objects',
      '',
      'Press ESC to close menus and dialogue',
      '',
      'Explore the village, talk to people,',
      'and find hidden manuscript fragments',
      '',
      'Complete quests to earn Heritage Points',
      'and restore the archive',
      '',
      'Your goal: preserve the intellectual',
      'heritage of Kazakhstan'
    ];

    const instrText = this.add.text(px, py - panelH / 2 + 90, instructions.join('\n'), {
      fontFamily: 'Lora, Georgia, serif',
      fontSize: '16px',
      color: '#D4C5A9',
      lineSpacing: 4,
      align: 'center',
    }).setOrigin(0.5, 0).setDepth(102);

    const closeBtn = this.add.text(px, py + panelH / 2 - 45, '[ CLOSE ]', {
      fontFamily: 'Cinzel, Georgia, serif',
      fontSize: '18px',
      color: '#C4A46C',
    }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(102);

    closeBtn.on('pointerover', () => closeBtn.setColor('#FFE8C0'));
    closeBtn.on('pointerout', () => closeBtn.setColor('#C4A46C'));
    closeBtn.on('pointerdown', () => {
      overlay.destroy();
      panel.destroy();
      title.destroy();
      instrText.destroy();
      closeBtn.destroy();
    });

    overlay.on('pointerdown', () => {
      overlay.destroy();
      panel.destroy();
      title.destroy();
      instrText.destroy();
      closeBtn.destroy();
    });
  }

  drawOrnamentalBorders(w, h) {
    const g = this.add.graphics();
    g.lineStyle(1, 0xC4A46C, 0.3);
    const m = 40;
    const size = 18;

    const corners = [
      [m, m], [w - m, m], [m, h - m], [w - m, h - m]
    ];

    for (const [cx, cy] of corners) {
      g.strokeRect(cx - size / 2, cy - size / 2, size, size);
      g.fillStyle(0xC4A46C, 0.15);
      g.fillRect(cx - size / 2 + 2, cy - size / 2 + 2, size - 4, size - 4);
      g.fillStyle(0xC4A46C, 0.3);
      g.fillCircle(cx, cy, 3);
    }

    g.lineStyle(1, 0xC4A46C, 0.15);
    g.lineBetween(m + size, m, w - m - size, m);
    g.lineBetween(m + size, h - m, w - m - size, h - m);
    g.lineBetween(m, m + size, m, h - m - size);
    g.lineBetween(w - m, m + size, w - m, h - m - size);
  }

  createAmbientParticles(w, h) {
    const particles = this.add.particles(0, 0, 'particle', {
      x: { min: 0, max: w },
      y: { min: 0, max: h },
      lifespan: { min: 3000, max: 6000 },
      speed: { min: 2, max: 10 },
      scale: { start: 0.8, end: 0 },
      alpha: { start: 0.2, end: 0 },
      frequency: 400,
      quantity: 1,
      tint: 0xC4A46C,
    });
    particles.setDepth(0);
  }

  addVersionText(w, h) {
    this.add.text(w / 2, h - 30, 'v1.0 — An Educational Game', {
      fontFamily: 'Lora, Georgia, serif',
      fontSize: '12px',
      color: '#8B7355',
    }).setOrigin(0.5);
  }

  transitionTo(sceneKey) {
    this.cameras.main.fadeOut(500, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start(sceneKey);
    });
  }
}