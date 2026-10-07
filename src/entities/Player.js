import Phaser from 'phaser';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(true);
    this.setSize(22, 22);
    this.setOffset(13, 18);
    this.setDepth(10);

    this.speed = 175;
    this.direction = 'down';
    this.moving = false;

    // Shadow beneath player
    this.shadow = scene.add.image(x, y + 4, 'shadow').setDepth(9).setAlpha(0.6).setScale(0.9);
    this.shadow.setTint(0x000000);
  }

  update(cursors, wasd) {
    this.moving = false;
    let vx = 0;
    let vy = 0;

    if (cursors.left.isDown || wasd.left.isDown) {
      vx = -1;
      this.direction = 'left';
      this.moving = true;
    } else if (cursors.right.isDown || wasd.right.isDown) {
      vx = 1;
      this.direction = 'right';
      this.moving = true;
    }

    if (cursors.up.isDown || wasd.up.isDown) {
      vy = -1;
      this.direction = 'up';
      this.moving = true;
    } else if (cursors.down.isDown || wasd.down.isDown) {
      vy = 1;
      this.direction = 'down';
      this.moving = true;
    }

    if (vx !== 0 && vy !== 0) {
      const len = Math.sqrt(vx * vx + vy * vy);
      vx /= len;
      vy /= len;
    }

    this.setVelocity(vx * this.speed, vy * this.speed);

    // Walking bob
    if (this.moving) {
      this.shadow.y = this.y + 2 + Math.sin(this.scene.time.now * 0.01) * 1;
      this.y += Math.sin(this.scene.time.now * 0.012) * 0.3;
    } else {
      this.shadow.y = this.y + 2;
    }

    this.shadow.x = this.x;

    // Directional flip
    if (this.direction === 'left') {
      this.setFlipX(true);
    } else if (this.direction === 'right') {
      this.setFlipX(false);
    }
  }
}