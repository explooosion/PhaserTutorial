import Phaser from 'phaser'

export default class extends Phaser.Sprite {
    constructor({
        game,
        x,
        y,
        asset
    }) {
        super(game, x, y, asset)

        this.game.physics.arcade.enable(this)
        this.body.bounce.y = 0.2
        this.body.gravity.y = 300
        this.body.collideWorldBounds = true
        this.animations.add('left', [0, 1, 2, 3], 10, true)
        this.animations.add('right', [5, 6, 7, 8], 10, true)

        this.cursors = game.input.keyboard.createCursorKeys()
    }

    update() {

        this.body.velocity.x = 0;

        if (this.cursors.left.isDown) {
            this.body.velocity.x = -150;
            this.animations.play('left');
        } else if (this.cursors.right.isDown) {
            this.body.velocity.x = 150;
            this.animations.play('right');
        } else {
            this.animations.stop();
            this.frame = 4;
        }

        if (this.cursors.up.isDown && this.body.touching.down) {
            this.body.velocity.y = -350;
        }

    }
}