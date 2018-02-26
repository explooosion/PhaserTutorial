/* globals __DEV__ */
import Phaser from 'phaser'

import Client from '../paho/Client'
import Message from '../paho/Message';

import io from 'socket.io-client'

import {
  bulidMessageObjects
} from '../../utils/paho'

import {
  movePositionFix,
} from '../../utils/phaser'

import RemotePlayer from '../sprites/RemotePlayer'
import Player from '../sprites/Player'

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

    this.client = new Client('abcdef')
    this.client.onConnect()
    this.client.client.onMessageArrived = this.setTopicHandler.bind(this)

    // Keep running on losing focus
    this.game.stage.disableVisibilityChange = true

    // Resize our game world to be a 2000 x 2000 square
    this.game.world.setBounds(-5000, -5000, 10000, 10000)

    // Our tiled scrolling background
    this.land = this.game.add.tileSprite(0, 0, 1920, 1080, 'earth')
    this.land.fixedToCamera = true

    // // The base of our player
    // var startX = Math.round(Math.random() * (1000) - 500)
    // var startY = Math.round(Math.random() * (1000) - 500)
    // this.player = this.game.add.sprite(startX, startY, 'dude')
    // this.player.anchor.setTo(0.5, 0.5)
    // this.player.animations.add('move', [0, 1, 2, 3, 4, 5, 6, 7], 20, true)
    // this.player.animations.add('stop', [3], 20, true)

    // // This will force it to decelerate and limit its speed
    // // this.player.body.drag.setTo(200, 200)
    // this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
    // this.player.body.maxVelocity.setTo(400, 400)
    // this.player.body.collideWorldBounds = true

    // // Create some baddies to waste :)

    // this.player.bringToTop()

    this.enemies = []

    this.cursors = this.game.input.keyboard.createCursorKeys()

  }

  render() {
    if (__DEV__) {}
  }

  setTopicHandler(receive) {
    this.client.receive = bulidMessageObjects(receive)
    // console.log(this.client.receive.topic, this.client.receive.payload)

    /** Server */
    // this.client.on('room', this.onEventRoom.bind(this.client))

    /** Client */
    this.client.on(`join/${this.client.master}`, this.onJoinRoom.bind(this.client))
    this.client.on(`game/${this.client.master}/${this.client.player}`, this.onNewStatus.bind(this))
  }

  onEventRoom(payload) {
    switch (payload.action) {
      case 'create':
        console.log('server: player create room')
        break
      case 'join':
        console.log('server: player join room')
        // Reset enemies on reconnect
        this.enemies.forEach((enemy) => {
          enemy.player.kill()
        })
        this.enemies = []
        this.client.send(Message.NewPlayer(payload.key))
        break
      default:
        console.log('server: no room result')
        break
    }
  }

  onJoinRoom(payload) {
    switch (payload.result) {
      case 'success':
        this.player = payload.id
        this.map = payload.map
        console.log('client: join success')
        this.client.unsubscribe(`join/${this.master}`)
        this.client.subscribe(`game/${this.master}/${this.player}`)
        this.client.subscribe(`game/${this.master}`)
        break
      case 'fail':
        console.log('client: join fail')
        break
      default:
        console.log('client: no join result')
        break
    }
  }

  onNewStatus(payload) {
    this.onPlayerStatus(payload)
    this.onEnemiesStatus(payload.others)
  }

  onPlayerStatus(payload) {
    if (this.player === undefined) {
      // The base of our player
      this.player = this.game.add.sprite(payload.x, payload.y, 'dude')
      this.player.anchor.setTo(0.5, 0.5)
      this.player.animations.add('move', [0, 1, 2, 3, 4, 5, 6, 7], 20, true)
      this.player.animations.add('stop', [3], 20, true)

      // This will force it to decelerate and limit its speed
      // this.player.body.drag.setTo(200, 200)
      this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
      this.player.body.maxVelocity.setTo(400, 400)
      this.player.body.collideWorldBounds = true

      // Create some baddies to waste :)

      this.player.bringToTop()

      // this.game.camera.follow(this.player)
      this.game.camera.follow(this.player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
      this.game.camera.deadzone = new Phaser.Rectangle(150, 150, 500, 500)
      this.game.camera.focusOnXY(0, 0)

    } else {

      // console.log(`player: ${this.player.x} ${this.player.y}`)
      // console.log(`payload: ${payload.x} ${payload.y}`)
      if (this.game.physics.arcade.distanceToXY(this.player, payload.x, payload.y) >= 10) {
        this.currentSpeed = 300
        this.newpoint = {
          x: payload.x,
          y: payload.y
        }
        this.game.physics.arcade.moveToXY(this.player, payload.x, payload.y, this.currentSpeed);
        this.player.rotation = this.game.physics.arcade.angleToXY(this.player, payload.x, payload.y)
      }
    }
  }

  onEnemiesStatus(payload) {
    // Avoid possible duplicate players

    // console.log(payload)
    return
    payload.forEach((value, index) => {

      var duplicate = this.playerById(value.id)

      if (duplicate) {
        console.log('Duplicate player!')
        return
      }

      // // Add new player to the remote players array
      this.enemies[0] = new RemotePlayer({
        game: this.game,
        x: value.x,
        y: value.y,
        asset: 'dude',
        name: value.id
      })
      this.game.add.existing(this.enemies[0])
    })
    // console.log(payload[0])

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

    if (this.player !== undefined) {

      for (var i = 0; i < this.enemies.length; i++) {
        if (this.enemies[i].alive) {
          this.enemies[i].update()
          this.game.physics.arcade.collide(this.player, this.enemies[i].player)
        }
      }

      // 鍵盤事件
      // if (this.cursors.left.isDown) {
      //   this.player.angle -= 4
      // } else if (this.cursors.right.isDown) {
      //   this.player.angle += 4
      // }

      // if (this.cursors.up.isDown) {
      //   // The speed we'll travel at
      //   this.currentSpeed = 300
      // } else {
      //   if (this.currentSpeed > 0) {
      //     // this.currentSpeed -= 4
      //   }
      // }

      // 一開始的滑動
      // this.game.physics.arcade.velocityFromRotation(this.player.rotation, this.currentSpeed, this.player.body.velocity)

      // 動畫
      if (this.currentSpeed > 0) {
        this.player.animations.play('move')
      } else {
        this.player.animations.play('stop')
      }

      // 地圖移動
      this.land.tilePosition.x = -this.game.camera.x
      this.land.tilePosition.y = -this.game.camera.y

      // 指標事件
      if (this.game.input.activePointer.isDown) {
        if (this.game.physics.arcade.distanceToPointer(this.player) >= 10) {
          // this.currentSpeed = 300

          // this.newpoint = {
          //   x: this.game.input.worldX,
          //   y: this.game.input.worldY
          // }

          // this.game.physics.arcade.moveToXY(this.player, this.game.input.worldX, this.game.input.worldY, this.currentSpeed);
          // this.player.rotation = this.game.physics.arcade.angleToPointer(this.player)

          console.log(`click x:${this.game.input.worldX}, y:${this.game.input.worldY}`)

          const point = movePositionFix(this.player, {
            x: this.game.input.worldX,
            y: this.game.input.worldY
          })

          /** Move By Mouse */
          // this.game.physics.arcade.moveToXY(this.player, point.x, point.y, 500);

          /** Move By Server */
          // this.client.onPlayerMoving(this.client.master, this.client.player, point.x, point.y)
          this.client.client.send(Message.MovePlayer(this.client.master, this.client.player, point.x, point.y))
        }
      }

      // 停止事件
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
  }

  // Find player by ID
  playerById(id) {
    for (var i = 0; i < this.enemies.length; i++) {
      if (this.enemies[i].name === id) {
        console.log(this.enemies[i].name, id)
        return this.enemies[i]
      }
    }

    return false
  }

}