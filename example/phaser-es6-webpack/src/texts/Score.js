import Phaser from 'phaser'

export default class extends Phaser.Text {
    constructor({
        game,
        x,
        y,
        text,
        options
    }) {
        super(game, x, y, text, options)
        this.score = 0
    }

    update() { }
}