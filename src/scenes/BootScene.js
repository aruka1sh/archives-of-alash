import Phaser from 'phaser';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    const w = this.cameras.main.width;
    const h = this.cameras.main.height;

    this.add.rectangle(w / 2, h / 2, w, h, 0x1a0a00);

    const title = this.add.text(w / 2, h / 2 - 60, 'ARCHIVES OF ALASH', {
      fontFamily: 'Cinzel, Georgia, serif',
      fontSize: '26px',
      color: '#C4A46C',
      letterSpacing: 6,
    }).setOrigin(0.5);

    const subtitle = this.add.text(w / 2, h / 2 - 10, 'Loading the archive...', {
      fontFamily: 'Lora, Georgia, serif',
      fontSize: '14px',
      color: '#A0896C',
      fontStyle: 'italic',
    }).setOrigin(0.5);

    const barW = 280;
    const barH = 6;
    const barX = (w - barW) / 2;
    const barY = h / 2 + 30;

    const barBg = this.add.graphics();
    barBg.fillStyle(0x2A1506);
    barBg.fillRoundedRect(barX, barY, barW, barH, 3);
    barBg.lineStyle(1, 0x5C3A1E);
    barBg.strokeRoundedRect(barX, barY, barW, barH, 3);

    const barFill = this.add.graphics();
    const ornament = this.add.graphics();
    this.drawLoadingOrnament(ornament, w, h);

    this.load.on('progress', (val) => {
      barFill.clear();
      barFill.fillStyle(0xC4A46C);
      barFill.fillRoundedRect(barX + 1, barY + 1, (barW - 2) * val, barH - 2, 2);
    });
  }

  drawLoadingOrnament(g, w, h) {
    g.lineStyle(1, 0xC4A46C, 0.12);
    const m = 60;
    for (let x = m; x < w - m; x += 80) {
      const y1 = h / 2 - 40;
      const y2 = h / 2 + 60;
      g.fillStyle(0xC4A46C, 0.06);
      g.fillCircle(x, y1, 2);
      g.fillCircle(x, y2, 2);
    }
  }

  create() {
    this.generateTextures();
    this.time.delayedCall(500, () => {
      this.cameras.main.fadeOut(400, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('MenuScene');
      });
    });
  }

  generateTextures() {
    this.createPlayerTexture();
    this.createNPCTextures();
    this.createFragmentTexture();
    this.createParticleTexture();
    this.createTreeTexture();
    this.createShadowTexture();
    this.createGlowTexture();
    this.createOrnamentTexture();
    this.createParchmentTexture();
  }

  createPlayerTexture() {
    const size = 48;
    const g = this.make.graphics({ add: false });

    // Shadow
    g.fillStyle(0x000000, 0.25);
    g.fillEllipse(size / 2, size - 4, 28, 10);

    // Body / robe (dark brown chapan)
    g.fillStyle(0x5C3A1E);
    g.fillRoundedRect(12, 16, 24, 26, 6);

    // Robe opening
    g.fillStyle(0x4A2A10);
    g.fillRect(20, 18, 8, 24);

    // Lighter inner
    g.fillStyle(0x8B7355);
    g.fillRect(22, 18, 4, 22);

    // Arms
    g.fillStyle(0x5C3A1E);
    g.fillRoundedRect(8, 18, 8, 14, 3);
    g.fillRoundedRect(32, 18, 8, 14, 3);

    // Head
    g.fillStyle(0xD4A574);
    g.fillCircle(24, 11, 7);

    // Hat (taqiya-style)
    g.fillStyle(0x3D2B1A);
    g.fillRoundedRect(18, 3, 12, 8, { tl: 5, tr: 5, bl: 0, br: 0 });

    // Hat band
    g.fillStyle(0xC4A46C, 0.6);
    g.fillRect(18, 8, 12, 2);

    // Satchel strap
    g.lineStyle(1.5, 0x4A3520);
    g.lineBetween(12, 16, 18, 34);

    // Satchel
    g.fillStyle(0x6B5335);
    g.fillRoundedRect(14, 30, 10, 8, 3);
    g.fillStyle(0x8B7355);
    g.fillRoundedRect(15, 31, 8, 6, 2);

    // Eyes
    g.fillStyle(0x1a0a00);
    g.fillCircle(22, 10, 1);
    g.fillCircle(26, 10, 1);

    // Legs / boots
    g.fillStyle(0x2A1506);
    g.fillRect(16, 40, 6, 6);
    g.fillRect(26, 40, 6, 6);

    g.generateTexture('player', size, size);
    g.destroy();
  }

  createNPCTextures() {
    this.createElderTexture();
    this.createTeacherTexture();
    this.createArchivistTexture();
  }

  createElderTexture() {
    const size = 48;
    const g = this.make.graphics({ add: false });

    // Shadow
    g.fillStyle(0x000000, 0.25);
    g.fillEllipse(size / 2, size - 4, 28, 10);

    // Body (gray-white robes)
    g.fillStyle(0x9B9490);
    g.fillRoundedRect(10, 14, 28, 28, 7);

    // Robe fold
    g.fillStyle(0x85807C);
    g.fillRect(18, 16, 12, 26);

    // Arms
    g.fillStyle(0x9B9490);
    g.fillRoundedRect(6, 16, 10, 16, 3);
    g.fillRoundedRect(32, 16, 10, 16, 3);

    // Head (older, lighter hair)
    g.fillStyle(0xE0C8A8);
    g.fillCircle(24, 9, 8);

    // White beard
    g.fillStyle(0xD0D0D0);
    g.fillRoundedRect(19, 12, 10, 6, 3);

    // Traditional hat (kalpak-style, taller)
    g.fillStyle(0xC4C0BC);
    g.fillRoundedRect(17, 0, 14, 11, { tl: 6, tr: 6, bl: 0, br: 0 });
    g.fillStyle(0xC4A46C, 0.5);
    g.fillRect(17, 8, 14, 2);

    // Walking stick
    g.lineStyle(1.5, 0x6B5335);
    g.lineBetween(36, 20, 42, 42);

    // Kind eyes
    g.fillStyle(0x2A1506);
    g.fillCircle(21, 8, 1.2);
    g.fillCircle(27, 8, 1.2);

    // Boots
    g.fillStyle(0x3D2B1A);
    g.fillRect(14, 40, 8, 6);
    g.fillRect(26, 40, 8, 6);

    g.generateTexture('npc_elder', size, size);
    g.destroy();
  }

  createTeacherTexture() {
    const size = 48;
    const g = this.make.graphics({ add: false });

    // Shadow
    g.fillStyle(0x000000, 0.25);
    g.fillEllipse(size / 2, size - 4, 28, 10);

    // Body (blue-tinted dark coat)
    g.fillStyle(0x3A4A5C);
    g.fillRoundedRect(11, 15, 26, 27, 7);

    // Vest / inner
    g.fillStyle(0x4A5E72);
    g.fillRect(19, 17, 10, 25);

    // Arms
    g.fillStyle(0x3A4A5C);
    g.fillRoundedRect(7, 17, 10, 16, 3);
    g.fillRoundedRect(31, 17, 10, 16, 3);

    // Head
    g.fillStyle(0xD4A574);
    g.fillCircle(24, 10, 7.5);

    // Glasses
    g.lineStyle(1, 0x8B7355);
    g.strokeCircle(21, 9, 3.5);
    g.strokeCircle(27, 9, 3.5);
    g.lineBetween(24.5, 9, 24.5, 9);

    // Hat (flat cap)
    g.fillStyle(0x2A3540);
    g.fillRoundedRect(17, 2, 14, 8, { tl: 4, tr: 4, bl: 0, br: 0 });
    g.fillStyle(0x3D4E60, 0.5);
    g.fillRect(17, 7, 14, 2);

    // Book under arm
    g.fillStyle(0x6B5335);
    g.fillRect(32, 24, 10, 8);
    g.fillStyle(0x8B7355);
    g.fillRect(33, 25, 8, 6);
    g.lineStyle(0.5, 0xC4A46C, 0.4);
    g.lineBetween(32, 28, 42, 28);

    // Eyes
    g.fillStyle(0x1a0a00);
    g.fillCircle(21, 9, 1);
    g.fillCircle(27, 9, 1);

    // Boots
    g.fillStyle(0x2A1506);
    g.fillRect(15, 40, 7, 6);
    g.fillRect(26, 40, 7, 6);

    g.generateTexture('npc_teacher', size, size);
    g.destroy();
  }

  createArchivistTexture() {
    const size = 48;
    const g = this.make.graphics({ add: false });

    // Shadow
    g.fillStyle(0x000000, 0.25);
    g.fillEllipse(size / 2, size - 4, 28, 10);

    // Body (warm brown formal vest)
    g.fillStyle(0x6B5335);
    g.fillRoundedRect(11, 14, 26, 28, 7);

    // Vest details
    g.fillStyle(0x7A6345);
    g.fillRect(19, 16, 10, 26);

    // Arms
    g.fillStyle(0x6B5335);
    g.fillRoundedRect(7, 16, 10, 16, 3);
    g.fillRoundedRect(31, 16, 10, 16, 3);

    // Head
    g.fillStyle(0xC4A070);
    g.fillCircle(24, 9, 7.5);

    // Spectacles
    g.lineStyle(1, 0xC4A46C);
    g.strokeCircle(21, 8, 3);
    g.strokeCircle(27, 8, 3);
    g.lineBetween(24, 8, 24, 8);

    // Formal hat
    g.fillStyle(0x3D2B1A);
    g.fillRoundedRect(16, 1, 16, 9, { tl: 5, tr: 5, bl: 0, br: 0 });
    g.fillStyle(0xC4A46C, 0.4);
    g.fillRect(16, 7, 16, 2);

    // Scroll in hand
    g.fillStyle(0xE8D5B0);
    g.fillRect(33, 22, 10, 4);
    g.fillStyle(0xD4C5A9);
    g.fillRect(34, 23, 8, 2);

    // Eyes
    g.fillStyle(0x1a0a00);
    g.fillCircle(21, 8, 1);
    g.fillCircle(27, 8, 1);

    // Boots
    g.fillStyle(0x2A1506);
    g.fillRect(15, 40, 7, 6);
    g.fillRect(26, 40, 7, 6);

    // Small key on belt
    g.fillStyle(0xC4A46C);
    g.fillCircle(24, 34, 1.5);

    g.generateTexture('npc_archivist', size, size);
    g.destroy();
  }

  createFragmentTexture() {
    const size = 36;
    const g = this.make.graphics({ add: false });

    // Parchment base
    g.fillStyle(0xE8D5B0);
    g.fillRoundedRect(4, 2, 28, 32, 4);

    // Aged edges
    g.fillStyle(0xD4C5A0, 0.5);
    g.fillRoundedRect(5, 3, 26, 4, 2);
    g.fillStyle(0xC8B890, 0.4);
    g.fillRoundedRect(5, 27, 26, 6, 2);

    // Fold lines
    g.lineStyle(0.5, 0xC4A46C, 0.3);
    g.lineBetween(10, 10, 28, 10);
    g.lineBetween(10, 20, 30, 20);

    // Text lines (simulated)
    g.lineStyle(0.8, 0xB0A080, 0.4);
    for (let y = 7; y < 25; y += 5) {
      g.lineBetween(8, y, 18, y);
    }
    for (let y = 7; y < 26; y += 5) {
      g.lineBetween(20, y, 28, y);
    }

    // Border
    g.lineStyle(1, 0xC4A46C, 0.7);
    g.strokeRoundedRect(4, 2, 28, 32, 4);

    // Ornament mark at top
    g.fillStyle(0xC4A46C, 0.5);
    g.fillCircle(18, 6, 2);

    // Torn edge effect
    g.fillStyle(0xE8D5B0, 0.3);
    g.fillTriangle(4, 18, 0, 14, 0, 22);
    g.fillTriangle(32, 12, 36, 8, 36, 16);

    g.generateTexture('fragment', size, size);
    g.destroy();
  }

  createParticleTexture() {
    const g = this.make.graphics({ add: false });
    g.fillStyle(0xFFFFFF);
    g.fillCircle(3, 3, 3);
    g.generateTexture('particle', 6, 6);
    g.destroy();
  }

  createTreeTexture() {
    const size = 52;
    const g = this.make.graphics({ add: false });

    // Shadow
    g.fillStyle(0x000000, 0.2);
    g.fillEllipse(size / 2, size - 2, 34, 10);

    // Trunk
    g.fillStyle(0x5C3A1E);
    g.fillRoundedRect(20, 24, 12, 26, 2);

    // Trunk texture
    g.fillStyle(0x4A2A10, 0.4);
    g.fillRect(24, 26, 2, 22);

    // Main canopy
    g.fillStyle(0x3D6B2E);
    g.fillCircle(26, 19, 16);
    g.fillStyle(0x4A8238);
    g.fillCircle(22, 17, 13);
    g.fillCircle(30, 18, 13);

    // Highlight layer
    g.fillStyle(0x5A9840, 0.5);
    g.fillCircle(24, 14, 9);
    g.fillCircle(30, 16, 8);

    // Darker depth
    g.fillStyle(0x2D5220, 0.4);
    g.fillCircle(20, 22, 8);

    g.generateTexture('tree', size, size);
    g.destroy();
  }

  createShadowTexture() {
    const g = this.make.graphics({ add: false });
    g.fillStyle(0x000000, 0.3);
    g.fillEllipse(20, 8, 36, 14);
    g.generateTexture('shadow', 40, 16);
    g.destroy();
  }

  createGlowTexture() {
    const g = this.make.graphics({ add: false });
    g.fillStyle(0xC4A46C, 0.3);
    g.fillCircle(20, 20, 20);
    g.fillStyle(0xC4A46C, 0.15);
    g.fillCircle(20, 20, 28);
    g.fillStyle(0xFFE8C0, 0.08);
    g.fillCircle(20, 20, 36);
    g.generateTexture('glow', 40, 40);
    g.destroy();
  }

  createOrnamentTexture() {
    const size = 28;
    const g = this.make.graphics({ add: false });

    // Diamond shape with inner detail - Kazakh ornament style
    g.fillStyle(0xC4A46C, 0.3);
    g.fillTriangle(size / 2, 2, 2, size / 2, size / 2, size - 2);
    g.fillTriangle(size / 2, 2, size - 2, size / 2, size / 2, size - 2);

    g.lineStyle(1, 0xC4A46C, 0.5);
    g.strokeTriangle(size / 2, 2, 2, size / 2, size / 2, size - 2);
    g.strokeTriangle(size / 2, 2, size - 2, size / 2, size / 2, size - 2);

    g.fillStyle(0xFFE8C0, 0.3);
    g.fillCircle(size / 2, size / 2, 3);

    g.generateTexture('ornament', size, size);
    g.destroy();
  }

  createParchmentTexture() {
    const size = 8;
    const g = this.make.graphics({ add: false });

    // Simple noise-like texture for parchment feel
    g.fillStyle(0xE8D5B0, 0.5);
    g.fillRect(0, 0, size, size);
    g.fillStyle(0xD4C5A9, 0.3);
    g.fillRect(0, 0, 2, 2);
    g.fillRect(4, 4, 2, 2);
    g.fillStyle(0xF0E0C0, 0.2);
    g.fillRect(2, 2, 2, 2);
    g.fillRect(6, 0, 2, 2);

    g.generateTexture('parchment_tile', size, size);
    g.destroy();
  }
}