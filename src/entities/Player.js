import Phaser from 'phaser';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(true);
    this.setSize(20, 20);
    this.setOffset(6, 6);
    this.setDepth(10);

    this.speed = 180;
    this.direction = 'down';
    this.moving = false;
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

    if (this.moving) {
      this.updateAnimation();
    } else {
      this.setFrame(0);
    }
  }

  updateAnimation() {
    const dirFrame = { up: 3, down: 0, left: 1, right: 2 };
    const base = dirFrame[this.direction] || 0;
    const frame = this.scene.time.now % 400 < 200 ? base : base;
    this.setFrame(frame);
  }
}