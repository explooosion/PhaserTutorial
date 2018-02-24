/* globals __DEV__ */
import Phaser from 'phaser'
import Mushroom from '../sprites/Mushroom'
import Player from '../sprites/Player'

export default class extends Phaser.State {
  init() { }
  preload() { }

  create() {

    // Add Map
    this.map = this.game.add.tilemap('map')
    this.map.addTilesetImage('tileset', 'tiles')
    this.layer = this.map.createLayer('Layer')
    this.layer.resizeWorld()

    this.map.setCollisionBetween(31, 32, true, this.layer)
    this.map.setCollisionBetween(46, 48, true, this.layer)
    // this.layer.debug = true

    // Add Physics
    this.game.physics.startSystem(Phaser.Physics.ARCADE)

    const bannerText = 'Phaser + ES6 + Webpack'
    let banner = this.add.text(this.world.centerX, this.game.height - 80, bannerText, {
      font: '40px Bangers',
      fill: '#77BFA3',
      smoothed: false
    })

    banner.padding.set(10, 16)
    banner.anchor.setTo(0.5)

    this.mushroom = new Mushroom({
      game: this.game,
      x: this.world.centerX,
      y: this.world.centerY,
      asset: 'mushroom'
    })

    // this.game.add.existing(this.mushroom)

    this.player = new Player({
      game: this.game,
      x: 100,
      y: 100,
      asset: 'player'
    })

    this.game.add.existing(this.player)

    // Add Camera
    this.game.camera.follow(this.player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1)

  }

  update() {
    this.game.physics.arcade.collide(this.player, this.layer)
    this.game.physics.arcade.overlap(this.player, this.layer, (player, layer) => {
      console.log(layer.properties.name)
    }, null, this)
  }

  render() {
    if (__DEV__) {
      this.game.debug.spriteInfo(this.mushroom, 32, 32)
    }
  }
}
