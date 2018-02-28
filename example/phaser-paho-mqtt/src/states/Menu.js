import Phaser from 'phaser'

import {
    stateChange,
} from '../../utils/phaser'

export default class extends Phaser.State {
    init() {
        // this.stage.backgroundColor = '#EDEEC9'
    }
    preload() {
        // this.music = this.game.add.audio('victory')
        /** 0-1 */
        // this.music.volume = 0.5
        // this.music.play()
        /** 靜音 */
        // this.music.mute = true        

    }
    create() {

        // this.video = this.game.add.video('vv')
        // this.sprite = this.video.addToWorld(this.game.world.centerX, this.game.world.centerY, 0.5, 0.5, 2, 2);
        // this.sprite.anchor.set(0.5, 0.5)
        // this.video.play(true)

        // Keep running on losing focus
        this.game.stage.disableVisibilityChange = true

        this.logo = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'menu')
        this.logo.anchor.set(0.5, 0.5)

        this.button = this.game.add.button(this.game.world.centerX, this.game.world.centerY + 200, 'btnStart', this.actionOnClick.bind(this))
        this.button.alpha = 0.4
        this.button.onInputOver.add(this.over, this)
        this.button.onInputOut.add(this.out, this)
        // this.button.onInputUp.add(this.up, this)
        this.button.anchor.set(0.5, 0.5)

        const style = {
            font: 'Microsoft JhengHei',
            fontSize: 65,
            fontWeight: 'bold',
            fill: `#eee`,
            align: `center`,
        };
        this.text = this.add.text(this.game.world.centerX, this.game.world.centerY - 200, `- Nobu Web Client -`, style);
        this.text.anchor.set(0.5, 0.5)
    }
    out() {
        this.button.alpha = 0.4
    }

    over() {
        this.button.alpha = 0.7
    }

    actionOnClick() {
        // console.log('button click')
        // this.music.destroy()  
        stateChange(this.game.state, 'Game')
    }

    render() {
        if (__DEV__) {
            // this.game.debug.soundInfo(this.music, 20, 32);
        }
    }

}