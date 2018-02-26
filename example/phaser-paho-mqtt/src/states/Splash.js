import Phaser from 'phaser'
import {
  centerGameObjects
} from '../utils'

export default class extends Phaser.State {
  init() {}

  preload() {
    this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg')
    this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar')
    centerGameObjects([this.loaderBg, this.loaderBar])

    this.load.setPreloadSprite(this.loaderBar)
    //
    // load your assets
    //

    this.load.tilemap('map', 'assets/map/map-large.json', null, Phaser.Tilemap.TILED_JSON)
    this.load.spritesheet('obj', 'assets/map/map.png', 32, 32, -1, 1, 1)
    this.load.image('tiles', 'assets/map/map.png')

    this.load.image('mushroom', 'assets/images/mushroom2.png')
    this.game.load.image('earth', 'assets/images/scorched_earth.png')
    this.game.load.spritesheet('dude', 'assets/images/dude.png', 64, 64)
    this.game.load.spritesheet('enemy', 'assets/images/dude.png', 64, 64)
  }

  create() {
    this.state.start('Game')
  }
}