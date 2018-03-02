import Client from '../src/paho/Client'
import {
    stateChange,
} from './phaser'

/**
 * 離開遊戲
 * @param {object} state 
 */
function exitGame() {
    console.log('press exit')
    this.client.onDisconnect(false)
    const docElement = document.documentElement
    const width = docElement.clientWidth
    const height = docElement.clientHeight
    this.game.world.setBounds(this.game.world.centerX, this.game.world.centerY, width, height)
    stateChange(this.state, 'Menu')
}

/**
 * Debug 模式
 * @param {object} state 
 */
function debugMode() {
    this.debug = !this.debug
}

export {
    exitGame,
    debugMode
}