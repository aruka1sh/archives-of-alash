import Phaser from 'phaser';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    const w = this.cameras.main.width;
    const h = this.cameras.main.height;

    const barW = 300;
    const barH = 20;
    const barX = (w - barW) / 2;
    const barY = h / 2 + 40;

    const bg = this.add.rectangle(w / 2, h / 2, w, h, 0x1a0a00);

    const title = this.add.text(w / 2, h / 2 - 80, 'ARCHIVES OF ALASH', {
      fontFamily: 'Cinzel, Georgia, serif',
      fontSize: '28px',
      color: '#C4A46C',
    }).setOrigin(0.5);

    const subtitle = this.add.text(w / 2, h / 2 - 40, 'Loading...', {
      fontFamily: 'Lora, Georgia, serif',
      fontSize: '16px',
      color: '#A0896C',
    }).setOrigin(0.5);

    const barBg = this.add.rectangle(w / 2, barY + barH / 2, barW, barH, 0x2A1506);
    barBg.setStrokeStyle(1, 0x8B7355);

    const bar = this.add.rectangle(barX + 2, barY + 2, 0, barH - 4, 0xC4A46C);
    bar.setOrigin(0, 0);

    this.load.on('progress', (val) => {
      bar.width = (barW - 4) * val;
    });

    this.load.on('complete', () => {
      subtitle.setText('Preparing the archive...');
    });
  }

  create() {
    this.generateTextures();
    this.time.delayedCall(600, () => {
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
  }

  createPlayerTexture() {
    const g = this.make.graphics({ add: false });
    g.fillStyle(0xC4A46C);
    g.fillCircle(16, 14, 10);
    g.fillStyle(0x8B6914);
    g.fillCircle(16, 8, 5);
    g.fillStyle(0x2A1506);
    g.fillCircle(17, 7, 2);
    g.generateTexture('player', 32, 32);
    g.destroy();
  }

  createNPCTextures() {
    this.createNPCTexture('npc_elder', 0xA0A0A0, 0x707070);
    this.createNPCTexture('npc_teacher', 0x7B9EC2, 0x4A6E8A);
    this.createNPCTexture('npc_archivist', 0xB89870, 0x8B7355);
  }

  createNPCTexture(key, bodyColor, headColor) {
    const g = this.make.graphics({ add: false });
    g.fillStyle(bodyColor);
    g.fillCircle(16, 14, 10);
    g.fillStyle(headColor);
    g.fillCircle(16, 8, 5);
    g.fillStyle(0x2A1506);
    g.fillCircle(17, 7, 2);
    g.generateTexture(key, 32, 32);
    g.destroy();
  }

  createFragmentTexture() {
    const g = this.make.graphics({ add: false });
    g.fillStyle(0xE8D5B0);
    g.fillRect(2, 2, 24, 20);
    g.fillStyle(0xD4C5A9);
    g.fillRect(4, 4, 20, 16);
    g.lineStyle(1, 0xC4A46C, 0.8);
    g.strokeRect(2, 2, 24, 20);
    g.generateTexture('fragment', 28, 24);
    g.destroy();
  }

  createParticleTexture() {
    const g = this.make.graphics({ add: false });
    g.fillStyle(0xFFFFFF);
    g.fillCircle(2, 2, 2);
    g.generateTexture('particle', 4, 4);
    g.destroy();
  }

  createTreeTexture() {
    const g = this.make.graphics({ add: false });
    g.fillStyle(0x5C3A1E);
    g.fillRect(16, 30, 8, 22);
    g.fillStyle(0x3D6B2E);
    g.fillCircle(20, 22, 18);
    g.fillStyle(0x4A8238);
    g.fillCircle(16, 18, 12);
    g.fillCircle(24, 20, 12);
    g.generateTexture('tree', 40, 56);
    g.destroy();
  }
}