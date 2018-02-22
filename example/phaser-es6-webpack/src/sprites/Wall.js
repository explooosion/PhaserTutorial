import Phaser from 'phaser'

export default class extends Phaser.Sprite {
    constructor({
        game,
        x,
        y,
        asset
    }) {
        super(game, x, y, asset)

        // // 固定物體 (避免受重力影響)
        this.game.physics.arcade.enable(this)
        this.body.immovable = true
    }

    update() {}
}