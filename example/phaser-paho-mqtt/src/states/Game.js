/* globals __DEV__ */
import Phaser from 'phaser'
import Mushroom from '../sprites/Mushroom'

import Client from '../paho/Client'

import io from 'socket.io-client'

export default class extends Phaser.State {
  init() {
    console.log('ini')
  }
  preload() {
    console.log('preload')
  }

  create() {

    // this.socket = io.connect()
    this.socket = null

    this.client = new Client('test')
    this.client.onConnect()

    // Resize our game world to be a 2000 x 2000 square
    this.game.world.setBounds(-5000, -5000, 10000, 10000)

    // Our tiled scrolling background
    this.land = this.game.add.tileSprite(0, 0, 1200, 800, 'earth')
    this.land.fixedToCamera = true

    // The base of our player
    var startX = Math.round(Math.random() * (1000) - 500)
    var startY = Math.round(Math.random() * (1000) - 500)
    this.player = this.game.add.sprite(startX, startY, 'dude')
    this.player.anchor.setTo(0.5, 0.5)
    this.player.animations.add('move', [0, 1, 2, 3, 4, 5, 6, 7], 20, true)
    this.player.animations.add('stop', [3], 20, true)

    // This will force it to decelerate and limit its speed
    // this.player.body.drag.setTo(200, 200)
    this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
    this.player.body.maxVelocity.setTo(400, 400)
    this.player.body.collideWorldBounds = true

    // Create some baddies to waste :)
    this.enemies = []

    this.player.bringToTop()

    this.game.camera.follow(this.player)
    this.game.camera.deadzone = new Phaser.Rectangle(150, 150, 500, 500)
    this.game.camera.focusOnXY(0, 0)

    this.cursors = this.game.input.keyboard.createCursorKeys()

    // this.setEventHandlers()

  }

  render() {
    if (__DEV__) {}
  }

  setStatusHandler() {

    // console.log(this.client.status)
  }

  setEventHandlers() {
    // Socket connection successful
    this.socket.on('connect', this.onSocketConnected)

    // Socket disconnection
    this.socket.on('disconnect', this.onSocketDisconnect)

    // New player message received
    this.socket.on('new player', this.onNewPlayer)

    // Player move message received
    this.socket.on('move player', this.onMovePlayer)

    // Player removed message received
    this.socket.on('remove player', this.onRemovePlayer)
  }

  onSocketConnected() {
    console.log('Connected to this.socket server')

    // Reset enemies on reconnect
    this.enemies.forEach((enemy) => {
      enemy.player.kill()
    })
    this.enemies = []

    // Send local player data to the game server
    this.socket.emit('new player', {
      x: this.player.x,
      y: this.player.y,
      angle: this.player.angle
    })
  }

  // Socket disconnected
  onSocketDisconnect() {
    console.log('Disconnected from this.socket server')
  }

  // New player
  onNewPlayer(data) {
    console.log('New player connected:', data.id)

    // Avoid possible duplicate players
    var duplicate = playerById(data.id)
    if (duplicate) {
      console.log('Duplicate player!')
      return
    }

    // Add new player to the remote players array
    this.enemies.push(new RemotePlayer(data.id, this.game, this.player, data.x, data.y, data.angle))
  }

  // Move player
  onMovePlayer(data) {
    var movePlayer = playerById(data.id)

    // Player not found
    if (!movePlayer) {
      console.log('Player not found: ', data.id)
      return
    }

    // Update player position
    movePlayer.player.x = data.x
    movePlayer.player.y = data.y
    movePlayer.player.angle = data.angle
  }

  // Remove player
  onRemovePlayer(data) {
    var removePlayer = playerById(data.id)

    // Player not found
    if (!removePlayer) {
      console.log('Player not found: ', data.id)
      return
    }

    removePlayer.player.kill()

    // Remove player from array
    this.enemies.splice(this.enemies.indexOf(removePlayer), 1)
  }

  update() {

    this.setStatusHandler()

    for (var i = 0; i < this.enemies.length; i++) {
      if (this.enemies[i].alive) {
        this.enemies[i].update()
        this.game.physics.arcade.collide(this.player, this.enemies[i].player)
      }
    }

    if (this.cursors.left.isDown) {
      this.player.angle -= 4
    } else if (this.cursors.right.isDown) {
      this.player.angle += 4
    }

    if (this.cursors.up.isDown) {
      // The speed we'll travel at
      this.currentSpeed = 300
    } else {
      if (this.currentSpeed > 0) {
        // this.currentSpeed -= 4
      }
    }

    // this.game.physics.arcade.velocityFromRotation(this.player.rotation, this.currentSpeed, this.player.body.velocity)

    if (this.currentSpeed > 0) {
      this.player.animations.play('move')
    } else {
      this.player.animations.play('stop')
    }

    this.land.tilePosition.x = -this.game.camera.x
    this.land.tilePosition.y = -this.game.camera.y

    if (this.game.input.activePointer.isDown) {
      if (this.game.physics.arcade.distanceToPointer(this.player) >= 10) {
        this.currentSpeed = 300

        this.newpoint = {
          x: this.game.input.worldX,
          y: this.game.input.worldY
        }

        this.game.physics.arcade.moveToXY(this.player, this.game.input.worldX, this.game.input.worldY, this.currentSpeed);
        this.player.rotation = this.game.physics.arcade.angleToPointer(this.player)

      }
    }

    if (this.newpoint) {
      const dis = Phaser.Math.distance(this.player.x, this.player.y, this.newpoint.x, this.newpoint.y).toFixed(2)

      if (dis < 3) {
        this.currentSpeed = 0
        this.player.body.velocity.setTo(0, 0);
        this.player.x = this.newpoint.x
        this.player.y = this.newpoint.y
        this.newpoint = null
      }
    }
    // this.socket.emit('move player', {
    //   x: this.player.x,
    //   y: this.player.y,
    //   angle: this.player.angle
    // })
  }

  // Find player by ID
  playerById(id) {
    for (var i = 0; i < this.enemies.length; i++) {
      if (this.enemies[i].player.name === id) {
        return this.enemies[i]
      }
    }

    return false
  }

}