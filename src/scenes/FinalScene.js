import Phaser from 'phaser';

export default class FinalScene extends Phaser.Scene {
  constructor() {
    super({ key: 'FinalScene' });
  }

  init(data) {
    this.finalPoints = data.points || 0;
    this.finalRank = data.rank || 'CURIOUS RESEARCHER';
    this.finalEnding = data.ending || null;
  }

  create() {
    this.cameras.main.fadeIn(800, 0, 0, 0);
    const w = this.cameras.main.width;
    const h = this.cameras.main.height;

    this.createBackground(w, h);
    this.createOrnamentalFrame(w, h);
    this.createAmbientParticles(w, h);

    let delay = 600;

    // Main title
    const titleText = this.add.text(w / 2, h * 0.15, 'ARCHIVE RESTORED', {
      fontFamily: 'Cinzel, Georgia, serif',
      fontSize: '46px',
      color: '#C4A46C',
      stroke: '#2A1506',
      strokeThickness: 3,
      letterSpacing: 8,
    }).setOrigin(0.5).setAlpha(0).setScale(0.8);

    this.tweens.add({
      targets: titleText,
      alpha: 1,
      scaleX: 1,
      scaleY: 1,
      duration: 1400,
      delay: delay,
      ease: 'Cubic.easeOut',
    });

    delay += 1100;

    // Subtitle
    const subText = this.add.text(w / 2, h * 0.27, 'You preserved more than a manuscript.', {
      fontFamily: 'Lora, Georgia, serif',
      fontSize: '17px',
      color: '#D4C5A9',
      fontStyle: 'italic',
    }).setOrigin(0.5).setAlpha(0);

    this.tweens.add({
      targets: subText,
      alpha: 1,
      duration: 900,
      delay: delay,
    });

    delay += 700;

    const subText2 = this.add.text(w / 2, h * 0.33, 'You preserved a part of Kazakhstan\'s intellectual heritage.', {
      fontFamily: 'Lora, Georgia, serif',
      fontSize: '17px',
      color: '#D4C5A9',
      fontStyle: 'italic',
    }).setOrigin(0.5).setAlpha(0);

    this.tweens.add({
      targets: subText2,
      alpha: 1,
      duration: 900,
      delay: delay,
    });

    delay += 800;

    // Ending-specific title and text
    if (this.finalEnding) {
      const endingTitle = this.add.text(w / 2, h * 0.40, this.finalEnding.ending, {
        fontFamily: 'Cinzel, Georgia, serif',
        fontSize: '30px',
        color: '#FFD700',
        stroke: '#2A1506',
        strokeThickness: 2,
        letterSpacing: 4,
      }).setOrigin(0.5).setAlpha(0).setScale(0.8);

      this.tweens.add({
        targets: endingTitle,
        alpha: 1, scaleX: 1, scaleY: 1,
        duration: 1000, delay: delay, ease: 'Back.easeOut',
      });

      delay += 500;

      const endingText = this.add.text(w / 2, h * 0.47, this.finalEnding.endingText, {
        fontFamily: 'Lora, Georgia, serif',
        fontSize: '16px',
        color: '#E8D5B0',
        fontStyle: 'italic',
      }).setOrigin(0.5).setAlpha(0);

      this.tweens.add({
        targets: endingText,
        alpha: 1,
        duration: 800,
        delay: delay,
      });

      delay += 400;
    }

    delay += 1100;

    // Ornamental divider
    const divY = h * 0.44;
    const divG = this.add.graphics().setAlpha(0);
    divG.lineStyle(1, 0xC4A46C, 0.3);
    divG.lineBetween(w * 0.15, divY, w * 0.85, divY);

    // Center ornament
    divG.fillStyle(0xC4A46C, 0.4);
    divG.fillRect(w / 2 - 8, divY - 8, 16, 16);
    divG.lineStyle(1, 0xC4A46C, 0.5);
    divG.strokeRect(w / 2 - 8, divY - 8, 16, 16);
    divG.fillStyle(0xFFE8C0, 0.6);
    divG.fillCircle(w / 2, divY, 4);

    // Small diamonds on sides
    divG.fillStyle(0xC4A46C, 0.25);
    divG.fillRect(w * 0.15 - 6, divY - 6, 12, 12);
    divG.fillRect(w * 0.85 - 6, divY - 6, 12, 12);

    this.tweens.add({
      targets: divG,
      alpha: 1,
      duration: 800,
      delay: delay,
    });

    delay += 600;

    // Heritage Points
    const pointsLabel = this.add.text(w / 2, h * 0.52, 'HERITAGE POINTS', {
      fontFamily: 'Cinzel, Georgia, serif',
      fontSize: '14px',
      color: '#A0896C',
      letterSpacing: 4,
    }).setOrigin(0.5).setAlpha(0);

    this.tweens.add({
      targets: pointsLabel,
      alpha: 1,
      duration: 500,
      delay: delay,
    });

    delay += 400;

    const pointsValue = this.add.text(w / 2, h * 0.6, `${this.finalPoints}`, {
      fontFamily: 'Cinzel, Georgia, serif',
      fontSize: '64px',
      color: '#FFE8C0',
      stroke: '#2A1506',
      strokeThickness: 3,
    }).setOrigin(0.5).setAlpha(0).setScale(0.4);

    this.tweens.add({
      targets: pointsValue,
      alpha: 1,
      scaleX: 1,
      scaleY: 1,
      duration: 900,
      delay: delay,
      ease: 'Back.easeOut',
    });

    delay += 1000;

    // Rank
    const rankColor = this.getRankColor();
    const rankBadge = this.add.graphics().setAlpha(0);

    const badgeW = 280;
    const badgeH = 44;
    const badgeX = w / 2 - badgeW / 2;
    const badgeY = h * 0.7;

    rankBadge.fillStyle(0x1a0a00, 0.7);
    rankBadge.fillRoundedRect(badgeX, badgeY, badgeW, badgeH, 22);
    rankBadge.lineStyle(1.5, rankColor, 0.7);
    rankBadge.strokeRoundedRect(badgeX, badgeY, badgeW, badgeH, 22);

    const rankText = this.add.text(w / 2, badgeY + badgeH / 2, this.finalRank, {
      fontFamily: 'Cinzel, Georgia, serif',
      fontSize: '22px',
      color: rankColor,
      letterSpacing: 3,
      stroke: '#2A1506',
      strokeThickness: 2,
    }).setOrigin(0.5).setAlpha(0);

    this.tweens.add({
      targets: [rankBadge, rankText],
      alpha: 1,
      duration: 700,
      delay: delay,
    });

    // Subtle rank badge glow
    this.tweens.add({
      targets: rankBadge,
      alpha: { from: 0.7, to: 0.9 },
      duration: 2000,
      delay: delay + 700,
      yoyo: true,
      repeat: -1,
    });

    delay += 1200;

    // PLAY AGAIN button
    const btnW = 240;
    const btnH = 50;
    const btnX = w / 2;
    const btnY = h * 0.86;

    const btnShadow = this.add.graphics().setAlpha(0);
    btnShadow.fillStyle(0x000000, 0.3);
    btnShadow.fillRoundedRect(btnX - btnW / 2 + 3, btnY - btnH / 2 + 3, btnW, btnH, 8);

    const btnBg = this.add.graphics().setAlpha(0);
    btnBg.fillStyle(0x3D2B1A, 0.92);
    btnBg.fillRoundedRect(btnX - btnW / 2, btnY - btnH / 2, btnW, btnH, 8);
    btnBg.lineStyle(1.5, 0x8B7355, 0.7);
    btnBg.strokeRoundedRect(btnX - btnW / 2, btnY - btnH / 2, btnW, btnH, 8);
    btnBg.lineStyle(1, 0xC4A46C, 0.2);
    btnBg.strokeRoundedRect(btnX - btnW / 2 + 3, btnY - btnH / 2 + 3, btnW - 6, btnH - 6, 6);

    const btnText = this.add.text(btnX, btnY, 'PLAY AGAIN', {
      fontFamily: 'Cinzel, Georgia, serif',
      fontSize: '18px',
      color: '#E8D5B0',
      letterSpacing: 3,
    }).setOrigin(0.5).setAlpha(0);

    const btnDots = this.add.graphics().setAlpha(0);
    btnDots.fillStyle(0xC4A46C, 0.5);
    btnDots.fillCircle(btnX - btnW / 2 + 12, btnY, 4);
    btnDots.fillCircle(btnX + btnW / 2 - 12, btnY, 4);

    const allBtn = [btnShadow, btnBg, btnDots, btnText];

    const hitArea = this.add.rectangle(btnX, btnY, btnW, btnH, 0x000000, 0.01)
      .setInteractive({ useHandCursor: true });

    this.tweens.add({
      targets: allBtn,
      alpha: 1,
      duration: 700,
      delay: delay,
    });

    hitArea.on('pointerover', () => {
      btnBg.clear();
      btnBg.fillStyle(0x5C3A1E, 0.95);
      btnBg.fillRoundedRect(btnX - btnW / 2, btnY - btnH / 2, btnW, btnH, 8);
      btnBg.lineStyle(2, 0xC4A46C, 0.9);
      btnBg.strokeRoundedRect(btnX - btnW / 2, btnY - btnH / 2, btnW, btnH, 8);
      btnText.setColor('#FFE8C0');
    });
    hitArea.on('pointerout', () => {
      btnBg.clear();
      btnBg.fillStyle(0x3D2B1A, 0.92);
      btnBg.fillRoundedRect(btnX - btnW / 2, btnY - btnH / 2, btnW, btnH, 8);
      btnBg.lineStyle(1.5, 0x8B7355, 0.7);
      btnBg.strokeRoundedRect(btnX - btnW / 2, btnY - btnH / 2, btnW, btnH, 8);
      btnText.setColor('#E8D5B0');
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

  createBackground(w, h) {
    const g = this.add.graphics();

    g.fillStyle(0x120808);
    g.fillRect(0, 0, w, h);

    // Radial glow layers
    for (let i = 0; i < 4; i++) {
      g.fillStyle(0xC4A46C, 0.03 - i * 0.005);
      g.fillCircle(w / 2, h / 2, 140 + i * 60);
    }

    // Subtle texture
    for (let i = 0; i < 30; i++) {
      g.fillStyle(0xD4C5A9, Phaser.Math.FloatBetween(0.01, 0.03));
      g.fillRect(
        Phaser.Math.Between(0, w),
        Phaser.Math.Between(0, h),
        Phaser.Math.Between(30, 80),
        1
      );
    }
  }

  createOrnamentalFrame(w, h) {
    const g = this.add.graphics();
    const m = 35;

    g.lineStyle(1, 0xC4A46C, 0.15);
    g.strokeRect(m, m, w - m * 2, h - m * 2);

    g.lineStyle(1, 0x8B7355, 0.1);
    g.strokeRect(m + 10, m + 10, w - (m + 10) * 2, h - (m + 10) * 2);

    // Corner diamonds
    const corners = [[m, m], [w - m, m], [m, h - m], [w - m, h - m]];
    corners.forEach(([cx, cy]) => {
      const size = 14;
      g.lineStyle(1, 0xC4A46C, 0.3);
      g.strokeRect(cx - size / 2, cy - size / 2, size, size);
      g.fillStyle(0xC4A46C, 0.1);
      g.fillRect(cx - size / 2 + 1, cy - size / 2 + 1, size - 2, size - 2);
      g.fillStyle(0xC4A46C, 0.25);
      g.fillCircle(cx, cy, 2);
    });
  }

  createAmbientParticles(w, h) {
    this.add.particles(0, 0, 'particle', {
      x: { min: 0, max: w },
      y: { min: 0, max: h },
      lifespan: { min: 4000, max: 8000 },
      speed: { min: 3, max: 12 },
      scale: { start: 0.6, end: 0 },
      alpha: { start: 0.15, end: 0 },
      frequency: 350,
      quantity: 1,
      tint: 0xC4A46C,
    }).setDepth(0);

    this.add.particles(0, 0, 'particle', {
      x: { min: 0, max: w },
      y: { min: 0, max: h },
      lifespan: { min: 5000, max: 10000 },
      speed: { min: 4, max: 18 },
      scale: { start: 0.5, end: 0 },
      alpha: { start: 0.2, end: 0 },
      frequency: 700,
      quantity: 1,
      tint: 0xFFE8C0,
    }).setDepth(0);
  }
}