import Phaser from 'phaser'

export default class extends Phaser.Sprite {
    constructor({
        game,
        x,
        y,
        asset,
        name
    }) {
        super(game, x, y, asset)

        this.name = name

        // this.player = this.game.add.sprite(x, y, 'enemy')

        this.animations.add('move', [0, 1, 2, 3, 4, 5, 6, 7], 20, true)
        this.animations.add('stop', [3], 20, true)

        this.anchor.setTo(0.5, 0.5)

        // This will force it to decelerate and limit its speed
        // this.player.body.drag.setTo(200, 200)
        this.game.physics.enable(this, Phaser.Physics.ARCADE);
        this.body.maxVelocity.setTo(400, 400)
        this.body.collideWorldBounds = true

    }

    update() {

    }

}