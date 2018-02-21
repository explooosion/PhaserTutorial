import Phaser from 'phaser'

export default class extends Phaser.Group {
    constructor({
        game,
        x,
        y,
        asset
    }) {
        super(game, x, y, asset)
        this.enableBody = true
        let ground = this.create(0, this.game.world.height - 64, 'ground')

        // 座標位置 (左右張數, 高度張數)
        ground.scale.setTo(2, 2)

        // 固定物體 (避免受重力影響)
        ground.body.immovable = true

        console.log(this);
    }

}