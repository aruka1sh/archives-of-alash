import Phaser from 'phaser';

export default class IntroScene extends Phaser.Scene {
  constructor() {
    super({ key: 'IntroScene' });
  }

  create() {
    this.cameras.main.fadeIn(600, 0, 0, 0);
    const w = this.cameras.main.width;
    const h = this.cameras.main.height;

    this.add.rectangle(w / 2, h / 2, w, h, 0x1a0a00);

    const lines = [
      '',
      'Semey, early 20th century.',
      '',
      'The ideas and writings of Abai Kunanbaiuly',
      'have inspired a generation of Kazakh intellectuals.',
      '',
      'The Alash movement dreams of a modern,',
      'educated nation — proud of its heritage',
      'and reaching toward the future.',
      '',
      'But paper is fragile.',
      'Handwritten manuscripts can easily be lost',
      'to time, weather, and neglect.',
      '',
      'You are a young scholar.',
      'You have been asked to help preserve',
      'an important manuscript',
      'before it disappears forever.',
      ''
    ];

    const storyText = this.add.text(w / 2, h / 2 - 30, '', {
      fontFamily: 'Lora, Georgia, serif',
      fontSize: '17px',
      color: '#D4C5A9',
      lineSpacing: 6,
      align: 'center',
    }).setOrigin(0.5).setAlpha(0);

    let charIndex = 0;
    const fullText = lines.join('\n');
    const displayText = [];

    this.typewriterTimeline = this.time.addEvent({
      delay: 25,
      callback: () => {
        displayText.push(fullText[charIndex]);
        storyText.setText(displayText.join(''));
        charIndex++;

        if (charIndex >= fullText.length) {
          this.typewriterTimeline.destroy();
          this.showBeginButton(w, h);
        }
      },
      repeat: fullText.length - 1,
    });

    this.tweens.add({
      targets: storyText,
      alpha: 1,
      duration: 400,
    });
  }

  showBeginButton(w, h) {
    const btnW = 260;
    const btnH = 50;
    const btnX = w / 2;
    const btnY = h * 0.78;

    const bg = this.add.graphics();
    bg.fillStyle(0x3D2B1A, 0.9);
    bg.fillRoundedRect(btnX - btnW / 2, btnY - btnH / 2, btnW, btnH, 8);
    bg.lineStyle(2, 0xC4A46C, 0.8);
    bg.strokeRoundedRect(btnX - btnW / 2, btnY - btnH / 2, btnW, btnH, 8);

    const text = this.add.text(btnX, btnY, 'BEGIN THE QUEST', {
      fontFamily: 'Cinzel, Georgia, serif',
      fontSize: '20px',
      color: '#E8D5B0',
    }).setOrigin(0.5);

    bg.setAlpha(0);
    text.setAlpha(0);

    const hitArea = this.add.rectangle(btnX, btnY, btnW, btnH, 0x000000, 0)
      .setInteractive({ useHandCursor: true });

    this.tweens.add({
      targets: [bg, text],
      alpha: 1,
      duration: 600,
      ease: 'Cubic.easeOut',
      delay: 300,
    });

    hitArea.on('pointerover', () => {
      text.setColor('#FFE8C0');
      text.setScale(1.03);
    });
    hitArea.on('pointerout', () => {
      text.setColor('#E8D5B0');
      text.setScale(1);
    });
    hitArea.on('pointerdown', () => {
      this.cameras.main.fadeOut(600, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('GameScene');
      });
    });
  }
}