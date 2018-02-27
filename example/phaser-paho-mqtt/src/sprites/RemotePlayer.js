import Phaser from 'phaser'

export default class extends Phaser.Sprite {
    constructor({
        game,
        x,
        y,
        asset,
        clientid
    }) {
        super(game, x, y, asset)

        this.clientid = clientid

        // console.log(this.game, this.x, this.y, this.asset, this.clientid)

        this.game.physics.arcade.enable(this)

        this.body.collideWorldBounds = true

        // this.player = this.game.add.sprite(x, y, 'enemy')

        this.animations.add('move', [0, 1, 2, 3, 4, 5, 6, 7], 20, true)
        this.animations.add('stop', [3], 20, true)

        this.anchor.setTo(0.5, 0.5)

        // This will force it to decelerate and limit its speed
        // this.player.body.drag.setTo(200, 200)
        // this.game.physics.enable(this, Phaser.Physics.ARCADE);
        // this.body.maxVelocity.setTo(400, 400)

    }

    update() {

    }

}