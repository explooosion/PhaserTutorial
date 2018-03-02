import Phaser from 'phaser'

import BootState from '../src/states/Boot'
import SplashState from '../src/states/Splash'
import GameState from '../src/states/Game'
import MenuState from '../src/states/Menu'

/**
 * 重新繪製視窗大小 
 */
function reszieGame() {
  const docElement = document.documentElement
  const width = docElement.clientWidth
  const height = docElement.clientHeight
  console.log(`Resize Window: ${width}x${height}`)
  this.world.setBounds(0, 0, width, height)
}

/**
 * 更換場景並刪除當前場景
 * @param {object} state 
 * @param {string} next 
 */
function stateChange(state, next) {
  state.remove(state.current)
  let NextState;
  switch (next) {
    case 'Menu':
      NextState = MenuState
      break;
    case 'Game':
      NextState = GameState
      break;
  }
  state.add(next, NextState, true)
}

/**
 * 將物體設置中心點
 * @param {object} objects 
 */
function centerGameObjects(objects) {
  objects.forEach(function (object) {
    object.anchor.setTo(0.5)
  })
}

/**
 * 修正玩家移動軌跡
 * @param {number} oldPoint 
 * @param {number} newPoint 
 */
function movePositionFix(oldPoint, newPoint) {
  const unit = 16 // 根據玩家材質尺寸
  const fixPoint = {
    x: newPoint.x > oldPoint.x ? newPoint.x : newPoint.x,
    y: newPoint.y > oldPoint.y ? newPoint.y : newPoint.y,
  }
  return fixPoint
}

/**
 * 從敵人中找到符合ID的人
 * @param {number} id 
 */
function findPlayerById(id) {
  for (let i = 0; i < this.enemies.length; i++) {
    if (this.enemies[i].clientid === id) {
      return i
    }
  }
  return false
}

export {
  reszieGame,
  stateChange,
  findPlayerById,
  movePositionFix,
  centerGameObjects,
}