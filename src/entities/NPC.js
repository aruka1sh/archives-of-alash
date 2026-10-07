import Phaser from 'phaser';

export default class NPC extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, config) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this, true);

    this.setSize(24, 24);
    this.setOffset(4, 4);
    this.setDepth(9);

    this.npcId = config.id;
    this.npcName = config.name;
    this.dialogKey = config.dialogKey;

    this.nameLabel = scene.add.text(x, y - 28, config.name, {
      fontFamily: 'Lora, Georgia, serif',
      fontSize: '12px',
      color: '#E8D5B0',
      stroke: '#2A1506',
      strokeThickness: 3,
      align: 'center'
    }).setOrigin(0.5, 1).setDepth(11);

    this.addPulseEffect(scene, x, y);
  }

  addPulseEffect(scene, x, y) {
    if (!scene) return;
    const indicator = scene.add.circle(x, y - 22, 4, 0xE8D5B0, 0.8).setDepth(11);
    scene.tweens.add({
      targets: indicator,
      alpha: { from: 0.8, to: 0.2 },
      scaleX: { from: 1, to: 1.5 },
      scaleY: { from: 1, to: 1.5 },
      duration: 900,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    this.indicator = indicator;
    this.nameLabelObject = this.nameLabel;
  }

  getName() {
    return this.npcName;
  }

  getDialogKey() {
    return this.dialogKey;
  }
}