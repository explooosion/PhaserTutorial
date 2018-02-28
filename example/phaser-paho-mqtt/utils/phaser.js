/**
 * 將物件移置中心點
 */
function centerGameObjects(objects) {
  objects.forEach(function (object) {
    object.anchor.setTo(0.5)
  })
}

/**
 * 修正玩家移動軌跡
 */
function movePositionFix(oldPoint, newPoint) {
  const unit = 16 // 根據玩家材質尺寸
  const fixPoint = {
    x: newPoint.x > oldPoint.x ? newPoint.x : newPoint.x,
    y: newPoint.y > oldPoint.y ? newPoint.y : newPoint.y,
  }
  return fixPoint
}

export {
  centerGameObjects,
  movePositionFix,
}