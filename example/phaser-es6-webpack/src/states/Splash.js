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
    this.load.tilemap('map', 'assets/map/map.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.image('tiles', 'assets/map/map.png');

    // spriteSheet(key, url, width, height, framemax:-1, margin, spacing)
    this.load.spritesheet('obj', 'assets/map/map.png', 32, 32, -1, 1, 1);
    this.load.image('sky', 'assets/images/sky.png')
    this.load.image('ground', 'assets/images/platform.png')
    this.load.image('star', 'assets/images/star.png')
    this.load.spritesheet('dude', 'assets/images/dude.png', 32, 48)
  }

  create() {
    this.state.start('Game')
  }
}