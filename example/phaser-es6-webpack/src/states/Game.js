/* globals __DEV__ */
import Phaser from 'phaser'
import Sky from '../sprites/Sky'
import Ground from '../sprites/Ground'
import Player from '../sprites/Player'
import Star from '../sprites/Star'
import Wall from '../sprites/Wall'
import Score from '../texts/Score'

// import Tiled from 'phaser-tiled';

export default class extends Phaser.State {
  init() {}
  preload() {}

  create() {

    this.map = this.game.add.tilemap('map')
    this.map.addTilesetImage('tile', 'tiles')
    this.layer = this.map.createLayer('Layer');

    this.layer.resizeWorld()
    // this.layer.wrap = true // repeat

    this.game.physics.startSystem(Phaser.Physics.ARCADE)

    // Add Sky
    this.sky = new Sky({
      game: this.game,
      x: 0,
      y: 0,
      asset: 'sky'
    })
    // this.game.add.existing(this.sky)

    // Add Platforms
    this.ground = new Ground({
      game: this.game,
      x: 0,
      y: this.world.height - 64,
      asset: 'ground'
    })
    this.ground.scale.set(2, 2)

    this.platforms = this.game.add.group()
    this.platforms.enableBody = true;
    this.platforms.add(this.ground)
    this.platforms.add(new Ground({
      game: this.game,
      x: 400,
      y: 400,
      asset: 'ground'
    }))
    this.platforms.add(new Ground({
      game: this.game,
      x: -150,
      y: 250,
      asset: 'ground'
    }))

    // Add Player
    this.player = new Player({
      game: this.game,
      x: 32,
      y: this.world.height - 200,
      asset: 'dude'
    })
    this.game.add.existing(this.player)

    // Add Stars
    this.stars = this.game.add.group()
    this.stars.enableBody = true;
    for (var i = 0; i < 12; i++) {
      this.star = new Star({
        game: this.game,
        x: i * 70,
        y: 0,
        asset: 'star'
      })
      this.stars.add(this.star)
    }

    // Add ScoreText
    this.scoreText = new Score({
      game: this.game,
      x: 16,
      y: 16,
      text: 'score: 0',
      options: {
        fontSize: '32px',
        fill: '#000'
      }
    })
    this.game.add.existing(this.scoreText)

    this.createItems()

    this.cursors = this.game.input.keyboard.createCursorKeys()
    this.game.camera.follow(this.player);
  }

  update() {
    this.game.physics.arcade.collide(this.player, this.items)

    this.game.physics.arcade.collide(this.player, this.platforms)
    this.game.physics.arcade.collide(this.stars, this.platforms)
    this.game.physics.arcade.overlap(this.player, this.stars, this.collectStar, null, this);
  }

  render() {
    if (__DEV__) {
      // this.game.debug.spriteInfo(this.mushroom, 32, 32)
    }
  }

  cursors(e) {
    console.log(e)
  }

  collectStar(player, star) {
    star.kill();

    this.scoreText.score += 10;
    this.scoreText.text = 'Score: ' + this.scoreText.score;
  }

  createItems() {
    this.items = this.game.add.group();
    this.items.enableBody = true;

    this.result = this.findLayersByName('board', this.map, 0);
    this.result.forEach(element => {
      this.createFromTiledObject(element, this.items);
    })
  }
  findLayersByName(name, map, index) {

    let result = [];

    for (let i = 0; i < 80; i++) {
      for (let j = 0; j < 20; j++) {
        // If name is wall then collide
        let obj = this.map.layers[index].data[i][j]
        if (obj.properties.Name === name) {

          // resize item
          obj.y *= map.tileHeight;
          obj.x *= map.tileWidth;
          result.push(obj);
        }

      }
    }
    return result;
  }

  createFromTiledObject(element, group) {

    var wall = new Wall({
      game: this.game,
      x: element.x,
      y: element.y,
      asset: 'obj'
    })

    wall.frame = 45;
    Object.keys(element.properties).forEach(function (key) {
      wall[key] = element.properties[key];
    });

    group.add(wall)
  }
}