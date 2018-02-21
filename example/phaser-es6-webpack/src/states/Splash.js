import Phaser from 'phaser'
import {
  centerGameObjects
} from '../utils'

export default class extends Phaser.State {
  init() { }

  preload() {
    this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg')
    this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar')
    centerGameObjects([this.loaderBg, this.loaderBar])

    this.load.setPreloadSprite(this.loaderBar)
    //
    // load your assets
    //
    this.load.tilemap('desert', 'assets/map/desert.json', null, Phaser.Tilemap.TILED_JSON)
    this.load.image('sky', 'assets/images/sky.png')
    this.load.image('ground', 'assets/images/platform.png')
    this.load.image('star', 'assets/images/star.png')
    this.load.image('tiles', 'assets/map/tmw_desert_spacing.png')
    this.load.spritesheet('dude', 'assets/images/dude.png', 32, 48)

  }

  create() {
    this.state.start('Game')
  }
}