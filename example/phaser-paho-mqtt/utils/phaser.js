import MapObject from '../src/sprites/MapObject'

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

/**
 * 實體化地圖中的物件 (不再需要了)
 */
function createMapObjects(game, map, group) {
  // group = this.game.add.group()
  group.enableBody = true;

  let result = findLayersByName(false, map, 0);
  result.forEach(element => {
    createFromTiledObject(game, element, group);
  })

  return group
}

/**
 * 尋找地圖中指定屬性
 */
function findLayersByName(bool, map, index) {

  let result = [];

  for (let i = 0; i < 80; i++) {
    for (let j = 0; j < 20; j++) {
      // If name is wall then collide
      let obj = map.layers[index].data[i][j]
      // if (obj.properties.pass === bool) {
      //   // resize item
      //   obj.y *= map.tileHeight;
      //   obj.x *= map.tileWidth;
      //   result.push(obj);
      // }

      // resize item
      obj.y *= map.tileHeight;
      obj.x *= map.tileWidth;
      result.push(obj);

    }
  }
  return result;
}

/**
 * 建立物件
 */
function createFromTiledObject(game, element, group) {

  var mapobj = new MapObject({
    game: game,
    x: element.x,
    y: element.y,
    // asset: 'obj' // 暫不使用 直接做透明的牆壁就可
  })

  // 暫不使用, 直接做透明的牆壁就可
  // wall.frame = 31;
  Object.keys(element.properties).forEach(function (key) {
    mapobj[key] = element.properties[key];
  });

  group.add(mapobj)
}

export {
  centerGameObjects,
  movePositionFix,
  createMapObjects,
}