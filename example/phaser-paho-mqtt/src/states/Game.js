import Phaser from 'phaser'

import Client from '../paho/Client'
import Message from '../paho/Message';
import RemotePlayer from '../sprites/RemotePlayer'
import Player from '../sprites/Player'
import Marker from '../sprites/Marker'

import _ from 'lodash'

import {
  bulidMessageObjects
} from '../../utils/paho'

import {
  movePositionFix,
} from '../../utils/phaser'

export default class extends Phaser.State {
  init() {
    console.log('ini')
  }
  preload() {
    // this.music = this.game.add.audio('warcraft-Human')
    /** 0-1 */
    // this.music.volume = 0.5
    // this.music.play()
    /** 靜音 */
    // this.music.mute = true
    console.log('preload')
  }

  create() {

    /** Connection */
    const ROOM = window.location.hash === '' ? 'abcdef' : window.location.hash.trim().replace('#', '')
    this.client = new Client(ROOM)
    this.client.onConnect()
    this.client.client.onMessageArrived = this.setTopicHandler.bind(this)

    // Keep running on losing focus
    this.game.stage.disableVisibilityChange = true

    // Resize our game world to be a 2000 x 2000 square
    this.game.world.setBounds(-5000, -5000, 10000, 10000)

    // Our tiled scrolling background
    this.land = this.game.add.tileSprite(0, 0, 1920, 1080, 'earth')
    this.land.fixedToCamera = true

    this.enemies = []

    this.cursors = this.game.input.keyboard.createCursorKeys()

    /** Keyboard */

    const exitKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ESC)
    exitKey.onDown.add(() => {
      console.log('press exit')
      this.client.client.disconnect()
      this.stage.restart()
      // this.state.start('Menu', true, false);
    }, this)

  }

  shutdown() {
    console.log('shutdown')
  }
  render() {
    if (__DEV__) {
      this.game.debug.inputInfo(32, 32)
      if (this.line !== undefined) {
        this.game.debug.geom(this.line);
        this.game.debug.lineInfo(this.line, 32, 150);
      }
    }
  }

  setTopicHandler(receive) {
    this.client.receive = bulidMessageObjects(receive)
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
        /** Client */
        console.log(`client: join success, id ${this.player}`)
        this.client.unsubscribe(`join/${this.master}`)
        this.client.subscribe(`game/${this.master}/${this.player}`)
        /** Server */
        // this.client.subscribe(`game/${this.master}`)
        // this.onBroadcastPlayer(this.master, this.player)
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
      this.player = new Player({
        game: this.game,
        x: payload.x,
        y: payload.y,
        asset: 'dude',
        clientid: this.client.clientid
      })
    }
    this.player.move(payload)
  }

  onEnemiesStatus(payload) {
    if (payload.length === 0) {
      console.log('return func', payload)
      return
    }
    if (this.payOldKey === undefined) {
      this.payOldKey = []
      console.log('reset key', payload)
    }

    let payNewKey = []
    payload.forEach(pay => {
      payNewKey.push(pay.id)
    })

    const Diff = _.difference(payNewKey, this.payOldKey)

    this.payOldKey = payNewKey
    payload.forEach((value, index) => {
      const f = _.find(this.enemies, ['clientid', value.id])

      if (f === undefined) {
        const enemy = new RemotePlayer({
          game: this.game,
          x: value.x,
          y: value.y,
          asset: 'dude',
          clientid: value.id
        })
        this.enemies.push(enemy)
      } else {
        /** Update Player */
        const index = this.playerById(value.id)
        this.enemies[index].move(value)
      }
    })

    /** Delete Remaining Player */

  }

  update() {

    if (this.player !== undefined && this.marker !== undefined) {
      if (this.line === undefined && this.marker.visible === true) {
        this.line = new Phaser.Line(this.player.x, this.player.y, this.marker.x, this.marker.y)
        this.line.fromSprite(this.player, this.marker, false)
      } else {
        this.line = undefined
      }
    }

    if (this.player !== undefined) {

      for (var i = 0; i < this.enemies.length; i++) {
        if (this.enemies[i]) {
          this.game.physics.arcade.collide(this.player, this.enemies[i])
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

      // 地圖移動
      this.land.tilePosition.x = -this.game.camera.x
      this.land.tilePosition.y = -this.game.camera.y

      // 指標事件
      if (this.game.input.activePointer.isDown) {
        if (this.game.physics.arcade.distanceToPointer(this.player) >= 10) {

          // console.log(`click x:${this.game.input.worldX}, y:${this.game.input.worldY}`)

          const point = movePositionFix(this.player, {
            x: this.game.input.worldX,
            y: this.game.input.worldY
          })

          /** Move By Mouse */
          // this.game.physics.arcade.moveToXY(this.player, point.x, point.y, 300);

          if (this.marker !== undefined) {
            this.marker.kill()
          }
          this.marker = new Marker({
            game: this.game,
            x: point.x,
            y: point.y,
            asset: 'marker'
          })
          /** Move By Server */
          this.client.client.send(Message.MovePlayer(this.client.master, this.client.player, point.x, point.y))
        }
      }
    }
  }

  // Find player by ID
  playerById(id) {
    for (let i = 0; i < this.enemies.length; i++) {
      if (this.enemies[i].clientid === id) {
        return i
      }
    }
    return false
  }

}