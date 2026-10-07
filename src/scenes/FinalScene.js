import Phaser from 'phaser';

export default class FinalScene extends Phaser.Scene {
  constructor() {
    super({ key: 'FinalScene' });
  }

  init(data) {
    this.finalPoints = data.points || 0;
    this.finalRank = data.rank || 'CURIOUS RESEARCHER';
  }

  create() {
    this.cameras.main.fadeIn(800, 0, 0, 0);
    const w = this.cameras.main.width;
    const h = this.cameras.main.height;

    this.add.rectangle(w / 2, h / 2, w, h, 0x1a0a00);

    this.createAmbientParticles(w, h);

    let delay = 600;

    const line1 = this.add.text(w / 2, h * 0.18, 'ARCHIVE RESTORED', {
      fontFamily: 'Cinzel, Georgia, serif',
      fontSize: '44px',
      color: '#C4A46C',
      stroke: '#2A1506',
      strokeThickness: 2,
    }).setOrigin(0.5).setAlpha(0).setScale(0.8);

    this.tweens.add({
      targets: line1,
      alpha: 1,
      scaleX: 1,
      scaleY: 1,
      duration: 1200,
      delay: delay,
      ease: 'Cubic.easeOut',
    });

    delay += 1000;

    const line2 = this.add.text(w / 2, h * 0.32, 'You preserved more than a manuscript.', {
      fontFamily: 'Lora, Georgia, serif',
      fontSize: '18px',
      color: '#D4C5A9',
    }).setOrigin(0.5).setAlpha(0);

    this.tweens.add({
      targets: line2,
      alpha: 1,
      duration: 800,
      delay: delay,
    });

    delay += 600;

    const line3 = this.add.text(w / 2, h * 0.38, 'You preserved a part of Kazakhstan\'s intellectual heritage.', {
      fontFamily: 'Lora, Georgia, serif',
      fontSize: '18px',
      color: '#D4C5A9',
      fontStyle: 'italic',
    }).setOrigin(0.5).setAlpha(0);

    this.tweens.add({
      targets: line3,
      alpha: 1,
      duration: 800,
      delay: delay,
    });

    delay += 1000;

    const dividerY = h * 0.50;
    const divider = this.add.graphics().setAlpha(0);
    divider.lineStyle(1, 0xC4A46C, 0.4);
    divider.lineBetween(w * 0.2, dividerY, w * 0.8, dividerY);

    this.tweens.add({
      targets: divider,
      alpha: 1,
      duration: 600,
      delay: delay,
    });

    delay += 400;

    const pointsLabel = this.add.text(w / 2, h * 0.57, 'HERITAGE POINTS', {
      fontFamily: 'Cinzel, Georgia, serif',
      fontSize: '16px',
      color: '#A0896C',
    }).setOrigin(0.5).setAlpha(0);

    this.tweens.add({
      targets: pointsLabel,
      alpha: 1,
      duration: 500,
      delay: delay,
    });

    delay += 300;

    const pointsValue = this.add.text(w / 2, h * 0.64, `${this.finalPoints}`, {
      fontFamily: 'Cinzel, Georgia, serif',
      fontSize: '56px',
      color: '#FFE8C0',
      stroke: '#2A1506',
      strokeThickness: 3,
    }).setOrigin(0.5).setAlpha(0).setScale(0.5);

    this.tweens.add({
      targets: pointsValue,
      alpha: 1,
      scaleX: 1,
      scaleY: 1,
      duration: 800,
      delay: delay,
      ease: 'Back.easeOut',
    });

    delay += 800;

    const rankColor = this.getRankColor();
    const rankText = this.add.text(w / 2, h * 0.75, this.finalRank, {
      fontFamily: 'Cinzel, Georgia, serif',
      fontSize: '28px',
      color: rankColor,
      stroke: '#2A1506',
      strokeThickness: 2,
    }).setOrigin(0.5).setAlpha(0);

    this.tweens.add({
      targets: rankText,
      alpha: 1,
      duration: 600,
      delay: delay,
    });

    this.tweens.add({
      targets: rankText,
      scaleX: { from: 1, to: 1.03 },
      scaleY: { from: 1, to: 1.03 },
      duration: 1500,
      delay: delay + 600,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    delay += 1000;

    const btnW = 240;
    const btnH = 50;
    const btnX = w / 2;
    const btnY = h * 0.88;

    const btnBg = this.add.graphics().setAlpha(0);
    btnBg.fillStyle(0x3D2B1A, 0.9);
    btnBg.fillRoundedRect(btnX - btnW / 2, btnY - btnH / 2, btnW, btnH, 8);
    btnBg.lineStyle(2, 0xC4A46C, 0.8);
    btnBg.strokeRoundedRect(btnX - btnW / 2, btnY - btnH / 2, btnW, btnH, 8);

    const btnText = this.add.text(btnX, btnY, 'PLAY AGAIN', {
      fontFamily: 'Cinzel, Georgia, serif',
      fontSize: '18px',
      color: '#E8D5B0',
    }).setOrigin(0.5).setAlpha(0);

    const hitArea = this.add.rectangle(btnX, btnY, btnW, btnH, 0x000000, 0)
      .setInteractive({ useHandCursor: true });

    this.tweens.add({
      targets: [btnBg, btnText],
      alpha: 1,
      duration: 600,
      delay: delay,
    });

    hitArea.on('pointerover', () => {
      btnText.setColor('#FFE8C0');
      btnText.setScale(1.03);
    });
    hitArea.on('pointerout', () => {
      btnText.setColor('#E8D5B0');
      btnText.setScale(1);
    });
    hitArea.on('pointerdown', () => {
      this.cameras.main.fadeOut(600, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('MenuScene');
      });
    });
  }

  getRankColor() {
    if (this.finalRank === 'HERITAGE KEEPER') return '#FFD700';
    if (this.finalRank === 'ARCHIVE SCHOLAR') return '#C4A46C';
    return '#A0896C';
  }

  createAmbientParticles(w, h) {
    this.add.particles(0, 0, 'particle', {
      x: { min: 0, max: w },
      y: { min: 0, max: h },
      lifespan: { min: 4000, max: 7000 },
      speed: { min: 3, max: 12 },
      scale: { start: 0.8, end: 0 },
      alpha: { start: 0.2, end: 0 },
      frequency: 300,
      quantity: 1,
      tint: 0xC4A46C,
    }).setDepth(0);
  }
}