/* globals __DEV__ */
import Phaser from 'phaser'
import Mushroom from '../sprites/Mushroom'
import Sky from '../sprites/Sky'
import Ground from '../sprites/Ground'

export default class extends Phaser.State {
  init() {}
  preload() {}

  create() {

    this.game.physics.startSystem(Phaser.Physics.ARCADE)

    this.sky = new Sky({
      game: this.game,
      x: 0,
      y: 0,
      asset: 'sky'
    })

    this.ground = new Ground({
      game: this.game,
      parent: 0,
    })

    this.mushroom = new Mushroom({
      game: this.game,
      x: this.world.centerX,
      y: this.world.centerY,
      asset: 'mushroom',
    })

    this.ground = new Ground({
      game: this.game,
      x: 0,
      y: this.game.world.height - 64,
      asset: 'ground'
    })

    const a = this.game.add.group();
    a.enableBody = true
    a.add(this.ground)
    // this.game.add.existing(this.sky)
    // this.game.add.existing(this.ground)
    // this.game.add.existing(this.mushroom)

  }

  render() {
    if (__DEV__) {
      // this.game.debug.spriteInfo(this.mushroom, 32, 32)
    }
  }

  cursors(e) {
    console.log(e)
  }
}