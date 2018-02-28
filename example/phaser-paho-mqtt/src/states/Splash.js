import Phaser from 'phaser'
import {
  centerGameObjects
} from '../utils'

export default class extends Phaser.State {
  init() {
    this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg')
    this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar')
    centerGameObjects([this.loaderBg, this.loaderBar])
  }

  loadScripts() {}
  loadBgm() {}
  loadFonts() {}

  loadMaps() {
    this.load.tilemap('map', 'assets/map/map-large.json', null, Phaser.Tilemap.TILED_JSON)
  }

  loadImages() {
    this.load.image('tiles', 'assets/map/map.png')
    this.load.image('marker', 'assets/images/marker.png', 16, 16)
    this.load.image('earth', 'assets/images/scorched_earth.png')
  }

  loadSpriteSheet() {
    this.load.spritesheet('obj', 'assets/map/map.png', 32, 32, -1, 1, 1)
    this.load.spritesheet('dude', 'assets/images/dude.png', 64, 64)
    this.load.spritesheet('enemy', 'assets/images/dude.png', 64, 64)
  }

  preload() {
    this.load.setPreloadSprite(this.loaderBar)

    this.loadMaps()
    this.loadImages()
    this.loadSpriteSheet()
  }

  create() {
    this.state.start('Game')
  }
}