import {
  stateChange,
  centerGameObjects
} from '../../utils/phaser'

export default class extends Phaser.State {
  init() {
    this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg')
    this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar')
    centerGameObjects([this.loaderBg, this.loaderBar])
  }

  loadScripts() {}
  loadBgm() {
    // this.load.audio('nobu', 'assets/music/nobu.mp3')
    // this.load.audio('warcraft-Human', 'assets/music/Warcraft 3 Soundtrack Human 2.mp3')
    // this.load.audio('victory', 'assets/music/Two Steps From Hell - Victory.mp3')
    // this.load.video('vv', 'https://www.youtube.com/watch?v=FKFkf2q_iOs')
  }
  loadFonts() {}

  loadMaps() {
    // this.load.tilemap('map', 'assets/map/map-large.json', null, Phaser.Tilemap.TILED_JSON)
  }

  loadImages() {
    // this.load.image('tiles', 'assets/map/map.png')
    this.load.image('marker', 'assets/images/marker.png', 16, 16)
    this.load.image('earth', 'assets/images/scorched_earth.png')
    this.load.image('menu', 'assets/images/menu.png')
    this.load.image('btnStart', 'assets/images/btnStart.png')
  }

  loadSpriteSheet() {
    this.load.spritesheet('obj', 'assets/map/map.png', 32, 32, -1, 1, 1)
    this.load.spritesheet('dude', 'assets/images/dude.png', 64, 64)
    this.load.spritesheet('enemy', 'assets/images/dude.png', 64, 64)
  }

  preload() {
    this.load.setPreloadSprite(this.loaderBar)

    this.loadBgm()
    this.loadMaps()
    this.loadImages()
    this.loadSpriteSheet()
  }

  create() {

    stateChange(this.game.state, 'Menu')
  }

}