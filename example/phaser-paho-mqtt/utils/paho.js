import Paho from 'paho-mqtt'

/**
 * 重新組合訊息內容(修正原paho-mqtt錯誤)
 */
function bulidMessageObjects(message) {
    let result = message.input ? new Paho.Message(message.input) : message
    Object.keys(message).forEach(key => {
        if (key !== 'input') {
            result[key] = message[key]
        }
    });
    // Add JSON payload to message
    result.payload = result._getPayloadString() ? JSON.parse(result._getPayloadString()) : ''
    return result
}

export {
    bulidMessageObjects
}