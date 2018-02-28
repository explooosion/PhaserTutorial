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
        this.currentSpeed = 0
        this.game.physics.arcade.enable(this)
        this.body.collideWorldBounds = true

        // 移動動畫
        this.anchor.setTo(0.5, 0.5)
        this.animations.add('move', [0, 1, 2, 3, 4, 5, 6, 7], 20, true)
        this.animations.add('stop', [3], 20, true)

        this.game.physics.enable(this, Phaser.Physics.ARCADE);
        this.body.maxVelocity.setTo(400, 400)

        // 被撞時候不能移動
        this.body.immovable = true
        // this.bringToTop()

        // this.game.camera.follow(this.player)
        // this.game.camera.follow(this, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
        // this.game.camera.deadzone = new Phaser.Rectangle(150, 150, 500, 500)
        // this.game.camera.focusOnXY(0, 0)

        this.game.add.existing(this)
    }

    update() {
        if (this.currentSpeed > 0) {
            this.animations.play('move')
        } else {
            this.animations.play('stop')
        }
        // 停止事件
        if (this.newpoint) {
            const dis = Phaser.Math.distance(this.x, this.y, this.newpoint.x, this.newpoint.y).toFixed(2)
            if (dis < 3) {
                this.currentSpeed = 0
                this.body.velocity.setTo(0, 0);
                this.x = this.newpoint.x
                this.y = this.newpoint.y
                this.newpoint = null
            }
        }
    }

    /**
     *  取得新位置
     * @param {object} payload 
     */
    move(payload) {
        /** Test Server */
        if (this.test === undefined) {
            /** Add Player */
            this.test = {
                x: 0,
                y: 0
            }
            this.test.x = payload.x
            this.test.y = payload.y
        } else {
            this.test.x = this.test.x - Math.floor((Math.random() * 50) + 1);
            this.test.y = this.test.y - Math.floor((Math.random() * 50) + 1);
        }
        payload = this.test

        if (this.game.physics.arcade.distanceToXY(this, payload.x, payload.y) >= 10) {
            this.currentSpeed = 300
            this.newpoint = {
                x: payload.x,
                y: payload.y
            }
            this.game.physics.arcade.moveToXY(this, payload.x, payload.y, this.currentSpeed);
            this.rotation = this.game.physics.arcade.angleToXY(this, payload.x, payload.y)
        }
    }

}