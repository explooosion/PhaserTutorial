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
        
        this.isMoving = false

        this.game.physics.arcade.enable(this)

        this.iscon = false
        // 沒有重量
        // this.body.bounce.y = 0.1
        // this.body.gravity.y = 400

        // 限制於世界邊界
        this.body.collideWorldBounds = true

        // 移動動畫
        this.animations.add('down', [0, 1, 2, 3], 10, true)
        this.animations.add('left', [4, 5, 6, 7], 10, true)
        this.animations.add('right', [8, 9, 10, 11], 10, true)
        this.animations.add('up', [12, 13, 14, 15], 10, true)

        // this.cursors = this.game.input.keyboard.createCursorKeys()

        // this.last = {}

    }

    update() {

        // only move when you click
        // if (this.game.input.mousePointer.isDown) {

        //     this.game.physics.arcade.moveToPointer(this, 200);
        //     // this.game.physics.arcade.moveToXY(this, this.game.input.x, this.game.input.y, 200);
        //     // if it 's overlapping the mouse, don't move any more
        //     if (Phaser.Rectangle.contains(this.body, this.game.input.x, this.game.input.y)) {
        //         this.body.velocity.setTo(0, 0);
        //     }
        // } else {
        //     if (Phaser.Rectangle.contains(this.body, this.last.x, this.last.y) ||
        //         this.getBounds().contains(this.last.x, this.last.y)) {
        //         this.body.velocity.setTo(0, 0);
        //     }
        // }

        // Event By keyboard 
        //
        // if (this.isWalk) {
        //     this.body.velocity.x = 0
        //     this.body.velocity.y = 0
        // }

        // if (this.cursors.down.isDown) {
        //     this.body.velocity.y = +200
        //     this.animations.play('down')
        //     this.game.camera.follow(this)
        //     console.log(`player: ${this.x} ${this.y}`)
        //     console.log(`camera: ${this.game.camera.x} ${this.game.camera.y}`)
        // } else if (this.cursors.left.isDown) {
        //     this.body.velocity.x = -200
        //     this.animations.play('left')
        //     this.game.camera.follow(this)
        //     console.log(`player: ${this.x} ${this.y}`)
        //     console.log(`camera: ${this.game.camera.x} ${this.game.camera.y}`)
        // } else if (this.cursors.right.isDown) {
        //     this.body.velocity.x = 200
        //     this.animations.play('right')
        //     this.game.camera.follow(this)
        //     console.log(`player: ${this.x} ${this.y}`)
        //     console.log(`camera: ${this.game.camera.x} ${this.game.camera.y}`)
        // } else if (this.cursors.up.isDown) {
        //     this.body.velocity.y = -200
        //     this.animations.play('up')
        //     this.game.camera.follow(this)
        //     console.log(`player: ${this.x} ${this.y}`)
        //     console.log(`camera: ${this.game.camera.x} ${this.game.camera.y}`)
        // } else {
        //     this.animations.stop()
        // }

    }

}