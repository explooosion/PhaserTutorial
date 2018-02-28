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
        this.game.add.existing(this)
        this.counter = 0
    }

    update() {
        this.counter += 1
        if (this.counter > 50) {
            this.kill()
        }
    }
}