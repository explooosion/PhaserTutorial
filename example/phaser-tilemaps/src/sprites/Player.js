import Phaser from 'phaser'

export default class extends Phaser.Sprite {
    constructor({ game, x, y, asset }) {
        super(game, x, y, asset)

        this.game.physics.arcade.enable(this)
        this.body.collideWorldBounds = true
        this.cursors = this.game.input.keyboard.createCursorKeys()
    }

    update() {
        if (this.cursors.down.isDown) {
            this.body.velocity.y = +100
        } else if (this.cursors.left.isDown) {
            this.body.velocity.x = -100
        } else if (this.cursors.right.isDown) {
            this.body.velocity.x = 100
        } else if (this.cursors.up.isDown) {
            this.body.velocity.y = -100
        } else {
            this.body.velocity.x = 0
            this.body.velocity.y = 0
        }
    }
}
