import Phaser from 'phaser'

export default class extends Phaser.Sprite {
    constructor({
        game,
        x,
        y,
        asset
    }) {
        super(game, x, y, asset)

        // // 座標位置 (左右張數, 高度張數)
        // this.setTo(2, 2)

        // // 固定物體 (避免受重力影響)
        // this.body.immovable = true
    }

    update() {}
}