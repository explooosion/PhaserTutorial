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
        this.body.gravity.y = 300;
        this.body.bounce.y = 0.7 + Math.random() * 0.2;
        this.body.collideWorldBounds = true
    }

    update() { }
}